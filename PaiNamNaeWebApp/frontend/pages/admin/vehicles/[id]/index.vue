<template>
    <div>
        <AdminHeader />
        <AdminSidebar />

        <main id="main-content" class="main-content mt-16 ml-0 lg:ml-[280px] p-6">
            <div class="mb-8">
                <NuxtLink to="/admin/vehicles"
                    class="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                    <i class="fa-solid fa-arrow-left"></i>
                    <span>ย้อนกลับไปที่รายการ</span>
                </NuxtLink>
            </div>

            <div class="mx-auto max-w-8xl">
                <div class="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div class="flex items-center gap-3">
                        <h1 class="text-2xl font-semibold text-gray-800">รายละเอียดข้อมูลยานพาหนะ</h1>
                        <span class="text-sm text-gray-500">ดูข้อมูลทั้งหมดของยานพาหนะ</span>
                    </div>
                    <!-- ไม่มีปุ่มแก้ไข/ลบแล้ว -->
                </div>

                <div class="bg-white border border-gray-300 rounded-lg shadow-sm">
                    <div class="px-4 py-4 border-b border-gray-200 sm:px-6">
                        <h2 class="font-medium text-gray-800">
                            ข้อมูลยานพาหนะ: {{ vehicle?.licensePlate || '-' }}
                        </h2>
                    </div>

                    <div v-if="isLoading" class="p-8 text-center text-gray-500">
                        <i class="text-3xl fa-solid fa-spinner fa-spin"></i>
                        <p class="mt-2">กำลังโหลดข้อมูล...</p>
                    </div>
                    <div v-else-if="loadError" class="p-8 text-center text-red-600">{{ loadError }}</div>

                    <div v-else-if="vehicle" class="grid grid-cols-1 gap-6 p-4 sm:p-6 text-[15px]">
                        <div class="w-full max-w-[80rem] mx-auto space-y-8">
                            <!-- รายละเอียดหลัก -->
                            <section>
                                <h3 class="mb-3 text-sm font-semibold text-gray-700">รายละเอียดหลัก</h3>
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">รุ่น /
                                            ยี่ห้อ</label>
                                        <div
                                            class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                                            {{ vehicle?.vehicleModel || '-' }}
                                        </div>
                                    </div>

                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">ป้ายทะเบียน</label>
                                        <div
                                            class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                                            {{ vehicle?.licensePlate || '-' }}
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            class="block mb-1 text-xs font-medium text-gray-600">ประเภทยานพาหนะ</label>
                                        <div
                                            class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                                            {{ vehicleTypeLabel(vehicle?.vehicleType) }}
                                        </div>
                                    </div>

                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">สี</label>
                                        <div
                                            class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                                            {{ vehicle?.color || '-' }}
                                        </div>
                                    </div>

                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">จำนวนที่นั่ง</label>
                                        <div
                                            class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                                            {{ vehicle?.seatCapacity ?? '-' }}
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            class="block mb-1 text-xs font-medium text-gray-600">เป็นค่าเริ่มต้น</label>
                                        <div
                                            class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                                            <span
                                                :class="vehicle?.isDefault ? 'text-green-700 font-semibold' : 'text-gray-600'">
                                                {{ vehicle?.isDefault ? 'ใช่' : 'ไม่ใช่' }}
                                            </span>
                                        </div>
                                    </div>

                                </div>
                            </section>

                            <!-- ข้อมูลเจ้าของ -->
                            <section>
                                <h3 class="mb-3 text-sm font-semibold text-gray-700">ข้อมูลเจ้าของ</h3>
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">ชื่อ -
                                            นามสกุล</label>
                                        <div
                                            class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                                            {{ `${vehicle?.user?.firstName || ''} ${vehicle?.user?.lastName ||
                                                ''}`.trim() || '-' }}
                                        </div>
                                    </div>

                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">อีเมล</label>
                                        <div
                                            class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                                            {{ vehicle?.user?.email || '-' }}
                                        </div>
                                    </div>

                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">Username</label>
                                        <div
                                            class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                                            {{ vehicle?.user?.username || '-' }}
                                        </div>
                                    </div>

                                </div>
                            </section>
                            <!-- รูปภาพยานพาหนะ -->
                            <section>
                                <h3 class="mb-3 text-sm font-semibold text-gray-700">รูปภาพยานพาหนะ</h3>

                                <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                    <!-- รูปหน้ารถ -->
                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">รูปด้านหน้า</label>
                                        <a v-if="vehicle?.photos?.[0]" :href="vehicle.photos[0]" target="_blank"
                                            class="block p-4 text-center border-2 border-gray-300 border-dashed rounded-md hover:shadow-sm">
                                            <img :src="vehicle.photos[0]" class="object-cover w-full h-40 rounded-md"
                                                alt="front" />
                                        </a>
                                        <div v-else
                                            class="p-10 text-center text-gray-500 border-2 border-gray-300 border-dashed rounded-md bg-gray-50">
                                            ไม่พบรูป
                                        </div>
                                    </div>

                                    <!-- รูปหลังรถ -->
                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">รูปด้านข้าง</label>
                                        <a v-if="vehicle?.photos?.[1]" :href="vehicle.photos[1]" target="_blank"
                                            class="block p-4 text-center border-2 border-gray-300 border-dashed rounded-md hover:shadow-sm">
                                            <img :src="vehicle.photos[1]" class="object-cover w-full h-40 rounded-md"
                                                alt="back" />
                                        </a>
                                        <div v-else
                                            class="p-10 text-center text-gray-500 border-2 border-gray-300 border-dashed rounded-md bg-gray-50">
                                            ไม่พบรูป
                                        </div>
                                    </div>

                                    <!-- รูปป้ายทะเบียน -->
                                    <div>
                                        <label
                                            class="block mb-1 text-xs font-medium text-gray-600">รูปภายใน</label>
                                        <a v-if="vehicle?.photos?.[2]" :href="vehicle.photos[2]" target="_blank"
                                            class="block p-4 text-center border-2 border-gray-300 border-dashed rounded-md hover:shadow-sm">
                                            <img :src="vehicle.photos[2]" class="object-cover w-full h-40 rounded-md"
                                                alt="plate" />
                                        </a>
                                        <div v-else
                                            class="p-10 text-center text-gray-500 border-2 border-gray-300 border-dashed rounded-md bg-gray-50">
                                            ไม่พบรูป
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <!-- ข้อมูลระบบ -->
                            <section>
                                <h3 class="mb-3 text-sm font-semibold text-gray-700">ข้อมูลระบบ</h3>
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">สร้างเมื่อ</label>
                                        <div
                                            class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                                            {{ formatDate(vehicle?.createdAt, true) }}
                                        </div>
                                    </div>
                                    <div>
                                        <label class="block mb-1 text-xs font-medium text-gray-600">อัปเดตล่าสุด</label>
                                        <div
                                            class="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                                            {{ formatDate(vehicle?.updatedAt, true) }}
                                        </div>
                                    </div>
                                </div>
                            </section>

                        </div>
                    </div>
                </div>
            </div>
        </main>

        <div id="overlay" class="fixed inset-0 z-40 hidden bg-black bg-opacity-50 lg:hidden"
            @click="closeMobileSidebar"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRuntimeConfig, useCookie } from '#app';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import AdminHeader from '~/components/admin/AdminHeader.vue';
