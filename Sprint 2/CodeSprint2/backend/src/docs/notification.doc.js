/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Manage system and user notifications
 */

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get all notifications of the authenticated user
 *     description: ดึงรายการแจ้งเตือนของผู้ใช้ที่ล็อกอิน สามารถกรองได้ตาม type, สถานะอ่าน, วันที่, คำค้นหา
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string, example: "ระบบ" }
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [SYSTEM, BOOKING, DRIVER_VERIFICATION, PENALTY], example: SYSTEM }
 *       - in: query
 *         name: read
 *         schema: { type: boolean, example: false }
 *       - in: query
 *         name: createdFrom
 *         schema: { type: string, format: date-time, example: "2025-10-01T00:00:00Z" }
 *       - in: query
 *         name: createdTo
 *         schema: { type: string, format: date-time, example: "2025-10-15T23:59:59Z" }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [createdAt, title], example: createdAt }
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string, enum: [asc, desc], example: desc }
 *       - in: query
 *         name: page
 *         schema: { type: integer, example: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, example: 20 }
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 */

/**
 * @swagger
 * /api/notifications/unread-count:
 *   get:
 *     summary: Count unread notifications
 *     description: คืนค่าจำนวนการแจ้งเตือนที่ยังไม่ได้อ่านของผู้ใช้ที่ล็อกอิน
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread count retrieved successfully
 */

/**
 * @swagger
 * /api/notifications/{id}:
 *   get:
 *     summary: Get notification details by ID
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, example: "cmnotif1234567890abcd" }
 *     responses:
 *       200:
 *         description: Notification retrieved successfully
 *       404:
 *         description: Notification not found
 */

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   patch:
 *     summary: Mark a notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, example: "cmnotif1234567890abcd" }
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       404:
 *         description: Notification not found
 */

/**
 * @swagger
 * /api/notifications/{id}/unread:
 *   patch:
 *     summary: Mark a notification as unread
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, example: "cmnotif1234567890abcd" }
 *     responses:
 *       200:
 *         description: Notification marked as unread
 *       404:
 *         description: Notification not found
 */

/**
 * @swagger
 * /api/notifications/read-all:
 *   patch:
 *     summary: Mark all notifications as read
 *     description: เปลี่ยนสถานะการแจ้งเตือนทั้งหมดของผู้ใช้ให้เป็นอ่านแล้ว
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 */

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: Delete a notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, example: "cmnotif1234567890abcd" }
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *       404:
 *         description: Notification not found
 */

/**
 * @swagger
 * /api/notifications/admin:
 *   get:
 *     summary: Get all notifications (Admin)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string, example: "ระบบ" }
 *       - in: query
 *         name: userId
 *         schema: { type: string, example: "cmuser1234567890abcd" }
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [SYSTEM, BOOKING, DRIVER_VERIFICATION, PENALTY] }
 *       - in: query
 *         name: read
 *         schema: { type: boolean, example: false }
 *       - in: query
 *         name: adminReviewed
 *         schema: { type: boolean, example: false }
 *       - in: query
 *         name: createdFrom
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: createdTo
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [createdAt, title], example: createdAt }
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string, enum: [asc, desc], example: desc }
 *       - in: query
 *         name: page
 *         schema: { type: integer, example: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, example: 20 }
 *     responses:
 *       200:
 *         description: Notifications (admin) retrieved successfully
 */

/**
 * @swagger
 * /api/notifications/admin:
 *   post:
 *     summary: Create a new notification (Admin)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, title, body]
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "cmuser1234567890abcd"
 *               type:
 *                 type: string
 *                 enum: [SYSTEM, BOOKING, DRIVER_VERIFICATION, PENALTY]
 *                 example: SYSTEM
 *               title:
 *                 type: string
 *                 example: "ระบบได้ตรวจสอบการยืนยันตัวตนของคุณแล้ว"
 *               body:
 *                 type: string
 *                 example: "สถานะการตรวจสอบใบขับขี่ของคุณได้รับการอนุมัติเรียบร้อยแล้ว"
 *               link:
 *                 type: string
 *                 example: "/driver-verification"
 *               metadata:
 *                 type: object
 *                 example: { relatedId: "cmverify1234abcd", adminReviewed: false }
 *     responses:
 *       201:
 *         description: Notification (admin) created successfully
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/notifications/admin/{id}/read:
 *   patch:
 *     summary: Mark a notification as reviewed by admin
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, example: "cmnotif1234567890abcd" }
 *     responses:
 *       200:
 *         description: Notification marked as reviewed by admin
 *       404:
 *         description: Notification not found
 */

/**
 * @swagger
 * /api/notifications/admin/{id}:
 *   delete:
 *     summary: Delete notification (Admin)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, example: "cmnotif1234567890abcd" }
 *     responses:
 *       200:
 *         description: Notification (admin) deleted successfully
 *       404:
 *         description: Notification not found
 */
