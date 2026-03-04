<template>
    <div>
        <AdminHeader />
        <AdminSidebar />

        <!-- Main Content -->
        <main id="main-content" class="main-content mt-16 ml-0 lg:ml-[280px] p-6">
            <div class="mb-8">
                <NuxtLink to="/admin/users"
                    class="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                    <i class="fa-solid fa-arrow-left"></i>
                    <span>ย้อนกลับ</span>
                </NuxtLink>
            </div>

            <div class="mx-auto max-w-8xl">
                <!-- Title + Actions (same structure as index) -->
                <div class="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
                    <!-- Left -->
                    <div class="flex items-center gap-3">
                        <h1 class="text-2xl font-semibold text-gray-800">สร้างผู้ใช้ใหม่</h1>
                        <span class="text-sm text-gray-500">กรอกข้อมูลให้ครบถ้วน แล้วกด “บันทึก”</span>
                    </div>

                </div>

                <!-- Form Card (same card look as index) -->
                <div class="bg-white border border-gray-300 rounded-lg shadow-sm">
                    <div class="px-4 py-4 border-b border-gray-200 sm:px-6">
                        <h2 class="font-medium text-gray-800">ข้อมูลผู้ใช้</h2>
                    </div>

                    <div class="grid grid-cols-1 gap-6 p-4 sm:p-6">
                        <!-- ข้อมูลข้อความทั้งหมด -->
                        <div class="w-full max-w-[80rem] mx-auto space-y-6">
                            <!-- Account -->
                            <div>
                                <h3 class="mb-3 text-sm font-semibold text-gray-700">บัญชีผู้ใช้</h3>
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">อีเมล *</label>
                                        <input v-model.trim="form.email" type="email" placeholder="example@email.com"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">ชื่อผู้ใช้
                                            (username) *</label>
                                        <input v-model.trim="form.username" type="text" placeholder="user_001"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">รหัสผ่าน *</label>
                                        <input v-model="form.password" type="password"
                                            placeholder="อย่างน้อย 8 ตัวอักษร"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">เบอร์โทรศัพท์
                                            *</label>
                                        <input v-model.trim="form.phoneNumber" type="tel" placeholder="0891234567"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                </div>
                            </div>

                            <!-- Personal -->
                            <div>
                                <h3 class="mb-3 text-sm font-semibold text-gray-700">ข้อมูลส่วนตัว</h3>
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">ชื่อจริง *</label>
                                        <input v-model.trim="form.firstName" type="text"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">นามสกุล *</label>
                                        <input v-model.trim="form.lastName" type="text"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">เพศ *</label>
                                        <select v-model="form.gender"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                                            <option value="">-- เลือก --</option>
                                            <option value="MALE">MALE</option>
                                            <option value="FEMALE">FEMALE</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">บทบาท *</label>
                                        <select v-model="form.role"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                                            <option value="PASSENGER">PASSENGER</option>
                                            <option value="DRIVER">DRIVER</option>
                                            <option value="ADMIN">ADMIN</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <!-- National ID -->
                            <div>
                                <h3 class="mb-3 text-sm font-semibold text-gray-700">บัตรประชาชน</h3>
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">เลขบัตรประชาชน
                                            *</label>
                                        <input v-model.trim="form.nationalIdNumber" type="text" placeholder="13 หลัก"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">วันหมดอายุบัตร
                                            *</label>
                                        <input v-model="form.nationalIdExpiryDate" type="date"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                </div>
                            </div>

                            <!-- อัปโหลดรูปภาพ (ย้ายมาล่างสุด) -->
                            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label class="block mb-1 text-xs font-medium text-gray-600">รูปบัตรประชาชน *</label>
                                    <div class="p-4 text-center border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-500"
                                        @click="pick('idCardInput')">
                                        <div v-if="idPreview" class="flex items-center justify-center">
                                            <img :src="idPreview" class="rounded max-h-82" />
                                        </div>
                                        <div v-else class="text-gray-500">
                                            <i class="text-3xl fa-regular fa-image"></i>
                                            <p class="mt-1 text-sm">กดเพื่อเลือกรูปภาพ</p>
                                        </div>
                                    </div>
                                    <input ref="idCardInput" type="file" accept="image/*" class="hidden"
                                        @change="onFile($event, 'id')" />
                                </div>

                                <div>
                                    <label class="block mb-1 text-xs font-medium text-gray-600">รูปถ่ายใบหน้า (Selfie)
                                        *</label>
                                    <div class="p-4 text-center border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-500"
                                        @click="pick('selfieInput')">
                                        <div v-if="selfiePreview" class="flex items-center justify-center">
                                            <img :src="selfiePreview" class="rounded max-h-82" />
                                        </div>
                                        <div v-else class="text-gray-500">
                                            <i class="text-3xl fa-regular fa-image"></i>
                                            <p class="mt-1 text-sm">กดเพื่อเลือกรูปภาพ</p>
                                        </div>
                                    </div>
                                    <input ref="selfieInput" type="file" accept="image/*" class="hidden"
                                        @change="onFile($event, 'selfie')" />
                                </div>
                            </div>
                        </div>


                    </div>

                    <!-- Footer actions -->
                    <div class="flex items-center justify-end gap-2 px-4 py-4 border-t border-gray-200 sm:px-6">
                        <button @click="handleSubmit" :disabled="isSubmitting"
                            class="inline-flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed">
                            <svg v-if="isSubmitting" class="w-4 h-4 mr-1 -ml-1 animate-spin" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke="white" stroke-width="4" fill="none"
                                    opacity="0.25" />
                                <path d="M4 12a8 8 0 018-8" fill="white" opacity="0.75" />
                            </svg>
                            บันทึก
                        </button>
                    </div>
                </div>
            </div>
        </main>

        <!-- Mobile Overlay -->
        <div id="overlay" class="fixed inset-0 z-40 hidden bg-black bg-opacity-50 lg:hidden"
            @click="closeMobileSidebar"></div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import AdminHeader from '~/components/admin/AdminHeader.vue'
