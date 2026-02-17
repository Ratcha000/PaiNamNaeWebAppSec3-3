<template>
    <div>
        <header class="sticky top-0 z-50 bg-white shadow-sm">
            <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-16">
                    <NuxtLink to="/">
                        <div class="flex items-center">
                            <h1 class="text-xl font-bold text-blue-600 sm:text-2xl">ไปนำแหน่</h1>
                        </div>
                    </NuxtLink>

                    <nav class="items-center hidden space-x-6 md:flex lg:space-x-8">
                        <NuxtLink to="/findTrip"
                            class="font-medium text-gray-600 transition-colors duration-200 hover:text-blue-700"
                            :class="{ 'text-blue-600': $route.path === '/findTrip' }">
                            ค้นหาเส้นทาง
                        </NuxtLink>

                        <div
                            v-if="user && (user.role === 'PASSENGER' || user.role === 'DRIVER' || user.role === 'ADMIN')">
                            <NuxtLink to="/createTrip"
                                class="text-gray-600 transition-colors duration-200 hover:text-blue-600"
                                :class="{ 'text-blue-600': $route.path === '/createTrip' }">
                                สร้างเส้นทาง
                            </NuxtLink>
                        </div>

                        <!-- ผู้โดยสาร: ลิงก์เดี่ยว ไม่มีดรอปดาวน์ -->
                        <div v-if="user && user.role === 'PASSENGER'">
                            <NuxtLink to="/myTrip"
                                class="flex items-center text-gray-600 transition-colors duration-200 hover:text-blue-600"
                                :class="{ 'text-blue-600': $route.path.startsWith('/myTrip') }">
                                การเดินทางของฉัน
                            </NuxtLink>
                        </div>

                        <!-- คนขับ: แสดงคำว่า การเดินทางทั้งหมด + ดรอปดาวน์ (การเดินทางของฉัน / คำขอจองเส้นทางของฉัน) -->
                        <div v-if="user && (user.role === 'DRIVER' || user.role === 'ADMIN')">
                            <div class="relative dropdown-trigger">
                                <NuxtLink to="/myTrip"
                                    class="flex items-center text-gray-600 transition-colors duration-200 hover:text-blue-600"
                                    :class="{ 'text-blue-600': $route.path.startsWith('/myTrip') || $route.path.startsWith('/myRoute') }">
                                    การเดินทางทั้งหมด
                                    <svg class="w-4 h-4 ml-1 transition-transform duration-200" fill="none"
                                        stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </NuxtLink>

                                <div
                                    class="absolute right-0 py-2 mt-5 bg-white border border-gray-200 rounded-lg shadow-lg dropdown-menu top-full w-50 user-dropdown-arrow">
                                    <NuxtLink to="/myTrip"
                                        class="flex items-center block w-full px-4 py-2 text-left text-gray-700 transition-colors duration-200 hover:bg-blue-50 hover:text-blue-600">
                                        การเดินทางของฉัน
                                    </NuxtLink>
                                    <NuxtLink to="/myRoute"
                                        class="flex items-center block w-full px-4 py-2 text-left text-gray-700 transition-colors duration-200 hover:bg-blue-50 hover:text-blue-600">
                                        คำขอจองเส้นทางของฉัน
                                    </NuxtLink>
                                </div>
                            </div>
                        </div>

                        <div v-if="!token" class="flex items-center space-x-3 ">
                            <NuxtLink to="/register"
                                class="text-gray-600 transition-colors duration-200 hover:text-blue-600">สมัครสมาชิก
                            </NuxtLink>
                            <span class="text-gray-600">|</span>
                            <NuxtLink to="/login"
                                class="text-gray-600 transition-colors duration-200 hover:text-blue-600">เข้าสู่ระบบ
                            </NuxtLink>
                        </div>

                        <!-- Bell (ผู้ใช้ทั่วไป + แอดมินใช้ตัวนี้บนเว็บหลัก) -->
                        <div v-if="token" class="relative">
                            <button ref="bellBtn" class="relative text-gray-600 hover:text-blue-600"
                                @click="onBellClick" aria-haspopup="true" :aria-expanded="openNotif ? 'true' : 'false'">
                                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 17h5l-1.405-1.405C18.21 14.79 18 13.918 18 13V9a6 6 0 10-12 0v4c0 .918-.21 1.79-.595 2.595L4 17h5m6 0a3 3 0 11-6 0h6z" />
                                </svg>
                                <span v-if="unreadCount > 0"
                                    class="absolute w-2 h-2 bg-red-500 rounded-full -top-1 -right-1"></span>
                            </button>

                            <transition enter-active-class="transition duration-150 ease-out"
                                enter-from-class="translate-y-1 opacity-0" enter-to-class="translate-y-0 opacity-100"
                                leave-active-class="transition duration-100 ease-in"
                                leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-1 opacity-0">
                                <div v-if="openNotif" ref="notifPanel" class="absolute top-full right-0 mt-3 w-[360px] max-w-[90vw] max-h-[70vh]
                bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-[60] origin-top" @click.stop>
                                    <!-- Header -->
                                    <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                                        <h3 class="text-lg font-semibold text-gray-800">Notification</h3>
                                        <button class="p-1 text-gray-500 hover:text-gray-700"
                                            @click="openNotif = false">
                                            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <!-- List -->
                                    <div class="max-h-[56vh] overflow-y-auto">
                                        <div v-if="notifications.length === 0 && !loading"
                                            class="px-4 py-8 text-sm text-center text-gray-500">ไม่มีการแจ้งเตือน</div>
                                        <div v-if="loading" class="px-4 py-4 text-sm text-gray-500">กำลังโหลด…</div>

                                        <div v-for="(n, idx) in notifications" :key="n.id || idx" class="relative">
                                            <div class="px-4 py-3 hover:bg-gray-50">
                                                <div class="flex items-start gap-3">
                                                    <!-- จุดสถานะ: อ่านแล้วย้อมเทา -->
                                                    <span class="inline-block w-2 h-2 mt-1 rounded-full"
                                                        :class="n.readAt ? 'bg-gray-300' : 'bg-emerald-500'"></span>

                                                    <div class="flex-1 min-w-0">
                                                        <p class="text-sm font-medium text-gray-900 truncate">{{ n.title
                                                            }}</p>
                                                        <p class="text-sm text-gray-600 line-clamp-2">{{ n.body }}</p>
                                                        <p class="mt-1 text-xs text-gray-400">{{ timeAgo(n.createdAt) }}
                                                        </p>
                                                    </div>

                                                    <!-- เมนูสามจุด -->
                                                    <div class="relative shrink-0">
                                                        <button
                                                            class="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                                            @click.stop="toggleItemMenu(n.id)" aria-haspopup="true"
                                                            :aria-expanded="openMenuId === n.id ? 'true' : 'false'">
                                                            <svg class="w-4 h-4" viewBox="0 0 24 24"
                                                                fill="currentColor">
                                                                <circle cx="12" cy="5" r="2" />
                                                                <circle cx="12" cy="12" r="2" />
                                                                <circle cx="12" cy="19" r="2" />
                                                            </svg>
                                                        </button>

                                                        <div v-if="openMenuId === n.id"
                                                            class="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-[70]"
                                                            @click.stop>
                                                            <button
                                                                class="flex items-center w-full gap-2 px-3 py-2 text-sm hover:bg-gray-50"
                                                                @click="markAsRead(n)">
                                                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"
                                                                    stroke="currentColor">
                                                                    <circle cx="12" cy="12" r="9" stroke-width="2" />
                                                                    <path d="M9 12l2 2 4-4" stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round" />
                                                                </svg>
                                                                ทำเครื่องหมายอ่านแล้ว
                                                            </button>
                                                            <button
                                                                class="flex items-center w-full gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                                                @click="removeNotification(n)">
                                                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"
                                                                    stroke="currentColor">
                                                                    <path stroke-width="2" stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                        d="M19 7l-1 12a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7m3-3h8m-9 3h10M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
                                                                </svg>
                                                                ลบการแจ้งเตือนนี้
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="mx-4 border-t border-gray-200"
                                                v-if="idx !== notifications.length - 1"></div>
                                        </div>
                                    </div>

                                    <!-- Footer -->
                                    <div class="px-4 py-3 bg-white border-t border-gray-200">
                                        <NuxtLink to="/notifications"
                                            class="block w-full px-4 py-2 text-sm font-medium text-center text-blue-700 rounded-lg bg-blue-50 hover:bg-blue-100"
                                            @click="openNotif = false">
                                            View All Notification
                                        </NuxtLink>
                                    </div>
                                </div>
                            </transition>
                        </div>

                        <!-- โปรไฟล์ passenger , driver -->
                        <div v-if="user && (user.role === 'PASSENGER' || user.role === 'DRIVER')"
                            class="relative dropdown-trigger">
                            <div
                                class="flex items-center px-3 py-2 pl-4 space-x-2 transition-colors duration-200 border-l border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50">
                                <div class="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <span class="font-medium text-blue-600">{{ user.firstName }}</span>
                                <svg class="w-4 h-4 text-blue-600 transition-transform duration-200" fill="none"
                                    stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                            <div
                                class="absolute right-0 w-40 py-2 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg dropdown-menu top-full user-dropdown-arrow">
                                <NuxtLink to="/profile"
                                    class="flex items-center block w-full px-4 py-2 text-left text-gray-700 transition-colors duration-200 hover:bg-blue-50 hover:text-blue-600">
                                    บัญชีของฉัน
                                </NuxtLink>
                                <button @click="logout"
                                    class="flex items-center block w-full px-4 py-2 text-left text-red-600 transition-colors duration-200 hover:bg-red-50 hover:text-red-700">
                                    Logout
                                </button>
                            </div>
                        </div>

                        <!-- โปรไฟล์ admin -->
                        <div v-if="user && user.role === 'ADMIN'" class="relative dropdown-trigger">
                            <div
                                class="flex items-center px-3 py-2 pl-4 space-x-2 transition-colors duration-200 border-l border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50">
                                <div class="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <span class="font-medium text-blue-600">{{ user.firstName }}</span>
                                <svg class="w-4 h-4 text-blue-600 transition-transform duration-200" fill="none"
                                    stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                            <div
                                class="absolute right-0 w-40 py-2 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg dropdown-menu top-full user-dropdown-arrow">
                                <NuxtLink to="/profile"
                                    class="flex items-center block w-full px-4 py-2 text-left text-gray-700 transition-colors duration-200 hover:bg-blue-50 hover:text-blue-600">
                                    บัญชีของฉัน
                                </NuxtLink>
                                <NuxtLink to="/admin/users"
                                    class="flex items-center block w-full px-4 py-2 text-left text-gray-700 transition-colors duration-200 hover:bg-blue-50 hover:text-blue-600">
                                    Dashboard
                                </NuxtLink>
                                <button @click="logout"
                                    class="flex items-center block w-full px-4 py-2 text-left text-red-600 transition-colors duration-200 hover:bg-red-50 hover:text-red-700">
                                    Logout
                                </button>
                            </div>
                        </div>


                    </nav>

                    <div class="md:hidden">
                        <button @click="toggleMobileMenu" type="button"
                            class="text-gray-600 transition-colors duration-200 hover:text-blue-600 focus:outline-none focus:text-blue-600">
                            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- ==================== Mobile Menu ==================== -->
                <div v-show="isMobileMenuOpen" class="border-t border-gray-200 md:hidden">
                    <div class="px-2 pt-2 pb-3 space-y-1 bg-white">
                        <NuxtLink to="/findTrip"
                            class="block px-3 py-2 font-medium transition-colors duration-200 rounded-md"
                            :class="$route.path === '/findTrip' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'"
                            @click="closeMobileMenu">
                            ค้นหาเส้นทาง
                        </NuxtLink>

                        <NuxtLink
                            v-if="user && (user.role === 'PASSENGER' || user.role === 'DRIVER' || user.role === 'ADMIN')"
                            to="/createTrip" class="block px-3 py-2 transition-colors duration-200 rounded-md"
                            :class="$route.path === '/createTrip' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'"
                            @click="closeMobileMenu">
                            สร้างเส้นทาง
                        </NuxtLink>

                        <!-- Notification (Mobile) -->
                        <NuxtLink v-if="token" to="/notifications"
                            class="relative block px-3 py-2 transition-colors duration-200 rounded-md"
                            :class="$route.path === '/notifications' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'"
                            @click="closeMobileMenu">
                            การแจ้งเตือน
                            <span v-if="unreadCount > 0"
                                class="absolute top-2 right-3 inline-flex items-center justify-center text-xs font-semibold rounded-full px-2 min-w-[1.25rem] h-5 bg-red-500 text-white">
                                {{ unreadCount }}
                            </span>
                        </NuxtLink>

                        <!-- ผู้โดยสาร: ลิงก์เดี่ยว -->
                        <NuxtLink v-if="user && user.role === 'PASSENGER'" to="/myTrip"
                            class="block px-3 py-2 transition-colors duration-200 rounded-md"
                            :class="$route.path.startsWith('/myTrip') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'"
                            @click="closeMobileMenu">
                            การเดินทางของฉัน
                        </NuxtLink>

                        <!-- คนขับ: เมนูย่อย 2 รายการ -->
                        <div v-else-if="user && (user.role === 'DRIVER' || user.role === 'ADMIN')" class="relative">
                            <button @click="toggleMobileTripMenu"
                                class="flex items-center justify-between w-full px-3 py-2 text-left text-gray-600 transition-colors duration-200 rounded-md hover:text-blue-600 hover:bg-blue-50">
                                การเดินทางทั้งหมด
                                <svg class="w-4 h-4 transition-transform duration-200"
                                    :class="{ 'rotate-180': isMobileTripMenuOpen }" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>
                            <div v-show="isMobileTripMenuOpen" class="mt-1 ml-4">
                                <NuxtLink to="/myTrip"
                                    class="block px-3 py-2 text-gray-500 transition-colors duration-200 rounded-md hover:text-blue-600 hover:bg-blue-50"
                                    @click="closeMobileMenu">
                                    การเดินทางของฉัน
                                </NuxtLink>
                                <NuxtLink to="/myRoute"
                                    class="block px-3 py-2 text-gray-500 transition-colors duration-200 rounded-md hover:text-blue-600 hover:bg-blue-50"
                                    @click="closeMobileMenu">
                                    คำขอจองเส้นทางของฉัน
                                </NuxtLink>
                            </div>
                        </div>

                        <div v-if="!token">
                            <NuxtLink to="/register" class="block px-3 py-2 transition-colors duration-200 rounded-md"
                                :class="$route.path === '/register' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'"
                                @click="closeMobileMenu">
                                สมัครสมาชิก
                            </NuxtLink>
                            <NuxtLink to="/login" class="block px-3 py-2 transition-colors duration-200 rounded-md"
                                :class="$route.path === '/login' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'"
                                @click="closeMobileMenu">
                                เข้าสู่ระบบ
                            </NuxtLink>
                        </div>

                        <div v-else-if="user && (user.role === 'PASSENGER' || user.role === 'DRIVER')"
                            class="pt-2 mt-2 border-t border-gray-200">
                            <div class="flex items-center px-3 py-2">
                                <div class="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <span class="ml-2 font-medium text-gray-700">{{ user.firstName }}</span>
                            </div>
                            <div class="mt-1 ml-6">
                                <NuxtLink to="/profile" @click="closeMobileMenu"
                                    class="flex items-center block w-full px-3 py-2 text-left text-gray-600 transition-colors duration-200 rounded-md hover:bg-blue-50 hover:text-blue-600">
                                    บัญชีของฉัน
                                </NuxtLink>
                                <button @click="logout"
                                    class="flex items-center block w-full px-3 py-2 text-left text-red-600 transition-colors duration-200 rounded-md hover:bg-red-50 hover:text-red-700">
                                    Logout
                                </button>
                            </div>
                        </div>
                        <div v-else-if="user && user.role === 'ADMIN'" class="pt-2 mt-2 border-t border-gray-200">
                            <div class="flex items-center px-3 py-2">
                                <div class="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <span class="ml-2 font-medium text-gray-700">{{ user.firstName }}</span>
                            </div>
                            <div class="mt-1 ml-6">
                                <NuxtLink to="/profile" @click="closeMobileMenu"
                                    class="flex items-center block w-full px-3 py-2 text-left text-gray-600 transition-colors duration-200 rounded-md hover:bg-blue-50 hover:text-blue-600">
                                    บัญชีของฉัน
                                </NuxtLink>
                                <NuxtLink to="/admin/users" @click="closeMobileMenu"
                                    class="flex items-center block w-full px-3 py-2 text-left text-gray-600 transition-colors duration-200 rounded-md hover:bg-blue-50 hover:text-blue-600">
                                    Dashboard
                                </NuxtLink>
                                <button @click="logout"
                                    class="flex items-center block w-full px-3 py-2 text-left text-red-600 transition-colors duration-200 rounded-md hover:bg-red-50 hover:text-red-700">
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- ==================== End Mobile Menu ==================== -->
            </div>
        </header>

        <main>
            <NuxtPage />
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRuntimeConfig, useCookie } from '#app'
import { useAuth } from '~/composables/useAuth'

