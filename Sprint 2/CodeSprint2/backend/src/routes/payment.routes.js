const express = require('express');  
const paymentController = require('../controllers/payment.controller');
const { protect } = require('../middlewares/auth');
const upload = require('../middlewares/upload.middleware');
const validate = require('../middlewares/validate');
const {
  createPaymentSchema,
  uploadReceiptSchema,
  verifyPaymentSchema,
  listPaymentsQuerySchema
} = require('../validations/payment.validation');

const router = express.Router();

// ✅ เพิ่ม route สำหรับ passenger (ที่ frontend เรียกใช้)
router.get(
  '/passenger',
  protect,
  paymentController.getPaymentsForPassenger
);

// ✅ existing routes
router.get(
  '/driver/list',
  protect,
  validate({ query: listPaymentsQuerySchema }),
  paymentController.getPaymentsForDriver
);

router.get(
  '/passenger/list',
  protect,
  validate({ query: listPaymentsQuerySchema }),
  paymentController.getPaymentsForPassenger
);

// ✅ Dynamic routes
router.post(
  '/',
  protect,
  validate({ body: createPaymentSchema }),
  paymentController.createPayment
);

router.post(
  '/:paymentId/upload-receipt',
  protect,
  upload.single('receipt'),
  upload.errorHandler,
  paymentController.uploadReceipt
);

router.patch(
  '/:paymentId/verify',
  protect,
  validate(verifyPaymentSchema),  // ✅ ส่ง schema โดยตรง (ไม่ใช่ {body: ...})
  paymentController.verifyPayment
);

// ✅ Cash Payment Routes
router.post(
  '/:id/cash-confirm',
  protect,
  paymentController.confirmCashPayment
);

router.post(
  '/:id/driver-confirm-cash',
  protect,
  paymentController.driverConfirmCash
);

router.get(
  '/:paymentId',
  protect,
  paymentController.getPaymentById
);

module.exports = router;