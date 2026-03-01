<template>
    <div>
        <AdminHeader />
        <AdminSidebar />

        <!-- Main Content -->
        <main id="main-content" class="main-content mt-16 ml-0 lg:ml-[280px] p-6">
            <!-- Back -->
            <div class="mb-8">
                <NuxtLink to="/admin/driver-verifications"
                    class="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                    <i class="fa-solid fa-arrow-left"></i>
                    <span>ย้อนกลับ</span>
                </NuxtLink>
            </div>

            <div class="mx-auto max-w-8xl">
                <!-- Title -->
                <div class="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div class="flex items-center gap-3">
                        <h1 class="text-2xl font-semibold text-gray-800">รายละเอียดการยืนยันตัวตนผู้ขับขี่</h1>
                        <span class="text-sm text-gray-500">ดูข้อมูลคำขอและเปลี่ยนสถานะได้จากหน้านี้</span>
                    </div>
                </div>

                <!-- Status & actions -->
                <div class="mb-6 bg-white border border-gray-300 rounded-lg shadow-sm">
                    <div class="flex flex-wrap items-center gap-3 px-4 py-4 sm:px-6">
                        <div class="text-sm text-gray-700">สถานะปัจจุบัน:</div>
                        <span class="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full" :class="{
                            'bg-amber-100 text-amber-700': dv?.status === 'PENDING',
                            'bg-green-100 text-green-700': dv?.status === 'APPROVED',
                            'bg-red-100 text-red-700': dv?.status === 'REJECTED'
                        }">
                            <i class="fa-solid fa-circle mr-1 text-[8px]"></i>{{ statusLower(dv?.status) }}
                        </span>

                        <div class="flex gap-2 ml-auto">
                            <button class="px-3 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
                                :disabled="isPatchingStatus || !dv" @click="patchStatus('PENDING')">
                                <i v-if="isPatchingStatus && targetStatus === 'PENDING'"
                                    class="mr-1 fa-solid fa-spinner fa-spin"></i>
                                pending
                            </button>
                            <button
                                class="px-3 py-2 text-green-700 border border-green-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                                :disabled="isPatchingStatus || !dv" @click="patchStatus('APPROVED')">
                                <i v-if="isPatchingStatus && targetStatus === 'APPROVED'"
                                    class="mr-1 fa-solid fa-spinner fa-spin"></i>
                                approve
                            </button>
                            <button
                                class="px-3 py-2 text-red-700 border border-red-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                                :disabled="isPatchingStatus || !dv" @click="patchStatus('REJECTED')">
                                <i v-if="isPatchingStatus && targetStatus === 'REJECTED'"
                                    class="mr-1 fa-solid fa-spinner fa-spin"></i>
                                reject
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Card -->
                <div class="bg-white border border-gray-300 rounded-lg shadow-sm">
                    <!-- Loading / Error -->
                    <div v-if="isLoading" class="p-8 text-center text-gray-500">กำลังโหลดข้อมูล...</div>
                    <div v-else-if="loadError" class="p-8 text-center text-red-600">{{ loadError }}</div>

                    <!-- Content (render เฉพาะเมื่อ dv มีข้อมูล) -->
                    <div v-else-if="dv" class="grid grid-cols-1 gap-6 p-4 sm:p-6 text-[15px]">
                        <div class="w-full max-w-[80rem] mx-auto space-y-6">
                            <!-- ผู้ใช้ -->
                            <section>
                                <h3 class="mb-3 text-sm font-semibold text-gray-700">ข้อมูลผู้ใช้</h3>
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <InfoBox label="ชื่อ-นามสกุล">
                                        {{ (dv.user?.firstName || '-') + ' ' + (dv.user?.lastName || '') }}
                                    </InfoBox>
                                    <InfoBox label="อีเมล">
                                        {{ dv.user?.email || '-' }}
                                    </InfoBox>
                                    <InfoBox label="ชื่อผู้ใช้ (username)">
                                        {{ dv.user?.username || '-' }}
                                    </InfoBox>
                                    <InfoBox label="เบอร์โทรศัพท์">
                                        {{ dv.user?.phoneNumber || '-' }}
                                    </InfoBox>
                                </div>
                            </section>

                            <!-- ใบขับขี่ -->
                            <section>
                                <h3 class="mb-3 text-sm font-semibold text-gray-700">ข้อมูลบนใบขับขี่</h3>
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <InfoBox label="เลขที่ใบขับขี่">
                                        {{ dv.licenseNumber || '-' }}
                                    </InfoBox>
                                    <InfoBox label="ชื่อ (บนใบขับขี่)">
                                        {{ dv.firstNameOnLicense || '-' }}
                                    </InfoBox>
                                    <InfoBox label="นามสกุล (บนใบขับขี่)">
                                        {{ dv.lastNameOnLicense || '-' }}
                                    </InfoBox>
                                    <InfoBox label="ประเภทบนใบขับขี่">
                                        {{ mapLicenseType(dv.typeOnLicense) }}
                                    </InfoBox>
                                    <InfoBox label="วันออกบัตร">
                                        {{ formatDate(dv.licenseIssueDate) }}
                                    </InfoBox>
                                    <InfoBox label="วันหมดอายุ">
                                        {{ formatDate(dv.licenseExpiryDate) }}
                                    </InfoBox>
                                </div>
                            </section>

                            <!-- รูปถ่าย -->
                            <section>
                                <h3 class="mb-3 text-sm font-semibold text-gray-700">รูปถ่ายประกอบ</h3>
                                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <!-- License front -->
                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">รูปบัตรขับขี่
                                            (ด้านหน้า)</label>
                                        <div v-if="dv.licensePhotoUrl" class="photo-box">
                                            <a :href="dv.licensePhotoUrl" target="_blank" class="block w-full h-full">
                                                <img :src="dv.licensePhotoUrl" alt="license"
                                                    class="object-contain w-full h-full" />
                                            </a>
                                        </div>
                                        <div v-else class="photo-box empty">ไม่มีรูป</div>
                                    </div>

                                    <!-- Selfie -->
                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">รูปถ่ายพร้อมใบขับขี่
                                            (Selfie)</label>
                                        <div v-if="dv.selfiePhotoUrl" class="photo-box">
                                            <a :href="dv.selfiePhotoUrl" target="_blank" class="block w-full h-full">
                                                <img :src="dv.selfiePhotoUrl" alt="selfie"
                                                    class="object-contain w-full h-full" />
                                            </a>
                                        </div>
                                        <div v-else class="photo-box empty">ไม่มีรูป</div>
                                    </div>
                                </div>
                            </section>

                            <!-- ระบบ -->
                            <section>
                                <h3 class="mb-3 text-sm font-semibold text-gray-700">ระบบ</h3>
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <InfoBox label="สร้างเมื่อ">
                                        {{ formatDate(dv.createdAt, true) }}
                                    </InfoBox>
                                    <InfoBox label="อัปเดตล่าสุด">
                                        {{ formatDate(dv.updatedAt, true) }}
                                    </InfoBox>
                                </div>
                            </section>
                        </div>
                    </div>

                    <!-- No data -->
                    <div v-else class="p-8 text-center text-gray-500">ไม่พบข้อมูล</div>
                </div>
            </div>
        </main>

        <!-- Mobile Overlay -->
        <div id="overlay" class="fixed inset-0 z-40 hidden bg-black bg-opacity-50 lg:hidden"
            @click="closeMobileSidebar"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineComponent, h } from 'vue'