const { token, user, logout } = useAuth()

/* ====== เมนูบนสุดเดิม ====== */
const isMobileMenuOpen = ref(false)
const isMobileTripMenuOpen = ref(false)

const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
    if (!isMobileMenuOpen.value) {
        isMobileTripMenuOpen.value = false
    }
}
const closeMobileMenu = () => {
    isMobileMenuOpen.value = false
    isMobileTripMenuOpen.value = false
}
const toggleMobileTripMenu = () => {
    isMobileTripMenuOpen.value = !isMobileTripMenuOpen.value
}
const handleResize = () => {
    if (window.innerWidth >= 768) {
        isMobileMenuOpen.value = false
        isMobileTripMenuOpen.value = false
    }
}

/* ====== Bell Notification (ผู้ใช้ทั่วไป) ====== */
const openNotif = ref(false)
const openMenuId = ref(null)   // เมนูสามจุดของแต่ละรายการ
const loading = ref(false)
const bellBtn = ref(null)
const notifPanel = ref(null)
const notifications = ref([])  // [{ id, title, body, createdAt, readAt }]

const unreadCount = computed(() => notifications.value.filter(n => !n.readAt).length)

function toggleNotif() {
    openNotif.value = !openNotif.value
    if (!openNotif.value) openMenuId.value = null
}

