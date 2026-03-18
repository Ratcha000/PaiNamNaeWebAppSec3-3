<template>
  <div class="min-h-[80vh] flex items-center justify-center p-4">
    <main class="bg-white rounded-lg shadow-lg max-w-md w-full p-8 border border-gray-300 ">
      <h1 class="text-3xl font-bold text-blue-600 mb-6 text-center">เข้าสู่ระบบ</h1>
      <form @submit.prevent="submit" id="loginForm">
        <!-- username / Email -->
        <div class="mb-4">
          <label for="identifier" class="block text-sm font-medium text-gray-700 mb-1">ชื่อผู้ใช้ หรือ อีเมล<span
              class="text-red-500">*</span></label>
          <input type="text" id="identifier" v-model="identifier" required placeholder="กรอกชื่อผู้ใช้หรืออีเมล"
            class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>

        <!-- รหัสผ่าน -->
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน <span
              class="text-red-500">*</span></label>
          <input type="password" id="password" v-model="password" required minlength="6" placeholder="กรอกรหัสผ่าน"
            class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>

        <!-- ปุ่มเข้าสู่ระบบ -->
        <button type="submit"
          class="w-full py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          เข้าสู่ระบบ
        </button>
        <div v-if="errorMessage" style="color: red;">{{ errorMessage }}</div>
      </form>

      <!-- ลิงก์สมัครสมาชิก -->
      <p class="mt-6 text-center text-gray-600 text-sm">
        ยังไม่มีบัญชี? <a href="/register" class="text-blue-600 hover:underline">สมัครสมาชิก</a>
      </p>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

const identifier = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()
const { login } = useAuth()

const submit = async () => {
  errorMessage.value = ''
  try {
    await login(identifier.value, password.value)
    router.push('/')
  } catch (e) {
    console.error(e)
    errorMessage.value = e?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ'
  }
}

</script>

<style scoped>

</style>