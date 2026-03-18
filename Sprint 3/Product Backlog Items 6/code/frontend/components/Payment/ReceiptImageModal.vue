<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
    <div class="relative max-w-2xl w-full mx-4">
      <button
        @click="$emit('close')"
        class="absolute -top-10 right-0 text-white hover:text-gray-300"
      >
        ✕
      </button>
      <img :src="imageUrl" alt="Receipt" class="w-full rounded-lg shadow-2xl" />
      <div class="mt-4 flex gap-3">
        <a :href="imageUrl" download class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-center">
          ดาวน์โหลด
        </a>
        <button
          @click="$emit('close')"
          class="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded"
        >
          ปิด
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isOpen: Boolean,
  imageUrl: String
})

defineEmits(['close'])
</script>