<template>
    <div>
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Page Title -->
            <div class="mb-8">
                <h2 class="text-3xl font-bold text-gray-900 mb-2">
                    สร้างการเดินทางของคุณ
                </h2>
                <p class="text-gray-600">
                    กำหนดจุดเริ่มต้น ปลายทาง และรายละเอียดต่างๆ เพื่อให้ผู้โดยสารมาร่วมทาง
                </p>
            </div>

            <!-- Main Form -->
            <div class="bg-white rounded-lg shadow-md p-8">
                <form id="postRouteForm" novalidate class="space-y-8">
                    <!-- Route Information -->
                    <div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                            ข้อมูลเส้นทาง
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label for="startPoint" class="block text-sm font-medium text-gray-700 mb-2">
                                    จุดเริ่มต้น <span class="text-red-500">*</span>
                                </label>
                                <input id="startPoint" name="startPoint" type="text"
                                    placeholder="เช่น กรุงเทพมหานคร, ถนนสุขุมวิท" required
                                    class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500" />
                            </div>
                            <div>
                                <label for="endPoint" class="block text-sm font-medium text-gray-700 mb-2">
                                    จุดปลายทาง <span class="text-red-500">*</span>
                                </label>
                                <input id="endPoint" name="endPoint" type="text"
                                    placeholder="เช่น เชียงใหม่, ถนนนิมมานเหมินท์" required
                                    class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500" />
                            </div>
                        </div>
                    </div>

                    <!-- Trip Details -->
                    <div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                            รายละเอียดการเดินทาง
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label for="travelDate" class="block text-sm font-medium text-gray-700 mb-2">
                                    วันที่เดินทาง <span class="text-red-500">*</span>
                                </label>
                                <input id="travelDate" name="travelDate" type="date" required
                                    class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500" />
                            </div>
                            <div>
                                <label for="travelTime" class="block text-sm font-medium text-gray-700 mb-2">
                                    เวลาออกเดินทาง <span class="text-red-500">*</span>
                                </label>
                                <input id="travelTime" name="travelTime" type="time" required
                                    class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500" />
                            </div>
                            <div>
                                <label for="seatCount" class="block text-sm font-medium text-gray-700 mb-2">
                                    จำนวนที่นั่งที่รับได้ <span class="text-red-500">*</span>
                                </label>
                                <input id="seatCount" name="seatCount" type="number" min="1"
                                    placeholder="กรอกจำนวนที่นั่ง (เช่น 4)" required
                                    class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500" />
                                <p class="text-xs text-gray-500 mt-1">
                                    รถยนต์ส่วนบุคคลทั่วไปมี 4–5 ที่นั่ง หากใช้รถตู้/รถบัส
                                    ให้ระบุจำนวนได้ตามจริง
                                </p>
                            </div>
                            <div>
                                <label for="pricePerSeat" class="block text-sm font-medium text-gray-700 mb-2">
                                    ราคาต่อที่นั่ง (บาท) <span class="text-red-500">*</span>
                                </label>
                                <input id="pricePerSeat" name="pricePerSeat" type="number" min="0"
                                    placeholder="เช่น 250" required
                                    class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500" />
                            </div>
                        </div>
                    </div>

                    <!-- Pickup & Stops -->
                    <div>
                        <!-- <h3 class="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                            จุดขึ้นรถ และจุดแวะพัก
                        </h3> -->
                        <h3 class="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                            จุดแวะพัก
                        </h3>
                        <div class="grid grid-cols-1 gap-6">
                            <!-- <div>
                                <label for="boardingPoint" class="block text-sm font-medium text-gray-700 mb-2">
                                    จุดขึ้นรถ <span class="text-red-500">*</span>
                                </label>
                                <input id="boardingPoint" name="boardingPoint" type="text"
                                    placeholder="เช่น BTS อโศก, MRT ห้วยขวาง" required
                                    class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500" />
                            </div> -->
                            <div>
                                <label for="stops" class="block text-sm font-medium text-gray-700 mb-2">
                                    จุดแวะพัก / รับส่งระหว่างทาง (ถ้ามี)
                                </label>
                                <textarea id="stops" name="stops" rows="3"
                                    placeholder="เช่น ปั้มบางจาก, ร้านอาหาร แวะได้ตามสะดวก"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 resize-none"></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Vehicle & Amenities -->
                    <div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                            ข้อมูลรถยนต์
                        </h3>
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

                    </div>
                    <VehicleModal :show="isModalOpen" @close="closeAndRefresh" />

                    <!-- Terms & Conditions -->
                    <div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                            เงื่อนไขและข้อตกลง
                        </h3>
                        <textarea id="terms" name="terms" rows="4"
                            placeholder="ระบุเงื่อนไข เช่น ไม่สูบบุหรี่, ไม่นำสัตว์เลี้ยง, ชำระเงินล่วงหน้า 50%"
                            class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 resize-none"></textarea>
                    </div>

                    <!-- ปุ่มดำเนินการ -->
                    <div class="pt-6 flex justify-end gap-4">
                        <button type="button"
                            class="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            ยกเลิก
                        </button>
                        <button type="submit"
                            class="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            สร้างการเดินทาง
                        </button>
                    </div>
                </form>
            </div>

            <!-- Info Box -->
            <div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div class="flex items-start">
                    <svg class="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clip-rule="evenodd" />
                    </svg>
                    <div class="ml-3">
                        <h4 class="text-sm font-medium text-blue-800">ข้อมูลสำคัญ</h4>
                        <ul class="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
                            <li>โพสต์ของคุณจะขึ้นเมื่อได้รับการตรวจสอบ</li>
                            <li>กรุณาให้ข้อมูลที่ถูกต้องและครบถ้วน</li>
                            <li>สามารถแก้ไขหรือลบการเดินทางได้ภายหลัง</li>
                            <li>การยกเลิกทริปหลังมีการจองอาจมีค่าปรับ</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

import VehicleModal from '~/components/VehicleModal.vue';
definePageMeta({ middleware: 'auth' })

const isModalOpen = ref(false);
const vehicleCount = ref(0);
const { $api } = useNuxtApp();

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