async function onBellClick() {
    toggleNotif()
    if (openNotif.value && notifications.value.length === 0) {
        await fetchUserNotifications()
    }
}

/** GET /notifications (ผู้ใช้ทั่วไป: แสดงทั้งหมด ไม่กรอง initiatedBy) */
async function fetchUserNotifications() {
    try {
        if (!token.value) return
        loading.value = true

        const apiBase = useRuntimeConfig().public.apiBase || 'http://localhost:3000/api'
        const tk = useCookie('token')?.value || (process.client ? localStorage.getItem('token') : '')

        const res = await $fetch('/notifications', {
            baseURL: apiBase,
            headers: { Accept: 'application/json', ...(tk ? { Authorization: `Bearer ${tk}` } : {}) },
            query: { page: 1, limit: 20 }
        })

        const raw = Array.isArray(res?.data) ? res.data : []
        notifications.value = raw.map(it => ({
            id: it.id,
            title: it.title || '-',
            body: it.body || '',
            createdAt: it.createdAt || Date.now(),
            readAt: it.readAt || null
        }))
    } catch (e) {
        console.error(e)
        notifications.value = []
    } finally {
        loading.value = false
    }
}

/** เมนูย่อยของแต่ละรายการ */
function toggleItemMenu(id) {
    openMenuId.value = openMenuId.value === id ? null : id
}

