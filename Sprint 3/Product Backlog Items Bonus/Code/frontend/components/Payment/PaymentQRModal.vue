<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
      
      <!-- ✅ Step 1: เลือกวิธีการชำระ -->
      <div v-if="step === 1">
        <h2 class="text-2xl font-bold mb-4">ชำระเงิน {{ payment?.amount }} ฿</h2>
        <p class="text-gray-600 mb-6">เลือกวิธีการชำระเงินให้ {{ payment?.driver?.firstName }} {{ payment?.driver?.lastName }}</p>
        
        <div class="space-y-3 mb-6">
          <!-- ✅ เงินสด -->
          <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer transition"
            :class="selectedMethod === 'cash' ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400'">
            <input
              type="radio"
              v-model="selectedMethod"
              value="cash"
              class="w-4 h-4 text-green-600"
            />
            <div class="ml-3">
              <p class="font-semibold text-gray-900">เงินสด</p>
              <p class="text-sm text-gray-600">จ่ายเงินสดให้คนขับโดยตรง</p>
            </div>
          </label>

          <!-- ✅ QR Code / PromptPay -->
          <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer transition"
            :class="selectedMethod === 'promptpay' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'"
            v-if="payment?.driver?.qrCodeUrl">
            <input
              type="radio"
              v-model="selectedMethod"
              value="promptpay"
              class="w-4 h-4 text-blue-600"
            />
            <div class="ml-3">
              <p class="font-semibold text-gray-900">QR Code / PromptPay</p>
              <p class="text-sm text-gray-600">สแกน QR Code ผ่านแอปธนาคาร</p>
            </div>
          </label>

          <!-- ✅ โอนเงินผ่านธนาคาร -->
          <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer transition"
            :class="selectedMethod === 'transfer' ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400'"
            v-if="payment?.driver?.bankInfo">
            <input
              type="radio"
              v-model="selectedMethod"
              value="transfer"
              class="w-4 h-4 text-purple-600"
            />
            <div class="ml-3">
              <p class="font-semibold text-gray-900">โอนเงินผ่านธนาคาร</p>
              <p class="text-sm text-gray-600">โอนเงินไปยังบัญชีธนาคาร</p>
            </div>
          </label>
        </div>

        <button
          @click="handleNext"
          :disabled="!selectedMethod"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg mb-3 font-semibold"
        >
          ดำเนินการต่อ
        </button>
        <button
          @click="$emit('close')"
          class="w-full border border-gray-300 text-gray-700 py-3 rounded-lg"
        >
          ยกเลิก
        </button>
      </div>

      <!-- ✅ Step 2a: เงินสด - ยืนยันทันที -->
      <div v-else-if="step === 2 && selectedMethod === 'cash'">
        <h2 class="text-2xl font-bold mb-4">ชำระเงินสด</h2>
        
        <div class="bg-green-50 border border-green-300 rounded-lg p-6 mb-6">
          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-money-bill-wave text-2xl text-green-600"></i>
            </div>
            <h3 class="text-lg font-bold text-green-900 mb-2">จ่ายเงินสดให้คนขับ</h3>
            <p class="text-3xl font-bold text-green-700 mb-2">{{ payment?.amount }} ฿</p>
            <p class="text-sm text-green-700">กรุณาจ่ายเงินสดจำนวนนี้ให้คนขับโดยตรง</p>
          </div>
        </div>

        <div class="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
          <p class="text-sm text-yellow-800">
            <i class="fas fa-info-circle mr-2"></i>
            <strong>หมายเหตุ:</strong> เมื่อกดยืนยัน คนขับจะได้รับแจ้งเตือนให้ยืนยันว่าได้รับเงินสดแล้ว
          </p>
        </div>

        <button
          @click="handleCashPayment"
          class="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg mb-3 font-semibold"
        >
          <i class="fas fa-check mr-2"></i>
          ยืนยันจ่ายเงินสดแล้ว
        </button>
        <button
          @click="step = 1"
          class="w-full border border-gray-300 text-gray-700 py-3 rounded-lg"
        >
          ย้อนกลับ
        </button>
      </div>

      <!-- ✅ Step 2b: QR Code -->
      <div v-else-if="step === 2 && selectedMethod === 'promptpay'">
        <h2 class="text-2xl font-bold mb-4">สแกน QR Code</h2>
        
        <div class="bg-blue-50 border border-blue-300 rounded-lg p-6 text-center mb-6">
          <h3 class="text-lg font-bold text-blue-900 mb-4">PromptPay QR Code</h3>
          
          <!-- ✅ แสดง QR Code -->
          <div class="bg-white p-4 rounded-lg shadow-md inline-block mb-4">
            <img
              v-if="payment?.driver?.qrCodeUrl"
              :src="payment.driver.qrCodeUrl"
              alt="QR Code"
              class="w-64 h-64 object-contain mx-auto"
              @error="handleImageError"
            />
            <div v-else class="w-64 h-64 flex items-center justify-center bg-gray-100 rounded">
              <p class="text-gray-500">ไม่พบ QR Code</p>
            </div>
          </div>
          
          <div class="space-y-2">
            <p class="text-sm text-blue-700 font-medium">สแกน QR Code นี้เพื่อชำระเงิน</p>
            <p class="text-2xl font-bold text-blue-800">{{ payment?.amount }} ฿</p>
            <div class="flex items-center justify-center gap-2 text-xs text-blue-600">
              <span>Secure Payment</span>
              <span>•</span>
              <span>PromptPay Ready</span>
            </div>
          </div>
        </div>

        <button
          @click="step = 3"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg mb-3 font-semibold"
        >
          ฉันชำระเงินแล้ว
        </button>
        <button
          @click="step = 1"
          class="w-full border border-gray-300 text-gray-700 py-3 rounded-lg"
        >
          ย้อนกลับ
        </button>
      </div>

      <!-- ✅ Step 2c: โอนเงินผ่านธนาคาร -->
      <div v-else-if="step === 2 && selectedMethod === 'transfer'">
        <h2 class="text-2xl font-bold mb-4">โอนเงินผ่านธนาคาร</h2>
        
        <div class="bg-purple-50 border border-purple-300 rounded-lg p-6 mb-6">
          <h3 class="text-lg font-bold text-purple-900 mb-4">ข้อมูลบัญชีธนาคาร</h3>
          
          <div class="space-y-4">
            <!-- Bank Name -->
            <div class="bg-white rounded-lg p-4">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-600">ธนาคาร</span>
                <button 
                  @click="copyToClipboard(payment?.driver?.bankInfo?.bankName)"
                  class="text-blue-600 hover:text-blue-700 text-sm"
                >
                  คัดลอก
                </button>
              </div>
              <p class="text-lg font-bold text-gray-900">{{ payment?.driver?.bankInfo?.bankName }}</p>
            </div>

            <!-- Account Number -->
            <div class="bg-white rounded-lg p-4">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-600">เลขบัญชี</span>
                <button 
                  @click="copyToClipboard(payment?.driver?.bankInfo?.accountNumber)"
                  class="text-blue-600 hover:text-blue-700 text-sm"
                >
                  คัดลอก
                </button>
              </div>
              <p class="text-lg font-bold font-mono text-gray-900">{{ payment?.driver?.bankInfo?.accountNumber }}</p>
            </div>

            <!-- Account Name -->
            <div class="bg-white rounded-lg p-4">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-600">ชื่อบัญชี</span>
                <button 
                  @click="copyToClipboard(payment?.driver?.bankInfo?.accountName)"
                  class="text-blue-600 hover:text-blue-700 text-sm"
                >
                  คัดลอก
                </button>
              </div>
              <p class="text-lg font-bold text-gray-900">{{ payment?.driver?.bankInfo?.accountName }}</p>
            </div>

            <!-- Amount -->
            <div class="bg-white rounded-lg p-4 border-2 border-purple-300">
              <span class="text-sm font-medium text-gray-600">จำนวนเงินที่โอน</span>
              <p class="text-2xl font-bold text-purple-700">{{ payment?.amount }} ฿</p>
            </div>
          </div>
        </div>

        <button
          @click="step = 3"
          class="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg mb-3 font-semibold"
        >
          ฉันโอนเงินแล้ว
        </button>
        <button
          @click="step = 1"
          class="w-full border border-gray-300 text-gray-700 py-3 rounded-lg"
        >
          ย้อนกลับ
        </button>
      </div>

      <!-- ✅ Step 3: อัปโหลดสลิป (สำหรับ QR Code และ Transfer) -->
      <div v-else-if="step === 3">
        <h2 class="text-2xl font-bold mb-4">อัปโหลดสลิป</h2>
        
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">รูปสลิป</label>
          <div
            @click="fileInput?.click()"
            class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500"
          >
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleFileSelect"
              class="hidden"
            />
            <div v-if="previewUrl" class="mb-4">
              <img :src="previewUrl" alt="Preview" class="w-32 h-32 mx-auto rounded-lg object-cover" />
              <p class="text-sm text-green-600 mt-2">{{ selectedFile?.name }}</p>
            </div>
            <div v-else class="text-gray-500">
              <i class="fas fa-camera text-3xl mb-2"></i>
              <p>คลิกเพื่ออัปโหลดรูปสลิป</p>
            </div>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">จำนวนเงิน</label>
          <input
            v-model.number="formData.amount"
            type="number"
            :placeholder="`${payment?.amount}`"
            class="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Reference Number (ถ้ามี)</label>
          <input
            v-model="formData.referenceNumber"
            type="text"
            placeholder="เช่น ABX123"
            class="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        <button
          @click="handleSubmit"
          :disabled="!previewUrl || !formData.amount"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg mb-3 font-semibold"
        >
          <i class="fas fa-upload mr-2"></i>
          ยืนยันและอัปโหลด
        </button>
        <button
          @click="step = 2"
          class="w-full border border-gray-300 text-gray-700 py-3 rounded-lg"
        >
          ย้อนกลับ
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  payment: Object
})

