<template>
    <div class="bg-gray-50 min-h-screen">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <main class="max-w-4xl mx-auto">
                <!-- Header Section -->
                <div class="text-center mb-8">
                    <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                            </path>
                        </svg>
                    </div>
                    <h1 class="text-3xl font-bold text-gray-800 mb-2">ยืนยันตัวตนผู้ขับขี่</h1>
                    <p class="text-gray-600 max-w-md mx-auto">
                        อัปโหลดภาพใบขับขี่และกรอกข้อมูลให้ครบถ้วน เพื่อยืนยันตัวตนก่อนใช้งานฟีเจอร์โพสต์เส้นทาง
                    </p>
                </div>

                <!-- Form Container -->
                <div class="bg-white rounded-xl shadow-xl p-8">
                    <form @submit.prevent="handleSubmit" novalidate class="space-y-8">
                        <div class="relative mb-8">
                            <div class="flex items-center mb-4">
                                <div class="step-indicator mr-4 bg-gray-400">0</div>
                                <h2 class="text-xl font-semibold text-gray-800">ข้อมูลส่วนตัว (จากระบบ)</h2>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">ชื่อ</label>
                                    <input type="text" :value="user?.firstName" disabled
                                        class="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-700" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">นามสกุล</label>
                                    <input type="text" :value="user?.lastName" disabled
                                        class="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-700" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">เลขบัตรประชาชน</label>
                                    <input type="text" value="1234567890123" disabled
                                        class="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-700" />
                                </div>
                            </div>
                        </div>

                        <!-- Step 1: License Front -->
                        <div class="relative">
                            <div class="flex items-center mb-6">
                                <div class="step-indicator mr-4">1</div>
                                <label class="text-xl font-semibold text-gray-800">
                                    รูปใบขับขี่ (ด้านหน้า) <span class="text-red-500">*</span>
                                </label>
                            </div>
                            <!-- Visual Example -->
                            <div class="grid md:grid-cols-2 gap-6 mb-6">
                                <div class="space-y-4">
                                    <h4 class="text-sm font-medium text-gray-700">ตัวอย่างที่ถูกต้อง:</h4>
                                    <div class="license-card p-6 h-40 relative">

                                        <!-- License card visual -->
                                        <div class="relative z-10 h-full flex flex-col justify-between">
                                            <div class="flex justify-between items-start">
                                                <div>
                                                    <div class="thai-text">ใบอนุญาตขับรถ</div>
                                                    <div class="text-xs text-blue-800 font-bold">DRIVING LICENSE</div>
                                                </div>
                                                <div
                                                    class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                                    <svg class="w-4 h-4 text-white" fill="currentColor"
                                                        viewBox="0 0 20 20">
                                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div class="flex items-center space-x-3">
                                                <div
                                                    class="w-12 h-12 bg-blue-300 rounded-md flex items-center justify-center">
                                                    <svg class="w-6 h-6 text-blue-700" fill="currentColor"
                                                        viewBox="0 0 20 20">
                                                        <path fill-rule="evenodd"
                                                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                                            clip-rule="evenodd"></path>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div class="text-xs text-blue-800 font-semibold">นาย สมชาย ใจดี
                                                    </div>
                                                    <div class="text-xs text-blue-700">เลขที่ 12345678</div>
                                                    <div class="text-xs text-blue-600">หมดอายุ 01/01/2027</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p class="text-xs text-gray-600 text-center">วางบัตรบนพื้นผิวเรียบ ถ่ายให้ชัดเจน</p>
                                </div>

                                <div class="space-y-4">
                                    <h4 class="text-sm font-medium text-red-600">หลีกเลี่ยง:</h4>
                                    <div class="bg-red-50 border-2 border-red-200 rounded-lg p-6 h-40">
                                        <ul class="text-sm text-red-600 space-y-2">
                                            <li class="flex items-center">
                                                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                        clip-rule="evenodd"></path>
                                                </svg>
                                                ภาพเบลอหรือไม่ชัด
                                            </li>
                                            <li class="flex items-center">
                                                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                        clip-rule="evenodd"></path>
                                                </svg>
                                                แสงสะท้อนจากบัตร
                                            </li>
                                            <li class="flex items-center">
                                                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                        clip-rule="evenodd"></path>
                                                </svg>
                                                บัตรบิดเบี้ยวหรือไม่ตรง
                                            </li>
                                            <li class="flex items-center">
                                                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                        clip-rule="evenodd"></path>
                                                </svg>
                                                ข้อมูลไม่ครบถ้วน
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div v-if="licenseFrontPreview" class="relative">
                                <img :src="licenseFrontPreview" alt="ตัวอย่างใบขับขี่"
                                    class="w-full rounded-lg shadow-md" />
                                <button @click="removeImage('front')" type="button"
                                    class="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-75">&times;</button>
                            </div>

                            <div v-else
                                class="upload-zone border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50 hover:bg-gray-100 hover:border-blue-400 relative">
                                <div class="text-center">
                                    <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                    </svg>
                                    <p class="text-lg text-gray-600 mb-2">คลิกเพื่อเลือกไฟล์หรือลากไฟล์มาวาง</p>
                                    <p class="text-sm text-gray-500">รองรับ JPG, PNG (ขนาดไม่เกิน 10MB)</p>
                                </div>
                                <input type="file" id="license-front-input" @change="handleFileUpload($event, 'front')"
                                    accept=".jpg,.png" required
                                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            </div>
                        </div>

                        <!-- Step 2: License Selfie -->
                        <div class="relative">
                            <div class="flex items-center mb-6">
                                <div class="step-indicator mr-4">2</div>
                                <label class="text-xl font-semibold text-gray-800">
                                    รูปถ่ายพร้อมใบขับขี่ (Selfie) <span class="text-red-500">*</span>
                                </label>
                            </div>

                            <!-- Visual Example -->
                            <div class="grid md:grid-cols-2 gap-6 mb-6">
                                <div class="space-y-4">
                                    <h4 class="text-sm font-medium text-gray-700">ตัวอย่างที่ถูกต้อง:</h4>
                                    <div class="selfie-frame p-6 h-40 relative">
                                        <div class="relative z-10 h-full flex items-center justify-center">
                                            <div class="flex items-center space-x-4">
                                                <!-- Person silhouette -->
                                                <div
                                                    class="person-silhouette w-20 h-20 flex items-center justify-center">
                                                    <svg class="w-12 h-12 text-gray-200" fill="currentColor"
                                                        viewBox="0 0 20 20">
                                                        <path fill-rule="evenodd"
                                                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                                            clip-rule="evenodd"></path>
                                                    </svg>
                                                </div>
                                                <!-- Held card -->
                                                <div class="held-card w-16 h-10 p-1 relative">
                                                    <div
                                                        class="w-full h-full bg-blue-100 rounded flex items-center justify-center">
                                                        <div class="text-xs text-blue-700 font-bold">บัตร</div>
                                                    </div>
                                                    <div
                                                        class="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="absolute bottom-2 right-2 bg-white bg-opacity-80 rounded-full p-1">
                                            <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z">
                                                </path>
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            </svg>
                                        </div>
                                    </div>
                                    <p class="text-xs text-gray-600 text-center">ถือบัตרชิดข้างใบหน้า
                                        ให้เห็นทั้งสองอย่างชัดเจน</p>
                                </div>

                                <div class="space-y-4">
                                    <h4 class="text-sm font-medium text-red-600">หลีกเลี่ยง:</h4>
                                    <div class="bg-red-50 border-2 border-red-200 rounded-lg p-6 h-40">
                                        <ul class="text-sm text-red-600 space-y-2">
                                            <li class="flex items-center">
                                                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                        clip-rule="evenodd"></path>
                                                </svg>
                                                ใบหน้าไม่ชัดหรือถูกบัง
                                            </li>
                                            <li class="flex items-center">
                                                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                        clip-rule="evenodd"></path>
                                                </svg>
                                                บัตรไม่ชัดหรือไม่เห็น
                                            </li>
                                            <li class="flex items-center">
                                                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                        clip-rule="evenodd"></path>
                                                </svg>
                                                แสงน้อยเกินไป
                                            </li>
                                            <li class="flex items-center">
                                                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                        clip-rule="evenodd"></path>
                                                </svg>
                                                ระยะไกลเกินไป
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div v-if="licenseSelfiePreview" class="relative">
                                <img :src="licenseSelfiePreview" alt="ตัวอย่างเซลฟี่"
                                    class="w-full rounded-lg shadow-md" />
                                <button @click="removeImage('selfie')" type="button"
                                    class="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-75">&times;</button>
                            </div>

                            <div v-else
                                class="upload-zone border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50 hover:bg-gray-100 hover:border-amber-400 relative">
                                <div class="text-center">
                                    <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                    </svg>
                                    <p class="text-lg text-gray-600 mb-2">คลิกเพื่อเลือกไฟล์หรือลากไฟล์มาวาง</p>
                                    <p class="text-sm text-gray-500">รองรับ JPG, PNG (ขนาดไม่เกิน 10MB)</p>
                                </div>
                                <input type="file" id="license-selfie-input"
                                    @change="handleFileUpload($event, 'selfie')" accept=".jpg,.png" required
                                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            </div>
                        </div>

                        <!-- Step 3: Expiry Date -->
                        <div class="relative">
                            <div class="flex items-center mb-4">
                                <div class="step-indicator mr-4">3</div>
                                <h2 class="text-xl font-semibold text-gray-800">กรอกข้อมูลจากใบขับขี่</h2>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">วันออกใบขับขี่ <span
                                            class="text-red-500">*</span></label>
                                    <input v-model="formData.licenseIssueDate" type="date"
                                        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">วันหมดอายุใบขับขี่ <span
                                            class="text-red-500">*</span></label>
                                    <input v-model="formData.licenseExpiryDate" type="date"
                                        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required />
                                </div>
                            </div>
                        </div>


                        <div class="pt-8 border-t border-gray-200">
                            <button type="submit" :disabled="!isFormValid" class="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold text-lg shadow-lg 
                                transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                                ส่งคำขอยืนยันตัวตน
                            </button>
                            <p class="text-sm text-gray-500 text-center mt-4">
                                ข้อมูลของคุณจะได้รับการตรวจสอบโดยเจ้าหน้าที่ระบบโดยเร็วที่สุด
                            </p>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useAuth } from '~/composables/useAuth';

