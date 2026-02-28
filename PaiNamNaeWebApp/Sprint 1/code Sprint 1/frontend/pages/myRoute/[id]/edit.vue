<template>
    <div>
        <div class="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
            <div class="mb-8">
                <h2 class="mb-2 text-3xl font-bold text-gray-900">
                    แก้ไขการเดินทางของคุณ
                </h2>
                <p class="text-gray-600">
                    ปรับจุดเริ่มต้น ปลายทาง และรายละเอียดต่างๆ ของการเดินทางนี้
                </p>
            </div>

            <div class="p-8 bg-white border border-gray-300 rounded-lg shadow-md">
                <form @submit.prevent="handleSubmit" id="editRouteForm" novalidate class="space-y-8">
                    <!-- ข้อมูลเส้นทาง -->
                    <div>
                        <h3 class="pb-2 mb-6 text-xl font-semibold text-gray-900 border-b border-gray-300">
                            ข้อมูลเส้นทาง
                        </h3>

                        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label for="startPoint" class="block mb-2 text-sm font-medium text-gray-700">
                                    จุดเริ่มต้น <span class="text-red-500">*</span>
                                </label>
                                <div class="relative">
                                    <input ref="startInputEl" v-model="form.startPoint" id="startPoint"
                                        name="startPoint" type="text" placeholder="เช่น กรุงเทพมหานคร, ถนนสุขุมวิท"
                                        required
                                        class="w-full px-4 py-3 pr-10 border border-gray-300 rounded-md focus:ring-blue-500" />
                                    <button type="button" @click="openPlacePicker('start')"
                                        class="absolute inset-y-0 my-auto text-gray-500 right-2 hover:text-blue-600"
                                        title="เลือกจากแผนที่">
                                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                            <path
                                                d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label for="endPoint" class="block mb-2 text-sm font-medium text-gray-700">
                                    จุดปลายทาง <span class="text-red-500">*</span>
                                </label>
                                <div class="relative">
                                    <input ref="endInputEl" v-model="form.endPoint" id="endPoint" name="endPoint"
                                        type="text" placeholder="เช่น เชียงใหม่, ถนนนิมมานเหมินท์" required
                                        class="w-full px-4 py-3 pr-10 border border-gray-300 rounded-md focus:ring-blue-500" />
                                    <button type="button" @click="openPlacePicker('end')"
                                        class="absolute inset-y-0 my-auto text-gray-500 right-2 hover:text-blue-600"
                                        title="เลือกจากแผนที่">
                                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                            <path
                                                d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="mt-6">
                            <label class="block mb-2 text-sm font-medium text-gray-700">
                                จุดแวะ (เพิ่มได้หลายจุด)
                            </label>

                            <div class="space-y-4">
                                <div v-for="(wp, idx) in waypoints" :key="idx" class="relative">
                                    <input :ref="el => waypointInputs[idx] = el" v-model="wp.text" type="text"
                                        :placeholder="`เช่น จุดรับ-ส่ง ระหว่างทาง (#${idx + 1})`"
                                        class="w-full px-4 py-3 pr-20 border border-gray-300 rounded-md focus:ring-blue-500" />
                                    <div class="absolute inset-y-0 flex items-center gap-2 my-auto right-2">
                                        <button type="button" class="text-gray-500 hover:text-blue-600"
                                            @click="openPlacePicker(`wp-${idx}`)" title="เลือกจากแผนที่">
                                            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                                <path
                                                    d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                                            </svg>
                                        </button>
                                        <button type="button" class="text-gray-500 hover:text-red-600"
                                            @click="removeWaypoint(idx)" title="ลบจุดแวะนี้">
                                            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <button type="button" @click="addWaypoint"
                                    class="inline-flex items-center gap-2 px-3 py-2 text-sm text-white bg-blue-600 rounded-md cursor-pointer hover:bg-blue-700">
                                    <i class="fa-solid fa-plus"></i>
                                    เพิ่มจุดแวะ
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- รายละเอียดการเดินทาง -->
                    <div>
                        <h3 class="pb-2 mb-6 text-xl font-semibold text-gray-900 border-b border-gray-300 ">
                            รายละเอียดการเดินทาง
                        </h3>
                        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label for="travelDate" class="block mb-2 text-sm font-medium text-gray-700">
                                    วันที่เดินทาง <span class="text-red-500">*</span>
                                </label>
                                <input v-model="form.date" id="travelDate" name="travelDate" type="date" required
                                    class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500" />
                            </div>
                            <div>
                                <label for="travelTime" class="block mb-2 text-sm font-medium text-gray-700">
                                    เวลาออกเดินทาง <span class="text-red-500">*</span>
                                </label>
                                <input v-model="form.time" id="travelTime" name="travelTime" type="time" required
                                    class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500" />
                            </div>
                            <div>
                                <label for="seatCount" class="block mb-2 text-sm font-medium text-gray-700">
                                    จำนวนที่นั่งที่รับได้ <span class="text-red-500">*</span>
                                </label>
                                <input v-model.number="form.availableSeats" id="seatCount" name="seatCount"
                                    type="number" min="1" placeholder="กรอกจำนวนที่นั่ง (เช่น 4)" required
                                    class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500" />
                                <p class="mt-1 text-xs text-gray-500">
                                    รถยนต์ส่วนบุคคลทั่วไปมี 4–5 ที่นั่ง หากใช้รถตู้/รถบัส ให้ระบุจำนวนได้ตามจริง
                                </p>
                            </div>
                            <div>
                                <label for="pricePerSeat" class="block mb-2 text-sm font-medium text-gray-700">
                                    ราคาต่อที่นั่ง (บาท) <span class="text-red-500">*</span>
                                </label>
                                <input v-model.number="form.pricePerSeat" id="pricePerSeat" name="pricePerSeat"
                                    type="number" min="0" placeholder="เช่น 250" required
                                    class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500" />
                            </div>
                        </div>
                    </div>

                    <!-- ข้อมูลรถยนต์ -->
                    <div>
                        <h3 class="pb-2 mb-6 text-xl font-semibold text-gray-900 border-b border-gray-300">
                            ข้อมูลรถยนต์
                        </h3>

                        <div v-if="vehicles.length > 0" class="grid items-center grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label for="vehicle" class="block mb-2 text-sm font-medium text-gray-700">
                                    เลือกรถยนต์ที่จะใช้ <span class="text-red-500">*</span>
                                </label>
                                <select v-model="form.vehicleId" id="vehicle" name="vehicle"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500">
                                    <option disabled value="">กรุณาเลือกรถยนต์</option>
                                    <option v-for="v in vehicles" :key="v.id" :value="v.id">
                                        {{ v.vehicleModel }} ({{ v.licensePlate }})
                                    </option>
                                </select>
                            </div>
                            <div class="self-end">
                                <button type="button" @click="isModalOpen = true"
                                    class="w-full px-4 py-3 text-sm text-gray-800 transition-colors bg-gray-100 rounded-md cursor-pointer md:w-auto hover:bg-gray-200">
                                    เพิ่ม / จัดการข้อมูลรถยนต์
                                </button>
                            </div>
                        </div>

                        <div v-else class="p-8 bg-white border border-gray-300 shadow-xl rounded-xl">
                            <div
                                class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-[#F2F2F2] p-4 md:px-6 md:py-6 rounded-[8px]">
                                <p class="text-gray-800 text-base md:text-[18px] text-center sm:text-left">
                                    คุณยังไม่มีข้อมูลรถยนต์
                                </p>
                                <button type="button" @click="isModalOpen = true"
                                    class="bg-[#2563EB] hover:bg-blue-600 text-white text-sm md:text-[16px] px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                                    เพิ่ม / จัดการข้อมูล
                                </button>
                            </div>
                        </div>
                    </div>

                    <VehicleModal :show="isModalOpen" @close="closeAndRefresh" />

                    <!-- เงื่อนไข -->
                    <div>
                        <h3 class="pb-2 mb-6 text-xl font-semibold text-gray-900 border-b border-gray-300">
                            เงื่อนไขและข้อตกลง
                        </h3>
                        <textarea v-model="form.conditions" id="terms" name="terms" rows="4"
                            placeholder="ระบุเงื่อนไข เช่น ไม่สูบบุหรี่, ไม่นำสัตว์เลี้ยง, ชำระเงินล่วงหน้า 50%"
                            class="w-full px-4 py-3 border border-gray-300 rounded-md resize-none focus:ring-blue-500"></textarea>
                    </div>

                    <!-- ปุ่ม -->
                    <div class="flex justify-end gap-4 pt-6">
                        <button type="button"
                            class="px-6 py-3 text-gray-700 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            @click="$router.back()">
                            ยกเลิก
                        </button>
                        <button type="submit" :disabled="isLoading"
                            class="px-6 py-3 font-medium text-white bg-blue-600 rounded-md cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed">
                            {{ isLoading ? 'กำลังอัปเดต...' : 'อัปเดตการเดินทาง' }}
                        </button>
                    </div>
                </form>
            </div>

            <!-- Modal เลือกตำแหน่ง -->
            <transition name="modal-fade">
                <div v-if="showPlacePicker" class="modal-overlay" @click.self="closePlacePicker">
                    <div class="modal-content">
                        <div class="flex items-center justify-between p-4 border-b border-gray-300">
                            <h3 class="text-lg font-semibold text-gray-900">
                                เลือก
                                {{ pickingField === 'start'
                                    ? 'จุดเริ่มต้น'
                                    : pickingField === 'end'
                                        ? 'จุดปลายทาง'
                                        : 'จุดแวะ' }}
                            </h3>
                            <button @click="closePlacePicker" class="text-gray-400 hover:text-gray-600">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div class="p-4 space-y-3">
                            <div ref="placePickerMapEl" class="w-full border border-gray-200 rounded-md h-80"></div>
                            <div class="text-sm text-gray-700">
                                <div class="font-medium">ตำแหน่งที่เลือก:</div>
                                <div class="truncate">{{ pickedPlace.name || '— ยังไม่เลือก —' }}</div>
                                <div v-if="pickedPlace.lat && pickedPlace.lng" class="text-gray-500">
                                    lat: {{ pickedPlace.lat.toFixed(6) }}, lng: {{ pickedPlace.lng.toFixed(6) }}
                                </div>
                            </div>
                            <div class="flex gap-3 pt-2">
                                <button @click="closePlacePicker"
                                    class="flex-1 px-4 py-2 font-semibold text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300">
                                    ยกเลิก
                                </button>
                                <button :disabled="!pickedPlace.name" @click="applyPickedPlace"
                                    class="flex-1 px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                                    ใช้ตำแหน่งนี้
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRuntimeConfig, useHead, navigateTo, useRoute } from '#app'
import VehicleModal from '~/components/VehicleModal.vue'
import { useToast } from '~/composables/useToast'

