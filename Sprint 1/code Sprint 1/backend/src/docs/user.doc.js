/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints (public, authenticated, and admin)
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - password
 *               - firstName
 *               - lastName
 *               - phoneNumber
 *               - gender
 *               - nationalIdNumber
 *               - nationalIdExpiryDate
 *               - nationalIdPhotoUrl
 *               - selfiePhotoUrl
 *             properties:
 *               email:
 *                 type: string
 *                 example: example@gmail.com
 *               username:
 *                 type: string
 *                 example: jonathan01
 *               password:
 *                 type: string
 *                 example: mysecurepassword
 *               firstName:
 *                 type: string
 *                 example: Jonathan
 *               lastName:
 *                 type: string
 *                 example: Doillon
 *               phoneNumber:
 *                 type: string
 *                 example: "0812345678"
 *               gender:
 *                 type: string
 *                 example: MALE
 *               nationalIdNumber:
 *                 type: string
 *                 example: "1234567890123"
 *               nationalIdExpiryDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2030-12-31T00:00:00.000Z"
 *               nationalIdPhotoUrl:
 *                 type: string
 *                 format: binary
 *               selfiePhotoUrl:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email or username already exists
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get the authenticated user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/users/me:
 *   put:
 *     summary: Update the authenticated user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               gender:
 *                 type: string
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *               nationalIdPhotoUrl:
 *                 type: string
 *                 format: binary
 *               selfiePhotoUrl:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get public user profile by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID (CUID)
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/users/admin:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
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
 *         name: q
 *         schema: { type: string }
 *       - in: query
 *         name: role
 *         schema: { type: string, enum: [ADMIN, DRIVER, PASSENGER] }
 *       - in: query
 *         name: isActive
 *         schema: { type: boolean }
 *       - in: query
 *         name: isVerified
 *         schema: { type: boolean }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [createdAt, lastLogin, email, username, firstName, lastName] }
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string, enum: [asc, desc] }
 *     responses:
 *       200:
 *         description: Paginated users list
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/users/admin/{id}:
 *   get:
 *     summary: Get user by ID (Admin only)
 *     tags: [Users]
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
 *         description: User retrieved
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/users/admin/{id}:
 *   put:
 *     summary: Update a user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               gender:
 *                 type: string
 *               isVerified:
 *                 type: boolean
 *               isActive:
 *                 type: boolean
 *               role:
 *                 type: string
 *                 enum: [ADMIN, DRIVER, PASSENGER]
 *               nationalIdPhotoUrl:
 *                 type: string
 *                 format: binary
 *               selfiePhotoUrl:
 *                 type: string
 *                 format: binary
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User updated
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/users/admin/{id}/status:
 *   patch:
 *     summary: Update user status (isActive / isVerified)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isActive:
 *                 type: boolean
 *               isVerified:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User status updated
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /api/users/admin/{id}:
 *   delete:
 *     summary: Delete a user (Admin only)
 *     tags: [Users]
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
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */