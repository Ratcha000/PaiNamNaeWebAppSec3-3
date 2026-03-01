<template>
    <div class="">
        <AdminHeader />
        <AdminSidebar />

        <main id="main-content" class="main-content mt-16 ml-0 lg:ml-[280px] p-6">
            <div class="mx-auto max-w-8xl">

                <!-- Title -->
                <div class="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
                    <h1 class="text-2xl font-semibold text-gray-800">Report Management</h1>
                    <div class="flex items-center gap-2">
                        <select v-model="filterStatus"
                            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                            <option value="">สถานะทั้งหมด</option>
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="resolved">Resolved</option>
                        </select>
                    </div>
                </div>

                <!-- Card -->
                <div class="bg-white border border-gray-300 rounded-lg shadow-sm">
                    <div class="flex items-center justify-between px-4 py-4 border-b border-gray-200 sm:px-6">
                        <div class="text-sm text-gray-600">
                            ทั้งหมด {{ pagination.total }} รายการ
                        </div>
                    </div>

                    <div v-if="isLoading" class="p-8 text-center text-gray-500">กำลังโหลดข้อมูล...</div>
                    <div v-else-if="loadError" class="p-8 text-center text-red-600">{{ loadError }}</div>
                    <div v-else-if="reports.length === 0" class="p-10 text-center text-gray-400">
                        <i class="fas fa-flag text-4xl mb-3 block"></i>
                        ไม่มีรายงานในขณะนี้
                    </div>

                    <!-- Table -->
                    <div v-else class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">ผู้ถูกรายงาน</th>
                                    <th class="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">ผู้รายงาน</th>
                                    <th class="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">หมวดหมู่</th>
                                    <th class="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">รายละเอียด</th>
                                    <th class="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">สถานะ</th>
                                    <th class="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">วันที่</th>
                                    <th class="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">ระดับคะแนน</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr v-for="report in reports" :key="report.id" class="hover:bg-gray-50">

                                    <!-- ผู้ถูกรายงาน -->
                                    <td class="px-4 py-3">
                                        <div class="flex items-center gap-3">
                                            <img
                                                :src="report.reportedUser?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(report.reportedUser?.firstName || 'U')}&background=random&size=64`"
                                                class="object-cover rounded-full w-9 h-9" alt="avatar" />
                                            <div>
                                                <div class="font-medium text-gray-900">
                                                    {{ report.reportedUser?.firstName || '' }} {{ report.reportedUser?.lastName || '' }}
                                                </div>
                                                <div class="text-xs text-gray-500">@{{ report.reportedUser?.username }}</div>
                                            </div>
                                        </div>
                                    </td>

                                    <!-- ผู้รายงาน -->
                                    <td class="px-4 py-3">
                                        <div class="text-sm text-gray-700">
                                            {{ report.reporter?.firstName || '' }} {{ report.reporter?.lastName || '' }}
                                        </div>
                                        <div class="text-xs text-gray-400">@{{ report.reporter?.username }}</div>
                                    </td>

                                    <!-- หมวดหมู่ -->
                                    <td class="px-4 py-3">
                                        <span class="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                                            {{ report.category || '-' }}
                                        </span>
                                    </td>

                                    <!-- รายละเอียด -->
                                    <td class="px-4 py-3 max-w-xs">
                                        <div class="bg-gray-50 rounded-lg px-3 py-2 text-sm text-red-500 break-words">
                                            {{ report.description || '-' }}
                                        </div>
                                    </td>

                                    <!-- สถานะ -->
                                    <td class="px-4 py-3">
                                        <span class="px-2 py-1 text-xs font-medium rounded-full"
                                            :class="{
                                                'bg-yellow-100 text-yellow-700': report.status === 'pending',
                                                'bg-blue-100 text-blue-700': report.status === 'reviewed',
                                                'bg-green-100 text-green-700': report.status === 'resolved',
                                            }">
                                            {{ report.status }}
                                        </span>
                                    </td>

                                    <!-- วันที่ -->
                                    <td class="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                                        {{ formatDate(report.createdAt) }}
                                    </td>

                                    <!-- ระดับคะแนน: dropdown + บันทึก -->
                                    <td class="px-4 py-3">
                                        <div class="flex items-center gap-2">
                                            <select
                                                v-model="report._selected"
                                                :disabled="report._saving"
                                                class="px-3 py-2 border border-blue-500 rounded-md text-sm font-medium bg-blue-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer disabled:opacity-50"
                                            >
                                                <option v-for="opt in severityOptions" :key="opt.value" :value="opt.value" class="bg-white text-gray-800">
                                                    {{ opt.label }}
                                                </option>
                                            </select>
                                            <button
                                                @click="reviewReport(report)"
                                                :disabled="report._saving || report._selected === report.severity"
                                                class="px-3 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
                                            >
                                                <i v-if="report._saving" class="fas fa-spinner fa-spin mr-1"></i>
                                                บันทึก
                                            </button>
                                        </div>
                                        <!-- severity badge ปัจจุบัน -->
                                        <div v-if="report.severity" class="mt-1">
                                            <span class="text-xs px-2 py-0.5 rounded-full font-medium"
                                                :class="{
                                                    'bg-green-100 text-green-700': report.severity === 'normal',
                                                    'bg-yellow-100 text-yellow-700': report.severity === 'warning',
                                                    'bg-red-100 text-red-700': report.severity === 'blacklist',
                                                }">
                                                {{ severityOptions.find(o => o.value === report.severity)?.label || report.severity }}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination -->
                    <div class="flex flex-col gap-3 px-4 py-4 border-t border-gray-200 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
                        <div class="text-sm text-gray-500">
                            หน้าที่ {{ pagination.page }} / {{ pagination.pages }}
                        </div>
                        <nav class="flex items-center gap-1">
                            <button class="px-3 py-2 text-sm border rounded-md disabled:opacity-50"
                                :disabled="pagination.page <= 1 || isLoading"
                                @click="fetchReports(pagination.page - 1)">Previous</button>
                            <button class="px-3 py-2 text-sm border rounded-md disabled:opacity-50"
                                :disabled="pagination.page >= pagination.pages || isLoading"
                                @click="fetchReports(pagination.page + 1)">Next</button>
                        </nav>
                    </div>
                </div>

            </div>
        </main>

        <div id="overlay" class="fixed inset-0 z-40 hidden bg-black bg-opacity-50 lg:hidden"
            @click="closeMobileSidebar"></div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRuntimeConfig, useCookie } from '#app'
