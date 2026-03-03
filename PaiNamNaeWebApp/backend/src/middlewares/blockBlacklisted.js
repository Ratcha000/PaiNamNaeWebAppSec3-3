const prisma = require('../utils/prisma');

const blockBlacklisted = async (req, res, next) => {
  try {
    // req.user มาจาก middleware protect
    const userId = req.user.sub;

    // หา user จาก DB
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isBlacklisted: true }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    if (user.isBlacklisted) {
      return res.status(403).json({
        success: false,
        message: "บัญชีของคุณถูก Blacklist"
      });
    }

    next();
  } catch (error) {
    console.error("Blacklist middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

module.exports = blockBlacklisted;