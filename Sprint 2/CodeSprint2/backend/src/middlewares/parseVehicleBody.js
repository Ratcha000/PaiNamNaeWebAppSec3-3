module.exports = (req, res, next) => {
    // seatCapacity: ถ้าเป็น string ให้แปลงเป็น number
    if (req.body.seatCapacity && typeof req.body.seatCapacity === 'string') {
        const n = Number(req.body.seatCapacity);
        if (!Number.isNaN(n)) req.body.seatCapacity = n;
    }

    // amenities: ถ้าเป็น string ให้ลอง parse เป็น JSON
    if (req.body.amenities && typeof req.body.amenities === 'string') {
        try {
            const arr = JSON.parse(req.body.amenities);
            if (Array.isArray(arr)) req.body.amenities = arr;
        } catch {
            // ถ้า parse ไม่ได้ ก็ปล่อย req.body.amenities เป็น string ไว้ให้ validate จับ error ต่อ
        }
    }

    // isDefault: ถ้าเป็น string 'true'/'false' ให้แปลงเป็น boolean
    if (req.body.isDefault && typeof req.body.isDefault === 'string') {
        if (req.body.isDefault.toLowerCase() === 'true') {
            req.body.isDefault = true;
        } else if (req.body.isDefault.toLowerCase() === 'false') {
            req.body.isDefault = false;
        }
    }

    next();
};
