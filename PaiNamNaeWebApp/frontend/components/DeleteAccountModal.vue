<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <div class="mb-4">
                <h3 class="text-lg font-bold text-red-600"> เป็นการลบบัญชีอย่างถาวร</h3>
                <p class="mt-2 text-sm text-gray-600">บัญชีของคุณจะถูกลบถาวรหลังจาก 90 วัน</p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                    <label class="block mb-2 text-sm font-medium text-gray-700">เหตุผลการลบบัญชี</label>
                    <textarea 
                        v-model="formData.reason" 
                        placeholder="บอกเราว่าเหตุใดคุณจึงต้องการลบบัญชี"
                        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        rows="3"
                        required>
                    </textarea>
                </div>

                <div>
                    <label class="block mb-2 text-sm font-medium text-gray-700">ยืนยันด้วยรหัสผ่าน</label>
                    <input 
                        v-model="formData.password" 
                        type="password" 
                        placeholder="กรอกรหัสผ่าน"
                        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        required>
                </div>

                <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button 
                        type="button" 
                        @click="handleCancel"
                        :disabled="isLoading"
                        class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50">
                        ยกเลิก
                    </button>
                    <button 
                        type="submit"
                        :disabled="isLoading"
                        class="flex items-center px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">
                        <svg v-if="isLoading" class="w-5 h-5 mr-2 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {{ isLoading ? 'กำลังลบ...' : 'ลบบัญชี' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    },
    isLoading: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['confirm', 'cancel'])

const formData = reactive({
    reason: '',
    password: ''
})

const handleSubmit = () => {
    if (!formData.reason.trim() || !formData.password) {
        return
    }
    emit('confirm', {
        reason: formData.reason,
        password: formData.password
    })
    resetForm()
}

const handleCancel = () => {
    emit('cancel')
    resetForm()
}

const resetForm = () => {
    formData.reason = ''
    formData.password = ''
}
</script>

<style scoped>
</style>