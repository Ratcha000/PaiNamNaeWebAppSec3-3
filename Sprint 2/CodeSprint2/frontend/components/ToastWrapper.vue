<template>
    <div aria-live="assertive"
        class="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-end z-50">
        <div class="w-full flex flex-col items-center space-y-4 sm:items-end">
            <ToastNotification v-for="toast in toasts" :key="toast.id" :id="toast.id" :type="toast.type"
                :title="toast.title" :message="toast.message" :duration="toast.duration" @close="removeToast" />
        </div>
    </div>
</template>

<script setup>
import { useToast } from '~/composables/useToast';
import ToastNotification from '~/components/ToastNotification.vue';

const { toasts, removeToast } = useToast();
</script>