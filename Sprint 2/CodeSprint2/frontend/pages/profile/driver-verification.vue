<template>
    <div class="bg-gray-50">
        <div class="flex items-center justify-center min-h-screen py-8">
            <div
                class="flex w-full max-w-6xl mx-4 overflow-hidden bg-white border border-gray-300 rounded-lg shadow-lg">

                <ProfileSidebar />

                <main class="flex-1 p-8 ">

                    <div class="mb-8">
                        <div class="p-6 bg-white border border-gray-300 shadow rounded-xl">
                            <div class="flex items-center justify-between mb-4">
                                <h2 class="text-lg font-semibold text-gray-900">
                                    ข้อมูลการยืนยันผู้ขับขี่ของฉัน
                                </h2>

                                <!-- แสดงเฉพาะเมื่อมีข้อมูล meVerification -->
                                <span v-if="meVerification"
                                    class="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full"
                                    :class="statusBadgeClass(meVerification.status)">
                                    {{ statusLabel(meVerification.status) }}
                                </span>
                            </div>

                            <div v-if="isLoadingMe" class="text-gray-500">กำลังโหลดข้อมูล...</div>

                            <div v-else-if="meVerification" class="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <div class="text-sm text-gray-500">ชื่อบนบัตร</div>
                                    <div class="font-medium text-gray-900">{{ meVerification.firstNameOnLicense }}</div>
                                </div>
                                <div>
                                    <div class="text-sm text-gray-500">นามสกุลบนบัตร</div>
                                    <div class="font-medium text-gray-900">{{ meVerification.lastNameOnLicense }}</div>
                                </div>
                                <div>
                                    <div class="text-sm text-gray-500">เลขที่ใบขับขี่</div>
                                    <div class="flex items-center font-medium text-gray-900 break-all">
                                        <span>{{ showLicense ? meVerification.licenseNumber :
                                            maskedLicense(meVerification.licenseNumber) }}</span>
                                        <button type="button" @click="showLicense = !showLicense"
                                            class="p-1 ml-2 text-gray-500 rounded hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            :aria-label="showLicense ? 'ซ่อนเลขที่ใบขับขี่' : 'แสดงเลขที่ใบขับขี่'"
                                            title="สลับการแสดงเลขที่ใบขับขี่">
                                            <!-- eye (show) -->
                                            <svg v-if="!showLicense" class="w-5 h-5" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            <!-- eye-off (hide) -->
                                            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a10.053 10.053 0 012.227-3.592M6.223 6.223A10.05 10.05 0 0112 5c4.477 0 8.268 2.943 9.542 7a10.05 10.05 0 01-2.042 3.33M15 12a3 3 0 00-3-3M3 3l18 18" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <div class="text-sm text-gray-500">ชนิดของบัตรขับขี่</div>
                                    <div class="font-medium text-gray-900">{{ typeLabel(meVerification.typeOnLicense) }}
                                    </div>
                                </div>
                                <div>
                                    <div class="text-sm text-gray-500">วันออกใบขับขี่</div>
                                    <div class="font-medium text-gray-900">{{
                                        formatDate(meVerification.licenseIssueDate) }}</div>
                                </div>
                                <div>
                                    <div class="text-sm text-gray-500">วันหมดอายุใบขับขี่</div>
                                    <div class="font-medium text-gray-900">{{
                                        formatDate(meVerification.licenseExpiryDate) }}</div>
                                </div>
                            </div>

                            <div v-else class="text-gray-500">
                                ยังไม่มีประวัติการยืนยันผู้ขับขี่
                            </div>
                        </div>
                    </div>

                    <div class="mb-8 text-center">
                        <div class="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-600 rounded-full">
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                                </path>
                            </svg>
                        </div>
                        <h1 class="mb-2 text-3xl font-bold text-gray-800">การยืนยันตัวตนสำหรับผู้ขับขี่</h1>
                        <p class="max-w-md mx-auto text-gray-600">
                            อัปโหลดภาพบัตรขับขี่ประจำตัวและรูปถ่าย เพื่อยืนยันตัวตนของคุณ
                        </p>
                    </div>

                    <div class="p-8 bg-white rounded-xl ">
                        <form @submit.prevent="handleSubmit" novalidate class="space-y-8">

                            <div class="relative">
                                <div class="flex items-center mb-6">
                                    <div class="mr-4 step-indicator">1</div>
                                    <label class="text-xl font-semibold text-gray-800">
                                        รูปบัตรขับขี่ประจำตัว (ด้านหน้า) <span class="text-red-500">*</span>
                                    </label>
                                </div>
                                <h4 class="mb-2 text-sm font-medium text-gray-700">ตัวอย่างที่ถูกต้อง:</h4>
                                <div class="grid gap-6 mb-6 md:grid-cols-2">
                                    <div class="space-y-4">
                                        <div class="relative h-40 p-6 license-card">
                                            <div class="relative z-10 flex flex-col justify-between h-full">
                                                <div class="flex items-start justify-between">
                                                    <div>
                                                        <div class="thai-text">ใบอนุญาติขับรถยนต์</div>
                                                        <div class="text-xs font-bold text-blue-800">DRIVING LICENSE
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="flex items-center space-x-3">
                                                    <div
                                                        class="flex items-center justify-center w-12 h-12 bg-blue-300 rounded-md">
                                                        <svg class="w-6 h-6 text-blue-700" fill="currentColor"
                                                            viewBox="0 0 20 20">
                                                            <path fill-rule="evenodd"
                                                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                                                clip-rule="evenodd"></path>
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <div class="text-xs font-semibold text-blue-800">นาย สมชาย ใจดี
                                                        </div>
                                                        <div class="text-xs text-blue-700">เลขที่ 12345678</div>
                                                        <div class="text-xs text-blue-600">หมดอายุ 01/01/2027</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <p class="text-xs text-center text-gray-600">วางบัตรบนพื้นผิวเรียบ ถ่ายให้ชัดเจน
                                        </p>
                                    </div>
                                    <div @click="triggerFileInput('licensePhoto')"
                                        class="relative flex items-center justify-center h-40 p-8 border-2 border-gray-300 border-dashed rounded-lg upload-zone bg-gray-50 hover:bg-gray-100 hover:border-blue-400">
                                        <div v-if="!previews.licensePhoto" class="text-center">
                                            <svg class="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none"
                                                stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <p class="mb-2 text-lg text-gray-600">คลิกเพื่ออัปโหลด</p>
                                            <p class="text-sm text-gray-500">JPG, PNG (ไม่เกิน 10MB)</p>
                                        </div>
                                        <img v-else :src="previews.licensePhoto"
                                            class="object-cover w-full h-full rounded-md" />
                                        <input type="file" ref="licensePhotoInput"
                                            @change="handleFileChange($event, 'licensePhoto')" class="hidden"
                                            accept="image/png, image/jpeg" />
                                    </div>
                                </div>
                            </div>

                            <div class="relative">
                                <div class="flex items-center mb-6">
                                    <div class="mr-4 step-indicator">2</div>
                                    <label class="text-xl font-semibold text-gray-800">
                                        รูปถ่าย (Selfie) <span class="text-red-500">*</span>
                                    </label>
                                </div>
                                <h4 class="mb-2 text-sm font-medium text-gray-700">ตัวอย่างที่ถูกต้อง:</h4>
                                <div class="grid gap-6 mb-6 md:grid-cols-2">
                                    <div class="space-y-4">
                                        <div class="relative h-40 p-6 selfie-frame">
                                            <div class="relative z-10 flex items-center justify-center h-full">
                                                <div class="flex items-center space-x-4">
                                                    <div
                                                        class="flex items-center justify-center w-20 h-20 person-silhouette">
                                                        <svg class="w-12 h-12 text-gray-200" fill="currentColor"
                                                            viewBox="0 0 20 20">
                                                            <path fill-rule="evenodd"
                                                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                                                clip-rule="evenodd"></path>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <p class="text-xs text-center text-gray-600">ถือบัตรชิดข้างใบหน้า
                                            ให้เห็นทั้งสองอย่างชัดเจน</p>
                                    </div>
                                    <div @click="triggerFileInput('selfiePhoto')"
                                        class="relative flex items-center justify-center h-40 p-8 border-2 border-gray-300 border-dashed rounded-lg upload-zone bg-gray-50 hover:bg-gray-100 hover:border-blue-400">
                                        <div v-if="!previews.selfiePhoto" class="text-center">
                                            <svg class="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none"
                                                stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <p class="mb-2 text-lg text-gray-600">คลิกเพื่ออัปโหลด</p>
                                            <p class="text-sm text-gray-500">JPG, PNG (ไม่เกิน 10MB)</p>
                                        </div>
                                        <img v-else :src="previews.selfiePhoto"
                                            class="object-cover w-full h-full rounded-md" />
                                        <input type="file" ref="selfiePhotoInput"
                                            @change="handleFileChange($event, 'selfiePhoto')" class="hidden"
                                            accept="image/png, image/jpeg" />
                                    </div>
                                </div>
                            </div>

                            <div class="relative">
                                <div class="flex items-center mb-4">
                                    <div class="mr-4 step-indicator">3</div>
                                    <h2 class="text-xl font-semibold text-gray-800">ข้อมูลในบัตรขับขี่ประจำตัว</h2>
                                </div>
                                <div class="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
                                    <div>
                                        <label for="firstNameOnLicense"
                                            class="block mb-2 text-sm font-medium text-gray-700">ชื่อ (บนบัตร) <span
                                                class="text-red-500">*</span></label>
                                        <input v-model="form.firstNameOnLicense" id="firstNameOnLicense" type="text"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required />
                                    </div>
                                    <div>
                                        <label for="lastNameOnLicense"
                                            class="block mb-2 text-sm font-medium text-gray-700">นามสกุล (บนบัตร) <span
                                                class="text-red-500">*</span></label>
                                        <input v-model="form.lastNameOnLicense" id="lastNameOnLicense" type="text"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required />
                                    </div>
                                    <div>
                                        <label for="licenseNumber"
                                            class="block mb-2 text-sm font-medium text-gray-700">เลขที่ใบขับขี่ <span
                                                class="text-red-500">*</span></label>
                                        <input v-model="form.licenseNumber" id="licenseNumber" type="text"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required />
                                    </div>
                                    <div>
                                        <label for="typeOnLicense"
                                            class="block mb-2 text-sm font-medium text-gray-700">ชนิดของบัตรขับขี่ <span
                                                class="text-red-500">*</span></label>
                                        <select v-model="form.typeOnLicense" id="typeOnLicense"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required>
                                            <option disabled value="">กรุณาเลือกชนิดของบัตร</option>
                                            <option value="PRIVATE_CAR_TEMPORARY">รถยนต์ส่วนบุคคลชั่วคราว (2 ปี)
                                            </option>
                                            <option value="PRIVATE_CAR">รถยนต์ส่วนบุคคล (5 ปี)</option>
                                            <option value="PUBLIC_CAR">รถยนต์สาธารณะ</option>
                                            <option value="LIFETIME">ตลอดชีพ</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label for="licenseIssueDate"
                                            class="block mb-2 text-sm font-medium text-gray-700">วันออกใบขับขี่ <span
                                                class="text-red-500">*</span></label>
                                        <input v-model="form.licenseIssueDate" id="licenseIssueDate" type="date"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required />
                                    </div>
                                    <div>
                                        <label for="licenseExpiryDate"
                                            class="block mb-2 text-sm font-medium text-gray-700">วันหมดอายุใบขับขี่
                                            <span class="text-red-500">*</span></label>
                                        <input v-model="form.licenseExpiryDate" id="licenseExpiryDate" type="date"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required />
                                    </div>
                                </div>
                            </div>

                            <p class="mt-4 text-sm text-center text-gray-500">
                                ข้อมูลของคุณจะได้รับการตรวจสอบโดยเจ้าหน้าที่ระบบโดยเร็วที่สุด
                            </p>
                            <div class="flex justify-end gap-4 pt-6">
                                <button type="button" @click="resetForm" :disabled="isLoading"
                                    class="px-6 py-3 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50">
                                    ยกเลิก
                                </button>
                                <button type="submit" :disabled="!isFormValid || isLoading"
                                    class="flex items-center px-6 py-3 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed">
                                    <svg v-if="isLoading" class="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
                                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                        </path>
                                    </svg>
                                    {{ isLoading ? 'กำลังส่งข้อมูล...' : 'ส่งคำขอยืนยันตัวตน' }}
                                </button>
                            </div>

                        </form>
                    </div>
                </main>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import ProfileSidebar from '~/components/ProfileSidebar.vue';
