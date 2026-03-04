# Change Log – Blacklist 

## 01/03/69
- Added: เพิ่มการตรวจสอบ **Blacklist** ในขั้นตอน Login  รัชช กันเทพา
- Added: สร้าง middleware `middlewares/blockBlacklisted.js`  รัชช กันเทพา
- Query: ดึงข้อมูลผู้ใช้จากฐานข้อมูลด้วย **Prisma**   รัชช กันเทพา
- Added: เพิ่มการป้องกัน Routes ด้วย `protect` และ `blockBlacklisted`  รัชช กันเทพา
- Added: เพิ่ม Route, Service และ Controller ที่เกี่ยวข้องกับระบบ Blacklist  รัชช กันเทพา

## 02/03/69
- Added: สร้าง Endpoint สำหรับตรวจสอบสถานะผู้ใช้  
- Added: พัฒนา Frontend สำหรับปุ่มและหน้าจอ **Report** พร้อมเรียก API  จิตรานุช ประทุมวงศ์
- Added: พัฒนา Frontend สำหรับปุ่มและหน้าจอ **Blacklist** พร้อมเรียก API   ชนันกานต์ ศรีประเสริฐ

## 03/03/69
- Updated: แก้ไขและปรับปรุง Frontend หน้า **Report** และ **Blacklist** รัชช กันเทพา
