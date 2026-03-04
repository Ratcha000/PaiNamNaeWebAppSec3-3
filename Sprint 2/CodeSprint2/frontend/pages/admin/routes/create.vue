<template>
    <div>
        <AdminHeader />
        <AdminSidebar />

        <main id="main-content" class="main-content mt-16 ml-0 lg:ml-[280px] p-6 min-h-screen">
            <div class="mx-auto max-w-7xl">
                <!-- Back -->
                <div class="mb-8">
                    <NuxtLink to="/admin/routes"
                        class="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                        <i class="fa-solid fa-arrow-left"></i>
                        <span>ย้อนกลับ</span>
                    </NuxtLink>
                </div>

                <!-- Title -->
                <div class="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div class="flex items-center gap-3">
                        <h1 class="text-2xl font-semibold text-gray-800">สร้างเส้นทาง (แอดมิน)</h1>
                        <span class="text-sm text-gray-500">กรอกข้อมูลเส้นทาง เลือกผู้ขับ และรถที่ใช้</span>
                    </div>
                </div>

                <!-- Card -->
                <div class="flex w-full overflow-hidden bg-white border border-gray-300 rounded-lg shadow-lg">
                    <main class="flex-1 p-8 space-y-8">
                        <!-- SECTION: ผู้ขับขี่ / รถ (ตำแหน่งอ้างอิงจากหน้า detail > ผู้ขับขี่/รถ) -->
                        <section>
                            <h3 class="mb-3 text-sm font-semibold text-gray-700">ผู้ขับขี่และรถ</h3>

                            <!-- Driver search (เหมือน DV) -->
                            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div class="relative">
                                    <label class="block mb-2 text-sm font-medium text-gray-700">
                                        เลือกผู้ขับขี่ (ค้นหา: อีเมล / ชื่อ / Username) <span
                                            class="text-red-500">*</span>
                                    </label>
                                    <input v-model.trim="driverQuery" @input="onSearchDrivers" type="text"
                                        placeholder="เช่น user@example.com หรือ User"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    <div v-if="showDriverList"
                                        class="absolute z-20 w-full mt-1 overflow-auto bg-white border rounded-md shadow max-h-60">
                                        <button v-for="u in driverResults" :key="u.id" type="button"
                                            @click="selectDriver(u)"
                                            class="w-full px-3 py-2 text-left hover:bg-blue-50">
                                            <div class="text-sm font-medium text-gray-800">
                                                {{ u.firstName }} {{ u.lastName }}
                                                <span v-if="u.username" class="text-xs text-gray-500">(@{{ u.username
                                                    }})</span>
                                            </div>
                                            <div class="text-xs text-gray-500">{{ u.email }}</div>
                                        </button>
                                        <div v-if="!isSearchingDrivers && driverResults.length === 0"
                                            class="px-3 py-2 text-sm text-gray-500">
                                            ไม่พบผู้ใช้ที่ตรงกับคำค้น
                                        </div>
                                    </div>
                                    <p v-if="!form.driverId" class="mt-2 text-xs text-amber-600">*
                                        ต้องเลือกผู้ขับจากรายการ</p>
                                </div>

                                <!-- Vehicle (โหลดตาม driverId) -->
                                <div class="relative">
                                    <label class="block mb-2 text-sm font-medium text-gray-700">
                                        เลือกรถของผู้ขับ <span class="text-red-500">*</span>
                                    </label>
                                    <input v-model.trim="vehicleQuery" @focus="openVehicleList = true"
                                        @input="filterVehicleLocal" type="text" :disabled="!form.driverId"
                                        placeholder="ค้นหาด้วย รุ่น/ป้ายทะเบียน"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" />
                                    <div v-if="openVehicleList && form.driverId"
                                        class="absolute z-20 w-full mt-1 overflow-auto bg-white border rounded-md shadow max-h-60">
                                        <button v-for="v in vehicleFiltered" :key="v.id" type="button"
                                            @click="selectVehicle(v)"
                                            class="w-full px-3 py-2 text-left hover:bg-blue-50">
                                            <div class="text-sm font-medium text-gray-800">
                                                {{ v.vehicleModel }} <span class="text-xs text-gray-500">({{
                                                    v.vehicleType }})</span>
                                            </div>
                                            <div class="text-xs text-gray-500">
                                                {{ v.licensePlate || '— ไม่มีป้าย —' }}
                                            </div>
                                        </button>
                                        <div v-if="!isLoadingVehicles && vehicleFiltered.length === 0"
                                            class="px-3 py-2 text-sm text-gray-500">
                                            ไม่มีรถในรายการ
                                        </div>
                                    </div>
                                    <p v-if="!form.vehicleId" class="mt-2 text-xs text-amber-600">* ต้องเลือกรถจากรายการ
                                    </p>
                                </div>
                            </div>
                        </section>

                        <!-- SECTION: แผนที่เส้นทาง (อ้างอิงตำแหน่งจาก detail: แสดงบนสุดก่อนฟิลด์เส้นทาง) -->
                        <section>
                            <h3 class="mb-3 text-sm font-semibold text-gray-700">แผนที่เส้นทาง</h3>
                            <div class="overflow-hidden border border-gray-300 rounded-lg">
                                <div ref="mapEl" class="w-full" style="height: 360px;"></div>
                            </div>
                        </section>

                        <!-- SECTION: เส้นทาง (ต้นทาง/ปลายทาง) -->
                        <section>
                            <h3 class="mb-3 text-sm font-semibold text-gray-700">เส้นทาง</h3>
                            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <!-- Start -->
                                <div>
                                    <label class="block mb-1 text-xs font-medium text-gray-600">จุดเริ่มต้น <span
                                            class="text-red-500">*</span></label>
                                    <div class="relative">
                                        <input ref="startInputEl" v-model="startName" type="text"
                                            placeholder="พิมพ์ชื่อสถานที่ หรือใช้ปุ่มปักหมุด"
                                            class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        <button type="button" @click="openPicker('start')"
                                            class="absolute inset-y-0 my-auto text-gray-500 right-2 hover:text-blue-600"
                                            title="เลือกจากแผนที่">
                                            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                                <path
                                                    d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                                            </svg>
                                        </button>
                                    </div>
                                    <p class="mt-1 text-xs text-gray-500 truncate" v-if="form.startLocation.address">
                                        {{ form.startLocation.address }} ({{ form.startLocation.lat }}, {{
                                        form.startLocation.lng }})
                                    </p>
                                </div>
                                <!-- End -->
                                <div>
                                    <label class="block mb-1 text-xs font-medium text-gray-600">จุดปลายทาง <span
                                            class="text-red-500">*</span></label>
                                    <div class="relative">
                                        <input ref="endInputEl" v-model="endName" type="text"
                                            placeholder="พิมพ์ชื่อสถานที่ หรือใช้ปุ่มปักหมุด"
                                            class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        <button type="button" @click="openPicker('end')"
                                            class="absolute inset-y-0 my-auto text-gray-500 right-2 hover:text-blue-600"
                                            title="เลือกจากแผนที่">
                                            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                                <path
                                                    d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                                            </svg>
                                        </button>
                                    </div>
                                    <p class="mt-1 text-xs text-gray-500 truncate" v-if="form.endLocation.address">
                                        {{ form.endLocation.address }} ({{ form.endLocation.lat }}, {{
                                        form.endLocation.lng }})
                                    </p>
                                </div>
                            </div>
                        </section>

                        <!-- SECTION: จุดแวะระหว่างทาง -->
                        <section>
                            <h3 class="mb-3 text-sm font-semibold text-gray-700">จุดแวะระหว่างทาง</h3>
                            <div class="space-y-3">
                                <div v-for="(w, idx) in form.waypoints" :key="idx"
                                    class="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
                                    <div class="relative">
                                        <input :ref="el => (waypointInputs[idx] = el)" v-model="waypointNames[idx]"
                                            type="text" placeholder="ชื่อสถานที่ / ที่อยู่"
                                            class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        <button type="button" @click="openPicker('waypoint', idx)"
                                            class="absolute inset-y-0 my-auto text-gray-500 right-2 hover:text-blue-600"
                                            title="เลือกจากแผนที่">
                                            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                                <path
                                                    d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                                            </svg>
                                        </button>
                                        <p class="mt-1 text-xs text-gray-500 truncate" v-if="w.address">
                                            {{ w.address }} ({{ w.lat }}, {{ w.lng }})
                                        </p>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <button type="button" @click="removeWaypoint(idx)"
                                            class="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                                            ลบ
                                        </button>
                                    </div>
                                </div>

                                <button type="button" @click="addWaypoint"
                                    class="px-4 py-2 text-blue-700 border border-blue-600 rounded-md hover:bg-blue-50">
                                    + เพิ่มจุดแวะ
                                </button>
                            </div>
                        </section>

                        <!-- SECTION: เวลา / ราคา / ที่นั่ง -->
                        <section>
                            <h3 class="mb-3 text-sm font-semibold text-gray-700">เวลา ราคา และความพร้อมที่นั่ง</h3>
                            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div>
                                    <label class="block mb-1 text-xs font-medium text-gray-600">วัน-เวลาออกเดินทาง <span
                                            class="text-red-500">*</span></label>
                                    <input v-model="departureLocal" type="datetime-local"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label class="block mb-1 text-xs font-medium text-gray-600">ราคา / ที่นั่ง (บาท)
                                        <span class="text-red-500">*</span></label>
                                    <input v-model.number="form.pricePerSeat" type="number" min="0"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label class="block mb-1 text-xs font-medium text-gray-600">ที่นั่งคงเหลือ <span
                                            class="text-red-500">*</span></label>
                                    <input v-model.number="form.availableSeats" type="number" min="1"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                        </section>

                        <!-- SECTION: เงื่อนไข -->
                        <section>
                            <h3 class="mb-3 text-sm font-semibold text-gray-700">เงื่อนไขการเดินทาง</h3>
                            <textarea v-model="form.conditions" rows="4"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="พิมพ์เงื่อนไข เช่น งดเปิดเพลงเสียงดัง, ไม่สูบบุหรี่ในรถ ฯลฯ"></textarea>
                        </section>

                        <!-- Actions (อ้างอิงปุ่มจาก DV) -->
                        <div class="flex justify-end gap-4 pt-2">
                            <button type="button" @click="handleCancel" :disabled="isSubmitting"
                                class="px-6 py-3 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50">
                                ยกเลิก
                            </button>
                            <button type="button" @click="handleCreate" :disabled="!canSubmit || isSubmitting"
                                class="flex items-center px-6 py-3 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed">
                                <svg v-if="isSubmitting" class="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4" />
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                {{ isSubmitting ? 'กำลังสร้าง...' : 'สร้างเส้นทาง' }}
                            </button>
                        </div>
                    </main>
                </div>
            </div>
        </main>

        <!-- Overlay (มือถือ) -->
        <div id="overlay" class="fixed inset-0 z-40 hidden bg-black bg-opacity-50 lg:hidden"
            @click="closeMobileSidebar"></div>

        <!-- Modal: Map Picker -->
        <transition name="modal-fade">
            <div v-if="showPicker" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
                @click.self="closePicker">
                <div class="bg-white rounded-lg w-[95%] max-w-3xl overflow-hidden">
                    <div class="flex items-center justify-between p-4 border-b border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-900">
                            เลือก{{ pickerTarget === 'start' ? 'จุดเริ่มต้น' : pickerTarget === 'end' ? 'จุดปลายทาง' :
                            'จุดแวะ' }}
                        </h3>
                        <button @click="closePicker" class="text-gray-400 hover:text-gray-600">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <div class="p-0">
                        <div ref="pickerMapEl" class="w-full" style="height: 65vh;"></div>
                        <div class="flex items-center justify-between p-4 border-t border-gray-200">
                            <div class="text-sm text-gray-700 truncate">
                                <span class="font-medium">ตำแหน่ง:</span>
                                <span class="truncate">{{ picked.name || '— ยังไม่เลือก —' }}</span>
                            </div>
                            <button
                                class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                :disabled="!picked.name" @click="applyPicked">
                                ใช้ตำแหน่งนี้
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useRuntimeConfig, useCookie } from '#app'
import AdminHeader from '~/components/admin/AdminHeader.vue'
import AdminSidebar from '~/components/admin/AdminSidebar.vue'
import { useToast } from '~/composables/useToast'

