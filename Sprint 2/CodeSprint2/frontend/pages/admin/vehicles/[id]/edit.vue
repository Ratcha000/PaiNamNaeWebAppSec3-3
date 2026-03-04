<template>
    <div>
        <AdminHeader />
        <AdminSidebar />

        <main id="main-content" class="main-content mt-16 ml-0 lg:ml-[280px] p-6">
            <div class="mb-8">
                <NuxtLink to="/admin/vehicles"
                    class="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                    <i class="fa-solid fa-arrow-left"></i>
                    <span>ย้อนกลับ</span>
                </NuxtLink>
            </div>

            <div class="mx-auto max-w-8xl">
                <div class="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div class="flex items-center gap-3">
                        <h1 class="text-2xl font-semibold text-gray-800">แก้ไขยานพาหนะ</h1>
                        <span class="text-sm text-gray-500">ปรับข้อมูลแล้วกด “บันทึก”</span>
                    </div>
                </div>

                <div class="bg-white border border-gray-300 rounded-lg shadow-sm">
                    <div class="px-4 py-4 border-b border-gray-200 sm:px-6">
                        <h2 class="font-medium text-gray-800">ข้อมูลยานพาหนะ</h2>
                    </div>

                    <div v-if="isLoading" class="p-8 text-center text-gray-500">
                        <i class="text-3xl fa-solid fa-spinner fa-spin"></i>
                        <p class="mt-2">กำลังโหลดข้อมูล...</p>
                    </div>
                    <div v-else-if="loadError" class="p-8 text-center text-red-600">{{ loadError }}</div>

                    <div v-else class="grid grid-cols-1 gap-6 p-4 sm:p-6">
                        <div class="w-full max-w-[80rem] mx-auto space-y-6">
                            
                            <div>
                                <h3 class="mb-3 text-sm font-semibold text-gray-700">รายละเอียดหลัก</h3>
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                     <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">เจ้าของยานพาหนะ</label>
                                        <div class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-100 text-gray-600">
                                            {{ ownerInfo }}
                                        </div>
                                    </div>
                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">ป้ายทะเบียน *</label>
                                        <input v-model.trim="form.licensePlate" type="text"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">รุ่น / ยี่ห้อ *</label>
                                        <input v-model.trim="form.vehicleModel" type="text"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">ประเภทยานพาหนะ *</label>
                                        <select v-model="form.vehicleType"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                                            <option value="">-- เลือกประเภท --</option>
                                            <option value="SEDAN">Sedan</option>
                                            <option value="SUV">SUV</option>
                                            <option value="Hatchback">Hatchback</option>
                                            <option value="Van">Van</option>
                                            <option value="Pickup">Pickup</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">สี *</label>
                                        <input v-model.trim="form.color" type="text"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">จำนวนที่นั่ง *</label>
                                        <input v-model.number="form.seatCapacity" type="number" min="1"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 class="mb-3 text-sm font-semibold text-gray-700">รูปภาพ</h3>
                                <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                     <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">รูปด้านหน้า *</label>
                                        <div class="p-4 text-center border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-500" @click="pick('photoFrontInput')">
                                            <img v-if="photoFrontPreview" :src="photoFrontPreview" class="object-cover w-full h-32 rounded-md" />
                                            <div v-else class="text-gray-500"><i class="text-3xl fa-regular fa-image"></i><p class="mt-1 text-sm">กดเพื่อเลือกรูปภาพ</p></div>
                                        </div>
                                        <input ref="photoFrontInput" type="file" accept="image/*" class="hidden" @change="onFile($event, 'front')" />
                                    </div>
                                     <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">รูปด้านข้าง *</label>
                                        <div class="p-4 text-center border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-500" @click="pick('photoBackInput')">
                                            <img v-if="photoBackPreview" :src="photoBackPreview" class="object-cover w-full h-32 rounded-md" />
                                            <div v-else class="text-gray-500"><i class="text-3xl fa-regular fa-image"></i><p class="mt-1 text-sm">กดเพื่อเลือกรูปภาพ</p></div>
                                        </div>
                                        <input ref="photoBackInput" type="file" accept="image/*" class="hidden" @change="onFile($event, 'back')" />
                                    </div>
                                     <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">รูปภายใน *</label>
                                        <div class="p-4 text-center border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-500" @click="pick('licensePlatePhotoInput')">
                                            <img v-if="licensePlatePhotoPreview" :src="licensePlatePhotoPreview" class="object-cover w-full h-32 rounded-md" />
                                            <div v-else class="text-gray-500"><i class="text-3xl fa-regular fa-image"></i><p class="mt-1 text-sm">กดเพื่อเลือกรูปภาพ</p></div>
                                        </div>
                                        <input ref="licensePlatePhotoInput" type="file" accept="image/*" class="hidden" @change="onFile($event, 'plate')" />
                                    </div>
                                </div>
                                <p class="mt-2 text-xs text-gray-500">* ไม่จำเป็นต้องอัปโหลดรูปใหม่ หากไม่ต้องการเปลี่ยนรูปเดิม</p>
                            </div>

                            <div>
                                <h3 class="mb-3 text-sm font-semibold text-gray-700">ตัวเลือกเพิ่มเติม</h3>
                                 <div class="flex items-center">
                                     <input id="isDefault" v-model="form.isDefault" type="checkbox" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                                     <label for="isDefault" class="block ml-2 text-sm text-gray-900">ตั้งเป็นยานพาหนะเริ่มต้นสำหรับผู้ใช้นี้</label>
                                 </div>
                             </div>
                        </div>
                    </div>

                    <div class="flex items-center justify-end gap-2 px-4 py-4 border-t border-gray-200 sm:px-6">
                        <button @click="handleSubmit" :disabled="isSubmitting || isLoading"
                            class="inline-flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed">
                            <svg v-if="isSubmitting" class="w-4 h-4 mr-1 -ml-1 animate-spin" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke="white" stroke-width="4" fill="none"
                                    opacity="0.25" />
                                <path d="M4 12a8 8 0 018-8" fill="white" opacity="0.75" />
                            </svg>
                            บันทึกการเปลี่ยนแปลง
                        </button>
                    </div>
                </div>
            </div>
        </main>

        <div id="overlay" class="fixed inset-0 z-40 hidden bg-black bg-opacity-50 lg:hidden"
            @click="closeMobileSidebar"></div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useRoute, useRuntimeConfig, useCookie } from '#app';
