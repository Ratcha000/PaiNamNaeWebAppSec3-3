<template>
    <div>
        <AdminHeader />
        <AdminSidebar />

        <main id="main-content" class="main-content mt-16 ml-0 lg:ml-[280px] p-6 min-h-screen">
            <div class="mx-auto max-w-7xl">
                <!-- Back -->
                <div class="mb-8">
                    <NuxtLink to="/admin/bookings"
                        class="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                        <i class="fa-solid fa-arrow-left"></i>
                        <span>ย้อนกลับ</span>
                    </NuxtLink>
                </div>

                <!-- Title -->
                <div class="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div class="flex items-center gap-3">
                        <h1 class="text-2xl font-semibold text-gray-800">แก้ไขการจอง (แอดมิน)</h1>
                        <span class="text-sm text-gray-500">ปรับเส้นทาง ผู้โดยสาร จำนวนที่นั่ง และจุดรับ-ส่ง</span>
                    </div>
                </div>

                <!-- Card -->
                <div class="flex w-full overflow-hidden bg-white border border-gray-300 rounded-lg shadow-lg">
                    <main class="flex-1 p-8 space-y-8">
                        <!-- SECTION: เส้นทาง + ผู้โดยสาร -->
                        <section>
                            <h3 class="mb-3 text-sm font-semibold text-gray-700">เส้นทางและผู้โดยสาร</h3>
                            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <!-- Route search -->
                                <div class="relative">
                                    <label class="block mb-2 text-sm font-medium text-gray-700">
                                        เลือกเส้นทาง (ค้นหา: ต้นทาง/ปลายทาง/ผู้ขับ/เวลา) <span
                                            class="text-red-500">*</span>
                                    </label>
                                    <input v-model.trim="routeQuery" @input="onSearchRoutes" type="text"
                                        placeholder="เช่น มข. → เซ็นทรัล / ชื่อคนขับ / เวลา"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    <div v-if="showRouteList"
                                        class="absolute z-20 w-full mt-1 overflow-auto bg-white border rounded-md shadow max-h-60">
                                        <button v-for="r in routeResults" :key="r.id" type="button"
                                            @click="selectRoute(r)" class="w-full px-3 py-2 text-left hover:bg-blue-50">
                                            <div class="text-sm font-medium text-gray-800">
                                                {{ summarizeRoute(r) }}
                                            </div>
                                            <div class="text-xs text-gray-500">
                                                {{ formatDateTime(r.departureTime) }} • ที่นั่งคงเหลือ {{
                                                r.availableSeats }} • ฿{{ r.pricePerSeat }}/ที่นั่ง
                                            </div>
                                        </button>
                                        <div v-if="!isSearchingRoutes && routeResults.length === 0"
                                            class="px-3 py-2 text-sm text-gray-500">
                                            ไม่พบเส้นทางที่ตรงกับคำค้น
                                        </div>
                                    </div>
                                    <p v-if="!selectedRouteId" class="mt-2 text-xs text-amber-600">*
                                        ต้องเลือกเส้นทางจากรายการ</p>
                                    <p v-else class="mt-2 text-xs text-gray-600 truncate">เลือกแล้ว: {{
                                        selectedRouteLabel }}</p>
                                </div>

                                <!-- Passenger search -->
                                <div class="relative">
                                    <label class="block mb-2 text-sm font-medium text-gray-700">
                                        เลือกผู้โดยสาร (ค้นหา: อีเมล / ชื่อ / Username) <span
                                            class="text-red-500">*</span>
                                    </label>
                                    <input v-model.trim="userQuery" @input="onSearchUsers" type="text"
                                        placeholder="เช่น user1@gmail.com / User1"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    <div v-if="showUserList"
                                        class="absolute z-20 w-full mt-1 overflow-auto bg-white border rounded-md shadow max-h-60">
                                        <button v-for="u in userResults" :key="u.id" type="button"
                                            @click="selectUser(u)" class="w-full px-3 py-2 text-left hover:bg-blue-50">
                                            <div class="text-sm font-medium text-gray-800">
                                                {{ u.firstName }} {{ u.lastName }}
                                                <span v-if="u.username" class="text-xs text-gray-500">(@{{ u.username
                                                    }})</span>
                                            </div>
                                            <div class="text-xs text-gray-500">{{ u.email }}</div>
                                        </button>
                                        <div v-if="!isSearchingUsers && userResults.length === 0"
                                            class="px-3 py-2 text-sm text-gray-500">
                                            ไม่พบผู้ใช้ที่ตรงกับคำค้น
                                        </div>
                                    </div>
                                    <p v-if="!selectedPassengerId" class="mt-2 text-xs text-amber-600">*
                                        ต้องเลือกผู้โดยสารจากรายการ</p>
                                    <p v-else class="mt-2 text-xs text-gray-600 truncate">เลือกแล้ว: {{
                                        selectedPassengerLabel }}</p>
                                </div>
                            </div>
                        </section>

                        <!-- SECTION: รายละเอียดการจอง -->
                        <section>
                            <h3 class="mb-3 text-sm font-semibold text-gray-700">รายละเอียดการจอง</h3>
                            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div>
                                    <label class="block mb-1 text-xs font-medium text-gray-600">
                                        จำนวนที่นั่ง <span class="text-red-500">*</span>
                                    </label>
                                    <input v-model.number="form.numberOfSeats" type="number" min="1"
                                        :max="maxSeats || undefined"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    <p class="mt-1 text-xs text-gray-500">
                                        {{
                                            selectedRoute?.availableSeats != null
                                                ? `เลือกได้สูงสุด ${selectedRoute.availableSeats} ที่นั่ง`
                                                : 'กรุณาเลือกเส้นทางก่อน'
                                        }}
                                    </p>
                                </div>
                                <div>
                                    <label class="block mb-1 text-xs font-medium text-gray-600">ราคาต่อที่นั่ง
                                        (อ้างอิงจากเส้นทาง)</label>
                                    <input :value="selectedRoute ? selectedRoute.pricePerSeat : ''" disabled
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100" />
                                </div>
                                <div>
                                    <label class="block mb-1 text-xs font-medium text-gray-600">เวลาออกเดินทาง</label>
                                    <input :value="selectedRoute ? formatDateTime(selectedRoute.departureTime) : ''"
                                        disabled
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100" />
                                </div>
                            </div>

                            <!-- จุดขึ้น/ลง -->
                            <div class="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2">
                                <div>
                                    <label class="block mb-2 text-sm font-medium text-gray-700">เลือกจุดขึ้นรถ</label>
                                    <div class="relative">
                                        <input ref="pickupInputEl" v-model="pickupPoint" type="text"
                                            placeholder="พิมพ์ชื่อสถานที่..."
                                            class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        <button type="button" @click="startBookingPicker('pickup')"
                                            class="absolute inset-y-0 my-auto text-gray-500 right-2 hover:text-blue-600"
                                            title="เลือกจากแผนที่">
                                            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                                <path
                                                    d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label class="block mb-2 text-sm font-medium text-gray-700">เลือกจุดลงรถ</label>
                                    <div class="relative">
                                        <input ref="dropoffInputEl" v-model="dropoffPoint" type="text"
                                            placeholder="พิมพ์ชื่อสถานที่..."
                                            class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        <button type="button" @click="startBookingPicker('dropoff')"
                                            class="absolute inset-y-0 my-auto text-gray-500 right-2 hover:text-blue-600"
                                            title="เลือกจากแผนที่">
                                            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                                <path
                                                    d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Actions -->
                        <div class="flex justify-end gap-4 pt-2">
                            <button type="button" @click="handleCancel" :disabled="isSubmitting"
                                class="px-6 py-3 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50">
                                ยกเลิก
                            </button>
                            <button type="button" @click="handleUpdate" :disabled="!canSubmit || isSubmitting"
                                class="flex items-center px-6 py-3 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed">
                                <svg v-if="isSubmitting" class="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4" />
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                {{ isSubmitting ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง' }}
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
            <div v-if="bookingPickingTarget" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
                @click.self="stopBookingPicker">
                <div class="bg-white rounded-lg w-[95%] max-w-3xl overflow-hidden">
                    <div class="flex items-center justify-between p-4 border-b border-gray-300">
                        <h3 class="text-lg font-semibold text-gray-900">เลือก{{ bookingPickingTarget === 'pickup' ?
                            'จุดขึ้นรถ' : 'จุดลงรถ' }}</h3>
                        <button @click="stopBookingPicker" class="text-gray-400 hover:text-gray-600"><i
                                class="fa-solid fa-xmark"></i></button>
                    </div>
                    <div class="p-0">
                        <div ref="bookingPickerMapEl" class="w-full" style="height: 65vh;"></div>
                        <div class="flex items-center justify-between p-4 border-t border-gray-200">
                            <div class="text-sm text-gray-700 truncate">
                                <span class="font-medium">ตำแหน่ง:</span>
                                <span class="truncate">{{ bookingPicked.name || '— ยังไม่เลือก —' }}</span>
                            </div>
                            <button
                                class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                :disabled="!bookingPicked.name" @click="applyBookingPicked">
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
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRuntimeConfig, useCookie } from '#app'
import AdminHeader from '~/components/admin/AdminHeader.vue'
import AdminSidebar from '~/components/admin/AdminSidebar.vue'
import { useToast } from '~/composables/useToast'
import dayjs from 'dayjs'
import 'dayjs/locale/th'
dayjs.locale('th')

definePageMeta({ middleware: ['admin-auth'] })
useHead({
    title: 'Edit Booking • Admin',
    link: [{ rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css' }],
    script: process.client && !window.google?.maps ? [
        { src: `https://maps.googleapis.com/maps/api/js?key=${useRuntimeConfig().public.googleMapsApiKey}&libraries=places,geometry`, async: true, defer: true }
    ] : []
})

const route = useRoute()
const bookingId = route.params.id
const { toast } = useToast()
const config = useRuntimeConfig()
const token = useCookie('token')?.value || (process.client ? localStorage.getItem('token') : '')

const isSubmitting = ref(false)

/* ===== form ===== */
const form = reactive({
    numberOfSeats: 1,
    status: '' // เก็บไว้ส่งกลับ (ไม่มี input UI ตาม create)
})

/* ===== points ===== */
const pickupPoint = ref('')
const dropoffPoint = ref('')
const pickupData = ref({ lat: null, lng: null, placeId: null, address: null, name: null })
const dropoffData = ref({ lat: null, lng: null, placeId: null, address: null, name: null })

/* ===== route & passenger search (เหมือนหน้า create) ===== */
const routeQuery = ref('')
const selectedRouteId = ref('')
const selectedRoute = ref(null)
const selectedRouteLabel = ref('')
const routeResults = ref([])
const isSearchingRoutes = ref(false)
const lastRouteLabel = ref('')

const userQuery = ref('')
const selectedPassengerId = ref('')
const selectedPassengerLabel = ref('')
const userResults = ref([])
const isSearchingUsers = ref(false)
const lastUserLabel = ref('')

const showRouteList = computed(() => routeQuery.value && (isSearchingRoutes.value || routeResults.value.length > 0))
const showUserList = computed(() => userQuery.value && (isSearchingUsers.value || userResults.value.length > 0))

function summarizeRoute(r) {
    const s = r.startLocation?.name || 'ต้นทาง'
    const e = r.endLocation?.name || 'ปลายทาง'
    const driver = r.driver ? `${r.driver.firstName || ''} ${r.driver.lastName || ''}`.trim() : ''
    return `${s} → ${e}${driver ? ' • ' + driver : ''}`
}
function formatDateTime(iso) { return iso ? dayjs(iso).format('D MMM YYYY HH:mm') : '-' }

/* --- search funcs (เหมือน create) --- */
let routeTimer = null
async function onSearchRoutes() {
    if (routeQuery.value !== lastRouteLabel.value) {
        selectedRouteId.value = ''
        selectedRoute.value = null
        selectedRouteLabel.value = ''
    }
    clearTimeout(routeTimer)
    const q = routeQuery.value.trim()
    if (!q) { routeResults.value = []; return }
    routeTimer = setTimeout(async () => {
        try {
            isSearchingRoutes.value = true
            const res = await $fetch('/routes/admin', {
                baseURL: config.public.apiBase,
                headers: { Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                query: { q, page: 1, limit: 10 }
            })
            routeResults.value = res?.data || []
        } catch { routeResults.value = [] }
        finally { isSearchingRoutes.value = false }
    }, 300)
}
function selectRoute(r) {
    selectedRouteId.value = r.id
    selectedRoute.value = r
    const label = `${summarizeRoute(r)} • ${formatDateTime(r.departureTime)}`
    routeQuery.value = label; lastRouteLabel.value = label; selectedRouteLabel.value = label
    routeResults.value = []
}

let userTimer = null
async function onSearchUsers() {
    if (userQuery.value !== lastUserLabel.value) selectedPassengerId.value = ''
    clearTimeout(userTimer)
    const q = userQuery.value.trim()
    if (!q) { userResults.value = []; return }
    userTimer = setTimeout(async () => {
        try {
            isSearchingUsers.value = true
            const res = await $fetch('/users/admin', {
                baseURL: config.public.apiBase,
                headers: { Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                query: { q, page: 1, limit: 10 }
            })
            userResults.value = res?.data || []
        } catch { userResults.value = [] }
        finally { isSearchingUsers.value = false }
    }, 300)
}
function selectUser(u) {
    selectedPassengerId.value = u.id
    const label = `${u.firstName || ''} ${u.lastName || ''} (${u.username ? '@' + u.username : u.email})`
    userQuery.value = label; lastUserLabel.value = label; selectedPassengerLabel.value = label
    userResults.value = []
}

/* ===== Google Places autocomplete & picker (เหมือน create) ===== */
const pickupInputEl = ref(null)
const dropoffInputEl = ref(null)
const bookingPickingTarget = ref(/** @type {'pickup'|'dropoff'|null} */(null))
const bookingPickerMapEl = ref(null)
let bookingPickerMap = null
let bookingPickerMarker = null
let geocoder = null
let placesService = null
const bookingPicked = ref({ name: '', lat: null, lng: null, placeId: null, address: null })

function initMapsHelpers() {
    if (!window.google?.maps) return
    if (!geocoder) geocoder = new google.maps.Geocoder()
    if (!placesService) {
        const tmp = document.createElement('div')
        const map = new google.maps.Map(tmp, { center: { lat: 13.7563, lng: 100.5018 }, zoom: 3 })
        placesService = new google.maps.places.PlacesService(map)
    }
}
function initBookingAutocomplete() {
    if (!window.google?.maps?.places) return
    initMapsHelpers()
    const opts = { fields: ['place_id', 'name', 'formatted_address', 'geometry'], types: ['geocode', 'establishment'], componentRestrictions: { country: ['th'] } }

    if (pickupInputEl.value) {
        const ac = new google.maps.places.Autocomplete(pickupInputEl.value, opts)
        ac.addListener('place_changed', () => {
            const p = ac.getPlace(); if (!p) return
            pickupPoint.value = p.name || p.formatted_address || pickupPoint.value
            pickupData.value = {
                lat: p.geometry?.location?.lat?.() ?? null,
                lng: p.geometry?.location?.lng?.() ?? null,
                placeId: p.place_id || null,
                address: p.formatted_address || null,
                name: p.name || null
            }
        })
    }
    if (dropoffInputEl.value) {
        const ac = new google.maps.places.Autocomplete(dropoffInputEl.value, opts)
        ac.addListener('place_changed', () => {
            const p = ac.getPlace(); if (!p) return
            dropoffPoint.value = p.name || p.formatted_address || dropoffPoint.value
            dropoffData.value = {
                lat: p.geometry?.location?.lat?.() ?? null,
                lng: p.geometry?.location?.lng?.() ?? null,
                placeId: p.place_id || null,
                address: p.formatted_address || null,
                name: p.name || null
            }
        })
    }
}
function ensureInitAutocomplete() {
    if (window.google?.maps?.places) { initBookingAutocomplete(); return }
    const timer = setInterval(() => {
        if (window.google?.maps?.places) { clearInterval(timer); initBookingAutocomplete() }
    }, 100)
}

function startBookingPicker(target) {
    bookingPickingTarget.value = target
    bookingPicked.value = { name: '', lat: null, lng: null, placeId: null, address: null }
    nextTick(() => {
        initMapsHelpers()
        const fallbackCenter = { lat: 13.7563, lng: 100.5018 }
        const base = target === 'pickup' ? pickupData.value : dropoffData.value
        const center = (base.lat && base.lng) ? { lat: base.lat, lng: base.lng } : fallbackCenter
        bookingPickerMap = new google.maps.Map(bookingPickerMapEl.value, {
            center, zoom: base.lat ? 15 : 6, mapTypeControl: false, streetViewControl: false, fullscreenControl: false
        })
        bookingPickerMap.addListener('click', async (e) => {
            const pos = e.latLng
            setBookingPickerMarker(pos)
            await resolveBookingPicked(pos)
        })
    })
}
function stopBookingPicker() { bookingPickingTarget.value = null; bookingPickerMap = null; bookingPickerMarker = null }
function setBookingPickerMarker(latlng) {
    if (bookingPickerMarker) return bookingPickerMarker.setPosition(latlng)
    bookingPickerMarker = new google.maps.Marker({ position: latlng, map: bookingPickerMap, draggable: true })
    bookingPickerMarker.addListener('dragend', (e) => resolveBookingPicked(e.latLng))
}
async function resolveBookingPicked(latlng) {
    const lat = latlng.lat(), lng = latlng.lng()
    const geocodeRes = await new Promise((resolve) => {
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === 'OK' && results?.length) resolve(results[0]); else resolve(null)
        })
    })
    let name = '', placeId = geocodeRes?.place_id || null, address = geocodeRes?.formatted_address || null
    if (geocodeRes) name = await extractShortName(geocodeRes)
    if (!name) {
        const poi = await findNearestPoi(lat, lng, 120)
        if (poi?.place_id) {
            placeId = poi.place_id
            const details = await new Promise((resolve) => {
                placesService.getDetails({ placeId: poi.place_id, fields: ['name', 'formatted_address'] },
                    (pl, status) => resolve(status === google.maps.places.PlacesServiceStatus.OK ? pl : null))
            })
            name = details?.name || poi.name || name
            address = details?.formatted_address || address
        }
    }
    if (address) address = address.replace(/,?\s*(Thailand|ไทย|ประเทศ)\s*$/i, '')
    bookingPicked.value = { name, lat, lng, placeId, address }
}
function applyBookingPicked() {
    if (!bookingPickingTarget.value || !bookingPicked.value.name) return
    const data = { lat: bookingPicked.value.lat, lng: bookingPicked.value.lng, placeId: bookingPicked.value.placeId, address: bookingPicked.value.address, name: bookingPicked.value.name }
    if (bookingPickingTarget.value === 'pickup') { pickupPoint.value = data.name || data.address || ''; pickupData.value = data }
    else { dropoffPoint.value = data.name || data.address || ''; dropoffData.value = data }
    stopBookingPicker()
}
function findNearestPoi(lat, lng, radius = 100) {
    return new Promise((resolve) => {
        if (!placesService) return resolve(null)
        placesService.nearbySearch({ location: { lat, lng }, radius }, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results?.length) resolve(results[0]); else resolve(null)
        })
    })
}
async function extractShortName(geocodeResult) {
    const comps = geocodeResult.address_components || []
    const byType = (t) => comps.find(c => c.types.includes(t))?.long_name
    const byTypeShort = (t) => comps.find(c => c.types.includes(t))?.short_name
    const types = geocodeResult.types || []
    const isPoi = types.includes('point_of_interest') || types.includes('establishment') || types.includes('premise')
    if (isPoi && geocodeResult.place_id && placesService) {
        const name = await new Promise((resolve) => {
            placesService.getDetails({ placeId: geocodeResult.place_id, fields: ['name'] },
                (pl, status) => resolve(status === google.maps.places.PlacesServiceStatus.OK ? pl?.name : null))
        })
        if (name) return name
    }
    const streetNumber = byType('street_number')
    const route = byType('route')
    let name = (streetNumber && route) ? `${streetNumber} ${route}` : (route || geocodeResult.formatted_address || '')
    const province = byType('administrative_area_level_1') || byTypeShort('administrative_area_level_1')
    if (province) name = name.replace(new RegExp(`,?\\s*(${province}|Thailand|ไทย)\\s*$`, 'i'), '')
    return name.trim()
}

