<template>
    <div class="">
        <AdminHeader />
        <AdminSidebar />

        <!-- Main Content -->
        <main id="main-content" class="main-content mt-16 ml-0 lg:ml-[280px] p-6">
            <div class="mx-auto max-w-8xl">

                <!-- Title -->
                <div class="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div class="flex items-center gap-3">
                        <h1 class="text-2xl font-semibold text-gray-800">Report Management</h1>
                    </div>
                    <!-- Filter severity -->
                    <div class="flex items-center gap-2">
                        <select v-model="filterSeverity"
                            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                            <option value="">ทั้งหมด</option>
                            <option value="NORMAL">ปกติ</option>
                            <option value="WARNING">เตือน</option>
                            <option value="BLACKLIST">Blacklist</option>
                        </select>
                    </div>
                </div>

                <!-- Card -->
                <div class="bg-white border border-gray-300 rounded-lg shadow-sm">
                    <div class="flex items-center justify-between px-4 py-4 border-b border-gray-200 sm:px-6">
                        <div class="text-sm text-gray-600">
                            ทั้งหมด {{ filteredReports.length }} รายการ
                        </div>
                    </div>

                    <!-- Loading -->
                    <div v-if="isLoading" class="p-8 text-center text-gray-500">
                        กำลังโหลดข้อมูล...
                    </div>

                    <!-- Error -->
                    <div v-else-if="loadError" class="p-8 text-center text-red-600">
                        {{ loadError }}
                    </div>

                    <!-- Empty -->
                    <div v-else-if="filteredReports.length === 0" class="p-10 text-center text-gray-400">
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
                                    <th class="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">เหตุผล</th>
                                    <th class="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">วันที่รายงาน</th>
                                    <th class="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">ระดับความผิด</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr v-for="report in filteredReports" :key="report.id" class="hover:bg-gray-50">

                                    <!-- ผู้ถูกรายงาน -->
                                    <td class="px-4 py-3">
                                        <div class="flex items-center gap-3">
                                            <img
                                                :src="report.reported.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(report.reported.firstName || 'U')}&background=random&size=64`"
                                                class="object-cover rounded-full w-9 h-9" alt="avatar" />
                                            <div>
                                                <div class="font-medium text-gray-900">
                                                    {{ report.reported.firstName || '' }} {{ report.reported.lastName || '' }}
                                                </div>
                                                <div class="text-xs text-gray-500">@{{ report.reported.username }}</div>
                                            </div>
                                        </div>
                                    </td>

                                    <!-- ผู้รายงาน -->
                                    <td class="px-4 py-3">
                                        <div class="text-sm text-gray-700">
                                            {{ report.reporter.firstName || '' }} {{ report.reporter.lastName || '' }}
                                        </div>
                                        <div class="text-xs text-gray-400">@{{ report.reporter.username }}</div>
                                    </td>

                                    <!-- เหตุผล -->
                                    <td class="px-4 py-3 max-w-xs">
                                        <div class="bg-gray-50 rounded-lg px-3 py-2 text-sm text-red-500 break-words">
                                            {{ report.reason }}
                                        </div>
                                    </td>

                                    <!-- วันที่ -->
                                    <td class="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                                        {{ formatDate(report.createdAt) }}
                                    </td>

                                    <!-- ระดับความผิด -->
                                    <td class="px-4 py-3">
                                        <div class="flex items-center gap-2">
                                            <!-- Dropdown -->
                                            <select
                                                v-model="report._selected"
                                                :disabled="report._saving"
                                                class="px-3 py-2 border border-blue-500 rounded-md text-sm font-medium bg-blue-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer disabled:opacity-50"
                                            >
                                                <option
                                                    v-for="opt in severityOptions"
                                                    :key="opt.value"
                                                    :value="opt.value"
                                                    class="bg-white text-gray-800"
                                                >
                                                    {{ opt.label }}
                                                </option>
                                            </select>

                                            <!-- Save Button -->
                                            <button
                                                @click="setSeverity(report, report._selected)"
                                                :disabled="report._saving || report._selected === report.severity"
                                                class="px-3 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
                                            >
                                                <i v-if="report._saving" class="fas fa-spinner fa-spin mr-1"></i>
                                                บันทึก
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
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
const filterSeverity = ref('')

const severityOptions = [
    { value: 'NORMAL',    label: 'ปกติ',     activeClass: 'bg-green-100 text-green-700 border-green-300' },
    { value: 'WARNING',   label: 'เตือน',    activeClass: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
    { value: 'BLACKLIST', label: 'Blacklist', activeClass: 'bg-red-100 text-red-700 border-red-300' },
]

const filteredReports = computed(() => {
    if (!filterSeverity.value) return reports.value
    return reports.value.filter(r => r.severity === filterSeverity.value)
})

function formatDate(iso) {
    if (!iso) return '-'
    return dayjs(iso).format('D MMMM BBBB HH:mm')
}

function getToken() {
    return useCookie('token').value || (process.client ? localStorage.getItem('token') : '')
}

async function fetchReports() {
    isLoading.value = true
    loadError.value = ''
    try {
        const token = getToken()
        const res = await $fetch('/reports/admin', {
            baseURL: config.public.apiBase,
            headers: {
                Accept: 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
        })
        reports.value = (res?.data || []).map(r => ({
            ...r,
            _saving: false,
            _pendingSeverity: null,
            _selected: r.severity || 'NORMAL'
        }))
    } catch (err) {
        console.error(err)
        loadError.value = err?.data?.message || 'ไม่สามารถโหลดข้อมูลได้'
        toast.error('เกิดข้อผิดพลาด', loadError.value)
    } finally {
        isLoading.value = false
    }
}

async function setSeverity(report, severity) {
    if (report.severity === severity || report._saving) return

    const prev = report.severity
    report.severity = severity
    report._saving = true
    report._pendingSeverity = severity

    try {
        const token = getToken()
        const res = await fetch(`${config.public.apiBase}/reports/admin/${report.id}/severity`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify({ severity })
        })
        const body = await res.json()
        if (!res.ok) throw new Error(body?.message || `Error ${res.status}`)
        report.severity = body.data.severity
        report._selected = body.data.severity
        const label = severityOptions.find(o => o.value === severity)?.label
        toast.success('บันทึกแล้ว', `อัปเดตระดับความผิดเป็น "${label}" สำเร็จ`)
    } catch (err) {
        report.severity = prev
        report._selected = prev
        console.error(err)
        toast.error('บันทึกไม่สำเร็จ', err?.message || 'เกิดข้อผิดพลาด')
    } finally {
        report._saving = false
        report._pendingSeverity = null
    }
}

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
    fetchReports()
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