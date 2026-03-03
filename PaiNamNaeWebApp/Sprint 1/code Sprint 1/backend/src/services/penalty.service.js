const prisma = require("../utils/prisma");

const PASSENGER_CANCEL_LIMIT = 3; // ≥ 3 ครั้งใน 30 วัน
const DRIVER_CANCEL_LIMIT = 2;
const WINDOW_DAYS = 30;
const SUSPEND_DAYS = 7;

function addDays(date, days) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

async function checkAndApplyPassengerSuspension(passengerId, opts = {}) {
  const since = new Date(Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000);

  let cancelCount;

  if (opts.confirmedOnly) {
    //นับเฉพาะ "การยกเลิกหลังจากเคย CONFIRMED"
    // อ้างอิงจาก Notification ที่บันทึกไว้ตอน cancel
    cancelCount = await prisma.notification.count({
      where: {
        userId: passengerId,
        type: "SYSTEM",
        createdAt: { gte: since },
        // Prisma JSON filter (PostgreSQL): ต้องใช้ Prisma 5 ขึ้นไป
        metadata: {
          // path -> ค่าในคีย์ JSON
          path: ["kind"],
          equals: "PASSENGER_CONFIRMED_CANCEL",
        },
      },
    });
  } else {
    // พฤติกรรมเดิม (ไม่ใช้ใน flow ใหม่ แต่เก็บไว้เผื่อที่อื่นเรียก)
    cancelCount = await prisma.booking.count({
      where: {
        passengerId,
        status: "CANCELLED",
        cancelledBy: "PASSENGER",
        cancelledAt: { gte: since },
      },
    });
  }

  if (cancelCount >= PASSENGER_CANCEL_LIMIT) {
    const until = addDays(new Date(), SUSPEND_DAYS);
    await prisma.user.update({
      where: { id: passengerId },
      data: { passengerSuspendedUntil: until },
    });

    try {
      await prisma.notification.create({
        data: {
          userId: passengerId,
          type: "SYSTEM",
          title: "ระงับสิทธิ์การจองชั่วคราว",
          body: `คุณถูกระงับสิทธิ์การจอง ${SUSPEND_DAYS} วัน เนื่องจากยกเลิกการจองที่อนุมัติแล้ว ${PASSENGER_CANCEL_LIMIT} ครั้ง ภายใน ${WINDOW_DAYS} วัน`,
          metadata: {
            kind: "PASSENGER_SUSPENSION",
            windowDays: WINDOW_DAYS,
            suspendDays: SUSPEND_DAYS,
          },
        },
      });
    } catch (_) { }
  }
}

async function checkAndApplyDriverSuspension(driverId, opts = {}) {
  const { confirmedOnly = false } = opts;
  const since = new Date(Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000);

  // นับจำนวนเส้นทางที่ถูกยกเลิกโดยไดรเวอร์ในช่วงเวลา
  const cancelCount = await prisma.route.count({
    where: {
      driverId,
      status: "CANCELLED",
      cancelledBy: "DRIVER",
      cancelledAt: { gte: since },
    },
  });

  // ใช้เกณฑ์พื้นฐานเดียวกับค่าคงที่เดิม (คุณตั้งไว้ที่ไฟล์นี้)
  // ถ้าต้องการเข้มงวดขึ้นเมื่อเป็น confirmedOnly ให้ปรับเกณฑ์ที่ service ผู้เรียกก็ได้
  if (cancelCount >= DRIVER_CANCEL_LIMIT) {
    const until = addDays(new Date(), SUSPEND_DAYS);
    await prisma.user.update({
      where: { id: driverId },
      data: { driverSuspendedUntil: until },
    });

    try {
      await prisma.notification.create({
        data: {
          userId: driverId,
          type: "SYSTEM",
          title: "ระงับสิทธิ์ผู้ขับขี่ชั่วคราว",
          body: `บัญชีผู้ขับขี่ของคุณถูกระงับ ${SUSPEND_DAYS} วัน เนื่องจากยกเลิกเส้นทาง ${DRIVER_CANCEL_LIMIT} ครั้ง ภายใน ${WINDOW_DAYS} วัน`,
          metadata: {
            kind: "DRIVER_SUSPENSION",
            windowDays: WINDOW_DAYS,
            suspendDays: SUSPEND_DAYS,
            confirmedOnly,
          },
        },
      });
    } catch (_) { }
  }
}

module.exports = {
  checkAndApplyPassengerSuspension,
  checkAndApplyDriverSuspension
};
