<template>
    <div class="">
        <AdminHeader />
        <AdminSidebar />

        <main id="main-content" class="main-content mt-16 ml-0 lg:ml-[280px] p-6">
            <div class="mx-auto max-w-8xl">

                <div class="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
                    <h1 class="text-2xl font-semibold text-gray-800">Report Management</h1>
                    <div class="flex items-center gap-2">
                        
                    </div>
                </div>

                <div class="bg-white border border-gray-300 rounded-lg shadow-sm">
                    <div class="flex items-center justify-between px-4 py-4 border-b border-gray-200 sm:px-6">
                        <div class="text-sm text-gray-600">
                            หน้าที่ {{ pagination.page }} / {{ pagination.pages || 1 }} • ทั้งหมด {{ pagination.total }} รายการ
                        </div>
                    </div>

                    <div v-if="isLoading" class="p-8 text-center text-gray-500">
                        <i class="fas fa-circle-notch fa-spin text-2xl mb-2"></i>
                        <p>กำลังโหลดข้อมูล...</p>
                    </div>
                    <div v-else-if="loadError" class="p-8 text-center text-red-600">
                        <i class="fas fa-exclamation-triangle text-2xl mb-2"></i>
                        <p>{{ loadError }}</p>
                        <button @click="fetchReports(1)" class="mt-2 text-blue-600 underline">ลองใหม่อีกครั้ง</button>
                    </div>
                    <div v-else-if="reports.length === 0" class="p-10 text-center text-gray-400">
                        <i class="fas fa-flag text-4xl mb-3 block"></i>
                        ไม่มีรายงานในขณะนี้
                    </div>

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
                                    <th class="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr v-for="report in reports" :key="report.id" class="hover:bg-gray-50">
                                    <td class="px-4 py-3">
                                        <div class="flex items-center gap-3">
                                            <img :src="report.reportedUser?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(report.reportedUser?.firstName || 'U')}&background=random&size=64`"
                                                class="object-cover rounded-full w-9 h-9" alt="avatar" />
                                            <div>
                                                <div class="font-medium text-gray-900">
                                                    {{ report.reportedUser?.firstName }} {{ report.reportedUser?.lastName }}
                                                </div>
                                                <div class="text-xs text-gray-500">@{{ report.reportedUser?.username }}</div>
                                            </div>
                                        </div>
                                    </td>

                                    <td class="px-4 py-3">
                                        <div class="text-sm text-gray-700">
                                            {{ report.reporter?.firstName }} {{ report.reporter?.lastName }}
                                        </div>
                                        <div class="text-xs text-gray-400">@{{ report.reporter?.username }}</div>
                                    </td>

                                    <td class="px-4 py-3">
                                        <span class="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 capitalize">
                                            {{ report.category || '-' }}
                                        </span>
                                    </td>

                                    <td class="px-4 py-3 max-w-xs">
                                        <div class="bg-gray-50 rounded-lg px-3 py-2 text-sm text-red-500 break-words">
                                            {{ report.description || '-' }}
                                        </div>
                                    </td>

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

                                    <td class="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                                        {{ formatDate(report.createdAt) }}
                                    </td>

                                    <td class="px-4 py-3">
                                        <div class="flex items-center gap-2">
                                            <select v-model="report._selected" :disabled="report._saving"
                                                class="px-2 py-1.5 border border-gray-300 rounded-md text-sm bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 disabled:opacity-50">
                                                <option value="">ระดับคะแนน</option>
                                                <option value="none">ปกติ</option>
                                                <option value="warning">เตือน</option>
                                                <option value="blacklist">Blacklist</option>
                                            </select>
                                            <button @click="doReview(report)"
                                                :disabled="report._saving || !report._selected || report._selected === report.severity"
                                                class="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-40 whitespace-nowrap">
                                                <i v-if="report._saving" class="fas fa-spinner fa-spin mr-1"></i>
                                                บันทึก
                                            </button>
                                        </div>
                                        <div v-if="report.severity && report.severity !== 'none'" class="mt-1">
                                            <span class="text-[10px] px-2 py-0.5 rounded-full font-medium"
                                                :class="{
                                                    'bg-yellow-100 text-yellow-700': report.severity === 'warning',
                                                    'bg-red-100 text-red-700': report.severity === 'blacklist',
                                                }">
                                                ปัจจุบัน: {{ report.severity === 'warning' ? 'เตือน' : 'Blacklist' }}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="flex flex-col gap-3 px-4 py-4 border-t border-gray-200 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
                        <div class="flex items-center gap-2 text-sm text-gray-500">
                            แสดงหน้าละ:
                            <select v-model.number="pagination.limit" @change="fetchReports(1)"
                                class="px-2 py-1 border border-gray-300 rounded-md">
                                <option :value="10">10</option>
                                <option :value="20">20</option>
                                <option :value="50">50</option>
                            </select>
                        </div>
                        <nav class="flex items-center gap-1">
                            <button class="px-3 py-1 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50"
                                :disabled="pagination.page <= 1 || isLoading"
                                @click="fetchReports(pagination.page - 1)">ย้อนกลับ</button>
                            
                            <span class="px-4 py-1 text-sm font-medium border rounded-md bg-blue-50 text-blue-600">
                                {{ pagination.page }}
                            </span>

                            <button class="px-3 py-1 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50"
                                :disabled="pagination.page >= pagination.pages || isLoading"
                                @click="fetchReports(pagination.page + 1)">ถัดไป</button>
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
import { ref, reactive, onMounted, onUnmounted } from 'vue'
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

