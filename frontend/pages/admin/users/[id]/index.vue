<template>
    <div>
        <AdminHeader />
        <AdminSidebar />

        <main id="main-content" class="main-content mt-16 ml-0 lg:ml-[280px] p-6">
            <!-- Back -->
            <div class="mb-8">
                <NuxtLink to="/admin/users"
                    class="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                    <i class="fa-solid fa-arrow-left"></i>
                    <span>ย้อนกลับ</span>
                </NuxtLink>
            </div>

            <div class="mx-auto max-w-8xl">
                <!-- Title -->
                <div class="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div class="flex items-center gap-3">
                        <h1 class="text-2xl font-semibold text-gray-800">รายละเอียดผู้ใช้</h1>
                        <span class="text-sm text-gray-500">ดูข้อมูลทั้งหมดของผู้ใช้งาน</span>
                    </div>

                    <!-- Verify switch -->
                    <div v-if="user" class="flex items-center gap-2">
                        <label class="inline-flex items-center cursor-pointer select-none switch">
                            <input type="checkbox" class="switch-input" :checked="user.isVerified"
                                :disabled="isLoading || toggling" @change="onToggleVerify($event.target.checked)" />
                            <span class="switch-slider"></span>
                        </label>
                        <span class="text-sm" :class="user.isVerified ? 'text-green-700' : 'text-gray-500'">
                            {{ user.isVerified ? 'Verified' : 'Unverified' }}
                        </span>
                    </div>
                </div>

                <!-- Card -->
                <div class="bg-white border border-gray-300 rounded-lg shadow-sm">
                    <div class="px-4 py-4 border-b border-gray-200 sm:px-6">
                        <h2 class="font-medium text-gray-800">ข้อมูลผู้ใช้</h2>
                    </div>

                    <!-- Loading / Error -->
                    <div v-if="isLoading" class="p-8 text-center text-gray-500">กำลังโหลดข้อมูล...</div>
                    <div v-else-if="loadError" class="p-8 text-center text-red-600">{{ loadError }}</div>

                    <!-- Content -->
                    <div v-else class="grid grid-cols-1 gap-6 p-4 sm:p-6 text-[15px]">
                        <!-- ชื่อหัวการ์ดให้เหมือนหน้าแก้ไข -->
                        <div class="w-full max-w-[80rem] mx-auto space-y-6">
                            <!-- บัญชีผู้ใช้ -->
                            <section>
                                <h3 class="mb-3 text-sm font-semibold text-gray-700">บัญชีผู้ใช้</h3>
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">อีเมล</label>
                                        <div
                                            class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                                            {{ user.email }}
                                        </div>
                                    </div>
                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">ชื่อผู้ใช้
                                            (username)</label>
                                        <div
                                            class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                                            {{ user.username }}
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            class="block mb-1 text-xs font-medium text-gray-600">เบอร์โทรศัพท์</label>
                                        <div
                                            class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                                            {{ user.phoneNumber || '-' }}
                                        </div>
                                    </div>
                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">บทบาท</label>
                                        <div
                                            class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                                            {{ user.role }}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <!-- ข้อมูลส่วนตัว -->
                            <section>
                                <h3 class="mb-3 text-sm font-semibold text-gray-700">ข้อมูลส่วนตัว</h3>
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">ชื่อจริง</label>
                                        <div
                                            class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                                            {{ user.firstName }}
                                        </div>
                                    </div>
                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">นามสกุล</label>
                                        <div
                                            class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                                            {{ user.lastName }}
                                        </div>
                                    </div>
                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">เพศ</label>
                                        <div
                                            class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                                            {{ user.gender || '-' }}
                                        </div>
                                    </div>
                                    <!-- ตัดสถานะ Active ออกตามที่ขอ -->
                                </div>
                            </section>

                            <!-- บัตรประชาชน -->
                            <section>
                                <h3 class="mb-3 text-sm font-semibold text-gray-700">บัตรประชาชน</h3>
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label
                                            class="block mb-1 text-xs font-medium text-gray-600">เลขบัตรประชาชน</label>
                                        <div
                                            class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                                            {{ user.nationalIdNumber || '-' }}
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            class="block mb-1 text-xs font-medium text-gray-600">วันหมดอายุบัตร</label>
                                        <div
                                            class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                                            {{ formatDate(user.nationalIdExpiryDate) }}
                                        </div>
                                    </div>
                                </div>

                                <!-- อัปโหลด (ให้ขนาดเหมือนหน้า edit) -->
                                <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                                    <div>
                                        <label
                                            class="block mb-1 text-xs font-medium text-gray-600">รูปบัตรประชาชน</label>
                                        <div
                                            class="p-4 text-center border-2 border-gray-300 border-dashed rounded-md bg-gray-50">
                                            <template v-if="user.nationalIdPhotoUrl">
                                                <div class="flex items-center justify-center">
                                                    <a :href="user.nationalIdPhotoUrl" target="_blank" class="block">
                                                        <img :src="user.nationalIdPhotoUrl" alt="National ID"
                                                            class="rounded max-h-82" />
                                                    </a>
                                                </div>
                                            </template>
                                            <div v-else class="text-gray-500">
                                                <i class="text-3xl fa-regular fa-image"></i>
                                                <p class="mt-1 text-sm">ไม่มีรูป</p>
                                            </div>
                                        </div>
                                        <!-- <div v-if="user.nationalIdPhotoUrl"
                                            class="mt-2 text-xs text-blue-600 underline break-all">
                                            <a :href="user.nationalIdPhotoUrl" target="_blank">{{
                                                user.nationalIdPhotoUrl }}</a>
                                        </div> -->
                                    </div>

                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">รูปถ่ายใบหน้า
                                            (Selfie)</label>
                                        <div
                                            class="p-4 text-center border-2 border-gray-300 border-dashed rounded-md bg-gray-50">
                                            <template v-if="user.selfiePhotoUrl">
                                                <div class="flex items-center justify-center">
                                                    <a :href="user.selfiePhotoUrl" target="_blank" class="block">
                                                        <img :src="user.selfiePhotoUrl" alt="Selfie"
                                                            class="rounded max-h-82" />
                                                    </a>
                                                </div>
                                            </template>
                                            <div v-else class="text-gray-500">
                                                <i class="text-3xl fa-regular fa-image"></i>
                                                <p class="mt-1 text-sm">ไม่มีรูป</p>
                                            </div>
                                        </div>
                                        <!-- <div v-if="user.selfiePhotoUrl"
                                            class="mt-2 text-xs text-blue-600 underline break-all">
                                            <a :href="user.selfiePhotoUrl" target="_blank">{{ user.selfiePhotoUrl }}</a>
                                        </div> -->
                                    </div>
                                </div>
                            </section>

                            <!-- ระบบ -->
                            <section>
                                <h3 class="mb-3 text-sm font-semibold text-gray-700">ระบบ</h3>
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">

                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">สร้างเมื่อ</label>
                                        <div
                                            class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                                            {{ formatDate(user.createdAt, true) }}
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            class="block mb-1 text-xs font-medium text-gray-600">ปรับปรุงล่าสุด</label>
                                        <div
                                            class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                                            {{ formatDate(user.updatedAt, true) }}
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <!-- Admin: ส่งการแจ้งเตือนถึงผู้ใช้ -->
                            <section class="pt-6 mt-4 border-t border-gray-200">
                                <div class="flex items-center justify-between px-4 mb-3 sm:px-0">
                                    <h3 class="text-base font-semibold text-gray-800">ส่งการแจ้งเตือนถึงผู้ใช้</h3>
                                    <span v-if="sending" class="text-xs text-gray-500">กำลังส่ง...</span>
                                </div>

                                <div class="grid grid-cols-1 gap-4">
                                    <!-- Body Preset (dropdown) -->
                                    <div>
                                        <label
                                            class="block mb-1 text-xs font-medium text-gray-600">เลือกข้อความสำหรับผู้ใช้
                                            (body)</label>
                                        <select v-model="presetKey" @change="applyPreset"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                                            <option value="">-- เลือก --</option>
                                            <option value="VERIFY_FAIL_DOC">
                                                ข้อมูลบัตรประชาชน/รูปถ่ายของคุณไม่ผ่านการตรวจสอบ
                                                กรุณาตรวจสอบและส่งใหม่อีกครั้ง
                                            </option>
                                            <option value="VERIFY_FAIL_SELFIE">
                                                รูปถ่ายใบหน้าไม่ชัดเจน กรุณาถ่ายใหม่ให้เห็นใบหน้าชัดเจนและไม่มีแสงสะท้อน
                                            </option>
                                            <option value="VERIFY_APPROVED">
                                                การยืนยันตัวตนเสร็จสมบูรณ์ ขอบคุณที่ให้ความร่วมมือ
                                            </option>
                                            <option value="DOC_EXPIRE_SOON">
                                                บัตรประชาชนของคุณใกล้หมดอายุ กรุณาอัปเดตข้อมูลเพื่อใช้งานได้ต่อเนื่อง
                                            </option>
                                            <!-- <option value="SECURITY_PASSWORD">
                                                ระบบพบความเสี่ยงด้านความปลอดภัย กรุณาเปลี่ยนรหัสผ่านทันที
                                            </option> -->
                                            <option value="CUSTOM">กำหนดข้อความเอง</option>
                                        </select>
                                    </div>

                                    <!-- Body (กำหนดเอง เฉพาะตอนเลือก CUSTOM) -->
                                    <div v-if="presetKey === 'CUSTOM'">
                                        <label class="block mb-1 text-xs font-medium text-gray-600">เนื้อหา
                                            (body)</label>
                                        <textarea v-model.trim="customBody" rows="3"
                                            placeholder="พิมพ์ข้อความถึงผู้ใช้..."
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"></textarea>
                                    </div>

                                    <!-- Actions -->
                                    <div class="flex items-center justify-end gap-2">
                                        <button @click="resetNotify" :disabled="sending"
                                            class="px-3 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-60">
                                            ล้างฟอร์ม
                                        </button>
                                        <button @click="sendNotification" :disabled="sending || !user || !currentBody"
                                            class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400">
                                            ส่งการแจ้งเตือน
                                        </button>
                                    </div>
                                </div>
                            </section>
                        </div>
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRuntimeConfig, useCookie } from '#app'
import dayjs from 'dayjs'
import 'dayjs/locale/th'
import AdminHeader from '~/components/admin/AdminHeader.vue'
import AdminSidebar from '~/components/admin/AdminSidebar.vue'
import { useToast } from '~/composables/useToast'

