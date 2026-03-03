const asyncHandler = require("express-async-handler");
const verifService = require("../services/driverVerification.service");
const ApiError = require("../utils/ApiError");
const { uploadToCloudinary } = require("../utils/cloudinary");
const notifService = require('../services/notification.service');

const adminListVerifications = asyncHandler(async (req, res) => {
  const result = await verifService.searchVerifications(req.query);
  res.status(200).json({
    success: true,
    message: "Driver verifications (admin) retrieved successfully",
    ...result,
  });
});

const getMyVerification = asyncHandler(async (req, res) => {
  const userId = req.user.sub;
  const record = await verifService.getVerificationByUser(userId);
  res.status(200).json({
    success: true,
    message: "Driver verification record retrieved successfully",
    data: record,
  });
});

const createVerification = asyncHandler(async (req, res) => {
  const userId = req.user.sub;
  // ไฟล์ต้องมีอยู่
  if (!req.files || !req.files.licensePhotoUrl || !req.files.selfiePhotoUrl) {
    throw new ApiError(400, "License photo and selfie photo are required");
  }

  // อัปโหลดรูปไป Cloudinary
  // const result = await uploadToCloudinary(
  //   req.file.buffer,
  //   "painamnae/licenses"
  // );

  const [licenseResult, selfieResult] = await Promise.all([
    uploadToCloudinary(
      req.files.licensePhotoUrl[0].buffer,
      "painamnae/licenses"
    ),
    uploadToCloudinary(req.files.selfiePhotoUrl[0].buffer, "painamnae/selfies"),
  ]);

  const payload = {
    userId,
    licenseNumber: req.body.licenseNumber,
    firstNameOnLicense: req.body.firstNameOnLicense,
    lastNameOnLicense: req.body.lastNameOnLicense,
    typeOnLicense: req.body.typeOnLicense,
    licenseIssueDate: new Date(req.body.licenseIssueDate),
    licenseExpiryDate: new Date(req.body.licenseExpiryDate),
    licensePhotoUrl: licenseResult.url,
    selfiePhotoUrl: selfieResult.url,
  };

  const newRec = await verifService.createVerification(payload);

  const notifPayload = {
    userId,
    type: 'VERIFICATION',
    title: 'คำขอคนขับถูกส่งแล้ว',
    body: 'เราได้รับข้อมูลใบขับขี่ของคุณแล้ว กำลังรอแอดมินตรวจสอบ',
    link: '/driver-verification',
    metadata: {
      kind: 'driver_verification',
      verificationId: newRec.id,
      userId: newRec.userId,
      status: newRec.status,
      initiatedBy: 'user'
    }
  }

  await notifService.createNotificationByAdmin(notifPayload)

  res.status(201).json({
    success: true,
    message: "Driver verification submitted and pending approval",
    data: newRec,
  });
});

const updateVerification = asyncHandler(async (req, res) => {
  const userId = req.user.sub;
  const { id } = req.params;

  const existing = await verifService.getVerificationById(id);
  if (!existing) throw new ApiError(404, "Verification not found");
  if (existing.userId !== userId) throw new ApiError(403, "Forbidden");

  // ถ้ามีไฟล์ใหม่ ให้อัปโหลดทับ
  let photoUrl = existing.licensePhotoUrl;
  if (req.file) {
    const result = await uploadToCloudinary(
      req.file.buffer,
      "painamnae/licenses"
    );
    photoUrl = result.url;
  }

  const payload = {
    ...req.body,
    licenseIssueDate: req.body.licenseIssueDate
      ? new Date(req.body.licenseIssueDate)
      : undefined,
    licenseExpiryDate: req.body.licenseExpiryDate
      ? new Date(req.body.licenseExpiryDate)
      : undefined,
    licensePhotoUrl: photoUrl,
  };

  const updated = await verifService.updateVerification(id, payload);

  const notifPayload = {
    userId: updated.userId,
    type: 'VERIFICATION',
    title: 'คำขอคนขับถูกส่งแล้ว',
    body: 'เราได้รับข้อมูลใบขับขี่ของคุณแล้ว กำลังรอแอดมินตรวจสอบ',
    link: '/driver-verification',
    metadata: {
      kind: 'driver_verification',
      verificationId: updated.id,
      userId: updated.userId,
      status: updated.status,
      initiatedBy: 'user'
    }
  }

  await notifService.createNotificationByAdmin(notifPayload)

  res.status(200).json({
    success: true,
    message: "Driver verification updated successfully",
    data: updated,
  });
});

const getAllVerifications = asyncHandler(async (req, res) => {
  const list = await verifService.getAllVerifications();
  res.status(200).json({
    success: true,
    message: "All driver verifications retrieved successfully",
    data: list,
  });
});