import AdminHeader from '~/components/admin/AdminHeader.vue';
import AdminSidebar from '~/components/admin/AdminSidebar.vue';
import { useToast } from '~/composables/useToast';

definePageMeta({ middleware: ['admin-auth'] });

const route = useRoute();
const { toast } = useToast();

// ---------- STATE ----------
const form = reactive({
    vehicleType: '',
    vehicleModel: '',
    licensePlate: '',
    color: '',
    seatCapacity: 1,
    isDefault: false,
    photoFront: null,        // File | null
    photoBack: null,         // File | null
    licensePlatePhoto: null, // File | null
});

const ownerInfo = ref('');
const isLoading = ref(true);
const loadError = ref('');
const isSubmitting = ref(false);

const photoFrontInput = ref(null);
const photoBackInput = ref(null);
const licensePlatePhotoInput = ref(null);

const photoFrontPreview = ref(null); // string (URL)
const photoBackPreview = ref(null); // string (URL)
const licensePlatePhotoPreview = ref(null); // string (URL)

// ---------- UI HELPERS ----------
useHead({
    title: 'Edit Vehicle • Admin',
    link: [{ rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css' }]
});


// ---------- GLOBAL LAYOUT SCRIPTS ----------
function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    if (!sidebar || !overlay) return;
    sidebar.classList.remove('mobile-open');
    overlay.classList.add('hidden');
}

function defineGlobalScripts() {
    window.toggleSidebar = function () {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('main-content');
        const toggleIcon = document.getElementById('toggle-icon');
        if (!sidebar || !mainContent) return;
        sidebar.classList.toggle('collapsed');
        if (sidebar.classList.contains('collapsed')) {
            mainContent.style.marginLeft = '80px';
            if (toggleIcon) toggleIcon.classList.replace('fa-chevron-left', 'fa-chevron-right');
        } else {
            mainContent.style.marginLeft = '280px';
            if (toggleIcon) toggleIcon.classList.replace('fa-chevron-right', 'fa-chevron-left');
        }
    };
    window.toggleMobileSidebar = function () {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        if (!sidebar || !overlay) return;
        sidebar.classList.toggle('mobile-open');
        overlay.classList.toggle('hidden');
    };
    window.__adminResizeHandler__ = function () {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('main-content');
        const overlay = document.getElementById('overlay');
        if (!sidebar || !mainContent || !overlay) return;
        if (window.innerWidth >= 1024) {
            sidebar.classList.remove('mobile-open');
            overlay.classList.add('hidden');
            mainContent.style.marginLeft = sidebar.classList.contains('collapsed') ? '80px' : '280px';
        } else {
            mainContent.style.marginLeft = '0';
        }
    };
    window.addEventListener('resize', window.__adminResizeHandler__);
}

function cleanupGlobalScripts() {
    window.removeEventListener('resize', window.__adminResizeHandler__ || (() => {}));
    delete window.toggleSidebar;
    delete window.toggleMobileSidebar;
    delete window.__adminResizeHandler__;
}

onMounted(async () => {
    defineGlobalScripts();
    if (typeof window.__adminResizeHandler__ === 'function') window.__adminResizeHandler__();
    await fetchVehicle();
});

onUnmounted(() => {
    cleanupGlobalScripts();
});

// ---------- FILE PICKERS ----------
function pick(refName) {
    if (refName === 'photoFrontInput') photoFrontInput.value?.click();
    if (refName === 'photoBackInput') photoBackInput.value?.click();
    if (refName === 'licensePlatePhotoInput') licensePlatePhotoInput.value?.click();
}

function onFile(e, type) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => {
        const result = ev.target?.result;
        if (type === 'front') {
            form.photoFront = f;
            photoFrontPreview.value = result;
        } else if (type === 'back') {
            form.photoBack = f;
            photoBackPreview.value = result;
        } else if (type === 'plate') {
            form.licensePlatePhoto = f;
            licensePlatePhotoPreview.value = result;
        }
    };
    reader.readAsDataURL(f);
}

