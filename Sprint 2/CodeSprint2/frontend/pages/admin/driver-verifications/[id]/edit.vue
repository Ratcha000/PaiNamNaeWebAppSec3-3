<template>
  <div>
    <AdminHeader />
    <AdminSidebar />

    <main id="main-content" class="main-content mt-16 ml-0 lg:ml-[280px] p-6 min-h-screen">
      <div class="max-w-6xl mx-auto">
        <!-- Back button -->
        <div class="mb-8">
          <NuxtLink
            to="/admin/driver-verifications"
            class="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <i class="fa-solid fa-arrow-left"></i>
            <span>ย้อนกลับ</span>
          </NuxtLink>
        </div>

        <!-- Title -->
        <div class="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-3">
            <h1 class="text-2xl font-semibold text-gray-800">แก้ไขคำขอยืนยันตัวตน (แอดมิน)</h1>
            <span class="text-sm text-gray-500">ปรับข้อมูล/อัปโหลดภาพ และอัปเดตสถานะคำขอนี้</span>
          </div>
        </div>

        <!-- Card -->
        <div class="flex w-full overflow-hidden bg-white border border-gray-300 rounded-lg shadow-lg">
          <main class="flex-1 p-8">
            <!-- Loading / Error -->
            <div v-if="isLoading" class="p-8 text-center text-gray-500">กำลังโหลดข้อมูล...</div>
            <div v-else-if="loadError" class="p-8 text-center text-red-600">{{ loadError }}</div>

            <!-- Form -->
            <form v-else @submit.prevent="handleSubmit" novalidate class="space-y-8">
              <!-- STEP 0: เจ้าของคำขอ (อ่านอย่างเดียว) -->
              <div class="mb-2">
                <div class="flex items-center mb-4">
                  <div class="mr-4 step-indicator">0</div>
                  <h2 class="text-xl font-semibold text-gray-800">
                    เจ้าของคำขอยืนยันตัวตน
                    <span class="px-2 py-1 ml-2 text-xs text-gray-600 align-middle bg-gray-100 rounded-full">
                      ไม่สามารถแก้ไขเจ้าของคำขอได้
                    </span>
                  </h2>
                </div>

                <label class="block mb-2 text-sm font-medium text-gray-700">ผู้ใช้</label>
                <input
                  :value="dv?.user ? `${dv.user.firstName || ''} ${dv.user.lastName || ''} (${dv.user.email})` : '-'"
                  type="text"
                  class="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg bg-gray-50"
                  disabled
                />
              </div>

              <!-- STEP 1: รูปบัตรขับขี่ -->
              <div class="relative">
                <div class="flex items-center mb-6">
                  <div class="mr-4 step-indicator">1</div>
                  <label class="text-xl font-semibold text-gray-800">
                    รูปบัตรขับขี่ประจำตัว (ด้านหน้า)
                  </label>
                </div>

                <div class="grid gap-6 mb-2 md:grid-cols-2">
                  <!-- preview ปัจจุบัน -->
                  <div class="space-y-4">
                    <h4 class="text-sm font-medium text-gray-700">ไฟล์ปัจจุบัน:</h4>
                    <div class="relative flex items-center justify-center h-40 p-4 border border-gray-300 rounded-lg upload-zone bg-gray-50">
                      <template v-if="dv?.licensePhotoUrl && !licenseFrontPreview">
                        <a :href="dv.licensePhotoUrl" target="_blank" class="block w-full h-full">
                          <img :src="dv.licensePhotoUrl" class="object-contain w-full h-full rounded-md" alt="license" />
                        </a>
                      </template>
                      <template v-else-if="licenseFrontPreview">
                        <img :src="licenseFrontPreview" class="object-contain w-full h-full rounded-md" />
                        <button
                          type="button"
                          @click="removeImage('front')"
                          class="absolute flex items-center justify-center w-8 h-8 text-white rounded-full top-2 right-2 bg-black/50"
                        >×</button>
                      </template>
                      <template v-else>
                        <div class="text-sm text-gray-500">ไม่มีรูป</div>
                      </template>
                    </div>
                  </div>

                  <!-- อัปโหลดใหม่ -->
                  <div
                    class="relative flex items-center justify-center h-40 p-8 border-2 border-gray-300 border-dashed rounded-lg upload-zone bg-gray-50 hover:bg-gray-100 hover:border-blue-400"
                  >
                    <div class="text-center pointer-events-none">
                      <i class="mb-2 text-3xl text-gray-400 fa-solid fa-cloud-arrow-up"></i>
                      <p class="text-lg text-gray-600">คลิกเพื่ออัปโหลด</p>
                      <p class="text-sm text-gray-500">JPG, PNG (ไม่เกิน 10MB)</p>
                    </div>
                    <input
                      id="license-front-input"
                      type="file"
                      accept="image/png, image/jpeg"
                      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      @change="handleFileUpload($event, 'front')"
                    />
                  </div>
                </div>
              </div>

              <!-- STEP 2: Selfie -->
              <div class="relative">
                <div class="flex items-center mb-6">
                  <div class="mr-4 step-indicator">2</div>
                  <label class="text-xl font-semibold text-gray-800">
                    รูปถ่าย (Selfie)
                  </label>
                </div>

                <div class="grid gap-6 mb-2 md:grid-cols-2">
                  <!-- preview ปัจจุบัน -->
                  <div class="space-y-4">
                    <h4 class="text-sm font-medium text-gray-700">ไฟล์ปัจจุบัน:</h4>
                    <div class="relative flex items-center justify-center h-40 p-4 border border-gray-300 rounded-lg upload-zone bg-gray-50">
                      <template v-if="dv?.selfiePhotoUrl && !licenseSelfiePreview">
                        <a :href="dv.selfiePhotoUrl" target="_blank" class="block w-full h-full">
                          <img :src="dv.selfiePhotoUrl" class="object-contain w-full h-full rounded-md" alt="selfie" />
                        </a>
                      </template>
                      <template v-else-if="licenseSelfiePreview">
                        <img :src="licenseSelfiePreview" class="object-contain w-full h-full rounded-md" />
                        <button
                          type="button"
                          @click="removeImage('selfie')"
                          class="absolute flex items-center justify-center w-8 h-8 text-white rounded-full top-2 right-2 bg-black/50"
                        >×</button>
                      </template>
                      <template v-else>
                        <div class="text-sm text-gray-500">ไม่มีรูป</div>
                      </template>
                    </div>
                  </div>

                  <!-- อัปโหลดใหม่ -->
                  <div
                    class="relative flex items-center justify-center h-40 p-8 border-2 border-gray-300 border-dashed rounded-lg upload-zone bg-gray-50 hover:bg-gray-100 hover:border-blue-400"
                  >
                    <div class="text-center pointer-events-none">
                      <i class="mb-2 text-3xl text-gray-400 fa-solid fa-cloud-arrow-up"></i>
                      <p class="text-lg text-gray-600">คลิกเพื่ออัปโหลด</p>
                      <p class="text-sm text-gray-500">JPG, PNG (ไม่เกิน 10MB)</p>
                    </div>
                    <input
                      id="license-selfie-input"
                      type="file"
                      accept="image/png, image/jpeg"
                      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      @change="handleFileUpload($event, 'selfie')"
                    />
                  </div>
                </div>
              </div>

              <!-- STEP 3: ข้อมูลบนบัตร -->
              <div class="relative">
                <div class="flex items-center mb-4">
                  <div class="mr-4 step-indicator">3</div>
                  <h2 class="text-xl font-semibold text-gray-800">ข้อมูลในบัตรขับขี่ประจำตัว</h2>
                </div>

                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label class="block mb-2 text-sm font-medium text-gray-700">เลขที่ใบขับขี่ <span class="text-red-500">*</span></label>
                    <input v-model.trim="form.licenseNumber" type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                  </div>

                  <div>
                    <label class="block mb-2 text-sm font-medium text-gray-700">ชนิดของบัตรขับขี่ <span class="text-red-500">*</span></label>
                    <select v-model="form.typeOnLicense"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                      <option disabled value="">กรุณาเลือกชนิดของบัตร</option>
                      <option value="PRIVATE_CAR_TEMPORARY">รถยนต์ส่วนบุคคลชั่วคราว (2 ปี)</option>
                      <option value="PRIVATE_CAR">รถยนต์ส่วนบุคคล (5 ปี)</option>
                      <option value="PUBLIC_CAR">รถยนต์สาธารณะ</option>
                      <option value="LIFETIME">ตลอดชีพ</option>
                    </select>
                  </div>

                  <div>
                    <label class="block mb-2 text-sm font-medium text-gray-700">ชื่อ (บนบัตร) <span class="text-red-500">*</span></label>
                    <input v-model.trim="form.firstNameOnLicense" type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                  </div>

                  <div>
                    <label class="block mb-2 text-sm font-medium text-gray-700">นามสกุล (บนบัตร) <span class="text-red-500">*</span></label>
                    <input v-model.trim="form.lastNameOnLicense" type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                  </div>

                  <div>
                    <label class="block mb-2 text-sm font-medium text-gray-700">วันออกใบขับขี่ <span class="text-red-500">*</span></label>
                    <input v-model="form.licenseIssueDate" type="date"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                  </div>

                  <div>
                    <label class="block mb-2 text-sm font-medium text-gray-700">วันหมดอายุใบขับขี่ <span class="text-red-500">*</span></label>
                    <input v-model="form.licenseExpiryDate" type="date"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                  </div>
                </div>
              </div>

              <div class="flex justify-end gap-4 pt-6">
                <button
                  type="button"
                  @click="resetLocalImages"
                  :disabled="isSubmitting"
                  class="px-6 py-3 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50"
                >
                  ล้างรูปที่อัปโหลด
                </button>
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="flex items-center px-6 py-3 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  <svg v-if="isSubmitting" class="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  บันทึกการแก้ไข
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>
    </main>

    <div id="overlay" class="fixed inset-0 z-40 hidden bg-black bg-opacity-50 lg:hidden" @click="closeMobileSidebar"></div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRoute, useRuntimeConfig, useCookie } from '#app'
