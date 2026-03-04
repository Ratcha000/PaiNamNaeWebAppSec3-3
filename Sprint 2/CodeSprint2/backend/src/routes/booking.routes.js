const express = require('express');
const validate = require('../middlewares/validate');
const { protect, requireAdmin } = require('../middlewares/auth');
const requireDriverVerified = require('../middlewares/driverVerified');
const bookingController = require('../controllers/booking.controller');
const {
  createBookingSchema,
  idParamSchema,
  updateBookingStatusSchema,
  listBookingsQuerySchema,
  createBookingByAdminSchema,
  updateBookingByAdminSchema,
  cancelBookingSchema,
} = require('../validations/booking.validation');

const { requirePassengerNotSuspended } = require('../middlewares/suspension');

const router = express.Router();

// --- Admin Routes ---
// GET /bookings/admin (list + query)
router.get(
  "/admin",
  protect,
  requireAdmin,
  validate({ query: listBookingsQuerySchema }),
  bookingController.adminListBookings
)

// GET /bookings/admin/:id
router.get(
  "/admin/:id",
  protect,
  requireAdmin,
  validate({ params: idParamSchema }),
  bookingController.adminGetBookingById
)

// POST /bookings/admin
router.post(
  "/admin",
  protect,
  requireAdmin,
  validate({ body: createBookingByAdminSchema }),
  bookingController.adminCreateBooking
)

// PUT /bookings/admin/:id
router.put(
  "/admin/:id",
  protect,
  requireAdmin,
  validate({ params: idParamSchema, body: updateBookingByAdminSchema }),
  bookingController.adminUpdateBooking
)

// DELETE /bookings/admin/:id
router.delete(
  "/admin/:id",
  protect,
  requireAdmin,
  validate({ params: idParamSchema }),
  bookingController.adminDeleteBooking
);

// --- Public Routes ---
// GET /bookings/me
router.get(
  '/me',
  protect,
  bookingController.getMyBookings
);

// GET /bookings/:id
router.get(
  '/:id',
  protect,
  validate({ params: idParamSchema }),
  bookingController.getBookingById
);

// POST /bookings
router.post(
  '/',
  protect,
  requirePassengerNotSuspended,
  validate({ body: createBookingSchema }),
  bookingController.createBooking
);

// PATCH /bookings/:id/status
router.patch(
  '/:id/status',
  protect,
  requireDriverVerified,
  validate({ params: idParamSchema, body: updateBookingStatusSchema }),
  bookingController.updateBookingStatus
);

// PATCH /bookings/:id/cancel
router.patch(
  '/:id/cancel',
  protect,
  validate({ params: idParamSchema, body: cancelBookingSchema }),
  bookingController.cancelBooking
);

// DELETE /bookings/:id
router.delete(
  '/:id',
  protect,
  validate({ params: idParamSchema }),
  bookingController.deleteBooking
);

module.exports = router;
