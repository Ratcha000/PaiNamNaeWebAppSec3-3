<template>
  <div class="p-6">

    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">User Report Management</h1>
    </div>

    <!-- Card Container -->
    <div class="bg-white rounded-lg shadow border">

      <!-- Table Header -->
      <div class="p-4 border-b text-sm text-gray-600">
        รายงานผู้ใช้ที่ถูกร้องเรียน
      </div>

      <!-- Content -->
      <div class="p-6">

        <!-- ถ้าไม่มีข้อมูล -->
        <div v-if="reports.length === 0" class="text-center text-red-500">
          ยังไม่มีรายการรายงาน
        </div>

        <!-- ถ้ามีข้อมูล -->
        <div
          v-for="report in reports"
          :key="report.id"
          class="flex items-center justify-between border-b py-4"
        >
          <div>
            <h2 class="font-semibold">{{ report.name }}</h2>
            <p class="text-sm text-red-600 mt-1">
              {{ report.reason }}
            </p>
          </div>

          <div class="flex items-center gap-3">
            <select
              v-model="report.level"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow focus:outline-none"
            >
              <option value="">ระดับคะแนน</option>
              <option value="normal">ปกติ</option>
              <option value="warning">เตือน</option>
              <option value="blacklist">Blacklist</option>
            </select>

            <button
              @click="saveLevel(report)"
              class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg shadow transition"
            >
              บันทึก
            </button>
          </div>
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

const reports = ref([
  {
    id: 1,
    name: 'Jittranuch',
    reason: 'sexual inappropriate behavior',
    level: ''
  }
])

function saveLevel(report) {
  if (!report.level) {
    alert('กรุณาเลือกระดับความผิด')
    return
  }

  console.log('Saved:', report)
}
</script>
