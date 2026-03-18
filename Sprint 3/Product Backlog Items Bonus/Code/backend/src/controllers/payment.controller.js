const prisma = require('../utils/prisma');
const { uploadToCloudinary } = require('../utils/cloudinary');
const fs = require('fs').promises;
const { sendNotification } = require('../services/notification.service');
const { extractSlipData } = require('../services/ocr.service');
// ============================================
// GET /api/payments/passenger
// ============================================
exports.getPaymentsForPassenger = async (req, res) => {
  try {
    const passengerId = req.user.id;
    console.log('🔍 Getting payments for passenger:', passengerId);

    // หา Bookings ที่ CONFIRMED แต่ยังไม่มี Payment
    const bookingsWithoutPayment = await prisma.booking.findMany({
      where: {
        passengerId: passengerId,
        status: 'CONFIRMED',
        payments: { none: {} }
      },
      include: { route: true }
    });

    console.log('📝 Bookings without payment:', bookingsWithoutPayment.length);

    // สร้าง Payment สำหรับ Booking ที่ยังไม่มี
    for (const booking of bookingsWithoutPayment) {
      const numberOfSeats = booking.numberOfSeats || 1;
      const pricePerSeat = booking.route?.pricePerSeat || 0;
      const amount = numberOfSeats * pricePerSeat;
      
      try {
        const newPayment = await prisma.payment.create({
          data: {
            bookingId: booking.id,
            driverId: booking.route.driverId,
            passengerId: passengerId,
            amount: amount,
            status: 'pending',
            verificationStatus: 'pending'
          }
        });
        console.log('💰 Auto-created payment:', newPayment.id, 'Amount:', amount);
      } catch (err) {
        console.error('❌ Failed to create payment:', booking.id, err.message);
      }
    }

    // ดึง Payments ทั้งหมด
    const payments = await prisma.payment.findMany({
      where: { passengerId },
      include: {
        booking: {
          include: {
            route: {
              include: {
                vehicle: {
                  select: { licensePlate: true }
                }
              }
            }
          }
        },
        driver: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        passenger: {
          select: { id: true, firstName: true, lastName: true, email: true, phoneNumber: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log('✅ Total payments found:', payments.length);

    // ดึง QR Code ของ driver
    for (let payment of payments) {
      if (payment.driver?.id) {
        try {
          const driverProfile = await prisma.driverProfile.findUnique({
            where: { userId: payment.driver.id },
            select: { qrCodeUrl: true, bankInfo: true }
          });
          if (driverProfile) {
            payment.driver.qrCodeUrl = driverProfile.qrCodeUrl;
            payment.driver.bankInfo = driverProfile.bankInfo;
          }
        } catch (err) {}
      }
    }

    res.status(200).json({ 
      message: 'ดึงรายการ payment สำเร็จ', 
      data: payments 
    });
  } catch (error) {
    console.error('❌ Get payments error:', error);
    res.status(500).json({ 
      message: error.message, 
      data: [] 
    });
  }
};

// ============================================
// GET /api/payments/driver/list
// ============================================
exports.getPaymentsForDriver = async (req, res) => {
  try {
    const driverId = req.user.id;
    console.log('🔍 Getting payments for driver:', driverId);

    // ✅ แก้: ลบ status ออก - เพราะ cash_pending ไม่ใช่ completed
    const { verificationStatus, page = 1, limit = 20 } = req.query;

    const where = {
      driverId,
      ...(verificationStatus && { verificationStatus })
    };

    console.log('🔍 Filter:', where);

    const payments = await prisma.payment.findMany({
      where,
      include: {
        booking: { include: { route: true } },
        passenger: { 
          select: { 
            id: true, 
            firstName: true, 
            lastName: true, 
            email: true, 
            phoneNumber: true 
          } 
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: parseInt(limit)
    });

    const total = await prisma.payment.count({ where });

    console.log('✅ Found driver payments:', payments.length);

    res.status(200).json({ 
      message: 'ดึงรายการ payment สำเร็จ', 
      data: payments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('❌ Get payments for driver error:', error);
    res.status(500).json({ message: error.message, data: [] });
  }
};

// ============================================
// POST /api/payments/:id/cash-confirm
// ============================================
exports.confirmCashPayment = async (req, res) => {
  try {
    const { id: paymentId } = req.params;
    const passengerId = req.user.id;

    console.log('💵 Cash payment confirmation:', { paymentId, passengerId });

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { booking: true, driver: true }
    });

    if (!payment) return res.status(404).json({ message: 'ไม่พบรายการชำระเงิน' });
    if (payment.passengerId !== passengerId) return res.status(403).json({ message: 'ไม่มีสิทธิ์' });
    if (payment.status !== 'pending') return res.status(400).json({ message: 'รายการนี้ไม่สามารถเปลี่ยนแปลงได้' });

    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        paymentMethod: 'cash',
        status: 'cash_pending',
        submittedAt: new Date()
      },
      include: {
        booking: { include: { route: true } },
        driver: { select: { id: true, firstName: true, lastName: true } }
      }
    });

    // ✅ แจ้งเตือนคนขับ - ใช้ type: 'BOOKING'
    await prisma.notification.create({
      data: {
        userId: payment.driverId,
        type: 'BOOKING',
        title: 'มีการชำระเงินสดรอยืนยัน',
        body: 'ผู้โดยสารแจ้งชำระเงินสด กรุณายืนยันการรับเงิน',
        metadata: { kind: 'CASH_PAYMENT_PENDING', paymentId, amount: payment.amount }
      }
    });

    console.log('✅ Cash payment confirmed:', updatedPayment.id);
    res.status(200).json({ 
      message: 'ยืนยันการชำระเงินสดสำเร็จ รอคนขับยืนยัน', 
      data: updatedPayment 
    });
  } catch (error) {
    console.error('❌ Confirm cash payment error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ============================================
// POST /api/payments/:id/driver-confirm-cash
// ============================================
exports.driverConfirmCash = async (req, res) => {
  try {
    const { id: paymentId } = req.params;
    const driverId = req.user.id;
    const { confirmed } = req.body;

    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) return res.status(404).json({ message: 'ไม่พบรายการชำระเงิน' });
    if (payment.driverId !== driverId) return res.status(403).json({ message: 'ไม่มีสิทธิ์' });
    if (payment.status !== 'cash_pending') return res.status(400).json({ message: 'รายการนี้ไม่ใช่การชำระเงินสดที่รอยืนยัน' });

    const newStatus = confirmed ? 'verified' : 'rejected';
    
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: newStatus,
        verificationStatus: confirmed ? 'approved' : 'rejected',
        verifiedAt: confirmed ? new Date() : null,
        verificationNote: confirmed ? 'ยืนยันการรับเงินสดแล้ว' : 'ปฏิเสธการรับเงินสด'
      }
    });

    // ✅ แจ้งเตือนผู้โดยสาร - ใช้ type: 'BOOKING'
    await prisma.notification.create({
      data: {
        userId: payment.passengerId,
        type: 'BOOKING',
        title: confirmed ? 'การชำระเงินสดได้รับการยืนยัน' : 'การชำระเงินสดถูกปฏิเสธ',
        body: confirmed ? 'คนขับยืนยันการรับเงินสดแล้ว' : 'คนขับปฏิเสธการรับเงินสด',
        metadata: { kind: confirmed ? 'CASH_VERIFIED' : 'CASH_REJECTED', paymentId }
      }
    });

    res.status(200).json({ 
      message: confirmed ? 'ยืนยันสำเร็จ' : 'ปฏิเสธ', 
      data: updatedPayment 
    });
  } catch (error) {
    console.error('❌ Driver confirm cash error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ============================================
// POST /api/payments/:paymentId/upload-receipt
// ============================================
exports.uploadReceipt = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const passengerId = req.user.id;

    console.log('📤 Upload receipt:', {
      paymentId,
      passengerId,
      fileExists: !!req.file,
      fileName: req.file?.originalname
    });

    // ✅ Validate input
    if (!req.file) {
      console.error('❌ No file found');
      return res.status(400).json({ message: 'ไม่พบไฟล์' });
    }

    if (!paymentId || !passengerId) {
      console.error('❌ Missing paymentId or passengerId');
      return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน' });
    }

    // ✅ Get payment
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { 
        passenger: true,
        booking: {
          include: {
            route: {
              select: { driverId: true }
            }
          }
        }
      }
    });

    if (!payment) {
      console.error('❌ Payment not found:', paymentId);
      return res.status(404).json({ message: 'ไม่พบรายการชำระเงิน' });
    }

    if (payment.passengerId !== passengerId) {
      console.error('❌ Unauthorized - passenger mismatch');
      return res.status(403).json({ message: 'ไม่มีสิทธิ์เข้าถึง' });
    }

    // ✅ ใช้ buffer จาก memoryStorage โดยตรง
    const fileBuffer = req.file.buffer;
    console.log(`✅ File buffer size: ${fileBuffer.length} bytes`);

    // ✅ 🆕 NEW: OCR ข้อมูลจากรูปสลิป (Tesseract.js)
    console.log('🔍 Starting OCR extraction...');
    let ocrData = null;

    try {
      ocrData = await extractSlipData(fileBuffer);
      console.log('✅ OCR extraction success:', ocrData);
    } catch (ocrError) {
      console.warn('⚠️ OCR extraction failed:', ocrError.message);
      // ไม่ throw error - ให้ผู้ใช้ใส่เอง
      ocrData = {
        amount: null,
        date: new Date().toISOString(),
        referenceNumber: null,
        rawText: '',
        ocrFailed: true,
        error: ocrError.message
      };
    }

    // ✅ Upload to Cloudinary
    console.log('☁️ Uploading to Cloudinary...');

    let receiptImageUrl = null;

    try {
      const result = await uploadToCloudinary(
        fileBuffer,
        `payments/${paymentId}`,
        {
          resource_type: 'auto',
          filename_override: req.file.originalname
        }
      );
      
      receiptImageUrl = result.secure_url;
      console.log('☁️ Cloudinary upload success:', receiptImageUrl);
    } catch (cloudinaryError) {
      console.error('❌ Cloudinary upload error:', cloudinaryError.message);
      return res.status(500).json({
        message: 'ไม่สามารถอัปโหลดรูปได้',
        error: cloudinaryError.message
      });
    }

    // ✅ Update payment with OCR data
    console.log('📝 Updating payment with receipt URL and OCR data...');

    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        receiptImageUrl: receiptImageUrl,
        status: 'completed',
        submittedAt: new Date(),
        // ✅ 🆕 บันทึก OCR data ลงฐานข้อมูล
        ocrData: {
          amount: ocrData.amount,
          date: ocrData.date,
          referenceNumber: ocrData.referenceNumber,
          rawText: ocrData.rawText,
          ocrFailed: ocrData.ocrFailed || false,
          extractedAt: new Date().toISOString(),
          source: 'tesseract_ocr'
        }
      },
      include: {
        passenger: { select: { id: true, firstName: true, lastName: true } },
        booking: { include: { route: true } }
      }
    });

    console.log('✅ Receipt uploaded successfully:', {
      paymentId,
      receiptImageUrl,
      ocrAmount: ocrData.amount,
      actualAmount: payment.amount,
      amountMatch: ocrData.amount === payment.amount
    });

    // ✅ Get driverId correctly
    const driverId = payment.booking?.route?.driverId;
    console.log('📬 Sending notification to driver:', {
      driverId,
      paymentId,
      ocrAmount: ocrData.amount,
      actualAmount: payment.amount
    });

    // ✅ Send notification to driver
    if (driverId) {
      try {
        await sendNotification({
          userId: driverId,
          type: 'PAYMENT_RECEIPT',
          title: '📸 มีการอัปโหลดสลิปชำระเงิน',
          message: `ผู้โดยสารได้อัปโหลดสลิปชำระเงิน ${payment.amount} บาท กรุณาตรวจสอบ`,
          metadata: {
            kind: 'RECEIPT_UPLOADED',
            paymentId,
            amount: payment.amount,
            ocrAmount: ocrData.amount,
            amountMatch: ocrData.amount === payment.amount,
            receiptImageUrl: receiptImageUrl,
            passengerName: `${payment.passenger.firstName} ${payment.passenger.lastName}`
          }
        });
        console.log('📬 Notification sent to driver successfully');
      } catch (notifError) {
        console.warn('⚠️ Failed to send notification:', notifError.message);
      }
    } else {
      console.warn('⚠️ No driver found for notification');
    }


    res.status(200).json({
      message: 'อัปโหลดสลิปเรียบร้อย',
      data: updatedPayment
    });

  } catch (error) {
    console.error('❌ Upload receipt error:', error);
    res.status(500).json({
      message: error.message || 'ไม่สามารถอัปโหลดสลิปได้',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};



// ============================================
// PATCH /api/payments/:paymentId/verify
// ============================================
exports.verifyPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const driverId = req.user.id;
    const { status, note } = req.body;

    console.log('🔍 Verifying payment:', { paymentId, driverId, status, note });

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { 
        booking: true, 
        passenger: { select: { id: true, firstName: true, lastName: true } }
      }
    });

    if (!payment) {
      return res.status(404).json({ message: 'ไม่พบรายการชำระเงิน' });
    }

    if (payment.driverId !== driverId) {
      return res.status(403).json({ message: 'ไม่มีสิทธิ์เข้าถึง' });
    }

    if (payment.verificationStatus !== 'pending') {
      return res.status(400).json({ message: 'รายการนี้ได้รับการตรวจสอบแล้ว' });
    }

    // ✅ Map status ให้ถูกต้อง
    const verificationStatusMap = {
      'approved': 'approved',
      'rejected': 'rejected'
    };

    // ✅ กำหนด payment status ตามผลการตรวจสอบ
    let newPaymentStatus = payment.status;

    if (status === 'approved') {
      // ✅ ถ้า approved ให้เปลี่ยนเป็น 'approved' (จาก cash_pending หรือ completed)
      newPaymentStatus = 'approved';
      console.log(`✅ Payment approved: ${payment.status} → approved`);
    } else if (status === 'rejected') {
      // ✅ ถ้า rejected ให้เปลี่ยนเป็น 'rejected' (จาก cash_pending หรือ completed)
      newPaymentStatus = 'rejected';
      console.log(`❌ Payment rejected: ${payment.status} → rejected`);
    }

    // ✅ อัปเดต payment status และ verification status
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: newPaymentStatus,  // ✅ เปลี่ยน payment status
        verificationStatus: verificationStatusMap[status],
        verificationNote: note || null,
        verifiedAt: new Date()
      },
      include: {
        booking: { include: { route: true } },
        passenger: { select: { id: true, firstName: true, lastName: true } }
      }
    });

    console.log('📝 Payment updated:', {
      paymentId,
      oldStatus: payment.status,
      newStatus: newPaymentStatus,
      verificationStatus: status,
      verificationNote: note
    });

    // ✅ ส่ง notification ให้ passenger
    try {
      if (status === 'approved') {
        await sendNotification({
          userId: payment.passenger.id,
          type: 'PAYMENT_VERIFICATION',
          title: '✅ ยืนยันการชำระเงินเรียบร้อย',
          message: `คนขับได้ยืนยันว่าคุณชำระเงิน ${payment.amount} บาท ถูกต้องแล้ว${note ? ` - ${note}` : ''}`,
          metadata: {
            kind: 'PAYMENT_VERIFIED',
            paymentId: paymentId,
            status: 'approved',
            amount: payment.amount,
            bookingId: payment.bookingId,
            driverNote: note || null,
            verifiedAt: new Date().toISOString()
          }
        });

        console.log('📬 Notification sent to passenger:', payment.passenger.id);
      } else {
        await sendNotification({
          userId: payment.passenger.id,
          type: 'PAYMENT_VERIFICATION',
          title: '❌ การชำระเงินไม่ผ่านการตรวจสอบ',
          message: `คนขับไม่สามารถยืนยันการชำระเงินได้${note ? ` - เหตุผล: ${note}` : ''}`,
          metadata: {
            kind: 'PAYMENT_VERIFICATION_FAILED',
            paymentId: paymentId,
            status: 'rejected',
            amount: payment.amount,
            bookingId: payment.bookingId,
            reasonForRejection: note || null,
            verifiedAt: new Date().toISOString()
          }
        });

        console.log('📬 Rejection notification sent to passenger:', payment.passenger.id);
      }
    } catch (notifError) {
      console.warn('⚠️ Failed to send notification:', notifError.message);
    }

    res.status(200).json({
      message: `${status === 'approved' ? 'ยืนยัน' : 'ปฏิเสธ'}การชำระเงินเรียบร้อย`,
      data: updatedPayment
    });

  } catch (error) {
    console.error('❌ Verify payment error:', error);
    res.status(500).json({ 
      message: error.message || 'ไม่สามารถตรวจสอบการชำระเงินได้'
    });
  }
};

// ============================================
// GET /api/payments/:paymentId
// ============================================
exports.getPaymentById = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user.id;

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        booking: { include: { route: true } },
        driver: { select: { id: true, firstName: true, lastName: true } },
        passenger: { select: { id: true, firstName: true, lastName: true } }
      }
    });

    if (!payment) return res.status(404).json({ message: 'ไม่พบ' });
    if (payment.passengerId !== userId && payment.driverId !== userId) {
      return res.status(403).json({ message: 'ไม่มีสิทธิ์' });
    }

    res.status(200).json({ message: 'success', data: payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================================
// POST /api/payments
// ============================================
exports.createPayment = async (req, res) => {
  try {
    const { bookingId, amount, driverId } = req.body;
    const passengerId = req.user.id;

    const payment = await prisma.payment.create({
      data: {
        amount: parseFloat(amount),
        status: 'pending',
        verificationStatus: 'pending',
        bookingId,
        driverId,
        passengerId
      }
    });

    res.status(201).json({ message: 'สร้างสำเร็จ', data: payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};