/** PATCH /notifications/:id/read -> set readAt (ผู้ใช้ทั่วไป) */
async function markAsRead(n) {
    try {
        const apiBase = useRuntimeConfig().public.apiBase || 'http://localhost:3000/api'
        const tk = useCookie('token')?.value || (process.client ? localStorage.getItem('token') : '')
        await fetch(`${apiBase}/notifications/${n.id}/read`, {
            method: 'PATCH',
            headers: { Accept: 'application/json', ...(tk ? { Authorization: `Bearer ${tk}` } : {}) },
            credentials: 'include'
        })
        const i = notifications.value.findIndex(x => x.id === n.id)
        if (i > -1) notifications.value[i].readAt = new Date().toISOString()
    } finally {
        openMenuId.value = null
    }
}

/** DELETE /notifications/:id */
async function removeNotification(n) {
    try {
        const apiBase = useRuntimeConfig().public.apiBase || 'http://localhost:3000/api'
        const tk = useCookie('token')?.value || (process.client ? localStorage.getItem('token') : '')
        await fetch(`${apiBase}/notifications/${n.id}`, {
            method: 'DELETE',
            headers: { Accept: 'application/json', ...(tk ? { Authorization: `Bearer ${tk}` } : {}) },
            credentials: 'include'
        })
        notifications.value = notifications.value.filter(x => x.id !== n.id)
    } finally {
        openMenuId.value = null
    }
}

/* ปิด dropdown เมื่อคลิกนอก/กด Esc */
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

/* lifecycle */
onMounted(() => {
    window.addEventListener('resize', handleResize)
    document.addEventListener('click', onClickOutside)
    document.addEventListener('keydown', onKey)
    if (token.value) fetchUserNotifications()
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    document.removeEventListener('click', onClickOutside)
    document.removeEventListener('keydown', onKey)
})

/* ใส่ฟอนต์ Kanit แบบเดิม */
useHead({
    link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap' },
        //{ rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css' }
    ]
})
</script>


<style scoped>
* {
    font-family: 'Kanit', sans-serif;
}

.dropdown-menu {
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.3s ease;
}

.dropdown-trigger:hover .dropdown-menu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.dropdown-arrow::before {
    content: '';
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid white;
}

.user-dropdown-arrow::before {
    left: 80%;
}

.rotate-180 {
    transform: rotate(180deg);
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>