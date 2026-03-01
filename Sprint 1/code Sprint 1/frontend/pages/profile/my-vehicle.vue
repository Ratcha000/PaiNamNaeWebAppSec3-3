<template>
    <div >
        <div class=" flex items-center justify-center py-8">
            <div
                class="flex bg-white rounded-lg shadow-lg overflow-hidden max-w-6xl w-full mx-4 border border-gray-300">

                <ProfileSidebar />

                <main class="flex-1 p-8">
                    <div class="text-center mb-8">
                        <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                                </path>
                            </svg>
                        </div>
                        <h1 class="text-3xl font-bold text-gray-800 mb-2">ข้อมูลรถยนต์ของฉัน</h1>
                        <p class="text-gray-600 max-w-md mx-auto">
                            จัดการข้อมูลรถยนต์ของคุณเพื่อใช้ในการสร้างเส้นทาง
                        </p>
                    </div>

                    <div class="bg-white rounded-xl shadow-xl p-8 border border-gray-300">
                        <div
                            class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-[#F2F2F2] p-4 md:px-6 md:py-6 rounded-[8px]">
                            <p class="text-gray-800 text-base md:text-[18px] text-center sm:text-left">
                                {{ vehicleCount > 0 ? `คุณมีรถยนต์ที่บันทึกไว้ ${vehicleCount} คัน` :
                                    'คุณยังไม่มีข้อมูลรถยนต์' }}
                            </p>
                            <button @click="isModalOpen = true"
                                class="bg-[#2563EB] hover:bg-blue-600 text-white text-sm md:text-[16px] px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                                เพิ่ม / จัดการข้อมูล
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>

        <VehicleModal :show="isModalOpen" @close="closeAndRefresh" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ProfileSidebar from '~/components/ProfileSidebar.vue';
import VehicleModal from '~/components/VehicleModal.vue';

definePageMeta({
    middleware: 'auth'
});

const { $api } = useNuxtApp();

const isModalOpen = ref(false);
const vehicleCount = ref(0);

const fetchVehicles = async () => {
    try {
        const vehicles = await $api('/vehicles');
        vehicleCount.value = vehicles.length;
    } catch (error) {
        console.error("Failed to fetch vehicles:", error);
    }
};

const closeAndRefresh = () => {
    isModalOpen.value = false;
    fetchVehicles(); // Refresh count when modal is closed
};

onMounted(() => {
    fetchVehicles();
});
</script>

<style scoped>
/* Copied from the HTML file */
.license-card {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    border: 3px solid #1e40af;
    border-radius: 12px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(30, 64, 175, 0.2);
}

.selfie-frame {
    background: linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%);
    border: 3px solid #f59e0b;
    border-radius: 20px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
}

.person-silhouette {
    background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
    border-radius: 50%;
    position: relative;
}

.upload-zone {
    transition: all 0.3s ease;
    cursor: pointer;
}

.upload-zone:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.step-indicator {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: bold;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}
</style>