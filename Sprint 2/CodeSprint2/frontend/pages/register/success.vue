<template>
  <div class="bg-gray-50 min-h-screen flex items-center justify-center p-4 font-['Kanit']">
    <main class="bg-white rounded-lg shadow-lg max-w-md w-full p-8 text-center">
      <div class="success-animation mb-6">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      </div>

      <div class="fade-in">
        <h1 class="text-3xl font-bold text-green-600 mb-4">
          สมัครสมาชิกเรียบร้อยแล้ว!
        </h1>

        <div class="text-gray-700 mb-6 space-y-4">
          <p class="text-lg text-gray-800">
            ขอบคุณที่สมัครเป็นส่วนหนึ่งของ
            <span class="font-semibold text-blue-600">"ไปนำแหน่"</span>
          </p>

          <div class="bg-blue-50 p-4 rounded-lg">
            <p class="text-sm text-gray-700 leading-relaxed">
              บัญชีของคุณถูกสร้างแล้ว และกำลังรอการตรวจสอบยืนยันตัวตน
              <span class="font-medium text-blue-600">สถานะจะอัปเดตในหน้าโปรไฟล์ของคุณ เมื่อการตรวจสอบเสร็จสิ้น</span>
            </p>
          </div>
          </div>

        <button @click="goToLogin" type="button" class="w-full py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-4">
          ไปสู่หน้าเข้าสู่ระบบ
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  layout: false,
})

const router = useRouter()

const goToLogin = () => {
  router.push('/login')
}

onMounted(() => {
  setTimeout(() => {
    goToLogin()
  }, 6000)
})
</script>

<style scoped>
.success-animation {
  animation: checkmark 0.6s ease-in-out;
}
@keyframes checkmark {
  0% { opacity: 0; transform: scale(0.5); }
  50% { opacity: 1; transform: scale(1.1); }
  100% { opacity: 1; transform: scale(1); }
}
.fade-in {
  animation: fadeIn 0.8s ease-in-out 0.3s both;
}
@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}
</style>