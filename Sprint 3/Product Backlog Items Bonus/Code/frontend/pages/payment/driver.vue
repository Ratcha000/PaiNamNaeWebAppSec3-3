<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8">
    <!-- Header Section -->
    <div class="max-w-6xl mx-auto px-4 mb-8">
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-slate-900">ตรวจสอบการชำระเงิน</h1>
            <p class="text-slate-500 mt-2 text-sm md:text-base">รีวิวและยืนยันรายการชำระเงินจากผู้โดยสาร</p>
          </div>
          
          <NuxtLink 
            to="/driver/qrCode"
            class="flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg transition shadow-sm hover:shadow-md whitespace-nowrap"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="hidden sm:inline">จัดการ QR Code</span>
            <span class="sm:hidden">QR Code</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4">
      <!-- Error Message -->
      <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
        <p class="font-semibold text-sm">{{ error }}</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-24">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-2 border-slate-200 border-t-slate-800 mx-auto mb-4"></div>
          <p class="text-slate-600 text-sm">กำลังโหลด...</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="pendingPayments.length === 0" class="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
        <svg class="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-slate-600 text-lg font-medium">ไม่มีรายการที่รอตรวจสอบ</p>
        <p class="text-slate-400 text-sm mt-2">รายการทั้งหมดได้รับการประมวลผลแล้ว</p>
      </div>

      <!-- Payment Cards Grid -->
      <div v-else class="grid grid-cols-1 gap-6">
        <div
          v-for="payment in pendingPayments"
          :key="payment.id"
          class="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
        >
          <!-- Header with Amount -->
          <div class="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-slate-900">
                  {{ payment.passenger.firstName }} {{ payment.passenger.lastName }}
                </h3>
                <p class="text-sm text-slate-500 mt-1">{{ payment.passenger.email }}</p>
              </div>
              <div class="text-right">
                <p class="text-3xl font-bold text-slate-900">{{ payment.amount }}&nbsp;<span class="text-xl text-slate-600">฿</span></p>
                <span class="inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700 border border-yellow-300">
                  รอตรวจสอบ
                </span>
              </div>
            </div>
          </div>

          <!-- Route Info -->
          <div v-if="payment.booking?.route" class="px-6 py-4 border-b border-slate-100">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <p class="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-2">จากต้นทาง</p>
                <p class="text-base font-semibold text-slate-900">
                  {{ typeof payment.booking.route.startLocation === 'string' 
                    ? payment.booking.route.startLocation 
                    : payment.booking.route.startLocation.name }}
                </p>
              </div>
              <div>
                <p class="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-2">ปลายทาง</p>
                <p class="text-base font-semibold text-slate-900">
                  {{ typeof payment.booking.route.endLocation === 'string' 
                    ? payment.booking.route.endLocation 
                    : payment.booking.route.endLocation.name }}
                </p>
              </div>
            </div>

            <!-- Payment Method -->
            <div class="pt-4 border-t border-slate-100">
              <p class="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-2">วิธีชำระเงิน</p>
              <p class="text-base font-semibold" :class="getPaymentMethodColor(payment)">
                {{ getPaymentMethodLabel(payment) }}
              </p>
            </div>
          </div>

          <!-- OCR Data Section - ✅ แก้ไข -->
          <div v-if="payment.ocrData" class="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h4 class="font-semibold text-slate-900 mb-4">ข้อมูลจากการตรวจสลิป (OCR)</h4>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <!-- จำนวนเงิน -->
              <div class="bg-white p-4 rounded-lg border border-slate-200">
                <p class="text-xs text-slate-500 uppercase font-semibold tracking-wide mb-2">จำนวนเงิน</p>
                <p :class="isAmountMatch(payment) ? 'text-emerald-600' : payment.ocrData.amount ? 'text-red-600' : 'text-slate-400'" 
                   class="text-2xl font-bold">
                  {{ payment.ocrData.amount ?? '-' }} ฿
                </p>
                <!-- ✅ สถานะการตรวจสอบ -->
                <div v-if="isAmountMatch(payment)" class="mt-2 flex items-center gap-1">
                  <svg class="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-xs font-semibold text-emerald-600">ตรงกัน</span>
                </div>
                <div v-else-if="payment.ocrData.amount" class="mt-2 flex items-center gap-1">
                  <svg class="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-xs font-semibold text-red-600">ไม่ตรง</span>
                </div>
                <div v-else-if="payment.ocrData.ocrFailed" class="mt-2 flex items-center gap-1">
                  <svg class="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-xs font-semibold text-orange-600">อ่านไม่ได้</span>
                </div>
              </div>

              <!-- วันที่ -->
              <div class="bg-white p-4 rounded-lg border border-slate-200">
                <p class="text-xs text-slate-500 uppercase font-semibold tracking-wide mb-2">วันที่</p>
                <p class="text-sm font-semibold text-slate-900">{{ formatDate(payment.ocrData.date) }}</p>
                <p class="text-xs text-slate-400 mt-1">
                  {{ payment.ocrData.source === 'tesseract_ocr' ? '(อ่านจากรูป)' : '(วันที่อัปโหลด)' }}
                </p>
              </div>

              <!-- Reference -->
              <div class="bg-white p-4 rounded-lg border border-slate-200">
                <p class="text-xs text-slate-500 uppercase font-semibold tracking-wide mb-2">Reference</p>
                <p class="text-sm font-semibold text-slate-900">{{ payment.ocrData.referenceNumber || '-' }}</p>
              </div>
            </div>

            <!-- Amount Validation Alert -->
            <div v-if="isAmountMatch(payment)" class="bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
              <p class="text-emerald-800 font-semibold text-sm">จำนวนเงินตรงกัน</p>
            </div>
            <div v-else-if="payment.ocrData.amount && !payment.ocrData.ocrFailed" class="bg-red-50 border border-red-200 p-3 rounded-lg">
              <p class="text-red-800 font-semibold text-sm">ข้อเตือน: จำนวนเงินไม่ตรงกัน</p>
              <p class="text-xs text-red-700 mt-1">
                ควรได้ {{ payment.amount }} ฿ แต่สลิปแสดง {{ payment.ocrData.amount }} ฿
              </p>
            </div>
            <div v-else-if="payment.ocrData.ocrFailed" class="bg-orange-50 border border-orange-200 p-3 rounded-lg">
              <p class="text-orange-800 font-semibold text-sm">ไม่สามารถอ่านสลิปอัตโนมัติ</p>
              <p class="text-xs text-orange-700 mt-1">{{ payment.ocrData.error || 'ลองอีกครั้งหรือตรวจสอบคุณภาพของรูป' }}</p>
            </div>
          </div>

          <!-- Receipt Image -->
          <div v-if="payment.receiptImageUrl" class="px-6 py-4 border-b border-slate-100">
            <h4 class="font-semibold text-slate-900 mb-4">รูปสลิป</h4>
            
            <div class="flex flex-col lg:flex-row gap-6">
              <img 
                :src="payment.receiptImageUrl" 
                alt="Receipt"
                @click="openReceiptModal(payment.receiptImageUrl)"
                class="w-full lg:w-56 h-72 object-cover rounded-lg border border-slate-300 hover:border-slate-500 cursor-pointer transition shadow-sm hover:shadow-md"
              />
              <div class="flex-1">
                <button
                  @click="openReceiptModal(payment.receiptImageUrl)"
                  class="mb-4 w-full bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-2 px-4 rounded-lg transition text-sm"
                >
                  ดูขนาดใหญ่
                </button>

                <div class="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <p class="text-sm font-semibold text-yellow-900 mb-3">รายการตรวจสอบ:</p>
                  <ul class="text-sm text-yellow-800 space-y-2.5">
                    <li class="flex items-start gap-3">
                      <svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                      <span>ชื่อธนาคารตรงกับ QR Code</span>
                    </li>
                    <li class="flex items-start gap-3">
                      <svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                      <span>จำนวนเงินตรงกับการจอง</span>
                    </li>
                    <li class="flex items-start gap-3">
                      <svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                      <span>ชื่อบัญชีปลายทาง (Prompt Pay)</span>
                    </li>
                    <li class="flex items-start gap-3">
                      <svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                      <span>วันที่สลิปตรงกับการชำระ</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Status Alert -->
          <div v-else class="px-6 py-4 border-b border-slate-100">
            <div v-if="payment.paymentMethod === 'cash' || payment.status === 'cash_pending'" class="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p class="text-blue-900 font-semibold text-sm">ชำระด้วยเงินสด</p>
              <p class="text-xs text-blue-700 mt-1.5">กรุณายืนยันการรับเงินสดจากผู้โดยสาร</p>
            </div>
            <div v-else class="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p class="text-yellow-900 font-semibold text-sm">{{ payment.paymentMethod === 'transfer' ? 'โอนธนาคาร' : 'QR Code' }}</p>
              <p class="text-xs text-yellow-700 mt-1.5">รอรูปสลิปจากผู้โดยสาร</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="px-6 py-4 bg-white flex gap-3 border-t border-slate-100">
            <button
              @click="openVerificationModal(payment, 'approved')"
              :disabled="isSubmitting === payment.id"
              class="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-semibold py-2.5 px-4 rounded-lg transition text-sm shadow-sm hover:shadow-md"
            >
              <span v-if="isSubmitting !== payment.id">ยืนยันการชำระ</span>
              <span v-else>กำลังบันทึก...</span>
            </button>
            <button
              @click="openVerificationModal(payment, 'rejected')"
              :disabled="isSubmitting === payment.id"
              class="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white font-semibold py-2.5 px-4 rounded-lg transition text-sm shadow-sm hover:shadow-md"
            >
              <span v-if="isSubmitting !== payment.id">ปฏิเสธการชำระ</span>
              <span v-else>กำลังบันทึก...</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Receipt Modal -->
    <div v-if="showReceiptModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div class="relative max-w-3xl w-full">
        <button
          @click="showReceiptModal = false"
          class="absolute -top-10 right-0 text-white hover:text-slate-200 transition"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div class="bg-white rounded-xl overflow-hidden shadow-2xl">
          <img :src="selectedReceiptUrl" alt="สลิป" class="w-full h-auto object-contain" />
        </div>
      </div>
    </div>

    <!-- Verification Modal -->
    <div v-if="showVerificationModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <!-- Header -->
        <div :class="verificationStatus === 'approved' 
          ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-200' 
          : 'bg-gradient-to-r from-red-50 to-pink-50 border-b border-red-200'" 
          class="p-6">
          <h2 :class="verificationStatus === 'approved' ? 'text-emerald-900' : 'text-red-900'" class="text-lg font-semibold">
            {{ verificationStatus === 'approved' ? 'ยืนยันการชำระเงิน' : 'ปฏิเสธการชำระเงิน' }}
          </h2>
        </div>

        <!-- Body -->
        <div class="p-6">
          <div v-if="selectedPayment" class="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <p class="text-xs text-slate-500 uppercase font-semibold tracking-wide">ผู้โดยสาร</p>
            <p class="font-semibold text-slate-900 mt-2">{{ selectedPayment.passenger.firstName }} {{ selectedPayment.passenger.lastName }}</p>
            <p class="text-2xl font-bold text-slate-900 mt-3">{{ selectedPayment.amount }} ฿</p>
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-900 mb-2">
              {{ verificationStatus === 'approved' ? 'หมายเหตุ (ไม่จำเป็น)' : 'เหตุผลการปฏิเสธ' }}
            </label>
            <textarea
              v-model="verificationNote"
              :placeholder="verificationStatus === 'approved' 
                ? 'เช่น: สลิปตรวจสอบเรียบร้อย' 
                : 'ระบุเหตุผล...'"
              rows="4"
              class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm placeholder-slate-400"
              :class="verificationStatus === 'approved' 
                ? 'focus:ring-emerald-500' 
                : 'focus:ring-red-500'"
            ></textarea>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex gap-3">
          <button
            @click="showVerificationModal = false"
            :disabled="isSubmitting === selectedPayment?.id"
            class="flex-1 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold rounded-lg disabled:opacity-50 transition text-sm"
          >
            ยกเลิก
          </button>
          <button
            @click="handleVerification"
            :disabled="isSubmitting === selectedPayment?.id"
            :class="verificationStatus === 'approved' 
              ? 'bg-emerald-600 hover:bg-emerald-700' 
              : 'bg-red-600 hover:bg-red-700'"
            class="flex-1 px-4 py-2 text-white font-semibold rounded-lg disabled:opacity-50 transition text-sm shadow-sm hover:shadow-md"
          >
            <span v-if="isSubmitting !== selectedPayment?.id">
              {{ verificationStatus === 'approved' ? 'ยืนยัน' : 'ปฏิเสธ' }}
            </span>
            <span v-else>กำลังบันทึก...</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  middleware: 'auth'
})