const { user } = useAuth();

const formData = reactive({
    licenseFrontFile: null,
    licenseSelfieFile: null,
    licenseIssueDate: '',
    licenseExpiryDate: '',
});

const licenseFrontPreview = ref(null);
const licenseSelfiePreview = ref(null);

const isFormValid = computed(() => {
    return (
        formData.licenseFrontFile &&
        formData.licenseSelfieFile &&
        formData.licenseIssueDate &&
        formData.licenseExpiryDate
    );
});


const handleFileUpload = (event, type) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        if (type === 'front') {
            licenseFrontPreview.value = e.target.result;
            formData.licenseFrontFile = file;
        } else if (type === 'selfie') {
            licenseSelfiePreview.value = e.target.result;
            formData.licenseSelfieFile = file;
        }
    };
    reader.readAsDataURL(file);
};

const removeImage = (type) => {
    if (type === 'front') {
        licenseFrontPreview.value = null;
        formData.licenseFrontFile = null;
        document.getElementById('license-front-input').value = '';
    } else if (type === 'selfie') {
        licenseSelfiePreview.value = null;
        formData.licenseSelfieFile = null;
        document.getElementById('license-selfie-input').value = '';
    }
};

const handleSubmit = () => {
    if (!isFormValid.value) {
        alert('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
    }

    const dataToSubmit = new FormData();
    dataToSubmit.append('licenseFrontPhoto', formData.licenseFrontFile);
    dataToSubmit.append('licenseSelfiePhoto', formData.licenseSelfieFile);
    dataToSubmit.append('licenseIssueDate', formData.licenseIssueDate);
    dataToSubmit.append('licenseExpiryDate', formData.licenseExpiryDate);

    console.log('Submitting data:', {
        licenseFront: formData.licenseFrontFile.name,
        licenseSelfie: formData.licenseSelfieFile.name,
        issueDate: formData.licenseIssueDate,
        expiryDate: formData.licenseExpiryDate,
    });

    alert('ส่งคำขอยืนยันตัวตนสำเร็จ!');
};

</script>

<style scoped>
.upload-zone {
    transition: all 0.3s ease;
}

.step-indicator {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    width: 2.25rem;
    /* 36px */
    height: 2.25rem;
    /* 36px */
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.125rem;
    /* 18px */
    font-weight: bold;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

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
</style>
