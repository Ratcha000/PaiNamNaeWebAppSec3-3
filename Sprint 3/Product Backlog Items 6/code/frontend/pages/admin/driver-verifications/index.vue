<template>
    <div>
        <AdminHeader />
        <AdminSidebar />

        <main id="main-content" class="main-content mt-16 ml-0 lg:ml-[280px] p-6">
            <div class="mx-auto max-w-8xl">
                <!-- Header + Quick Actions -->
                <div class="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div class="flex items-center gap-3">
                        <h1 class="text-2xl font-semibold text-gray-800">Driver Verification Management</h1>
                        <button @click="onCreate"
                            class="inline-flex items-center gap-2 px-3 py-2 text-white bg-blue-600 rounded-md cursor-pointer hover:bg-blue-700">
                            <i class="fa-solid fa-plus"></i>
                            <span class="hidden sm:inline">สร้างคำขอยืนยันตัวตน (แอดมิน)</span>
                        </button>
                    </div>

                    <div class="flex items-center gap-2">
                        <input v-model.trim="filters.q" @keyup.enter="applyFilters" type="text"
                            placeholder="ค้นหา: เลขใบขับขี่, ชื่อ, อีเมล, Username"
                            class="max-w-full px-3 py-2 border border-gray-300 rounded-md w-72 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <button @click="applyFilters"
                            class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
                            ค้นหา
                        </button>
                    </div>
                </div>

                <!-- Filters -->
                <div class="mb-4 bg-white border border-gray-300 rounded-lg shadow-sm">
                    <div class="grid grid-cols-1 gap-3 px-4 py-4 sm:px-6 lg:grid-cols-[repeat(24,minmax(0,1fr))]">

                        <div class="lg:col-span-4">
                            <label class="block mb-1 text-xs font-medium text-gray-600">สถานะคำขอ</label>
                            <select v-model="filters.status"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500">
                                <option value="">ทั้งหมด</option>
                                <option value="PENDING">PENDING</option>
                                <option value="APPROVED">APPROVED</option>
                                <option value="REJECTED">REJECTED</option>
                            </select>
                        </div>

                        <div class="lg:col-span-6">
                            <label class="block mb-1 text-xs font-medium text-gray-600">ชนิดของใบขับขี่</label>
                            <select v-model="filters.typeOnLicense"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500">
                                <option value="">ทั้งหมด</option>
                                <option value="PRIVATE_CAR_TEMPORARY">รถยนต์ส่วนบุคคลชั่วคราว (2 ปี)</option>
                                <option value="PRIVATE_CAR">รถยนต์ส่วนบุคคล (5 ปี)</option>
                                <option value="PUBLIC_CAR">รถยนต์สาธารณะ</option>
                                <option value="LIFETIME">ตลอดชีพ</option>
                            </select>
                        </div>

                        <div class="lg:col-span-6">
                            <label class="block mb-1 text-xs font-medium text-gray-600">เรียงตาม</label>
                            <select v-model="filters.sort"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500">
                                <option value="">(ค่าเริ่มต้น)</option>
                                <option value="createdAt:desc">สร้างล่าสุด</option>
                                <option value="createdAt:asc">สร้างเก่าสุด</option>
                                <option value="updatedAt:desc">อัปเดตล่าสุด</option>
                                <option value="updatedAt:asc">อัปเดตเก่าสุด</option>
                            </select>
                        </div>

                        <div class="flex items-end justify-end gap-2 mt-1 lg:col-span-8 lg:mt-0">
                            <button @click="clearFilters"
                                class="px-3 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
                                ล้างตัวกรอง
                            </button>
                            <button @click="applyFilters"
                                class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
                                ใช้ตัวกรอง
                            </button>
                        </div>
                    </div>
                </div>

                <!-- List -->
                <div class="bg-white border border-gray-300 rounded-lg shadow-sm">
                    <div class="flex items-center justify-between px-4 py-4 border-b border-gray-200 sm:px-6">
                        <div class="text-sm text-gray-600">
                            หน้าที่ {{ pagination.page }} / {{ totalPages }} • ทั้งหมด {{ pagination.total }} รายการ
                        </div>
                    </div>

                    <div v-if="isLoading" class="p-8 text-center text-gray-500">
                        <i class="text-3xl fa-solid fa-spinner fa-spin"></i>
                        <p class="mt-2">กำลังโหลดข้อมูล...</p>
                    </div>

                    <div v-else-if="loadError" class="p-8 text-center text-red-600">
                        {{ loadError }}
                    </div>

                    <div v-else class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">ผู้ใช้
                                        (ชื่อ • อีเมล • Username)</th>
                                    <th class="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                                        เลขที่ใบขับขี่</th>
                                    <th class="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                                        ชื่อ-นามสกุลบนใบขับขี่</th>
                                    <th class="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                                        ชนิดใบขับขี่</th>
                                    <th class="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                                        สถานะคำขอ</th>
                                    <th class="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                                        สร้างเมื่อ</th>
                                    <!-- <th class="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                                        อัปเดตล่าสุด</th> -->
                                    <th class="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">การกระทำ
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr v-for="r in rows" :key="r.id" class="transition-colors hover:bg-gray-50">
                                    <td class="px-4 py-3">
                                        <div class="flex items-center gap-3">
                                            <img :src="r.user?.profilePicture || r.selfiePhotoUrl || 'https://via.placeholder.com/80x80?text=Selfie'"
                                                class="object-cover w-12 h-12 rounded-full" alt="avatar" />
                                            <div>
                                                <div class="font-medium text-gray-900">
                                                    {{ r.user?.firstName }} {{ r.user?.lastName }}
                                                    <span class="text-xs text-gray-500" v-if="r.user?.username">(@{{
                                                        r.user.username }})</span>
                                                </div>
                                                <div class="text-xs text-gray-500">{{ r.user?.email }}</div>
                                                <div class="text-xs text-gray-400" v-if="r.user?.phoneNumber">Tel: {{
                                                    r.user.phoneNumber }}</div>
                                            </div>
                                        </div>
                                    </td>

                                    <td class="px-4 py-3 text-gray-700">{{ r.licenseNumber || '-' }}</td>

                                    <td class="px-4 py-3 text-gray-700">
                                        {{ (r.firstNameOnLicense || '-') + ' ' + (r.lastNameOnLicense || '') }}
                                    </td>

                                    <td class="px-4 py-3 text-gray-700">
                                        <span
                                            class="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">
                                            {{ mapLicenseType(r.typeOnLicense) }}
                                        </span>
                                    </td>

                                    <td class="px-4 py-3">
                                        <span
                                            class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full"
                                            :class="statusBadgeClass(r.status)">
                                            <i class="mr-1 fa-solid fa-circle"></i>{{ r.status }}
                                        </span>
                                    </td>

                                    <!-- <td class="px-4 py-3 text-gray-700">
                                        <div class="text-sm">{{ d(r.createdAt, true) }}</div>
                                    </td> -->

                                    <!-- <td class="px-4 py-3 text-gray-700">
                                        <div class="text-sm">{{ d(r.updatedAt, true) }}</div>
                                    </td> -->
                                    <td class="px-4 py-3 text-gray-700">
                                        <div class="text-sm">{{ d(r.createdAt, true) }}</div>
                                        <div class="text-xs text-gray-500">อัปเดต {{ d(r.updatedAt, true) }}</div>
                                    </td>
                                    <td class="px-4 py-3">
                                        <div class="flex items-center gap-1">
                                            <button @click="onView(r)" class="p-2 text-gray-500 hover:text-emerald-600"
                                                title="ดูรายละเอียด">
                                                <i class="text-lg fa-regular fa-eye"></i>
                                            </button>
                                            <button @click="onEdit(r)" class="p-2 text-gray-500 hover:text-blue-600"
                                                title="แก้ไข">
                                                <i class="text-lg fa-regular fa-pen-to-square"></i>
                                            </button>
                                            <button @click="onDelete(r)" class="p-2 text-gray-500 hover:text-red-600"
                                                title="ลบ">
                                                <i class="text-lg fa-regular fa-trash-can"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>

                                <tr v-if="!isLoading && rows.length === 0">
                                    <td colspan="7" class="px-4 py-10 text-center text-gray-500">
                                        ไม่พบข้อมูลที่ตรงกับเงื่อนไข</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Footer / Pagination -->
                    <div
                        class="flex flex-col gap-3 px-4 py-4 border-t border-gray-200 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
                        <div class="flex flex-wrap items-center gap-3 text-sm">
                            <div class="flex items-center gap-2">
                                <span class="text-xs text-gray-500">Limit:</span>
                                <select v-model.number="pagination.limit" @change="applyFilters"
                                    class="px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-blue-500">
                                    <option :value="10">10</option>
                                    <option :value="20">20</option>
                                    <option :value="50">50</option>
                                </select>
                            </div>
                        </div>
                        <nav class="flex items-center gap-1">
                            <button class="px-3 py-2 text-sm border rounded-md disabled:opacity-50"
                                :disabled="pagination.page <= 1 || isLoading" @click="changePage(pagination.page - 1)">
                                Previous
                            </button>
                            <template v-for="(p, idx) in pageButtons" :key="`p-${idx}-${p}`">
                                <span v-if="p === '…'" class="px-2 text-sm text-gray-500">…</span>
                                <button v-else class="px-3 py-2 text-sm border rounded-md"
                                    :class="p === pagination.page ? 'bg-blue-50 text-blue-600 border-blue-200' : 'hover:bg-gray-50'"
                                    :disabled="isLoading" @click="changePage(p)">
                                    {{ p }}
                                </button>
                            </template>
                            <button class="px-3 py-2 text-sm border rounded-md disabled:opacity-50"
                                :disabled="pagination.page >= totalPages || isLoading"
                                @click="changePage(pagination.page + 1)">
                                Next
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </main>

        <div id="overlay" class="fixed inset-0 z-40 hidden bg-black bg-opacity-50 lg:hidden"
            @click="closeMobileSidebar"></div>

        <!-- Confirm delete -->
        <ConfirmModal :show="showDeleteConfirm" title="ยืนยันการลบ" :message="deleteMessage" confirmText="ลบ"
            cancelText="ยกเลิก" variant="danger" @confirm="confirmDelete" @cancel="cancelDelete" />
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRuntimeConfig, useCookie } from '#app'
import dayjs from 'dayjs'
import 'dayjs/locale/th'
import AdminHeader from '~/components/admin/AdminHeader.vue'
import AdminSidebar from '~/components/admin/AdminSidebar.vue'
import ConfirmModal from '~/components/ConfirmModal.vue'
import { useToast } from '~/composables/useToast'

