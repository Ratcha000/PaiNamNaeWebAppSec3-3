<template>
    <div>
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="mb-8">
                <h2 class="text-3xl font-bold text-gray-900 mb-2">
                    สร้างการเดินทางของคุณ
                </h2>
                <p class="text-gray-600">
                    กำหนดจุดเริ่มต้น ปลายทาง และรายละเอียดต่างๆ เพื่อให้ผู้โดยสารมาร่วมทาง
                </p>
            </div>

            <div class="bg-white rounded-lg shadow-md p-8">
                <form @submit.prevent="handleSubmit" id="postRouteForm" novalidate class="space-y-8">
                    <div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                            ข้อมูลเส้นทาง
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label for="startPoint" class="block text-sm font-medium text-gray-700 mb-2">
                                    จุดเริ่มต้น <span class="text-red-500">*</span>
                                </label>
                                <input v-model="form.startPoint" id="startPoint" name="startPoint" type="text"
                                    placeholder="เช่น กรุงเทพมหานคร, ถนนสุขุมวิท" required
                                    class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500" />
                            </div>
                            <div>
                                <label for="endPoint" class="block text-sm font-medium text-gray-700 mb-2">
                                    จุดปลายทาง <span class="text-red-500">*</span>
                                </label>
                                <input v-model="form.endPoint" id="endPoint" name="endPoint" type="text"
                                    placeholder="เช่น เชียงใหม่, ถนนนิมมานเหมินท์" required
                                    class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                            รายละเอียดการเดินทาง
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label for="travelDate" class="block text-sm font-medium text-gray-700 mb-2">
                                    วันที่เดินทาง <span class="text-red-500">*</span>
                                </label>
                                <input v-model="form.date" id="travelDate" name="travelDate" type="date" required
                                    class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500" />
                            </div>
                            <div>
                                <label for="travelTime" class="block text-sm font-medium text-gray-700 mb-2">
                                    เวลาออกเดินทาง <span class="text-red-500">*</span>
                                </label>
                                <input v-model="form.time" id="travelTime" name="travelTime" type="time" required
                                    class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500" />
                            </div>
                            <div>
                                <label for="seatCount" class="block text-sm font-medium text-gray-700 mb-2">
                                    จำนวนที่นั่งที่รับได้ <span class="text-red-500">*</span>
                                </label>
                                <input v-model.number="form.availableSeats" id="seatCount" name="seatCount"
                                    type="number" min="1" placeholder="กรอกจำนวนที่นั่ง (เช่น 4)" required
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
                                <input v-model.number="form.pricePerSeat" id="pricePerSeat" name="pricePerSeat"
                                    type="number" min="0" placeholder="เช่น 250" required
                                    class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                            ข้อมูลรถยนต์
                        </h3>
                        <div v-if="vehicles.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                            <div>
                                <label for="vehicle" class="block text-sm font-medium text-gray-700 mb-2">
                                    เลือกรถยนต์ที่จะใช้ <span class="text-red-500">*</span>
                                </label>
                                <select v-model="form.vehicleId" id="vehicle" name="vehicle"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500">
                                    <option disabled value="">กรุณาเลือกรถยนต์</option>
                                    <option v-for="v in vehicles" :key="v.id" :value="v.id">
                                        {{ v.vehicleModel }} ({{ v.licensePlate }})
                                    </option>
                                </select>
                            </div>
                            <div class="self-end">
                                <button type="button" @click="isModalOpen = true"
                                    class="w-full md:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm px-4 py-3 rounded-md transition-colors">
                                    เพิ่ม / จัดการข้อมูลรถยนต์
                                </button>
                            </div>
                        </div>
                        <div v-else class="bg-white rounded-xl shadow-xl p-8 border border-gray-300">
                            <div
                                class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-[#F2F2F2] p-4 md:px-6 md:py-6 rounded-[8px]">
                                <p class="text-gray-800 text-base md:text-[18px] text-center sm:text-left">
                                    คุณยังไม่มีข้อมูลรถยนต์
                                </p>
                                <button type="button" @click="isModalOpen = true"
                                    class="bg-[#2563EB] hover:bg-blue-600 text-white text-sm md:text-[16px] px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                                    เพิ่ม / จัดการข้อมูล
                                </button>
                            </div>
                        </div>
                    </div>
                    <VehicleModal :show="isModalOpen" @close="closeAndRefresh" />

                    <div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                            เงื่อนไขและข้อตกลง
                        </h3>
                        <textarea v-model="form.conditions" id="terms" name="terms" rows="4"
                            placeholder="ระบุเงื่อนไข เช่น ไม่สูบบุหรี่, ไม่นำสัตว์เลี้ยง, ชำระเงินล่วงหน้า 50%"
                            class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 resize-none"></textarea>
                    </div>

                    <div class="pt-6 flex justify-end gap-4">
                        <button type="button"
                            class="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            ยกเลิก
                        </button>
                        <button type="submit" :disabled="isLoading"
                            class="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed">
                            {{ isLoading ? 'กำลังสร้าง...' : 'สร้างการเดินทาง' }}
                        </button>
                    </div>
                </form>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useToast } from '~/composables/useToast';
