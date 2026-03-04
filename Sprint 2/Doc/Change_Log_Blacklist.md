# Change Log – Blacklist 

## 01/03/69
- Added: เพิ่มการตรวจสอบ **Blacklist** ในขั้นตอน Login  
- Added: สร้าง middleware `middlewares/blockBlacklisted.js`  
- Query: ดึงข้อมูลผู้ใช้จากฐานข้อมูลด้วย **Prisma**  
- Added: เพิ่มการป้องกัน Routes ด้วย `protect` และ `blockBlacklisted`  
- Added: เพิ่ม Route, Service และ Controller ที่เกี่ยวข้องกับระบบ Blacklist  

## 02/03/69
- Added: สร้าง Endpoint สำหรับตรวจสอบสถานะผู้ใช้  
- Added: พัฒนา Frontend สำหรับปุ่มและหน้าจอ **Report** พร้อมเรียก API  
- Added: พัฒนา Frontend สำหรับปุ่มและหน้าจอ **Blacklist** พร้อมเรียก API  

## 03/03/69
- Updated: แก้ไขและปรับปรุง Frontend หน้า **Report** และ **Blacklist**
