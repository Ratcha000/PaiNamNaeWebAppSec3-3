const prisma = require('../utils/prisma');
const ApiError = require('../utils/ApiError');
const { uploadToCloudinary } = require('../utils/cloudinary');

/**
 * POST /api/driver/qr-code
 * อัปโหลด QR Code
 */
exports.uploadQRCode = async (req, res) => {
  try {
    // ✅ ตรวจสอบว่า req.user มี id
    if (!req.user || !req.user.id) {
      throw new ApiError(401, 'ต้อง login ก่อน');
    }

    const driverId = req.user.id;
    const { paymentMethod, bankName, accountNumber, accountName } = req.body;

    // ✅ ถ้าเป็น PromptPay ต้องมีรูป
    if (paymentMethod === 'promptpay' && !req.file) {
      throw new ApiError(400, 'ต้องอัปโหลด QR Code');
    }

    let qrCodeUrl = null;
    let bankInfo = null;

    // ✅ อัปโหลด QR Code ไป Cloudinary    
    if (paymentMethod === 'promptpay' && req.file) {
      try {
        // ✅ ใช้ buffer จาก memoryStorage โดยตรง
        const fileBuffer = req.file.buffer;

        if (!fileBuffer || fileBuffer.length === 0) {
          throw new ApiError(400, 'ไฟล์ QR Code ว่างเปล่า');
        }

        const result = await uploadToCloudinary(
          fileBuffer,
          `driver_qr_codes/${driverId}`
        );
        qrCodeUrl = result.url;
        console.log('✅ QR Code URL:', qrCodeUrl);
      } catch (err) {
        console.error('Cloudinary upload error:', err);
        throw new ApiError(err.statusCode || 500, err.message || 'ไม่สามารถอัปโหลด QR Code ได้');
      }
    }

    // ✅ บันทึกข้อมูลบัญชี (ถ้ามี)
    if (bankName || accountNumber || accountName) {
      bankInfo = {
        bankName,
        accountNumber,
        accountName
      };
    }

    // ✅ สร้างหรืออัปเดต DriverProfile
    let updatedDriver;
    
    try {
      const existingProfile = await prisma.driverProfile.findUnique({
        where: { userId: driverId }
      });

      if (existingProfile) {
        updatedDriver = await prisma.driverProfile.update({
          where: { userId: driverId },
          data: {
            paymentMethod: paymentMethod,
            qrCodeUrl: qrCodeUrl || existingProfile.qrCodeUrl,
            bankInfo: bankInfo || existingProfile.bankInfo
          }
        });
      } else {
        updatedDriver = await prisma.driverProfile.create({
          data: {
            userId: driverId,
            paymentMethod: paymentMethod,
            qrCodeUrl: qrCodeUrl,
            bankInfo: bankInfo
          }
        });
      }

      res.status(200).json({
        message: 'บันทึก QR Code สำเร็จแล้ว',
        data: {
          id: updatedDriver.id,
          paymentMethod: updatedDriver.paymentMethod,
          qrCodeUrl: updatedDriver.qrCodeUrl,
          bankInfo: updatedDriver.bankInfo,
          updatedAt: updatedDriver.updatedAt
        }
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      throw new ApiError(500, 'ไม่สามารถบันทึกข้อมูลได้');
    }
  } catch (error) {
    console.error('Upload QR Code Error:', error);
    res.status(error.statusCode || 500).json({
      message: error.message || 'ไม่สามารถบันทึกได้'
    });
  }
};

/**
 * GET /api/driver/qr-code
 * ดึง QR Code ของ Driver
 */
exports.getQRCode = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      console.log('❌ No user or user.id in request');
      throw new ApiError(401, 'ต้อง login ก่อน');
    }

    const driverId = req.user.id;
    console.log('🔍 Getting QR Code for driver:', driverId);

    const driverProfile = await prisma.driverProfile.findUnique({
      where: { userId: driverId }
    });

    console.log('📋 Raw driver profile from DB:', driverProfile);

    if (!driverProfile) {
      console.log('❌ No driver profile found');
      return res.status(404).json({
        message: 'ยังไม่มีข้อมูล QR Code',
        data: null
      });
    }

    const responseData = {
      id: driverProfile.id,
      paymentMethod: driverProfile.paymentMethod,
      qrCodeUrl: driverProfile.qrCodeUrl,
      bankInfo: driverProfile.bankInfo,
      updatedAt: driverProfile.updatedAt
    };

    console.log('✅ Sending QR Code response:', responseData);

    res.status(200).json({
      message: 'ดึง QR Code สำเร็จ',
      data: responseData
    });
  } catch (error) {
    console.error('❌ Get QR Code Error:', error);
    res.status(error.statusCode || 500).json({
      message: error.message || 'ไม่สามารถดึง QR Code ได้'
    });
  }
};

/**
 * DELETE /api/driver/qr-code
 * ลบ QR Code
 */
exports.deleteQRCode = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      throw new ApiError(401, 'ต้อง login ก่อน');
    }

    const driverId = req.user.id;

    const driverProfile = await prisma.driverProfile.findUnique({
      where: { userId: driverId }
    });

    if (!driverProfile) {
      throw new ApiError(404, 'ไม่พบ QR Code');
    }

    await prisma.driverProfile.update({
      where: { userId: driverId },
      data: {
        paymentMethod: null,
        qrCodeUrl: null,
        bankInfo: null
      }
    });

    res.status(200).json({
      message: 'ลบ QR Code สำเร็จแล้ว'
    });
  } catch (error) {
    console.error('Delete QR Code Error:', error);
    res.status(error.statusCode || 500).json({
      message: error.message || 'ไม่สามารถลบได้'
    });
  }
};

/**
 * GET /api/drivers/:id/payment-info
 * ดึงข้อมูลการชำระของ Driver (สำหรับ Passenger)
 */
exports.getDriverPaymentInfo = async (req, res) => {
  try {
    const { id: driverId } = req.params

    const driverProfile = await prisma.driverProfile.findUnique({
      where: { userId: driverId },
      select: {
        qrCodeUrl: true,
        bankInfo: true,
        paymentMethod: true
      }
    })

    if (!driverProfile) {
      return res.status(404).json({
        message: 'ไม่พบข้อมูลการชำระของคนขับ',
        data: null
      })
    }

    res.status(200).json({
      message: 'ดึงข้อมูลการชำระสำเร็จ',
      data: driverProfile
    })
  } catch (error) {
    console.error('Get driver payment info error:', error)
    res.status(500).json({
      message: 'ไม่สามารถดึงข้อมูลการชำระได้'
    })
  }
};