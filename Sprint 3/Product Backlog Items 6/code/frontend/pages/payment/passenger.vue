<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-6xl mx-auto px-4">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">รายการชำระเงิน</h1>
        <p class="text-gray-600 mt-2">จัดการการชำระเงินสำหรับการเดินทางของคุณ</p>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="bg-red-50 border border-red-300 rounded-lg p-6 mb-6">
        <h3 class="text-red-900 font-semibold mb-2">เกิดข้อผิดพลาด</h3>
        <p class="text-red-700">{{ error }}</p>
        <button 
          @click="fetchPassengerPayments"
          class="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
        >
          ลองใหม่
        </button>
      </div>

      <!-- No Data -->
      <div v-else-if="payments.length === 0" class="text-center py-16">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-receipt text-3xl text-gray-400"></i>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">ไม่มีรายการชำระเงิน</h3>
        <p class="text-gray-600">คุณยังไม่มีรายการชำระเงินในระบบ</p>
      </div>

      <!-- Payments List -->
      <div v-else class="space-y-6">
        <div v-for="payment in payments" :key="payment.id" class="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <!-- Header with Status -->
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between mb-4">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ payment.booking?.route?.startLocation?.name || 'N/A' }} 
                  → 
                  {{ payment.booking?.route?.endLocation?.name || 'N/A' }}
                </h3>
                <p class="text-sm text-gray-600">
                  วันที่: {{ formatDate(payment.booking?.route?.departureTime) }}
                </p>
                <p class="text-sm text-gray-500">
                  ระยะทาง: {{ payment.booking?.route?.distance || 'N/A' }} | 
                  ระยะเวลา: {{ payment.booking?.route?.duration || 'N/A' }}
                </p>
              </div>
              <div class="text-right">
                <span class="text-2xl font-bold text-gray-900">{{ payment.amount }} ฿</span>
              </div>
            </div>

            <!-- ✅ Status Badge - แสดงแค่ Badge เดียว ตามสถานะปัจจุบัน -->
            <div class="flex flex-wrap gap-2">
              <!--  แสดงตามสถานะปัจจุบัน -->
              <span 
                :class="getCurrentStatusDisplay(payment).class" 
                class="px-3 py-1 text-sm font-medium rounded-full"
              >
                {{ getCurrentStatusDisplay(payment).text }}
              </span>
            </div>
          </div>

          <!-- Details Section -->
          <div class="px-6 py-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p class="text-sm text-gray-600">คนขับ</p>
                <p class="font-medium">{{ payment.driver?.firstName || 'N/A' }} {{ payment.driver?.lastName || '' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">วิธีการชำระ</p>
                <p class="font-medium">{{ getPaymentMethodDisplay(payment.paymentMethod) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">ราคาต่อที่นั่ง</p>
                <p class="font-medium">{{ payment.booking?.route?.pricePerSeat || 0 }} ฿</p>
              </div>
            </div>

            <!-- ✅ Timeline / Status Flow -->
            <div class="mt-4 pt-4 border-t border-gray-200">
              <p class="text-sm font-semibold text-gray-700 mb-3">📍 ขั้นตอนการชำระเงิน:</p>
              <div class="space-y-2 text-sm">
                <!-- Step 1: ชำระเงิน -->
                <div class="flex items-center gap-3">
                  <div :class="payment.status !== 'pending' ? 'bg-green-500' : 'bg-gray-300'" 
                    class="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    ✓
                  </div>
                  <span :class="payment.status !== 'pending' ? 'text-gray-900 font-medium' : 'text-gray-600'">
                    1. ชำระเงิน
                  </span>
                  <span v-if="payment.submittedAt" class="text-gray-500 text-xs">
                    {{ formatDate(payment.submittedAt) }}
                  </span>
                </div>

                <!-- Step 2: รอการตรวจสอบจากคนขับ -->
                <div class="flex items-center gap-3">
                  <div :class="['completed', 'cash_pending', 'approved', 'rejected'].includes(payment.status) ? 'bg-green-500' : 'bg-gray-300'" 
                    class="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    ✓
                  </div>
                  <span :class="['completed', 'cash_pending', 'approved', 'rejected'].includes(payment.status) ? 'text-gray-900 font-medium' : 'text-gray-600'">
                    2. รอการตรวจสอบจากคนขับ
                  </span>
                  <span v-if="['completed', 'cash_pending'].includes(payment.status) && (!payment.verificationStatus || payment.verificationStatus === 'pending')" 
                    class="animate-pulse text-gray-500 text-xs">
                     รอ...
                  </span>
                </div>

                <!-- Step 3: ยืนยันเรียบร้อย -->
                <div class="flex items-center gap-3">
                  <div :class="payment.verificationStatus === 'approved' || payment.status === 'approved' ? 'bg-green-500' : 'bg-gray-300'" 
                    class="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    ✓
                  </div>
                  <span :class="payment.verificationStatus === 'approved' || payment.status === 'approved' ? 'text-gray-900 font-medium' : 'text-gray-600'">
                    3. ยืนยันเรียบร้อย
                  </span>
                  <span v-if="(payment.verificationDate || payment.updatedAt) && (payment.verificationStatus === 'approved' || payment.status === 'approved')" 
                    class="text-gray-500 text-xs">
                     {{ formatDate(payment.verificationDate || payment.updatedAt) }}
                  </span>
                </div>
              </div>
            </div>

            <!--  OCR Data -->
            <div v-if="payment.ocrData" class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 class="font-semibold text-gray-900 mb-2"> ข้อมูลจากการอ่านสลิป</h4>
              <div class="text-sm text-gray-700 space-y-1">
                <p> จำนวนเงิน: <span class="font-medium">{{ payment.ocrData.amount }} ฿</span></p>
                <p v-if="payment.ocrData.referenceNumber"> อ้างอิง: <span class="font-medium">{{ payment.ocrData.referenceNumber }}</span></p>
                <p v-if="payment.ocrData.date"> วันที่: <span class="font-medium">{{ payment.ocrData.date }}</span></p>
              </div>
            </div>

            <!--  Verification Note - แสดงเมื่อปฏิเสธ -->
            <div v-if="payment.verificationStatus === 'rejected' && payment.verificationNote" 
              class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 class="font-semibold text-red-900 mb-2"> หมายเหตุจากคนขับ</h4>
              <p class="text-sm text-red-700">{{ payment.verificationNote }}</p>
              <p v-if="payment.verificationDate" class="text-xs text-red-600 mt-2">
                ตรวจสอบเมื่อ: {{ formatDate(payment.verificationDate) }}
              </p>
            </div>

            <!--  Verification Success -->
            <div v-if="(payment.verificationStatus === 'approved' || payment.status === 'approved') && payment.verificationNote" 
              class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 class="font-semibold text-green-900 mb-2"> หมายเหตุจากคนขับ</h4>
              <p class="text-sm text-green-700">{{ payment.verificationNote }}</p>
              <p class="text-xs text-green-600 mt-2">
                ตรวจสอบเมื่อ: {{ formatDate(payment.verificationDate || payment.updatedAt) }}
              </p>
            </div>
          </div>

          <!-- Actions Footer -->
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
            <!-- Pay Button (only when pending) -->
            <button
              v-if="payment.status === 'pending' && payment.amount > 0"
              @click="openPaymentModal(payment)"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
               ชำระเงิน
            </button>

            <!-- Free message -->
            <div v-else-if="payment.amount === 0" class="flex-1 bg-green-100 text-green-800 font-semibold py-2 px-4 rounded-lg text-center">
               ไม่มีค่าใช้จ่าย (ฟรี)
            </div>

            <!-- View Receipt Button -->
            <button
              v-if="payment.receiptImageUrl"
              @click="openReceipt(payment.receiptImageUrl)"
              class="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
               ดูสลิป
            </button>

            <!-- Download Receipt Button -->
            <button
              v-if="payment.status === 'approved' || payment.verificationStatus === 'approved'"
              @click="downloadReceipt(payment)"
              class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              ใบเสร็จรับเงิน
            </button>

            <!-- Download Tax Invoice Button -->
            <button
              v-if="payment.status === 'approved' || payment.verificationStatus === 'approved'"
              @click="downloadTaxInvoice(payment)"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              ใบกำกับภาษีแบบย่อ
            </button>

            <!-- Re-upload if rejected -->
            <button
              v-if="payment.verificationStatus === 'rejected' && payment.status !== 'pending'"
              @click="openPaymentModal(payment)"
              class="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
               ส่งใหม่
            </button>

            <!-- Status info -->
            <div v-else class="flex-1"></div>
          </div>
        </div>
      </div>

      <!-- Payment Modal -->
      <PaymentQRModal
        :is-open="showPaymentModal"
        :payment="selectedPayment"
        @close="handleCloseModal"
        @upload="handleUploadReceipt"
        @cash-payment="handleCashPayment"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import PaymentQRModal from '~/components/Payment/PaymentQRModal.vue'

definePageMeta({ 
  middleware: 'auth'
})

const { $api } = useNuxtApp()
const { user, token, logout } = useAuth()

// State
const payments = ref([])
const isLoading = ref(false)
const error = ref('')
const showPaymentModal = ref(false)
const selectedPayment = ref(null)

// Fetch payments
const fetchPassengerPayments = async () => {
  try {
    isLoading.value = true
    error.value = ''
    
    if (!user.value || !token.value) {
      error.value = 'ไม่พบข้อมูล authentication'
      return
    }
    
    const response = await $api('/payments/passenger')
    
    let paymentData = []
    if (Array.isArray(response)) {
      paymentData = response
    } else if (response?.data && Array.isArray(response.data)) {
      paymentData = response.data
    } else if (response?.payments && Array.isArray(response.payments)) {
      paymentData = response.payments
    }
    
    payments.value = paymentData
    console.log(' Payments loaded:', payments.value.length)
    
  } catch (err) {
    console.error(' Fetch payments error:', err)
    
    if (err.status === 401 || err.statusCode === 401) {
      error.value = 'Session หมดอายุ กรุณา login ใหม่'
      await logout()
      await navigateTo('/auth/login')
    } else {
      error.value = err.data?.message || err.message || 'ไม่สามารถโหลดข้อมูลได้'
    }
  } finally {
    isLoading.value = false
  }
}

// Handle modals
const openPaymentModal = (payment) => {
  selectedPayment.value = payment
  showPaymentModal.value = true
}

const handleCloseModal = () => {
  showPaymentModal.value = false
  selectedPayment.value = null
}

const openReceipt = (url) => {
  if (url) {
    window.open(url, '_blank')
  }
}



const downloadReceipt = (payment) => {
  const receiptNumber = `RCP-${payment.id?.substring(0, 8).toUpperCase() || 'XXXXXXXX'}`
  const route = payment.booking?.route || {}
  const driver = payment.driver || {}
  const passenger = payment.passenger || {}

  // ✅ ดึงข้อมูลจาก payment.passenger (API ส่งมา)
  const passengerName = `${passenger.firstName || user.value?.firstName || '-'} ${passenger.lastName || user.value?.lastName || ''}`.trim()
  const passengerEmail = passenger.email || user.value?.email || '-'
  const passengerPhone = passenger.phoneNumber || user.value?.phoneNumber || '-'

  // ✅ ดึงทะเบียนรถจาก payment.booking.route.vehicle.licensePlate
  const licensePlate = payment.booking?.route?.vehicle?.licensePlate || '-'

  const startLocation = route.startLocation?.name || route.startLocation || 'N/A'
  const endLocation = route.endLocation?.name || route.endLocation || 'N/A'
  const paymentMethodMap = {
    'bank_transfer': 'โอนผ่านธนาคาร / Bank Transfer',
    'qr_code': 'พร้อมเพย์ / PromptPay',
    'cash': 'เงินสด / Cash',
    'promptpay': 'พร้อมเพย์ / PromptPay',
    'mobile_wallet': 'กระเป๋าเงินดิจิทัล / Mobile Wallet'
  }
  const methodDisplay = paymentMethodMap[payment.paymentMethod] || payment.paymentMethod || 'N/A'

  const formatDateFull = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('th-TH', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  const html = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>ใบเสร็จรับเงิน ${receiptNumber}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Sarabun', sans-serif; background: #f3f4f6; display: flex; justify-content: center; align-items: flex-start; min-height: 100vh; padding: 20px; }
    .receipt { width: 148mm; min-height: 210mm; background: #fff; padding: 28px 32px; box-shadow: 0 4px 24px rgba(0,0,0,0.12); border-radius: 8px; position: relative; overflow: hidden; }
    .receipt::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 6px; background: linear-gradient(90deg, #10b981, #059669); }
    .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%) rotate(-30deg); font-size: 80px; font-weight: 700; color: rgba(16,185,129,0.06); pointer-events: none; white-space: nowrap; letter-spacing: 4px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb; margin-bottom: 20px; }
    .logo-area { display: flex; flex-direction: column; gap: 4px; }
    .logo-name { font-size: 22px; font-weight: 700; color: #10b981; letter-spacing: 1px; }
    .logo-sub { font-size: 11px; color: #6b7280; }
    .receipt-meta { text-align: right; }
    .receipt-title { font-size: 16px; font-weight: 700; color: #111827; }
    .receipt-title-en { font-size: 11px; color: #6b7280; margin-bottom: 6px; }
    .receipt-number { font-size: 13px; font-weight: 600; color: #10b981; background: #ecfdf5; padding: 3px 10px; border-radius: 20px; border: 1px solid #a7f3d0; display: inline-block; }
    .status-badge { display: inline-block; margin-top: 6px; padding: 2px 10px; background: #10b981; color: #fff; border-radius: 20px; font-size: 11px; font-weight: 600; }
    .section { margin-bottom: 16px; }
    .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #10b981; margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1px dashed #d1fae5; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; }
    .info-item { display: flex; flex-direction: column; gap: 2px; }
    .info-label { font-size: 10px; color: #9ca3af; }
    .info-value { font-size: 13px; font-weight: 500; color: #111827; }
    .route-box { background: linear-gradient(135deg, #f0fdf4, #ecfdf5); border: 1px solid #a7f3d0; border-radius: 8px; padding: 12px 16px; display: flex; align-items: center; gap: 10px; }
    .route-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
    .route-start { background: #10b981; }
    .route-end { background: #ef4444; }
    .route-line { width: 2px; height: 20px; background: linear-gradient(#10b981, #ef4444); margin: 2px auto; }
    .route-dots { display: flex; flex-direction: column; align-items: center; }
    .route-text { flex: 1; }
    .route-loc { font-size: 13px; font-weight: 600; color: #111827; }
    .total-box { background: linear-gradient(135deg, #10b981, #059669); border-radius: 10px; padding: 16px 20px; text-align: center; margin: 16px 0; color: #fff; }
    .total-label { font-size: 12px; opacity: 0.9; margin-bottom: 4px; }
    .total-amount { font-size: 32px; font-weight: 700; letter-spacing: 1px; }
    .total-baht { font-size: 16px; opacity: 0.9; }
    .footer { margin-top: 24px; padding-top: 16px; border-top: 1px dashed #e5e7eb; text-align: center; color: #9ca3af; font-size: 10px; line-height: 1.6; }
    .footer strong { color: #6b7280; }
    @media print {
      body { background: white; padding: 0; }
      .receipt { box-shadow: none; width: 100%; }
    }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="watermark">PAID</div>
    <div class="header">
      <div class="logo-area">
        <div class="logo-name">PaiNamNae</div>
        <div class="logo-sub">บริการรถร่วมเดินทาง</div>
        <div class="logo-sub">Ride-Sharing Service</div>
      </div>
      <div class="receipt-meta">
        <div class="receipt-title">ใบเสร็จรับเงิน</div>
        <div class="receipt-title-en">OFFICIAL RECEIPT</div>
        <div class="receipt-number">${receiptNumber}</div>
        <div><span class="status-badge">✓ ชำระแล้ว</span></div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">ข้อมูลผู้โดยสาร / Passenger</div>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">ชื่อ-นามสกุล / Full Name</span>
          <span class="info-value">${passenger.firstName || user.value?.firstName || '-'} ${passenger.lastName || user.value?.lastName || ''}</span>
        </div>
        <div class="info-item">
          <span class="info-label">อีเมล / Email</span>
          <span class="info-value">${passenger.email || user.value?.email || '-'}</span>
        </div>
        <div class="info-item">
          <span class="info-label">เบอร์โทร / Phone</span>
          <span class="info-value">${passenger.phoneNumber || user.value?.phoneNumber || '-'}</span>
        </div>
        <div class="info-item">
          <span class="info-label">เลขที่การจอง / Booking ID</span>
          <span class="info-value">${payment.bookingId?.substring(0, 12).toUpperCase() || '-'}</span>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">เส้นทาง / Route</div>
      <div class="route-box">
        <div class="route-dots">
          <div class="route-dot route-start"></div>
          <div class="route-line"></div>
          <div class="route-dot route-end"></div>
        </div>
        <div class="route-text">
          <div class="route-loc">${startLocation}</div>
          <div style="font-size:11px;color:#6b7280;margin:4px 0;">↓ ${route.distance || 'N/A'} km · ${route.duration || 'N/A'}</div>
          <div class="route-loc">${endLocation}</div>
        </div>
      </div>
      <div class="info-grid" style="margin-top:10px">
        <div class="info-item">
          <span class="info-label">วันเวลาเดินทาง / Departure</span>
          <span class="info-value">${formatDateFull(route.departureTime)}</span>
        </div>
        <div class="info-item">
          <span class="info-label">ราคาต่อที่นั่ง / Price/Seat</span>
          <span class="info-value">${route.pricePerSeat || 0} บาท</span>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">ข้อมูลคนขับ / Driver</div>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">ชื่อคนขับ / Driver Name</span>
          <span class="info-value">${driver.firstName || 'N/A'} ${driver.lastName || ''}</span>
        </div>
        <div class="info-item">
          <span class="info-label">ทะเบียนรถ / License Plate</span>
          <span class="info-value">${licensePlate || '-'}</span>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">การชำระเงิน / Payment</div>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">ช่องทางชำระ / Method</span>
          <span class="info-value">${methodDisplay}</span>
        </div>
        <div class="info-item">
          <span class="info-label">วันที่ยืนยัน / Confirmed At</span>
          <span class="info-value">${formatDateFull(payment.verifiedAt || payment.updatedAt)}</span>
        </div>
      </div>
    </div>

    <div class="total-box">
      <div class="total-label">ยอดรวมที่ชำระ / Total Amount Paid</div>
      <div><span class="total-amount">${payment.amount?.toLocaleString('th-TH') || '0'}</span> <span class="total-baht">฿ บาทถ้วน</span></div>
    </div>

    <div class="footer">
      <strong>PaiNamNae Ride-Sharing</strong><br>
      เอกสารนี้ออกโดยระบบอัตโนมัติ / This receipt is system-generated<br>
      วันที่พิมพ์ / Printed: ${new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
    </div>
  </div>
  <script>window.onload = function(){ window.print(); }<\/script>
</body>
</html>`

  const win = window.open('', '_blank', 'width=700,height=900')
  win.document.write(html)
  win.document.close()
}




const downloadTaxInvoice = (payment) => {
  // Invoice number: ใช้ ID เป็น sequential (ในส่วนที่ 5 ตัวสุดท้าย)
  const invoiceNumber = `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${payment.id?.substring(0, 5).toUpperCase() || 'XXXXX'}`
  
  const route = payment.booking?.route || {}
  const passenger = payment.passenger || {}
  const driver = payment.driver || {}
  
  // Mapping วิธีการชำระ
  const paymentMethodMap = {
    'bank_transfer': 'โอนผ่านธนาคาร',
    'qr_code': 'QR Code (PromptPay)',
    'cash': 'เงินสด',
    'promptpay': 'PromptPay',
    'mobile_wallet': 'Mobile Wallet'
  }
  const methodDisplay = paymentMethodMap[payment.paymentMethod] || payment.paymentMethod || 'โอนเงิน'

  const startLocation = route.startLocation?.name || 'N/A'
  const endLocation = route.endLocation?.name || 'N/A'
  
  // คำนวณภาษี
  const baseAmount = Math.round(payment.amount / 1.07 * 100) / 100
  const vatAmount = Math.round((payment.amount - baseAmount) * 100) / 100
  
  const formatDateShort = (date) => {
    if (!date) return 'DD/MM/YY'
    const d = new Date(date)
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getFullYear()).slice(-2)}`
  }

  const convertNumberToThaiText = (num) => {
    const thaiNumbers = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า']
    const units = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน']
    
    if (num === 0) return 'ศูนย์บาท'
    
    let result = ''
    let unitIndex = 0
    const numStr = Math.floor(num).toString().split('').reverse().join('')
    
    for (let i = 0; i < numStr.length; i++) {
      const digit = parseInt(numStr[i])
      if (digit !== 0) {
        if (i === 1 && digit === 1) {
          result = 'สิบ' + result
        } else {
          result = thaiNumbers[digit] + units[i] + result
        }
      }
      unitIndex++
    }
    
    return result + 'บาทถ้วน'
  }

  const html = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>ใบกำกับภาษีอย่างย่อ ${invoiceNumber}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Sarabun', sans-serif; background: #f5f5f5; padding: 20px; }
    .invoice { width: 210mm; margin: 0 auto; background: white; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    
    .header-section { text-align: center; margin-bottom: 20px; border-bottom: 2px dashed #333; padding-bottom: 15px; }
    .company-name { font-size: 18px; font-weight: 700; margin-bottom: 5px; }
    .company-info { font-size: 12px; color: #666; line-height: 1.4; margin-bottom: 10px; }
    .tax-info { font-size: 11px; color: #666; }
    
    .invoice-title { font-size: 20px; font-weight: 700; text-align: center; margin: 15px 0; }
    
    .invoice-meta { display: flex; justify-content: space-between; margin: 15px 0; font-size: 12px; padding: 0 10px; border-bottom: 1px dashed #999; padding-bottom: 10px; }
    .meta-item { display: flex; gap: 20px; }
    .meta-label { font-weight: 600; width: 80px; }
    
    .items-table { width: 100%; margin: 15px 0; border-collapse: collapse; }
    .items-table th { background: #f0f0f0; border: 1px solid #ddd; padding: 8px; font-size: 12px; font-weight: 600; text-align: left; }
    .items-table td { border: 1px solid #ddd; padding: 8px; font-size: 12px; }
    .items-table .text-center { text-align: center; }
    .items-table .text-right { text-align: right; }
    
    .summary-section { margin: 15px 0; }
    .summary-row { display: flex; justify-content: flex-end; gap: 10px; margin: 5px 0; font-size: 12px; }
    .summary-label { width: 150px; text-align: right; }
    .summary-value { width: 100px; text-align: right; }
    
    .total-row { display: flex; justify-content: flex-end; gap: 10px; margin: 8px 0; font-weight: 700; font-size: 14px; padding: 8px; background: #f9f9f9; border: 2px solid #333; }
    .total-label { width: 150px; text-align: right; }
    .total-value { width: 100px; text-align: right; }
    
    .amount-words { margin: 15px 10px; font-size: 12px; padding: 8px; background: #fafafa; border-left: 3px solid #333; }
    .amount-words-label { font-weight: 600; font-size: 11px; }
    .amount-words-text { font-size: 12px; margin-top: 3px; }
    
    .footer { text-align: center; font-size: 10px; color: #999; margin-top: 20px; border-top: 1px dashed #999; padding-top: 10px; }
    
    .divider { border-bottom: 1px dashed #999; margin: 10px 0; }
    
    @media print {
      body { background: white; padding: 0; }
      .invoice { box-shadow: none; width: 100%; margin: 0; }
    }
  </style>
</head>
<body>
  <div class="invoice">
    <!-- HEADER -->
    <div class="header-section">
      <div class="company-name">บริษัท ไพนำแน จำกัด</div>
      <div class="company-info">
        <div>เลขที่ 123 ซอยลาศ แขวงลาศ เขตปทุมวัน กรุงเทพมหานคร 10110</div>
        <div>โทรศัพท์: 02-1234-5678</div>
      </div>
      <div class="tax-info">
        <div>เลขประจำตัวผู้เสียภาษี: 0123456789012 | สาขาที่ 00001</div>
      </div>
    </div>

    <!-- TITLE -->
    <div class="invoice-title">ใบกำกับภาษีอย่างย่อ</div>
    <div class="divider"></div>

    <!-- META INFO -->
    <div class="invoice-meta">
      <div class="meta-item">
        <div><span class="meta-label">วันที่:</span> ${formatDateShort(payment.createdAt)}</div>
      </div>
      <div class="meta-item">
        <div><span class="meta-label">เลขที่:</span> ${invoiceNumber}</div>
      </div>
    </div>
    <div class="divider"></div>

    <!-- ITEMS TABLE -->
    <table class="items-table">
      <thead>
        <tr>
          <th style="width: 50%;">รายการ</th>
          <th style="width: 12%;" class="text-center">จำนวน</th>
          <th style="width: 15%;" class="text-right">ราคา</th>
          <th style="width: 10%;" class="text-right">ส่วนลด</th>
          <th style="width: 13%;" class="text-right">รวม</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>ค่าบริการรับส่ง (${startLocation} → ${endLocation})</td>
          <td class="text-center">1</td>
          <td class="text-right">${baseAmount.toFixed(2)}</td>
          <td class="text-right">-</td>
          <td class="text-right">${baseAmount.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>

    <!-- SUMMARY -->
    <div class="summary-section">
      <div class="summary-row">
        <div class="summary-label">เงินรวมก่อนภาษี:</div>
        <div class="summary-value">${baseAmount.toFixed(2)}</div>
      </div>
      <div class="summary-row">
        <div class="summary-label">ภาษีมูลค่าเพิ่ม 7.00%:</div>
        <div class="summary-value">${vatAmount.toFixed(2)}</div>
      </div>
      <div class="divider"></div>
      <div class="total-row">
        <div class="total-label">ยอดรวมทั้งสิ้น:</div>
        <div class="total-value">${payment.amount.toFixed(2)}</div>
      </div>
    </div>

    <!-- AMOUNT IN WORDS -->
    <div class="amount-words">
      <div class="amount-words-label">จำนวนเงิน(ตัวอักษร):</div>
      <div class="amount-words-text">${convertNumberToThaiText(payment.amount)}</div>
    </div>

    <div class="divider"></div>

    <!-- PAYMENT INFO -->
    <div class="invoice-meta" style="border: none; padding: 10px 0;">
      <div class="meta-item">
        <div><span class="meta-label">ชื่อผู้ซื้อ:</span> ${passenger.firstName || '-'} ${passenger.lastName || ''}</div>
      </div>
      <div class="meta-item">
        <div><span class="meta-label">วิธีชำระ:</span> ${methodDisplay}</div>
      </div>
    </div>

    <!-- FOOTER -->
    <div class="footer">
      <p>เอกสารนี้ออกโดยระบบอัตโนมัติ</p>
      <p>วันที่พิมพ์: ${new Date().toLocaleDateString('th-TH')}</p>
    </div>
  </div>

  <script>
    window.onload = function() { 
      window.print(); 
    }
  <\/script>
</body>
</html>`

  const win = window.open('', '_blank', 'width=800,height=1000')
  win.document.write(html)
  win.document.close()
}



// Handle payments
const handleCashPayment = async (cashData) => {
  try {
    const response = await $api(`/payments/${cashData.paymentId}/cash-confirm`, {
      method: 'POST',
      body: { method: 'cash' }
    })
    
    console.log(' Cash payment confirmed:', response)
    handleCloseModal()
    await fetchPassengerPayments()
  } catch (err) {
    console.error(' Cash payment error:', err)
    error.value = err.data?.message || 'ไม่สามารถยืนยันการชำระเงินสดได้'
  }
}

const handleUploadReceipt = async (uploadData) => {
  try {
    const formData = new FormData()
    formData.append('receipt', uploadData.file)
    formData.append('amount', uploadData.amount)
    formData.append('referenceNumber', uploadData.referenceNumber || '')
    
    const response = await $api(`/payments/${selectedPayment.value.id}/upload-receipt`, {
      method: 'POST',
      body: formData
    })
    
    console.log(' Receipt uploaded:', response)
    handleCloseModal()
    await fetchPassengerPayments()
  } catch (err) {
    console.error(' Upload receipt error:', err)
    error.value = err.data?.message || 'ไม่สามารถอัปโหลดสลิปได้'
  }
}

// Format date
const formatDate = (date) => {
  if (!date) return 'ไม่ระบุ'
  try {
    return new Date(date).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (e) {
    return 'ไม่ระบุ'
  }
}

// ✅ ฟังก์ชันใหม่ - แสดง Status ปัจจุบัน (แค่ Badge เดียว)
const getCurrentStatusDisplay = (payment) => {
  // ✅ ถ้า payment status = approved → แสดง approved
  if (payment.status === 'approved') {
    return {
      text: ' ชำระเรียบร้อย',
      class: 'bg-green-100 text-green-800'
    }
  }

  // ✅ ถ้า payment status = rejected → แสดง rejected
  if (payment.status === 'rejected') {
    return {
      text: ' ถูกปฏิเสธ',
      class: 'bg-red-100 text-red-800'
    }
  }

  // ✅ ถ้า status = cash_pending → แสดง cash_pending (ไม่สนใจ verification status)
  if (payment.status === 'cash_pending') {
    return {
      text: ' รอยืนยันเงินสด',
      class: 'bg-orange-100 text-orange-800'
    }
  }

  // ✅ ถ้า status = completed → แสดง completed (ไม่สนใจ verification status)
  if (payment.status === 'completed') {
    return {
      text: ' รอการยืนยัน',
      class: 'bg-blue-100 text-blue-800'
    }
  }

  // ✅ ถ้า status = pending → แสดง pending
  if (payment.status === 'pending') {
    return {
      text: ' รอชำระเงิน',
      class: 'bg-yellow-100 text-yellow-800'
    }
  }

  // default
  return {
    text: payment.status || 'ไม่ทราบ',
    class: 'bg-gray-100 text-gray-800'
  }
}

// ✅ Payment Method Display
const getPaymentMethodDisplay = (method) => {
  const methods = {
    'bank_transfer': ' โอนจากธนาคาร',
    'qr_code': 'QR Code Payment',
    'cash': ' เงินสด',
    'mobile_wallet': ' Mobile Wallet'
  }
  return methods[method] || method || 'ยังไม่เลือก'
}

// Mount
onMounted(async () => {
  await fetchPassengerPayments()
})
</script>

<style scoped>
</style>