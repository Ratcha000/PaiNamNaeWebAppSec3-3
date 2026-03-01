<template>
    <div>
        <AdminHeader />
        <AdminSidebar />

        <!-- Main Content -->
        <main id="main-content" class="main-content mt-16 ml-0 lg:ml-[280px] p-6">
            <div class="mx-auto max-w-8xl">
                <!-- Title + Controls -->
                <div class="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
                    <!-- Left: Title -->
                    <div class="flex items-center gap-3">
                        <h1 class="text-2xl font-semibold text-gray-800">Booking Management</h1>
                        <button @click="onCreateBooking"
                            class="inline-flex items-center gap-2 px-3 py-2 text-white bg-blue-600 rounded-md cursor-pointer hover:bg-blue-700">
                            <i class="fa-solid fa-plus"></i>
                            <span class="hidden sm:inline">สร้างการจองใหม่</span>
                        </button>
                    </div>

                    <!-- Right: Quick Search -->
                    <div class="flex items-center gap-2">
                        <input v-model.trim="filters.q" @keyup.enter="applyFilters" type="text"
                            placeholder="ค้นหา : ผู้โดยสาร / ไดรเวอร์ / เส้นทาง / ยานพาหนะ / อีเมล"
                            class="max-w-full px-3 py-2 border border-gray-300 rounded-md w-72 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <button @click="applyFilters"
                            class="px-4 py-2 text-white bg-blue-600 rounded-md cursor-pointer hover:bg-blue-700">
                            ค้นหา
                        </button>
                    </div>
                </div>

                <!-- Advanced Filters -->
                <div class="mb-4 bg-white border border-gray-300 rounded-lg shadow-sm">
                    <div class="grid grid-cols-1 gap-3 px-4 py-4 sm:px-6 lg:grid-cols-[repeat(24,minmax(0,1fr))]">
                        <!-- Pickup Name (5/24) -->
                        <div class="lg:col-span-5">
                            <label class="block mb-1 text-xs font-medium text-gray-600">จุดรับ (ใช้ key: name)</label>
                            <input v-model.trim="filters.pickupName" type="text" placeholder="เช่น มอแดง เพลส"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500" />
                        </div>

                        <!-- Dropoff Name (5/24) -->
                        <div class="lg:col-span-5">
                            <label class="block mb-1 text-xs font-medium text-gray-600">จุดส่ง (ใช้ key: name)</label>
                            <input v-model.trim="filters.dropoffName" type="text" placeholder="เช่น โลตัส ขอนแก่น 2"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500" />
                        </div>

                        <!-- Status (4/24) -->
                        <div class="lg:col-span-4">
                            <label class="block mb-1 text-xs font-medium text-gray-600">สถานะ</label>
                            <select v-model="filters.status"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500">
                                <option value="">ทั้งหมด</option>
                                <option value="PENDING">PENDING</option>
                                <option value="CONFIRMED">CONFIRMED</option>
                                <option value="REJECTED">REJECTED</option>
                                <option value="CANCELLED">CANCELLED</option>
                            </select>
                        </div>

                        <!-- Departure From (5/24) -->
                        <div class="lg:col-span-5">
                            <label class="block mb-1 text-xs font-medium text-gray-600">เวลาออกเดินทางตั้งแต่
                                (YYYY-MM-DD)</label>
                            <input v-model="filters.departureFrom" type="date"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500" />
                        </div>

                        <!-- Departure To (5/24) -->
                        <div class="lg:col-span-5">
                            <label class="block mb-1 text-xs font-medium text-gray-600">ถึงวันที่</label>
                            <input v-model="filters.departureTo" type="date"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500" />
                        </div>

                        <!-- Sort (รวม sortBy + sortOrder) -->
                        <div class="lg:col-span-4">
                            <label class="block mb-1 text-xs font-medium text-gray-600">เรียงตาม</label>
                            <select v-model="filters.sort"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500">
                                <option value="">(ค่าเริ่มต้น)</option>
                                <option value="createdAt:desc">createdAt desc</option>
                                <option value="createdAt:asc">createdAt asc</option>
                                <option value="updatedAt:desc">updatedAt desc</option>
                                <option value="updatedAt:asc">updatedAt asc</option>
                                <option value="route.departureTime:desc">departureTime desc</option>
                                <option value="route.departureTime:asc">departureTime asc</option>
                            </select>
                        </div>

                        <!-- Actions (2/24) -->
                        <div class="flex items-end justify-end gap-2 mt-1 lg:col-span-4 lg:mt-0">
                            <button @click="clearFilters"
                                class="px-3 py-2 text-gray-700 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                                ล้างตัวกรอง
                            </button>
                            <button @click="applyFilters"
                                class="px-4 py-2 text-white bg-blue-600 rounded-md cursor-pointer hover:bg-blue-700">
                                ใช้ตัวกรอง
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Card -->
                <div class="bg-white border border-gray-300 rounded-lg shadow-sm">
                    <div class="flex items-center justify-between px-4 py-4 border-b border-gray-200 sm:px-6">
                        <div class="text-sm text-gray-600">
                            หน้าที่ {{ pagination.page }} / {{ totalPages }} • ทั้งหมด {{ pagination.total }} การจอง
                        </div>
                    </div>

                    <!-- Loading / Error -->
                    <div v-if="isLoading" class="p-8 text-center text-gray-500">กำลังโหลดข้อมูล...</div>
                    <div v-else-if="loadError" class="p-8 text-center text-red-600">{{ loadError }}</div>

                    <!-- Table -->
                    <div v-else class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                                        ผู้โดยสาร</th>
                                    <th class="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">เส้นทาง
                                    </th>
                                    <th class="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">จุดรับ →
                                        จุดส่ง</th>
                                    <th class="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                                        ออกเดินทาง</th>
                                    <th class="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">ที่นั่ง
                                    </th>
                                    <th class="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">สถานะ
                                    </th>
                                    <th class="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                                        สร้างเมื่อ</th>
                                    <th class="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">การกระทำ
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr v-for="b in pagedBookings" :key="b.id" class="transition-opacity hover:bg-gray-50">
                                    <!-- Passenger -->
                                    <td class="px-4 py-3">
                                        <div class="flex items-center gap-3">

                                            <div>
                                                <div class="font-medium text-gray-900">
                                                    {{ b.passenger?.firstName }} {{ b.passenger?.lastName }}
                                                </div>
                                                <div class="text-xs text-gray-500">
                                                    {{ b.passenger?.email || '-' }}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <!-- Route -->
                                    <td class="px-4 py-3">
                                        <div class="font-medium text-gray-900">
                                            {{ b.route?.startLocation?.name || '-' }}
                                            <span class="mx-2 text-gray-400">→</span>
                                            {{ b.route?.endLocation?.name || '-' }}
                                        </div>
                                        <div class="text-xs text-gray-500">
                                            ระยะทาง : {{ formatKm(b.route?.distanceMeters) }}
                                            <span class="mx-2 text-gray-300">|</span>
                                            เวลา : {{ formatDuration(b.route?.durationSeconds) }}
                                        </div>
                                        <div class="text-xs text-gray-500">
                                            ไดรเวอร์: {{ b.route?.driver?.firstName }} {{ b.route?.driver?.lastName }}
                                            <span class="mx-2 text-gray-300">|</span>
                                            รถ: {{ b.route?.vehicle?.vehicleModel || '-' }}
                                            <span class="text-gray-400">({{ b.route?.vehicle?.vehicleType || '-'
                                            }})</span>
                                        </div>
                                    </td>

                                    <!-- Pickup -> Dropoff -->
                                    <td class="px-4 py-3">
                                        <div class="text-xs text-gray-700">
                                            {{ b.pickupLocation?.name || '-' }}
                                            <span class="mx-2 text-gray-400">→</span>
                                            {{ b.dropoffLocation?.name || '-' }}
                                        </div>

                                    </td>

                                    <!-- Departure -->
                                    <td class="px-4 py-3 text-gray-700">
                                        <div class="text-sm">{{ formatDate(b.route?.departureTime) }}</div>
                                    </td>

                                    <!-- Seats -->
                                    <td class="px-4 py-3 text-gray-700 ">
                                        <div class="text-sm">{{ b.numberOfSeats }} ที่นั่ง</div>
                                    </td>

                                    <!-- Status -->
                                    <td class="px-4 py-3">
                                        <span
                                            class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full"
                                            :class="statusBadge(b.status)">
                                            <i class="mr-1 fa-solid" :class="statusIcon(b.status)"></i>
                                            {{ b.status || '-' }}
                                        </span>
                                    </td>

                                    <!-- Created -->
                                    <td class="px-4 py-3 text-gray-700">
                                        <div class="text-sm">{{ formatDate(b.createdAt) }}</div>
                                        <div class="text-xs text-gray-500">อัปเดต {{ formatDate(b.route?.updatedAt) }}
                                        </div>
                                    </td>

                                    <!-- Actions -->
                                    <td class="px-4 py-3">
                                        <button @click="onViewBooking(b)"
                                            class="p-2 text-gray-500 transition-colors cursor-pointer hover:text-emerald-600"
                                            title="ดูรายละเอียด" aria-label="ดูรายละเอียด">
                                            <i class="text-lg fa-regular fa-eye"></i>
                                        </button>
                                        <button @click="onEditBooking(b)"
                                            class="p-2 text-gray-500 transition-colors cursor-pointer hover:text-blue-600"
                                            title="แก้ไข" aria-label="แก้ไข">
                                            <i class="text-lg fa-regular fa-pen-to-square"></i>
                                        </button>
                                        <button @click="askDelete(b)"
                                            class="p-2 text-gray-500 transition-colors cursor-pointer hover:text-red-600"
                                            title="ลบ" aria-label="ลบ">
                                            <i class="text-lg fa-regular fa-trash-can"></i>
                                        </button>
                                    </td>
                                </tr>

                                <tr v-if="!pagedBookings.length">
                                    <td colspan="8" class="px-4 py-10 text-center text-gray-500">ไม่มีข้อมูลการจอง</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination -->
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

        <!-- Mobile Overlay -->
        <div id="overlay" class="fixed inset-0 z-40 hidden bg-black bg-opacity-50 lg:hidden"
            @click="closeMobileSidebar"></div>

        <!-- Confirm Delete Modal -->
        <ConfirmModal :show="showDelete" :title="`ลบการจอง${deletingBooking?.id ? ' : ' + deletingBooking.id : ''}`"
            message="การลบนี้เป็นการลบถาวร ข้อมูลทั้งหมดจะถูกลบและไม่สามารถกู้คืนได้ คุณต้องการดำเนินการต่อหรือไม่?"
            confirmText="ลบถาวร" cancelText="ยกเลิก" variant="danger" @confirm="confirmDelete" @cancel="cancelDelete" />
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useCookie } from '#app'
import dayjs from 'dayjs'
import 'dayjs/locale/th'
import buddhistEra from 'dayjs/plugin/buddhistEra'
import AdminHeader from '~/components/admin/AdminHeader.vue'
import AdminSidebar from '~/components/admin/AdminSidebar.vue'
import { useToast } from '~/composables/useToast'
import ConfirmModal from '~/components/ConfirmModal.vue'


