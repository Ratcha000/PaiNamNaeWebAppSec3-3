/**
 * @swagger
 * tags:
 *   name: Vehicles
 *   description: Vehicle management endpoints (for users and admins)
 */

/**
 * @swagger
 * /api/vehicles:
 *   get:
 *     summary: Get all vehicles of the authenticated user
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, example: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, example: 10 }
 *       - in: query
 *         name: q
 *         schema: { type: string, example: "Honda" }
 *       - in: query
 *         name: vehicleType
 *         schema: { type: string, example: "Sedan" }
 *       - in: query
 *         name: color
 *         schema: { type: string, example: "Black" }
 *       - in: query
 *         name: isDefault
 *         schema: { type: boolean }
 *       - in: query
 *         name: seatMin
 *         schema: { type: integer }
 *       - in: query
 *         name: seatMax
 *         schema: { type: integer }
 *       - in: query
 *         name: amenitiesAny
 *         schema: { type: array, items: { type: string }, example: ["Air Conditioning", "Bluetooth"] }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [createdAt, vehicleModel, seatCapacity] }
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string, enum: [asc, desc] }
 *     responses:
 *       200:
 *         description: Paginated list of user's vehicles
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/vehicles:
 *   post:
 *     summary: Create a new vehicle (User)
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - vehicleModel
 *               - licensePlate
 *               - vehicleType
 *               - color
 *               - seatCapacity
 *             properties:
 *               vehicleModel:
 *                 type: string
 *                 example: "Toyota Corolla Altis"
 *               licensePlate:
 *                 type: string
 *                 example: "กข 1234 ขอนแก่น"
 *               vehicleType:
 *                 type: string
 *                 example: "Sedan"
 *               color:
 *                 type: string
 *                 example: "White"
 *               seatCapacity:
 *                 type: integer
 *                 example: 4
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Air Conditioning", "Bluetooth"]
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               isDefault:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Vehicle created successfully
 *       400:
 *         description: Invalid input data
 */

/**
 * @swagger
 * /api/vehicles/{id}:
 *   get:
 *     summary: Get vehicle by ID (User)
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vehicle retrieved successfully
 *       404:
 *         description: Vehicle not found
 */

/**
 * @swagger
 * /api/vehicles/{id}:
 *   put:
 *     summary: Update vehicle (User)
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               vehicleModel: { type: string }
 *               licensePlate: { type: string }
 *               vehicleType: { type: string }
 *               color: { type: string }
 *               seatCapacity: { type: integer }
 *               amenities:
 *                 type: array
 *                 items: { type: string }
 *               photos:
 *                 type: array
 *                 items: { type: string, format: binary }
 *               isDefault: { type: boolean }
 *     responses:
 *       200:
 *         description: Vehicle updated successfully
 *       404:
 *         description: Vehicle not found
 */

/**
 * @swagger
 * /api/vehicles/{id}:
 *   delete:
 *     summary: Delete vehicle (User)
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Vehicle deleted successfully
 *       404:
 *         description: Vehicle not found
 */

/**
 * @swagger
 * /api/vehicles/{id}/default:
 *   put:
 *     summary: Set vehicle as default (User)
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Vehicle set as default successfully
 *       404:
 *         description: Vehicle not found
 */

/**
 * @swagger
 * /api/vehicles/admin:
 *   get:
 *     summary: Get all vehicles (Admin)
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: userId
 *         schema: { type: string }
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *       - in: query
 *         name: vehicleType
 *         schema: { type: string }
 *       - in: query
 *         name: color
 *         schema: { type: string }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [createdAt, vehicleModel, seatCapacity] }
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string, enum: [asc, desc] }
 *     responses:
 *       200:
 *         description: Paginated list of vehicles
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/vehicles/admin:
 *   post:
 *     summary: Create a vehicle (Admin)
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - vehicleModel
 *               - licensePlate
 *               - vehicleType
 *               - color
 *               - seatCapacity
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "cuid_user_123"
 *               vehicleModel:
 *                 type: string
 *                 example: "Toyota Yaris"
 *               licensePlate:
 *                 type: string
 *                 example: "งข 5678 กทม"
 *               vehicleType:
 *                 type: string
 *                 example: "Hatchback"
 *               color:
 *                 type: string
 *                 example: "Red"
 *               seatCapacity:
 *                 type: integer
 *                 example: 4
 *               amenities:
 *                 type: array
 *                 items: { type: string }
 *                 example: ["USB Charger", "Bluetooth"]
 *               photos:
 *                 type: array
 *                 items: { type: string, format: binary }
 *               isDefault:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Vehicle created successfully
 *       400:
 *         description: Invalid data
 */

/**
 * @swagger
 * /api/vehicles/admin/{id}:
 *   put:
 *     summary: Update vehicle (Admin)
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userId: { type: string }
 *               vehicleModel: { type: string }
 *               licensePlate: { type: string }
 *               vehicleType: { type: string }
 *               color: { type: string }
 *               seatCapacity: { type: integer }
 *               amenities:
 *                 type: array
 *                 items: { type: string }
 *               photos:
 *                 type: array
 *                 items: { type: string, format: binary }
 *               isDefault: { type: boolean }
 *     responses:
 *       200:
 *         description: Vehicle updated successfully
 *       404:
 *         description: Vehicle not found
 */

/**
 * @swagger
 * /api/vehicles/admin/{id}:
 *   get:
 *     summary: Get vehicle by ID (Admin)
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Vehicle retrieved successfully
 *       404:
 *         description: Vehicle not found
 */

/**
 * @swagger
 * /api/vehicles/admin/user/{userId}:
 *   get:
 *     summary: Get all vehicles by user ID (Admin)
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User's vehicles retrieved successfully
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/vehicles/admin/{id}:
 *   delete:
 *     summary: Delete vehicle (Admin)
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Vehicle deleted successfully
 *       404:
 *         description: Vehicle not found
 */