dayjs.locale('th')
definePageMeta({ middleware: ['admin-auth'] })
useHead({
    title: 'ดูรายละเอียดผู้ใช้ • Admin',
    link: [{ rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css' }]
})

const route = useRoute()
const { toast } = useToast()

const isLoading = ref(true)
const loadError = ref('')
const toggling = ref(false)
const user = ref(null)

const FIXED_TYPE = 'VERIFICATION'
const FIXED_TITLE = 'ยืนยันตัวตนไม่สำเร็จ'
const FIXED_LINK = '/profile/verification'
const FIXED_initiatedBy = 'system'

const sending = ref(false)
const presetKey = ref('')
const customBody = ref('')   // ใช้เมื่อเลือก CUSTOM

// Map ของข้อความสำเร็จรูป
const BODY_PRESETS = {
    VERIFY_FAIL_DOC: 'ข้อมูลบัตรประชาชน/รูปถ่ายของคุณไม่ผ่านการตรวจสอบ กรุณาตรวจสอบและส่งใหม่อีกครั้ง',
    VERIFY_FAIL_SELFIE: 'รูปถ่ายใบหน้าไม่ชัดเจน กรุณาถ่ายใหม่ให้เห็นใบหน้าชัดเจนและไม่มีแสงสะท้อน',
    VERIFY_APPROVED: 'การยืนยันตัวตนเสร็จสมบูรณ์ ขอบคุณที่ให้ความร่วมมือ',
    DOC_EXPIRE_SOON: 'บัตรประชาชนของคุณใกล้หมดอายุ กรุณาอัปเดตข้อมูลเพื่อใช้งานได้ต่อเนื่อง',
    // SECURITY_PASSWORD: 'ระบบพบความเสี่ยงด้านความปลอดภัย กรุณาเปลี่ยนรหัสผ่านทันที',
}

// body ปัจจุบันที่พร้อมส่ง (คำนวณจาก preset หรือ custom)
const currentBody = computed(() => {
    if (presetKey.value === 'CUSTOM') return (customBody.value || '').trim()
    return BODY_PRESETS[presetKey.value] || ''
})

function resetNotify() {
    presetKey.value = ''
    customBody.value = ''
}

function applyPreset() {
    // ถ้าเปลี่ยนจาก CUSTOM เป็น preset อื่น ให้ล้าง customBody
    if (presetKey.value !== 'CUSTOM') customBody.value = ''
}

async function sendNotification() {
    if (!user.value) return
    const bodyText = currentBody.value
    if (!bodyText) return

    sending.value = true
    try {
        const apiBase = useRuntimeConfig().public.apiBase
        const token = useCookie('token')?.value || (process.client ? localStorage.getItem('token') : '')

        const payload = {
            userId: user.value.id,
            type: FIXED_TYPE,
            title: FIXED_TITLE,
            body: bodyText,
            link: FIXED_LINK,
            metadata: {
                kind: 'user_verification',
                userId: user.value.id,
                initiatedBy: FIXED_initiatedBy,
            },
        }

        const res = await fetch(`${apiBase}/notifications/admin`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(payload),
            credentials: 'include',
        })

        let resp
        try { resp = await res.json() } catch {
            const txt = await res.text()
            const e = new Error(txt || 'Unexpected response from server'); e.status = res.status; throw e
        }
        if (!res.ok) {
            const e = new Error(resp?.message || `Request failed with status ${res.status}`); e.status = res.status; e.payload = resp; throw e
        }

        toast.success('ส่งการแจ้งเตือนแล้ว', 'ผู้ใช้จะได้รับการแจ้งเตือนในระบบ')
        resetNotify()
    } catch (err) {
        console.error(err)
        toast.error('ส่งการแจ้งเตือนไม่สำเร็จ', err?.message || 'เกิดข้อผิดพลาด')
    } finally {
        sending.value = false
    }
}


function formatDate(iso, withTime = false) {
    if (!iso) return '-'
    return withTime ? dayjs(iso).format('D MMM BBBB HH:mm') : dayjs(iso).format('D MMM BBBB')
}

/* ---------- GET: fetch user ---------- */
async function fetchUser() {
    isLoading.value = true
    loadError.value = ''
    try {
        const id = route.params.id
        const config = useRuntimeConfig()
        const token = useCookie('token')?.value || (process.client ? localStorage.getItem('token') : '')

        const res = await $fetch(`/users/admin/${id}`, {
            baseURL: config.public.apiBase,
            headers: { Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
        })

        user.value = res?.data || null
    } catch (err) {
        console.error(err)
        loadError.value = err?.data?.message || 'ไม่สามารถโหลดข้อมูลผู้ใช้ได้'
        toast.error('เกิดข้อผิดพลาด', loadError.value)
    } finally {
        isLoading.value = false
    }
}

/* ---------- PATCH: toggle verify ---------- */
async function onToggleVerify(next) {
    if (!user.value) return
    const prev = !!user.value.isVerified
    if (prev === next) return

    // optimistic
    user.value.isVerified = next
    toggling.value = true

    try {
        const id = route.params.id
        const apiBase = useRuntimeConfig().public.apiBase
        let token = useCookie('token')?.value || (process.client ? localStorage.getItem('token') : '')

        const res = await fetch(`${apiBase}/users/admin/${id}/status`, {
            method: 'PATCH',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify({ isVerified: next }),
            credentials: 'include'
        })

        let body
        try { body = await res.json() } catch {
            const txt = await res.text()
            const e = new Error(txt || 'Unexpected response from server'); e.status = res.status; throw e
        }
        if (!res.ok) {
            const e = new Error(body?.message || `Request failed with status ${res.status}`); e.status = res.status; e.payload = body; throw e
        }

        toast.success('อัปเดตการยืนยันแล้ว', next ? 'ยืนยันผู้ใช้สำเร็จ' : 'ยกเลิกการยืนยันผู้ใช้สำเร็จ')
    } catch (err) {
        console.error(err)
        user.value.isVerified = prev // rollback
        toast.error('ไม่สามารถอัปเดตสถานะยืนยันได้', err?.message || 'เกิดข้อผิดพลาด')
    } finally {
        toggling.value = false
    }
}

/* ---------- layout helpers ---------- */
function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar')
    const overlay = document.getElementById('overlay')
    if (!sidebar || !overlay) return
    sidebar.classList.remove('mobile-open')
    overlay.classList.add('hidden')
}
function defineGlobalScripts() {
    window.__adminResizeHandler__ = function () {
        const sidebar = document.getElementById('sidebar')
        const mainContent = document.getElementById('main-content')
        const overlay = document.getElementById('overlay')
        if (!sidebar || !mainContent || !overlay) return
        if (window.innerWidth >= 1024) {
            sidebar.classList.remove('mobile-open'); overlay.classList.add('hidden')
            mainContent.style.marginLeft = sidebar.classList.contains('collapsed') ? '80px' : '280px'
        } else {
            mainContent.style.marginLeft = '0'
        }
    }
    window.addEventListener('resize', window.__adminResizeHandler__)
}
function cleanupGlobalScripts() {
    window.removeEventListener('resize', window.__adminResizeHandler__ || (() => { }))
    delete window.__adminResizeHandler__
}

onMounted(async () => {
    defineGlobalScripts()
    if (typeof window.__adminResizeHandler__ === 'function') window.__adminResizeHandler__()
    await fetchUser()
})
onUnmounted(() => cleanupGlobalScripts())
</script>

<style>
.main-content {
    transition: margin-left 0.3s ease;
}

/* สวิตช์ (แบบเดียวกับหน้า list) */
.switch {
    position: relative;
    width: 42px;
    height: 24px;
}

.switch-input {
    appearance: none;
    -webkit-appearance: none;
    width: 42px;
    height: 24px;
    margin: 0;
    outline: none;
    position: relative;
    cursor: pointer;
}

.switch-slider {
    pointer-events: none;
    position: absolute;
    inset: 0;
    background: #e5e7eb;
    border-radius: 9999px;
    transition: background .2s ease;
}

.switch-input:checked+.switch-slider {
    background: #22c55e;
}

.switch-slider::after {
    content: "";
    position: absolute;
    top: 3px;
    left: 3px;
    width: 18px;
    height: 18px;
    background: #fff;
    border-radius: 9999px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, .2);
    transition: transform .2s ease;
}

.switch-input:checked+.switch-slider::after {
    transform: translateX(18px);
}

.switch-input:disabled+.switch-slider {
    filter: grayscale(.4);
    opacity: .6;
}
</style>
