<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-70"
  >
    <div class="bg-white rounded-2xl shadow-2xl p-8 w-[420px] text-center">

      <!-- Icon -->
      <div class="flex justify-center mb-4">
        <div class="bg-red-100 p-4 rounded-full">
          <i class="fas fa-ban text-red-600 text-3xl"></i>
        </div>
      </div>

      <h2 class="text-xl font-semibold text-gray-800 mb-2">
        บัญชีของคุณถูกแบน
      </h2>

      <p class="text-gray-600 mb-6">
        คุณไม่สามารถใช้งานระบบได้อีกต่อไป
        กรุณาติดต่อผู้ดูแลระบบหากมีข้อสงสัย
      </p>

      <button
        @click="confirm"
        class="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
      >
        ตกลง
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useCookie } from '#app'
import { useRouter } from 'vue-router'

const visible = ref(false)
const router = useRouter()

function show() {
  visible.value = true
}

function confirm() {
  useCookie('token').value = null
  router.push('/login')
}

function handler() {
  show()
}

onMounted(() => {
  window.addEventListener('account-banned', handler)
})

onUnmounted(() => {
  window.removeEventListener('account-banned', handler)
})
</script>