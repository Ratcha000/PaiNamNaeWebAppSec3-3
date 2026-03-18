<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-2xl mx-auto px-4">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow p-6 mb-8">
        <h1 class="text-4xl font-bold text-gray-900">จัดการ QR Code ชำระเงิน</h1>
        <p class="text-gray-600 mt-2">อัปโหลด QR Code ของคุณเพื่อให้ผู้โดยสารสแกนชำระเงิน</p>
      </div>

      <!-- Error/Success Message -->
      <div v-if="successMessage" class="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
        {{ successMessage }}
      </div>

      <div v-if="errorMessage" class="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        {{ errorMessage }}
      </div>

      <!-- Current QR Code Section -->
      <div v-if="currentQRCode" class="bg-white rounded-lg shadow p-8 mb-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">ข้อมูลการชำระปัจจุบัน</h2>
          <span class="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
            ใช้งานได้
          </span>
        </div>
        
        <!-- แสดง QR Code (สำหรับ PromptPay) -->
        <div v-if="currentQRCode.paymentMethod === 'promptpay' && currentQRCode.qrCodeUrl" 
             class="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8 text-center mb-6">
          <h3 class="text-lg font-bold text-blue-900 mb-4">QR Code PromptPay</h3>
          
          <div class="bg-white p-4 rounded-lg shadow-md inline-block">
            <img 
              :src="currentQRCode.qrCodeUrl" 
              alt="QR Code"
              class="w-64 h-64 object-contain mx-auto"
            />
          </div>
          
          <div class="mt-4 space-y-2">
            <p class="text-sm text-blue-700 font-medium">สแกน QR Code นี้เพื่อชำระเงิน</p>
            <div class="flex items-center justify-center gap-2 text-xs text-blue-600">
              <span>Secure Payment</span>
              <span>•</span>
              <span>PromptPay Ready</span>
            </div>
          </div>
        </div>

        <!-- แสดงข้อมูลบัญชี (สำหรับ Transfer) -->
        <div v-if="currentQRCode.paymentMethod === 'transfer' && currentQRCode.bankInfo" 
             class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 mb-6">
          <h3 class="text-lg font-bold text-green-900 mb-4">ข้อมูลบัญชีธนาคาร</h3>
          
          <div class="space-y-4">
            <!-- Bank Name -->
            <div class="bg-white rounded-lg p-4">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-600 mb-1">ธนาคาร</span>
                <button 
                  @click="copyToClipboard(currentQRCode.bankInfo.bankName)"
                  class="text-blue-600 hover:text-blue-700 text-sm"
                  title="คัดลอก"
                >
                  คัดลอก
                </button>
              </div>
              <p class="text-lg font-bold text-gray-900">{{ currentQRCode.bankInfo.bankName }}</p>
            </div>

            <!-- Account Number -->
            <div class="bg-white rounded-lg p-4">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-600 mb-1">เลขบัญชี</span>
                <button 
                  @click="copyToClipboard(currentQRCode.bankInfo.accountNumber)"
                  class="text-blue-600 hover:text-blue-700 text-sm"
                  title="คัดลอก"
                >
                  คัดลอก
                </button>
              </div>
              <p class="text-lg font-bold font-mono text-gray-900 tracking-wider">{{ currentQRCode.bankInfo.accountNumber }}</p>
            </div>

            <!-- Account Name -->
            <div class="bg-white rounded-lg p-4">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-600 mb-1">ชื่อบัญชี</span>
                <button 
                  @click="copyToClipboard(currentQRCode.bankInfo.accountName)"
                  class="text-blue-600 hover:text-blue-700 text-sm"
                  title="คัดลอก"
                >
                  คัดลอก
                </button>
              </div>
              <p class="text-lg font-bold text-gray-900">{{ currentQRCode.bankInfo.accountName }}</p>
            </div>
          </div>

          <!-- Transfer Instructions -->
          <div class="mt-4 p-3 bg-green-100 rounded-lg">
            <p class="text-sm text-green-800">
              <span class="font-semibold">สำหรับผู้โดยสาร:</span> 
              โอนเงินไปยังบัญชีนี้ แล้วอัปโหลดสลิปเพื่อยืนยันการชำระ
            </p>
          </div>
        </div>

        <!-- Payment Method Badge -->
        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <i class="{{ currentQRCode.paymentMethod === 'promptpay' ? 'fas fa-qrcode' : 'fas fa-university' }}"></i>
            </div>
            <div>
              <p class="font-semibold text-gray-900">
                {{ currentQRCode.paymentMethod === 'promptpay' ? 'PromptPay / QR Code' : 'การโอนเงินผ่านธนาคาร' }}
              </p>
              <p class="text-sm text-gray-600">วิธีการชำระหลัก</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-600">บันทึกล่าสุด</p>
            <p class="text-sm font-medium text-gray-900">{{ formatDate(currentQRCode.updatedAt) }}</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3">
          <button
            @click="downloadQRCode"
            v-if="currentQRCode.paymentMethod === 'promptpay' && currentQRCode.qrCodeUrl"
            class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
          >
            <i class="fas fa-download"></i>
            ดาวน์โหลด QR Code
          </button>
          
          
          
          <button
            @click="deleteQRCode"
            :disabled="isDeleting"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
          >
            <i class="fas fa-trash" v-if="!isDeleting"></i>
            <i class="fas fa-spinner fa-spin" v-else></i>
            {{ isDeleting ? 'กำลังลบ...' : 'ลบ' }}
          </button>
        </div>
      </div>

      <!-- No Payment Method Set -->
      <div v-else class="bg-yellow-50 border border-yellow-300 rounded-lg p-8 mb-8 text-center">
        <div class="w-20 h-20 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
          <i class="fas fa-mobile-alt text-3xl text-yellow-600"></i>
        </div>
        <h2 class="text-xl font-bold text-yellow-900 mb-2">ยังไม่ได้ตั้งค่าวิธีการชำระ</h2>
        <p class="text-yellow-700 mb-4">เพิ่มข้อมูลการชำระเพื่อให้ผู้โดยสารสามารถจ่ายเงินได้</p>
        <div class="text-sm text-yellow-600">
          <p>• เลือก QR Code สำหรับ PromptPay</p>
          <p>• หรือกรอกข้อมูลบัญชีธนาคาร</p>
        </div>
      </div>

      <!-- Upload New QR Code Section -->
      <div class="bg-white rounded-lg shadow p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">
          {{ currentQRCode ? 'แก้ไขข้อมูลการชำระ' : 'ตั้งค่าวิธีการชำระใหม่' }}
        </h2>

        <div class="space-y-6">
          <!-- Payment Method Selection -->
          <div>
            <label class="block text-lg font-semibold text-gray-900 mb-4">เลือกวิธีการชำระ</label>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- PromptPay/QR Code -->
              <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer transition"
                :class="paymentMethod === 'promptpay' ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-blue-400'">
                <input
                  type="radio"
                  v-model="paymentMethod"
                  value="promptpay"
                  class="w-4 h-4"
                />
                <span class="ml-3">
                  <p class="font-semibold text-gray-900">PromptPay/QR Code</p>
                  <p class="text-sm text-gray-600">สแกน QR Code ผ่าน Banking App</p>
                </span>
              </label>

              <!-- Bank Transfer -->
              <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer transition"
                :class="paymentMethod === 'transfer' ? 'border-green-600 bg-green-50' : 'border-gray-300 hover:border-green-400'">
                <input
                  type="radio"
                  v-model="paymentMethod"
                  value="transfer"
                  class="w-4 h-4"
                />
                <span class="ml-3">
                  <p class="font-semibold text-gray-900">โอนเงินสด</p>
                  <p class="text-sm text-gray-600">โอนเงินตรงไปยังบัญชีธนาคาร</p>
                </span>
              </label>
            </div>
          </div>

          <!-- Bank Account Info (for Transfer) -->
          <div v-if="paymentMethod === 'transfer'" class="bg-green-50 border border-green-300 p-4 rounded-lg">
            <h3 class="font-semibold text-green-900 mb-3">ข้อมูลบัญชีธนาคาร</h3>
            
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">ชื่อธนาคาร</label>
                <input
                  v-model="bankInfo.bankName"
                  placeholder="เช่น ธนาคารกรุงไทย"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">เลขบัญชี</label>
                <input
                  v-model="bankInfo.accountNumber"
                  placeholder="เช่น 123-456-7890"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">ชื่อเจ้าของบัญชี</label>
                <input
                  v-model="bankInfo.accountName"
                  placeholder="เช่น นาย ก วิทยา"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          <!-- QR Code Upload (for PromptPay) -->
          <div v-if="paymentMethod === 'promptpay'" class="border-2 border-dashed border-blue-400 rounded-lg p-8 text-center">
            <div class="mb-4">
              <p class="text-lg font-semibold text-gray-900 mb-2">อัปโหลด QR Code</p>
              <p class="text-sm text-gray-600">ถ่ายภาพ QR Code จากแอปธนาคารของคุณ</p>
            </div>

            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleFileSelect"
              class="hidden"
            />

            <button
              @click="fileInput?.click()"
              class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              <i class="fas fa-folder-open mr-2"></i>
              เลือกไฟล์
            </button>

            <!-- Preview -->
            <div v-if="previewImage" class="mt-6">
              <p class="text-sm text-gray-600 mb-2">ตัวอย่าง:</p>
              <img :src="previewImage" alt="Preview" class="w-48 h-48 object-cover mx-auto rounded-lg border-2 border-blue-400" />
              <div class="mt-4 space-y-2">
                <p class="text-sm text-gray-600">ไฟล์: {{ selectedFile?.name }}</p>
                <p class="text-sm text-gray-600">ขนาด: {{ (selectedFile?.size / 1024).toFixed(2) }} KB</p>
              </div>
            </div>
          </div>

          <!-- Upload Button -->
          <div class="flex gap-3">
            <button
              @click="resetForm"
              class="flex-1 px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition"
            >
              <i class="fas fa-redo mr-2"></i>
              ยกเลิก
            </button>
            
            <button
              @click="uploadQRCode"
              :disabled="isUploading || !canUpload"
              class="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition"
            >
              <i class="fas fa-upload mr-2" v-if="!isUploading"></i>
              <i class="fas fa-spinner fa-spin mr-2" v-else></i>
              <span v-if="!isUploading">{{ paymentMethod === 'promptpay' ? 'อัปโหลด QR Code' : 'บันทึกข้อมูล' }}</span>
              <span v-else>กำลังอัปโหลด...</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Info Section -->
      <div class="mt-8 bg-yellow-50 border border-yellow-300 rounded-lg p-6">
        <h3 class="font-bold text-yellow-900 mb-2">วิธีการใช้งาน:</h3>
        <ol class="text-sm text-yellow-800 space-y-2 ml-4">
          <li>1. อัปโหลด QR Code หรือข้อมูลบัญชี</li>
          <li>2. ผู้โดยสารจะเห็น QR Code เมื่อเลือก "สแกน QR Code"</li>
          <li>3. ผู้โดยสารสแกนชำระเงิน</li>
          <li>4. อัปโหลดสลิปและรอการยืนยัน</li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

