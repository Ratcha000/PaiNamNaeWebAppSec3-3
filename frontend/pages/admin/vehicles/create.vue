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
                        <h1 class="text-2xl font-semibold text-gray-800">สร้างยานพาหนะใหม่</h1>
                        <span class="text-sm text-gray-500">กรอกข้อมูลให้ครบถ้วน แล้วกด “บันทึก”</span>
                    </div>
                </div>

                <div class="bg-white border border-gray-300 rounded-lg shadow-sm">
                    <div class="px-4 py-4 border-b border-gray-200 sm:px-6">
                        <h2 class="font-medium text-gray-800">ข้อมูลยานพาหนะ</h2>
                    </div>

                    <div class="grid grid-cols-1 gap-6 p-4 sm:p-6">
                        <div class="w-full max-w-[80rem] mx-auto space-y-6">
                            <div>
                                <h3 class="mb-3 text-sm font-semibold text-gray-700">รายละเอียดหลัก</h3>
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">เจ้าของยานพาหนะ *</label>
                                        <div class="relative">
                                            <input
                                                v-model.trim="userSearchQuery"
                                                @input="debouncedSearchUsers"
                                                type="text"
                                                placeholder="ค้นหาด้วยชื่อ, อีเมล..."
                                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                            />
                                            <div
                                                v-if="userSearchResults.length > 0 && !selectedUser"
                                                class="absolute z-10 w-full mt-1 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg max-h-60"
                                            >
                                                <ul>
                                                    <li
                                                        v-for="user in userSearchResults"
                                                        :key="user.id"
                                                        @click="selectUser(user)"
                                                        class="px-3 py-2 cursor-pointer hover:bg-blue-50"
                                                    >
                                                        {{ user.firstName }} {{ user.lastName }} ({{ user.email }})
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div v-if="selectedUser" class="mt-2 text-sm text-green-700">
                                            <i class="fa-solid fa-check-circle"></i>
                                            เลือกแล้ว: {{ selectedUser.firstName }} {{ selectedUser.lastName }}
                                        </div>
                                    </div>

                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">ประเภทยานพาหนะ *</label>
                                        <select
                                            v-model="form.vehicleType"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">-- เลือกประเภท --</option>
                                            <option value="SEDAN">Sedan</option>
                                            <option value="SUV">SUV</option>
                                             <option value="Hatchback">Hatchback</option>
                                            <option value="MINI-VAN">Mini-Van</option>
                                            <option value="PICKUP">Pickup</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">รุ่น / ยี่ห้อ *</label>
                                        <input
                                            v-model.trim="form.vehicleModel"
                                            type="text"
                                            placeholder="Toyota Yaris"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">ป้ายทะเบียน *</label>
                                        <input
                                            v-model.trim="form.licensePlate"
                                            type="text"
                                            placeholder="1กข 1234"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">สี *</label>
                                        <input
                                            v-model.trim="form.color"
                                            type="text"
                                            placeholder="ขาว"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">จำนวนที่นั่ง *</label>
                                        <input
                                            v-model.number="form.seatCapacity"
                                            type="number"
                                            min="1"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <!-- NEW: Amenities input (comma-separated), behavior like VehicleModal.vue -->
                            <div>
                                <h3 class="mb-3 text-sm font-semibold text-gray-700">สิ่งอำนวยความสะดวก (คั่นด้วย ,)</h3>
                                <input
                                    v-model.trim="amenitiesInput"
                                    type="text"
                                    placeholder="เช่น Air Conditioner, Music, Phone Charger"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                />
                                <p class="mt-1 text-xs text-gray-500">
                                    ตัวอย่าง: <code>airbag, abs, bluetooth</code>
                                </p>
                            </div>

                            <div>
                                <h3 class="mb-3 text-sm font-semibold text-gray-700">รูปภาพ</h3>
                                <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">รูปด้านหน้า *</label>
                                        <div
                                            class="p-4 text-center border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-500"
                                            @click="pick('photoFrontInput')"
                                        >
                                            <img
                                                v-if="photoFrontPreview"
                                                :src="photoFrontPreview"
                                                class="object-cover w-full h-32 rounded-md"
                                            />
                                            <div v-else class="text-gray-500">
                                                <i class="text-3xl fa-regular fa-image"></i>
                                                <p class="mt-1 text-sm">กดเพื่อเลือกรูปภาพ</p>
                                            </div>
                                        </div>
                                        <input
                                            ref="photoFrontInput"
                                            type="file"
                                            accept="image/*"
                                            class="hidden"
                                            @change="onFile($event, 'front')"
                                        />
                                    </div>

                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">รูปด้านข้าง *</label>
                                        <div
                                            class="p-4 text-center border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-500"
                                            @click="pick('photoBackInput')"
                                        >
                                            <img
                                                v-if="photoBackPreview"
                                                :src="photoBackPreview"
                                                class="object-cover w-full h-32 rounded-md"
                                            />
                                            <div v-else class="text-gray-500">
                                                <i class="text-3xl fa-regular fa-image"></i>
                                                <p class="mt-1 text-sm">กดเพื่อเลือกรูปภาพ</p>
                                            </div>
                                        </div>
                                        <input
                                            ref="photoBackInput"
                                            type="file"
                                            accept="image/*"
                                            class="hidden"
                                            @change="onFile($event, 'back')"
                                        />
                                    </div>

                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">รูปภายใน *</label>
                                        <div
                                            class="p-4 text-center border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-500"
                                            @click="pick('licensePlatePhotoInput')"
                                        >
                                            <img
                                                v-if="licensePlatePhotoPreview"
                                                :src="licensePlatePhotoPreview"
                                                class="object-cover w-full h-32 rounded-md"
                                            />
                                            <div v-else class="text-gray-500">
                                                <i class="text-3xl fa-regular fa-image"></i>
                                                <p class="mt-1 text-sm">กดเพื่อเลือกรูปภาพ</p>
                                            </div>
                                        </div>
                                        <input
                                            ref="licensePlatePhotoInput"
                                            type="file"
                                            accept="image/*"
                                            class="hidden"
                                            @change="onFile($event, 'plate')"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 class="mb-3 text-sm font-semibold text-gray-700">ตัวเลือกเพิ่มเติม</h3>
                                <div class="flex items-center">
                                    <input
                                        id="isDefault"
                                        v-model="form.isDefault"
                                        type="checkbox"
                                        class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label for="isDefault" class="block ml-2 text-sm text-gray-900">
                                        ตั้งเป็นยานพาหนะเริ่มต้นสำหรับผู้ใช้นี้
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center justify-end gap-2 px-4 py-4 border-t border-gray-200 sm:px-6">
                        <button
                            @click="handleSubmit"
                            :disabled="isSubmitting"
                            class="inline-flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                        >
                            <svg v-if="isSubmitting" class="w-4 h-4 mr-1 -ml-1 animate-spin" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke="white" stroke-width="4" fill="none" opacity="0.25" />
                                <path d="M4 12a8 8 0 018-8" fill="white" opacity="0.75" />
                            </svg>
                            บันทึก
                        </button>
                    </div>
                </div>
            </div>
        </main>

        <div id="overlay" class="fixed inset-0 z-40 hidden bg-black bg-opacity-50 lg:hidden" @click="closeMobileSidebar"></div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRuntimeConfig, useCookie } from '#app'
