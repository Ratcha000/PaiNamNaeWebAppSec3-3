<template>
    <div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="mb-8">
                <h2 class="text-2xl font-bold text-gray-900">การเดินทางของฉัน</h2>
                <p class="mt-2 text-gray-600">จัดการและติดตามการเดินทางทั้งหมดของคุณ</p>
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
                            <h3 class="text-lg font-semibold text-gray-900">รายการการเดินทาง</h3>
                        </div>

                        <div v-if="isLoading" class="p-12 text-center text-gray-500">
                            <p>กำลังโหลดข้อมูลการเดินทาง...</p>
                        </div>

                        <div v-else class="divide-y divide-gray-200">
                            <div v-if="filteredTrips.length === 0" class="p-12 text-center text-gray-500">
                                <p>ไม่พบรายการเดินทางในหมวดหมู่นี้</p>
                            </div>

                            <div v-for="trip in filteredTrips" :key="trip.id"
                                class="trip-card p-6 cursor-pointer transition-colors duration-200 hover:bg-gray-50"
                                @click="toggleTripDetails(trip.id)">

                                <div class="flex items-start justify-between mb-4">
                                    <div class="flex-1">
                                        <div class="flex items-center justify-between">
                                            <h4 class="font-semibold text-gray-900 text-lg">{{ trip.origin }} → {{
                                                trip.destination }}</h4>
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
                                    <img :src="trip.driver.image" :alt="trip.driver.name"
                                        class="w-12 h-12 rounded-full object-cover">
                                    <div class="flex-1">
                                        <h5 class="font-medium text-gray-900">{{ trip.driver.name }}</h5>
                                        <div class="flex items-center">
                                            <div class="flex text-yellow-400 text-sm">
                                                <span>{{ '★'.repeat(Math.round(trip.driver.rating)) }}{{ '☆'.repeat(5 -
                                                    Math.round(trip.driver.rating)) }}</span>
                                            </div>
                                            <span class="ml-2 text-sm text-gray-600">{{ trip.driver.rating }} ({{
                                                trip.driver.reviews }} รีวิว)</span>
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
                                            <h5 class="font-medium text-gray-900 mb-2">เงื่อนไขการเดินทาง</h5>
                                            <p
                                                class="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-300">
                                                {{ trip.conditions }}
                                            </p>
                                        </div>
                                        <div v-if="trip.photos && trip.photos.length > 0">
                                            <h5 class="font-medium text-gray-900 mb-2">รูปภาพรถยนต์</h5>
                                            <div class="grid grid-cols-3 gap-2 mt-2">
                                                <div v-for="(photo, index) in trip.photos.slice(0, 3)" :key="index">
                                                    <img :src="photo" alt="Vehicle photo"
                                                        class="w-full aspect-video object-cover rounded-lg shadow-sm cursor-pointer hover:opacity-90 transition-opacity">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="flex justify-end space-x-3 "
                                    :class="{ 'mt-4': selectedTripId !== trip.id }">
                                    <button v-if="trip.status === 'pending'"
                                        @click.stop="openConfirmModal(trip, 'cancel')"
                                        class="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition duration-200 text-sm">
                                        ยกเลิกการจอง
                                    </button>
                                    <button v-if="trip.status === 'confirmed'"
                                        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 text-sm">
                                        แชทกับผู้ขับ
                                    </button>
                                    <button v-if="['rejected', 'cancelled'].includes(trip.status)"
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
                            <p class="text-sm text-gray-600 mt-1">{{ selectedTrip ? selectedTrip.origin + ' → ' +
                                selectedTrip.destination : 'คลิกที่รายการเพื่อดูเส้นทาง' }}</p>
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
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import ConfirmModal from '~/components/ConfirmModal.vue';
import { useToast } from '~/composables/useToast';

// Setup dayjs for Thai locale
dayjs.locale('th');
dayjs.extend(buddhistEra);

const { $api } = useNuxtApp();
const { toast } = useToast();

// --- State Management ---
const activeTab = ref('pending');
const selectedTripId = ref(null);
const isLoading = ref(false);
const mapContainer = ref(null);
let map = null;
let currentPolyline = null;
let currentMarkers = [];
const allTrips = ref([]);

const tabs = [
    { status: 'pending', label: 'รอดำเนินการ' },
    { status: 'confirmed', label: 'ยืนยันแล้ว' },
    { status: 'rejected', label: 'ปฏิเสธ' },
    { status: 'cancelled', label: 'ยกเลิก' },
    { status: 'all', label: 'ทั้งหมด' },
];

definePageMeta({ middleware: 'auth' })

// --- Computed Properties ---
const filteredTrips = computed(() => {
    if (activeTab.value === 'all') return allTrips.value;
    return allTrips.value.filter(trip => trip.status === activeTab.value);
});

const selectedTrip = computed(() => {
    return allTrips.value.find(trip => trip.id === selectedTripId.value) || null;
});

// --- Methods ---