import { useToast } from '~/composables/useToast';

definePageMeta({
    middleware: 'auth'
});

const { $api } = useNuxtApp();
const { toast } = useToast();

const isLoading = ref(false);
const licensePhotoInput = ref(null);
const selfiePhotoInput = ref(null);

const form = reactive({
    licenseNumber: '',
    firstNameOnLicense: '',
    lastNameOnLicense: '',
    licenseIssueDate: '',
    licenseExpiryDate: '',
    typeOnLicense: '',
    licensePhoto: null,
    selfiePhoto: null,
});

const previews = reactive({
    licensePhoto: '',
    selfiePhoto: ''
});

const meVerification = ref(null)
const isLoadingMe = ref(false)
const showLicense = ref(false)

const typeLabelMap = {
    PRIVATE_CAR_TEMPORARY: 'รถยนต์ส่วนบุคคลชั่วคราว (2 ปี)',
    PRIVATE_CAR: 'รถยนต์ส่วนบุคคล (5 ปี)',
    PUBLIC_CAR: 'รถยนต์สาธารณะ',
    LIFETIME: 'ตลอดชีพ',
}
const statusLabelMap = {
    PENDING: 'กำลังตรวจสอบ',
    APPROVED: 'อนุมัติแล้ว',
    REJECTED: 'ถูกปฏิเสธ',
}