definePageMeta({ middleware: 'auth' })

const router = useRouter()
const { $api } = useNuxtApp()
const { getUserId } = useAuth()

// State
const currentQRCode = ref(null)
const paymentMethod = ref('promptpay')
const selectedFile = ref(null)
const previewImage = ref('')
const fileInput = ref(null)
const isUploading = ref(false)
const isDeleting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const bankInfo = reactive({
  bankName: '',
  accountNumber: '',
  accountName: ''
})

// Computed
const canUpload = computed(() => {
  if (paymentMethod.value === 'promptpay') {
    return !!previewImage.value
  }
  return bankInfo.bankName && bankInfo.accountNumber && bankInfo.accountName
})

// ดึง QR Code ปัจจุบัน
const fetchCurrentQRCode = async () => {
  try {
    const response = await $api('/driver/qr-code')
    
    if (response && response.data && response.data.id) {
      currentQRCode.value = response.data
    } else if (response && response.id && response.paymentMethod) {
      currentQRCode.value = response
    } else {
      currentQRCode.value = null
    }
  } catch (err) {
    if (err.status === 404) {
      currentQRCode.value = null
    }
  }
}

// เลือกไฟล์
const handleFileSelect = (e) => {
  const file = e.target.files?.[0]
  if (!file) return

  selectedFile.value = file
  const reader = new FileReader()
  reader.onload = (event) => {
    previewImage.value = event.target?.result
  }
  reader.readAsDataURL(file)
}