definePageMeta({ middleware: 'auth' })

const { $api } = useNuxtApp()
const { toast } = useToast()

const isModalOpen = ref(false)
const isLoading = ref(false)
const vehicles = ref([])

// ====== ฟอร์มเหมือนหน้า create ======
const waypoints = ref([])
const waypointMetas = ref([])
const waypointInputs = ref([])
let waypointAutocompletes = []

const form = reactive({
    vehicleId: '',
    startPoint: '',
    endPoint: '',
    date: '',
    time: '',
    availableSeats: null,
    pricePerSeat: null,
    conditions: ''
})

const startInputEl = ref(null)
const endInputEl = ref(null)
let startAutocomplete = null
let endAutocomplete = null

const startMeta = ref({ lat: null, lng: null, name: null, address: null, placeId: null })
const endMeta = ref({ lat: null, lng: null, name: null, address: null, placeId: null })

// ====== Modal ปักหมุด ======
const showPlacePicker = ref(false)
const pickingField = ref(null)
const placePickerMapEl = ref(null)
let placePickerMap = null
let placePickerMarker = null
const pickedPlace = ref({ name: '', lat: null, lng: null })

let geocoder = null
let placesService = null

const route = useRoute()
const routeId = route.params.id

// ====== Google Maps ======
const config = useRuntimeConfig()
const GMAPS_CB = '__gmapsReadyEditTrip__'
const headScripts = []
if (process.client && !window.google?.maps) {
    headScripts.push({
        key: 'gmaps',
        src: `https://maps.googleapis.com/maps/api/js?key=${config.public.googleMapsApiKey}&libraries=places&callback=${GMAPS_CB}`,
        async: true,
        defer: true
    })
}
useHead({ script: headScripts })