definePageMeta({ middleware: ['admin-auth'] })
useHead({
    title: 'Create Route • Admin',
    link: [{ rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css' }]
})

const { toast } = useToast()
const config = useRuntimeConfig()
const token = useCookie('token')?.value || (process.client ? localStorage.getItem('token') : '')

/* ====================== Driver & Vehicle (แบบ DV) ====================== */
const driverQuery = ref('')
const driverResults = ref([])
const isSearchingDrivers = ref(false)
const lastDriverLabel = ref('')
const form = reactive({
    driverId: '',
    vehicleId: '',
    startLocation: { lat: null, lng: null, name: '', address: '' },
    endLocation: { lat: null, lng: null, name: '', address: '' },
    waypoints: [],
    departureTime: '', // ISO
    availableSeats: 1,
    pricePerSeat: 0,
    conditions: ''
})
const showDriverList = computed(() => driverQuery.value && (isSearchingDrivers.value || driverResults.value.length > 0))

let userSearchTimer = null
async function onSearchDrivers() {
    if (driverQuery.value !== lastDriverLabel.value) form.driverId = ''
    clearTimeout(userSearchTimer)
    const q = driverQuery.value.trim()
    if (!q) { driverResults.value = []; return }
    userSearchTimer = setTimeout(async () => {
        try {
            isSearchingDrivers.value = true
            const res = await $fetch('/users/admin', {
                baseURL: config.public.apiBase,
                headers: { Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                query: { q, page: 1, limit: 10 }
            })
            driverResults.value = res?.data || []
        } catch (e) {
            driverResults.value = []
        } finally {
            isSearchingDrivers.value = false
        }
    }, 300)
}
function selectDriver(u) {
    form.driverId = u.id
    const label = `${u.firstName || ''} ${u.lastName || ''} (@${u.username || ''})`.trim()
    driverQuery.value = label
    lastDriverLabel.value = label
    driverResults.value = []
    // load vehicles for this driver
    loadVehiclesForDriver(u.id)
}

/* Vehicles */
const vehicleQuery = ref('')
const openVehicleList = ref(false)
const isLoadingVehicles = ref(false)
const vehicles = ref([])
const vehicleFiltered = ref([])
async function loadVehiclesForDriver(driverId) {
    if (!driverId) return
    try {
        isLoadingVehicles.value = true
        const res = await $fetch(`/vehicles/admin/user/${driverId}`, {
            baseURL: config.public.apiBase,
            headers: { Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
        })
        vehicles.value = res?.data || res || []
        vehicleFiltered.value = vehicles.value
        vehicleQuery.value = ''
        form.vehicleId = ''
    } catch (e) {
        vehicles.value = []
        vehicleFiltered.value = []
        form.vehicleId = ''
    } finally {
        isLoadingVehicles.value = false
    }
}
function filterVehicleLocal() {
    const q = vehicleQuery.value.trim().toLowerCase()
    vehicleFiltered.value = vehicles.value.filter(v =>
        (v.vehicleModel || '').toLowerCase().includes(q) ||
        (v.licensePlate || '').toLowerCase().includes(q) ||
        (v.vehicleType || '').toLowerCase().includes(q)
    )
}
function selectVehicle(v) {
    form.vehicleId = v.id
    vehicleQuery.value = `${v.vehicleModel} (${v.licensePlate || '—'})`
    openVehicleList.value = false
}

/* ====================== Map & Place Picker (อิง findTrip) ====================== */
const GMAPS_CB = '__gmapsReadyAdminCreateRoute__'
const mapEl = ref(null)
let gmap = null, geocoder = null, placesService = null
let startMarker = null, endMarker = null, waypointMarkers = []
let activePolyline = null
const mapReady = ref(false)

const startInputEl = ref(null)
const endInputEl = ref(null)
const waypointInputs = reactive([])
let startAC = null, endAC = null, waypointACs = []

// modal picker
const showPicker = ref(false)
const pickerMapEl = ref(null)
let pickerMap = null, pickerMarker = null
const pickerTarget = ref(/** @type {'start'|'end'|'waypoint'|null} */(null))
const pickerIndex = ref(-1)
const picked = ref({ name: '', lat: null, lng: null, address: '' })

const startName = ref('')
const endName = ref('')
const waypointNames = reactive([])

function useHeadScript() {
    if (process.client && !window.google?.maps) {
        const s = document.createElement('script')
        s.src = `https://maps.googleapis.com/maps/api/js?key=${config.public.googleMapsApiKey}&libraries=places,geometry&callback=${GMAPS_CB}`
        s.async = true; s.defer = true
        window[GMAPS_CB] = () => {
            try { delete window[GMAPS_CB] } catch { }
            initMap()
            initAutocomplete()
        }
        document.head.appendChild(s)
    } else if (process.client) {
        initMap()
        initAutocomplete()
    }
}
function initMap() {
    if (!mapEl.value || gmap) return
    gmap = new google.maps.Map(mapEl.value, {
        center: { lat: 13.7563, lng: 100.5018 }, zoom: 6,
        mapTypeControl: false, streetViewControl: false, fullscreenControl: true
    })
    geocoder = new google.maps.Geocoder()
    placesService = new google.maps.places.PlacesService(gmap)
    mapReady.value = true
    setTimeout(() => google.maps.event.trigger(gmap, 'resize'), 0)
    redrawMap()
}
function initAutocomplete() {
    if (!window.google?.maps?.places) return
    const opts = { fields: ['place_id', 'name', 'formatted_address', 'geometry'], types: ['geocode', 'establishment'] }
    if (startInputEl.value) {
        startAC = new google.maps.places.Autocomplete(startInputEl.value, opts)
        startAC.addListener('place_changed', () => {
            const p = startAC.getPlace()
            applyPlaceTo('start', p)
        })
    }
    if (endInputEl.value) {
        endAC = new google.maps.places.Autocomplete(endInputEl.value, opts)
        endAC.addListener('place_changed', () => {
            const p = endAC.getPlace()
            applyPlaceTo('end', p)
        })
    }
}
function ensureWaypointAC(idx) {
    if (!window.google?.maps?.places) return
    const el = waypointInputs[idx]
    if (!el) return
    const opts = { fields: ['place_id', 'name', 'formatted_address', 'geometry'], types: ['geocode', 'establishment'] }
    waypointACs[idx]?.unbindAll?.()
    waypointACs[idx] = new google.maps.places.Autocomplete(el, opts)
    waypointACs[idx].addListener('place_changed', () => {
        const p = waypointACs[idx].getPlace()
        applyPlaceTo('waypoint', p, idx)
    })
}

function applyPlaceTo(target, place, idx = -1) {
    if (!place) return
    const lat = place.geometry?.location?.lat?.()
    const lng = place.geometry?.location?.lng?.()
    const name = place.name || place.formatted_address || ''
    const address = cleanAddr(place.formatted_address || '')

    if (target === 'start') {
        startName.value = name
        form.startLocation = { lat, lng, name, address }
    } else if (target === 'end') {
        endName.value = name
        form.endLocation = { lat, lng, name, address }
    } else if (target === 'waypoint' && idx > -1) {
        waypointNames[idx] = name
        form.waypoints[idx] = { lat, lng, name, address }
    }
    redrawMap()
}

function redrawMap() {
    if (!gmap) return
    // clear
    startMarker?.setMap(null); startMarker = null
    endMarker?.setMap(null); endMarker = null
    waypointMarkers.forEach(m => m.setMap(null)); waypointMarkers = []
    activePolyline?.setMap(null); activePolyline = null

    const bounds = new google.maps.LatLngBounds()
    if (form.startLocation.lat && form.startLocation.lng) {
        startMarker = new google.maps.Marker({ position: form.startLocation, map: gmap, label: 'A' })
        bounds.extend(new google.maps.LatLng(form.startLocation.lat, form.startLocation.lng))
    }
    if (form.endLocation.lat && form.endLocation.lng) {
        endMarker = new google.maps.Marker({ position: form.endLocation, map: gmap, label: 'B' })
        bounds.extend(new google.maps.LatLng(form.endLocation.lat, form.endLocation.lng))
    }
    if (form.waypoints.length) {
        waypointMarkers = form.waypoints.filter(Boolean).map((w, i) => new google.maps.Marker({
            position: { lat: w.lat, lng: w.lng },
            map: gmap,
            icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            title: w.name || w.address || `จุดแวะ ${i + 1}`
        }))
        form.waypoints.forEach(w => {
            if (w?.lat != null && w?.lng != null) bounds.extend(new google.maps.LatLng(w.lat, w.lng))
        })
    }
    if (!bounds.isEmpty()) {
        gmap.fitBounds(bounds)
        setTimeout(() => { google.maps.event.trigger(gmap, 'resize'); gmap.fitBounds(bounds) }, 0)
    }
}

/* Picker */
function openPicker(target, idx = -1) {
    pickerTarget.value = target
    pickerIndex.value = idx
    picked.value = { name: '', lat: null, lng: null, address: '' }
    showPicker.value = true
    nextTick(() => {
        const center =
            target === 'start' && form.startLocation.lat ? { lat: form.startLocation.lat, lng: form.startLocation.lng } :
                target === 'end' && form.endLocation.lat ? { lat: form.endLocation.lat, lng: form.endLocation.lng } :
                    (idx > -1 && form.waypoints[idx]?.lat) ? { lat: form.waypoints[idx].lat, lng: form.waypoints[idx].lng } :
                        { lat: 13.7563, lng: 100.5018 }
        pickerMap = new google.maps.Map(pickerMapEl.value, {
            center, zoom: center.lat ? 14 : 6, mapTypeControl: false, streetViewControl: false, fullscreenControl: false
        })
        pickerMap.addListener('click', e => setPicker(e.latLng))
    })
}
function setPicker(latlng) {
    if (pickerMarker) pickerMarker.setPosition(latlng)
    else {
        pickerMarker = new google.maps.Marker({ position: latlng, map: pickerMap, draggable: true })
        pickerMarker.addListener('dragend', e => resolvePicked(e.latLng))
    }
    resolvePicked(latlng)
}
async function resolvePicked(latlng) {
    const lat = latlng.lat(), lng = latlng.lng()
    const geocodeRes = await new Promise((resolve) => {
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === 'OK' && results?.length) resolve(results[0]); else resolve(null)
        })
    })
    let name = geocodeRes?.formatted_address || ''
    const address = cleanAddr(geocodeRes?.formatted_address || '')
    picked.value = { name: cleanAddr(name), lat, lng, address }
}
function applyPicked() {
    if (!picked.value?.lat) return
    if (pickerTarget.value === 'start') {
        startName.value = picked.value.name
        form.startLocation = { ...picked.value }
    } else if (pickerTarget.value === 'end') {
        endName.value = picked.value.name
        form.endLocation = { ...picked.value }
    } else if (pickerTarget.value === 'waypoint' && pickerIndex.value > -1) {
        waypointNames[pickerIndex.value] = picked.value.name
        form.waypoints[pickerIndex.value] = { ...picked.value }
    }
    closePicker()
    redrawMap()
}
function closePicker() {
    showPicker.value = false
    pickerMap = null; pickerMarker = null
}

/* ====================== Waypoints helpers ====================== */
function addWaypoint() {
    form.waypoints.push({ lat: null, lng: null, name: '', address: '' })
    waypointNames.push('')
    nextTick(() => ensureWaypointAC(form.waypoints.length - 1))
}
function removeWaypoint(idx) {
    form.waypoints.splice(idx, 1)
    waypointNames.splice(idx, 1)
    waypointACs.splice(idx, 1)
    waypointInputs.splice(idx, 1)
    redrawMap()
}

/* ====================== Submit ====================== */
const isSubmitting = ref(false)
const departureLocal = ref('')

const canSubmit = computed(() =>
    !!form.driverId &&
    !!form.vehicleId &&
    !!form.startLocation.lat &&
    !!form.endLocation.lat &&
    !!departureLocal.value &&
    form.availableSeats > 0 &&
    form.pricePerSeat >= 0
)

function toISOLocal(datetimeLocal) {
    // datetime-local เป็น local time → แปลงเป็น ISO (UTC)
    const d = new Date(datetimeLocal)
    return d.toISOString()
}

async function handleCreate() {
    if (!canSubmit.value) {
        toast.warning('ข้อมูลไม่ครบถ้วน', 'กรุณากรอก/เลือกข้อมูลที่จำเป็นให้ครบ')
        return
    }
    isSubmitting.value = true
    try {
        const payload = {
            driverId: form.driverId,
            vehicleId: form.vehicleId,
            startLocation: form.startLocation,
            endLocation: form.endLocation,
            waypoints: form.waypoints.filter(w => w && w.lat != null && w.lng != null),
            departureTime: toISOLocal(departureLocal.value),
            availableSeats: Number(form.availableSeats),
            pricePerSeat: Number(form.pricePerSeat),
            conditions: form.conditions || ''
        }

        await $fetch('/routes/admin', {
            baseURL: config.public.apiBase,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: payload
        })

        toast.success('สร้างเส้นทางสำเร็จ', 'บันทึกเส้นทางเรียบร้อย')
        navigateTo('/admin/routes')
    } catch (error) {
        console.error('Create route error:', error)
        toast.error('เกิดข้อผิดพลาด', error?.data?.message || 'ไม่สามารถสร้างเส้นทางได้')
    } finally {
        isSubmitting.value = false
    }
}
function handleCancel() {
    navigateTo('/admin/routes')
}

/* ====================== Utils / Layout ====================== */
function cleanAddr(a) {
    return (a || '').replace(/,?\s*(Thailand|ไทย|ประเทศ)\s*$/i, '').replace(/\s{2,}/g, ' ').trim()
}
function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar')
    const overlay = document.getElementById('overlay')
    if (!sidebar || !overlay) return
    sidebar.classList.remove('mobile-open'); overlay.classList.add('hidden')
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
        } else { mainContent.style.marginLeft = '0' }

        if (gmap && mapReady.value) {
            google.maps.event.trigger(gmap, 'resize')
            redrawMap()
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
    useHeadScript()
})
onUnmounted(() => {
    cleanupGlobalScripts()
})
</script>

<style scoped>
.main-content {
    transition: margin-left 0.3s ease;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity .2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}
</style>
