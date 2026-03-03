const express = require('express');
const validate = require('../middlewares/validate');
const vehicleController = require('../controllers/vehicle.controller');
const { idParamSchema,
  createVehicleSchema,
  updateVehicleSchema,
  createVehicleByAdminSchema,
  updateVehicleByAdminSchema,
  listMyVehiclesQuerySchema,
  listVehiclesAdminQuerySchema,
  adminUserIdParamSchema,
} = require('../validations/vehicle.validation');
const { protect, requireAdmin } = require('../middlewares/auth');
const upload = require('../middlewares/upload.middleware');
const parseVehicleBody = require('../middlewares/parseVehicleBody');

const router = express.Router();

// --- Admin Vehicles ---
// GET /api/vehicles/admin
router.get(
  '/admin',
  protect,
  requireAdmin,
  validate({ query: listVehiclesAdminQuerySchema }),
  vehicleController.adminListVehicles
);

// GET /api/vehicles/admin/:id
router.get(
  '/admin/:id',
  protect,
  requireAdmin,
  validate({ params: idParamSchema }),
  vehicleController.getVehicleByIdAdmin
);

// GET /api/vehicles/admin/user/:userId
router.get(
  '/admin/user/:userId',
  protect,
  requireAdmin,
  validate({ params: adminUserIdParamSchema, query: listMyVehiclesQuerySchema }),
  vehicleController.adminListVehiclesByUser
);

//POST /api/vehicles/admin
router.post(
  '/admin',
  protect,
  requireAdmin,
  upload.fields([{ name: 'photos', maxCount: 5 }]),
  parseVehicleBody,
  validate({ body: createVehicleByAdminSchema }),
  vehicleController.adminCreateVehicle
);

//PUT /api/vehicles/admin/:id
router.put(
  '/admin/:id',
  protect,
  requireAdmin,
  upload.fields([{ name: 'photos', maxCount: 5 }]),
  parseVehicleBody,
  validate({ params: idParamSchema, body: updateVehicleByAdminSchema }),
  vehicleController.adminUpdateVehicle
);

//DELETE /api/vehicles/admin/:id
router.delete(
  '/admin/:id',
  protect,
  requireAdmin,
  validate({ params: idParamSchema }),
  vehicleController.adminDeleteVehicle
);

// --- Public Routes ---
// router.get(
//   '/',
//   protect,
//   vehicleController.getVehicles
// );

// GET /api/vehicles
router.get(
  '/',
  protect,
  validate({ query: listMyVehiclesQuerySchema }),
  vehicleController.listMyVehicles
);

// GET /api/vehicles/:id
router.get(
  '/:id',
  protect,
  validate({ params: idParamSchema }),
  vehicleController.getVehicleById
);

// POST /api/vehicles
router.post(
  '/',
  protect,
  upload.fields([{ name: 'photos', maxCount: 5 }]), // รับ photos สูงสุด 5 ไฟล์
  parseVehicleBody,
  validate({ body: createVehicleSchema }),
  vehicleController.createVehicle
);

// PUT /api/vehicles/:id
router.put(
  '/:id',
  protect,
  upload.fields([{ name: 'photos', maxCount: 5 }]),
  parseVehicleBody,
  validate({ params: idParamSchema, body: updateVehicleSchema }),
  vehicleController.updateVehicle
);

// DELETE /api/vehicles/:id
router.delete(
  '/:id',
  protect,
  validate({ params: idParamSchema }),
  vehicleController.deleteVehicle
);

// PUT /api/vehicles/:id/default
router.put(
  '/:id/default',
  protect,
  validate({ params: idParamSchema }),
  vehicleController.setDefaultVehicle
);

module.exports = router;