const original = ref(null)

async function loadRoute() {
    const apiBase = (useRuntimeConfig().public.apiBase || 'http://localhost:3000/api').replace(/\/$/, '')
    const res = await fetch(`${apiBase}/routes/${routeId}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        credentials: 'include'
    })
    const body = await res.json()
    if (!res.ok) throw new Error(body?.message || 'Failed to load route')
    // คาดโครงสร้าง: body.data = { vehicleId, startLocation, endLocation, waypoints, departureTime, availableSeats, pricePerSeat, conditions }
    const r = body?.data || body
    original.value = r

    // Prefill ฟอร์ม
    form.vehicleId = r.vehicleId || ''
    form.conditions = r.conditions || ''
    form.availableSeats = r.availableSeats ?? null
    form.pricePerSeat = r.pricePerSeat ?? null

    // time & date จาก departureTime
    if (r.departureTime) {
        const dt = new Date(r.departureTime)
        form.date = dt.toISOString().slice(0, 10)
        form.time = dt.toTimeString().slice(0, 5)
    }

    // start / end
    const s = r.startLocation || {}
    const e = r.endLocation || {}
    form.startPoint = s.name || s.address || ''
    form.endPoint = e.name || e.address || ''
    startMeta.value = { lat: s.lat ?? null, lng: s.lng ?? null, name: s.name || null, address: s.address || null, placeId: s.placeId || null }
    endMeta.value = { lat: e.lat ?? null, lng: e.lng ?? null, name: e.name || null, address: e.address || null, placeId: e.placeId || null }

    // waypoints
    const wpArr = normalizeWaypoints(r.waypoints)
    waypoints.value = wpArr.map(w => ({ text: w?.name || w?.address || '' }))

    waypointMetas.value = wpArr.map(w => ({
        lat: w?.lat ?? null,
        lng: w?.lng ?? null,
        name: w?.name || null,
        address: w?.address || null,
        placeId: w?.placeId || null
    }))
}

// ====== ดึงรถผู้ใช้ ======
const fetchVehicles = async () => {
    try {
        const userVehicles = await $api('/vehicles')
        vehicles.value = userVehicles
        if (userVehicles.length > 0) {
            const def = userVehicles.find(v => v.isDefault) || userVehicles[0]
            if (!form.vehicleId) form.vehicleId = def.id
        }
    } catch (e) {
        console.error('Failed to fetch vehicles:', e)
    }
}

const closeAndRefresh = async () => {
    isModalOpen.value = false
    await fetchVehicles()
}

// ====== Helper สำหรับ Waypoints ======
function addWaypoint() {
    waypoints.value.push({ text: '' })
    waypointMetas.value.push({ lat: null, lng: null, name: null, address: null, placeId: null })
    nextTick(() => initWaypointAutocomplete(waypoints.value.length - 1))
}
function removeWaypoint(idx) {
    waypoints.value.splice(idx, 1)
    waypointMetas.value.splice(idx, 1)
    const ac = waypointAutocompletes[idx]
    if (ac?.unbindAll) ac.unbindAll()
    waypointAutocompletes.splice(idx, 1)
    waypointInputs.value.splice(idx, 1)
}

function initWaypointAutocomplete(idx) {
    if (!window.google?.maps?.places) return
    const el = waypointInputs.value[idx]
    if (!el) return
    const opts = { fields: ['place_id', 'name', 'formatted_address', 'geometry'], types: ['geocode', 'establishment'] }
    const ac = new google.maps.places.Autocomplete(el, opts)
    waypointAutocompletes[idx] = ac
    ac.addListener('place_changed', () => {
        const p = ac.getPlace()
        if (!p) return
        const lat = p.geometry?.location?.lat?.() ?? null
        const lng = p.geometry?.location?.lng?.() ?? null
        const name = p.name || stripLeadingPlusCode(stripCountry(p.formatted_address || '')) || waypoints.value[idx].text
        const address = stripCountry(p.formatted_address || name || '')
        waypoints.value[idx].text = name
        waypointMetas.value[idx] = { lat, lng, name, address, placeId: p.place_id || null }
    })
}

function initStartEndAutocomplete() {
    if (!window.google?.maps?.places) return
    geocoder = new google.maps.Geocoder()
    const tmpDiv = document.createElement('div')
    placesService = new google.maps.places.PlacesService(tmpDiv)
    const opts = { fields: ['place_id', 'name', 'formatted_address', 'geometry'], types: ['geocode', 'establishment'] }

    if (startInputEl.value) {
        if (startAutocomplete?.unbindAll) startAutocomplete.unbindAll()
        startAutocomplete = new google.maps.places.Autocomplete(startInputEl.value, opts)
        startAutocomplete.addListener('place_changed', () => {
            const p = startAutocomplete.getPlace()
            if (!p) return
            const lat = p.geometry?.location?.lat?.() ?? null
            const lng = p.geometry?.location?.lng?.() ?? null
            const name = p.name || stripLeadingPlusCode(stripCountry(p.formatted_address || '')) || form.startPoint
            const address = stripCountry(p.formatted_address || name || '')
            form.startPoint = name
            startMeta.value = { lat, lng, name, address, placeId: p.place_id || null }
        })
    }

    if (endInputEl.value) {
        if (endAutocomplete?.unbindAll) endAutocomplete.unbindAll()
        endAutocomplete = new google.maps.places.Autocomplete(endInputEl.value, opts)
        endAutocomplete.addListener('place_changed', () => {
            const p = endAutocomplete.getPlace()
            if (!p) return
            const lat = p.geometry?.location?.lat?.() ?? null
            const lng = p.geometry?.location?.lng?.() ?? null
            const name = p.name || stripLeadingPlusCode(stripCountry(p.formatted_address || '')) || form.endPoint
            const address = stripCountry(p.formatted_address || name || '')
            form.endPoint = name
            endMeta.value = { lat, lng, name, address, placeId: p.place_id || null }
        })
    }

    for (let i = 0; i < waypoints.value.length; i++) initWaypointAutocomplete(i)
}

// ====== Modal Map Picking ======
function openPlacePicker(field) {
    pickingField.value = field
    pickedPlace.value = { name: '', lat: null, lng: null }
    showPlacePicker.value = true

    nextTick(() => {
        let base
        if (field === 'start') base = startMeta.value
        else if (field === 'end') base = endMeta.value
        else if (String(field).startsWith('wp-')) {
            const idx = Number(String(field).split('-')[1] || -1)
            base = waypointMetas.value[idx] || {}
        }
        const hasMeta = base && base.lat != null && base.lng != null
        const center = hasMeta ? { lat: base.lat, lng: base.lng } : { lat: 13.7563, lng: 100.5018 }

        placePickerMap = new google.maps.Map(placePickerMapEl.value, {
            center, zoom: hasMeta ? 14 : 6,
            mapTypeControl: false, streetViewControl: false, fullscreenControl: false
        })
        placePickerMap.addListener('click', (e) => {
            const pos = e.latLng
            setPickerMarker(pos)
            resolvePicked(pos)
        })
    })
}

function normalizeWaypoints(raw) {
    if (Array.isArray(raw)) return raw
    if (raw && Array.isArray(raw.used)) return raw.used
    if (raw && Array.isArray(raw.requested)) return raw.requested
    return []
}

function setPickerMarker(latlng) {
    if (placePickerMarker) { placePickerMarker.setPosition(latlng); return }
    placePickerMarker = new google.maps.Marker({ position: latlng, map: placePickerMap, draggable: true })
    placePickerMarker.addListener('dragend', (e) => resolvePicked(e.latLng))
}
async function resolvePicked(latlng) {
    const lat = latlng.lat(), lng = latlng.lng()
    const geocodeRes = await new Promise((resolve) => {
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === 'OK' && results?.length) resolve(results[0]); else resolve(null)
        })
    })

    let display = '', addr = ''
    if (geocodeRes?.formatted_address) {
        addr = stripCountry(geocodeRes.formatted_address)
        display = stripLeadingPlusCode(addr)
    }
    if (geocodeRes?.place_id) {
        await new Promise((done) => {
            placesService.getDetails({ placeId: geocodeRes.place_id, fields: ['name'] }, (pl, st) => {
                if (st === google.maps.places.PlacesServiceStatus.OK && pl?.name) display = pl.name
                done()
            })
        })
    }
    if (!display || isPlusCode(display)) {
        const poi = await findNearestPoi(lat, lng, 150)
        if (poi?.place_id) {
            await new Promise((done) => {
                placesService.getDetails({ placeId: poi.place_id, fields: ['name', 'formatted_address'] }, (pl, st) => {
                    if (st === google.maps.places.PlacesServiceStatus.OK) {
                        const fa = stripCountry(pl?.formatted_address || display)
                        display = pl?.name || stripLeadingPlusCode(fa)
                        addr = fa || addr
                    }
                    done()
                })
            })
        } else if (geocodeRes?.formatted_address) {
            addr = stripCountry(geocodeRes.formatted_address)
            display = stripLeadingPlusCode(addr)
        }
    }
    pickedPlace.value = { name: display, address: addr || display, lat, lng }
}
function applyPickedPlace() {
    if (!pickingField.value || !pickedPlace.value.name) return
    const meta = {
        lat: pickedPlace.value.lat, lng: pickedPlace.value.lng,
        name: pickedPlace.value.name, address: pickedPlace.value.address || pickedPlace.value.name, placeId: null
    }
    if (pickingField.value === 'start') {
        form.startPoint = pickedPlace.value.name
        startMeta.value = meta
    } else if (pickingField.value === 'end') {
        form.endPoint = pickedPlace.value.name
        endMeta.value = meta
    } else if (String(pickingField.value).startsWith('wp-')) {
        const idx = Number(String(pickingField.value).split('-')[1] || -1)
        if (idx > -1) {
            waypoints.value[idx].text = pickedPlace.value.name
            waypointMetas.value[idx] = meta
        }
    }
    closePlacePicker()
}
function closePlacePicker() {
    showPlacePicker.value = false
    pickingField.value = null
    placePickerMarker = null
    placePickerMap = null
}

// ====== Utils ======
function isPlusCode(t) { return !!(t && /^[A-Z0-9]{4,}\+[A-Z0-9]{2,}/i.test(t.trim())) }
function stripCountry(t) { return (t || '').replace(/,?\s*(Thailand|ไทย)\s*$/i, '') }
function stripLeadingPlusCode(t) { return (t || '').replace(/^[A-Z0-9]{4,}\+[A-Z0-9]{2,}\s*,?\s*/i, '') }
function findNearestPoi(lat, lng, radius = 120) {
    return new Promise((resolve) => {
        if (!placesService) return resolve(null)
        placesService.nearbySearch({ location: { lat, lng }, radius }, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results?.length) resolve(results[0]); else resolve(null)
        })
    })
}

// ====== Submit (PUT /routes/:id) ======
const handleSubmit = async () => {
    if (isLoading.value) return

    // ไม่บังคับกรอกครบ: ใช้ค่าจาก original ถ้ายังไม่ได้แก้
    if (!original.value) {
        toast.error('เกิดข้อผิดพลาด', 'ยังโหลดข้อมูลเดิมไม่เสร็จ ลองอีกครั้ง')
        return
    }

    isLoading.value = true
    const departureTime = (form.date && form.time)
        ? new Date(`${form.date}T${form.time}`).toISOString()
        : (original.value?.departureTime || new Date().toISOString())

    const originalWpArr = normalizeWaypoints(original.value?.waypoints)
    
    const waypointsPayload = waypointMetas.value
        .map((m, i) => {
            const fallback = original.value?.waypoints?.[i] || {}
            const name = (m && m.name) || (waypoints.value[i] && waypoints.value[i].text) || fallback.name || fallback.address || null
            const address = (m && m.address) || (waypoints.value[i] && waypoints.value[i].text) || fallback.address || name || null
            const lat = m && m.lat != null ? Number(m.lat) : (fallback.lat ?? null)
            const lng = m && m.lng != null ? Number(m.lng) : (fallback.lng ?? null)
            if (!name && lat == null && lng == null) return null
            return { lat, lng, name, address }
        })
        .filter(Boolean)

    const payload = {
        vehicleId: form.vehicleId || original.value?.vehicleId,
        startLocation: {
            lat: startMeta.value.lat != null ? Number(startMeta.value.lat) : (original.value?.startLocation?.lat ?? null),
            lng: startMeta.value.lng != null ? Number(startMeta.value.lng) : (original.value?.startLocation?.lng ?? null),
            name: startMeta.value.name || form.startPoint || original.value?.startLocation?.name || original.value?.startLocation?.address || null,
            address: startMeta.value.address || form.startPoint || original.value?.startLocation?.address || original.value?.startLocation?.name || null
        },
        endLocation: {
            lat: endMeta.value.lat != null ? Number(endMeta.value.lat) : (original.value?.endLocation?.lat ?? null),
            lng: endMeta.value.lng != null ? Number(endMeta.value.lng) : (original.value?.endLocation?.lng ?? null),
            name: endMeta.value.name || form.endPoint || original.value?.endLocation?.name || original.value?.endLocation?.address || null,
            address: endMeta.value.address || form.endPoint || original.value?.endLocation?.address || original.value?.endLocation?.name || null
        },
        waypoints: waypointsPayload.length ? waypointsPayload : originalWpArr,
        optimizeWaypoints: true,
        departureTime,
        availableSeats: form.availableSeats != null ? Number(form.availableSeats) : (original.value?.availableSeats ?? null),
        pricePerSeat: form.pricePerSeat != null ? Number(form.pricePerSeat) : (original.value?.pricePerSeat ?? null),
        conditions: (form.conditions || original.value?.conditions || '')
    }

    try {
        const apiBase = (useRuntimeConfig().public.apiBase || 'http://localhost:3000/api').replace(/\/$/, '')
        // ดึง token จาก cookie/localStorage
        let token = ''
        try { const m = document.cookie.match(/(?:^|;\s*)token=([^;]+)/); if (m) token = decodeURIComponent(m[1]) } catch { }
        if (process.client && !token) { try { token = localStorage.getItem('token') || '' } catch { } }

        const res = await fetch(`${apiBase}/routes/${routeId}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify(payload),
            credentials: 'include'
        })

        let body
        try { body = await res.json() } catch {
            const text = await res.text()
            const err = new Error(text || 'Unexpected response from server')
            err.status = res.status
            throw err
        }

        if (!res.ok) {
            const err = new Error(body?.message || `Request failed with status ${res.status}`)
            err.status = res.status
            err.payload = body
            throw err
        }

        toast.success('อัปเดตสำเร็จ', body?.message || 'แก้ไขเส้นทางเรียบร้อยแล้ว!')
        setTimeout(() => { navigateTo('/myRoute') }, 1200)
    } catch (err) {
        console.error('Failed to update route:', err)
        const msg = String(err?.message || '')
        toast.error('เกิดข้อผิดพลาด', msg || 'ไม่สามารถอัปเดตเส้นทางได้')
    } finally {
        isLoading.value = false
    }
}

