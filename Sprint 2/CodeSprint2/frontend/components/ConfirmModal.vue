<template>
    <transition name="modal-fade">
        <div v-if="show" class="modal-overlay" @click.self="handleCancel">
            <div class="modal-content">
                <div class="p-6 flex items-start">
                    <div class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                        :class="iconContainerClass">
                        <svg class="w-6 h-6" :class="iconSvgClass" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z">
                            </path>
                        </svg>
                    </div>
                    <div class="ml-4 text-left">
                        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
                        <p class="mt-1 text-sm text-gray-600">{{ message }}</p>
                    </div>
                </div>

                <div class="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
                    <button @click="handleCancel" type="button" class="btn-secondary">
                        {{ cancelText }}
                    </button>
                    <button @click="handleConfirm" type="button" :class="['btn-primary', confirmButtonClass]">
                        {{ confirmText }}
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    show: {
        type: Boolean,
        required: true,
    },
    title: {
        type: String,
        default: 'ยืนยันการกระทำ',
    },
    message: {
        type: String,
        default: 'คุณแน่ใจหรือไม่ว่าต้องการดำเนินการต่อ?',
    },
    confirmText: {
        type: String,
        default: 'ยืนยัน',
    },
    cancelText: {
        type: String,
        default: 'ยกเลิก',
    },
    variant: {
        type: String,
        default: 'danger', // 'danger' or 'primary'
    },
});

const emit = defineEmits(['confirm', 'cancel']);

const handleConfirm = () => {
    emit('confirm');
};

const handleCancel = () => {
    emit('cancel');
};

// Computed properties for dynamic styling based on variant
const confirmButtonClass = computed(() => {
    return props.variant === 'danger'
        ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
});

const iconContainerClass = computed(() => {
    return props.variant === 'danger' ? 'bg-red-100' : 'bg-blue-100';
});

const iconSvgClass = computed(() => {
    return props.variant === 'danger' ? 'text-red-600' : 'text-blue-600';
});
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-content {
    background-color: white;
    border-radius: 0.75rem;
    max-width: 448px;
    /* 28rem */
    width: 95%;
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
    transform: scale(1);
}

.btn-primary,
.btn-secondary {
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    /* rounded-md */
    font-weight: 500;
    font-size: 0.875rem;
    line-height: 1.25rem;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    transition: all 0.2s;
    border: 1px solid transparent;
}

.btn-primary {
    color: white;
}

.btn-primary:focus {
    outline: none;
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);
    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}


.btn-secondary {
    color: #374151;
    /* text-gray-700 */
    background-color: white;
    border-color: #d1d5db;
    /* border-gray-300 */
}

.btn-secondary:hover {
    background-color: #f9fafb;
    /* hover:bg-gray-50 */
}

.btn-secondary:focus {
    outline: none;
    border-color: #9ca3af;
    /* focus:border-gray-400 */
    --tw-ring-color: rgb(209 213 219);
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);
    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}


/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.3s ease;
}

.modal-fade-enter-active .modal-content,
.modal-fade-leave-active .modal-content {
    transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
    transform: scale(0.95) translateY(1rem);
}
</style>