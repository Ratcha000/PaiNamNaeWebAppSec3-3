const { z } = require('zod');

// ✅ Upload QR Code Schema (ใช้ Zod)
const uploadQRCodeSchema = {
  body: z.object({
    paymentMethod: z
      .enum(['promptpay', 'transfer'])
      .describe('วิธีการชำระเงิน'),

    // ✅ สำหรับ Transfer (ต้องใช้เมื่อเลือก transfer)
    bankName: z
      .string()
      .optional()
      .nullable(),

    accountNumber: z
      .string()
      .optional()
      .nullable(),

    accountName: z
      .string()
      .optional()
      .nullable()
  })
  .refine(
    (data) => {
      // ✅ ถ้าเลือก transfer ต้องมีข้อมูลบัญชี
      if (data.paymentMethod === 'transfer') {
        return data.bankName && data.accountNumber && data.accountName;
      }
      return true;
    },
    {
      message: 'ต้องกรอกข้อมูลบัญชีเมื่อเลือก transfer'
    }
  )
};

module.exports = {
  uploadQRCodeSchema
};