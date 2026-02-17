const { z } = require('zod');
const { NotificationType } = require('@prisma/client');

// ใช้ร่วมกัน
const idParamSchema = z.object({
    id: z.string().cuid({ message: 'Invalid notification ID format' }),
});

const parseBooleanQuery = z.preprocess((v) => {
    if (v === undefined) return undefined;
    if (typeof v === 'boolean') return v;
    if (typeof v === 'string') {
        const s = v.toLowerCase();
        if (s === 'true' || s === '1') return true;
        if (s === 'false' || s === '0') return false;
    }
    return v; // ให้ z.boolean() จับ error ต่อถ้าไม่แมตช์
}, z.boolean().optional());

const urlOrPath = z.string().refine((v) => {
    if (!v) return false;
    try {
        // ถ้าเป็น URL เต็ม เช่น http(s)://... → ผ่าน
        new URL(v);
        return true;
    } catch {
        // ถ้าไม่ใช่ URL เต็ม ให้ยอมรับกรณีขึ้นต้นด้วย '/'
        return v.startsWith('/');
    }
}, { message: 'link must be an absolute URL or a leading-slash path' });

// ========= User: list =========
const listMyNotificationsQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),

    q: z.string().trim().min(1).optional(), // ค้น title/body
    type: z.nativeEnum(NotificationType).optional(),
    //read: z.coerce.boolean().optional(), // true → readAt != null, false → readAt == null
    read: parseBooleanQuery,

    createdFrom: z.string().refine(v => !v || !isNaN(Date.parse(v)), { message: 'Invalid createdFrom' }).optional(),
    createdTo: z.string().refine(v => !v || !isNaN(Date.parse(v)), { message: 'Invalid createdTo' }).optional(),

    sortBy: z.enum(['createdAt', 'title']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// ========= Admin: list =========
const listNotificationsAdminQuerySchema = listMyNotificationsQuerySchema.extend({
    userId: z.string().cuid().optional(),
    adminReviewed: parseBooleanQuery.optional(),
});

// ========= Admin: create =========
const createNotificationAdminSchema = z.object({
    userId: z.string().cuid({ message: 'userId must be a CUID' }),
    type: z.nativeEnum(NotificationType).default('SYSTEM').optional(),
    title: z.string().min(1, 'title is required'),
    body: z.string().min(1, 'body is required'),
    link: urlOrPath.optional(),
    // metadata ยอมรับอะไรก็ได้ (เช่น object), ให้ frontend ส่ง JSON แล้ว parse ก่อนก็ได้
    metadata: z.any().optional(),
});

module.exports = {
    idParamSchema,
    listMyNotificationsQuerySchema,
    listNotificationsAdminQuerySchema,
    createNotificationAdminSchema,
};