import AdminHeader from '~/components/admin/AdminHeader.vue'
import AdminSidebar from '~/components/admin/AdminSidebar.vue'
import { useToast } from '~/composables/useToast'
import debounce from 'lodash.debounce'

definePageMeta({ middleware: ['admin-auth'] })

const { toast } = useToast()

// ---------- STATE ----------
const form = reactive({
    userId: '',
    vehicleType: '',
    vehicleModel: '',
    licensePlate: '',
    color: '',
    seatCapacity: 4,
    isDefault: false,
    photoFront: null,        // File
    photoBack: null,         // File
    licensePlatePhoto: null, // File
})

const isSubmitting = ref(false)
const amenitiesInput = ref('') // NEW: keep string, split on submit

// Refs for file inputs
const photoFrontInput = ref(null)
const photoBackInput = ref(null)
const licensePlatePhotoInput = ref(null)

// Refs for file previews
const photoFrontPreview = ref(null)
const photoBackPreview = ref(null)
const licensePlatePhotoPreview = ref(null)

// User Search State
const userSearchQuery = ref('')
const userSearchResults = ref([])
const selectedUser = ref(null)

// ---------- UI HELPERS ----------
useHead({
    title: 'Create Vehicle • Admin',
    link: [{ rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css' }],
})

function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar')
    const overlay = document.getElementById('overlay')
    if (!sidebar || !overlay) return
    sidebar.classList.remove('mobile-open')
    overlay.classList.add('hidden')
}

function defineGlobalScripts() {
    window.toggleSidebar = function () {
        const sidebar = document.getElementById('sidebar')
        const mainContent = document.getElementById('main-content')
        const toggleIcon = document.getElementById('toggle-icon')
        if (!sidebar || !mainContent) return
        sidebar.classList.toggle('collapsed')
        if (sidebar.classList.contains('collapsed')) {
            mainContent.style.marginLeft = '80px'
            if (toggleIcon) toggleIcon.classList.replace('fa-chevron-left', 'fa-chevron-right')
        } else {
            mainContent.style.marginLeft = '280px'
            if (toggleIcon) toggleIcon.classList.replace('fa-chevron-right', 'fa-chevron-left')
        }
    }
    window.toggleMobileSidebar = function () {
        const sidebar = document.getElementById('sidebar')
        const overlay = document.getElementById('overlay')
        if (!sidebar || !overlay) return
        sidebar.classList.toggle('mobile-open')
        overlay.classList.toggle('hidden')
    }
    window.__adminResizeHandler__ = function () {
        const sidebar = document.getElementById('sidebar')
        const mainContent = document.getElementById('main-content')
        const overlay = document.getElementById('overlay')
        if (!sidebar || !mainContent || !overlay) return
        if (window.innerWidth >= 1024) {
            sidebar.classList.remove('mobile-open')
            overlay.classList.add('hidden')
            mainContent.style.marginLeft = sidebar.classList.contains('collapsed') ? '80px' : '280px'
        } else {
            mainContent.style.marginLeft = '0'
        }
    }
    window.addEventListener('resize', window.__adminResizeHandler__)
}

function cleanupGlobalScripts() {
    window.removeEventListener('resize', window.__adminResizeHandler__ || (() => {}))
    delete window.toggleSidebar
    delete window.toggleMobileSidebar
    delete window.__adminResizeHandler__
}

// ---------- USER SEARCH (replaces dropdown) ----------
const searchUsers = async () => {
    if (userSearchQuery.value.length < 2) {
        userSearchResults.value = []
        return
    }
    try {
        const config = useRuntimeConfig()
        const token =
            useCookie('token').value ||
            (process.client ? localStorage.getItem('token') : '')
        const res = await $fetch('/users/admin', {
            baseURL: config.public.apiBase,
            headers: { Authorization: `Bearer ${token}` },
            query: { q: userSearchQuery.value, limit: 5 },
        })
        userSearchResults.value = res?.data || []
    } catch (err) {
        console.error('User search failed:', err)
        userSearchResults.value = []
    }
}

const debouncedSearchUsers = debounce(searchUsers, 300)

function selectUser(user) {
    selectedUser.value = user
    form.userId = user.id
    userSearchQuery.value = `${user.firstName} ${user.lastName}`
    userSearchResults.value = []
}

onMounted(() => {
    defineGlobalScripts()
    if (typeof window.__adminResizeHandler__ === 'function') window.__adminResizeHandler__()
})

onUnmounted(() => {
    cleanupGlobalScripts()
})

// ---------- FILE PICKERS ----------
function pick(refName) {
    if (refName === 'photoFrontInput') photoFrontInput.value?.click()
    if (refName === 'photoBackInput') photoBackInput.value?.click()
    if (refName === 'licensePlatePhotoInput') licensePlatePhotoInput.value?.click()
}

function onFile(e, type) {
    const f = e.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = ev => {
        const result = ev.target?.result
        if (type === 'front') {
            form.photoFront = f
            photoFrontPreview.value = result
        } else if (type === 'back') {
            form.photoBack = f
            photoBackPreview.value = result
        } else if (type === 'plate') {
            form.licensePlatePhoto = f
            licensePlatePhotoPreview.value = result
        }
    }
    reader.readAsDataURL(f)
}

// ---------- FETCH HELPERS ----------
async function postForm(url, formData, token) {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
        credentials: 'include',
    })

    let body
    try {
        body = await res.json()
    } catch {
        const text = await res.text()
        const err = new Error(text || 'Unexpected response from server')
        err.status = res.status
        throw err
    }

    if (!res.ok) {
        const msg = body?.message || `Request failed with status ${res.status}`
        const err = new Error(msg)
        err.status = res.status
        err.payload = body
        throw err
    }
    return body
}

