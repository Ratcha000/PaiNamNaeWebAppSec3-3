<template>
  <div class="">
    <AdminHeader />
    <AdminSidebar />

    <!-- Main Content -->
    <main id="main-content" class="main-content mt-16 ml-0 lg:ml-[280px] p-6">
      <div class="mx-auto max-w-8xl">
        <!-- Page Title -->
        <div class="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-3">
            <h1 class="text-2xl font-semibold text-gray-800">ระบบบัญชีดำ</h1>
          </div>
        </div>

        <!-- Tabs -->
        <div class="flex gap-2 mb-6 border-b border-gray-200">
          <button @click="activeTab = 'reports'"
            :class="[
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'reports'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            ]">
            <i class="fa-regular fa-flag mr-2"></i>รายงานที่รอตัดสิน ({{ pendingReportsCount }})
          </button>
          <button @click="activeTab = 'blacklisted'"
            :class="[
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'blacklisted'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            ]">
            <i class="fa-regular fa-ban mr-2"></i>บัญชีดำ ({{ blacklistedCount }})
          </button>
        </div>

        <!-- TAB 1: Pending Reports -->
        <template v-if="activeTab === 'reports'">
          <!-- Search & Filters -->
          <div class="mb-4 bg-white border border-gray-300 rounded-lg shadow-sm">
            <div class="grid grid-cols-1 gap-3 px-4 py-4 sm:px-6 lg:grid-cols-[repeat(24,minmax(0,1fr))]">
              <div class="lg:col-span-8">
                <label class="block mb-1 text-xs font-medium text-gray-600">ค้นหา</label>
                <input v-model.trim="filtersReports.q" @keyup.enter="applyReportsFilters" type="text"
                  placeholder="ค้นหา Category / Reporter / Reported User..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500" />
              </div>

              <div class="lg:col-span-4">
                <label class="block mb-1 text-xs font-medium text-gray-600">หมวดหมู่</label>
                <select v-model="filtersReports.category"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500">
                  <option value="">ทั้งหมด</option>
                  <option value="behavior">พฤติกรรม</option>
                  <option value="safety">ความปลอดภัย</option>
                  <option value="fraud">การฉ้อโกง</option>
                  <option value="other">อื่นๆ</option>
                </select>
              </div>

              <div class="lg:col-span-6 flex items-end gap-2">
                <button @click="applyReportsFilters"
                  class="px-4 py-2 text-white bg-blue-600 rounded-md cursor-pointer hover:bg-blue-700">
                  ค้นหา
                </button>
                <button @click="clearReportsFilters"
                  class="px-3 py-2 text-gray-700 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                  ล้าง
                </button>
              </div>
            </div>
          </div>

          <!-- Reports Table -->
          <div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-gray-200 bg-gray-50">
                    <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">ลำดับ</th>
                    <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">ผู้รายงาน</th>
                    <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">ผู้ถูกรายงาน</th>
                    <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">หมวดหมู่</th>
                    <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">รายละเอียด</th>
                    <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">วันที่รายงาน</th>
                    <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700">การกระทำ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(report, idx) in reports" :key="report.id" class="border-b border-gray-100 hover:bg-gray-50">
                    <td class="px-4 py-3 text-sm text-gray-600">{{ (paginationReports.page - 1) * paginationReports.limit + idx + 1 }}</td>
                    <td class="px-4 py-3 text-sm">
                      <div class="font-medium">{{ report.reporter?.username }}</div>
                      <div class="text-xs text-gray-500">{{ report.reporter?.email }}</div>
                    </td>
                    <td class="px-4 py-3 text-sm">
                      <div class="font-medium">{{ report.reportedUser?.username }}</div>
                      <div class="text-xs text-gray-500">{{ report.reportedUser?.email }}</div>
                    </td>
                    <td class="px-4 py-3 text-sm">
                      <span :class="[
                        'px-2 py-1 text-xs font-medium rounded',
                        report.category === 'behavior' ? 'bg-blue-100 text-blue-700' :
                        report.category === 'safety' ? 'bg-red-100 text-red-700' :
                        report.category === 'fraud' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      ]">
                        {{ categoryLabel(report.category) }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{{ report.description }}</td>
                    <td class="px-4 py-3 text-sm text-gray-500">{{ formatDate(report.createdAt) }}</td>
                    <td class="px-4 py-3 text-center text-sm">
                      <button @click="openReviewModal(report)"
                        class="px-3 py-1 text-white bg-amber-500 rounded-md cursor-pointer hover:bg-amber-600 transition-colors text-sm">
                        <i class="fa-regular fa-pen-to-square mr-1"></i>ตัดสิน
                      </button>
                    </td>
                  </tr>

                  <tr v-if="!reports.length">
                    <td colspan="7" class="px-4 py-10 text-center text-gray-500">ไม่มีรายงานที่รอตัดสิน</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div class="flex flex-col gap-3 px-4 py-4 border-t border-gray-200 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
              <div class="text-sm text-gray-600">
                รวม {{ paginationReports.total }} รายงาน
              </div>
              <nav class="flex items-center gap-1">
                <button class="px-3 py-2 text-sm border rounded-md disabled:opacity-50"
                  :disabled="paginationReports.page <= 1 || isLoadingReports"
                  @click="changePageReports(paginationReports.page - 1)">
                  ← ก่อนหน้า
                </button>

                <template v-for="(p, idx) in pageButtonsReports" :key="`p-${idx}-${p}`">
                  <span v-if="p === '…'" class="px-2 text-sm text-gray-500">…</span>
                  <button v-else class="px-3 py-2 text-sm border rounded-md"
                    :class="p === paginationReports.page ? 'bg-blue-50 text-blue-600 border-blue-200' : 'hover:bg-gray-50'"
                    :disabled="isLoadingReports" @click="changePageReports(p)">
                    {{ p }}
                  </button>
                </template>

                <button class="px-3 py-2 text-sm border rounded-md disabled:opacity-50"
                  :disabled="paginationReports.page >= totalPagesReports || isLoadingReports"
                  @click="changePageReports(paginationReports.page + 1)">
                  ถัดไป →
                </button>
              </nav>
            </div>
          </div>
        </template>

        <!-- TAB 2: Blacklisted Users -->
        <template v-if="activeTab === 'blacklisted'">
          <div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-gray-200 bg-gray-50">
                    <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">ลำดับ</th>
                    <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">ชื่อผู้ใช้</th>
                    <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">อีเมล</th>
                    <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">เหตุผล</th>
                    <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">ถูกแบนเมื่อ</th>
                    <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700">การกระทำ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(user, idx) in blacklistedUsers" :key="user.id" class="border-b border-gray-100 hover:bg-gray-50">
                    <td class="px-4 py-3 text-sm text-gray-600">{{ (paginationBlacklist.page - 1) * paginationBlacklist.limit + idx + 1 }}</td>
                    <td class="px-4 py-3 text-sm font-medium">{{ user.username }}</td>
                    <td class="px-4 py-3 text-sm text-gray-600">{{ user.email }}</td>
                    <td class="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{{ user.blacklistReason || '-' }}</td>
                    <td class="px-4 py-3 text-sm text-gray-500">{{ formatDate(user.blacklistedAt) }}</td>
                    <td class="px-4 py-3 text-center">
                     
                    </td>
                  </tr>

                  <tr v-if="!blacklistedUsers.length">
                    <td colspan="6" class="px-4 py-10 text-center text-gray-500">ไม่มีบัญชีดำ</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div class="flex flex-col gap-3 px-4 py-4 border-t border-gray-200 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
              <div class="text-sm text-gray-600">
                รวม {{ paginationBlacklist.total }} บัญชี
              </div>
              <nav class="flex items-center gap-1">
                <button class="px-3 py-2 text-sm border rounded-md disabled:opacity-50"
                  :disabled="paginationBlacklist.page <= 1 || isLoadingBlacklist"
                  @click="changePageBlacklist(paginationBlacklist.page - 1)">
                  ← ก่อนหน้า
                </button>

                <template v-for="(p, idx) in pageButtonsBlacklist" :key="`p-${idx}-${p}`">
                  <span v-if="p === '…'" class="px-2 text-sm text-gray-500">…</span>
                  <button v-else class="px-3 py-2 text-sm border rounded-md"
                    :class="p === paginationBlacklist.page ? 'bg-blue-50 text-blue-600 border-blue-200' : 'hover:bg-gray-50'"
                    :disabled="isLoadingBlacklist" @click="changePageBlacklist(p)">
                    {{ p }}
                  </button>
                </template>

                <button class="px-3 py-2 text-sm border rounded-md disabled:opacity-50"
                  :disabled="paginationBlacklist.page >= totalPagesBlacklist || isLoadingBlacklist"
                  @click="changePageBlacklist(paginationBlacklist.page + 1)">
                  ถัดไป →
                </button>
              </nav>
            </div>
          </div>
        </template>
      </div>
    </main>

    <!-- Mobile Overlay -->
    <div id="overlay" class="fixed inset-0 z-40 hidden bg-black bg-opacity-50 lg:hidden"
      @click="closeMobileSidebar"></div>

    <!-- Review Report Modal -->
    <div v-if="showReviewModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-800">ตัดสินใจการรายงาน</h2>
          <button @click="closeReviewModal" class="text-gray-500 hover:text-gray-700">
            <i class="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <div v-if="selectedReport" class="space-y-4 max-h-[70vh] overflow-y-auto">
          <!-- Reporter Info -->
          <div class="pb-4 border-b border-gray-200">
            <label class="text-sm font-semibold text-gray-600">ผู้รายงาน</label>
            <div class="mt-1 text-sm">
              <div class="font-medium">{{ selectedReport.reporter?.username }}</div>
              <div class="text-gray-500">{{ selectedReport.reporter?.email }}</div>
            </div>
          </div>

          <!-- Reported User Info -->
          <div class="pb-4 border-b border-gray-200">
            <label class="text-sm font-semibold text-gray-600">ผู้ถูกรายงาน</label>
            <div class="mt-1 text-sm">
              <div class="font-medium">{{ selectedReport.reportedUser?.username }}</div>
              <div class="text-gray-500">{{ selectedReport.reportedUser?.email }}</div>
              <div class="text-gray-500">เลขบัตรประชาชน: {{ selectedReport.reportedUser?.nationalIdNumber || '-' }}</div>
            </div>
          </div>

          <!-- Category -->
          <div class="pb-4 border-b border-gray-200">
            <label class="text-sm font-semibold text-gray-600">หมวดหมู่</label>
            <div class="mt-1">
              <span :class="[
                'px-3 py-1 text-sm font-medium rounded inline-block',
                selectedReport.category === 'behavior' ? 'bg-blue-100 text-blue-700' :
                selectedReport.category === 'safety' ? 'bg-red-100 text-red-700' :
                selectedReport.category === 'fraud' ? 'bg-orange-100 text-orange-700' :
                'bg-gray-100 text-gray-700'
              ]">
                {{ categoryLabel(selectedReport.category) }}
              </span>
            </div>
          </div>

          <!-- Description -->
          <div class="pb-4 border-b border-gray-200">
            <label class="text-sm font-semibold text-gray-600">รายละเอียด</label>
            <div class="mt-1 text-sm text-gray-700 bg-gray-50 p-3 rounded max-h-32 overflow-y-auto">
              {{ selectedReport.description }}
            </div>
          </div>

          <!-- Severity Selection -->
          <div class="pb-4 border-b border-gray-200">
            <label class="text-sm font-semibold text-gray-600">ระดับโทษ</label>
            <div class="mt-2 space-y-2">
              <label class="flex items-center cursor-pointer">
                <input v-model="selectedSeverity" type="radio" value="warning" class="mr-2">
                <span class="inline-block px-3 py-2 text-sm font-medium rounded bg-yellow-100 text-yellow-700">
                   เตือน
                </span>
                <span class="ml-2 text-sm text-gray-600">ส่งข้อความเตือนให้ผู้ใช้</span>
              </label>
              <label class="flex items-center cursor-pointer">
                <input v-model="selectedSeverity" type="radio" value="blacklist" class="mr-2">
                <span class="inline-block px-3 py-2 text-sm font-medium rounded bg-red-100 text-red-700">
                   แบน
                </span>
                <span class="ml-2 text-sm text-gray-600">ปิดใช้งานบัญชีตามเลขบัตร ปชช</span>
              </label>
            </div>
          </div>

          <!-- Admin Note -->
          <div class="pb-4">
            <label class="text-sm font-semibold text-gray-600">หมายเหตุของแอดมิน</label>
            <textarea v-model="adminNote" placeholder="พิมพ์หมายเหตุ (จำเป็น)"
              class="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 text-sm"
              rows="3"></textarea>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex gap-3 justify-end pt-4 border-t border-gray-200">
          <button @click="closeReviewModal"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
            ยกเลิก
          </button>
          <button @click="submitReview" :disabled="isSubmittingReview || !selectedSeverity || !adminNote.trim()"
            :class="[
              'px-4 py-2 text-white rounded-md cursor-pointer transition-colors text-sm font-medium',
              selectedSeverity === 'blacklist'
                ? 'bg-red-600 hover:bg-red-700 disabled:bg-red-400'
                : 'bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400'
            ]">
            <span v-if="!isSubmittingReview">
              {{ selectedSeverity === 'blacklist' ? '🚫 แบนบัญชี' : '⚠️ ส่งเตือน' }}
            </span>
            <span v-else>
              <i class="fa-solid fa-spinner fa-spin mr-2"></i>กำลังประมวลผล...
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Remove Blacklist Modal -->
    <ConfirmModal :show="showRemoveBlacklistModal" 
      :title="`ยกเลิกการแบน: ${removingUser?.username || ''}`"
      message="คุณต้องการยกเลิกการแบนบัญชีนี้หรือไม่? ผู้ใช้จะสามารถสมัครใหม่ได้"
      confirmText="ยกเลิกแบน" cancelText="ยกเลิก" variant="success"
      @confirm="confirmRemoveBlacklist" @cancel="cancelRemoveBlacklist" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRuntimeConfig, useCookie } from '#app'