dayjs.locale('th')

definePageMeta({ middleware: ['admin-auth'] })
useHead({
    title: 'Driver Verifications • Admin',
    link: [{ rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css' }]
})

const { toast } = useToast()

const isLoading = ref(true)
const loadError = ref('')
const rows = ref([])

const pagination = reactive({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
})

const filters = reactive({
    q: '',
    status: '',           // '', 'PENDING' | 'APPROVED' | 'REJECTED'
    // อ้างอิงชนิดใบขับขี่ตามหน้า user: PRIVATE_CAR_TEMPORARY | PRIVATE_CAR | PUBLIC_CAR | LIFETIME
    typeOnLicense: '',
    sort: 'createdAt:desc'
})

const totalPages = computed(() =>
    Math.max(1, pagination.totalPages || Math.ceil((pagination.total || 0) / (pagination.limit || 10)))
)

const pageButtons = computed(() => {
    const total = totalPages.value
    const current = pagination.page
    if (!total || total < 1) return []
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
    const set = new Set([1, total, current])
    if (current > 2) set.add(current - 1)
    if (current < total - 1) set.add(current + 1)
    const pages = Array.from(set).sort((a, b) => a - b)
    const out = []
    for (let i = 0; i < pages.length; i++) {
        if (i > 0 && pages[i] - pages[i - 1] > 1) out.push('…')
        out.push(pages[i])
    }
    return out
})

function d(iso, withTime = false) {
    if (!iso) return '-'
    return withTime ? dayjs(iso).format('D MMMM YYYY HH:mm') : dayjs(iso).format('D MMMM YYYY')
}

function parseSort(s) {
    const [by, order] = (s || '').split(':')
    if (!by || !['asc', 'desc'].includes(order)) return { sortBy: 'createdAt', sortOrder: 'desc' }
    return { sortBy: by, sortOrder: order }
}

function statusBadgeClass(st) {
    if (st === 'APPROVED') return 'bg-green-100 text-green-700'
    if (st === 'REJECTED') return 'bg-red-100 text-red-700'
    return 'bg-amber-100 text-amber-700'
}

function mapLicenseType(type) {
    if (!type) return '-'
    const map = {
        PRIVATE_CAR_TEMPORARY: 'รถยนต์ส่วนบุคคลชั่วคราว (2 ปี)',
        PRIVATE_CAR: 'รถยนต์ส่วนบุคคล (5 ปี)',
        PUBLIC_CAR: 'รถยนต์สาธารณะ',
        LIFETIME: 'ตลอดชีพ'
    }
    return map[type] || type
}

async function fetchRows(page = 1) {
    isLoading.value = true
    loadError.value = ''
    try {
        const config = useRuntimeConfig()
        const token = useCookie('token').value || (process.client ? localStorage.getItem('token') : '')

        const { sortBy, sortOrder } = parseSort(filters.sort)

        const query = {
            page,
            limit: pagination.limit,
            q: filters.q || undefined,
            status: filters.status || undefined,
            typeOnLicense: filters.typeOnLicense || undefined,
            sortBy,
            sortOrder
        }

        const res = await $fetch('/driver-verifications/admin', {
            baseURL: config.public.apiBase,
            headers: { Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            query
        })

        rows.value = res?.data || []
        const p = res?.pagination || {}
        pagination.page = Number(p.page ?? page)
        pagination.limit = Number(p.limit ?? pagination.limit)
        pagination.total = Number(p.total ?? rows.value.length)
        pagination.totalPages = Number(p.totalPages ?? Math.ceil(pagination.total / pagination.limit))
    } catch (err) {
        console.error('Fetch DV (admin) error:', err)
        loadError.value = err?.data?.message || 'ไม่สามารถโหลดข้อมูลได้'
        toast.error('เกิดข้อผิดพลาด', loadError.value)
        rows.value = []
    } finally {
        isLoading.value = false
    }
}

function changePage(next) {
    if (next < 1 || next > totalPages.value) return
    fetchRows(next)
}
function applyFilters() {
    pagination.page = 1
    fetchRows(1)
}
function clearFilters() {
    filters.q = ''
    filters.status = ''
    filters.typeOnLicense = ''
    filters.sort = 'createdAt:desc'
    pagination.page = 1
    fetchRows(1)
}

/* ---------- Delete (Admin) ---------- */
const showDeleteConfirm = ref(false)
const pendingDelete = ref(null)
const deleteMessage = computed(() => {
    if (!pendingDelete.value) return ''
    const u = pendingDelete.value.user || {}
    const display = `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email || pendingDelete.value.licenseNumber || ''
    return `ต้องการลบคำขอยืนยันของ ${display} ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`
})
function onDelete(row) {
    pendingDelete.value = row
    showDeleteConfirm.value = true
}
function cancelDelete() {
    showDeleteConfirm.value = false
    pendingDelete.value = null
}
async function confirmDelete() {
    if (!pendingDelete.value) return
    try {
        const config = useRuntimeConfig()
        const token = useCookie('token').value || (process.client ? localStorage.getItem('token') : '')
        // อิงตามเส้นทางของหน้าแก้ไข (PUT /driver-verifications/admin/:id) => ลบใช้ DELETE เส้นทางเดียวกัน
        await $fetch(`/driver-verifications/admin/${pendingDelete.value.id}`, {
            baseURL: config.public.apiBase,
            method: 'DELETE',
            headers: { Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
        })
        toast.success('ลบสำเร็จ', 'รายการถูกลบออกแล้ว')
        showDeleteConfirm.value = false
        fetchRows(pagination.page)
    } catch (err) {
        console.error('Delete DV (admin) error:', err)
        const msg = err?.data?.message || 'ไม่สามารถลบรายการได้'
        toast.error('เกิดข้อผิดพลาด', msg)
    }
}

/* ---------- Navigation ---------- */
function onCreate() {
    navigateTo('/admin/driver-verifications/create').catch(() => { })
}
function onView(r) {
    navigateTo(`/admin/driver-verifications/${r.id}`).catch(() => { })
}
function onEdit(r) {
    navigateTo(`/admin/driver-verifications/${r.id}/edit`).catch(() => { })
}

/* ---------- Layout helpers (same pattern as other admin pages) ---------- */
function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar')
    const overlay = document.getElementById('overlay')
    if (!sidebar || !overlay) return
    sidebar.classList.remove('mobile-open')
    overlay.classList.add('hidden')
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
    }
    window.toggleMobileSidebar = function () {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        if (!sidebar || !overlay) return;
        sidebar.classList.toggle('mobile-open');
        overlay.classList.toggle('hidden');
    }
    window.toggleSubmenu = function (menuId) {
        const menu = document.getElementById(menuId);
        const icon = document.getElementById(menuId + '-icon');
        if (!menu || !icon) return;
        menu.classList.toggle('hidden');
        if (menu.classList.contains('hidden')) {
            icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
        } else {
            icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
        }
    }
    window.__adminResizeHandler__ = function () {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('main-content');
        const overlay = document.getElementById('overlay');
        if (!sidebar || !mainContent || !overlay) return;
        if (window.innerWidth >= 1024) {
            sidebar.classList.remove('mobile-open');
            overlay.classList.add('hidden');
            if (sidebar.classList.contains('collapsed')) {
                mainContent.style.marginLeft = '80px';
            } else {
                mainContent.style.marginLeft = '280px';
            }
        } else {
            mainContent.style.marginLeft = '0';
        }
    }
    window.addEventListener('resize', window.__adminResizeHandler__)
}
function cleanupGlobalScripts() {
    window.removeEventListener('resize', window.__adminResizeHandler__ || (() => { }))
    delete window.toggleSidebar
    delete window.toggleMobileSidebar
    delete window.toggleSubmenu
    delete window.__adminResizeHandler__
}

onMounted(() => {
    defineGlobalScripts()
    if (typeof window.__adminResizeHandler__ === 'function') window.__adminResizeHandler__();
    fetchRows(1)
})

onUnmounted(() => {
    cleanupGlobalScripts()
})
</script>

<style>
/* Global styles for admin layout (match other admin pages) */
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

.main-content {
    transition: margin-left 0.3s ease;
}

@media (max-width:1024px) {
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
