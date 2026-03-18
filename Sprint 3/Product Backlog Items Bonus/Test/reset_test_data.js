/**
 * Reset Test Data for Payment UAT Tests
 * 
 * วิธีใช้: node reset_test_data.js
 * รันจาก folder tests/ หรือที่ไหนก็ได้
 * 
 * สิ่งที่ script ทำ:
 * 1. Reset payments ของ testro2 กลับเป็น pending
 * 2. สร้าง/อัปเดต DriverProfile สำหรับ testro1 (QR Code + Bank Info)
 * 3. ตรวจสอบว่ามี booking + payment พร้อมรันเทส
 */

const path = require('path');

// Load .env from backend
const backendDir = path.join(__dirname, '..', 'backend');
require(path.join(backendDir, 'node_modules', 'dotenv')).config({ path: path.join(backendDir, '.env') });

const { PrismaClient } = require(path.join(backendDir, 'node_modules', '@prisma/client'));
const prisma = new PrismaClient();

async function main() {
  console.log('='.repeat(60));
  console.log('  Payment UAT - Reset Test Data');
  console.log('='.repeat(60));

  // ==========================================
  // Step 1: หาผู้ใช้ testro1 (driver) และ testro2 (passenger)
  // ==========================================
  console.log('\n[1] Finding test users...');

  const driver = await prisma.user.findUnique({ where: { username: 'testro1' } });
  const passenger = await prisma.user.findUnique({ where: { username: 'testro2' } });

  if (!driver) {
    console.error('  ❌ Driver testro1 not found!');
    process.exit(1);
  }
  if (!passenger) {
    console.error('  ❌ Passenger testro2 not found!');
    process.exit(1);
  }

  console.log(`  ✅ Driver: ${driver.firstName} ${driver.lastName} (${driver.id})`);
  console.log(`  ✅ Passenger: ${passenger.firstName} ${passenger.lastName} (${passenger.id})`);

  // ==========================================
  // Step 2: ตั้งค่า DriverProfile (QR Code + Bank Info)
  // ==========================================
  console.log('\n[2] Setting up Driver Profile (QR Code + Bank Info)...');

  const qrCodeUrl = 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg';
  const bankInfo = {
    bankName: 'ธนาคารกสิกรไทย (KBank)',
    accountNumber: '123-4-56789-0',
    accountName: `${driver.firstName} ${driver.lastName}`
  };

  const existingProfile = await prisma.driverProfile.findUnique({
    where: { userId: driver.id }
  });

  if (existingProfile) {
    await prisma.driverProfile.update({
      where: { userId: driver.id },
      data: {
        paymentMethod: 'promptpay',
        qrCodeUrl: qrCodeUrl,
        bankInfo: bankInfo
      }
    });
    console.log('  ✅ Updated existing DriverProfile');
  } else {
    await prisma.driverProfile.create({
      data: {
        userId: driver.id,
        paymentMethod: 'promptpay',
        qrCodeUrl: qrCodeUrl,
        bankInfo: bankInfo
      }
    });
    console.log('  ✅ Created new DriverProfile');
  }

  console.log(`     QR Code URL: ${qrCodeUrl.substring(0, 50)}...`);
  console.log(`     Bank: ${bankInfo.bankName}`);
  console.log(`     Account: ${bankInfo.accountNumber}`);

  // ==========================================
  // Step 3: ดูรายการ payments ของ passenger
  // ==========================================
  console.log('\n[3] Checking payments for passenger...');

  const allPayments = await prisma.payment.findMany({
    where: { passengerId: passenger.id },
    include: {
      booking: { include: { route: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  console.log(`  Found ${allPayments.length} payment(s)`);
  for (const p of allPayments) {
    console.log(`  - ${p.id.substring(0, 12)}... status=${p.status} verify=${p.verificationStatus} amount=${p.amount}`);
  }

  // ==========================================
  // Step 4: Reset payments กลับเป็น pending
  // ==========================================
  console.log('\n[4] Resetting payments to pending...');

  const nonPending = allPayments.filter(p => p.status !== 'pending');

  if (nonPending.length === 0 && allPayments.length > 0) {
    console.log('  ℹ️ All payments are already pending');
  } else if (allPayments.length === 0) {
    console.log('  ⚠️ No payments found - checking for bookings...');

    // ตรวจหา CONFIRMED bookings ที่ยังไม่มี payment
    const confirmedBookings = await prisma.booking.findMany({
      where: {
        passengerId: passenger.id,
        status: 'CONFIRMED'
      },
      include: { route: true, payments: true }
    });

    console.log(`  Found ${confirmedBookings.length} CONFIRMED booking(s)`);

    for (const booking of confirmedBookings) {
      if (booking.payments.length === 0) {
        const amount = (booking.numberOfSeats || 1) * (booking.route?.pricePerSeat || 0);
        const newPayment = await prisma.payment.create({
          data: {
            bookingId: booking.id,
            driverId: booking.route.driverId,
            passengerId: passenger.id,
            amount: amount,
            status: 'pending',
            verificationStatus: 'pending'
          }
        });
        console.log(`  ✅ Created payment ${newPayment.id.substring(0, 12)}... amount=${amount}`);
      }
    }
  } else {
    // Reset existing payments to pending
    for (const p of nonPending) {
      await prisma.payment.update({
        where: { id: p.id },
        data: {
          status: 'pending',
          paymentMethod: null,
          verificationStatus: 'pending',
          verificationNote: null,
          verifiedAt: null,
          submittedAt: null,
          receiptImageUrl: null,
          ocrData: null
        }
      });
      console.log(`  ✅ Reset ${p.id.substring(0, 12)}... → pending`);
    }
  }

  // ==========================================
  // Step 5: ตรวจสอบผลลัพธ์
  // ==========================================
  console.log('\n[5] Verifying reset...');

  const finalPayments = await prisma.payment.findMany({
    where: { passengerId: passenger.id },
    orderBy: { createdAt: 'desc' }
  });

  const pendingCount = finalPayments.filter(p => p.status === 'pending').length;
  console.log(`  Total: ${finalPayments.length} payment(s), ${pendingCount} pending`);

  for (const p of finalPayments) {
    console.log(`  - ${p.id.substring(0, 12)}... status=${p.status} verify=${p.verificationStatus} method=${p.paymentMethod || 'none'}`);
  }

  // ==========================================
  // Step 6: ตรวจสอบ DriverProfile
  // ==========================================
  console.log('\n[6] Verifying Driver Profile...');

  const finalProfile = await prisma.driverProfile.findUnique({
    where: { userId: driver.id }
  });

  if (finalProfile) {
    console.log(`  ✅ QR Code: ${finalProfile.qrCodeUrl ? 'SET' : '❌ NOT SET'}`);
    console.log(`  ✅ Bank Info: ${finalProfile.bankInfo ? 'SET' : '❌ NOT SET'}`);
    console.log(`  ✅ Payment Method: ${finalProfile.paymentMethod || 'NOT SET'}`);
  } else {
    console.log('  ❌ No DriverProfile found!');
  }

  console.log('\n' + '='.repeat(60));
  if (pendingCount > 0 && finalProfile?.qrCodeUrl && finalProfile?.bankInfo) {
    console.log('  ✅ READY! มี pending payments และ Driver Profile ครบ');
    console.log('  💡 รันเทส: robot --outputdir results --loglevel DEBUG payment/');
  } else {
    console.log('  ⚠️ WARNING: อาจยังไม่พร้อมรันเทส');
    if (pendingCount === 0) console.log('     - ไม่มี pending payments');
    if (!finalProfile?.qrCodeUrl) console.log('     - ไม่มี QR Code');
    if (!finalProfile?.bankInfo) console.log('     - ไม่มี Bank Info');
  }
  console.log('='.repeat(60));
}

main()
  .catch(err => {
    console.error('\n❌ Error:', err.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
