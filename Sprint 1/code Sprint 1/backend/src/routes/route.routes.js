const express = require("express");
const validate = require("../middlewares/validate");
const { protect, requireAdmin } = require("../middlewares/auth");
const requireDriverVerified = require('../middlewares/driverVerified');
const routeController = require("../controllers/route.controller");
const {
  idParamSchema,
  createRouteSchema,
  updateRouteSchema,
  createRouteByAdminSchema,
  updateRouteByAdminSchema,
  adminDriverIdParamSchema,
  listRoutesQuerySchema,
  cancelRouteSchema
} = require("../validations/route.validation");

const router = express.Router();

// --- Admin Routes ---
//GET /routes/admin
router.get(
  "/admin",
  protect,
  requireAdmin,
  validate({ query: listRoutesQuerySchema }),
  routeController.adminListRoutes
);

//GET /routes/admin/driver/:driverId
router.get(
  "/admin/driver/:driverId",
  protect,
  requireAdmin,
  validate({ params: adminDriverIdParamSchema }),
  routeController.adminGetRoutesByDriver
)


// GET /routes/admin/:id
router.get(
  "/admin/:id",
  protect,
  requireAdmin,
  validate({ params: idParamSchema }),
  routeController.getRouteById
);

// POST /routes/admin
router.post(
  "/admin",
  protect,
  requireAdmin,
  validate({ body: createRouteByAdminSchema }),
  routeController.adminCreateRoute
);

// PUT /routes/admin/:id
router.put(
  "/admin/:id",
  protect,
  requireAdmin,
  validate({ params: idParamSchema, body: updateRouteByAdminSchema }),
  routeController.adminUpdateRoute
);

// DELETE /routes/admin/:id
router.delete(
  "/admin/:id",
  protect,
  requireAdmin,
  validate({ params: idParamSchema }),
  routeController.adminDeleteRoute
);

// --- Public Routes ---
// GET /routes
router.get(
  "/",
  validate({ query: listRoutesQuerySchema }),
  routeController.listRoutes
);

// GET /routes/me
router.get(
  "/me",
  protect,
  routeController.getMyRoutes
);

// GET /routes/:id
router.get(
  "/:id",
  validate({ params: idParamSchema }),
  routeController.getRouteById
);

// POST /routes
router.post(
  "/",
  protect,
  requireDriverVerified,
  validate({ body: createRouteSchema }),
  routeController.createRoute
);

// PUT /routes/:id
router.put(
  "/:id",
  protect,
  requireDriverVerified,
  validate({ params: idParamSchema, body: updateRouteSchema }),
  routeController.updateRoute
);

// PATCH /routes/:id/cancel
router.patch(
  "/:id/cancel",
  protect,
  requireDriverVerified,
  validate({ params: idParamSchema, body: cancelRouteSchema }),
  routeController.cancelRoute
);

// DELETE /routes/:id
router.delete(
  "/:id",
  protect,
  requireDriverVerified,
  validate({ params: idParamSchema }),
  routeController.deleteRoute
);

module.exports = router;