dayjs.locale('th')
dayjs.extend(buddhistEra)

definePageMeta({ middleware: ['admin-auth'] })

const { toast } = useToast()

const isLoading = ref(false)
const loadError = ref('')

/** raw list from API */
const bookingsAll = ref([])

/** UI state (same pattern as routes index) */
const pagination = reactive({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1
})

const filters = reactive({
    q: '',
    pickupName: '',
    dropoffName: '',
    status: '',
    departureFrom: '',
    departureTo: '',
    sort: ''
})

/* ---------- helpers to mirror routes index look&feel ---------- */
function statusBadge(s) {
    if (s === 'CONFIRMED') return 'bg-green-100 text-green-700'
    if (s === 'PENDING') return 'bg-amber-100 text-amber-700'
    if (s === 'REJECTED') return 'bg-red-100 text-red-700'
    if (s === 'CANCELLED') return 'bg-gray-200 text-gray-700'
    return 'bg-gray-100 text-gray-700'
}
function statusIcon(s) {
    if (s === 'CONFIRMED') return 'fa-circle-check'
    if (s === 'PENDING') return 'fa-hourglass-half'
    if (s === 'REJECTED') return 'fa-circle-xmark'
    if (s === 'CANCELLED') return 'fa-ban'
    return 'fa-circle'
}
function formatDate(iso) {
    if (!iso) return '-'
    return dayjs(iso).format('D MMMM BBBB HH:mm')
}
function formatKm(meters) {
    if (!meters && meters !== 0) return '-'
    const km = meters / 1000
    return `${km.toFixed(km < 10 ? 1 : 0)} กม.`
}
function formatDuration(sec) {
    if (!sec && sec !== 0) return '-'
    const h = Math.floor(sec / 3600)
    const m = Math.round((sec % 3600) / 60)
    return h ? `${h} ชม. ${m} นาที` : `${m} นาที`
}
function parseSort(s) {
    const [by, order] = (s || '').split(':')
    if (!by || !['asc', 'desc'].includes(order)) return { by: undefined, order: undefined }
    return { by, order }
}

