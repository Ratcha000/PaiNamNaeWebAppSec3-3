/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints for login and password management
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login (using email or username)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
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
 *             oneOf:
 *               - required: [email, password]
 *               - required: [username, password]
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     user:
 *                       type: object
 *                       description: Safe user data without sensitive info
 *       400:
 *         description: Validation error (missing required fields)
 *       401:
 *         description: Invalid credentials or deactivated account
 */

/**
 * @swagger
 * /api/auth/change-password:
 *   put:
 *     summary: Change current password (requires authentication)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmNewPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: oldpassword123
 *               newPassword:
 *                 type: string
 *                 example: newpassword123
 *               confirmNewPassword:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password changed successfully
 *       400:
 *         description: Validation error (e.g. passwords do not match)
 *       401:
 *         description: Unauthorized or incorrect current password
 */
