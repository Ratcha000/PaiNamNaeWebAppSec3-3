const prisma = require('../utils/prisma');
const ApiError = require('../utils/ApiError');

// ตรวจสอบเลขบัตรถูกแบนไหม
const checkBlacklistedNationalId = async (nationalIdNumber) => {
  if (!nationalIdNumber) return null;
  
  const blacklisted = await prisma.blacklistedNationalId.findUnique({
    where: { nationalIdNumber },
    include: { admin: { select: { id: true, username: true } } }
  });
  return blacklisted;
};

// เพิ่มเลขบัตรเข้าบัญชีดำ
const blacklistNationalId = async (nationalIdNumber, adminId, { reason, severity = 'warning' } = {}) => {
  if (!nationalIdNumber) throw new ApiError(400, 'กรุณาระบุเลขบัตรประชาชน');

  const existing = await prisma.blacklistedNationalId.findUnique({
    where: { nationalIdNumber }
  });
  if (existing) throw new ApiError(400, 'เลขบัตร ปชช นี้อยู่ในบัญชีดำแล้ว');

  const admin = await prisma.user.findUnique({ where: { id: adminId } });
  if (!admin) throw new ApiError(404, 'ไม่พบแอดมิน');

  return prisma.blacklistedNationalId.create({
    data: {
      nationalIdNumber,
      reason,
      severity,
      adminId
    },
    include: { admin: { select: { id: true, username: true, email: true } } }
  });
};

// ดึงรายการบัญชีดำ (pagination)
const getBlacklistedNationalIds = async ({ page = 1, limit = 10 } = {}) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    prisma.blacklistedNationalId.findMany({
      skip,
      take: parseInt(limit),
      include: { admin: { select: { id: true, username: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.blacklistedNationalId.count()
  ]);

  return {
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

// ลบเลขบัตรออกจากบัญชีดำ (ยกเลิกแบน)
const removeBlacklistedNationalId = async (nationalIdNumber) => {
  if (!nationalIdNumber) throw new ApiError(400, 'กรุณาระบุเลขบัตรประชาชน');

  const blacklisted = await prisma.blacklistedNationalId.findUnique({
    where: { nationalIdNumber }
  });
  if (!blacklisted) throw new ApiError(404, 'ไม่พบวิทยาการนี้ในบัญชีดำ');

  await prisma.blacklistedNationalId.delete({ 
    where: { nationalIdNumber }
  });

  return { success: true, message: 'ยกเลิกการแบนแล้ว' };
};

module.exports = {
  checkBlacklistedNationalId,
  blacklistNationalId,
  getBlacklistedNationalIds,
  removeBlacklistedNationalId
};