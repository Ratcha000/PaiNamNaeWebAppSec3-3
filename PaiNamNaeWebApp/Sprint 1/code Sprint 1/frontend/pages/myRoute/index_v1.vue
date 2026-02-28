<template>
    <div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="mb-8">
                <h2 class="text-2xl font-bold text-gray-900">คำขอจองเส้นทางของฉัน</h2>
                <p class="mt-2 text-gray-600">ดูและจัดการคำขอจองจากผู้โดยสารในเส้นทางที่คุณสร้าง</p>
            </div>

            <div class="bg-white border border-gray-300 rounded-lg shadow-md p-6 mb-8">
                <div class="flex flex-wrap gap-2">
                    <button v-for="tab in tabs" :key="tab.status" @click="activeTab = tab.status"
                        :class="['tab-button px-4 py-2 rounded-md font-medium', { 'active': activeTab === tab.status }]">
                        {{ tab.label }} ({{ getTripCount(tab.status) }})
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-2">
                    <div class="bg-white border border-gray-300 rounded-lg shadow-md">
                        <div class="p-6 border-b border-gray-300">
                            <h3 class="text-lg font-semibold text-gray-900">รายการคำขอจอง</h3>
                        </div>

                        <div v-if="isLoading" class="p-12 text-center text-gray-500">
                            <p>กำลังโหลดข้อมูล...</p>
                        </div>

                        <div v-else class="divide-y divide-gray-200">
                            <div v-if="filteredTrips.length === 0" class="p-12 text-center text-gray-500">
                                <p>ไม่พบรายการในหมวดหมู่นี้</p>
                            </div>

                            <div v-for="trip in filteredTrips" :key="trip.id"
                                class="trip-card p-6 cursor-pointer transition-colors duration-200 hover:bg-gray-50"
                                @click="toggleTripDetails(trip.id)">
                                <div class="flex items-start justify-between mb-4">
                                    <div class="flex-1">
                                        <div class="flex items-center justify-between">
                                            <h4 class="font-semibold text-gray-900 text-lg">
                                                {{ trip.origin }} → {{ trip.destination }}
                                            </h4>
                                            <span v-if="trip.status === 'pending'"
                                                class="status-badge status-pending">รอดำเนินการ</span>
                                            <span v-else-if="trip.status === 'confirmed'"
                                                class="status-badge status-confirmed">ยืนยันแล้ว</span>
                                            <span v-else-if="trip.status === 'rejected'"
                                                class="status-badge status-rejected">ปฏิเสธ</span>
                                            <span v-else-if="trip.status === 'cancelled'"
                                                class="status-badge status-cancelled">ยกเลิก</span>
                                        </div>
                                        <p class="text-sm text-gray-600 mt-1">จุดนัดพบ: {{ trip.pickupPoint }}</p>
                                        <p class="text-sm text-gray-600">วันที่: {{ trip.date }} เวลา: {{ trip.time }}
                                        </p>
                                    </div>
                                </div>

                                <div class="flex items-center space-x-4 mb-4">
                                    <img :src="trip.passenger.image" :alt="trip.passenger.name"
                                        class="w-15 h-15 rounded-full object-cover" />
                                    <div class="flex-1">
                                        <div class="flex items-center">
                                            <h5 class="font-medium text-gray-900">{{ trip.passenger.name }}</h5>

                                            <div v-if="trip.passenger.isVerified"
                                                class="relative group ml-1.5 flex items-center">
                                                <svg class="w-5 h-5 text-blue-600" viewBox="0 0 24 24"
                                                    fill="currentColor">
                                                    <path fill-rule="evenodd"
                                                        d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12c0 1.357-.6 2.573-1.549 3.397a4.49 4.49 0 01-1.307 3.498 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.07-.01l3.5-4.875z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                                <span
                                                    class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                    ผู้โดยสารยืนยันตัวตนแล้ว
                                                </span>
                                            </div>
                                        </div>

                                        <!-- <p v-if="trip.passenger.email" class="text-xs text-gray-500 mt-0.5">
                                                อีเมล:
                                                <a :href="`mailto:${trip.passenger.email}`"
                                                    class="text-blue-600 hover:underline" @click.stop>
                                                    {{ trip.passenger.email }}
                                                </a>
                                            </p> -->
                                        <div class="flex">
                                            <p v-if="trip.passenger.email" class="text-xs text-gray-500 mt-0.5">
                                                อีเมล:
                                                <a :href="`mailto:${trip.passenger.email}`"
                                                    class="text-blue-600 hover:underline" @click.stop>
                                                    {{ trip.passenger.email }}
                                                </a>
                                            </p>
                                            <button v-if="trip.passenger.email"
                                                class="ml-1 inline-flex items-center  rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                title="คัดลอกอีเมล" aria-label="คัดลอกอีเมล"
                                                @click.stop="copyEmail(trip.passenger.email)">
                                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor">

                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M8 7h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2z" />
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2" d="M16 7V5a2 2 0 00-2-2H8a2 2 0 00-2 2v2" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div class="flex items-center mt-1">
                                            <div class="flex text-yellow-400 text-sm">
                                                <span>
                                                    {{ '★'.repeat(Math.round(trip.passenger.rating)) }}{{ '☆'.repeat(5 -
                                                        Math.round(trip.passenger.rating)) }}
                                                </span>
                                            </div>
                                            <span class="ml-2 text-sm text-gray-600">
                                                {{ trip.passenger.rating }} ({{ trip.passenger.reviews }} รีวิว)
                                            </span>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <div class="text-lg font-bold text-blue-600">{{ trip.price }} บาท</div>
                                        <div class="text-sm text-gray-600">จำนวน {{ trip.seats }} ที่นั่ง</div>
                                    </div>
                                </div>

                                <div v-if="selectedTripId === trip.id"
                                    class="mt-4 mb-5 pt-4 border-t border-gray-300 animate-in slide-in-from-top duration-300">
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <h5 class="font-medium text-gray-900 mb-2">รายละเอียดเส้นทาง</h5>
                                            <ul class="text-sm text-gray-600 space-y-1">
                                                <li v-for="stop in trip.stops" :key="stop">• {{ stop }}</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 class="font-medium text-gray-900 mb-2">รายละเอียดรถ</h5>
                                            <ul class="text-sm text-gray-600 space-y-1">
                                                <li v-for="detail in trip.carDetails" :key="detail">• {{ detail }}</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="mt-4 space-y-4">
                                        <div v-if="trip.conditions">
                                            <h5 class="text-gray-900 font-medium mb-2">เงื่อนไขการเดินทาง</h5>
                                            <p
                                                class="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-300">
                                                {{ trip.conditions }}
                                            </p>
                                        </div>
                                        <div v-if="trip.photos && trip.photos.length > 0">
                                            <h5 class="text-gray-900 font-medium mb-2">รูปภาพรถยนต์</h5>
                                            <div class="grid grid-cols-3 gap-2 mt-2">
                                                <div v-for="(photo, index) in trip.photos.slice(0, 3)" :key="index">
                                                    <img :src="photo" alt="Vehicle photo"
                                                        class="w-full aspect-video object-cover rounded-lg shadow-sm cursor-pointer hover:opacity-90 transition-opacity" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="flex justify-end space-x-3" :class="{ 'mt-4': selectedTripId !== trip.id }">
                                    <template v-if="trip.status === 'pending'">
                                        <button @click.stop="openConfirmModal(trip, 'confirm')"
                                            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 text-sm">
                                            ยืนยันคำขอ
                                        </button>
                                        <button @click.stop="openConfirmModal(trip, 'reject')"
                                            class="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition duration-200 text-sm">
                                            ปฏิเสธ
                                        </button>
                                    </template>

                                    <button v-else-if="trip.status === 'confirmed'"
                                        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 text-sm">
                                        แชทกับผู้โดยสาร
                                    </button>

                                    <button v-else-if="['rejected', 'cancelled'].includes(trip.status)"
                                        @click.stop="openConfirmModal(trip, 'delete')"
                                        class="px-4 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 transition duration-200 text-sm">
                                        ลบรายการ
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="lg:col-span-1">
                    <div class="bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden sticky top-8">
                        <div class="p-3  border-gray-300">
                            <h3 class="text-lg font-semibold text-gray-900">แผนที่เส้นทาง</h3>
                            <p class="text-sm text-gray-600 mt-1">
                                {{ selectedTrip ? selectedTrip.origin + ' → ' + selectedTrip.destination :
                                    'คลิกที่รายการเพื่อดูเส้นทาง'
                                }}
                            </p>
                        </div>
                        <div ref="mapContainer" id="map"></div>
                    </div>
                </div>
            </div>
        </div>

        <ConfirmModal :show="isModalVisible" :title="modalContent.title" :message="modalContent.message"
            :confirmText="modalContent.confirmText" :variant="modalContent.variant" @confirm="handleConfirmAction"
            @cancel="closeConfirmModal" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/th'