/* ===== Submit (PUT) ===== */
const maxSeats = computed(() => selectedRoute.value?.availableSeats ?? null)
const canSubmit = computed(() =>
    !!selectedRouteId.value &&
    !!selectedPassengerId.value &&
    form.numberOfSeats >= 1 &&
    (!maxSeats.value || form.numberOfSeats <= maxSeats.value) &&
    (!!pickupData.value.lat || !!pickupPoint.value) &&
    (!!dropoffData.value.lat || !!dropoffPoint.value)
)

async function geocodeText(text) {
    return new Promise((resolve) => {
        if (!text || !geocoder) return resolve(null)
        geocoder.geocode({ address: text }, (results, status) => {
            if (status !== 'OK' || !results?.length) return resolve(null)
            const r = results[0]
            resolve({
                lat: r.geometry?.location?.lat?.() ?? null,
                lng: r.geometry?.location?.lng?.() ?? null,
                placeId: r.place_id || null,
                address: r.formatted_address?.replace(/,?\s*(Thailand|ไทย|ประเทศ)\s*$/i, '') || null,
                name: r.address_components?.[0]?.long_name || r.formatted_address || null
            })
        })
    })
}

function normalizeBookingError(err) {
    const status = err?.statusCode || err?.status || err?.response?.status || err?.data?.statusCode
    const rawMsg = err?.data?.message || err?.message || ''
    const msg = String(rawMsg || '').trim()
    const lower = msg.toLowerCase()
    let title = 'เกิดข้อผิดพลาด', body = msg || 'ไม่สามารถบันทึกการจองได้'
    if (/driver cannot book their own route/i.test(msg)) { title = 'ไม่สามารถดำเนินการ'; body = 'ผู้ขับไม่สามารถจองเส้นทางของตนเองได้ (Driver cannot book their own route.)' }
    else if (/booking already exists|duplicate booking/i.test(lower) || status === 409) { title = 'ข้อมูลซ้ำ'; body = msg || 'มีคำขอจองนี้อยู่ในระบบแล้ว' }
    else if (/no available seats|route .* full|insufficient seats|exceeds available seats/i.test(lower)) { title = 'ที่นั่งไม่เพียงพอ'; body = 'จำนวนที่นั่งไม่พอหรือเส้นทางเต็มแล้ว' }
    else if (/route not found/i.test(lower)) { title = 'ไม่พบเส้นทาง'; body = 'กรุณาเลือกเส้นทางใหม่อีกครั้ง' }
    else if (/passenger not found|user not found/i.test(lower)) { title = 'ไม่พบผู้โดยสาร'; body = 'ตรวจสอบผู้โดยสารที่เลือกอีกครั้ง' }
    else if (status === 400) { title = 'ข้อมูลไม่ถูกต้อง'; body = msg || 'รูปแบบข้อมูลไม่ถูกต้อง' }
    else if (status === 401 || status === 403) { title = 'ไม่ได้รับอนุญาต'; body = 'สิทธิ์ไม่เพียงพอสำหรับการกระทำนี้' }
    return { title, body, status, raw: msg }
}

