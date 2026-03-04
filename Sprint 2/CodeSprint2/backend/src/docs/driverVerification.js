/**
 * @swagger
 * tags:
 *   name: DriverVerifications
 *   description: Driver identity verification endpoints (for drivers and admins)
 */

/**
 * @swagger
 * /api/driver-verifications:
 *   post:
 *     summary: Submit driver verification request (Driver)
 *     tags: [DriverVerifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - licenseNumber
 *               - firstNameOnLicense
 *               - lastNameOnLicense
 *               - typeOnLicense
 *               - licenseIssueDate
 *               - licenseExpiryDate
 *               - licensePhotoUrl
 *               - selfiePhotoUrl
 *             properties:
 *               licenseNumber:
 *                 type: string
 *                 example: "1234567890"
 *               firstNameOnLicense:
 *                 type: string
 *                 example: Jonathan
 *               lastNameOnLicense:
 *                 type: string
 *                 example: Doillon
 *               typeOnLicense:
 *                 type: string
 *                 enum: [PRIVATE_CAR_TEMPORARY, PRIVATE_CAR, PUBLIC_CAR, LIFETIME]
 *               licenseIssueDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2022-05-10T00:00:00Z"
 *               licenseExpiryDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2027-05-10T00:00:00Z"
 *               licensePhotoUrl:
 *                 type: string
 *                 format: binary
 *               selfiePhotoUrl:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Verification submitted successfully
 *       400:
 *         description: Missing required files or invalid data
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/driver-verifications/me:
 *   get:
 *     summary: Get current driver's verification record
 *     tags: [DriverVerifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Driver verification record retrieved
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/driver-verifications/{id}:
 *   put:
 *     summary: Update driver verification record (Driver)
 *     tags: [DriverVerifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Verification record ID
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               licenseNumber:
 *                 type: string
 *               firstNameOnLicense:
 *                 type: string
 *               lastNameOnLicense:
 *                 type: string
 *               typeOnLicense:
 *                 type: string
 *                 enum: [PRIVATE_CAR_TEMPORARY, PRIVATE_CAR, PUBLIC_CAR, LIFETIME]
 *               licenseIssueDate:
 *                 type: string
 *                 format: date-time
 *               licenseExpiryDate:
 *                 type: string
 *                 format: date-time
 *               licensePhotoUrl:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Verification updated successfully
 *       403:
 *         description: Forbidden (not your record)
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /api/driver-verifications/admin:
 *   get:
 *     summary: List all driver verification requests (Admin)
 *     tags: [DriverVerifications]
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
 *         name: status
 *         schema: { type: string, enum: [PENDING, APPROVED, REJECTED] }
 *       - in: query
 *         name: typeOnLicense
 *         schema: { type: string, enum: [PRIVATE_CAR_TEMPORARY, PRIVATE_CAR, PUBLIC_CAR, LIFETIME] }
 *     responses:
 *       200:
 *         description: Paginated list of driver verifications
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/driver-verifications/admin:
 *   post:
 *     summary: Create a driver verification record manually (Admin)
 *     tags: [DriverVerifications]
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
 *               - licenseNumber
 *               - firstNameOnLicense
 *               - lastNameOnLicense
 *               - typeOnLicense
 *               - licenseIssueDate
 *               - licenseExpiryDate
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "cuid_user_123"
 *               licenseNumber:
 *                 type: string
 *               firstNameOnLicense:
 *                 type: string
 *               lastNameOnLicense:
 *                 type: string
 *               typeOnLicense:
 *                 type: string
 *                 enum: [PRIVATE_CAR_TEMPORARY, PRIVATE_CAR, PUBLIC_CAR, LIFETIME]
 *               licenseIssueDate:
 *                 type: string
 *                 format: date-time
 *               licenseExpiryDate:
 *                 type: string
 *                 format: date-time
 *               licensePhotoUrl:
 *                 type: string
 *                 format: binary
 *               selfiePhotoUrl:
 *                 type: string
 *                 format: binary
 *               status:
 *                 type: string
 *                 enum: [PENDING, APPROVED, REJECTED]
 *     responses:
 *       201:
 *         description: Verification created successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /api/driver-verifications/admin/{id}:
 *   get:
 *     summary: Get driver verification by ID (Admin)
 *     tags: [DriverVerifications]
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
 *         description: Record retrieved successfully
 *       404:
 *         description: Not found
 */

/**
 * @swagger
 * /api/driver-verifications/admin/{id}:
 *   put:
 *     summary: Update driver verification record (Admin)
 *     tags: [DriverVerifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               licenseNumber:
 *                 type: string
 *               firstNameOnLicense:
 *                 type: string
 *               lastNameOnLicense:
 *                 type: string
 *               typeOnLicense:
 *                 type: string
 *                 enum: [PRIVATE_CAR_TEMPORARY, PRIVATE_CAR, PUBLIC_CAR, LIFETIME]
 *               licenseIssueDate:
 *                 type: string
 *                 format: date-time
 *               licenseExpiryDate:
 *                 type: string
 *                 format: date-time
 *               licensePhotoUrl:
 *                 type: string
 *                 format: binary
 *               selfiePhotoUrl:
 *                 type: string
 *                 format: binary
 *               status:
 *                 type: string
 *                 enum: [PENDING, APPROVED, REJECTED]
 *     responses:
 *       200:
 *         description: Verification updated successfully
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /api/driver-verifications/admin/{id}:
 *   delete:
 *     summary: Delete driver verification record (Admin)
 *     tags: [DriverVerifications]
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
 *         description: Record deleted successfully
 *       404:
 *         description: Record not found
 */

/**
 * @swagger
 * /api/driver-verifications/{id}/status:
 *   patch:
 *     summary: Update driver verification status (Admin)
 *     tags: [DriverVerifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, APPROVED, REJECTED]
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Invalid status
 *       404:
 *         description: Record not found
 */
