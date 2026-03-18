<template>
    <header class="fixed top-0 left-0 right-0 z-50 h-16 bg-white border border-gray-300 shadow-sm">
        <div class="flex items-center justify-between h-full px-4">
            <div class="flex items-center gap-4">
                <!-- Mobile Menu Toggle -->
                <button @click="toggleMobileSidebar" class="text-gray-600 lg:hidden hover:text-blue-600">
                    <i class="text-xl fas fa-bars"></i>
                </button>

                <!-- Logo -->
                <div class="flex items-center gap-2">
                    <div class="flex items-center justify-center w-8 h-8 bg-blue-600 rounded">
                        <i class="text-white fas fa-chart-line"></i>
                    </div>
                    <span class="text-xl font-semibold text-gray-800">PNNAdmin</span>
                </div>
            </div>

            <!-- Right -->
            <div class="flex items-center gap-4">
                <!-- Bell + Dropdown -->
                <div class="relative">
                    <!-- Bell -->
                    <button ref="bellBtn" class="relative text-gray-600 hover:text-blue-600" @click="onBellClick"
                        aria-haspopup="true" :aria-expanded="openNotif ? 'true' : 'false'">
                        <i class="text-xl fas fa-bell"></i>
                        <span v-if="unreadCount > 0" class="absolute w-2 h-2 bg-red-500 rounded-full -top-1 -right-1" />
                    </button>

                    <!-- Dropdown -->
                    <transition enter-active-class="transition duration-150 ease-out"
                        enter-from-class="translate-y-1 opacity-0" enter-to-class="translate-y-0 opacity-100"
                        leave-active-class="transition duration-100 ease-in"
                        leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-1 opacity-0">
                        <div v-if="openNotif" ref="notifPanel" class="absolute top-full right-0 mt-3 w-[360px] max-w-[90vw] max-h-[70vh]
                     bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-[60] origin-top"
                            @click.stop>
                            <!-- Header -->
                            <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                                <h3 class="text-lg font-semibold text-gray-800">Notification</h3>
                                <button class="p-1 text-gray-500 hover:text-gray-700" @click="openNotif = false">
                                    <i class="fa-solid fa-xmark"></i>
                                </button>
                            </div>

                            <!-- List -->
                            <div class="max-h-[56vh] overflow-y-auto">
                                <div v-if="notifications.length === 0 && !loading"
                                    class="px-4 py-8 text-sm text-center text-gray-500">
                                    ไม่มีการแจ้งเตือน
                                </div>
                                <div v-if="loading" class="px-4 py-4 text-sm text-gray-500">กำลังโหลด…</div>

                                <div v-for="(n, idx) in notifications" :key="n.id || idx" class="relative">
                                    <div class="px-4 py-3 hover:bg-gray-50">
                                        <div class="flex items-start gap-3">
                                            <!-- จุดสถานะ -->
                                            <span class="inline-block w-2 h-2 mt-1 rounded-full"
                                                :class="n.adminReviewedAt ? 'bg-gray-300' : 'bg-emerald-500'" />
                                            <!-- เนื้อหา -->
                                            <div class="flex-1 min-w-0">
                                                <p class="text-sm font-medium text-gray-900 truncate">
                                                    {{ n.title }}
                                                </p>
                                                <p class="text-sm text-gray-600 line-clamp-2">
                                                    {{ n.body }}
                                                </p>
                                                <p class="mt-1 text-xs text-gray-400">
                                                    {{ timeAgo(n.createdAt) }}
                                                </p>
                                            </div>

                                            <!-- Kebab (สามจุด) -->
                                            <div class="relative shrink-0">
                                                <button
                                                    class="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                                    @click.stop="toggleItemMenu(n.id)" aria-haspopup="true"
                                                    :aria-expanded="openMenuId === n.id ? 'true' : 'false'">
                                                    <i class="fa-solid fa-ellipsis-vertical"></i>
                                                </button>

                                                <!-- Item menu -->
                                                <div v-if="openMenuId === n.id"
                                                    class="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-[70]"
                                                    @click.stop>
                                                    <button
                                                        class="flex items-center w-full gap-2 px-3 py-2 text-sm hover:bg-gray-50"
                                                        @click="markAsRead(n)">
                                                        <i class="fa-regular fa-circle-check"></i>
                                                        ทำเครื่องหมายอ่านแล้ว
                                                    </button>
                                                    <button
                                                        class="flex items-center w-full gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                                        @click="removeNotification(n)">
                                                        <i class="fa-regular fa-trash-can"></i>
                                                        ลบการแจ้งเตือนนี้
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="mx-4 border-t border-gray-200"
                                        v-if="idx !== notifications.length - 1" />
                                </div>
                            </div>

                            <!-- Footer -->
                            <div class="px-4 py-3 bg-white border-t border-gray-200">
                                <NuxtLink to="/admin/notifications"
                                    class="block w-full px-4 py-2 text-sm font-medium text-center text-blue-700 rounded-lg bg-blue-50 hover:bg-blue-100"
                                    @click="openNotif = false">
                                    View All Notification
                                </NuxtLink>
                            </div>
                        </div>
                    </transition>
                </div>

                <!-- Profile -->
                <div class="flex items-center gap-3">
                    <span class="hidden text-sm text-gray-700 md:block">{{ user.firstName }}</span>
                    <div class="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full">
                        <i class="w-6 text-lg text-center text-white fas fa-user"></i>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRuntimeConfig, useCookie } from '#app'
