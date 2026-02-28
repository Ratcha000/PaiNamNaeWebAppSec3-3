<template>
    <div class="bg-gray-50">
        <div class="flex items-center justify-center min-h-screen py-8">
            <div
                class="flex w-full max-w-6xl mx-4 overflow-hidden bg-white border border-gray-300 rounded-lg shadow-lg">

                <ProfileSidebar />

                <main class="flex-1 p-8 ">

                    <div class="mb-8">
                        <div class="p-6 bg-white border border-gray-300 shadow rounded-xl">
                            <div class="flex items-center mb-4">
                                <h2 class="text-lg font-semibold text-gray-900">
                                    ข้อมูลการยืนยันขั้นพื้นฐานของฉัน
                                </h2>

                                <!-- แสดงสถานะ isVerified ชิดขวา -->
                                <div class="ml-auto" v-if="meBasic">
                                    <!-- VERIFIED -->
                                    <span v-if="meBasic.isVerified"
                                        class="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200">
                                        <!-- check icon -->
                                        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M5 13l4 4L19 7" />
                                        </svg>
                                        ยืนยันแล้ว
                                    </span>

                                    <!-- NOT VERIFIED -->
                                    <span v-else
                                        class="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200">
                                        <!-- clock icon -->
                                        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        ยังไม่ยืนยัน
                                    </span>
                                </div>
                            </div>

                            <div v-if="isLoadingMeBasic" class="text-gray-500">กำลังโหลดข้อมูล...</div>

                            <div v-else-if="meBasic" class="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <div class="text-sm text-gray-500">ชื่อ</div>
                                    <div class="font-medium text-gray-900">{{ meBasic.firstName || '-' }}</div>
                                </div>
                                <div>
                                    <div class="text-sm text-gray-500">นามสกุล</div>
                                    <div class="font-medium text-gray-900">{{ meBasic.lastName || '-' }}</div>
                                </div>
                                <div>
                                    <div class="text-sm text-gray-500">เลขประจำตัว</div>
                                    <div class="flex items-center font-medium text-gray-900 break-all">
                                        <span>
                                            {{ showNationalId ? formatNationalId(meBasic.nationalIdNumber) :
                                                maskedNationalId(meBasic.nationalIdNumber) }}
                                        </span>
                                        <button type="button" @click="showNationalId = !showNationalId"
                                            class="p-1 ml-2 text-gray-500 rounded hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            :aria-label="showNationalId ? 'ซ่อนเลขประจำตัว' : 'แสดงเลขประจำตัว'"
                                            title="สลับการแสดงเลขประจำตัว">
                                            <!-- eye (show) -->
                                            <svg v-if="!showNationalId" class="w-5 h-5" fill="none"
                                                stroke="currentColor" viewBox="0 0 24 24">
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
                                    <div class="text-sm text-gray-500">วันหมดอายุบัตรประชาชน</div>
                                    <div class="font-medium text-gray-900">{{ formatDate(meBasic.nationalIdExpiryDate)
                                        }}</div>
                                </div>
                            </div>

                            <div v-else class="text-gray-500">
                                ยังไม่มีประวัติการยืนยันขั้นพื้นฐาน
                            </div>
                        </div>
                    </div>
                    <!-- /โซนข้อมูลการยืนยันที่เคยยื่นไว้ (ใหม่) -->


                    <div class="mb-8 text-center">
                        <div class="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-600 rounded-full">
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                                </path>
                            </svg>
                        </div>
                        <h1 class="mb-2 text-3xl font-bold text-gray-800">การยืนยันตัวตนขั้นพื้นฐาน</h1>
                        <p class="max-w-md mx-auto text-gray-600">
                            อัปโหลดภาพบัตรประชาชนและรูปถ่าย เพื่อยืนยันตัวตนของคุณ
                        </p>
                    </div>

                    <div class="p-8 bg-white rounded-xl ">
                        <form @submit.prevent="handleSubmit" novalidate class="space-y-8">

                            <div class="relative">
                                <div class="flex items-center mb-6">
                                    <div class="mr-4 step-indicator">1</div>
                                    <label class="text-xl font-semibold text-gray-800">
                                        รูปบัตรประชาชน (ด้านหน้า) <span class="text-red-500">*</span>
                                    </label>
                                </div>
                                <h4 class="mb-2 text-sm font-medium text-gray-700">ตัวอย่างที่ถูกต้อง:</h4>
                                <div class="grid gap-6 mb-6 md:grid-cols-2">
                                    <div class="space-y-4">
                                        <div class="relative h-40 p-6 license-card">
                                            <div class="relative z-10 flex flex-col justify-between h-full">
                                                <div class="flex items-start justify-between">
                                                    <div>
                                                        <div class="thai-text">ใบบัตรประชาชน</div>
                                                        <div class="text-xs font-bold text-blue-800">ID CARD</div>
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
                                    <div @click="triggerFileInput('nationalIdPhoto')"
                                        class="relative flex items-center justify-center h-40 p-8 border-2 border-gray-300 border-dashed rounded-lg upload-zone bg-gray-50 hover:bg-gray-100 hover:border-blue-400">
                                        <div v-if="!previews.nationalIdPhoto" class="text-center">
                                            <svg class="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none"
                                                stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z">
                                                </path>
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            </svg>
                                            <p class="mb-2 text-lg text-gray-600">คลิกเพื่ออัปโหลด</p>
                                            <p class="text-sm text-gray-500">JPG, PNG (ไม่เกิน 10MB)</p>
                                        </div>
                                        <img v-else :src="previews.nationalIdPhoto"
                                            class="object-cover w-full h-full rounded-md" />
                                        <input type="file" ref="nationalIdInput"
                                            @change="handleFileChange($event, 'nationalIdPhoto')" class="hidden"
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
                                        <input type="file" ref="selfieInput"
                                            @change="handleFileChange($event, 'selfiePhoto')" class="hidden"
                                            accept="image/png, image/jpeg" />
                                    </div>
                                </div>
                            </div>

                            <div class="relative">
                                <div class="flex items-center mb-4">
                                    <div class="mr-4 step-indicator">3</div>
                                    <h2 class="text-xl font-semibold text-gray-800">ข้อมูลในบัตรประจำตัวประชาชน</h2>
                                </div>
                                <div class="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
                                    <div>
                                        <label for="nationalIdNumber"
                                            class="block mb-2 text-sm font-medium text-gray-700">เลขบัตรประชาชน <span
                                                class="text-red-500">*</span></label>
                                        <input v-model="formattedNationalId" id="nationalIdNumber" type="text"
                                            maxlength="17" placeholder="x-xxxx-xxxxx-xx-x"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required />
                                    </div>
                                    <div>
                                        <label for="nationalIdExpiryDate"
                                            class="block mb-2 text-sm font-medium text-gray-700">วันหมดอายุในบัตร <span
                                                class="text-red-500">*</span></label>
                                        <input v-model="form.nationalIdExpiryDate" id="nationalIdExpiryDate" type="date"
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
import { ref, reactive, computed, watch } from 'vue'
import ProfileSidebar from '~/components/ProfileSidebar.vue';
import { useToast } from '~/composables/useToast';
import { useAuth } from '~/composables/useAuth';