const emit = defineEmits(['close', 'upload', 'cashPayment'])

// State
const step = ref(1)
const selectedMethod = ref('')
const fileInput = ref(null)
const previewUrl = ref('')
const selectedFile = ref(null)

const formData = reactive({
  amount: null,
  referenceNumber: ''
})

// Reset when modal opens/closes
watch(() => props.isOpen, (newVal) => {
  if (!newVal) {
    step.value = 1
    selectedMethod.value = ''
    previewUrl.value = ''
    selectedFile.value = null
    formData.amount = null
    formData.referenceNumber = ''
  } else if (newVal && props.payment) {
    formData.amount = props.payment.amount
  }
})

// Methods
const handleNext = () => {
  step.value = 2
}

const handleCashPayment = () => {
  emit('cashPayment', {
    paymentId: props.payment.id,
    method: 'cash'
  })
}

const handleFileSelect = (e) => {
  const file = e.target.files?.[0]
  if (file) {
    selectedFile.value = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

const handleSubmit = () => {
  if (!previewUrl.value || !formData.amount) return
  
  emit('upload', {
    file: selectedFile.value,
    amount: formData.amount,
    referenceNumber: formData.referenceNumber,
    method: selectedMethod.value
  })
}

const handleImageError = (event) => {
  console.error('Image failed to load:', event)
  event.target.parentElement.innerHTML = '<div class="w-64 h-64 flex items-center justify-center bg-gray-100 rounded"><p class="text-gray-500">ไม่สามารถโหลด QR Code ได้</p></div>'
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    // Could add toast notification here
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>