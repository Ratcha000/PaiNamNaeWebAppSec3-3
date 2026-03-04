<template>
    <div>
        <AdminHeader />
        <AdminSidebar />

        <main id="main-content" class="main-content mt-16 ml-0 lg:ml-[280px] p-6">
            <!-- Back -->
            <div class="mb-8">
                <NuxtLink to="/admin/bookings"
                    class="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                    <i class="fa-solid fa-arrow-left"></i>
                    <span>ย้อนกลับ</span>
                </NuxtLink>
            </div>

            <div class="mx-auto max-w-8xl">
                <!-- Title -->
                <div class="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div class="flex items-center gap-3">
                        <h1 class="text-2xl font-semibold text-gray-800">รายละเอียดการจอง</h1>
                        <span class="text-sm text-gray-500">ดูข้อมูลทั้งหมดของ Booking</span>
                    </div>
                    <!-- ที่วางปุ่ม/สวิตช์ในอนาคต -->
                </div>

                <!-- Card หลัก -->
                <div class="bg-white border border-gray-300 rounded-lg shadow-sm">
                    <div class="px-4 py-4 border-b border-gray-200 sm:px-6">
                        <h2 class="font-medium text-gray-800">ข้อมูลการจอง</h2>
                    </div>

                    <!-- Loading / Error -->
                    <div v-if="isLoading" class="p-8 text-center text-gray-500">กำลังโหลดข้อมูล...</div>
                    <div v-else-if="loadError" class="p-8 text-center text-red-600">{{ loadError }}</div>

                    <!-- Content -->
                    <div v-else class="grid grid-cols-1 gap-6 p-4 sm:p-6 text-[15px]">
                        <div class="w-full max-w-[80rem] mx-auto space-y-6">

                            <!-- แผนที่เส้นทาง -->
                            <section>
                                <h3 class="mb-3 text-sm font-semibold text-gray-700">แผนที่เส้นทาง</h3>
                                <div class="overflow-hidden border border-gray-300 rounded-lg">
                                    <div ref="mapEl" class="w-full" style="height: 400px;"></div>
                                </div>
                                <p class="mt-2 text-xs text-gray-500">
                                    หมุด <span class="font-medium">A</span> = ต้นทางเส้นทาง •
                                    หมุด <span class="font-medium">B</span> = ปลายทางเส้นทาง •
                                    หมุด <span class="font-medium">สีม่วง</span> = จุดรับผู้โดยสาร •
                                    หมุด <span class="font-medium">สีส้ม</span> = จุดส่งผู้โดยสาร
                                </p>
                            </section>

                            <!-- สรุปการจอง -->
                            <section>
                                <h3 class="mb-3 text-sm font-semibold text-gray-700">สรุปการจอง</h3>
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">Booking ID</label>
                                        <div
                                            class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                                            {{ booking?.id || '-' }}
                                        </div>
                                    </div>
                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">จำนวนที่นั่ง</label>
                                        <div
                                            class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                                            {{ booking?.numberOfSeats ?? '-' }}
                                        </div>
                                    </div>
                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">สถานะ</label>
                                        <div class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50">
                                            <span
                                                class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full"
                                                :class="statusBadge(booking?.status)">
                                                <i class="mr-1 fa-solid" :class="statusIcon(booking?.status)"></i>
                                                {{ booking?.status || '-' }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <!-- จุดรับ/จุดส่ง -->
                            <section>
                                <h3 class="mb-3 text-sm font-semibold text-gray-700">จุดรับ / จุดส่ง</h3>
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label
                                            class="block mb-1 text-xs font-medium text-gray-600">จุดรับผู้โดยสาร</label>
                                        <div
                                            class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                                            {{ poiText(booking?.pickupLocation) }}
                                            <div v-if="booking?.pickupLocation?.address"
                                                class="mt-1 text-xs text-gray-500">
                                                {{ cleanAddr(booking.pickupLocation.address) }}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            class="block mb-1 text-xs font-medium text-gray-600">จุดส่งผู้โดยสาร</label>
                                        <div
                                            class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                                            {{ poiText(booking?.dropoffLocation) }}
                                            <div v-if="booking?.dropoffLocation?.address"
                                                class="mt-1 text-xs text-gray-500">
                                                {{ cleanAddr(booking.dropoffLocation.address) }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <!-- รายละเอียดเส้นทาง (จาก booking.route) -->
                            <section>
                                <h3 class="mb-3 text-sm font-semibold text-gray-700">รายละเอียดเส้นทาง</h3>
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">จุดเริ่มต้น</label>
                                        <div
                                            class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                                            {{ routeData?.originName || '-' }}
                                            <div v-if="routeData?.originAddress" class="mt-1 text-xs text-gray-500">
                                                {{ routeData.originAddress }}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">จุดปลายทาง</label>
                                        <div
                                            class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                                            {{ routeData?.destinationName || '-' }}
                                            <div v-if="routeData?.destinationAddress"
                                                class="mt-1 text-xs text-gray-500">
                                                {{ routeData.destinationAddress }}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-3">
                                    <div>
                                        <label
                                            class="block mb-1 text-xs font-medium text-gray-600">วัน-เวลาออกเดินทาง</label>
                                        <div class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50">
                                            <div class="text-gray-900">
                                                {{ routeData?.date || '-' }} {{ routeData?.departureTime || '' }}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">ราคา/ที่นั่ง</label>
                                        <div
                                            class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                                            {{ routeData?.price != null ? `${routeData.price} บาท` : '-' }}
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            class="block mb-1 text-xs font-medium text-gray-600">ที่นั่งคงเหลือ</label>
                                        <div
                                            class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                                            {{ routeData?.availableSeats ?? '-' }}
                                        </div>
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2">
                                    <div>
                                        <label
                                            class="block mb-1 text-xs font-medium text-gray-600">ระยะเวลาโดยประมาณ</label>
                                        <div
                                            class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                                            {{ routeData?.durationText || '-' }}
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            class="block mb-1 text-xs font-medium text-gray-600">ระยะทางโดยประมาณ</label>
                                        <div
                                            class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                                            {{ routeData?.distanceText || '-' }}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <!-- ผู้ขับขี่ -->
                            <section>
                                <h3 class="mb-3 text-sm font-semibold text-gray-700">ผู้ขับขี่</h3>
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">ชื่อผู้ขับ</label>
                                        <div
                                            class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                                            {{ routeData?.driver?.name || '-' }}
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            class="block mb-1 text-xs font-medium text-gray-600">การยืนยันตัวตน</label>
                                        <div
                                            class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                                            {{ routeData?.driver?.isVerified ? 'ยืนยันแล้ว' : 'ยังไม่ยืนยัน' }}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <!-- รายละเอียดรถ -->
                            <section>
                                <h3 class="mb-3 text-sm font-semibold text-gray-700">รายละเอียดรถ</h3>
                                <div class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50">
                                    <template v-if="routeData?.carDetails?.length">
                                        <ul class="space-y-1 text-gray-700">
                                            <li v-for="(d, idx) in routeData.carDetails" :key="idx">• {{ d }}</li>
                                        </ul>
                                    </template>
                                    <template v-else>
                                        <div class="text-gray-500">— ไม่มีข้อมูลรถ —</div>
                                    </template>
                                </div>
                            </section>

                            <!-- เงื่อนไข -->
                            <section v-if="routeData?.conditions">
                                <h3 class="mb-3 text-sm font-semibold text-gray-700">เงื่อนไขการเดินทาง</h3>
                                <div
                                    class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                                    {{ routeData.conditions }}
                                </div>
                            </section>

                            <!-- ผู้โดยสาร -->
                            <section>
                                <h3 class="mb-3 text-sm font-semibold text-gray-700">ผู้โดยสาร</h3>
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">ชื่อ-สกุล</label>
                                        <div
                                            class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                                            {{ passengerName || '-' }}
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            class="block mb-1 text-xs font-medium text-gray-600">การยืนยันตัวตน</label>
                                        <div
                                            class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                                            {{ (booking?.passenger?.isVerified ? 'ยืนยันแล้ว' : 'ยังไม่ยืนยัน') || '-'
                                            }}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <!-- ระบบ -->
                            <section>
                                <h3 class="mb-3 text-sm font-semibold text-gray-700">ระบบ</h3>
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">สร้างเมื่อ</label>
                                        <div
                                            class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                                            {{ formatDate(booking?.createdAt, true) }}
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            class="block mb-1 text-xs font-medium text-gray-600">ปรับปรุงล่าสุด</label>
                                        <div
                                            class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                                            {{ formatDate(booking?.updatedAt || routeData?.updatedAt, true) }}
                                        </div>
                                    </div>
                                </div>
                            </section>

                        </div>
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
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import { useRoute, useRuntimeConfig, useCookie } from '#app'
import AdminHeader from '~/components/admin/AdminHeader.vue'
import AdminSidebar from '~/components/admin/AdminSidebar.vue'
import dayjs from 'dayjs'
import 'dayjs/locale/th'
import buddhistEra from 'dayjs/plugin/buddhistEra'

dayjs.locale('th')
dayjs.extend(buddhistEra)

definePageMeta({ middleware: ['admin-auth'] })
useHead({
    title: 'ดูรายละเอียดการจอง • Admin',
    link: [{ rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css' }]
})

const route = useRoute()
const isLoading = ref(true)
const loadError = ref('')
const booking = ref(null)      // booking raw
const routeData = ref(null)    // mapped route for UI (เหมือนไฟล์อ้างอิง)

const passengerName = computed(() => {
    const p = booking.value?.passenger
    if (!p) return ''
    return `${p.firstName || ''} ${p.lastName || ''}`.trim()
})

/* ---------- Map ---------- */
const mapEl = ref(null)
let gmap = null
let activePolyline = null
let startMarker = null
let endMarker = null
let pickupMarker = null
let dropoffMarker = null
const mapReady = ref(false)

const GMAPS_CB = '__gmapsReadyAdminBooking__'
const config = useRuntimeConfig()

function cleanAddr(a) {
    return (a || '').replace(/,?\s*(Thailand|ไทย|ประเทศ)\s*$/i, '').replace(/\s{2,}/g, ' ').trim()
}
function formatDate(iso, withTime = false) {
    if (!iso) return '-'
    return withTime ? dayjs(iso).format('D MMM BBBB HH:mm') : dayjs(iso).format('D MMM BBBB')
}
function poiText(p) {
    if (!p) return '-'
    const name = p.name || ''
    if (name) return name
    if (typeof p.lat === 'number' && typeof p.lng === 'number') return `(${p.lat.toFixed(6)}, ${p.lng.toFixed(6)})`
    return '-'
}
function statusBadge(s) {
    if (s === 'PENDING') return 'bg-amber-100 text-amber-700'
    if (s === 'CONFIRMED') return 'bg-green-100 text-green-700'
    if (s === 'CANCELLED') return 'bg-red-100 text-red-700'
    if (s === 'REJECTED') return 'bg-gray-200 text-gray-700'
    return 'bg-gray-100 text-gray-700'
}
function statusIcon(s) {
    if (s === 'PENDING') return 'fa-clock'
    if (s === 'CONFIRMED') return 'fa-circle-check'
    if (s === 'CANCELLED') return 'fa-triangle-exclamation'
    if (s === 'REJECTED') return 'fa-circle-xmark'
    return 'fa-circle'
}

/* ---- helpers copied style from referenced page ---- */
function formatDistance(input, distanceMeters) {
    if (typeof input === 'string' && input.includes('+')) {
        const parts = input.split('+'); let meters = 0
        for (const seg of parts) {
            const n = parseFloat(seg.replace(/[^\d.]/g, '')); if (Number.isNaN(n)) continue
            if (/กม/.test(seg)) meters += n * 1000
            else if (/เมตร|ม\./.test(seg)) meters += n
            else meters += n
        }
        if (meters >= 1000) {
            const km = Math.round((meters / 1000) * 10) / 10
            return `${(km % 1 === 0 ? km.toFixed(0) : km)} กม.`
        }
        return `${Math.round(meters)} ม.`
    }
    if (typeof distanceMeters === 'number') {
        if (distanceMeters >= 1000) {
            const km = Math.round((distanceMeters / 1000) * 10) / 10
            return `${(km % 1 === 0 ? km.toFixed(0) : km)} กม.`
        }
        return `${Math.round(distanceMeters)} ม.`
    }
    return input || '-'
}
function formatDurationText(input, seconds) {
    if (typeof input === 'string' && input.includes('+')) {
        const parts = input.split('+'); let minutes = 0
        for (const seg of parts) {
            const n = parseFloat(seg.replace(/[^\d.]/g, '')); if (Number.isNaN(n)) continue
            if (/ชม/.test(seg)) minutes += n * 60
            else minutes += n
        }
        const h = Math.floor(minutes / 60); const m = Math.round(minutes % 60)
        return h ? (m ? `${h} ชม. ${m} นาที` : `${h} ชม.`) : `${m} นาที`
    }
    if (typeof seconds === 'number') {
        const minutes = Math.round(seconds / 60)
        const h = Math.floor(minutes / 60); const m = minutes % 60
        return h ? (m ? `${h} ชม. ${m} นาที` : `${h} ชม.`) : `${m} นาที`
    }
    return input || '-'
}

function initializeMap() {
    if (!mapEl.value || gmap) return
    gmap = new google.maps.Map(mapEl.value, {
        center: { lat: 13.7563, lng: 100.5018 }, zoom: 6,
        mapTypeControl: false, streetViewControl: false, fullscreenControl: true
    })
    mapReady.value = true
    setTimeout(() => { google.maps.event.trigger(gmap, 'resize') }, 0)
}
function clearMap() {
    if (activePolyline) { activePolyline.setMap(null); activePolyline = null }
    if (startMarker) { startMarker.setMap(null); startMarker = null }
    if (endMarker) { endMarker.setMap(null); endMarker = null }
    if (pickupMarker) { pickupMarker.setMap(null); pickupMarker = null }
    if (dropoffMarker) { dropoffMarker.setMap(null); dropoffMarker = null }
}
async function drawOnMap() {
    if (!gmap || !booking.value) return

    clearMap()

    const r = booking.value.route || {}
    const start = r.startLocation || {}
    const end = r.endLocation || {}
    const pickup = booking.value.pickupLocation || {}
    const dropoff = booking.value.dropoffLocation || {}

    // route endpoints
    if (typeof start.lat === 'number' && typeof start.lng === 'number') {
        startMarker = new google.maps.Marker({ position: { lat: start.lat, lng: start.lng }, map: gmap, label: 'A' })
    }
    if (typeof end.lat === 'number' && typeof end.lng === 'number') {
        endMarker = new google.maps.Marker({ position: { lat: end.lat, lng: end.lng }, map: gmap, label: 'B' })
    }

    // booking pickup/dropoff markers
    if (typeof pickup.lat === 'number' && typeof pickup.lng === 'number') {
        pickupMarker = new google.maps.Marker({
            position: { lat: pickup.lat, lng: pickup.lng }, map: gmap,
            icon: 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png',
            title: pickup.name || 'Pickup'
        })
    }
    if (typeof dropoff.lat === 'number' && typeof dropoff.lng === 'number') {
        dropoffMarker = new google.maps.Marker({
            position: { lat: dropoff.lat, lng: dropoff.lng }, map: gmap,
            icon: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png',
            title: dropoff.name || 'Dropoff'
        })
    }

    // polyline
    const polyline = r.routePolyline || r.landmarks?.overview_polyline
    const bounds = new google.maps.LatLngBounds()
    if (polyline && google.maps.geometry?.encoding) {
        const path = google.maps.geometry.encoding.decodePath(polyline)
        activePolyline = new google.maps.Polyline({
            path, map: gmap, strokeColor: '#2563eb', strokeOpacity: 0.9, strokeWeight: 5
        })
        path.forEach(p => bounds.extend(p))
    }
    ;[start, end, pickup, dropoff].forEach(p => {
        if (typeof p.lat === 'number' && typeof p.lng === 'number') {
            bounds.extend(new google.maps.LatLng(p.lat, p.lng))
        }
    })

    if (!bounds.isEmpty()) {
        gmap.fitBounds(bounds)
        setTimeout(() => { google.maps.event.trigger(gmap, 'resize'); gmap.fitBounds(bounds) }, 0)
    }
}

/* ---------- fetch ---------- */
async function fetchBooking() {
    isLoading.value = true
    loadError.value = ''
    try {
        const id = route.params.id
        const apiBase = useRuntimeConfig().public.apiBase
        const token = useCookie('token')?.value || (process.client ? localStorage.getItem('token') : '')

        const res = await fetch(`${apiBase}/bookings/admin/${id}`, {
            method: 'GET',
            headers: { Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            credentials: 'include'
        })

        let body
        try { body = await res.json() } catch {
            const txt = await res.text(); const e = new Error(txt || 'Unexpected response from server'); e.status = res.status; throw e
        }
        if (!res.ok) { const e = new Error(body?.message || `Request failed with status ${res.status}`); e.status = res.status; e.payload = body; throw e }

        booking.value = body?.data || null
        if (!booking.value) throw new Error('Invalid response: missing data')

        const r = booking.value.route || {}

        // map route to UI shape เหมือนไฟล์อ้างอิง
        routeData.value = {
            id: r.id,
            originName: r.startLocation?.name || (r.startLocation?.lat != null ? `(${r.startLocation.lat.toFixed(2)}, ${r.startLocation.lng.toFixed(2)})` : '-'),
            destinationName: r.endLocation?.name || (r.endLocation?.lat != null ? `(${r.endLocation.lat.toFixed(2)}, ${r.endLocation.lng.toFixed(2)})` : '-'),
            originAddress: r.startLocation?.address ? cleanAddr(r.startLocation.address) : null,
            destinationAddress: r.endLocation?.address ? cleanAddr(r.endLocation.address) : null,

            availableSeats: r.availableSeats,
            price: r.pricePerSeat,
            departureTime: r.departureTime ? dayjs(r.departureTime).format('HH:mm น.') : '-',
            date: r.departureTime ? dayjs(r.departureTime).format('D MMMM BBBB') : '-',

            durationText: formatDurationText(r.duration, r.durationSeconds),
            distanceText: formatDistance(r.distance, r.distanceMeters),

            polyline: r.routePolyline || r.landmarks?.overview_polyline || null,

            conditions: r.conditions,

            carDetails: r.vehicle
                ? [`${r.vehicle.vehicleModel} (${r.vehicle.vehicleType})`, ...(r.vehicle.amenities || [])]
                : [],

            driver: {
                name: `${r.driver?.firstName || ''} ${r.driver?.lastName || ''}`.trim() || 'ไม่ระบุชื่อ',
                isVerified: !!r.driver?.isVerified
            },

            createdAt: r.createdAt,
            updatedAt: r.updatedAt
        }

        if (window.google?.maps) {
            drawOnMap()
        }
    } catch (err) {
        console.error(err)
        loadError.value = err?.message || 'ไม่สามารถโหลดข้อมูลการจองได้'
        booking.value = null
    } finally {
        isLoading.value = false
    }
}

/* ---------- layout scripts (เหมือนหน้าอ้างอิง) ---------- */
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
            drawOnMap()
        }
    }
    window.addEventListener('resize', window.__adminResizeHandler__)
}
function cleanupGlobalScripts() {
    window.removeEventListener('resize', window.__adminResizeHandler__ || (() => { }))
    delete window.__adminResizeHandler__
}
function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar')
    const overlay = document.getElementById('overlay')
    if (!sidebar || !overlay) return
    sidebar.classList.remove('mobile-open'); overlay.classList.add('hidden')
}

watch(isLoading, async (loading) => {
    if (loading === false) {
        await nextTick()
        if (!gmap && window.google?.maps) initializeMap()
        if (booking.value && window.google?.maps) drawOnMap()
    }
})

onMounted(async () => {
    defineGlobalScripts()
    if (typeof window.__adminResizeHandler__ === 'function') window.__adminResizeHandler__()

    // โหลด Google Maps ถ้ายังไม่ถูกโหลด
    if (!window.google?.maps) {
        const s = document.createElement('script')
        s.src = `https://maps.googleapis.com/maps/api/js?key=${config.public.googleMapsApiKey}&libraries=places,geometry&callback=${GMAPS_CB}`
        s.async = true; s.defer = true
        window[GMAPS_CB] = () => {
            try { delete window[GMAPS_CB] } catch { }
            initializeMap()
            fetchBooking().then(() => { drawOnMap() })
        }
        document.head.appendChild(s)
    } else {
        initializeMap()
        await fetchBooking()
        drawOnMap()
    }
})

onUnmounted(() => {
    cleanupGlobalScripts()
    clearMap()
})
</script>

<style>
.main-content {
    transition: margin-left 0.3s ease;
}
</style>
