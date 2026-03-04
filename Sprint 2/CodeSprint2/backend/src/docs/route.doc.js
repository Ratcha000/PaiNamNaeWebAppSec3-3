/**
 * @swagger
 * tags:
 *   name: Routes
 *   description: Route management and trip matching endpoints
 */

/**
 * @swagger
 * /api/routes:
 *   get:
 *     summary: Search for available routes (Public)
 *     description: ค้นหาเส้นทางที่ตรงกับพิกัด/เวลา/จำนวนที่นั่ง โดยสามารถกรองด้วย lat/lng (radius), driverId, vehicleId, status, หรือช่วงเวลาเดินทางได้
 *     tags: [Routes]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string, example: "ขอนแก่น มหาวิทยาลัย" }
 *       - in: query
 *         name: driverId
 *         schema: { type: string, example: "cmuser1234567890abcd" }
 *       - in: query
 *         name: vehicleId
 *         schema: { type: string, example: "cmvehicle1234567890abcd" }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [AVAILABLE, FULL, CANCELLED] }
 *       - in: query
 *         name: startNearLat
 *         schema: { type: number, example: 16.4772 }
 *       - in: query
 *         name: startNearLng
 *         schema: { type: number, example: 102.8141 }
 *       - in: query
 *         name: endNearLat
 *         schema: { type: number, example: 16.4755 }
 *       - in: query
 *         name: endNearLng
 *         schema: { type: number, example: 102.8256 }
 *       - in: query
 *         name: radiusMeters
 *         schema: { type: integer, example: 500 }
 *       - in: query
 *         name: seatsRequired
 *         schema: { type: integer, example: 2 }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [createdAt, departureTime, pricePerSeat, availableSeats] }
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string, enum: [asc, desc] }
 *       - in: query
 *         name: page
 *         schema: { type: integer, example: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, example: 10 }
 *     responses:
 *       200:
 *         description: Routes retrieved successfully
 */

/**
 * @swagger
 * /api/routes/me:
 *   get:
 *     summary: Get all routes created by the authenticated driver
 *     tags: [Routes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Driver's routes retrieved successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/routes/{id}:
 *   get:
 *     summary: Get route by ID
 *     tags: [Routes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Route retrieved successfully
 *       404:
 *         description: Route not found
 */

/**
 * @swagger
 * /api/routes:
 *   post:
 *     summary: Create a new route (Driver)
 *     tags: [Routes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehicleId
 *               - startLocation
 *               - endLocation
 *               - departureTime
 *               - availableSeats
 *               - pricePerSeat
 *             properties:
 *               vehicleId:
 *                 type: string
 *                 example: "cmvehicle1234567890abcd"
 *               startLocation:
 *                 type: object
 *                 example: { lat: 16.4772, lng: 102.8141, name: "Khon Kaen University", address: "123 ถนนมิตรภาพ" }
 *               endLocation:
 *                 type: object
 *                 example: { lat: 16.445, lng: 102.834, name: "Central Plaza Khon Kaen", address: "ถ. ศรีจันทร์" }
 *               departureTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-10-15T09:00:00Z"
 *               availableSeats:
 *                 type: integer
 *                 example: 3
 *               pricePerSeat:
 *                 type: number
 *                 example: 50
 *               conditions:
 *                 type: string
 *                 example: "ห้ามสูบบุหรี่ในรถ"
 *               waypoints:
 *                 type: array
 *                 items: { type: object }
 *                 example: [{ lat: 16.460, lng: 102.820, name: "ตลาดต้นตาล" }]
 *               optimizeWaypoints:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Route created successfully
 *       400:
 *         description: Invalid data or vehicle not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Driver not verified
 */

