import { ref } from 'vue'

export const usePayment = () => {
  const { $api } = useNuxtApp()
  const isLoading = ref(false)
  const payments = ref([])
  const currentPayment = ref(null)
  const error = ref(null)

  // ✅ สร้าง Payment (คนขับ) หรือดึงจากการจอง
  const getOrCreatePayment = async (bookingId) => {
    isLoading.value = true
    error.value = null
    try {
      // ลองสร้าง payment ใหม่
      const response = await $api('/payments', {
        method: 'POST',
        body: {
          bookingId,
          qrCodeUrl: 'https://via.placeholder.com/300x300?text=QR+Code+Placeholder' // ตั้งค่า QR Code
        }
      })
      currentPayment.value = response
      return response
    } catch (err) {
      // ถ้า payment มีอยู่แล้ว ให้ดึงข้อมูลเดิม
      if (err.status === 400 && err.data?.message?.includes('already created')) {
        const payments = await $api(`/payments/passenger/list?bookingId=${bookingId}`)
        if (payments.payments.length > 0) {
          currentPayment.value = payments.payments[0]
          return payments.payments[0]
        }
      }
      error.value = err.data?.message || err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // ใน composables/usePayment.js
const fetchPassengerPayments = async () => {
  try {
    isLoading.value = true
    
    const response = await $api('/payments/passenger')
    
    // ดึงข้อมูล QR Code และ Bank Info ของแต่ละ driver
    for (let payment of response.data) {
      if (payment.driver) {
        try {
          const driverInfo = await $api(`/drivers/${payment.driver.id}/payment-info`)
          payment.driver.qrCodeUrl = driverInfo.data?.qrCodeUrl || null
          payment.driver.bankInfo = driverInfo.data?.bankInfo || null
        } catch (err) {
          console.log(`No payment info for driver ${payment.driver.id}`)
        }
      }
    }
    
    payments.value = response.data
  } catch (err) {
    error.value = err.data?.message || 'ไม่สามารถดึงข้อมูลการชำระได้'
  } finally {
    isLoading.value = false
  }
}
  

  // ดึงรายการชำระของ Driver
  const fetchDriverPayments = async (status = null, verificationStatus = null, limit = 20, offset = 0) => {
    isLoading.value = true
    error.value = null
    try {
      const query = new URLSearchParams({
        limit,
        offset
      })
      if (status) query.append('status', status)
      if (verificationStatus) query.append('verificationStatus', verificationStatus)

      const response = await $api(`/payments/driver/list?${query.toString()}`)
      payments.value = response.payments || []
      return response
    } catch (err) {
      error.value = err.data?.message || err.message
      console.error('Error fetching driver payments:', err)
      payments.value = []
    } finally {
      isLoading.value = false
    }
  }

  // อัปโหลดสลิป (Passenger)
  const uploadReceipt = async (paymentId, receiptData) => {
    isLoading.value = true
    error.value = null
    try {
      const formData = new FormData()
      formData.append('receipt', receiptData.file)
      formData.append('amount', receiptData.amount)
      if (receiptData.referenceNumber) {
        formData.append('referenceNumber', receiptData.referenceNumber)
      }
      if (receiptData.receiptNote) {
        formData.append('receiptNote', receiptData.receiptNote)
      }

      const result = await $api(`/payments/${paymentId}/upload-receipt`, {
        method: 'POST',
        body: formData
      })
      currentPayment.value = result
      return result
    } catch (err) {
      error.value = err.data?.message || err.message
      console.error('Error uploading receipt:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // ยืนยัน/ปฏิเสธการชำระ (Driver)
  const verifyPayment = async (paymentId, verificationStatus, verificationNote = '') => {
    isLoading.value = true
    error.value = null
    try {
      const result = await $api(`/payments/${paymentId}/verify`, {
        method: 'PATCH',
        body: {
          verificationStatus,
          verificationNote
        }
      })
      currentPayment.value = result
      return result
    } catch (err) {
      error.value = err.data?.message || err.message
      console.error('Error verifying payment:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    payments,
    currentPayment,
    error,
    getOrCreatePayment,
    fetchPassengerPayments,
    fetchDriverPayments,
    uploadReceipt,
    verifyPayment
  }
}