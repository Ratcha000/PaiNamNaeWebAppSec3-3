การใช้ AI ในการช่วยเขียนและอธิบายโค้ด

ช่วยอธิบายโครงสร้างการเขียนฟังก์ชัน (Function Syntax)
แนะนำรูปแบบการเขียน async/await
อธิบายการทำงานของ middleware และ controller
ช่วยตรวจสอบ syntax ให้ถูกต้องตามมาตรฐาน Node.js และ Express

ส่วนงานที่พัฒนา
การสอบถามเกี่ยวกับ Field ใน Database
status        String?
resolvedAt    DateTime?
updatedBy     String?
1. services/incident.service.js

มีการสอบถาม AI เกี่ยวกับ:

ควรเขียน async function สำหรับอัปเดตสถานะเหตุการณ์อย่างไร
ควรตรวจสอบสิทธิ์ Admin ในชั้น service หรือ controller
ความแตกต่างระหว่างเขียน logic ทั้งหมดใน controller กับแยกเป็น service

2. controllers/incident.controller.js
มีการสอบถาม AI เกี่ยวกับ:

โครงสร้าง controller ที่ถูกต้องสำหรับ Admin endpoint
การรับค่า req.params, req.body และ req.user
การจัดการ response และ error handling เมื่ออัปเดตสถานะไม่สำเร็จ

3. routes/incident.route.js
เพิ่ม route:

GET /incidents — ดึงรายการเหตุการณ์ทั้งหมด
PATCH /incidents/:id/status — อัปเดตสถานะเหตุการณ์

มีการสอบถาม AI เกี่ยวกับ:

ควรใช้ HTTP Method ใด (PUT หรือ PATCH) สำหรับการอัปเดตสถานะ
การวาง middleware protect และ isAdmin ควรอยู่ตำแหน่งใด

4. config/prisma.js
มีการสอบถาม AI เกี่ยวกับ:

ควรสร้าง PrismaClient instance ไว้ที่ใดเพื่อให้ใช้งานร่วมกันได้ทั้งระบบ
เหตุใดจึงไม่ควร new PrismaClient() ในทุกไฟล์

5. routes/index.js
มีการสอบถาม AI เกี่ยวกับ:

วิธีการ import และ use router ใหม่ใน index.js ให้ถูกต้อง
ลำดับการวาง middleware ก่อน-หลัง route ที่เหมาะสม