import { navigateTo } from '#app';
import VehicleModal from '~/components/VehicleModal.vue';

definePageMeta({ middleware: 'auth' })

const { $api } = useNuxtApp();
const { toast } = useToast();

const isModalOpen = ref(false);
const isLoading = ref(false);
const vehicles = ref([]);

const form = reactive({
    vehicleId: '',
    startPoint: '', // ค่าเริ่มต้นสำหรับแสดงผล, จะถูกแทนที่ด้วย lat/lng ตอนส่ง
    endPoint: '', // ค่าเริ่มต้นสำหรับแสดงผล
    date: '',
    time: '',
    availableSeats: null,
    pricePerSeat: null,
    conditions: '',
});

const fetchVehicles = async () => {
    try {
        const userVehicles = await $api('/vehicles');
        vehicles.value = userVehicles;
        // [เพิ่ม] ตั้งค่ารถคันแรก (หรือคันที่เป็น default) เป็นค่าเริ่มต้นในฟอร์ม
        if (userVehicles.length > 0) {
            const defaultVehicle = userVehicles.find(v => v.isDefault) || userVehicles[0];
            form.vehicleId = defaultVehicle.id;
        }
    } catch (error) {
        console.error("Failed to fetch vehicles:", error);
        if (showErrorToast) {
            toast.error('เกิดข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลรถยนต์ได้');
        }
    }
};

const closeAndRefresh = async () => {
    isModalOpen.value = false;
    await fetchVehicles(false); // Refresh list but suppress error toast
};

const handleSubmit = async () => {
    if (isLoading.value) return
    // Basic validation
    if (!form.vehicleId || !form.date || !form.time || !form.availableSeats || !form.pricePerSeat) {
        toast.error('ข้อมูลไม่ครบถ้วน', 'กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครบถ้วน');
        return;
    }

    isLoading.value = true;

    // รวมวันที่และเวลาเป็น ISO String
    const departureTime = new Date(`${form.date}T${form.time}`).toISOString();

    const payload = {
        vehicleId: form.vehicleId,
        // Fix ค่าตามที่กำหนด
        startLocation: {
            lat: 16.3888,
            lng: 102.8285
        },
        endLocation: {
            lat: 13.7563,
            lng: 100.5018
        },
        departureTime: departureTime,
        availableSeats: Number(form.availableSeats),
        pricePerSeat: Number(form.pricePerSeat),
        conditions: form.conditions
    };

    try {
        await $api('/routes', {
            method: 'POST',
            body: payload
        });

        toast.success('สำเร็จ', 'สร้างเส้นทางการเดินทางเรียบร้อยแล้ว!');

        setTimeout(() => {
            navigateTo('/findTrip');
        }, 1500);

    } catch (error) {
        console.error("Failed to create route:", error);

        if (error.statusCode === 403 && error.data?.message.includes('ยืนยันตัวตนผู้ขับ')) {
            toast.error(
                'จำเป็นต้องยืนยันตัวตน',
                'คุณต้องยืนยันตัวตนผู้ขับก่อนจึงจะสร้างเส้นทางได้'
            );
            setTimeout(() => {
                navigateTo('/profile/driver-verification');
            }, 2000);
        } else {
            // การจัดการ Error ทั่วไป
            toast.error('เกิดข้อผิดพลาด', error.data?.message || 'ไม่สามารถสร้างเส้นทางได้');
        }
    } finally {
        isLoading.value = false;
    }
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