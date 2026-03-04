const asyncHandler = require('express-async-handler');
const reportService = require('../services/report.service');

const submitReport = asyncHandler(async (req, res) => {
  const result = await reportService.submitReport(req.user.sub, req.body);
  res.status(201).json({ success: true, message: 'ส่งรายงานสำเร็จ', data: result });
});

const listReports = asyncHandler(async (req, res) => {
  const result = await reportService.listReports(req.query);
  res.status(200).json({ success: true, message: 'ดึงข้อมูลรายงานสำเร็จ', ...result });
});

const getReportDetail = asyncHandler(async (req, res) => {
  const data = await reportService.getReportDetail(req.params.reportId);
  res.status(200).json({ success: true, message: 'ดึงข้อมูลรายงานสำเร็จ', data });
});

const reviewReport = asyncHandler(async (req, res) => {
  const { reportId } = req.params;
  const { severity, adminNote } = req.body;
  const result = await reportService.reviewReport(reportId, req.user.sub, { severity, adminNote });
  res.status(200).json({ success: true, message: 'รีวิวรายงานสำเร็จ', data: result });
});

const sendWarningMessage = asyncHandler(async (req, res) => {
  const result = await reportService.sendWarningMessage(req.params.reportId, req.user.sub, req.body);
  res.status(200).json({ success: true, message: 'ส่งข้อความเตือนสำเร็จ', data: result });
});

const getBlacklistedUsers = asyncHandler(async (req, res) => {
  const result = await reportService.getBlacklistedUsers(req.query);
  res.status(200).json({ success: true, message: 'ดึงข้อมูลผู้ใช้ที่ถูกแบนสำเร็จ', ...result });
});

const removeBlacklist = asyncHandler(async (req, res) => {
  const data = await reportService.removeBlacklist(req.params.userId);
  res.status(200).json({ success: true, message: 'ยกเลิกการแบนสำเร็จ', data });
});

module.exports = {
  submitReport,
  listReports,
  getReportDetail,
  reviewReport,
  sendWarningMessage,
  getBlacklistedUsers,
  removeBlacklist
};