/**
 * @swagger
 * /api/routes/{id}:
 *   put:
 *     summary: Update existing route (Driver)
 *     tags: [Routes]
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
 *               vehicleId: { type: string }
 *               startLocation: { type: object }
 *               endLocation: { type: object }
 *               departureTime: { type: string, format: date-time }
 *               availableSeats: { type: integer }
 *               pricePerSeat: { type: number }
 *               conditions: { type: string }
 *               waypoints: { type: array, items: { type: object } }
 *               optimizeWaypoints: { type: boolean }
 *     responses:
 *       200:
 *         description: Route updated successfully
 *       404:
 *         description: Route not found
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/routes/{id}:
 *   delete:
 *     summary: Delete route (Driver)
 *     tags: [Routes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Route deleted successfully
 *       404:
 *         description: Route not found
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/routes/admin:
 *   get:
 *     summary: Get all routes (Admin)
 *     tags: [Routes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string, example: "Khon Kaen" }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [AVAILABLE, FULL, CANCELLED] }
 *       - in: query
 *         name: driverId
 *         schema: { type: string }
 *       - in: query
 *         name: vehicleId
 *         schema: { type: string }
 *       - in: query
 *         name: dateFrom
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: dateTo
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [createdAt, departureTime, pricePerSeat, availableSeats] }
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string, enum: [asc, desc] }
 *     responses:
 *       200:
 *         description: Admin route list retrieved successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/routes/admin/driver/{driverId}:
 *   get:
 *     summary: Get all routes for a specific driver (Admin)
 *     tags: [Routes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: driverId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Routes retrieved successfully
 *       404:
 *         description: Driver not found
 */

/**
 * @swagger
 * /api/routes/admin/{id}:
 *   get:
 *     summary: Get route details by ID (Admin)
 *     tags: [Routes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Route details retrieved successfully
 *       404:
 *         description: Route not found
 */

/**
 * @swagger
 * /api/routes/admin:
 *   post:
 *     summary: Create a new route (Admin)
 *     tags: [Routes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - driverId
 *               - vehicleId
 *               - startLocation
 *               - endLocation
 *               - departureTime
 *               - availableSeats
 *               - pricePerSeat
 *             properties:
 *               driverId:
 *                 type: string
 *                 example: "cmuser1234567890abcd"
 *               vehicleId:
 *                 type: string
 *                 example: "cmvehicle1234567890abcd"
 *               startLocation:
 *                 type: object
 *                 example: { lat: 16.4772, lng: 102.8141, name: "Khon Kaen University" }
 *               endLocation:
 *                 type: object
 *                 example: { lat: 16.445, lng: 102.834, name: "Central Plaza Khon Kaen" }
 *               departureTime:
 *                 type: string
 *                 format: date-time
 *               availableSeats:
 *                 type: integer
 *                 example: 3
 *               pricePerSeat:
 *                 type: number
 *                 example: 50
 *               conditions:
 *                 type: string
 *                 example: "ไม่รับสัตว์เลี้ยง"
 *               waypoints:
 *                 type: array
 *                 items: { type: object }
 *                 example: [{ lat: 16.460, lng: 102.820, name: "ตลาดต้นตาล" }]
 *               optimizeWaypoints:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Route created successfully
 *       400:
 *         description: Invalid or driver not verified
 */

/**
 * @swagger
 * /api/routes/admin/{id}:
 *   put:
 *     summary: Update route (Admin)
 *     tags: [Routes]
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
 *               driverId: { type: string }
 *               vehicleId: { type: string }
 *               startLocation: { type: object }
 *               endLocation: { type: object }
 *               departureTime: { type: string, format: date-time }
 *               availableSeats: { type: integer }
 *               pricePerSeat: { type: number }
 *               status: { type: string, enum: [AVAILABLE, FULL, CANCELLED] }
 *               conditions: { type: string }
 *               waypoints: { type: array, items: { type: object } }
 *               optimizeWaypoints: { type: boolean }
 *     responses:
 *       200:
 *         description: Route updated successfully
 *       404:
 *         description: Route not found
 */

/**
 * @swagger
 * /api/routes/admin/{id}:
 *   delete:
 *     summary: Delete route (Admin)
 *     tags: [Routes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Route deleted successfully
 *       404:
 *         description: Route not found
 */
