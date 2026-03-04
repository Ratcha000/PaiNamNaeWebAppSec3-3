const express = require('express');
const validate = require('../middlewares/validate');
const { protect, requireAdmin } = require('../middlewares/auth');
const controller = require('../controllers/notification.controller');

const {
    idParamSchema,
    listMyNotificationsQuerySchema,
    listNotificationsAdminQuerySchema,
    createNotificationAdminSchema,
} = require('../validations/notification.validation');

const router = express.Router();

// ===== Admin =====
// GET /api/notifications/admin
router.get(
    '/admin',
    protect,
    requireAdmin,
    validate({ query: listNotificationsAdminQuerySchema }),
    controller.adminListNotifications
);

// POST /api/notifications/admin
router.post(
    '/admin',
    protect,
    requireAdmin,
    validate({ body: createNotificationAdminSchema }),
    controller.adminCreateNotification
);

// DELETE /api/notifications/admin/:id
router.delete(
    '/admin/:id',
    protect,
    requireAdmin,
    validate({ params: idParamSchema }),
    controller.adminDeleteNotification
);

// PATCH /api/notifications/admin/:id/read
router.patch(
    '/admin/:id/read',
    protect,
    requireAdmin,
    validate({ params: idParamSchema }),
    controller.adminMarkRead
);

// ===== User =====
// GET /api/notifications
router.get(
    '/',
    protect,
    validate({ query: listMyNotificationsQuerySchema }),
    controller.listMyNotifications
);

// GET /api/notifications/unread-count
router.get(
    '/unread-count',
    protect,
    controller.countUnread
);

// GET /api/notifications/:id
router.get(
    '/:id',
    protect,
    validate({ params: idParamSchema }),
    controller.getMyNotificationById
);

// PATCH /api/notifications/:id/read
router.patch(
    '/:id/read',
    protect,
    validate({ params: idParamSchema }),
    controller.markRead
);

// PATCH /api/notifications/:id/unread
router.patch(
    '/:id/unread',
    protect,
    validate({ params: idParamSchema }),
    controller.markUnread
);

// PATCH /api/notifications/read-all
router.patch(
    '/read-all',
    protect,
    controller.markAllRead
);

// DELETE /api/notifications/:id
router.delete(
    '/:id',
    protect,
    validate({ params: idParamSchema }),
    controller.deleteMyNotification
);

module.exports = router;