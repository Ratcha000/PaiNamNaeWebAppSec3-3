<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Report</h1>

    <div class="bg-white shadow-md rounded-lg p-6 border">
      <div class="flex items-start justify-between">

        <!-- User Info -->
        <div class="flex gap-4">
          <div class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <i class="fas fa-user text-gray-500 text-xl"></i>
          </div>

          <div>
            <h2 class="text-lg font-semibold">Jittranuch</h2>

            <div class="mt-4 bg-gray-100 rounded-lg p-4 shadow-sm w-[400px]">
              <p class="text-red-700 font-semibold">
                sexual
              </p>
            </div>
          </div>
        </div>

        <!-- Action Section -->
        <div class="flex items-center gap-3">
          
          <select
            v-model="selectedLevel"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow focus:outline-none"
          >
            <option value="">ระดับคะแนน</option>
            <option value="normal">ปกติ</option>
            <option value="warning">เตือน</option>
            <option value="blacklist">Blacklist</option>
          </select>

          <!-- ปุ่มบันทึก -->
          <button
            @click="saveLevel"
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg shadow transition"
          >
            บันทึก
          </button>

        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({
  layout: 'admin'
})

const selectedLevel = ref('')

function saveLevel() {
  if (!selectedLevel.value) {
    alert('กรุณาเลือกระดับความผิด')
    return
  }

  console.log('Saved level:', selectedLevel.value)

  // ตรงนี้เอาไปเชื่อม API ได้
}
</script>