import { useAuth } from '~/composables/useAuth'

const { token, user } = useAuth()

function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar')
    const overlay = document.getElementById('overlay')
    if (!sidebar || !overlay) return
    sidebar.classList.toggle('mobile-open')
    overlay.classList.toggle('hidden')
}

const openNotif = ref(false)
const openMenuId = ref(null)       // <- เมนูย่อยของแต่ละรายการ
const loading = ref(false)
const bellBtn = ref(null)
const notifPanel = ref(null)
const notifications = ref([])

const unreadCount = computed(() => notifications.value.filter(n => !n.adminReviewedAt).length)

function toggleNotif() {
    openNotif.value = !openNotif.value
    if (!openNotif.value) openMenuId.value = null
}

/** กดกระดิ่ง */
async function onBellClick() {
    toggleNotif()
    if (openNotif.value && notifications.value.length === 0) {
        await fetchAdminNotifications()
    }
}

/** โหลด notification ของ ADMIN (กรองเฉพาะที่ initiatedBy=user) */
async function fetchAdminNotifications() {
    try {
        if (!user?.value || String(user.value.role).toUpperCase() !== 'ADMIN') return
        loading.value = true

        const apiBase = useRuntimeConfig().public.apiBase || 'http://localhost:3000/api'
        const tk =
            useCookie('token')?.value ||
            token?.value ||
            (process.client ? localStorage.getItem('token') : '')

        const res = await $fetch('/notifications/admin', {
            baseURL: apiBase,
            headers: {
                Accept: 'application/json',
                ...(tk ? { Authorization: `Bearer ${tk}` } : {}),
            },
            query: { page: 1, limit: 20 },
        })

        const raw = Array.isArray(res?.data) ? res.data : []
        const list = raw.filter(it => (it?.metadata?.initiatedBy || '').toLowerCase() === 'user')

        notifications.value = list.map(it => ({
            id: it.id,
            title: it.title || '-',
            body: it.body || '',
            createdAt: it.createdAt || Date.now(),
            adminReviewedAt: it.adminReviewedAt || null,
        }))
    } catch (err) {
        console.error(err)
        notifications.value = []
    } finally {
        loading.value = false
    }
}

/* ----- เมนูย่อยต่อรายการ ----- */
function toggleItemMenu(id) {
    openMenuId.value = openMenuId.value === id ? null : id
}

async function markAsRead(n) {
    try {
        const apiBase = useRuntimeConfig().public.apiBase || 'http://localhost:3000/api'
        const tk =
            useCookie('token')?.value ||
            token?.value ||
            (process.client ? localStorage.getItem('token') : '')

        // เดา endpoint ตาม convention (ปรับให้ตรงกับ backend ถ้าไม่ตรง)
        await fetch(`${apiBase}/notifications/admin/${n.id}/read`, {
            method: 'PATCH',
            headers: {
                Accept: 'application/json',
                // 'Content-Type': 'application/json',
                ...(tk ? { Authorization: `Bearer ${tk}` } : {}),
            },
            // body: JSON.stringify({ read: true }),
            credentials: 'include',
        }).catch(() => { }) // เงียบถ้า backend ยังไม่มี

        // อัปเดต UI ทันที
        const i = notifications.value.findIndex(x => x.id === n.id)
        if (i > -1) notifications.value[i].adminReviewedAt = new Date().toISOString()
    } finally {
        openMenuId.value = null
    }
}

async function removeNotification(n) {
    try {
        const apiBase = useRuntimeConfig().public.apiBase || 'http://localhost:3000/api'
        const tk =
            useCookie('token')?.value ||
            token?.value ||
            (process.client ? localStorage.getItem('token') : '')

        // เดา endpoint ลบ (ปรับให้ตรงกับ backend ถ้าจริงต่างกัน)
        await fetch(`${apiBase}/notifications/admin/${n.id}`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                ...(tk ? { Authorization: `Bearer ${tk}` } : {}),
            },
            credentials: 'include',
        }).catch(() => { })

        // ลบจากรายการใน UI
        notifications.value = notifications.value.filter(x => x.id !== n.id)
    } finally {
        openMenuId.value = null
    }
}

/* ปิด dropdown เมื่อคลิกนอก */
function onClickOutside(e) {
    if (!openNotif.value) return
    const t = e.target
    if (notifPanel.value?.contains(t) || bellBtn.value?.contains(t)) return
    openNotif.value = false
    openMenuId.value = null
}
function onKey(e) {
    if (e.key === 'Escape') {
        openNotif.value = false
        openMenuId.value = null
    }
}

onMounted(() => {
    document.addEventListener('click', onClickOutside)
    document.addEventListener('keydown', onKey)
    if (String(user?.value?.role || '').toUpperCase() === 'ADMIN') fetchAdminNotifications()
})
onUnmounted(() => {
    document.removeEventListener('click', onClickOutside)
    document.removeEventListener('keydown', onKey)
})

/* เวลาแบบย่อ */
function timeAgo(ts) {
    const ms = Date.now() - new Date(ts).getTime()
    const m = Math.floor(ms / 60000)
    if (m < 1) return 'just now'
    if (m < 60) return `${m} min ago`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h} hr ago`
    const d = Math.floor(h / 24)
    return `${d} d ago`
}
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