definePageMeta({
    middleware: 'auth'
});

const { $api } = useNuxtApp();
const { user: userCookie } = useAuth();
const { toast } = useToast();

const isLoading = ref(false);
const nationalIdInput = ref(null);
const selfieInput = ref(null);

let originalData = null;

const form = reactive({
    nationalIdNumber: '',
    nationalIdExpiryDate: '',
    nationalIdPhoto: null,
    selfiePhoto: null,
});

const formattedNationalId = ref('');

const meBasic = ref(null)
const isLoadingMeBasic = ref(false)
const showNationalId = ref(false)

const formatDate = (iso) => {
    if (!iso) return '-'
    try {
        return new Date(iso).toLocaleDateString('th-TH', { day: '2-digit', month: 'long', year: 'numeric' })
    } catch { return '-' }
}

const formatNationalId = (raw) => {
    if (!raw) return '-'
    const s = String(raw).replace(/\D/g, '').slice(0, 13)
    if (s.length < 13) return s
    return `${s[0]}-${s.slice(1, 5)}-${s.slice(5, 10)}-${s.slice(10, 12)}-${s.slice(12, 13)}`
}

const maskedNationalId = (raw) => {
    if (!raw) return '-'
    const s = String(raw)
    const last4 = s.slice(-4)
    return '•'.repeat(Math.max(0, s.length - 4)) + last4
}

const fetchMeBasic = async () => {
    isLoadingMeBasic.value = true
    try {
        const res = await $api('/users/me')
        const record = (res && typeof res === 'object' && 'data' in res) ? res.data : res
        meBasic.value = record || null
    } catch (e) {
        meBasic.value = null
    } finally {
        isLoadingMeBasic.value = false
    }
}

watch(formattedNationalId, (newValue) => {
    const digitsOnly = newValue.replace(/\D/g, '');
    const truncatedDigits = digitsOnly.slice(0, 13);

    form.nationalIdNumber = truncatedDigits;

    let formatted = '';
    if (truncatedDigits.length > 0) {
        formatted += truncatedDigits.substring(0, 1);
    }
    if (truncatedDigits.length > 1) {
        formatted += '-' + truncatedDigits.substring(1, 5);
    }
    if (truncatedDigits.length > 5) {
        formatted += '-' + truncatedDigits.substring(5, 10);
    }
    if (truncatedDigits.length > 10) {
        formatted += '-' + truncatedDigits.substring(10, 12);
    }
    if (truncatedDigits.length > 12) {
        formatted += '-' + truncatedDigits.substring(12, 13);
    }

    // This check is crucial to prevent the watcher from re-triggering itself
    if (formatted !== newValue) {
        formattedNationalId.value = formatted;
    }
});

