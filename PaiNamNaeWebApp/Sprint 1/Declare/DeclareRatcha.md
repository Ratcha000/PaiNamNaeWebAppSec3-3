การใช้ AI ในการช่วยเขียนและอธิบายโค้ด
-ช่วยอธิบายโครงสร้างการเขียนฟังก์ชัน (Function Syntax)
-แนะนำรูปแบบการเขียน async/await
-อธิบายการทำงานของ middleware และ controller
-ช่วยตรวจสอบ syntax ให้ถูกต้องตามมาตรฐาน Node.js และ Express

2. ส่วนงานที่พัฒนา
การสอบถามเกี่ยวกับ Field ใน Database
deleteReason        String?
deletedAt           DateTime?
scheduledDeleteAt   DateTime?

1. services/user.service.js

มีการสอบถามว่า:
มีการสอบถาม AI เกี่ยวกับ:
ควรเขียน async function อย่างไร
ควรตรวจสอบ password ในชั้น service หรือ controller
ความแตกต่างระหว่างเขียน logic ทั้งหมดใน controller กับแยกเป็น service

2. controllers/user.controller.js

มีการสอบถามว่า:
มีการสอบถามเกี่ยวกับ:
โครงสร้าง controller ที่ถูกต้อง
การรับค่า req.body และ req.user
การจัดการ response และ error handling

3. routes/user.routes.js
เพิ่ม route:
/me/request-delete
มีการสอบถามว่า:
ควรใช้ HTTP Method ใด (DELETE หรือ POST)
การวาง middleware protect ควรอยู่ตำแหน่งใด

4. server.js

มีการสอบถามว่า:
ควร require cron job ไว้ที่ใด
ทำไมควรเรียก job ตอน server start
