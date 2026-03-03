const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError');
const { verifyToken } = require('../utils/jwt');
const prisma = require('../utils/prisma');

const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      // 1️⃣ ดึง token
      token = authHeader.split(' ')[1];

      // 2️⃣ verify JWT
      const decoded = verifyToken(token);

      // 3️⃣ ดึง user จริงจาก DB
      const user = await prisma.user.findUnique({
        where: { id: decoded.sub }
      });

      if (!user) {
        throw new ApiError(401, 'User not found');
      }

      // 🔥 4️⃣ เช็ค blacklist
      if (user.isBlacklisted) {
        throw new ApiError(403, 'บัญชีของคุณถูกระงับ');
      }

      // 5️⃣ แนบข้อมูล user เข้า req
      req.user = {
        sub: user.id,
        role: user.role
      };

      next();

    } catch (error) {
      console.error(error);

      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(401, 'Not authorized, token failed');
    }
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized, no token');
  }
});


const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    throw new ApiError(403, 'Forbidden: Admin access required');
  }
};

module.exports = { protect, requireAdmin };