// ====== (ออปชัน) preload บางค่าแบบเบาๆ หากต้องการ สามารถเพิ่ม GET รายละเอียดเส้นทางได้ภายหลัง ======
onMounted(() => {
    fetchVehicles()
    loadRoute().catch(err => console.error(err))
    if (window.google?.maps?.places) {
        initStartEndAutocomplete()
        for (let i = 0; i < waypoints.value.length; i++) initWaypointAutocomplete(i)
    } else {
        window[GMAPS_CB] = () => {
            try { delete window[GMAPS_CB] } catch { }
            initStartEndAutocomplete()
            for (let i = 0; i < waypoints.value.length; i++) initWaypointAutocomplete(i)
        }
    }
})
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .6);
    display: flex;
    align-items: center;
    justify-content: center
}

.modal-content {
    background: #fff;
    border-radius: .75rem;
    max-width: 600px;
    width: 95%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / .1), 0 8px 10px -6px rgb(0 0 0 / .1)
}

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity .3s cubic-bezier(.52, .02, .19, 1.02)
}

.modal-fade-enter-active .modal-content,
.modal-fade-leave-active .modal-content {
    transition: all .3s cubic-bezier(.52, .02, .19, 1.02)
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0
}

.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
    transform: scale(.9) translateY(1rem)
}
</style>
