const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const vehicleRoutes = require('./vehicle.routes');
const routeRoutes = require('./route.routes');
const driverVerifRoutes = require('./driverVerification.routes');
const bookingRoutes = require('./booking.routes');
const notificationRoutes = require('./notification.routes');
const mapRoutes = require('./maps.routes');
const reportRoutes = require('./report.routes');

const { protect } = require('../middlewares/auth');
const blockBlacklisted = require('../middlewares/blockBlacklisted');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/api/maps', mapRoutes); // ถ้า public ไม่ต้อง protect

router.use('/users', protect, blockBlacklisted, userRoutes);
router.use('/vehicles', protect, blockBlacklisted, vehicleRoutes);
router.use('/routes', protect, blockBlacklisted, routeRoutes);
router.use('/driver-verifications', protect, blockBlacklisted, driverVerifRoutes);
router.use('/bookings', protect, blockBlacklisted, bookingRoutes);
router.use('/notifications', protect, blockBlacklisted, notificationRoutes);
router.use('/reports', protect, blockBlacklisted, reportRoutes);

module.exports = router;