import buddhistEra from 'dayjs/plugin/buddhistEra'
import ConfirmModal from '~/components/ConfirmModal.vue'
import { useToast } from '~/composables/useToast'

dayjs.locale('th')
dayjs.extend(buddhistEra)

const { $api } = useNuxtApp()
const { toast } = useToast()

// --- State Management ---
const activeTab = ref('pending')
const selectedTripId = ref(null)
const isLoading = ref(false)
const mapContainer = ref(null)
let map = null
let currentPolyline = null
let currentMarkers = []
const allTrips = ref([])

const tabs = [
    { status: 'pending', label: 'รอดำเนินการ' },
    { status: 'confirmed', label: 'ยืนยันแล้ว' },
    { status: 'rejected', label: 'ปฏิเสธ' },
    { status: 'cancelled', label: 'ยกเลิก' },
    { status: 'all', label: 'ทั้งหมด' },
]

definePageMeta({ middleware: 'auth' })

// --- Computed ---
const filteredTrips = computed(() => {
    if (activeTab.value === 'all') return allTrips.value
    return allTrips.value.filter(trip => trip.status === activeTab.value)
})
const selectedTrip = computed(() => {
    return allTrips.value.find(trip => trip.id === selectedTripId.value) || null
})

// --- Methods ---
async function fetchMyRoutes() {
    isLoading.value = true
    try {
        const routes = await $api('/routes/me')

        const formatted = []
        for (const r of routes) {
            const carDetailsList = []
            if (r.vehicle) {
                carDetailsList.push(`${r.vehicle.vehicleModel} (${r.vehicle.vehicleType})`)
                if (Array.isArray(r.vehicle.amenities) && r.vehicle.amenities.length > 0) {
                    carDetailsList.push(...r.vehicle.amenities)
                }
            } else {
                carDetailsList.push('ไม่มีข้อมูลรถ')
            }

            const coords = [[r.startLocation.lat, r.startLocation.lng], [r.endLocation.lat, r.endLocation.lng]]

            for (const b of (r.bookings || [])) {
                formatted.push({
                    id: b.id,
                    status: (b.status || '').toLowerCase(),
                    origin: `จาก Lat: ${r.startLocation.lat.toFixed(2)}`,
                    destination: `ถึง Lat: ${r.endLocation.lat.toFixed(2)}`,
                    pickupPoint: b.pickupLocation?.name || '-',
                    date: dayjs(r.departureTime).format('D MMMM BBBB'),
                    time: dayjs(r.departureTime).format('HH:mm น.'),
                    price: (r.pricePerSeat || 0) * (b.numberOfSeats || 0),
                    seats: b.numberOfSeats || 0,
                    passenger: {
                        name: `${b.passenger?.firstName || ''} ${b.passenger?.lastName || ''}`.trim() || 'ผู้โดยสาร',
                        image: b.passenger?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(b.passenger?.firstName || 'P')}&background=random&size=64`,
                        // [ADDED] เก็บ email และ isVerified (ยังไม่แสดง isVerified)
                        email: b.passenger?.email || '',
                        isVerified: !!b.passenger?.isVerified,
                        rating: 4.5,
                        reviews: Math.floor(Math.random() * 50) + 5,
                    },
                    coords,
                    stops: ['ไม่มีข้อมูลจุดแวะพัก'],
                    carDetails: carDetailsList,
                    conditions: r.conditions,
                    photos: r.vehicle?.photos || [],
                })
            }
        }
        allTrips.value = formatted
    } catch (error) {
        console.error('Failed to fetch routes:', error)
        allTrips.value = []
        toast.error('เกิดข้อผิดพลาด', error?.data?.message || 'ไม่สามารถโหลดข้อมูลได้')
    } finally {
        isLoading.value = false
    }
}

const getTripCount = (status) => {
    if (status === 'all') return allTrips.value.length
    return allTrips.value.filter(trip => trip.status === status).length
}

const toggleTripDetails = (tripId) => {
    const tripForMap = allTrips.value.find(trip => trip.id === tripId)
    if (tripForMap) updateMap(tripForMap)
    selectedTripId.value = selectedTripId.value === tripId ? null : tripId
}

const updateMap = (trip) => {
    if (!map || !trip) return
    if (currentPolyline) map.removeLayer(currentPolyline)
    currentMarkers.forEach(marker => map.removeLayer(marker))
    currentMarkers = []
    currentPolyline = L.polyline(trip.coords, { color: '#3b82f6', weight: 4 }).addTo(map)
    const startMarker = L.marker(trip.coords[0]).bindPopup('จุดเริ่มต้น').addTo(map)
    const endMarker = L.marker(trip.coords[trip.coords.length - 1]).bindPopup('จุดปลายทาง').addTo(map)
    currentMarkers.push(startMarker, endMarker)
    map.fitBounds(currentPolyline.getBounds(), { padding: [40, 40] })
}

// --- Modal ---
const isModalVisible = ref(false)
const tripToAction = ref(null)
const modalContent = ref({ title: '', message: '', confirmText: '', action: null, variant: 'danger' })

const openConfirmModal = (trip, action) => {
    tripToAction.value = trip
    if (action === 'confirm') {
        modalContent.value = {
            title: 'ยืนยันคำขอจอง',
            message: `ยืนยันคำขอของผู้โดยสาร "${trip.passenger.name}" ใช่หรือไม่?`,
            confirmText: 'ยืนยันคำขอ',
            action: 'confirm',
            variant: 'primary',
        }
    } else if (action === 'reject') {
        modalContent.value = {
            title: 'ปฏิเสธคำขอจอง',
            message: `ต้องการปฏิเสธคำขอของ "${trip.passenger.name}" ใช่หรือไม่?`,
            confirmText: 'ปฏิเสธ',
            action: 'reject',
            variant: 'danger',
        }
    } else if (action === 'delete') {
        modalContent.value = {
            title: 'ยืนยันการลบรายการ',
            message: `ต้องการลบคำขอนี้ออกจากรายการใช่หรือไม่?`,
            confirmText: 'ลบรายการ',
            action: 'delete',
            variant: 'danger',
        }
    }
    isModalVisible.value = true
}

const closeConfirmModal = () => {
    isModalVisible.value = false
    tripToAction.value = null
}

const handleConfirmAction = async () => {
    if (!tripToAction.value) return
    const action = modalContent.value.action
    const bookingId = tripToAction.value.id
    try {
        if (action === 'confirm') {
            await $api(`/bookings/${bookingId}/status`, { method: 'PATCH', body: { status: 'CONFIRMED' } })
            toast.success('สำเร็จ', 'ยืนยันคำขอแล้ว')
        } else if (action === 'reject') {
            await $api(`/bookings/${bookingId}/status`, { method: 'PATCH', body: { status: 'REJECTED' } })
            toast.success('สำเร็จ', 'ปฏิเสธคำขอแล้ว')
        } else if (action === 'delete') {
            console.log(`Delete booking ${bookingId} (TODO)`)
        }
        closeConfirmModal()
        await fetchMyRoutes()
    } catch (error) {
        console.error(`Failed to ${action} booking:`, error)
        toast.error('เกิดข้อผิดพลาด', error?.data?.message || 'ไม่สามารถดำเนินการได้')
        closeConfirmModal()
    }
}

const copyEmail = async (email) => {
    try {
        await navigator.clipboard.writeText(email)
        toast.success('คัดลอกแล้ว', email)
    } catch (e) {
        toast.error('คัดลอกไม่สำเร็จ', 'ลองใหม่อีกครั้ง')
    }
}

// --- Lifecycle ---
useHead({
    title: 'คำขอจองเส้นทางของฉัน - ไปนำแหน่',
    link: [{ rel: 'stylesheet', href: 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css' }],
    script: [{ src: 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js', defer: true }]
})

onMounted(() => {
    fetchMyRoutes()
    const checkLeaflet = setInterval(() => {
        if (typeof L !== 'undefined') {
            clearInterval(checkLeaflet)
            nextTick(() => {
                if (mapContainer.value && !map) {
                    map = L.map(mapContainer.value).setView([13.7563, 100.5018], 6)
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '© OpenStreetMap contributors'
                    }).addTo(map)
                }
            })
        }
    }, 100)
})

watch(activeTab, () => {
    selectedTripId.value = null
    if (filteredTrips.value.length > 0) updateMap(filteredTrips.value[0])
})
</script>

<style scoped>
/* (สไตล์ทั้งหมดคงเดิม) */
.trip-card {
    transition: all 0.3s ease;
    cursor: pointer;
}

.trip-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.1);
}

.tab-button {
    transition: all 0.3s ease;
}

.tab-button.active {
    background-color: #3b82f6;
    color: white;
    box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3);
}

.tab-button:not(.active) {
    background-color: white;
    color: #6b7280;
    border: 1px solid #d1d5db;
}

.tab-button:not(.active):hover {
    background-color: #f9fafb;
    color: #374151;
}

#map {
    height: 100%;
    min-height: 600px;
    border-radius: 0 0 0.5rem 0.5rem;
}

.status-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 500;
}

.status-pending {
    background-color: #fef3c7;
    color: #d97706;
}

.status-confirmed {
    background-color: #d1fae5;
    color: #065f46;
}

.status-rejected {
    background-color: #fee2e2;
    color: #dc2626;
}

.status-cancelled {
    background-color: #f3f4f6;
    color: #6b7280;
}

@keyframes slide-in-from-top {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-in {
    animation-fill-mode: both;
}

.slide-in-from-top {
    animation-name: slide-in-from-top;
}

.duration-300 {
    animation-duration: 300ms;
}
</style>