// คัดลอกข้อความ
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    successMessage.value = 'คัดลอกข้อมูลแล้ว!'
    setTimeout(() => {
      successMessage.value = ''
    }, 2000)
  } catch (err) {
    errorMessage.value = 'ไม่สามารถคัดลอกได้'
  }
}

// ดาวน์โหลด QR Code
const downloadQRCode = () => {
  if (currentQRCode.value?.qrCodeUrl) {
    const link = document.createElement('a')
    link.href = currentQRCode.value.qrCodeUrl
    link.download = 'qr-code.png'
    link.click()
  }
}

// แชร์ข้อมูลการชำระ
const sharePaymentInfo = async () => {
  const data = currentQRCode.value
  if (!data) return

  let shareText = 'ข้อมูลการชำระเงิน\n\n'
  
  if (data.paymentMethod === 'promptpay') {
    shareText += 'วิธี: PromptPay QR Code\n'
    shareText += 'สแกน QR Code: ' + data.qrCodeUrl
  } else if (data.bankInfo) {
    shareText += 'วิธี: โอนเงินผ่านธนาคาร\n'
    shareText += `ธนาคาร: ${data.bankInfo.bankName}\n`
    shareText += `เลขบัญชี: ${data.bankInfo.accountNumber}\n`
    shareText += `ชื่อบัญชี: ${data.bankInfo.accountName}`
  }

  try {
    if (navigator.share) {
      await navigator.share({
        title: 'ข้อมูลการชำระเงิน',
        text: shareText
      })
    } else {
      await copyToClipboard(shareText)
      successMessage.value = 'คัดลอกข้อมูลการชำระแล้ว!'
    }
  } catch (err) {
    console.log('Share failed', err)
  }
}