/* ---------- client-side filtering/sorting to ensure identical UI ---------- */
const filteredSorted = computed(() => {
    let list = [...(bookingsAll.value || [])]

    // text search
    const q = (filters.q || '').toLowerCase().trim()
    if (q) {
        list = list.filter(b => {
            const fields = [
                b?.passenger?.firstName, b?.passenger?.lastName, b?.passenger?.email, b?.passenger?.username,
                b?.route?.driver?.firstName, b?.route?.driver?.lastName,
                b?.route?.vehicle?.vehicleModel, b?.route?.vehicle?.vehicleType,
                b?.route?.startLocation?.name, b?.route?.endLocation?.name,
                b?.pickupLocation?.name, b?.dropoffLocation?.name
            ]
            return fields.some(v => (v || '').toString().toLowerCase().includes(q))
        })
    }

    // pickup/dropoff name
    const pName = (filters.pickupName || '').toLowerCase().trim()
    if (pName) {
        list = list.filter(b => (b?.pickupLocation?.name || '').toLowerCase().includes(pName))
    }
    const dName = (filters.dropoffName || '').toLowerCase().trim()
    if (dName) {
        list = list.filter(b => (b?.dropoffLocation?.name || '').toLowerCase().includes(dName))
    }

    // status
    if (filters.status) {
        list = list.filter(b => (b?.status || '').toUpperCase() === filters.status.toUpperCase())
    }

    // departure date range (route.departureTime)
    if (filters.departureFrom) {
        const from = dayjs(filters.departureFrom).startOf('day')
        list = list.filter(b => b?.route?.departureTime && dayjs(b.route.departureTime).isAfter(from.subtract(1, 'ms')))
    }
    if (filters.departureTo) {
        const to = dayjs(filters.departureTo).endOf('day')
        list = list.filter(b => b?.route?.departureTime && dayjs(b.route.departureTime).isBefore(to.add(1, 'ms')))
    }

    // sorting
    const { by, order } = parseSort(filters.sort)
    if (by) {
        const path = by.split('.')
        list.sort((a, b) => {
            const va = path.reduce((o, k) => (o ? o[k] : undefined), a)
            const vb = path.reduce((o, k) => (o ? o[k] : undefined), b)
            // date or number or string compare
            const A = typeof va === 'string' && dayjs(va).isValid() ? +dayjs(va) : va
            const B = typeof vb === 'string' && dayjs(vb).isValid() ? +dayjs(vb) : vb
            if (A == null && B == null) return 0
            if (A == null) return order === 'asc' ? 1 : -1
            if (B == null) return order === 'asc' ? -1 : 1
            if (A < B) return order === 'asc' ? -1 : 1
            if (A > B) return order === 'asc' ? 1 : -1
            return 0
        })
    }

    return list
})