// ---------- SUBMIT ----------
async function handleSubmit() {
    // Validation
    if (
        !form.userId ||
        !form.vehicleModel ||
        !form.licensePlate ||
        !form.vehicleType ||
        !form.color ||
        !form.seatCapacity ||
        !form.photoFront ||
        !form.photoBack ||
        !form.licensePlatePhoto
    ) {
        toast.error('กรอกข้อมูลไม่ครบ', 'โปรดกรอกข้อมูลและอัปโหลดรูปภาพที่มี * ให้ครบถ้วน')
        return
    }

    isSubmitting.value = true
    try {
        const fd = new FormData()
        fd.append('userId', form.userId)
        fd.append('vehicleType', form.vehicleType)
        fd.append('vehicleModel', form.vehicleModel)
        fd.append('licensePlate', form.licensePlate)
        fd.append('color', form.color)
        fd.append('seatCapacity', form.seatCapacity)
        fd.append('isDefault', form.isDefault)

        // amenities: same behavior as VehicleModal.vue → send JSON string
        const amenities = amenitiesInput.value
            ? amenitiesInput.value.split(',').map(s => s.trim()).filter(Boolean)
            : []
        fd.append('amenities', JSON.stringify(amenities))

        // photos (3)
        fd.append('photos', form.photoFront)
        fd.append('photos', form.photoBack)
        fd.append('photos', form.licensePlatePhoto)

        const token = useCookie('token')?.value || (process.client ? localStorage.getItem('token') : '')
        const apiBase = useRuntimeConfig().public.apiBase || 'http://localhost:3000/api'

        const result = await postForm(`${apiBase}/vehicles/admin`, fd, token)

        toast.success('สำเร็จ', result?.message || 'สร้างยานพาหนะเรียบร้อย')
        navigateTo('/admin/vehicles')
    } catch (err) {
        const message = err?.message || 'สร้างยานพาหนะไม่สำเร็จ'
        toast.error('เกิดข้อผิดพลาด', message)
        console.error('Create vehicle error:', err)
    } finally {
        isSubmitting.value = false
    }
}
</script>

<style>
/* Global styles for admin layout (copied from users/create.vue) */
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