// ---------- FETCH: GET vehicle ----------
async function fetchVehicle() {
    isLoading.value = true;
    loadError.value = '';
    try {
        const id = route.params.id;
        const config = useRuntimeConfig();
        const token = useCookie('token').value || (process.client ? localStorage.getItem('token') : '');

        // แก้ endpoint: ใช้ /vehicles/:id
        const res = await $fetch(`/vehicles/admin/${id}`, {
            baseURL: config.public.apiBase,
            headers: { Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        });
        
        const v = res?.data;
        if (!v) throw new Error('ไม่พบข้อมูลยานพาหนะ');

        form.vehicleType  = v.vehicleType || '';
        form.vehicleModel = v.vehicleModel || '';
        form.licensePlate = v.licensePlate || '';
        form.color        = v.color || '';
        form.seatCapacity = Number(v.seatCapacity ?? 1);
        form.isDefault    = !!v.isDefault;

        const u = v.user || {};
        const fullName = [u.firstName, u.lastName].filter(Boolean).join(' ').trim();
        ownerInfo.value = fullName ? `${fullName}${u.email ? ` (${u.email})` : ''}` : (u.email || '-');

        photoFrontPreview.value        = v.photos?.[0] || null;
        photoBackPreview.value         = v.photos?.[1] || null;
        licensePlatePhotoPreview.value = v.photos?.[2] || null;

        form.photoFront = null;
        form.photoBack = null;
        form.licensePlatePhoto = null;

    } catch (err) {
        console.error("Fetch vehicle error:", err);
        loadError.value = err?.data?.message || 'ไม่สามารถโหลดข้อมูลยานพาหนะได้';
        toast.error('เกิดข้อผิดพลาด', loadError.value);
    } finally {
        isLoading.value = false;
    }
}

// ---------- PUT (form-data) HELPER ----------
async function putForm(url, formData, token) {
    const res = await fetch(url, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
        credentials: 'include',
    });
    let body;
    try { body = await res.json() } catch {
        const text = await res.text();
        const err = new Error(text || 'Unexpected response'); err.status = res.status; throw err;
    }
    if (!res.ok) {
        const msg = body?.message || `Request failed`;
        const err = new Error(msg); err.status = res.status; err.payload = body; throw err;
    }
    return body;
}

// ---------- SUBMIT ----------
async function handleSubmit() {
    if (!form.vehicleModel || !form.licensePlate || !form.vehicleType || !form.color || !form.seatCapacity) {
        toast.error('กรอกข้อมูลไม่ครบ', 'โปรดกรอกข้อมูลที่มี * ให้ครบถ้วน');
        return;
    }

    isSubmitting.value = true;
    try {
        const id = route.params.id;
        const apiBase = useRuntimeConfig().public.apiBase;
        const token = useCookie('token')?.value || (process.client ? localStorage.getItem('token') : '');

        const fd = new FormData();
        fd.append('vehicleType',   form.vehicleType);
        fd.append('vehicleModel',  form.vehicleModel);
        fd.append('licensePlate',  form.licensePlate);
        fd.append('color',         form.color);
        fd.append('seatCapacity',  form.seatCapacity);
        fd.append('isDefault',     form.isDefault);

        // Append files only if they are new (instanceof File)
        if (form.photoFront instanceof File) {
            fd.append('photos', form.photoFront);
        }
        if (form.photoBack instanceof File) {
            fd.append('photos', form.photoBack);
        }
        if (form.licensePlatePhoto instanceof File) {
            fd.append('photos', form.licensePlatePhoto);
        }

        const result = await putForm(`${apiBase}/vehicles/admin/${id}`, fd, token);
        
        toast.success('สำเร็จ', result?.message || 'อัปเดตยานพาหนะเรียบร้อย');
        navigateTo('/admin/vehicles');

    } catch (err) {
        const message = err?.message || 'อัปเดตยานพาหนะไม่สำเร็จ';
        toast.error('เกิดข้อผิดพลาด', message);
        console.error("Update vehicle error:", err);
    } finally {
        isSubmitting.value = false;
    }
}
</script>

<style>
/* Global styles for admin layout (copied from users/edit.vue) */
.main-content {
    transition: margin-left 0.3s ease;
}
.sidebar {
    transition: width 0.3s ease;
}
.sidebar.collapsed {
    width: 80px;
}
.sidebar:not(.collapsed) {
    width: 280px;
}
.sidebar-item {
    transition: all 0.3s ease;
}
.sidebar-item:hover {
    background-color: rgba(59, 130, 246, 0.05);
}
.sidebar.collapsed .sidebar-text {
    display: none;
}
.sidebar.collapsed .sidebar-item {
    justify-content: center;
}
@media (max-width: 1024px) {
    .sidebar {
        position: fixed;
        z-index: 1000;
        transform: translateX(-100%);
    }
    .sidebar.mobile-open {
        transform: translateX(0);
    }
    .main-content {
        margin-left: 0 !important;
    }
}
</style>
