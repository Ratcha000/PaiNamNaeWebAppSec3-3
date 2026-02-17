<template>
    <transition name="modal-fade">
        <div v-if="show" class="modal-overlay" @click.self="$emit('close')">

            <div v-if="currentView === 'list'"
                class="bg-white rounded-2xl w-full max-w-lg mx-auto relative shadow-2xl transition-all duration-300 flex flex-col max-h-[90vh]">
                <div class="flex items-center justify-between p-8 pb-6 border-b border-gray-200">
                    <div class="flex items-center gap-4">
                        <div
                            class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                                </path>
                            </svg>
                        </div>
                        <div>
                            <h2 class="text-xl font-semibold text-gray-800">จัดการข้อมูลรถยนต์</h2>
                            <p class="text-gray-600 mt-1">เลือกรถยนต์ที่จะใช้ หรือเพิ่มคันใหม่</p>
                        </div>
                    </div>
                    <button @click="$emit('close')"
                        class="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <div class="p-8 space-y-6 overflow-y-auto">
                    <button @click="showFormView('add')"
                        class="w-full border-2 border-dashed border-blue-300 text-blue-600 py-6 rounded-xl hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 flex items-center justify-center gap-3 group">
                        <div
                            class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <span class="text-xl font-medium">+</span>
                        </div>
                        <span class="font-medium text-lg">เพิ่มรถยนต์คันใหม่</span>
                    </button>

                    <div v-if="isLoading" class="text-center py-8 text-gray-500">กำลังโหลด...</div>

                    <div v-if="!isLoading && vehicles.length > 0" v-for="vehicle in vehicles" :key="vehicle.id"
                        class="border-2 rounded-xl p-4 relative"
                        :class="vehicle.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-300'">
                        <div class="flex items-start gap-4">
                            <img :src="vehicle.photos?.[0] || 'https://placehold.co/100x100/e2e8f0/e2e8f0'"
                                alt="Vehicle Photo" class="w-20 h-20 rounded-lg object-cover bg-gray-200">
                            <div class="flex-1">
                                <p class="font-semibold text-gray-800">{{ vehicle.vehicleModel }}</p>
                                <p class="text-sm text-gray-600">{{ vehicle.licensePlate }}</p>
                                <p class="text-sm text-gray-500">{{ vehicle.vehicleType }} - {{ vehicle.color }}</p>
                                <span v-if="vehicle.isDefault"
                                    class="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium mt-2 inline-block">ค่าเริ่มต้น</span>
                            </div>
                            <div class="flex flex-col gap-2">
                                <button @click="showFormView('edit', vehicle)"
                                    class="text-blue-600 text-sm border-2 border-blue-600 px-3 py-1 rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium">แก้ไข</button>
                                <button @click="handleDelete(vehicle.id)"
                                    class="text-red-500 text-sm border-2 border-red-500 px-3 py-1 rounded-lg hover:bg-red-50 transition-all duration-200 font-medium">ลบ</button>
                            </div>
                        </div>
                        <button v-if="!vehicle.isDefault" @click="handleSetDefault(vehicle.id)"
                            class="mt-3 w-full text-center text-sm text-gray-600 hover:text-blue-600 font-medium">
                            ตั้งเป็นค่าเริ่มต้น
                        </button>
                    </div>

                    <div v-if="!isLoading && vehicles.length === 0" class="text-center py-8">
                        <p class="text-gray-500 text-base">คุณยังไม่มีข้อมูลรถยนต์ที่บันทึกไว้</p>
                    </div>
                </div>

                <div class="flex gap-4 p-8 pt-0 mt-auto border-t border-gray-100">
                    <button @click="$emit('close')"
                        class="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                        ปิด
                    </button>
                    <button @click="$emit('close')"
                        class="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl">
                        ยืนยัน
                    </button>
                </div>
            </div>

            <div v-if="currentView === 'form'"
                class="bg-white rounded-2xl w-full max-w-2xl mx-auto relative max-h-[90vh] flex flex-col shadow-2xl">
                <div
                    class="flex items-center gap-4 p-8 pb-6 sticky top-0 bg-white border-b border-gray-300 rounded-t-2xl z-10">
                    <button @click="currentView = 'list'" class="text-gray-500 hover:text-gray-800"><svg class="w-6 h-6"
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7">
                            </path>
                        </svg></button>
                    <div>
                        <h2 class="text-xl font-semibold text-gray-800">{{ formMode === 'add' ? 'เพิ่มรถยนต์คันใหม่' :
                            'แก้ไขข้อมูลรถยนต์' }}</h2>
                        <p class="text-gray-600 mt-1">กรอกรายละเอียดรถยนต์ของคุณให้ครบถ้วน</p>
                    </div>
                </div>

                <form @submit.prevent="handleFormSubmit" class="p-8 space-y-6 overflow-y-auto">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">ยี่ห้อและรุ่นรถ</label>
                            <input type="text" v-model="form.vehicleModel" placeholder="เช่น Toyota Camry"
                                class="form-input">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">หมายเลขทะเบียน</label>
                            <input type="text" v-model="form.licensePlate" placeholder="เช่น กก 1234 ขอนแก่น"
                                class="form-input">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">ชนิดของรถ</label>
                            <select v-model="form.vehicleType" class="form-input">
                                <option disabled value="">กรุณาเลือกชนิด</option>
                                <option>Sedan</option>
                                <option>SUV</option>
                                <option>Hatchback</option>
                                <option>Van</option>
                                <option>Pickup</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">สีรถ</label>
                            <input type="text" v-model="form.color" placeholder="เช่น สีดำ" class="form-input">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">จำนวนที่นั่ง (ไม่รวมคนขับ)</label>
                        <input type="number" v-model.number="form.seatCapacity" min="1" max="12" placeholder="เช่น 4"
                            class="form-input">
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">สิ่งอำนวยความสะดวก (คั่นด้วยจุลภาค
                            ,)</label>
                        <input type="text" v-model="amenitiesInput"
                            placeholder="เช่น Air Conditioner, Music, Phone Charger" class="form-input">
                    </div>

                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">รูปภาพรถยนต์ (3 รูป)</label>
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div v-for="(label, index) in ['รูปด้านหน้า', 'รูปด้านข้าง', 'รูปภายใน']" :key="index">
                                <label class="block text-sm font-medium text-gray-600 mb-2">{{ label }}</label>
                                <div @click="photoInputs[index]?.click()"
                                    class="image-uploader border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors cursor-pointer bg-gray-50 relative">
                                    <div v-if="!photoPreviews[index]" class="text-center">
                                        <svg class="w-8 h-8 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none"
                                            viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                        </svg>
                                        <span class="text-xs mt-1">อัปโหลด</span>
                                    </div>
                                    <img v-else :src="photoPreviews[index]"
                                        class="w-full h-full object-cover rounded-md" />
                                    <input type="file" :ref="el => photoInputs[index] = el"
                                        @change="handleFileChange($event, index)" class="hidden"
                                        accept="image/png, image/jpeg" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div class="flex items-start gap-3">
                            <input type="checkbox" v-model="form.isDefault" id="isDefault"
                                class="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 mt-0.5">
                            <div>
                                <label for="isDefault"
                                    class="text-gray-800 font-medium cursor-pointer">ตั้งเป็นรถยนต์คันหลัก</label>
                                <p class="text-gray-600 text-sm mt-1">รถยนต์นี้จะถูกเลือกโดยอัตโนมัติในครั้งถัดไป</p>
                            </div>
                        </div>
                    </div>

                    <div class="flex gap-4 pt-6 mt-auto">
                        <button type="button" @click="currentView = 'list'"
                            class="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                            ยกเลิก
                        </button>
                        <button type="submit" :disabled="isLoading"
                            class="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed">
                            {{ isLoading ? 'กำลังบันทึก...' : 'บันทึก' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useToast } from '~/composables/useToast';

const props = defineProps({
    show: Boolean
});
const emit = defineEmits(['close']);

const { $api } = useNuxtApp();
const { toast } = useToast();

const isLoading = ref(false);
const currentView = ref('list');
const formMode = ref('add');
const vehicles = ref([]);
const editingVehicleId = ref(null);

const form = reactive({
    vehicleModel: '',
    licensePlate: '',
    vehicleType: '',
    color: '',
    seatCapacity: 4,
    amenities: [],
    photos: [null, null, null],
    isDefault: false,
});
const amenitiesInput = ref('');
const photoPreviews = ref(['', '', '']);
const photoInputs = ref([]);

watch(() => props.show, (newVal) => {
    if (newVal) {
        fetchVehicles();
        currentView.value = 'list';
    }
});

const fetchVehicles = async () => {
    isLoading.value = true;
    try {
        vehicles.value = await $api('/vehicles');
    } catch (error) {
        toast.error('เกิดข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลรถยนต์ได้');
    } finally {
        isLoading.value = false;
    }
};

const showFormView = (mode, vehicle = null) => {
    formMode.value = mode;
    if (mode === 'edit' && vehicle) {
        editingVehicleId.value = vehicle.id;
        form.vehicleModel = vehicle.vehicleModel;
        form.licensePlate = vehicle.licensePlate;
        form.vehicleType = vehicle.vehicleType;
        form.color = vehicle.color;
        form.seatCapacity = vehicle.seatCapacity;
        form.isDefault = vehicle.isDefault;
        amenitiesInput.value = vehicle.amenities.join(', ');
        photoPreviews.value = [...vehicle.photos, '', '', ''].slice(0, 3);
        form.photos = [null, null, null];
    } else {
        resetForm();
    }
    currentView.value = 'form';
};

const resetForm = () => {
    Object.assign(form, {
        vehicleModel: '', licensePlate: '', vehicleType: '', color: '', seatCapacity: 4, amenities: [], photos: [null, null, null], isDefault: false
    });
    amenitiesInput.value = '';
    photoPreviews.value = ['', '', ''];
    editingVehicleId.value = null;
    photoInputs.value.forEach(input => { if (input) input.value = '' });
};

const handleFileChange = (event, index) => {
    const file = event.target.files[0];
    if (file) {
        form.photos[index] = file;
        photoPreviews.value[index] = URL.createObjectURL(file);
    }
};

const handleFormSubmit = async () => {
    isLoading.value = true;

    // แปลง input string เป็น array
    form.amenities = amenitiesInput.value.split(',').map(item => item.trim()).filter(Boolean);

    const formData = new FormData();

    // [UPDATED] Append fields one by one with correct types
    formData.append('vehicleModel', form.vehicleModel);
    formData.append('licensePlate', form.licensePlate);
    formData.append('vehicleType', form.vehicleType);
    formData.append('color', form.color);
    formData.append('seatCapacity', form.seatCapacity);
    formData.append('isDefault', form.isDefault); // Sent as "true" or "false" string

    // For amenities, send as a JSON string so the backend can parse it back to an array
    formData.append('amenities', JSON.stringify(form.amenities));

    form.photos.forEach(file => {
        if (file instanceof File) {
            formData.append('photos', file);
        }
    });

    try {
        if (formMode.value === 'add') {
            await $api('/vehicles', { method: 'POST', body: formData });
            toast.success('สำเร็จ', 'เพิ่มข้อมูลรถยนต์เรียบร้อยแล้ว');
        } else {
            await $api(`/vehicles/${editingVehicleId.value}`, { method: 'PUT', body: formData });
            toast.success('สำเร็จ', 'แก้ไขข้อมูลรถยนต์เรียบร้อยแล้ว');
        }
        await fetchVehicles();
        currentView.value = 'list';
    } catch (error) {
        toast.error('เกิดข้อผิดพลาด', error.data?.message || 'ไม่สามารถบันทึกข้อมูลได้');
    } finally {
        isLoading.value = false;
    }
};

const handleSetDefault = async (vehicleId) => {
    try {
        await $api(`/vehicles/${vehicleId}/default`, { method: 'PUT' });
        toast.success('สำเร็จ', 'ตั้งเป็นรถยนต์คันหลักแล้ว');
        await fetchVehicles();
    } catch (error) {
        toast.error('เกิดข้อผิดพลาด', error.data?.message || 'ไม่สามารถตั้งเป็นค่าเริ่มต้นได้');
    }
};

const handleDelete = async (vehicleId) => {
    try {
        await $api(`/vehicles/${vehicleId}`, { method: 'DELETE' });
        toast.success('สำเร็จ', 'ลบรถยนต์เรียบร้อยแล้ว');
        await fetchVehicles();
    } catch (error) {
        toast.error('เกิดข้อผิดพลาด', error.data?.message || 'ไม่สามารถลบรถยนต์ได้');
    }
};
</script>

<style scoped>
/* .modal-backdrop {
    backdrop-filter: blur(4px);
} */

.form-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    transition: all 0.2s;
}

.form-input:focus {
    --tw-ring-color: rgb(59 130 246);
    border-color: rgb(59 130 246);
    box-shadow: 0 0 0 2px var(--tw-ring-color);
    outline: none;
}

.image-uploader {
    height: 8rem;
    width: 100%;
}

.modal-overlay {
    position: fixed;
    z-index: 50;
    /* z-index ตรงกับที่เคยใช้ */
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    /* p-4 */
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-fade-enter-active .modal-content,
.modal-fade-leave-active .modal-content {
    transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
    transform: scale(0.9) translateY(1rem);
}
</style>