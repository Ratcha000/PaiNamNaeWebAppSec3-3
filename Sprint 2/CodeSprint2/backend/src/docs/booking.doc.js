/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Booking management endpoints for passengers, drivers, and admins
 */

/**
 * @swagger
 * /api/bookings/me:
 *   get:
 *     summary: Get all bookings of the authenticated passenger
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Passenger's bookings retrieved successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Get booking details by ID (Passenger or Driver)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Booking retrieved successfully
 *       403:
 *         description: Forbidden (not your booking)
 *       404:
 *         description: Booking not found
 */

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new booking (Passenger)
 *     description: ผู้โดยสารสามารถจองที่นั่งบนเส้นทางได้ โดยต้องไม่ถูกระงับสิทธิ์การจอง
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [routeId, numberOfSeats, pickupLocation, dropoffLocation]
 *             properties:
 *               routeId:
 *                 type: string
 *                 example: "cmroute1234567890abcd"
 *               numberOfSeats:
 *                 type: integer
 *                 example: 2
 *               pickupLocation:
 *                 type: object
 *                 example: { lat: 16.4772, lng: 102.8141, name: "หน้ามข.", address: "ถนนหลังมอ" }
 *               dropoffLocation:
 *                 type: object
 *                 example: { lat: 16.4755, lng: 102.8256, name: "ปลายทางฝั่งตะวันออก", address: "ถนนสหศาสตร์" }
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Invalid input or route not available
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Passenger suspended
 */

/**
 * @swagger
 * /api/bookings/{id}/status:
 *   patch:
 *     summary: Update booking status (Driver)
 *     description: คนขับสามารถยืนยัน (CONFIRMED) หรือปฏิเสธ (REJECTED) การจองได้
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, CONFIRMED, REJECTED, CANCELLED]
 *                 example: CONFIRMED
 *     responses:
 *       200:
 *         description: Booking status updated successfully
 *       403:
 *         description: Forbidden (not your route)
 *       404:
 *         description: Booking not found
 */

/**
 * @swagger
 * /api/bookings/{id}/cancel:
 *   patch:
 *     summary: Cancel booking (Passenger)
 *     description: ผู้โดยสารสามารถยกเลิกการจอง พร้อมระบุเหตุผลที่ยกเลิกได้
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reason]
 *             properties:
 *               reason:
 *                 type: string
 *                 enum: [
 *                   CHANGE_OF_PLAN,
 *                   FOUND_ALTERNATIVE,
 *                   DRIVER_DELAY,
 *                   PRICE_ISSUE,
 *                   WRONG_LOCATION,
 *                   DUPLICATE_OR_WRONG_DATE,
 *                   SAFETY_CONCERN,
 *                   WEATHER_OR_FORCE_MAJEURE,
 *                   COMMUNICATION_ISSUE
 *                 ]
 *                 example: CHANGE_OF_PLAN
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       400:
 *         description: Cannot cancel this booking
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Booking not found
 */

/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     summary: Delete booking (Passenger or Driver)
 *     description: ลบได้เฉพาะการจองที่สถานะ CANCELLED หรือ REJECTED
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Booking deleted successfully
 *       400:
 *         description: Only cancelled or rejected bookings can be deleted
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Booking not found
 */

/**
 * @swagger
 * /api/bookings/admin:
 *   get:
 *     summary: Get all bookings (Admin)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string, example: "ขอนแก่น" }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [PENDING, CONFIRMED, REJECTED, CANCELLED] }
 *       - in: query
 *         name: passengerId
 *         schema: { type: string }
 *       - in: query
 *         name: routeId
 *         schema: { type: string }
 *       - in: query
 *         name: driverId
 *         schema: { type: string }
 *       - in: query
 *         name: createdFrom
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: createdTo
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: routeDepartureFrom
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: routeDepartureTo
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [createdAt, status, numberOfSeats] }
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string, enum: [asc, desc] }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Admin booking list retrieved successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/bookings/admin/{id}:
 *   get:
 *     summary: Get booking by ID (Admin)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Booking retrieved successfully
 *       404:
 *         description: Booking not found
 */

/**
 * @swagger
 * /api/bookings/admin:
 *   post:
 *     summary: Create booking (Admin)
 *     description: แอดมินสามารถสร้างการจองแทนผู้ใช้ (passengerId) ได้โดยตรง
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - routeId
 *               - passengerId
 *               - numberOfSeats
 *               - pickupLocation
 *               - dropoffLocation
 *             properties:
 *               routeId:
 *                 type: string
 *                 example: "cmroute1234567890abcd"
 *               passengerId:
 *                 type: string
 *                 example: "cmpassenger1234567890"
 *               numberOfSeats:
 *                 type: integer
 *                 example: 1
 *               pickupLocation:
 *                 type: object
 *                 example: { lat: 16.4772, lng: 102.8141, name: "Khon Kaen", address: "หลังมข." }
 *               dropoffLocation:
 *                 type: object
 *                 example: { lat: 16.4755, lng: 102.8256, name: "Central", address: "ถนนศรีจันทร์" }
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Invalid route or not enough seats
 */

/**
 * @swagger
 * /api/bookings/admin/{id}:
 *   put:
 *     summary: Update booking (Admin)
 *     description: แก้ไขข้อมูลการจอง เช่น จำนวนที่นั่ง จุดรับ-ส่ง หรือสถานะ
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               routeId: { type: string }
 *               passengerId: { type: string }
 *               numberOfSeats: { type: integer }
 *               pickupLocation: { type: object }
 *               dropoffLocation: { type: object }
 *               status:
 *                 type: string
 *                 enum: [PENDING, CONFIRMED, REJECTED, CANCELLED]
 *     responses:
 *       200:
 *         description: Booking updated successfully
 *       404:
 *         description: Booking not found
 */

/**
 * @swagger
 * /api/bookings/admin/{id}:
 *   delete:
 *     summary: Delete booking (Admin)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Booking deleted successfully
 *       404:
 *         description: Booking not found
 */
