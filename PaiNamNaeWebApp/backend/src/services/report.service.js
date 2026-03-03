const prisma = require('../utils/prisma');
const ApiError = require('../utils/ApiError');
const notifService = require('./notification.service');

/* =========================
   SUBMIT REPORT
========================= */
const submitReport = async (reporterId, { reportedUserId, category, description }) => {
  const reportedUser = await prisma.user.findUnique({
    where: { id: reportedUserId }
  });

  if (!reportedUser) throw new ApiError(404, 'ไม่พบผู้ใช้ที่ระบุ');
  if (reporterId === reportedUserId) throw new ApiError(400, 'ไม่สามารถรายงานตัวเอง');

  const report = await prisma.report.create({
    data: {
      reporterId,
      reportedUserId,
      category,
      description
    }
  });

  await notifService.createNotificationByAdmin({
    userId: reportedUserId,
    type: 'SYSTEM',
    title: 'คุณถูกรายงาน',
    body: `คุณถูกรายงานในหมวดหมู่ "${category}" กรุณาตรวจสอบพฤติกรรมของคุณ`,
    relatedId: report.id
  });

  return report;
};


/* =========================
   LIST REPORTS
========================= */
const listReports = async ({
  page = 1,
  limit = 10,
  status = 'pending',
  severity,
  sortBy = 'createdAt',
  sortOrder = 'desc'
}) => {
  const skip = (page - 1) * limit;
  const where = {};

  if (status) where.status = status;
  if (severity) where.severity = severity;

  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where,
      skip,
      take: parseInt(limit),
      orderBy: { [sortBy]: sortOrder },
      include: {
        reporter: true,
        reportedUser: true,
        admin: true
      }
    }),
    prisma.report.count({ where })
  ]);

  return {
    data: reports,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  };
};


/* =========================
   GET REPORT DETAIL
========================= */
const getReportDetail = async (reportId) => {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    include: {
      reporter: true,
      reportedUser: true,
      admin: true
    }
  });

  if (!report) throw new ApiError(404, 'ไม่พบรายงาน');
  return report;
};


/* =========================
   REVIEW REPORT
========================= */
const reviewReport = async (reportId, adminId, { severity, adminNote }) => {
  const report = await prisma.report.findUnique({
    where: { id: reportId }
  });

  if (!report) throw new ApiError(404, 'ไม่พบรายงาน');

  const updatedReport = await prisma.report.update({
    where: { id: reportId },
    data: {
      status: 'reviewed',
      severity,
      adminId,
      adminNote,
      resolvedAt: new Date()
    }
  });

  /* =========================
     BLACKLIST CASE
  ========================= */
  if (severity === 'blacklist') {

    await prisma.user.update({
  where: { id: report.reportedUserId },
  data: {
    isBlacklisted: true,
    blacklistReason: adminNote || 'ละเมิดกฎการใช้งาน',
    blacklistedAt: new Date()
  }
});


    await notifService.createNotificationByAdmin({
      userId: report.reportedUserId,
      type: 'ACCOUNT_BANNED',
      title: 'บัญชีของคุณถูกระงับ',
      body: `บัญชีของคุณถูกระงับ: ${adminNote || 'ไม่มีการระบุเหตุผล'}`,
      relatedId: reportId
    });
  }

  /* =========================
     WARNING CASE
  ========================= */
  if (severity === 'warning') {
    await notifService.createNotificationByAdmin({
      userId: report.reportedUserId,
      type: 'REPORT_WARNING',
      title: 'คุณได้รับการเตือน',
      body: adminNote || 'คุณได้รับการเตือนจากการถูกรายงาน',
      link: '/notifications',
      metadata: {
        kind: 'report_warning',
        reportId
      },
      relatedId: reportId
    });
  }

  return updatedReport;
};


/* =========================
   SEND WARNING MESSAGE
========================= */
const sendWarningMessage = async (reportId, adminId, { subject, message }) => {
  const report = await prisma.report.findUnique({
    where: { id: reportId }
  });

  if (!report) throw new ApiError(404, 'ไม่พบรายงาน');

  await notifService.createNotificationByAdmin({
    userId: report.reportedUserId,
    type: 'REPORT_WARNING',
    title: subject,
    body: message,
    relatedId: reportId
  });

  return prisma.report.update({
    where: { id: reportId },
    data: { status: 'resolved', adminId }
  });
};


/* =========================
   BLACKLISTED USERS
========================= */
const getBlacklistedUsers = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const [blacklistedUsers, total] = await Promise.all([
    prisma.user.findMany({
      where: { isBlacklisted: true },
      skip,
      take: parseInt(limit),
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        nationalIdNumber: true,
        blacklistReason: true,
        blacklistedAt: true
      },
      orderBy: { blacklistedAt: 'desc' }
    }),
    prisma.user.count({ where: { isBlacklisted: true } })
  ]);

  return {
    data: blacklistedUsers,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  };
};


/* =========================
   REMOVE BLACKLIST
========================= */
const removeBlacklist = async (userId) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      isBlacklisted: false,
      blacklistReason: null,
      blacklistedAt: null,
      tokenVersion: { increment: 1 } // 🔥 บังคับ logout อีกครั้ง
    }
  });
};


module.exports = {
  submitReport,
  listReports,
  getReportDetail,
  reviewReport,
  sendWarningMessage,
  getBlacklistedUsers,
  removeBlacklist
};