import { useRoute, useRuntimeConfig, useCookie } from '#app'
import AdminHeader from '~/components/admin/AdminHeader.vue'
import AdminSidebar from '~/components/admin/AdminSidebar.vue'
import { useToast } from '~/composables/useToast'
import dayjs from 'dayjs'
import 'dayjs/locale/th'
dayjs.locale('th')

definePageMeta({ middleware: ['admin-auth'] })
useHead({
    title: 'ดูรายละเอียดการยืนยันตัวตน • Admin',
    link: [{ rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css' }]
})

type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

interface DVUser {
    id: string
    email?: string | null
    username?: string | null
    firstName?: string | null
    lastName?: string | null
    phoneNumber?: string | null
}

interface DriverVerification {
    id: string
    userId: string
    licenseNumber?: string | null
    firstNameOnLicense?: string | null
    lastNameOnLicense?: string | null
    typeOnLicense?: string | null
    licenseIssueDate?: string | null
    licenseExpiryDate?: string | null
    licensePhotoUrl?: string | null
    selfiePhotoUrl?: string | null
    status: VerificationStatus
    createdAt?: string | null
    updatedAt?: string | null
    user?: DVUser | null
}

interface ApiResponse<T> {
    success: boolean
    message: string
    data: T
}

/* Reusable display box */
const InfoBox = defineComponent({
    name: 'InfoBox',
    props: { label: { type: String, required: true } },
    setup(props, { slots }) {
        return () =>
            h('div', {}, [
                h('div', { class: 'block mb-1 text-xs font-medium text-gray-600' }, props.label),
                h(
                    'div',
                    { class: 'w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900' },
                    slots.default ? slots.default() : ''
                )
            ])
    }
})

const { toast } = useToast()
const route = useRoute()
const dvId = route.params.id as string

const isLoading = ref(true)
const loadError = ref('')
const dv = ref<DriverVerification | null>(null)

const isPatchingStatus = ref(false)
const targetStatus = ref<VerificationStatus | ''>('')

onMounted(async () => {
    defineGlobalScripts()
    if (typeof (window as any).__adminResizeHandler__ === 'function') (window as any).__adminResizeHandler__()
    await fetchDV()
})
onUnmounted(() => cleanupGlobalScripts())

async function fetchDV() {
    isLoading.value = true
    loadError.value = ''
    try {
        const config = useRuntimeConfig()
        const token = useCookie('token').value || (process.client ? localStorage.getItem('token') : '')
        const res = await $fetch<ApiResponse<DriverVerification>>(`/driver-verifications/admin/${dvId}`, {
            baseURL: config.public.apiBase,
            headers: { Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
        })
        dv.value = res.data ?? null
    } catch (err: any) {
        console.error(err)
        loadError.value = err?.data?.message || 'ไม่สามารถโหลดข้อมูลได้'
    } finally {
        isLoading.value = false
    }
}

/* Helpers */
function formatDate(iso?: string | null, withTime = false) {
    if (!iso) return '-'
    return withTime ? dayjs(iso).format('D MMM YYYY HH:mm') : dayjs(iso).format('D MMM YYYY')
}
function statusLower(st?: VerificationStatus | null) {
    if (!st) return '-'
    return st.toLowerCase()
}
function mapLicenseType(type?: string | null) {
    if (!type) return '-'
    const map: Record<string, string> = {
        PRIVATE_CAR_TEMPORARY: 'รถยนต์ส่วนบุคคลชั่วคราว (2 ปี)',
        PRIVATE_CAR: 'รถยนต์ส่วนบุคคล (5 ปี)',
        PUBLIC_CAR: 'รถยนต์สาธารณะ',
        LIFETIME: 'ตลอดชีพ'
    }
    return map[type] || type
}

/* Patch status -> PATCH /driver-verifications/:id/status */
async function patchStatus(status: VerificationStatus) {
    if (!dv.value) return
    isPatchingStatus.value = true
    targetStatus.value = status
    try {
        const config = useRuntimeConfig()
        const token = useCookie('token').value || (process.client ? localStorage.getItem('token') : '')
        const res = await $fetch<ApiResponse<DriverVerification>>(`/driver-verifications/${dvId}/status`, {
            baseURL: config.public.apiBase,
            method: 'PATCH',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: { status }
        })
        if (res.data && dv.value) {
            dv.value = {
                ...dv.value,                 // เก็บ user เดิมไว้
                status: res.data.status,     // อัปเดตเฉพาะสถานะ
                updatedAt: res.data.updatedAt ?? dv.value.updatedAt
            }
        } else if (dv.value) {
            dv.value.status = status
        }
        toast.success('อัปเดตสถานะสำเร็จ', `สถานะใหม่: ${statusLower(status)}`)
    } catch (err: any) {
        console.error(err)
        toast.error('เกิดข้อผิดพลาด', err?.data?.message || 'อัปเดตสถานะไม่สำเร็จ')
    } finally {
        isPatchingStatus.value = false
        targetStatus.value = ''
    }
}

/* Layout helpers */
function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar')
    const overlay = document.getElementById('overlay')
    if (!sidebar || !overlay) return
    sidebar.classList.remove('mobile-open')
    overlay.classList.add('hidden')
}
function defineGlobalScripts() {
    ; (window as any).__adminResizeHandler__ = function () {
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
    window.addEventListener('resize', (window as any).__adminResizeHandler__)
}
function cleanupGlobalScripts() {
    window.removeEventListener('resize', (window as any).__adminResizeHandler__ || (() => { }))
    delete (window as any).__adminResizeHandler__
}
</script>

<style>
.main-content {
    transition: margin-left 0.3s ease;
}

/* กล่องรูปมาตรฐาน: ทำให้สองฝั่งเท่ากันเสมอ */
.photo-box {
    height: 380px;
    /* ปรับได้ตามต้องการ */
    padding: 1rem;
    border: 1px solid #e5e7eb;
    /* border-gray-300 */
    border-radius: .5rem;
    background: #f9fafb;
    /* bg-gray-50 */
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.photo-box img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    /* รักษาสัดส่วน ไม่ครอป */
}

.photo-box.empty {
    color: #6b7280;
    /* text-gray-500 */
    border-style: dashed;
}

@media (min-width: 1024px) {
    .photo-box {
        height: 420px;
    }
}

/* ให้พฤติกรรม sidebar/โลโก้เหมือนหน้า admin อื่น ๆ */
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