import dayjs from 'dayjs'
import 'dayjs/locale/th'
import buddhistEra from 'dayjs/plugin/buddhistEra'
import AdminHeader from '~/components/admin/AdminHeader.vue'
import AdminSidebar from '~/components/admin/AdminSidebar.vue'
import { useToast } from '~/composables/useToast'

dayjs.locale('th')
dayjs.extend(buddhistEra)

definePageMeta({ middleware: ['admin-auth'] })

const { toast } = useToast()
const config = useRuntimeConfig()

const isLoading = ref(false)
const loadError = ref('')
const reports = ref([])
const filterStatus = ref('pending')
const pagination = ref({ page: 1, limit: 10, total: 0, pages: 1 })

const severityOptions = [
    { value: '',          label: 'ระดับคะแนน' },
    { value: 'normal',    label: 'ปกติ' },
    { value: 'warning',   label: 'เตือน' },
    { value: 'blacklist', label: 'Blacklist' },
]

function formatDate(iso) {
    if (!iso) return '-'
    return dayjs(iso).format('D MMMM BBBB HH:mm')
}

function getToken() {
    return useCookie('token').value || (process.client ? localStorage.getItem('token') : '')
}

async function fetchReports(page = 1) {
    isLoading.value = true
    loadError.value = ''
    try {
        const token = getToken()
        const query = new URLSearchParams({
            page,
            limit: pagination.value.limit,
            ...(filterStatus.value ? { status: filterStatus.value } : {})
        }).toString()

        const res = await $fetch(`/reports?${query}`, {
            baseURL: config.public.apiBase,
            headers: {
                Accept: 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
        })

        reports.value = (res?.data || []).map(r => ({
            ...r,
            _saving: false,
            _selected: r.severity || ''
        }))
        if (res?.pagination) pagination.value = res.pagination
    } catch (err) {
        console.error(err)
        loadError.value = err?.data?.message || 'ไม่สามารถโหลดข้อมูลได้'
        toast.error('เกิดข้อผิดพลาด', loadError.value)
    } finally {
        isLoading.value = false
    }
}

async function reviewReport(report) {
    if (!report._selected || report._selected === report.severity || report._saving) return

    const prev = report.severity
    report._saving = true

    try {
        const token = getToken()
        const res = await fetch(`${config.public.apiBase}/reports/${report.id}/review`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify({ severity: report._selected })
        })
        const body = await res.json()
        if (!res.ok) throw new Error(body?.message || `Error ${res.status}`)
        report.severity = body.data.severity
        report.status = body.data.status
        const label = severityOptions.find(o => o.value === report._selected)?.label
        toast.success('บันทึกแล้ว', `อัปเดตระดับคะแนนเป็น "${label}" สำเร็จ`)
    } catch (err) {
        report.severity = prev
        report._selected = prev
        console.error(err)
        toast.error('บันทึกไม่สำเร็จ', err?.message || 'เกิดข้อผิดพลาด')
    } finally {
        report._saving = false
    }
}

watch(filterStatus, () => fetchReports(1))

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
        icon.classList.toggle('fa-chevron-down')
        icon.classList.toggle('fa-chevron-up')
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
    delete window.toggleSubmenu
    delete window.__adminResizeHandler__
}

useHead({
    title: 'Report Management',
    link: [{ rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css' }]
})

onMounted(() => {
    defineGlobalScripts()
    if (typeof window.__adminResizeHandler__ === 'function') window.__adminResizeHandler__()
    fetchReports(1)
})

onUnmounted(() => {
    cleanupGlobalScripts()
})
</script>

<style>
.sidebar { transition: width 0.3s ease; }
.sidebar.collapsed { width: 80px; }
.sidebar:not(.collapsed) { width: 280px; }
.sidebar-item { transition: all 0.3s ease; }
.sidebar.collapsed .sidebar-text { display: none; }
.sidebar.collapsed .sidebar-item { justify-content: center; }
.main-content { transition: margin-left 0.3s ease; }

@media (max-width: 768px) {
    .sidebar { position: fixed; z-index: 1000; transform: translateX(-100%); }
    .sidebar.mobile-open { transform: translateX(0); }
    .main-content { margin-left: 0 !important; }
}
</style>