const multer = require('multer');
const ApiError = require('../utils/ApiError');

// ✅ ใช้ memoryStorage เพื่อให้ req.file.buffer พร้อมใช้งานสำหรับทุก endpoint
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new ApiError(400, 'Only image files are allowed!'), false);
    }
  }
});

upload.errorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'ไฟล์มีขนาดใหญ่เกินไป (ต้องไม่เกิน 5 MB)',
        error: err.message
      });
    }
  }
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  next(err);
};

module.exports = upload;
//44