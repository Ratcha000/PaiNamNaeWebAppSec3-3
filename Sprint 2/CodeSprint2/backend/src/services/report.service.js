const prisma = require('../utils/prisma');
const ApiError = require('../utils/ApiError');
const notifService = require('./notification.service');

const submitReport = async (reporterId, { reportedUserId, category, description }) => {
  const reportedUser = await prisma.user.findUnique({ where: { id: reportedUserId } });
  if (!reportedUser) throw new ApiError(404, 'ไม่พบผู้ใช้ที่ระบุ');
  if (reporterId === reportedUserId) throw new ApiError(400, 'ไม่สามารถรายงานตัวเอง');
  return prisma.report.create({ data: { reporterId, reportedUserId, category, description } });
};

const listReports = async ({ page = 1, limit = 10, status = 'pending', severity, sortBy = 'createdAt', sortOrder = 'desc' }) => {
  const skip = (page - 1) * limit;
  const where = {};
  if (status) where.status = status;
  if (severity) where.severity = severity;
  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where, skip, take: parseInt(limit), orderBy: { [sortBy]: sortOrder },
      include: { reporter: true, reportedUser: true, admin: true }
    }),
    prisma.report.count({ where })
  ]);
  return { data: reports, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } };
};

const getReportDetail = async (reportId) => {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    include: { reporter: true, reportedUser: true, admin: true }
  });
  if (!report) throw new ApiError(404, 'ไม่พบรายงาน');
  return report;
};

const reviewReport = async (reportId, adminId, { severity, adminNote }) => {
  const blacklistService = require('./blacklist.service');
  const report = await prisma.report.findUnique({ 
    where: { id: reportId },
    include: { reportedUser: true }
  });
  if (!report) throw new ApiError(404, 'ไม่พบรายงาน');
  
  const updatedReport = await prisma.report.update({
    where: { id: reportId },
    data: { status: 'reviewed', severity, adminId, adminNote, resolvedAt: new Date() }
  });

  if (severity === 'warning') {
    // ⚠️ ส่งข้อความเตือน
    await notifService.createNotificationByAdmin({
      userId: report.reportedUserId,
      type: 'REPORT_WARNING',
      title: '⚠️ ได้รับข้อความเตือน',
      body: adminNote || 'คุณได้รับการเตือนจากระบบ',
      relatedId: reportId
    });
  } else if (severity === 'blacklist') {
    // 🚫 แบนบัญชี
    
    // เพิ่มเลขบัตรเข้าบัญชีดำ
    await blacklistService.blacklistNationalId(
      report.reportedUser.nationalIdNumber,
      adminId,
      { reason: adminNote, severity: 'blacklist' }
    );

    // ปิดใช้งานบัญชี
    await prisma.user.update({
      where: { id: report.reportedUserId },
      data: {
        isBlacklisted: true,
        blacklistReason: adminNote,
        blacklistedAt: new Date()
      }
    });

    // ส่งแจ้งเตือนบัญชีแบน
    await notifService.createNotificationByAdmin({
      userId: report.reportedUserId,
      type: 'ACCOUNT_BANNED',
      title: '❌ บัญชีของคุณถูกแบน',
      body: `เหตุผล: ${adminNote || 'ไม่มีการระบุเหตุผล'}`,
      relatedId: reportId
    });
  }

  return updatedReport;
};

const sendWarningMessage = async (reportId, adminId, { subject, message }) => {
  const report = await prisma.report.findUnique({ where: { id: reportId } });
  if (!report) throw new ApiError(404, 'ไม่พบรายงาน');
  await notifService.createNotificationByAdmin({
    userId: report.reportedUserId,
    type: 'REPORT_WARNING',
    title: subject,
    body: message, 
    relatedId: reportId
  });
  return prisma.report.update({ where: { id: reportId }, data: { status: 'resolved', adminId } });
};

const getBlacklistedUsers = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const [blacklistedUsers, total] = await Promise.all([
    prisma.user.findMany({
      where: { isBlacklisted: true },
      skip, take: parseInt(limit),
      select: { id: true, username: true, firstName: true, lastName: true, email: true, nationalId: true, blacklistReason: true, blacklistedAt: true },
      orderBy: { blacklistedAt: 'desc' }
    }),
    prisma.user.count({ where: { isBlacklisted: true } })
  ]);
  return { data: blacklistedUsers, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } };
};

const removeBlacklist = async (userId) => {
  return prisma.user.update({
    where: { id: userId },
    data: { isBlacklisted: false, blacklistReason: null, blacklistedAt: null }
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