import dayjs from 'dayjs'
import 'dayjs/locale/th'
import buddhistEra from 'dayjs/plugin/buddhistEra'
import AdminHeader from '~/components/admin/AdminHeader.vue'
import AdminSidebar from '~/components/admin/AdminSidebar.vue'
import ConfirmModal from '~/components/ConfirmModal.vue'
import { useToast } from '~/composables/useToast'

dayjs.locale('th')
dayjs.extend(buddhistEra)

definePageMeta({ middleware: ['admin-auth'] })

const { toast } = useToast()

// ========== Reports Tab ==========
const activeTab = ref('reports')
const isLoadingReports = ref(false)
const reports = ref([])
const filtersReports = reactive({
  q: '',
  category: '',
})
const paginationReports = reactive({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
})

const totalPagesReports = computed(() =>
  Math.max(1, paginationReports.totalPages || Math.ceil((paginationReports.total || 0) / (paginationReports.limit || 10)))
)

const pageButtonsReports = computed(() => {
  const total = totalPagesReports.value
  const current = paginationReports.page
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

// ========== Blacklist Tab ==========
const isLoadingBlacklist = ref(false)
const blacklistedUsers = ref([])
const paginationBlacklist = reactive({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
})

const totalPagesBlacklist = computed(() =>
  Math.max(1, paginationBlacklist.totalPages || Math.ceil((paginationBlacklist.total || 0) / (paginationBlacklist.limit || 10)))
)

const pageButtonsBlacklist = computed(() => {
  const total = totalPagesBlacklist.value
  const current = paginationBlacklist.page
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

// ========== Review Modal ==========
const showReviewModal = ref(false)
const selectedReport = ref(null)
const selectedSeverity = ref('warning')
const adminNote = ref('')
const isSubmittingReview = ref(false)

// ========== Remove Blacklist Modal ==========
const showRemoveBlacklistModal = ref(false)
const removingUser = ref(null)
const isRemovingBlacklist = ref(false)

// ========== Computed ==========
const pendingReportsCount = computed(() => paginationReports.total)
const blacklistedCount = computed(() => paginationBlacklist.total)

// ========== Helper Functions ==========
function formatDate(iso) {
  if (!iso) return '-'
  return dayjs(iso).format('D MMM BBBB HH:mm')
}

function categoryLabel(cat) {
  const labels = {
    'behavior': 'พฤติกรรม',
    'safety': 'ความปลอดภัย',
    'fraud': 'การฉ้อโกง',
    'other': 'อื่นๆ'
  }
  return labels[cat] || cat
}

// ========== Reports Functions ==========
async function fetchReports(page = 1) {
  isLoadingReports.value = true
  try {
    const config = useRuntimeConfig()
    const token = useCookie('token').value || (process.client ? localStorage.getItem('token') : '')

    const res = await $fetch('/reports', {
      baseURL: config.public.apiBase,
      headers: { Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      query: {
        page,
        limit: paginationReports.limit,
        status: 'pending',
        ...(filtersReports.q ? { q: filtersReports.q } : {}),
        ...(filtersReports.category ? { category: filtersReports.category } : {}),
      },
    })

    reports.value = res?.data || []
    const p = res?.pagination || {}
    paginationReports.page = Number(p.page ?? page)
    paginationReports.limit = Number(p.limit ?? paginationReports.limit)
    paginationReports.total = Number(p.total ?? reports.value.length)
    paginationReports.totalPages = Number(p.totalPages ?? Math.ceil(paginationReports.total / paginationReports.limit))
  } catch (err) {
    console.error(err)
    toast.error('เกิดข้อผิดพลาด', err?.data?.message || 'ไม่สามารถโหลดรายงานได้')
    reports.value = []
  } finally {
    isLoadingReports.value = false
  }
}

function changePageReports(next) {
  if (next < 1 || next > totalPagesReports.value) return
  fetchReports(next)
}

function applyReportsFilters() {
  paginationReports.page = 1
  fetchReports(1)
}

function clearReportsFilters() {
  filtersReports.q = ''
  filtersReports.category = ''
  paginationReports.page = 1
  fetchReports(1)
}

function openReviewModal(report) {
  selectedReport.value = report
  selectedSeverity.value = 'warning'
  adminNote.value = ''
  showReviewModal.value = true
}

function closeReviewModal() {
  showReviewModal.value = false
  selectedReport.value = null
  selectedSeverity.value = 'warning'
  adminNote.value = ''
}

async function submitReview() {
  if (!selectedReport.value || !selectedSeverity.value || !adminNote.value.trim()) {
    toast.error('ข้อมูลไม่ครบถ้วน', 'กรุณากรอกข้อมูลให้ครบถ้วน')
    return
  }

  isSubmittingReview.value = true
  try {
    const config = useRuntimeConfig()
    const token = useCookie('token').value || (process.client ? localStorage.getItem('token') : '')

    await $fetch(`/reports/${selectedReport.value.id}/review`, {
      baseURL: config.public.apiBase,
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: {
        severity: selectedSeverity.value,
        adminNote: adminNote.value.trim(),
      },
    })

    toast.success('สำเร็จ', selectedSeverity.value === 'blacklist' ? 'แบนบัญชีแล้ว' : 'ส่งเตือนแล้ว')
    closeReviewModal()
    fetchReports(paginationReports.page)
    if (selectedSeverity.value === 'blacklist') {
      fetchBlacklistedUsers(1)
    }
  } catch (err) {
    console.error(err)
    toast.error('เกิดข้อผิดพลาด', err?.data?.message || 'ไม่สามารถประมวลผลได้')
  } finally {
    isSubmittingReview.value = false
  }
}

// ========== Blacklist Functions ==========
async function fetchBlacklistedUsers(page = 1) {
  isLoadingBlacklist.value = true
  try {
    const config = useRuntimeConfig()
    const token = useCookie('token').value || (process.client ? localStorage.getItem('token') : '')

    const res = await $fetch('/reports/blacklist', {
      baseURL: config.public.apiBase,
      headers: { Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      query: {
        page,
        limit: paginationBlacklist.limit,
      },
    })

    blacklistedUsers.value = res?.data || []
    const p = res?.pagination || {}
    paginationBlacklist.page = Number(p.page ?? page)
    paginationBlacklist.limit = Number(p.limit ?? paginationBlacklist.limit)
    paginationBlacklist.total = Number(p.total ?? blacklistedUsers.value.length)
    paginationBlacklist.totalPages = Number(p.totalPages ?? Math.ceil(paginationBlacklist.total / paginationBlacklist.limit))
  } catch (err) {
    console.error(err)
    toast.error('เกิดข้อผิดพลาด', err?.data?.message || 'ไม่สามารถโหลดข้อมูลบัญชีดำได้')
    blacklistedUsers.value = []
  } finally {
    isLoadingBlacklist.value = false
  }
}

function changePageBlacklist(next) {
  if (next < 1 || next > totalPagesBlacklist.value) return
  fetchBlacklistedUsers(next)
}

function askRemoveBlacklist(user) {
  removingUser.value = user
  showRemoveBlacklistModal.value = true
}

function cancelRemoveBlacklist() {
  showRemoveBlacklistModal.value = false
  removingUser.value = null
}

async function confirmRemoveBlacklist() {
  if (!removingUser.value?.id) return

  isRemovingBlacklist.value = true
  try {
    const config = useRuntimeConfig()
    const token = useCookie('token').value || (process.client ? localStorage.getItem('token') : '')

    await $fetch(`/reports/blacklist/${removingUser.value.id}`, {
      baseURL: config.public.apiBase,
      method: 'DELETE',
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    })

    toast.success('สำเร็จ', 'ยกเลิกการแบนแล้ว')
    showRemoveBlacklistModal.value = false
    removingUser.value = null
    
    // 🔄 เทพช์ให้ page เหมาะสม ถ้า item ต่างกว่าจำนวน limit
    const nextPage = blacklistedUsers.value.length - 1 <= 0 && paginationBlacklist.page > 1 
      ? paginationBlacklist.page - 1 
      : paginationBlacklist.page
    
    fetchBlacklistedUsers(nextPage)
  } catch (err) {
    console.error(err)
    toast.error('เกิดข้อผิดพลาด', err?.data?.message || 'ไม่สามารถยกเลิกการแบนได้')
  } finally {
    isRemovingBlacklist.value = false
  }
}

// ========== Global Functions ==========
function defineGlobalScripts() {
  window.closeMobileSidebar = function () {
    const sidebar = document.getElementById('sidebar')
    const overlay = document.getElementById('overlay')
    if (!sidebar || !overlay) return
    sidebar.classList.remove('mobile-open')
    overlay.classList.add('hidden')
  }

  window.toggleMobileSidebar = function () {
    const sidebar = document.getElementById('sidebar')
    const overlay = document.getElementById('overlay')
    if (!sidebar || !overlay) return
    sidebar.classList.toggle('mobile-open')
    overlay.classList.toggle('hidden')
  }

  window.toggleSidebar = function () {
    const sidebar = document.getElementById('sidebar')
    if (!sidebar) return
    sidebar.classList.toggle('collapsed')
    window.__adminResizeHandler__()
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
  fetchReports(1)
  fetchBlacklistedUsers(1)
})

onUnmounted(() => {
  cleanupGlobalScripts()
})
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