const typeLabel = (v) => typeLabelMap[v] || v

const formatDate = (iso) => {
    if (!iso) return '-'
    try {
        return new Date(iso).toLocaleDateString('th-TH', { day: '2-digit', month: 'long', year: 'numeric' })
    } catch { return '-' }
}

const statusLabel = (v) => statusLabelMap[v] || v || '-'

const statusBadgeClass = (v) => {
    switch (v) {
        case 'APPROVED':
            return 'bg-green-100 text-green-700 border border-green-200'
        case 'REJECTED':
            return 'bg-red-100 text-red-700 border border-red-200'
        case 'PENDING':
        default:
            return 'bg-amber-100 text-amber-700 border border-amber-200'
    }
}

const fetchMyDriverVerification = async () => {
    isLoadingMe.value = true
    try {
        const res = await $api('/driver-verifications/me')
        // รองรับทั้ง { success, data } หรือ array safety
        const record = (res && typeof res === 'object' && 'data' in res) ? res.data : res
        meVerification.value = record || null
    } catch (e) {
        // ถ้าไม่มีข้อมูล/404 จะไม่ขึ้น error toast ตามที่ขอ — แค่ไม่แสดงบล็อก
        meVerification.value = null
    } finally {
        isLoadingMe.value = false
    }
}