import AdminSidebar from '~/components/admin/AdminSidebar.vue'
import { useToast } from '~/composables/useToast'

definePageMeta({ middleware: ['admin-auth'] })

const { toast } = useToast()

// ---------- STATE ----------
const form = reactive({
    email: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    gender: '',
    role: 'PASSENGER',
    nationalIdNumber: '',
    nationalIdExpiryDate: '', // YYYY-MM-DD
    nationalIdPhotoUrl: null, // File
    selfiePhotoUrl: null      // File
})

const isSubmitting = ref(false)
const idPreview = ref(null)
const selfiePreview = ref(null)
const idCardInput = ref(null)
const selfieInput = ref(null)

// ---------- UI HELPERS ----------
useHead({
    title: 'Create User • Admin',
    link: [{ rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css' }]
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

    // window.closeMobileSidebar = function () {
    //     const sidebar = document.getElementById('sidebar')
    //     const overlay = document.getElementById('overlay')
    //     if (!sidebar || !overlay) return
    //     sidebar.classList.remove('mobile-open')
    //     overlay.classList.add('hidden')
    // }

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
    window.removeEventListener('resize', window.__adminResizeHandler__ || (() => { }))
    delete window.toggleSidebar
    delete window.toggleMobileSidebar
    delete window.closeMobileSidebar
    delete window.__adminResizeHandler__
}

onMounted(() => {
    defineGlobalScripts()
    if (typeof window.__adminResizeHandler__ === 'function') window.__adminResizeHandler__()
})
onUnmounted(() => { cleanupGlobalScripts() })

// ---------- FILE PICKERS ----------
function pick(refName) {
    if (refName === 'idCardInput') idCardInput.value?.click()
    if (refName === 'selfieInput') selfieInput.value?.click()
}

function onFile(e, type) {
    const f = e.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = ev => {
        if (type === 'id') {
            form.nationalIdPhotoUrl = f
            idPreview.value = ev.target?.result
        } else {
            form.selfiePhotoUrl = f
            selfiePreview.value = ev.target?.result
        }
    }
    reader.readAsDataURL(f)
}

function toISODate(yyyy_mm_dd) {
    if (!yyyy_mm_dd) return ''
    const d = new Date(`${yyyy_mm_dd}T00:00:00.000Z`)
    return d.toISOString()
}

// ---------- FETCH HELPERS ----------
async function postForm(url, formData, token) {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
            // ห้ามตั้ง 'Content-Type' เวลาใช้ FormData
        },
        body: formData,
        credentials: 'include'
    })

    let body
    try {
        body = await res.json()            // คาดหวัง { success, message, data }
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

    return body                          // คืนทั้งก้อน
}

// ---------- SUBMIT ----------
async function handleSubmit() {
    if (
        !form.email || !form.username || !form.password || !form.firstName || !form.lastName ||
        !form.phoneNumber || !form.gender || !form.nationalIdNumber || !form.nationalIdExpiryDate ||
        !form.nationalIdPhotoUrl || !form.selfiePhotoUrl
    ) {
        toast.error('กรอกข้อมูลไม่ครบ', 'โปรดกรอกข้อมูลที่มี * ให้ครบถ้วน')
        return
    }

    isSubmitting.value = true
    try {
        const fd = new FormData()
        fd.append('email', form.email)
        fd.append('username', form.username)
        fd.append('password', form.password)
        fd.append('firstName', form.firstName)
        fd.append('lastName', form.lastName)
        fd.append('phoneNumber', form.phoneNumber)
        fd.append('gender', form.gender.toUpperCase())
        fd.append('nationalIdNumber', form.nationalIdNumber)
        fd.append('nationalIdExpiryDate', toISODate(form.nationalIdExpiryDate))
        fd.append('nationalIdPhotoUrl', form.nationalIdPhotoUrl)
        fd.append('selfiePhotoUrl', form.selfiePhotoUrl)
        fd.append('role', form.role)

        // token (cookie -> localStorage)
        let token = ''
        try { token = useCookie('token')?.value || '' } catch { }
        if (process.client && !token) token = localStorage.getItem('token') || ''

        const apiBase = useRuntimeConfig().public.apiBase || 'http://localhost:3000/api'
        const result = await postForm(`${apiBase}/users`, fd, token)

        toast.success('สำเร็จ', result?.message || 'สร้างผู้ใช้เรียบร้อย')
        navigateTo('/admin/users')
    } catch (err) {
        const status = err?.status
        const message = err?.message || 'สร้างผู้ใช้ไม่สำเร็จ'
        if (status === 409) {
            // จะได้ข้อความจาก backend เช่น: ข้อมูล "nationalIdNumber" ซ้ำกับที่มีอยู่แล้ว
            toast.error('ข้อมูลซ้ำ', message)
        } else {
            toast.error('เกิดข้อผิดพลาด', message)
        }
    } finally {
        isSubmitting.value = false
    }
}
</script>


<style>
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



@media (max-width: 768px) {
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
