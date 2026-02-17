const prisma = require('../utils/prisma');
const ApiError = require('../utils/ApiError');

const baseSelect = {
    id: true,
    userId: true,
    type: true,
    title: true,
    body: true,
    link: true,
    metadata: true,
    readAt: true,
    adminReviewedAt: true,
    createdAt: true,
};

const buildWhere = (opts = {}) => {
    const { q, type, read, createdFrom, createdTo, userId, adminReviewed } = opts;

    return {
        ...(userId && { userId }),
        ...(type && { type }),
        ...(typeof read === 'boolean'
            ? (read
                ? { readAt: { not: null } }
                : { readAt: null })
            : {}),
        ...(typeof adminReviewed === 'boolean'
            ? (adminReviewed ? { adminReviewedAt: { not: null } } : { adminReviewedAt: null })
            : {}),
        ...((createdFrom || createdTo)
            ? {
                createdAt: {
                    ...(createdFrom ? { gte: new Date(createdFrom) } : {}),
                    ...(createdTo ? { lte: new Date(createdTo) } : {}),
                },
            }
            : {}),
        ...(q
            ? {
                OR: [
                    { title: { contains: q, mode: 'insensitive' } },
                    { body: { contains: q, mode: 'insensitive' } },
                ],
            }
            : {}),
    };
};

const listMyNotifications = async (ownerId, opts = {}) => {
    const {
        page = 1,
        limit = 20,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        ...filters
    } = opts;

    const where = buildWhere({ ...filters, userId: ownerId });

    const skip = (page - 1) * limit;
    const take = limit;

    const [total, data] = await prisma.$transaction([
        prisma.notification.count({ where }),
        prisma.notification.findMany({
            where,
            orderBy: { [sortBy]: sortOrder },
            skip,
            take,
            select: baseSelect,
        }),
    ]);

    return {
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

const listNotificationsAdmin = async (opts = {}) => {
    const {
        page = 1,
        limit = 20,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        ...filters
    } = opts;

    const where = buildWhere(filters);

    const skip = (page - 1) * limit;
    const take = limit;

    const [total, data] = await prisma.$transaction([
        prisma.notification.count({ where }),
        prisma.notification.findMany({
            where,
            orderBy: { [sortBy]: sortOrder },
            skip,
            take,
            select: {
                ...baseSelect,
                user: { select: { id: true, email: true, username: true, firstName: true, lastName: true } },
            },
        }),
    ]);

    return {
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

const getMyNotificationById = async (id, ownerId) => {
    const n = await prisma.notification.findUnique({
        where: { id },
        select: baseSelect,
    });
    if (!n || n.userId !== ownerId) {
        throw new ApiError(404, 'Notification not found');
    }
    return n;
};

const createNotificationByAdmin = async (payload) => {
    const user = await prisma.user.findUnique({ where: { id: payload.userId }, select: { id: true } });
    if (!user) throw new ApiError(404, 'User not found');

    const created = await prisma.notification.create({
        data: payload,
        select: baseSelect,
    });
    return created;
};

const markRead = async (id, ownerId) => {
    const n = await prisma.notification.findUnique({ where: { id } });
    if (!n || n.userId !== ownerId) throw new ApiError(404, 'Notification not found');

    return prisma.notification.update({
        where: { id },
        data: { readAt: new Date() },
        select: baseSelect,
    });
};

const markUnread = async (id, ownerId) => {
    const n = await prisma.notification.findUnique({ where: { id } });
    if (!n || n.userId !== ownerId) throw new ApiError(404, 'Notification not found');

    return prisma.notification.update({
        where: { id },
        data: { readAt: null },
        select: baseSelect,
    });
};

const adminMarkRead = async (id) => {
    const n = await prisma.notification.findUnique({ where: { id } });
    if (!n) throw new ApiError(404, 'Notification not found');

    return prisma.notification.update({
        where: { id },
        data: { adminReviewedAt: new Date() },
        select: baseSelect,
    });
};

const markAllRead = async (ownerId) => {
    const result = await prisma.notification.updateMany({
        where: { userId: ownerId, readAt: null },
        data: { readAt: new Date() },
    });
    return { updated: result.count };
};

const deleteMyNotification = async (id, ownerId) => {
    const n = await prisma.notification.findUnique({ where: { id } });
    if (!n || n.userId !== ownerId) throw new ApiError(404, 'Notification not found');

    await prisma.notification.delete({ where: { id } });
    return { id };
};

const deleteNotificationByAdmin = async (id) => {
    const n = await prisma.notification.findUnique({ where: { id } });
    if (!n) throw new ApiError(404, 'Notification not found');

    await prisma.notification.delete({ where: { id } });
    return { id };
};

const countUnread = async (ownerId) => {
    const total = await prisma.notification.count({
        where: { userId: ownerId, readAt: null },
    });
    return { unread: total };
};

module.exports = {
    listMyNotifications,
    listNotificationsAdmin,
    getMyNotificationById,
    createNotificationByAdmin,
    markRead,
    markUnread,
    markAllRead,
    deleteMyNotification,
    deleteNotificationByAdmin,
    countUnread,
    adminMarkRead,
};