const { $api } = useNuxtApp()

// State
const isLoading = ref(false)
const error = ref('')
const payments = ref([])
const isSubmitting = ref(null)

// Modal
const showReceiptModal = ref(false)
const selectedReceiptUrl = ref('')

const showVerificationModal = ref(false)
const selectedPayment = ref(null)
const verificationStatus = ref(null)
const verificationNote = ref('')

// Computed
const pendingPayments = computed(() => {
  return payments.value.filter(p => p.verificationStatus === 'pending')
})

// Fetch
const fetchDriverPayments = async () => {
  try {
    isLoading.value = true
    error.value = ''

    const response = await $api('/payments/driver/list', {
      query: {
        verificationStatus: 'pending',
        page: 1,
        limit: 20
      }
    })

    payments.value = response.data || response.payments || response || []
    console.log('✅ Loaded payments:', payments.value.length)
    
  } catch (err) {
    error.value = err.data?.message || 'ไม่สามารถดึงข้อมูลได้'
    console.error('Error:', err)
  } finally {
    isLoading.value = false
  }
}

// Modals
const openReceiptModal = (url) => {
  selectedReceiptUrl.value = url
  showReceiptModal.value = true
}

const openVerificationModal = (payment, status) => {
  selectedPayment.value = payment
  verificationStatus.value = status
  verificationNote.value = ''
  showVerificationModal.value = true
}