import AdminHeader from '~/components/admin/AdminHeader.vue'
import AdminSidebar from '~/components/admin/AdminSidebar.vue'
import { useToast } from '~/composables/useToast'

definePageMeta({ middleware: ['admin-auth'] })
useHead({
  title: 'Edit Driver Verification • Admin',
  link: [{ rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css' }]
})

const { toast } = useToast()

/* route */
const route = useRoute()
const dvId = route.params.id

/* state */
const isLoading = ref(true)
const loadError = ref('')
const dv = ref(null)

const form = reactive({
  licenseNumber: '',
  firstNameOnLicense: '',
  lastNameOnLicense: '',
  typeOnLicense: '',
  licenseIssueDate: '',
  licenseExpiryDate: '',
})

const files = reactive({
  licenseFrontFile: /** @type {File|null} */(null),
  licenseSelfieFile: /** @type {File|null} */(null),
})
const licenseFrontPreview = ref(null)
const licenseSelfiePreview = ref(null)

const isSubmitting = ref(false)

onMounted(async () => {
  defineGlobalScripts()
  if (typeof window.__adminResizeHandler__ === 'function') window.__adminResizeHandler__()
  await fetchDV()
})
onUnmounted(() => cleanupGlobalScripts())

/* ---------- Fetch current DV ---------- */
async function fetchDV() {
  isLoading.value = true
  loadError.value = ''
  try {
    const config = useRuntimeConfig()
    const token = useCookie('token').value || (process.client ? localStorage.getItem('token') : '')
    const res = await $fetch(`/driver-verifications/admin/${dvId}`, {
      baseURL: config.public.apiBase,
      headers: { Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
    })
    dv.value = res?.data || null

    // seed form
    form.licenseNumber = dv.value?.licenseNumber || ''
    form.firstNameOnLicense = dv.value?.firstNameOnLicense || ''
    form.lastNameOnLicense = dv.value?.lastNameOnLicense || ''
    form.typeOnLicense = dv.value?.typeOnLicense || ''
    form.licenseIssueDate = dv.value?.licenseIssueDate ? toDateInput(dv.value.licenseIssueDate) : ''
    form.licenseExpiryDate = dv.value?.licenseExpiryDate ? toDateInput(dv.value.licenseExpiryDate) : ''
  } catch (err) {
    console.error('Fetch DV error:', err)
    loadError.value = err?.data?.message || 'ไม่สามารถโหลดข้อมูลได้'
  } finally {
    isLoading.value = false
  }
}

function toDateInput(iso) {
  const d = new Date(iso)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

/* ---------- File handlers ---------- */
function handleFileUpload(e, type) {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    if (type === 'front') {
      licenseFrontPreview.value = ev.target.result
      files.licenseFrontFile = file
    } else {
      licenseSelfiePreview.value = ev.target.result
      files.licenseSelfieFile = file
    }
  }
  reader.readAsDataURL(file)
}
function removeImage(type) {
  if (type === 'front') {
    licenseFrontPreview.value = null
    files.licenseFrontFile = null
    const el = document.getElementById('license-front-input'); if (el) el.value = ''
  } else {
    licenseSelfiePreview.value = null
    files.licenseSelfieFile = null
    const el = document.getElementById('license-selfie-input'); if (el) el.value = ''
  }
}
function resetLocalImages() {
  removeImage('front')
  removeImage('selfie')
}

/* ---------- Submit (PUT /driver-verifications/admin/:id) ---------- */
async function handleSubmit() {
  isSubmitting.value = true
  try {
    const data = new FormData()

    // ส่งเฉพาะ field ที่เปลี่ยน/มีค่า
    if (form.licenseNumber !== dv.value?.licenseNumber) data.append('licenseNumber', form.licenseNumber)
    if (form.firstNameOnLicense !== dv.value?.firstNameOnLicense) data.append('firstNameOnLicense', form.firstNameOnLicense)
    if (form.lastNameOnLicense !== dv.value?.lastNameOnLicense) data.append('lastNameOnLicense', form.lastNameOnLicense)
    if (form.typeOnLicense && form.typeOnLicense !== dv.value?.typeOnLicense) data.append('typeOnLicense', form.typeOnLicense)

    if (form.licenseIssueDate) data.append('licenseIssueDate', new Date(form.licenseIssueDate).toISOString())
    if (form.licenseExpiryDate) data.append('licenseExpiryDate', new Date(form.licenseExpiryDate).toISOString())

    if (files.licenseFrontFile) data.append('licensePhotoUrl', files.licenseFrontFile)
    if (files.licenseSelfieFile) data.append('selfiePhotoUrl', files.licenseSelfieFile)

    const config = useRuntimeConfig()
    const token = useCookie('token').value || (process.client ? localStorage.getItem('token') : '')
    await $fetch(`/driver-verifications/admin/${dvId}`, {
      baseURL: config.public.apiBase,
      method: 'PUT',
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: data
    })

    toast.success('บันทึกสำเร็จ', 'แก้ไขข้อมูลยืนยันตัวตนเรียบร้อย')
    navigateTo(`/admin/driver-verifications/${dvId}`).catch(() => {})
  } catch (err) {
    console.error('Update DV (admin) error:', err)
    const msg = err?.data?.message || 'บันทึกการแก้ไขไม่สำเร็จ'
    toast.error('เกิดข้อผิดพลาด', msg)
  } finally {
    isSubmitting.value = false
  }
}

/* ---------- Layout helpers (เหมือนหน้า create) ---------- */
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
  window.removeEventListener('resize', window.__adminResizeHandler__ || (() => {}))
  delete window.toggleSidebar
  delete window.toggleMobileSidebar
  delete window.toggleSubmenu
  delete window.__adminResizeHandler__
}
</script>

<style scoped>
/* ====== ยกสไตล์หลักจากหน้า create ====== */
.upload-zone { transition: all 0.3s ease; cursor: pointer; }
.upload-zone:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.15); }

.step-indicator {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.main-content { transition: margin-left 0.3s ease; }
@media (max-width:1024px) { .main-content { margin-left: 0 !important; } }
</style>