const previews = reactive({
    nationalIdPhoto: '',
    selfiePhoto: ''
});

const isFormValid = computed(() => {
    const isNationalIdPhotoValid = form.nationalIdPhoto || previews.nationalIdPhoto;
    const isSelfiePhotoValid = form.selfiePhoto || previews.selfiePhoto;
    return form.nationalIdNumber && form.nationalIdExpiryDate && isNationalIdPhotoValid && isSelfiePhotoValid;
});



// const fetchVerificationData = async () => {
//     try {
//         const data = await $api('/users/me');
//         originalData = { ...data };

//         if (data.nationalIdNumber) form.nationalIdNumber = data.nationalIdNumber;
//         if (data.nationalIdExpiryDate) form.nationalIdExpiryDate = data.nationalIdExpiryDate.split('T')[0];
//         if (data.nationalIdPhotoUrl) previews.nationalIdPhoto = data.nationalIdPhotoUrl;
//         if (data.selfiePhotoUrl) previews.selfiePhoto = data.selfiePhotoUrl;
//     } catch (error) {
//         toast.error('เกิดข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลเดิมของคุณได้');
//         console.error("Could not fetch existing verification data:", error);
//     }
// };

// onMounted(() => {
//     fetchVerificationData();
// });

const resetForm = () => {
    form.nationalIdNumber = '';
    formattedNationalId.value = '';
    form.nationalIdExpiryDate = '';
    form.nationalIdPhoto = null;
    form.selfiePhoto = null;
    previews.nationalIdPhoto = '';
    previews.selfiePhoto = '';

    // Reset file input fields if they exist to clear the selection
    if (nationalIdInput.value) nationalIdInput.value.value = '';
    if (selfieInput.value) selfieInput.value.value = '';
};

const triggerFileInput = (type) => {
    if (type === 'nationalIdPhoto') {
        nationalIdInput.value?.click();
    } else if (type === 'selfiePhoto') {
        selfieInput.value?.click();
    }
};

const handleFileChange = (event, type) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (type === 'nationalIdPhoto') {
        form.nationalIdPhoto = file;
        previews.nationalIdPhoto = URL.createObjectURL(file);
    } else if (type === 'selfiePhoto') {
        form.selfiePhoto = file;
        previews.selfiePhoto = URL.createObjectURL(file);
    }
};

const handleSubmit = async () => {
    if (!isFormValid.value) {
        toast.warning('ข้อมูลไม่ครบถ้วน', 'กรุณากรอกข้อมูลและอัปโหลดรูปภาพให้ครบทุกช่อง');
        return;
    }
    isLoading.value = true;
    try {
        const formData = new FormData();
        formData.append('nationalIdNumber', form.nationalIdNumber);

        const isoExpiryDate = new Date(form.nationalIdExpiryDate).toISOString();
        formData.append('nationalIdExpiryDate', isoExpiryDate);

        // [UPDATED] Changed key names to match API specification
        if (form.nationalIdPhoto instanceof File) {
            formData.append('nationalIdPhotoUrl', form.nationalIdPhoto);
        }
        if (form.selfiePhoto instanceof File) {
            formData.append('selfiePhotoUrl', form.selfiePhoto);
        }

        const updatedUser = await $api('/users/me', {
            method: 'PUT',
            body: formData,
        });

        userCookie.value = updatedUser;
        originalData = { ...updatedUser };

        toast.success('ส่งข้อมูลสำเร็จ', 'คำขอยืนยันตัวตนของคุณถูกส่งแล้ว');

    } catch (error) {
        toast.error('เกิดข้อผิดพลาด', error.data?.message || 'ไม่สามารถส่งข้อมูลได้');
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchMeBasic()
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

.license-card::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%);
    animation: shine 4s infinite;
}

@keyframes shine {
    0% {
        transform: translateX(-100%) translateY(-100%);
    }

    100% {
        transform: translateX(100%) translateY(100%);
    }
}

.selfie-frame {
    background: linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%);
    border: 3px solid #f59e0b;
    border-radius: 20px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
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

.thai-text {
    font-size: 10px;
    color: #1e40af;
    font-weight: 500;
}

.person-silhouette {
    background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
    border-radius: 50%;
    position: relative;
}

.held-card {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    border: 2px solid #3b82f6;
    border-radius: 6px;
    transform: rotate(-15deg);
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}
</style>