async function handleUpdate() {
    if (!canSubmit.value) {
        toast.warning('ข้อมูลไม่ครบถ้วน', 'กรุณาเลือกเส้นทาง/ผู้โดยสาร ระบุจำนวนที่นั่ง และกำหนดจุดรับ-ส่งให้ถูกต้อง')
        return
    }
    // geocode ถ้าผู้ใช้พิมพ์เอง
    if (pickupPoint.value && !pickupData.value.lat) {
        const g1 = await geocodeText(pickupPoint.value); if (g1) pickupData.value = g1
    }
    if (dropoffPoint.value && !dropoffData.value.lat) {
        const g2 = await geocodeText(dropoffPoint.value); if (g2) dropoffData.value = g2
    }
    if (!pickupData.value.lat || !dropoffData.value.lat) {
        toast.warning('ข้อมูลไม่ครบถ้วน', 'กรุณาเลือกจุดขึ้นรถและจุดลงรถจากรายการหรือปักหมุดบนแผนที่')
        return
    }

    isSubmitting.value = true
    try {
        const payload = {
            routeId: selectedRouteId.value,
            passengerId: selectedPassengerId.value,
            numberOfSeats: Number(form.numberOfSeats),
            pickupLocation: pickupData.value,
            dropoffLocation: dropoffData.value,
            ...(form.status ? { status: form.status } : {})
        }
        await $fetch(`/bookings/admin/${bookingId}`, {
            baseURL: config.public.apiBase,
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: payload
        })
        toast.success('บันทึกสำเร็จ', 'อัปเดตการจองเรียบร้อย')
        navigateTo(`/admin/bookings/${bookingId}`).catch(() => { })
    } catch (error) {
        const mapped = normalizeBookingError(error)
        console.error('Update booking error:', { status: mapped.status, message: mapped.raw })
        toast.error(mapped.title, mapped.body)
    } finally {
        isSubmitting.value = false
    }
}
function handleCancel() { navigateTo('/admin/bookings') }