const getVerificationById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const rec = await verifService.getVerificationById(id);
  if (!rec) throw new ApiError(404, "Verification not found");
  res.status(200).json({
    success: true,
    message: "Driver verification record retrieved successfully",
    data: rec,
  });
});

const updateVerificationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const updated = await verifService.updateVerificationStatus(id, status);

  try {
    if (status === 'APPROVED') {
      await notifService.createNotificationByAdmin({
        userId: updated.userId,
        type: 'VERIFICATION',
        title: 'ยืนยันตัวตนคนขับสำเร็จ',
        body: 'แอดมินได้อนุมัติคำขอของคุณแล้ว ตอนนี้คุณสามารถสร้างเส้นทางได้',
        link: '/driver-verification',
        metadata: {
          kind: 'driver_verification',
          verificationId: updated.id,
          userId: updated.userId,
          status: updated.status,
          initiatedBy: 'system'
        }
      });
    } else if (status === 'REJECTED') {
      await notifService.createNotificationByAdmin({
        userId: updated.userId,
        type: 'VERIFICATION',
        title: 'คำขอคนขับถูกปฏิเสธ',
        body: 'ข้อมูลใบขับขี่/รูปถ่ายของคุณไม่ผ่านการตรวจสอบ กรุณาตรวจสอบและส่งใหม่อีกครั้ง',
        link: '/driver-verification',
        metadata: {
          kind: 'driver_verification',
          verificationId: updated.id,
          userId: updated.userId,
          status: updated.status,
          initiatedBy: 'system'
        }
      });
    } else if (status === 'PENDING') {
      await notifService.createNotificationByAdmin({
        userId: updated.userId,
        type: 'VERIFICATION',
        title: 'คำขอคนขับอยู่ระหว่างตรวจสอบ',
        body: 'เราได้รับคำขอของคุณแล้ว กำลังอยู่ระหว่างการตรวจสอบโดยแอดมิน',
        link: '/driver-verification',
        metadata: {
          kind: 'driver_verification',
          verificationId: updated.id,
          userId: updated.userId,
          status: updated.status,
          initiatedBy: 'user'
        }
      });
    }
  } catch (e) {
    console.error('Failed to create verification notification:', e);
  }

  res.status(200).json({
    success: true,
    message: `Driver verification status updated to ${status}`,
    data: updated,
  });
});

const adminCreateVerification = asyncHandler(async (req, res) => {
  const payload = { ...req.body };

  if (req.files?.licensePhotoUrl) {
    const r = await uploadToCloudinary(req.files.licensePhotoUrl[0].buffer, "painamnae/licenses");
    payload.licensePhotoUrl = r.url;
  }
  if (req.files?.selfiePhotoUrl) {
    const r = await uploadToCloudinary(req.files.selfiePhotoUrl[0].buffer, "painamnae/selfies");
    payload.selfiePhotoUrl = r.url;
  }

  if (payload.licenseIssueDate) payload.licenseIssueDate = new Date(payload.licenseIssueDate);
  if (payload.licenseExpiryDate) payload.licenseExpiryDate = new Date(payload.licenseExpiryDate);

  const created = await verifService.createVerificationByAdmin(payload);

  res.status(201).json({
    success: true,
    message: "Driver verification (by admin) created successfully",
    data: created,
  });
});

const adminDeleteVerification = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const existing = await verifService.getVerificationById(id);
  if (!existing) throw new ApiError(404, "Verification not found");

  await verifService.deleteVerificationByAdmin(id);

  res.status(200).json({
    success: true,
    message: "Driver verification (by admin) deleted successfully",
  });
});

const adminUpdateVerification = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existing = await verifService.getVerificationById(id);
  if (!existing) throw new ApiError(404, "Verification not found");

  const payload = { ...req.body };

  if (req.files?.licensePhotoUrl) {
    const r = await uploadToCloudinary(req.files.licensePhotoUrl[0].buffer, "painamnae/licenses");
    payload.licensePhotoUrl = r.url;
  }
  if (req.files?.selfiePhotoUrl) {
    const r = await uploadToCloudinary(req.files.selfiePhotoUrl[0].buffer, "painamnae/selfies");
    payload.selfiePhotoUrl = r.url;
  }

  // แปลงวันที่ (ถ้ามาเป็น string)
  if (payload.licenseIssueDate) payload.licenseIssueDate = new Date(payload.licenseIssueDate);
  if (payload.licenseExpiryDate) payload.licenseExpiryDate = new Date(payload.licenseExpiryDate);

  const updated = await verifService.updateVerificationByAdmin(id, payload);

  res.status(200).json({
    success: true,
    message: "Driver verification (by admin) updated successfully",
    data: updated,
  });
});

module.exports = {
  adminListVerifications,
  getMyVerification,
  createVerification,
  updateVerification,
  getAllVerifications,
  getVerificationById,
  updateVerificationStatus,
  adminCreateVerification,
  adminUpdateVerification,
  adminDeleteVerification,
};