async function fetchMyTrips() {
    isLoading.value = true;
    try {
        const bookings = await $api('/bookings/me');
        const formattedTrips = bookings.map(booking => {
            const driverData = {
                name: `${booking.route.driver.firstName} ${booking.route.driver.lastName}`,
                image: booking.route.driver.profilePicture || `https://ui-avatars.com/api/?name=${booking.route.driver.firstName}&background=random&size=64`,
                rating: 4.5,
                reviews: Math.floor(Math.random() * 50) + 5,
            };

            const carDetailsList = [];
            if (booking.route.vehicle) {
                carDetailsList.push(`${booking.route.vehicle.vehicleModel} (${booking.route.vehicle.vehicleType})`);
                if (booking.route.vehicle.amenities && booking.route.vehicle.amenities.length > 0) {
                    carDetailsList.push(...booking.route.vehicle.amenities);
                }
            } else {
                carDetailsList.push('ไม่มีข้อมูลรถ');
            }

            return {
                id: booking.id,
                status: booking.status.toLowerCase(),
                origin: `จาก Lat: ${booking.route.startLocation.lat.toFixed(2)}`,
                destination: `ถึง Lat: ${booking.route.endLocation.lat.toFixed(2)}`,
                pickupPoint: booking.pickupLocation.name,
                date: dayjs(booking.route.departureTime).format('D MMMM BBBB'),
                time: dayjs(booking.route.departureTime).format('HH:mm น.'),
                price: booking.route.pricePerSeat * booking.numberOfSeats,
                seats: booking.numberOfSeats,
                driver: driverData,
                coords: [
                    [booking.route.startLocation.lat, booking.route.startLocation.lng],
                    [booking.route.endLocation.lat, booking.route.endLocation.lng]
                ],
                stops: ['ไม่มีข้อมูลจุดแวะพัก'],
                carDetails: carDetailsList,
                conditions: booking.route.conditions,
                photos: booking.route.vehicle?.photos,
            };
        });
        allTrips.value = formattedTrips;
    } catch (error) {
        console.error("Failed to fetch my trips:", error);
        allTrips.value = [];
    } finally {
        isLoading.value = false;
    }
}

const getTripCount = (status) => {
    if (status === 'all') return allTrips.value.length;
    return allTrips.value.filter(trip => trip.status === status).length;
};

const toggleTripDetails = (tripId) => {
    const tripForMap = allTrips.value.find(trip => trip.id === tripId);
    if (tripForMap) {
        updateMap(tripForMap);
    }

    if (selectedTripId.value === tripId) {
        selectedTripId.value = null;
    } else {
        selectedTripId.value = tripId;
    }
};

const updateMap = (trip) => {
    if (!map || !trip) return;
    if (currentPolyline) map.removeLayer(currentPolyline);
    currentMarkers.forEach(marker => map.removeLayer(marker));
    currentMarkers = [];
    currentPolyline = L.polyline(trip.coords, { color: '#3b82f6', weight: 4 }).addTo(map);
    const startMarker = L.marker(trip.coords[0]).bindPopup('จุดเริ่มต้น').addTo(map);
    const endMarker = L.marker(trip.coords[trip.coords.length - 1]).bindPopup('จุดปลายทาง').addTo(map);
    currentMarkers.push(startMarker, endMarker);
    map.fitBounds(currentPolyline.getBounds(), { padding: [40, 40] });
};

// --- Modal Logic ---
const isModalVisible = ref(false);
const tripToAction = ref(null);
const modalContent = ref({
    title: '', message: '', confirmText: '', action: null, variant: 'danger',
});

const openConfirmModal = (trip, action) => {
    tripToAction.value = trip;
    if (action === 'cancel') {
        modalContent.value = {
            title: 'ยืนยันการยกเลิกการจอง',
            message: `คุณต้องการยกเลิกการเดินทางไปที่ "${trip.destination}" ใช่หรือไม่?`,
            confirmText: 'ใช่, ยกเลิกการจอง',
            action: 'cancel',
            variant: 'danger',
        };
    } else if (action === 'delete') {
        modalContent.value = {
            title: 'ยืนยันการลบรายการ',
            message: `คุณต้องการลบรายการเดินทางไปที่ "${trip.destination}" ออกจากประวัติใช่หรือไม่?`,
            confirmText: 'ใช่, ลบรายการ',
            action: 'delete',
            variant: 'danger',
        };
    }
    isModalVisible.value = true;
};

const closeConfirmModal = () => {
    isModalVisible.value = false;
    tripToAction.value = null;
};

const handleConfirmAction = async () => {
    if (!tripToAction.value) return;
    const action = modalContent.value.action;
    const tripId = tripToAction.value.id;
    try {
        if (action === 'cancel') {
            await $api(`/bookings/${tripId}/cancel`, {
                method: 'PATCH',
                body: { status: 'CANCELLED' }
            });
            toast.success('ยกเลิกการจองสำเร็จ', 'การจองของคุณถูกยกเลิกแล้ว');
        } else if (action === 'delete') {
            // TODO: Call API to delete booking record
            console.log(`Deleting booking ID: ${tripId}`);
            // Example toast for when you implement this:
            // toast.success('ลบรายการสำเร็จ', 'รายการได้ถูกลบออกจากประวัติแล้ว');
        }
        closeConfirmModal();
        await fetchMyTrips();
    } catch (error) {
        console.error(`Failed to ${action} booking:`, error);
        toast.error('เกิดข้อผิดพลาด', error.data?.message || 'ไม่สามารถดำเนินการได้');
        closeConfirmModal();
    }
};

// --- Lifecycle and Watchers ---
useHead({
    title: 'การเดินทางของฉัน - ไปนำแหน่',
    link: [{ rel: 'stylesheet', href: 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css' }],
    script: [{ src: 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js', defer: true }]
});

onMounted(() => {
    fetchMyTrips();
    const checkLeaflet = setInterval(() => {
        if (typeof L !== 'undefined') {
            clearInterval(checkLeaflet);
            nextTick(() => {
                if (mapContainer.value && !map) {
                    map = L.map(mapContainer.value).setView([13.7563, 100.5018], 6);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '© OpenStreetMap contributors'
                    }).addTo(map);
                }
            });
        }
    }, 100);
});

watch(activeTab, () => {
    selectedTripId.value = null;
    if (filteredTrips.value.length > 0) {
        updateMap(filteredTrips.value[0]);
    }
});

</script>

<style scoped>
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