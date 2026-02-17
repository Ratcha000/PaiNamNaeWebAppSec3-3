/**
 * @swagger
 * tags:
 *   name: Maps
 *   description: External map utilities (Google Maps Directions / Geocode / Reverse-Geocode)
 */

/**
 * @swagger
 * /api/maps/directions:
 *   post:
 *     summary: Get driving directions between two points
 *     description: |
 *       เรียกใช้งาน Google Maps Directions API (API ภายนอก) เพื่อคำนวณเส้นทางระหว่างจุดเริ่มต้นและปลายทาง  
 *       รองรับการเพิ่มจุดแวะ (waypoints), ตัวเลือกเส้นทางทางเลือก, และเวลาออกเดินทาง  
 *       ใช้สำหรับสร้างเส้นทางก่อนบันทึก Route ในระบบ
 *     tags: [Maps]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [origin, destination]
 *             properties:
 *               origin:
 *                 type: object
 *                 description: จุดเริ่มต้น (lat/lng หรือ place object)
 *                 example:
 *                   lat: 16.4745
 *                   lng: 102.8235
 *                   name: "Khon Kaen University"
 *                   address: "123 ม.16 ถ.มิตรภาพ ขอนแก่น"
 *               destination:
 *                 type: object
 *                 description: จุดปลายทาง
 *                 example:
 *                   lat: 16.4389
 *                   lng: 102.8354
 *                   name: "Central Plaza Khon Kaen"
 *                   address: "ถ. ศรีจันทร์ ขอนแก่น"
 *               waypoints:
 *                 type: array
 *                 description: จุดแวะระหว่างทาง (optional)
 *                 items:
 *                   type: object
 *                   example:
 *                     lat: 16.4593
 *                     lng: 102.8261
 *                     name: "ตลาดต้นตาล"
 *               alternatives:
 *                 type: boolean
 *                 description: เปิด/ปิดการขอเส้นทางทางเลือก
 *                 example: true
 *               departureTime:
 *                 type: string
 *                 description: เวลาที่ออกเดินทาง (ISO string)
 *                 example: "2025-10-15T09:30:00Z"
 *               optimizeWaypoints:
 *                 type: boolean
 *                 description: ให้ Google จัดลำดับ waypoints ที่เหมาะสมที่สุด
 *                 example: true
 *     responses:
 *       200:
 *         description: Directions fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 routes:
 *                   - summary: "Mittraphap Road"
 *                     distance: "5.2 km"
 *                     duration: "12 mins"
 *                     overview_polyline: "abcd1234..."
 *                     legs:
 *                       - start_address: "Khon Kaen University"
 *                         end_address: "Central Plaza Khon Kaen"
 *                         steps: [...]
 *       400:
 *         description: Missing or invalid parameters
 */

/**
 * @swagger
 * /api/maps/geocode:
 *   get:
 *     summary: Geocode an address into coordinates
 *     description: |
 *       แปลงข้อความที่อยู่ให้เป็นพิกัดละติจูด/ลองจิจูด โดยใช้ Google Maps Geocoding API (API ภายนอก)  
 *       ใช้สำหรับแปลงที่อยู่ของผู้ใช้เป็นพิกัดก่อนสร้าง route หรือ booking
 *     tags: [Maps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *           example: "Central Plaza Khon Kaen, Thailand"
 *     responses:
 *       200:
 *         description: Geocode successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 lat: 16.4389
 *                 lng: 102.8354
 *                 formatted_address: "Central Plaza Khon Kaen, ถ. ศรีจันทร์ ขอนแก่น"
 *       400:
 *         description: Missing or invalid address
 */

/**
 * @swagger
 * /api/maps/reverse-geocode:
 *   get:
 *     summary: Reverse geocode coordinates into an address
 *     description: |
 *       แปลงพิกัด latitude/longitude ให้เป็นชื่อสถานที่และที่อยู่ โดยใช้ Google Maps Reverse Geocoding API (API ภายนอก)  
 *       ใช้สำหรับการแสดงผลจุดรับ-ส่ง หรือ checkpoint ในระบบ
 *     tags: [Maps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: string
 *           example: "16.4745"
 *       - in: query
 *         name: lng
 *         required: true
 *         schema:
 *           type: string
 *           example: "102.8235"
 *     responses:
 *       200:
 *         description: Reverse geocode successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 name: "Khon Kaen University"
 *                 address: "123 ม.16 ถ.มิตรภาพ ต.ในเมือง อ.เมือง จ.ขอนแก่น"
 *       400:
 *         description: Missing coordinates
 */