/* ===== Prefill: โหลดข้อมูลการจองเดิม ===== */
async function preloadBooking() {
    try {
        const res = await $fetch(`/bookings/admin/${bookingId}`, {
            baseURL: config.public.apiBase,
            headers: { Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
        })
        const b = res?.data || res
        // จำนวนที่นั่ง + สถานะ
        form.numberOfSeats = Number(b?.numberOfSeats || 1)
        form.status = b?.status || ''

        // ผู้โดยสาร
        const p = b?.passenger || b?.user
        if (p?.id) {
            selectedPassengerId.value = p.id
            const label = `${p.firstName || ''} ${p.lastName || ''} (${p.username ? '@' + p.username : p.email || ''})`.trim()
            userQuery.value = label; lastUserLabel.value = label; selectedPassengerLabel.value = label
        } else if (b?.passengerId) {
            selectedPassengerId.value = b.passengerId
            userQuery.value = `ผู้โดยสาร: ${b.passengerId}`; lastUserLabel.value = userQuery.value; selectedPassengerLabel.value = userQuery.value
        }

        // เส้นทาง
        const r = b?.route
        if (r?.id) {
            selectRoute(r) // จะตั้ง selectedRouteId + labels ให้ครบ
        } else if (b?.routeId) {
            selectedRouteId.value = b.routeId
            routeQuery.value = `เส้นทาง: ${b.routeId}`; lastRouteLabel.value = routeQuery.value; selectedRouteLabel.value = routeQuery.value
        }

        // จุดรับ/ส่ง
        const pick = b?.pickupLocation || {}
        const drop = b?.dropoffLocation || {}
        pickupData.value = { lat: pick.lat ?? null, lng: pick.lng ?? null, placeId: pick.placeId ?? null, address: pick.address ?? null, name: pick.name ?? null }
        dropoffData.value = { lat: drop.lat ?? null, lng: drop.lng ?? null, placeId: drop.placeId ?? null, address: drop.address ?? null, name: drop.name ?? null }
        pickupPoint.value = pick.name || pick.address || ''
        dropoffPoint.value = drop.name || drop.address || ''
    } catch (e) {
        console.error('Load booking failed', e)
        toast.error('ไม่สามารถโหลดข้อมูล', 'ไม่พบข้อมูลการจองหรือคุณไม่มีสิทธิ์เข้าถึง')
    }
}

/* ===== Layout helper (เหมือน create) ===== */
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
    }
    window.addEventListener('resize', window.__adminResizeHandler__)
}
function cleanupGlobalScripts() {
    window.removeEventListener('resize', window.__adminResizeHandler__ || (() => { }))
    delete window.__adminResizeHandler__
}

onMounted(() => {
    defineGlobalScripts()
    if (typeof window.__adminResizeHandler__ === 'function') window.__adminResizeHandler__()
    nextTick(() => ensureInitAutocomplete())
    preloadBooking()
})
onUnmounted(() => { cleanupGlobalScripts() })
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

:deep(.pac-container) {
    z-index: 99999 !important;
    font-family: inherit;
}
</style>