const { $api } = useNuxtApp() // ย้ายมาไว้ข้างนอกเพื่อให้เรียกใช้ได้ทั่วถึง
const { toast } = useToast()
const config = useRuntimeConfig()

const isLoading = ref(false)
const loadError = ref('')
const reports = ref([])
const filterStatus = ref('pending')
const filterSeverity = ref('')
const pagination = reactive({ page: 1, limit: 10, total: 0, pages: 1 })

function formatDate(iso) {
    if (!iso) return '-'
    return dayjs(iso).format('D MMMM BBBB HH:mm')
}

async function fetchReports(page = 1) {
    isLoading.value = true
    loadError.value = ''
    try {
        // ใช้ Query object แทนการต่อ String เองเพื่อความปลอดภัย
        const res = await $api('/reports', {
            query: {
                page,
                limit: pagination.limit,
                status: filterStatus.value || undefined,
                severity: filterSeverity.value || undefined
            }
        })

        // res ตอนนี้จะมีโครงสร้าง { data, pagination } ตามที่แก้ใน Plugin
        reports.value = (res?.data || []).map(r => ({
            ...r,
            _saving: false,
            _selected: r.severity || ''
        }))

        if (res?.pagination) {
            pagination.page = res.pagination.page
            pagination.limit = res.pagination.limit
            pagination.total = res.pagination.total
            pagination.pages = res.pagination.pages
        }
    } catch (err) {
        console.error('Fetch Error:', err)
        loadError.value = err.data?.message || err.statusMessage || 'ไม่สามารถโหลดข้อมูลได้'
        toast.error('เกิดข้อผิดพลาด', loadError.value)
    } finally {
        isLoading.value = false
    }
}

async function doReview(report) {
    if (!report._selected || report._selected === report.severity || report._saving) return

    const prev = report.severity
    report._saving = true

    try {
        const res = await $api(`/reports/${report.id}/review`, {
            method: 'PATCH',
            body: { severity: report._selected }
        })

        // หลัง Patch สำเร็จ อัปเดตข้อมูลในแถวนั้น
        report.severity = res.severity || report._selected
        report.status = res.status || 'reviewed'
        
        const label = report._selected === 'warning' ? 'เตือน' : (report._selected === 'none' ? 'ปกติ' : 'Blacklist')
        toast.success('บันทึกแล้ว', `อัปเดตเป็น "${label}" สำเร็จ`)
    } catch (err) {
        report._selected = prev
        console.error(err)
        toast.error('บันทึกไม่สำเร็จ', err.data?.message || 'เกิดข้อผิดพลาด')
    } finally {
        report._saving = false
    }
}

// --- Sidebar Scripts ---
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
    window.removeEventListener('resize', window.__adminResizeHandler__)
    delete window.toggleSidebar
    delete window.toggleMobileSidebar
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

<style scoped>
.main-content { transition: margin-left 0.3s ease; }
@media (max-width: 1024px) {
    .main-content { margin-left: 0 !important; }
}
</style>