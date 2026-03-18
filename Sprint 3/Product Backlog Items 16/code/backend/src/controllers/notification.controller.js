const asyncHandler = require('express-async-handler');
const notifService = require('../services/notification.service');

const listMyNotifications = asyncHandler(async (req, res) => {
    const result = await notifService.listMyNotifications(req.user.sub, req.query);
    res.status(200).json({
        success: true,
        message: 'Notifications retrieved successfully',
        ...result,
    });
});

const getMyNotificationById = asyncHandler(async (req, res) => {
    const data = await notifService.getMyNotificationById(req.params.id, req.user.sub);
    res.status(200).json({
        success: true,
        message: 'Notification retrieved successfully',
        data,
    });
});

const markRead = asyncHandler(async (req, res) => {
    const data = await notifService.markRead(req.params.id, req.user.sub);
    res.status(200).json({
        success: true,
        message: 'Notification marked as read',
        data,
    });
});

const adminMarkRead = asyncHandler(async (req, res) => {
    const data = await notifService.adminMarkRead(req.params.id);
    res.status(200).json({
        success: true,
        message: 'Notification marked as read',
        data,
    });
});

const markUnread = asyncHandler(async (req, res) => {
    const data = await notifService.markUnread(req.params.id, req.user.sub);
    res.status(200).json({
        success: true,
        message: 'Notification marked as unread',
        data,
    });
});

const markAllRead = asyncHandler(async (req, res) => {
    const data = await notifService.markAllRead(req.user.sub);
    res.status(200).json({
        success: true,
        message: 'All notifications marked as read',
        data,
    });
});

const deleteMyNotification = asyncHandler(async (req, res) => {
    const data = await notifService.deleteMyNotification(req.params.id, req.user.sub);
    res.status(200).json({
        success: true,
        message: 'Notification deleted successfully',
        data,
    });
});

const countUnread = asyncHandler(async (req, res) => {
    const data = await notifService.countUnread(req.user.sub);
    res.status(200).json({
        success: true,
        message: 'Unread count retrieved successfully',
        data,
    });
});

const adminListNotifications = asyncHandler(async (req, res) => {
    const result = await notifService.listNotificationsAdmin(req.query);
    res.status(200).json({
        success: true,
        message: 'Notifications (admin) retrieved successfully',
        ...result,
    });
});

const adminCreateNotification = asyncHandler(async (req, res) => {
    const created = await notifService.createNotificationByAdmin(req.body);
    res.status(201).json({
        success: true,
        message: 'Notification (admin) created successfully',
        data: created,
    });
});

const adminDeleteNotification = asyncHandler(async (req, res) => {
    const data = await notifService.deleteNotificationByAdmin(req.params.id);
    res.status(200).json({
        success: true,
        message: 'Notification (admin) deleted successfully',
        data,
    });
});

module.exports = {
    listMyNotifications,
    getMyNotificationById,
    markRead,
    markUnread,
    markAllRead,
    deleteMyNotification,
    countUnread,
    adminListNotifications,
    adminCreateNotification,
    adminMarkRead,
    adminDeleteNotification,
};
