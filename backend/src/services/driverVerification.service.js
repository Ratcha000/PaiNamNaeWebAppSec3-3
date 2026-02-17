const prisma = require('../utils/prisma');

const searchVerifications = async (opts = {}) => {
  const {
    page = 1,
    limit = 20,
    q,
    status,
    typeOnLicense,
    createdFrom, createdTo,
    issueFrom, issueTo,
    expiryFrom, expiryTo,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = opts;

  const where = {
    ...(status && { status }),
    ...(typeOnLicense && { typeOnLicense }),
    ...((createdFrom || createdTo) ? {
      createdAt: {
        ...(createdFrom ? { gte: new Date(createdFrom) } : {}),
        ...(createdTo ? { lte: new Date(createdTo) } : {}),
      }
    } : {}),
    ...((issueFrom || issueTo) ? {
      licenseIssueDate: {
        ...(issueFrom ? { gte: new Date(issueFrom) } : {}),
        ...(issueTo ? { lte: new Date(issueTo) } : {}),
      }
    } : {}),
    ...((expiryFrom || expiryTo) ? {
      licenseExpiryDate: {
        ...(expiryFrom ? { gte: new Date(expiryFrom) } : {}),
        ...(expiryTo ? { lte: new Date(expiryTo) } : {}),
      }
    } : {}),
    ...(q ? {
      OR: [
        { licenseNumber: { contains: q, mode: 'insensitive' } },
        {
          user: {
            is: {
              OR: [
                { email: { contains: q, mode: 'insensitive' } },
                { username: { contains: q, mode: 'insensitive' } },
                { firstName: { contains: q, mode: 'insensitive' } },
                { lastName: { contains: q, mode: 'insensitive' } },
                { phoneNumber: { contains: q, mode: 'insensitive' } },
              ]
            }
          }
        }
      ]
    } : {}),
  };

  const skip = (page - 1) * limit;
  const take = limit;

  const [total, data] = await prisma.$transaction([
    prisma.driverVerification.count({ where }),
    prisma.driverVerification.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip, take,
      include: {
        user: {
          select: {
            id: true, email: true, username: true,
            firstName: true, lastName: true, phoneNumber: true,
            role: true, isVerified: true, isActive: true,
          }
        }
      }
    })
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    }
  };
};

const getVerificationByUser = async (userId) => {
  return prisma.driverVerification.findUnique({
    where: { userId },
    include: { user: true },
  });
};

const getAllVerifications = async () => {
  return prisma.driverVerification.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  });
};

const getVerificationById = async (id) => {
  return prisma.driverVerification.findUnique({
    where: { id },
    include: { user: true },
  });
};

const createVerification = async (data) => {
  const existing = await getVerificationByUser(data.userId)
  if (existing) {
    return updateVerification(existing.id, data)
  }

  return prisma.$transaction(async (tx) => {
    const newRec = await tx.driverVerification.create({ data });
    await tx.user.update({
      where: { id: data.userId },
      data: { role: 'DRIVER' },
    });
    return newRec;
  });
};

const updateVerification = async (id, data) => {
  const updatePayload = {
    ...data,
    status: 'PENDING'
  };
  return prisma.driverVerification.update({
    where: { id },
    data: updatePayload,
  });

};

const updateVerificationByAdmin = async (id, data) => {
  return prisma.driverVerification.update({
    where: { id },
    data,
    include: { user: true },
  });
};

const deleteVerificationByAdmin = async (id) => {
  return prisma.$transaction(async (tx) => {
    // หา record ก่อน ถ้าไม่เจอ ให้รีเทิร์น null ไปให้ controller ตัดสินใจ 404
    const existing = await tx.driverVerification.findUnique({ where: { id } });
    if (!existing) return null;

    // ย้อนสถานะ user ให้กลับเป็นผู้โดยสารและไม่ verified
    await tx.user.update({
      where: { id: existing.userId },
      data: { role: 'PASSENGER', isVerified: false },
    });

    // ยกเลิก route ที่ยัง AVAILABLE ของ user นี้ (ถ้ามี)
    await tx.route.updateMany({
      where: { driverId: existing.userId, status: 'AVAILABLE' },
      data: { status: 'CANCELLED' },
    });

    // ลบ verification record
    await tx.driverVerification.delete({ where: { id } });

    return true;
  });
};

const updateVerificationStatus = async (id, status) => {
  return prisma.$transaction(async (tx) => {
    const verification = await tx.driverVerification.update({
      where: { id },
      data: { status },
    });
    if (status === 'APPROVED') {
      await tx.user.update({
        where: { id: verification.userId },
        data: { isVerified: true, role: 'DRIVER' },
      });
    }
    else if (status === 'REJECTED') {
      await tx.user.update({
        where: { id: verification.userId },
        data: {
          role: 'PASSENGER',
          isVerified: false,
        },
      });

      await tx.route.updateMany({
        where: {
          driverId: verification.userId,
          status: 'AVAILABLE',
        },
        data: {
          status: 'CANCELLED',
        },
      });
    }
    return verification;
  });
};

const canCreateRoutes = async (userId) => {
  const rec = await prisma.driverVerification.findUnique({
    where: { userId },
    select: { status: true },
  });
  return rec?.status === 'APPROVED' || rec?.status === 'PENDING';
};

const createVerificationByAdmin = async (data) => {
  const existing = await getVerificationByUser(data.userId);
  if (existing) {
    return updateVerificationByAdmin(existing.id, data);
  }

  return prisma.$transaction(async (tx) => {
    const newRec = await tx.driverVerification.create({ data });
    await tx.user.update({
      where: { id: data.userId },
      data: { role: 'DRIVER' },
    });
    return newRec;
  });
};

module.exports = {
  searchVerifications,
  getVerificationByUser,
  getAllVerifications,
  getVerificationById,
  createVerification,
  updateVerification,
  updateVerificationStatus,
  canCreateRoutes,
  updateVerificationByAdmin,
  createVerificationByAdmin,
  deleteVerificationByAdmin,
};
