<template>
    <div>
        <AdminHeader />
        <AdminSidebar />

        <main id="main-content" class="main-content mt-16 ml-0 lg:ml-[280px] p-6 min-h-screen">
            <div class="mx-auto max-w-7xl">
                <!-- Back -->
                <div class="mb-8">
                    <NuxtLink :to="`/admin/routes/${route.params.id}`"
                        class="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                        <i class="fa-solid fa-arrow-left"></i>
                        <span>ย้อนกลับ</span>
                    </NuxtLink>
                </div>

                <!-- Title -->
                <div class="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div class="flex items-center gap-3">
                        <h1 class="text-2xl font-semibold text-gray-800">แก้ไขเส้นทาง (แอดมิน)</h1>
                        <span class="text-sm text-gray-500">อัปเดตข้อมูลเส้นทางสำหรับผู้ขับและรถที่เลือก</span>
                    </div>
                </div>

                <!-- Card -->
                <div class="flex w-full overflow-hidden bg-white border border-gray-300 rounded-lg shadow-lg">
                    <main class="flex-1 p-6 sm:p-8">
                        <form @submit.prevent="handleSubmit" class="space-y-10">
                            <!-- ผู้ขับ/รถ -->
                            <section class="space-y-4">
                                <h2 class="text-lg font-semibold text-gray-800">ผู้ขับขี่และรถยนต์</h2>

                                <!-- ผู้ขับ (ล็อกแก้ไข) -->
                                <div class="relative">
                                    <label class="block mb-2 text-sm font-medium text-gray-700">ค้นหาผู้ขับ (อีเมล /
                                        ชื่อ / Username)</label>
                                    <input v-model.trim="driverQuery" @input="onSearchDrivers" type="text"
                                        placeholder="เลือกจากรายการ" :disabled="lockDriver" :readonly="lockDriver"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" />
                                    <div v-if="!lockDriver && showDriverList"
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
                                    <p class="mt-2 text-sm text-amber-600">* โหมดแก้ไข: ไม่สามารถเปลี่ยนผู้ขับได้</p>
                                </div>

                                <!-- รถ -->
                                <div>
                                    <label class="block mb-2 text-sm font-medium text-gray-700">เลือกรถของผู้ขับ</label>
                                    <select v-model="form.vehicleId"
                                        :disabled="!form.driverId || vehicleOptions.length === 0"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100">
                                        <option disabled value="">— กรุณาเลือก —</option>
                                        <option v-for="v in vehicleOptions" :key="v.id" :value="v.id">
                                            {{ v.vehicleModel }} ({{ v.vehicleType }}) • {{ v.licensePlate || '—' }}
                                        </option>
                                    </select>
                                    <p v-if="form.driverId && vehicleOptions.length === 0"
                                        class="mt-2 text-sm text-gray-500">
                                        * ผู้ขับรายนี้ยังไม่มีรถในระบบ
                                    </p>
                                </div>
                            </section>

                            <!-- ข้อมูลเส้นทาง -->
                            <section class="space-y-6">
                                <h2 class="text-lg font-semibold text-gray-800">ข้อมูลเส้นทาง</h2>

                                <!-- แผนที่พรีวิว -->
                                <div>
                                    <h3 class="mb-2 text-sm font-semibold text-gray-700">แผนที่เส้นทาง</h3>
                                    <div class="overflow-hidden border border-gray-300 rounded-lg">
                                        <div ref="mapEl" class="w-full" style="height: 360px;"></div>
                                    </div>
                                </div>

                                <!-- Start / End -->
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <!-- Start -->
                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">จุดเริ่มต้น</label>
                                        <div class="space-y-2">
                                            <!-- name + dropdown -->
                                            <input ref="startNameRef" v-model="form.startLocation.name"
                                                @change="onNameManual('start')" type="text" placeholder="ชื่อสถานที่"
                                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                            <input v-model="form.startLocation.address"
                                                @change="onAddressManual('start')" type="text" placeholder="ที่อยู่"
                                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                            <div class="grid grid-cols-2 gap-2">
                                                <input v-model.number="form.startLocation.lat" type="number" step="any"
                                                    placeholder="lat"
                                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                                <input v-model.number="form.startLocation.lng" type="number" step="any"
                                                    placeholder="lng"
                                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                            </div>
                                            <button type="button" @click="openPicker('start')"
                                                class="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                                                เลือกจากแผนที่
                                            </button>
                                        </div>
                                    </div>

                                    <!-- End -->
                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">จุดปลายทาง</label>
                                        <div class="space-y-2">
                                            <!-- name + dropdown -->
                                            <input ref="endNameRef" v-model="form.endLocation.name"
                                                @change="onNameManual('end')" type="text" placeholder="ชื่อสถานที่"
                                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                            <input v-model="form.endLocation.address" @change="onAddressManual('end')"
                                                type="text" placeholder="ที่อยู่"
                                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                            <div class="grid grid-cols-2 gap-2">
                                                <input v-model.number="form.endLocation.lat" type="number" step="any"
                                                    placeholder="lat"
                                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                                <input v-model.number="form.endLocation.lng" type="number" step="any"
                                                    placeholder="lng"
                                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                            </div>
                                            <button type="button" @click="openPicker('end')"
                                                class="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                                                เลือกจากแผนที่
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <!-- Waypoints -->
                                <div>
                                    <h3 class="mb-2 text-sm font-semibold text-gray-700">จุดแวะระหว่างทาง</h3>
                                    <div class="space-y-4">
                                        <div v-for="(w, idx) in form.waypoints" :key="idx"
                                            class="p-3 border border-gray-300 rounded-md">
                                            <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                <input v-model="w.name" type="text" placeholder="ชื่อจุดแวะ"
                                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                                <input v-model="w.address" type="text" placeholder="ที่อยู่"
                                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                                <input v-model.number="w.lat" type="number" step="any" placeholder="lat"
                                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                                <input v-model.number="w.lng" type="number" step="any" placeholder="lng"
                                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                            </div>
                                            <div class="flex gap-2 mt-2">
                                                <button type="button" @click="openPicker('waypoint', idx)"
                                                    class="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                                                    เลือกจากแผนที่
                                                </button>
                                                <button type="button" @click="removeWaypoint(idx)"
                                                    class="px-3 py-1.5 text-sm border border-red-300 text-red-700 rounded-md hover:bg-red-50">
                                                    ลบจุดแวะ
                                                </button>
                                            </div>
                                        </div>
                                        <button type="button" @click="addWaypoint"
                                            class="px-4 py-2 text-sm bg-gray-100 border rounded-md hover:bg-gray-200">
                                            + เพิ่มจุดแวะ
                                        </button>
                                    </div>
                                </div>

                                <!-- เวลา/ราคา/ที่นั่ง/เงื่อนไข -->
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div class="sm:col-span-1">
                                        <label
                                            class="block mb-1 text-xs font-medium text-gray-600">วัน-เวลาออกเดินทาง</label>
                                        <input v-model="departureLocal" type="datetime-local"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">ราคา/ที่นั่ง
                                            (บาท)</label>
                                        <input v-model.number="form.pricePerSeat" type="number" min="0"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label
                                            class="block mb-1 text-xs font-medium text-gray-600">ที่นั่งคงเหลือ</label>
                                        <input v-model.number="form.availableSeats" type="number" min="0"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        class="block mb-1 text-xs font-medium text-gray-600">เงื่อนไขการเดินทาง</label>
                                    <textarea v-model="form.conditions" rows="4"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="ระบุเงื่อนไขเพิ่มเติม เช่น ไม่เปิดเพลงเสียงดัง ฯลฯ"></textarea>
                                </div>
                            </section>

                            <!-- ปุ่ม -->
                            <div class="flex justify-end gap-4 pt-4">
                                <button type="button" :disabled="isSubmitting" @click="goBack"
                                    class="px-6 py-3 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50">
                                    ยกเลิก
                                </button>
                                <button type="submit" :disabled="!canSubmit || isSubmitting"
                                    class="flex items-center px-6 py-3 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed">
                                    <svg v-if="isSubmitting" class="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
                                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                        </path>
                                    </svg>
                                    {{ isSubmitting ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข' }}
                                </button>
                            </div>
                        </form>
                    </main>
                </div>
            </div>
        </main>

        <!-- overlay -->
        <div id="overlay" class="fixed inset-0 z-40 hidden bg-black bg-opacity-50 lg:hidden"
            @click="closeMobileSidebar"></div>

        <!-- Map picker -->
        <transition name="modal-fade">
            <div v-if="picker.show" class="fixed inset-0 z-[1000] bg-black/60 flex items-center justify-center"
                @click.self="closePicker">
                <div class="bg-white rounded-xl w-[95%] max-w-3xl overflow-hidden shadow-xl">
                    <div class="p-4 border-b">
                        <div class="font-semibold text-gray-800">
                            เลือกตำแหน่ง{{ picker.mode === 'start' ? 'จุดเริ่มต้น' : picker.mode === 'end' ?
                            'จุดปลายทาง' : 'จุดแวะ' }}
                        </div>
                    </div>
                    <div class="p-0">
                        <div ref="pickerMapEl" class="w-full" style="height: 70vh;"></div>
                        <div class="flex items-center justify-between p-4 border-t">
                            <div class="text-sm text-gray-700 truncate">
                                <span class="font-medium">ตำแหน่ง:</span>
                                <span class="truncate">lat: {{ picker.lat?.toFixed(6) || '-' }}, lng: {{
                                    picker.lng?.toFixed(6) || '-' }}</span>
                            </div>
                            <button
                                class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                :disabled="picker.lat == null || picker.lng == null" @click="applyPicker">
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
import { ref, reactive, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRuntimeConfig, useCookie, navigateTo } from '#app'
import AdminHeader from '~/components/admin/AdminHeader.vue'
import AdminSidebar from '~/components/admin/AdminSidebar.vue'
import dayjs from 'dayjs'
import 'dayjs/locale/th'
import buddhistEra from 'dayjs/plugin/buddhistEra'
import { useToast } from '~/composables/useToast'

dayjs.locale('th'); dayjs.extend(buddhistEra)

definePageMeta({ middleware: ['admin-auth'] })
useHead({
    title: 'แก้ไขเส้นทาง • Admin',
    link: [{ rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css' }]
})

const { toast } = useToast()
const route = useRoute()
const config = useRuntimeConfig()
const token = useCookie('token')?.value || (process.client ? localStorage.getItem('token') : '')

/* ----------------- ฟอร์ม ----------------- */
const form = reactive({
    driverId: '',
    vehicleId: '',
    startLocation: { lat: null, lng: null, name: '', address: '' },
    endLocation: { lat: null, lng: null, name: '', address: '' },
    waypoints: [],
    availableSeats: 0,
    pricePerSeat: 0,
    conditions: '',
    departureTimeISO: ''
})
const departureLocal = ref('')

const canSubmit = computed(() => {
    const s = form.startLocation, e = form.endLocation
    return form.driverId && form.vehicleId &&
        s.lat != null && s.lng != null && e.lat != null && e.lng != null &&
        departureLocal.value
})

/* --------- ผู้ขับ (ล็อกตอนแก้ไข) --------- */
const lockDriver = ref(true)
const driverQuery = ref('')
const lastChosenLabel = ref('')
const driverResults = ref([])
const isSearchingDrivers = ref(false)
const showDriverList = computed(() => !lockDriver.value && driverQuery.value && (isSearchingDrivers.value || driverResults.value.length > 0))
let driverTimer = null

async function onSearchDrivers() {
    if (lockDriver.value) return
    clearTimeout(driverTimer)
    const q = driverQuery.value.trim()
    if (!q) { driverResults.value = []; return }
    driverTimer = setTimeout(async () => {
        try {
            isSearchingDrivers.value = true
            const res = await $fetch('/users/admin', {
                baseURL: config.public.apiBase,
                headers: { Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                query: { q, page: 1, limit: 10 }
            })
            driverResults.value = res?.data || []
        } catch (e) {
            console.error('search drivers error:', e)
            driverResults.value = []
        } finally {
            isSearchingDrivers.value = false
        }
    }, 300)
}

function selectDriver(u) {
    if (lockDriver.value) return
    form.driverId = u.id
    const label = `${u.firstName || ''} ${u.lastName || ''} (${u.email})`
    driverQuery.value = label
    lastChosenLabel.value = label
    driverResults.value = []
    fetchVehiclesForDriver(u.id)
}

/* ------------- รถ ------------- */
const vehicleOptions = ref([])
async function fetchVehiclesForDriver(driverId) {
    try {
        vehicleOptions.value = []
        if (!driverId) return
        const data = await $fetch(`/vehicles/admin/user/${driverId}`, {
            baseURL: config.public.apiBase,
            headers: { Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
        })
        vehicleOptions.value = data?.data || []
    } catch (e) {
        console.error('vehicles error:', e)
        vehicleOptions.value = []
    }
}

/* ----------------- แผนที่ / จีโค้ด / ออโต้คอมพลีต ----------------- */
const mapEl = ref(null)
const startNameRef = ref(null)
const endNameRef = ref(null)

let gmap = null, mapReady = false, startMarker = null, endMarker = null
let geocoder = null, startAutocomplete = null, endAutocomplete = null
let programmaticUpdate = false

function initMap() {
    if (!mapEl.value || gmap) return
    gmap = new google.maps.Map(mapEl.value, {
        center: { lat: 13.7563, lng: 100.5018 }, zoom: 6,
        mapTypeControl: false, streetViewControl: false, fullscreenControl: true
    })
    geocoder = new google.maps.Geocoder()

    // Places Autocomplete
    if (window.google?.maps?.places && startNameRef.value) {
        startAutocomplete = new google.maps.places.Autocomplete(startNameRef.value, { fields: ['name', 'formatted_address', 'geometry'] })
        startAutocomplete.addListener('place_changed', () => {
            const p = startAutocomplete.getPlace(); if (!p) return
            if (p.geometry?.location) {
                programmaticUpdate = true
                form.startLocation.lat = p.geometry.location.lat()
                form.startLocation.lng = p.geometry.location.lng()
                form.startLocation.name = p.name || p.formatted_address || ''
                form.startLocation.address = p.formatted_address || ''
                programmaticUpdate = false
                drawPreview()
            }
        })
    }
    if (window.google?.maps?.places && endNameRef.value) {
        endAutocomplete = new google.maps.places.Autocomplete(endNameRef.value, { fields: ['name', 'formatted_address', 'geometry'] })
        endAutocomplete.addListener('place_changed', () => {
            const p = endAutocomplete.getPlace(); if (!p) return
            if (p.geometry?.location) {
                programmaticUpdate = true
                form.endLocation.lat = p.geometry.location.lat()
                form.endLocation.lng = p.geometry.location.lng()
                form.endLocation.name = p.name || p.formatted_address || ''
                form.endLocation.address = p.formatted_address || ''
                programmaticUpdate = false
                drawPreview()
            }
        })
    }

    mapReady = true
    setTimeout(() => google.maps.event.trigger(gmap, 'resize'), 0)
}

function clearPreview() {
    if (startMarker) { startMarker.setMap(null); startMarker = null }
    if (endMarker) { endMarker.setMap(null); endMarker = null }
}
function drawPreview() {
    if (!mapReady) return
    clearPreview()
    const b = new google.maps.LatLngBounds()
    if (isNum(form.startLocation.lat) && isNum(form.startLocation.lng)) {
        startMarker = new google.maps.Marker({ map: gmap, position: { lat: +form.startLocation.lat, lng: +form.startLocation.lng }, label: 'A' })
        b.extend(startMarker.getPosition())
    }
    if (isNum(form.endLocation.lat) && isNum(form.endLocation.lng)) {
        endMarker = new google.maps.Marker({ map: gmap, position: { lat: +form.endLocation.lat, lng: +form.endLocation.lng }, label: 'B' })
        b.extend(endMarker.getPosition())
    }
    if (!b.isEmpty()) {
        gmap.fitBounds(b)
        setTimeout(() => { google.maps.event.trigger(gmap, 'resize'); gmap.fitBounds(b) }, 0)
    }
}
function isNum(v) { return typeof v === 'number' && !Number.isNaN(v) }

function geocodeToNameAddressByLatLng(lat, lng) {
    return new Promise(resolve => {
        if (!geocoder || lat == null || lng == null) return resolve({ name: '', address: '' })
        geocoder.geocode({ location: { lat: +lat, lng: +lng } }, (results, status) => {
            if (status === 'OK' && results?.length) {
                const best = results[0]
                resolve({ name: best?.address_components?.[0]?.long_name || best?.formatted_address || '', address: best?.formatted_address || '' })
            } else resolve({ name: '', address: '' })
        })
    })
}
function geocodeTextToAll(text) {
    return new Promise(resolve => {
        if (!geocoder || !text) return resolve(null)
        geocoder.geocode({ address: text }, (results, status) => {
            if (status === 'OK' && results?.length) {
                const r = results[0]
                resolve({
                    name: r.address_components?.[0]?.long_name || r.formatted_address || text,
                    address: r.formatted_address || text,
                    lat: r.geometry?.location?.lat(),
                    lng: r.geometry?.location?.lng()
                })
            } else resolve(null)
        })
    })
}

/* --- ซิงก์จากการพิมพ์เอง (name/address) --- */
async function onNameManual(which) {
    const text = which === 'start' ? form.startLocation.name : form.endLocation.name
    const r = await geocodeTextToAll(text)
    if (!r) return
    programmaticUpdate = true
    if (which === 'start') {
        form.startLocation.name = r.name; form.startLocation.address = r.address
        if (r.lat != null && r.lng != null) { form.startLocation.lat = r.lat; form.startLocation.lng = r.lng }
    } else {
        form.endLocation.name = r.name; form.endLocation.address = r.address
        if (r.lat != null && r.lng != null) { form.endLocation.lat = r.lat; form.endLocation.lng = r.lng }
    }
    programmaticUpdate = false
    drawPreview()
}
async function onAddressManual(which) {
    const text = which === 'start' ? form.startLocation.address : form.endLocation.address
    const r = await geocodeTextToAll(text)
    if (!r) return
    programmaticUpdate = true
    if (which === 'start') {
        form.startLocation.name = r.name; form.startLocation.address = r.address
        if (r.lat != null && r.lng != null) { form.startLocation.lat = r.lat; form.startLocation.lng = r.lng }
    } else {
        form.endLocation.name = r.name; form.endLocation.address = r.address
        if (r.lat != null && r.lng != null) { form.endLocation.lat = r.lat; form.endLocation.lng = r.lng }
    }
    programmaticUpdate = false
    drawPreview()
}

/* --- ซิงก์เมื่อแก้ lat/lng เอง --- */
let syncTimerStart = null, syncTimerEnd = null
watch(() => [form.startLocation.lat, form.startLocation.lng], async ([lat, lng]) => {
    if (programmaticUpdate) return
    clearTimeout(syncTimerStart)
    syncTimerStart = setTimeout(async () => {
        if (isNum(lat) && isNum(lng)) {
            const r = await geocodeToNameAddressByLatLng(lat, lng)
            if (r.address) {
                programmaticUpdate = true
                form.startLocation.name = r.name
                form.startLocation.address = r.address
                programmaticUpdate = false
            }
            drawPreview()
        }
    }, 350)
})
watch(() => [form.endLocation.lat, form.endLocation.lng], async ([lat, lng]) => {
    if (programmaticUpdate) return
    clearTimeout(syncTimerEnd)
    syncTimerEnd = setTimeout(async () => {
        if (isNum(lat) && isNum(lng)) {
            const r = await geocodeToNameAddressByLatLng(lat, lng)
            if (r.address) {
                programmaticUpdate = true
                form.endLocation.name = r.name
                form.endLocation.address = r.address
                programmaticUpdate = false
            }
            drawPreview()
        }
    }, 350)
})

/* ---------- Waypoints / Picker ---------- */
const picker = reactive({ show: false, mode: null, index: null, lat: null, lng: null })
const pickerMapEl = ref(null); let pickerMap = null, pickerMarker = null
function openPicker(mode, index = null) {
    picker.show = true; picker.mode = mode; picker.index = index; picker.lat = null; picker.lng = null
    nextTick(() => {
        const center = { lat: 13.7563, lng: 100.5018 }
        const base = mode === 'start' ? form.startLocation : mode === 'end' ? form.endLocation : form.waypoints[index] || {}
        const c = (isNum(base.lat) && isNum(base.lng)) ? { lat: +base.lat, lng: +base.lng } : center
        pickerMap = new google.maps.Map(pickerMapEl.value, { center: c, zoom: isNum(base.lat) ? 15 : 6, mapTypeControl: false, streetViewControl: false, fullscreenControl: false })
        pickerMap.addListener('click', (e) => { setPickerMarker(e.latLng); picker.lat = e.latLng.lat(); picker.lng = e.latLng.lng() })
    })
}
function setPickerMarker(latlng) { if (pickerMarker) return pickerMarker.setPosition(latlng); pickerMarker = new google.maps.Marker({ map: pickerMap, position: latlng, draggable: true }); pickerMarker.addListener('dragend', (e) => { picker.lat = e.latLng.lat(); picker.lng = e.latLng.lng() }) }
function closePicker() { picker.show = false; picker.mode = null; picker.index = null; pickerMarker = null; pickerMap = null }
async function applyPicker() {
    if (picker.lat == null || picker.lng == null) return
    programmaticUpdate = true
    if (picker.mode === 'start') {
        form.startLocation.lat = picker.lat; form.startLocation.lng = picker.lng
        const r = await geocodeToNameAddressByLatLng(picker.lat, picker.lng); form.startLocation.name = r.name; form.startLocation.address = r.address
    } else if (picker.mode === 'end') {
        form.endLocation.lat = picker.lat; form.endLocation.lng = picker.lng
        const r = await geocodeToNameAddressByLatLng(picker.lat, picker.lng); form.endLocation.name = r.name; form.endLocation.address = r.address
    } else if (picker.mode === 'waypoint' && picker.index != null) {
        const w = form.waypoints[picker.index]; if (w) { w.lat = picker.lat; w.lng = picker.lng; const r = await geocodeToNameAddressByLatLng(picker.lat, picker.lng); w.name = r.name; w.address = r.address }
    }
    programmaticUpdate = false
    closePicker(); drawPreview()
}
function addWaypoint() { form.waypoints.push({ lat: null, lng: null, name: '', address: '' }) }
function removeWaypoint(i) { form.waypoints.splice(i, 1); drawPreview() }

/* ---------- โหลดข้อมูลเดิม ---------- */
async function fetchRoute() {
    try {
        const res = await $fetch(`/routes/admin/${route.params.id}`, {
            baseURL: config.public.apiBase,
            headers: { Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
        })
        const r = res?.data
        if (!r) throw new Error('Invalid response')

        // map → form
        form.driverId = r.driver?.id || ''
        form.vehicleId = r.vehicle?.id || ''
        form.startLocation = {
            lat: r.startLocation?.lat ?? null,
            lng: r.startLocation?.lng ?? null,
            name: r.startLocation?.name || '',
            address: r.startLocation?.address || ''
        }
        form.endLocation = {
            lat: r.endLocation?.lat ?? null,
            lng: r.endLocation?.lng ?? null,
            name: r.endLocation?.name || '',
            address: r.endLocation?.address || ''
        }
        form.waypoints = Array.isArray(r.waypoints?.used)
            ? r.waypoints.used.map(p => ({ lat: p.lat ?? null, lng: p.lng ?? null, name: p.name || '', address: p.address || '' }))
            : Array.isArray(r.waypoints)
                ? r.waypoints.map(p => ({ lat: p.lat ?? null, lng: p.lng ?? null, name: p.name || '', address: p.address || '' }))
                : []

        form.availableSeats = r.availableSeats ?? 0
        form.pricePerSeat = r.pricePerSeat ?? 0
        form.conditions = r.conditions || ''
        form.departureTimeISO = r.departureTime || ''
        departureLocal.value = r.departureTime ? dayjs(r.departureTime).format('YYYY-MM-DDTHH:mm') : ''

        // ตั้งค่า label ให้ช่องผู้ขับ (โชว์ค่าเริ่มต้น)
        const label = `${r.driver?.firstName || ''} ${r.driver?.lastName || ''} (${r.driver?.email || ''})`.trim()
        driverQuery.value = label
        lastChosenLabel.value = label

        // โหลดรายการรถของผู้ขับเพื่อโชว์ค่าเริ่มต้นของ vehicle
        if (form.driverId) {
            await fetchVehiclesForDriver(form.driverId)
            // กรณีรถปัจจุบันไม่ได้อยู่ใน options (เช่นรถถูกลบ) ให้คงค่าเดิมไว้แต่ dropdown จะว่าง
        }

        // map preview
        if (window.google?.maps) {
            initMap(); nextTick(drawPreview)
        }
    } catch (e) {
        console.error('fetch route error:', e)
        toast.error('เกิดข้อผิดพลาด', e?.data?.message || 'โหลดข้อมูลเส้นทางไม่สำเร็จ')
    }
}

/* ---------- บันทึก ---------- */
const isSubmitting = ref(false)
async function handleSubmit() {
    if (!canSubmit.value) {
        toast.warning('ข้อมูลไม่ครบ', 'กรุณากรอกข้อมูลให้ครบถ้วน')
        return
    }
    isSubmitting.value = true
    try {
        const payload = {
            driverId: form.driverId,
            vehicleId: form.vehicleId,
            startLocation: { ...form.startLocation },
            endLocation: { ...form.endLocation },
            waypoints: form.waypoints.map(w => ({
                lat: +w.lat, lng: +w.lng, name: w.name || '', address: w.address || ''
            })),
            departureTime: new Date(departureLocal.value).toISOString(),
            availableSeats: +form.availableSeats,
            pricePerSeat: +form.pricePerSeat,
            conditions: form.conditions || ''
        }

        await $fetch(`/routes/admin/${route.params.id}`, {
            baseURL: config.public.apiBase,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: payload
        })

        toast.success('บันทึกสำเร็จ', 'อัปเดตข้อมูลเส้นทางแล้ว')
        navigateTo(`/admin/routes/${route.params.id}`).catch(() => { })
    } catch (e) {
        console.error('update route error:', e)
        toast.error('เกิดข้อผิดพลาด', e?.data?.message || 'ไม่สามารถบันทึกการแก้ไขได้')
    } finally {
        isSubmitting.value = false
    }
}

/* ---------- อื่น ๆ ---------- */
function goBack() { navigateTo(`/admin/routes/${route.params.id}`) }
function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar')
    const overlay = document.getElementById('overlay')
    if (!sidebar || !overlay) return
    sidebar.classList.remove('mobile-open')
    overlay.classList.add('hidden')
}

/* Mount */
const GMAPS_CB = '__gmapsReadyAdminRouteEdit__'
onMounted(async () => {
    if (!window.google?.maps) {
        const s = document.createElement('script')
        s.src = `https://maps.googleapis.com/maps/api/js?key=${config.public.googleMapsApiKey}&libraries=places,geometry&callback=${GMAPS_CB}`
        s.async = true; s.defer = true
        window[GMAPS_CB] = () => { try { delete window[GMAPS_CB] } catch { }; initMap(); drawPreview() }
        document.head.appendChild(s)
    } else { initMap() }
    await fetchRoute()
})
</script>

<style scoped>
.main-content {
    transition: margin-left 0.3s ease;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity .25s;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}
</style>
