const express = require('express');
const driverController = require('../controllers/driver.controller');
const { protect } = require('../middlewares/auth');
const upload = require('../middlewares/upload.middleware');
const validate = require('../middlewares/validate');

const { uploadQRCodeSchema } = require('../validations/driver.validator');

const router = express.Router();

// ✅ แก้: protect ควรอยู่ก่อนอื่นเสมอ
router.post(
  '/qr-code',
  protect,                          // ← ต้องหน้า upload!
  upload.single('qrCode'),
  validate(uploadQRCodeSchema),
  driverController.uploadQRCode
);

router.get(
  '/qr-code',
  protect,                          // ← ต้องหน้า!
  driverController.getQRCode
);

router.delete(
  '/qr-code',
  protect,                          // ← ต้องหน้า!
  driverController.deleteQRCode
);

router.get('/:id/payment-info', 
  driverController.getDriverPaymentInfo)

module.exports = router;