const prisma = require('../utils/prisma');

async function requirePassengerNotSuspended(req, res, next) {
  try {
    const userId = req.user?.sub;
    if (!userId) return next(); // เผื่อบางเส้นทางยังไม่ได้ protect

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { passengerSuspendedUntil: true },
    });

    if (user?.passengerSuspendedUntil && user.passengerSuspendedUntil > new Date()) {
      return res.status(403).json({
        success: false,
        message: 'คุณถูกระงับสิทธิ์การจองชั่วคราว โปรดลองใหม่ภายหลัง',
      });
    }
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  requirePassengerNotSuspended,
};