/* ---------- pagination identical to routes page ---------- */
const totalPages = computed(() =>
    Math.max(1, Math.ceil((filteredSorted.value.length || 0) / (pagination.limit || 20)))
)

const pageButtons = computed(() => {
    const total = totalPages.value
    const current = pagination.page
    if (!total || total < 1) return []
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
    const set = new Set([1, total, current])
    if (current - 1 > 1) set.add(current - 1)
    if (current + 1 < total) set.add(current + 1)
    const pages = Array.from(set).sort((a, b) => a - b)
    const out = []
    for (let i = 0; i < pages.length; i++) {
        if (i > 0 && pages[i] - pages[i - 1] > 1) out.push('…')
        out.push(pages[i])
    }
    return out
})

const pagedBookings = computed(() => {
    const start = (pagination.page - 1) * pagination.limit
    const end = start + pagination.limit
    const slice = filteredSorted.value.slice(start, end)
    pagination.total = filteredSorted.value.length
    pagination.totalPages = totalPages.value
    return slice
})

/* ---------- fetch API (token) ---------- */
async function fetchBookings() {
    isLoading.value = true
    loadError.value = ''
    try {
        const token = useCookie('token').value || (process.client ? localStorage.getItem('token') : '')
        const res = await fetch('http://localhost:3000/api/bookings/admin', {
            headers: {
                Accept: 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            credentials: 'include'
        })
        const body = await res.json()
        if (!res.ok) throw new Error(body?.message || `Request failed: ${res.status}`)
        bookingsAll.value = Array.isArray(body?.data) ? body.data : []
        // reset pagination when new data arrives
        pagination.page = 1
        applyFilters()
    } catch (err) {
        console.error(err)
        loadError.value = err?.message || 'ไม่สามารถโหลดข้อมูลได้'
        toast.error('เกิดข้อผิดพลาด', loadError.value)
        bookingsAll.value = []
    } finally {
        isLoading.value = false
    }
}

function changePage(next) {
    if (next < 1 || next > totalPages.value) return
    pagination.page = next
}
function applyFilters() {
    pagination.page = 1
}
function clearFilters() {
    filters.q = ''
    filters.pickupName = ''
    filters.dropoffName = ''
    filters.status = ''
    filters.departureFrom = ''
    filters.departureTo = ''
    filters.sort = ''
    pagination.page = 1
}

function onViewBooking(b) {
    navigateTo(`/admin/bookings/${b.id}/edit`).catch(() => {
        toast.info('ยังไม่รองรับ', `ดูรายละเอียด Booking: ${b.id}`)
    })
    // ไว้เชื่อมหน้ารายละเอียดภายหลังหากต้องการ
    // toast.info('ยังไม่รองรับ', `ดูรายละเอียด Booking: ${b.id}`)
}
function onEditBooking(b) {
    navigateTo(`/admin/bookings/${b.id}/edit`).catch(() => {
        toast.info('ยังไม่รองรับ', `ดูรายละเอียด Booking: ${b.id}`)
    })
}
function onCreateBooking(b) {
    navigateTo('/admin/bookings/create').catch(() => {
        toast.info('ยังไม่รองรับ', `ดูรายละเอียด Booking: ${b.id}`)
    })
}

const showDelete = ref(false)
const deletingBooking = ref(null)
function askDelete(b) { deletingBooking.value = b; showDelete.value = true }
function cancelDelete() { showDelete.value = false; deletingBooking.value = null }

async function confirmDelete() {
    if (!deletingBooking.value) return
    const b = deletingBooking.value
    try {
        await deleteBooking(b.id)

        // ข้อความสำเร็จให้ตรงกับ booking (อิง route ภายใน booking)
        const fromName = b?.route?.startLocation?.name || '-'
        const toName = b?.route?.endLocation?.name || '-'
        toast.success('ลบการจองเรียบร้อย', `${fromName} → ${toName} ถูกลบถาวรแล้ว`)

        // ปิด modal
        cancelDelete()

        // รีเฟรชรายการ แล้วคงหน้าเพจปัจจุบันให้เหมาะสม
        const currentPage = pagination.page
        await fetchBookings()
        // ถ้าหลังลบแล้วหน้าเกินจำนวนหน้าทั้งหมด ให้เด้งกลับไปหน้าสุดท้าย
        if (currentPage > totalPages.value) {
            changePage(totalPages.value)
        } else {
            changePage(currentPage)
        }
    } catch (err) {
        console.error(err)
        const mapped = normalizeDeleteError(err)
        toast.error(mapped.title, mapped.body)
    }
}
async function deleteBooking(id) {
    const config = useRuntimeConfig()
    const token = useCookie('token').value || (process.client ? localStorage.getItem('token') : '')
    const res = await fetch(`${config.public.apiBase}/bookings/admin/${id}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        credentials: 'include',
    })
    let body
    try { body = await res.json() } catch {
        const text = await res.text(); const err = new Error(text || 'Unexpected response from server'); err.status = res.status; throw err
    }
    if (!res.ok) { const err = new Error(body?.message || `Request failed with status ${res.status}`); err.status = res.status; err.payload = body; throw err }
    return body
}

function normalizeDeleteError(err) {
    const status = err?.status || err?.response?.status || err?.data?.statusCode
    const raw = err?.message || err?.data?.message || ''
    let title = 'ลบไม่สำเร็จ'
    let body = raw || 'ไม่สามารถลบการจองได้'

    if (status === 404 || /not found/i.test(raw)) {
        title = 'ไม่พบการจอง'
        body = 'รายการนี้อาจถูกลบไปแล้ว หรือไม่พบในระบบ'
    } else if (status === 401 || status === 403) {
        title = 'ไม่ได้รับอนุญาต'
        body = 'สิทธิ์ไม่เพียงพอสำหรับการลบ'
    } else if (status === 409 || /conflict|cannot delete/i.test(raw)) {
        title = 'ไม่สามารถลบได้'
        body = raw || 'มีเงื่อนไขบางอย่างที่ทำให้ลบไม่ได้'
    }

    return { title, body, status, raw }
}

useHead({
    title: 'TailAdmin Dashboard',
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
        if (!sidebar || !mainContent || !toggleIcon) return
        sidebar.classList.toggle('collapsed')
        if (sidebar.classList.contains('collapsed')) {
            mainContent.style.marginLeft = '80px'
            toggleIcon.classList.replace('fa-chevron-left', 'fa-chevron-right')
        } else {
            mainContent.style.marginLeft = '280px'
            toggleIcon.classList.replace('fa-chevron-right', 'fa-chevron-left')
        }
    }
    window.toggleMobileSidebar = function () {
        const sidebar = document.getElementById('sidebar')
        const overlay = document.getElementById('overlay')
        if (!sidebar || !overlay) return
        sidebar.classList.toggle('mobile-open')
        overlay.classList.toggle('hidden')
    }
    window.toggleSubmenu = function (menuId) {
        const menu = document.getElementById(menuId)
        const icon = document.getElementById(menuId + '-icon')
        if (!menu || !icon) return
        menu.classList.toggle('hidden')
        if (menu.classList.contains('hidden')) {
            icon.classList.replace('fa-chevron-up', 'fa-chevron-down')
        } else {
            icon.classList.replace('fa-chevron-down', 'fa-chevron-up')
        }
    }
    window.__adminResizeHandler__ = function () {
        const sidebar = document.getElementById('sidebar')
        const mainContent = document.getElementById('main-content')
        const overlay = document.getElementById('overlay')
        if (!sidebar || !mainContent || !overlay) return
        if (window.innerWidth >= 1024) {
            sidebar.classList.remove('mobile-open')
            overlay.classList.add('hidden')
            if (sidebar.classList.contains('collapsed')) {
                mainContent.style.marginLeft = '80px'
            } else {
                mainContent.style.marginLeft = '280px'
            }
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
    delete window.toggleSubmenu
    delete window.__adminResizeHandler__
}

onMounted(() => {
    defineGlobalScripts()
    if (typeof window.__adminResizeHandler__ === 'function') window.__adminResizeHandler__()
    fetchBookings()
})
onUnmounted(() => { cleanupGlobalScripts() })
</script>

<style>
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
