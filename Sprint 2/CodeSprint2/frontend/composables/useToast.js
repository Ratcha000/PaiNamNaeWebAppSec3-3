import { ref } from 'vue'

const toasts = ref([])

export function useToast() {
    const addToast = (toast) => {
        toasts.value.push({ ...toast, id: Date.now() })
    }

    const removeToast = (id) => {
        toasts.value = toasts.value.filter(toast => toast.id !== id)
    }

    const toast = {
        success: (title, message, duration) => {
            addToast({ type: 'success', title, message, duration })
        },
        error: (title, message, duration) => {
            addToast({ type: 'error', title, message, duration })
        },
        warning: (title, message, duration) => {
            addToast({ type: 'warning', title, message, duration })
        },
        info: (title, message, duration) => {
            addToast({ type: 'info', title, message, duration })
        },
    }

    return { toasts, addToast, removeToast, toast }
}