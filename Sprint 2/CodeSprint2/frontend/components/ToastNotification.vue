<template>
    <transition enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0" leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="show"
            class="toast-container max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
            <div class="p-4">
                <div class="flex items-start">
                    <div class="flex-shrink-0">
                        <svg class="h-6 w-6" :class="iconColor" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            aria-hidden="true">
                            <path v-if="type === 'success'" stroke-linecap="round" stroke-linejoin="round"
                                stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            <path v-if="type === 'error'" stroke-linecap="round" stroke-linejoin="round"
                                stroke-width="2"
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            <path v-if="type === 'warning'" stroke-linecap="round" stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            <path v-if="type === 'info'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div class="ml-3 w-0 flex-1 pt-0.5">
                        <p class="text-sm font-medium text-gray-900">{{ title }}</p>
                        <p class="mt-1 text-sm text-gray-500">{{ message }}</p>
                    </div>
                    <div class="ml-4 flex-shrink-0 flex">
                        <button @click="close"
                            class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <span class="sr-only">Close</span>
                            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const props = defineProps({
    id: { type: [String, Number], required: true },
    type: { type: String, default: 'info' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    duration: { type: Number, default: 5000 }
})

const emit = defineEmits(['close'])

const show = ref(false)

onMounted(() => {
    show.value = true
    if (props.duration > 0) {
        setTimeout(() => close(), props.duration)
    }
})

function close() {
    show.value = false
    setTimeout(() => emit('close', props.id), 150) // wait for animation
}

const iconColor = computed(() => {
    switch (props.type) {
        case 'success': return 'text-green-500'
        case 'error': return 'text-red-500'
        case 'warning': return 'text-yellow-500'
        default: return 'text-blue-500'
    }
})
</script>
<style scoped>
/* [NEW] Apply the 'Kanit' font to the toast */
.toast-container {
    font-family: 'Kanit', sans-serif;
}
</style>