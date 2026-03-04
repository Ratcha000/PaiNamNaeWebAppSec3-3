const asyncHandler = require("express-async-handler");
const bookingService = require("../services/booking.service");
const ApiError = require("../utils/ApiError");

const adminListBookings = asyncHandler(async (req, res) => {
  const result = await bookingService.searchBookingsAdmin(req.query);
  res.status(200).json({ success: true, message: 'Bookings (admin) retrieved', ...result });
});

const adminCreateBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.adminCreateBooking(req.body);
  res.status(201).json({ success: true, data: booking });
});

const adminUpdateBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updated = await bookingService.adminUpdateBooking(id, req.body);
  res.status(200).json({ success: true, data: updated });
});

const createBooking = asyncHandler(async (req, res) => {
  const passengerId = req.user.sub;
  const payload = {
    routeId: req.body.routeId,
    numberOfSeats: req.body.numberOfSeats,
    pickupLocation: req.body.pickupLocation,
    dropoffLocation: req.body.dropoffLocation,
  };

  const booking = await bookingService.createBooking(payload, passengerId);
  res.status(201).json({ success: true, data: booking });
});

const getMyBookings = asyncHandler(async (req, res) => {
  const passengerId = req.user.sub;
  const list = await bookingService.getMyBookings(passengerId);
  res.status(200).json({ success: true, data: list });
});

const adminGetBookingById = asyncHandler(async (req, res) => {
  const { id } = req.params

  const booking = await bookingService.getBookingById(id);
  if (!booking) throw new ApiError(404, 'Booking not found');

  res.status(200).json({ success: true, data: booking });
})

const getBookingById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const booking = await bookingService.getBookingById(id);
  if (!booking) throw new ApiError(404, 'Booking not found');

  const userId = req.user.sub;
  if (
    booking.passengerId !== userId &&
    booking.route.driverId !== userId
  ) {
    throw new ApiError(403, 'Forbidden');
  }

  res.status(200).json({ success: true, data: booking });
});

const updateBookingStatus = asyncHandler(async (req, res) => {
  const driverId = req.user.sub;
  const { id } = req.params;
  const { status } = req.body;

  const updated = await bookingService.updateBookingStatus(
    id,
    status,
    driverId
  );
  res.status(200).json({ success: true, data: updated });
});

const cancelBooking = asyncHandler(async (req, res) => {
  const passengerId = req.user.sub;
  const { id } = req.params;
  const { reason } = req.body;

  const cancelled = await bookingService.cancelBooking(id, passengerId, { reason });
  res.status(200).json({ success: true, data: cancelled });
});

const deleteBooking = asyncHandler(async (req, res) => {
  const userId = req.user.sub;
  const { id } = req.params;
  const deleted = await bookingService.deleteBooking(id, userId);
  res.status(200).json({ success: true, data: deleted });
});

const adminDeleteBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await bookingService.adminDeleteBooking(id);
  res.status(200).json({ success: true, data: result });
});

module.exports = {
  adminListBookings,
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  deleteBooking,
  adminGetBookingById,
  adminCreateBooking,
  adminUpdateBooking,
  adminDeleteBooking
};