// Handle
const handleVerification = async () => {
  if (!selectedPayment.value) return

  isSubmitting.value = selectedPayment.value.id

  try {
    await $api(`/payments/${selectedPayment.value.id}/verify`, {
      method: 'PATCH',
      body: {
        status: verificationStatus.value,
        note: verificationNote.value
      }
    })

    const msg = verificationStatus.value === 'approved'
      ? `ยืนยันการชำระ ${selectedPayment.value.amount} ฿ สำเร็จแล้ว`
      : 'ปฏิเสธการชำระเงินสำเร็จแล้ว'

    alert(msg)
    showVerificationModal.value = false
    await fetchDriverPayments()
  } catch (err) {
    alert(err.data?.message || 'เกิดข้อผิดพลาด')
  } finally {
    isSubmitting.value = null
  }
}

// Helpers
const isAmountMatch = (payment) => payment.ocrData?.amount === payment.amount

const formatDate = (dateString) => {
  if (!dateString) return '-'
  try {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (e) {
    return dateString
  }
}

const getPaymentMethodLabel = (payment) => {
  const method = payment.paymentMethod
  const status = payment.status
  
  if (method === 'cash' || status === 'cash_pending') return 'เงินสด'
  if (method === 'transfer' || status === 'completed') return 'โอนธนาคาร'
  if (method === 'qrcode') return 'QR Code'
  return 'ไม่ระบุ'
}

const getPaymentMethodColor = (payment) => {
  const method = payment.paymentMethod
  const status = payment.status
  
  if (method === 'cash' || status === 'cash_pending') return 'text-blue-600'
  if (method === 'transfer' || status === 'completed') return 'text-purple-600'
  if (method === 'qrcode') return 'text-cyan-600'
  return 'text-slate-600'
}

onMounted(() => {
  fetchDriverPayments()
})
</script>

<style scoped>
</style>