import AdminSidebar from '~/components/admin/AdminSidebar.vue';
import { useToast } from '~/composables/useToast';

dayjs.locale('th');

definePageMeta({ middleware: ['admin-auth'] });
useHead({
    title: 'Vehicle Details • Admin',
    link: [{ rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css' }]
});

const route = useRoute();
const { toast } = useToast();

const isLoading = ref(true);
const loadError = ref('');
const vehicle = ref(null);

const vehicleTypeLabel = (code) => {
  const map = {
    SEDAN: 'Sedan',
    SUV: 'SUV',
    Hatchback: 'Hatchback',
    VAN: 'Van',
    Pickup: 'Pickup',
  };
  return map[code] || code || '-';
};

function formatDate(iso, withTime = false) {
    if (!iso) return '-';
    return withTime
        ? dayjs(iso).format('D MMM YYYY HH:mm')
        : dayjs(iso).format('D MMM YYYY');
}

async function fetchVehicle() {
    isLoading.value = true;
    loadError.value = '';
    try {
        const id = route.params.id;
        const config = useRuntimeConfig();
        const token = useCookie('token').value || (process.client ? localStorage.getItem('token') : '');

        const res = await $fetch(`/vehicles/admin/${id}`, {
            baseURL: config.public.apiBase,
            headers: { Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
        });

        if (res?.success && res.data) {
            vehicle.value = res.data;
        } else {
            throw new Error(res?.message || 'ไม่พบยานพาหนะนี้ในระบบ');
        }
    } catch (err) {
        console.error('Fetch Vehicle Error:', err);
        loadError.value = err?.data?.message || err.message || 'ไม่สามารถโหลดข้อมูลยานพาหนะได้';
        toast.error('เกิดข้อผิดพลาด', loadError.value);
        vehicle.value = null;
    } finally {
        isLoading.value = false;
    }
}

/* layout helpers */
function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    if (!sidebar || !overlay) return;
    sidebar.classList.remove('mobile-open');
    overlay.classList.add('hidden');
}
function defineGlobalScripts() {
    window.toggleSidebar = function () {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('main-content');
        const toggleIcon = document.getElementById('toggle-icon');
        if (!sidebar || !mainContent) return;
        sidebar.classList.toggle('collapsed');
        if (sidebar.classList.contains('collapsed')) {
            mainContent.style.marginLeft = '80px';
            if (toggleIcon) toggleIcon.classList.replace('fa-chevron-left', 'fa-chevron-right');
        } else {
            mainContent.style.marginLeft = '280px';
            if (toggleIcon) toggleIcon.classList.replace('fa-chevron-right', 'fa-chevron-left');
        }
    };
    window.toggleMobileSidebar = function () {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        if (!sidebar || !overlay) return;
        sidebar.classList.toggle('mobile-open');
        overlay.classList.toggle('hidden');
    };
    window.toggleSubmenu = function (menuId) {
        const menu = document.getElementById(menuId);
        const icon = document.getElementById(menuId + '-icon');
        if (!menu || !icon) return;
        menu.classList.toggle('hidden');
        if (menu.classList.contains('hidden')) {
            icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
        } else {
            icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
        }
    };
    window.__adminResizeHandler__ = function () {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('main-content');
        const overlay = document.getElementById('overlay');
        if (!sidebar || !mainContent || !overlay) return;
        if (window.innerWidth >= 1024) {
            sidebar.classList.remove('mobile-open');
            overlay.classList.add('hidden');
            if (sidebar.classList.contains('collapsed')) {
                mainContent.style.marginLeft = '80px';
            } else {
                mainContent.style.marginLeft = '280px';
            }
        } else {
            mainContent.style.marginLeft = '0';
        }
    };
    window.addEventListener('resize', window.__adminResizeHandler__);
}
function cleanupGlobalScripts() {
    window.removeEventListener('resize', window.__adminResizeHandler__ || (() => { }));
    delete window.toggleSidebar;
    delete window.toggleMobileSidebar;
    delete window.toggleSubmenu;
    delete window.__adminResizeHandler__;
}

onMounted(async () => {
    defineGlobalScripts();
    if (typeof window.__adminResizeHandler__ === 'function') window.__adminResizeHandler__();
    await fetchVehicle();
});
onUnmounted(() => cleanupGlobalScripts());
</script>

<style>
.main-content {
    transition: margin-left 0.3s ease;
}

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
    background-color: rgba(59, 130, 246, .05);
}

.sidebar.collapsed .sidebar-text {
    display: none;
}

.sidebar.collapsed .sidebar-item {
    justify-content: center;
}

@media (max-width:1024px) {
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