const maskedLicense = (value) => {
    if (!value) return '-'
    const s = String(value)
    const last4 = s.slice(-4)
    return '•'.repeat(Math.max(0, s.length - 4)) + last4
}

const isFormValid = computed(() => {
    return form.licenseNumber && form.firstNameOnLicense && form.lastNameOnLicense &&
        form.licenseIssueDate && form.licenseExpiryDate && form.typeOnLicense &&
        form.licensePhoto && form.selfiePhoto;
});

const triggerFileInput = (type) => {
    if (type === 'licensePhoto') {
        licensePhotoInput.value?.click();
    } else if (type === 'selfiePhoto') {
        selfiePhotoInput.value?.click();
    }
};

const handleFileChange = (event, type) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (type === 'licensePhoto') {
        form.licensePhoto = file;
        previews.licensePhoto = URL.createObjectURL(file);
    } else if (type === 'selfiePhoto') {
        form.selfiePhoto = file;
        previews.selfiePhoto = URL.createObjectURL(file);
    }
};

const resetForm = () => {
    form.licenseNumber = '';
    form.firstNameOnLicense = '';
    form.lastNameOnLicense = '';
    form.licenseIssueDate = '';
    form.licenseExpiryDate = '';
    form.typeOnLicense = '';
    form.licensePhoto = null;
    form.selfiePhoto = null;
    previews.licensePhoto = '';
    previews.selfiePhoto = '';

    if (licensePhotoInput.value) licensePhotoInput.value.value = '';
    if (selfiePhotoInput.value) selfiePhotoInput.value.value = '';
};

const handleSubmit = async () => {
    if (!isFormValid.value) {
        toast.warning('ข้อมูลไม่ครบถ้วน', 'กรุณากรอกข้อมูลและอัปโหลดรูปภาพให้ครบทุกช่อง');
        return;
    }
    isLoading.value = true;
    try {
        const formData = new FormData();
        formData.append('licenseNumber', form.licenseNumber);
        formData.append('firstNameOnLicense', form.firstNameOnLicense);
        formData.append('lastNameOnLicense', form.lastNameOnLicense);
        formData.append('typeOnLicense', form.typeOnLicense);
        formData.append('licenseIssueDate', new Date(form.licenseIssueDate).toISOString());
        formData.append('licenseExpiryDate', new Date(form.licenseExpiryDate).toISOString());

        if (form.licensePhoto) {
            formData.append('licensePhotoUrl', form.licensePhoto);
        }
        if (form.selfiePhoto) {
            formData.append('selfiePhotoUrl', form.selfiePhoto);
        }

        await $api('/driver-verifications', {
            method: 'POST',
            body: formData,
        });

        toast.success('ส่งข้อมูลสำเร็จ', 'คำขอยืนยันตัวตนผู้ขับขี่ของคุณถูกส่งแล้ว');
        resetForm();

    } catch (error) {
        toast.error('เกิดข้อผิดพลาด', error.data?.message || 'ไม่สามารถส่งข้อมูลได้');
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchMyDriverVerification()
})

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