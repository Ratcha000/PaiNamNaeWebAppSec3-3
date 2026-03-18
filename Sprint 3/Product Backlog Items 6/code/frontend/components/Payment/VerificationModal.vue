<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
      <div class="text-center mb-4">
        <p :class="status === 'approved' ? 'text-green-600' : 'text-red-600'" class="text-2xl font-bold">
          {{ status === 'approved' ? '✓ ยืนยันการชำระ' : '✗ ปฏิเสธการชำระ' }}
        </p>
      </div>

      <div class="bg-gray-50 p-3 rounded mb-4 text-sm">
        <p><strong>ผู้โดยสาร:</strong> {{ payment?.passenger.firstName }} {{ payment?.passenger.lastName }}</p>
        <p><strong>จำนวนเงิน:</strong> {{ payment?.amount }} ฿</p>
      </div>

      <div v-if="status === 'rejected'" class="mb-4">
        <label class="block text-sm font-medium mb-2">เหตุผลในการปฏิเสธ (ไม่บังคับ)</label>
        <textarea
          v-model="formData.note"
          placeholder="บอกเหตุผล..."
          rows="3"
          class="w-full border border-gray-300 rounded px-3 py-2"
        ></textarea>
      </div>

      <div class="flex gap-3">
        <button
          @click="$emit('close')"
          class="flex-1 border border-gray-300 text-gray-700 py-2 rounded"
        >
          ยกเลิก
        </button>
        <button
          @click="handleConfirm"
          :disabled="isSubmitting"
          :class="status === 'approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'"
          class="flex-1 text-white py-2 rounded disabled:opacity-50"
        >
          {{ status === 'approved' ? 'ยืนยัน' : 'ปฏิเสธ' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  payment: Object,
  status: String,
  isSubmitting: Boolean
})

const emit = defineEmits(['confirm', 'close'])

const formData = reactive({
  note: ''
})

watch(() => props.isOpen, (newVal) => {
  if (!newVal) {
    formData.note = ''
  }
})

const handleConfirm = () => {
  emit('confirm', { note: formData.note })
}
</script>