// อัปโหลด QR Code
const uploadQRCode = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (paymentMethod.value === 'promptpay' && !selectedFile.value) {
    errorMessage.value = 'กรุณาเลือกรูป QR Code'
    return
  }

  isUploading.value = true

  try {
    const formData = new FormData()
    formData.append('paymentMethod', paymentMethod.value)

    if (paymentMethod.value === 'promptpay') {
      formData.append('qrCode', selectedFile.value)
    } else {
      formData.append('bankName', bankInfo.bankName)
      formData.append('accountNumber', bankInfo.accountNumber)
      formData.append('accountName', bankInfo.accountName)
    }

    const response = await $api('/driver/qr-code', {
      method: 'POST',
      body: formData
    })

    if (response && response.data && response.data.id) {
      currentQRCode.value = response.data
    } else if (response && response.id) {
      currentQRCode.value = response
    }
    
    successMessage.value = 'บันทึกสำเร็จแล้ว!'
    resetForm()

    setTimeout(async () => {
      await fetchCurrentQRCode()
      successMessage.value = ''
    }, 500)

  } catch (err) {
    errorMessage.value = err.data?.message || 'ไม่สามารถบันทึกได้'
  } finally {
    isUploading.value = false
  }
}

// ลบ QR Code
const deleteQRCode = async () => {
  if (!confirm('คุณแน่ใจหรือว่าต้องการลบ QR Code?')) return

  isDeleting.value = true

  try {
    await $api('/driver/qr-code', {
      method: 'DELETE'
    })

    currentQRCode.value = null
    successMessage.value = 'ลบ QR Code สำเร็จแล้ว'

    setTimeout(async () => {
      await fetchCurrentQRCode()
      successMessage.value = ''
    }, 1000)

  } catch (err) {
    errorMessage.value = err.data?.message || 'ไม่สามารถลบได้'
  } finally {
    isDeleting.value = false
  }
}

// Reset Form
const resetForm = () => {
  selectedFile.value = null
  previewImage.value = ''
  bankInfo.bankName = ''
  bankInfo.accountNumber = ''
  bankInfo.accountName = ''
}

// Format Date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(async () => {
  await fetchCurrentQRCode()
})
</script>

<style scoped>
</style>