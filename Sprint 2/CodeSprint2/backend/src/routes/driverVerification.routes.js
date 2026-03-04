const express = require('express');
const validate = require('../middlewares/validate');
const upload = require('../middlewares/upload.middleware');
const { protect, requireAdmin } = require('../middlewares/auth');
const driverVerifController = require('../controllers/driverVerification.controller');
const {
  idParamSchema,
  createDriverVerificationSchema,
  updateDriverVerificationSchema,
  updateVerificationStatusSchema,
  listDriverVerifsQuerySchema,
  createDriverVerificationByAdminSchema,
  updateDriverVerificationByAdminSchema,
} = require('../validations/driverVerification.validation');

const router = express.Router();

// --- Admin routes ---
// GET /driver-verifications/admin
router.get(
  '/admin',
  protect,
  requireAdmin,
  validate({ query: listDriverVerifsQuerySchema }),
  driverVerifController.adminListVerifications
);

// GET /driver-verifications/admin/:id
router.get(
  '/admin/:id',
  protect,
  requireAdmin,
  validate({ params: idParamSchema }),
  driverVerifController.getVerificationById
);

// POST /driver-verifications/admin
router.post(
  '/admin',
  protect,
  requireAdmin,
  upload.fields([
    { name: 'licensePhotoUrl', maxCount: 1 },
    { name: 'selfiePhotoUrl', maxCount: 1 }
  ]),
  validate({ body: createDriverVerificationByAdminSchema }),
  driverVerifController.adminCreateVerification
);

// DELETE /driver-verifications/admin/:id
router.delete(
  '/admin/:id',
  protect,
  requireAdmin,
  validate({ params: idParamSchema }),
  driverVerifController.adminDeleteVerification
);

// PUT /driver-verifications/admin/:id
router.put(
  '/admin/:id',
  protect,
  requireAdmin,
  upload.fields([
    { name: 'licensePhotoUrl', maxCount: 1 },
    { name: 'selfiePhotoUrl', maxCount: 1 }
  ]),
  validate({ params: idParamSchema, body: updateDriverVerificationByAdminSchema }),
  driverVerifController.adminUpdateVerification
);

// PATCH /driver-verifications/:id/status
router.patch(
  '/:id/status',
  protect,
  requireAdmin,
  validate({ params: idParamSchema, body: updateVerificationStatusSchema }),
  driverVerifController.updateVerificationStatus
);

// --- Driver routes ---
// GET /driver-verifications/me
router.get(
  '/me',
  protect,
  driverVerifController.getMyVerification
);

// POST /driver-verifications
router.post(
  '/',
  protect,
  // upload.single('licensePhotoUrl'),
  upload.fields([
    { name: 'licensePhotoUrl', maxCount: 1 },
    { name: 'selfiePhotoUrl', maxCount: 1 }
  ]),
  validate({ body: createDriverVerificationSchema }),
  driverVerifController.createVerification
);

// PUT /driver-verifications/:id
router.put(
  '/:id',
  protect,
  upload.single('licensePhotoUrl'),
  validate({ params: idParamSchema, body: updateDriverVerificationSchema }),
  driverVerifController.updateVerification
);
module.exports = router;
