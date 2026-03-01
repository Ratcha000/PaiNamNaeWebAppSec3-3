<template>
    <aside id="sidebar" class="fixed bottom-0 left-0 bg-white shadow-lg sidebar top-16">
        <div class="py-4">
            <!-- Toggle Button -->
            <button @click="toggleSidebar"
                class="absolute flex items-center justify-center hidden w-6 h-6 transition-colors bg-white rounded-full shadow-md lg:block -right-3 top-6 hover:bg-blue-600 hover:text-white">
                <i class="text-xs fas fa-chevron-left" id="toggle-icon"></i>
            </button>

            <!-- Menu Items -->
            <nav class="px-3 space-y-1">
                <NuxtLink to="/admin/users"
                    class="sidebar-item flex items-center gap-3 px-3 py-2.5 text-gray-700 rounded-lg hover:bg-blue-50">
                    <i class="w-6 text-lg text-center text-gray-500 fas fa-user"></i>
                    <span class="sidebar-text">User Management</span>
                </NuxtLink>

                <NuxtLink to="/admin/vehicles"
                    class="sidebar-item flex items-center gap-3 px-3 py-2.5 text-gray-700 rounded-lg hover:bg-blue-50"
                    active-class="font-semibold text-blue-600 bg-blue-50">
                    <i class="w-6 text-lg text-center text-gray-500 fas fa-car-side"></i>
                    <span class="sidebar-text">Vehicle Management</span>
                </NuxtLink>

                <NuxtLink to="/admin/routes"
                    class="sidebar-item flex items-center gap-3 px-3 py-2.5 text-gray-700 rounded-lg hover:bg-blue-50"
                    active-class="font-semibold text-blue-600 bg-blue-50">
                    <i class="w-6 text-lg text-center text-gray-500 fas fa-route"></i>
                    <span class="sidebar-text">Route Management</span>
                </NuxtLink>

                <NuxtLink to="/admin/bookings"
                    class="sidebar-item flex items-center gap-3 px-3 py-2.5 text-gray-700 rounded-lg hover:bg-blue-50"
                    active-class="font-semibold text-blue-600 bg-blue-50">
                    <i class="w-6 text-lg text-center text-gray-500 fas fa-calendar-check"></i>
                    <span class="sidebar-text">Booking Management</span>
                </NuxtLink>

                <NuxtLink to="/admin/driver-verifications"
                    class="sidebar-item flex items-center gap-3 px-3 py-2.5 text-gray-700 rounded-lg hover:bg-blue-50"
                    active-class="font-semibold text-blue-600 bg-blue-50">
                    <i class="w-6 text-lg text-center text-gray-500 fas fa-id-card"></i>
                    <span class="sidebar-text">Driver Verification Management</span>
                </NuxtLink>

                <NuxtLink to="/"
                    class="sidebar-item flex items-center gap-3 px-3 py-2.5 text-gray-700 rounded-lg hover:bg-blue-50">
                    <i class="w-6 text-lg text-center text-gray-500 fas fa-home"></i>
                    <span class="sidebar-text">Home</span>
                </NuxtLink>

                <!-- Settings -->
                <div class="group">
                    <button @click="toggleSubmenu('ecom-menu')"
                        class="sidebar-item w-full flex items-center justify-between gap-3 px-3 py-2.5 text-gray-700 rounded-lg hover:bg-blue-50">
                        <div class="flex items-center gap-3">
                            <i class="w-6 text-lg text-center text-gray-500 fas fa-gear"></i>
                            <span class="sidebar-text">Setting</span>
                        </div>
                        <i class="text-xs transition-transform fas fa-chevron-down sidebar-text"
                            id="ecom-menu-icon"></i>
                    </button>

                    <div id="ecom-menu" class="hidden mt-1 ml-12 space-y-1 sidebar-text">
                        <button @click="logout" class="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600">
                            Logout
                        </button>
                    </div>
                </div>
            </nav>
        </div>
    </aside>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth'
const { logout } = useAuth()

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar')
    const mainContent = document.getElementById('main-content')
    const toggleIcon = document.getElementById('toggle-icon')
    if (!sidebar || !mainContent) return

    sidebar.classList.toggle('collapsed')
    if (sidebar.classList.contains('collapsed')) {
        mainContent.style.marginLeft = '80px'
        if (toggleIcon) toggleIcon.classList.replace('fa-chevron-left', 'fa-chevron-right')
    } else {
        mainContent.style.marginLeft = '280px'
        if (toggleIcon) toggleIcon.classList.replace('fa-chevron-right', 'fa-chevron-left')
    }
}

function toggleSubmenu(menuId) {
    const menu = document.getElementById(menuId)
    const icon = document.getElementById(menuId + '-icon')
    if (!menu || !icon) return
    menu.classList.toggle('hidden')
    icon.classList.toggle('fa-chevron-down')
    icon.classList.toggle('fa-chevron-up')
}
</script>
