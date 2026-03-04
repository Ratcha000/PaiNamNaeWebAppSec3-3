<template>
    <div>
        <div class="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div class="p-6 mb-8 bg-white border border-gray-300 rounded-lg shadow-md">
                <h2 class="mb-6 text-xl font-semibold text-gray-900">ค้นหาการเดินทาง</h2>
                <form @submit.prevent="handleSearch" class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <!-- จุดเริ่มต้น -->
                    <div>
                        <label class="block mb-2 text-sm font-medium text-gray-700">จุดเริ่มต้น</label>
                        <div class="relative">
                            <input ref="originInputEl" v-model="searchForm.origin" type="text"
                                placeholder="เช่น กรุงเทพฯ"
                                class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <!-- ไอคอนปักหมุด -->
                            <button type="button" @click="openPlacePicker('origin')"
                                class="absolute inset-y-0 my-auto text-gray-500 right-2 hover:text-blue-600"
                                title="เลือกจากแผนที่">
                                <!-- pin icon -->
                                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <path
                                        d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <!-- จุดปลายทาง -->
                    <div>
                        <label class="block mb-2 text-sm font-medium text-gray-700">จุดปลายทาง</label>
                        <div class="relative">
                            <input ref="destinationInputEl" v-model="searchForm.destination" type="text"
                                placeholder="เช่น เชียงใหม่"
                                class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <!-- ไอคอนปักหมุด -->
                            <button type="button" @click="openPlacePicker('destination')"
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
                        <label class="block mb-2 text-sm font-medium text-gray-700">วันที่</label>
                        <input v-model="searchForm.date" type="date"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    </div>
                    <div>
                        <label class="block mb-2 text-sm font-medium text-gray-700">จำนวนที่นั่ง</label>
                        <select v-model="searchForm.seats"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="1">1 ที่นั่ง</option>
                            <option value="2">2 ที่นั่ง</option>
                            <option value="3">3 ที่นั่ง</option>
                            <option value="4">4 ที่นั่ง</option>
                        </select>
                    </div>
                    <div class="flex items-end">
                        <button type="submit"
                            class="w-full px-4 py-2 text-white transition duration-200 bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            ค้นหา
                        </button>
                    </div>
                </form>
            </div>

            <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 ">
                <div class="lg:col-span-2 ">
                    <div class="bg-white border border-gray-300 rounded-lg shadow-md">
                        <div class="p-6 border-b border-gray-300">
                            <h3 class="text-lg font-semibold text-gray-900">ผลการค้นหา ({{ routes.length }} รายการ)</h3>
                        </div>
                        <div v-if="isLoading" class="p-6 text-center text-gray-500">
                            กำลังค้นหาเส้นทาง...
                        </div>
                        <div v-else class="divide-y divide-gray-200">
                            <div v-if="routes.length === 0" class="p-6 text-center text-gray-500">
                                ไม่พบเส้นทางที่ค้นหา
                            </div>
                            <div v-for="route in routes" :key="route.id"
                                class="p-6 transition-all duration-300 cursor-pointer route-card hover:shadow-lg"
                                @click="toggleDetails(route)">
                                <h1 class="mb-6 font-semibold text-center text-gray-900">
                                    {{ route.originName }} <span class="mx-1 font-semibold text-gray-900">→</span> {{
                                        route.destinationName }}
                                </h1>
                                <div class="flex items-start space-x-4">
                                    <img :src="route.driver.image" :alt="route.driver.name"
                                        class="object-cover w-12 h-12 rounded-full">
                                    <div class="flex-1">
                                        <div class="flex items-start justify-between">
                                            <div>
                                                <div class="flex items-center">
                                                    <h4 class="font-semibold text-gray-900">{{ route.driver.name }}</h4>

                                                    <div v-if="route.driver.isVerified"
                                                        class="relative group ml-1.5 flex items-center">
                                                        <svg class="w-5 h-5 text-blue-600" viewBox="0 0 24 24"
                                                            fill="currentColor">
                                                            <path fill-rule="evenodd"
                                                                d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12c0 1.357-.6 2.573-1.549 3.397a4.49 4.49 0 01-1.307 3.498 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.07-.01l3.5-4.875z"
                                                                clip-rule="evenodd" />
                                                        </svg>
                                                        <span
                                                            class="absolute px-2 py-1 mb-2 text-xs text-white transition-opacity -translate-x-1/2 bg-gray-800 rounded-md opacity-0 pointer-events-none bottom-full left-1/2 w-max group-hover:opacity-100">
                                                            ผู้ขับขี่ยืนยันตัวตนแล้ว
                                                        </span>
                                                    </div>
                                                </div>
                                                <div class="flex items-center mt-1">
                                                    <div class="flex text-yellow-400">
                                                        <span v-for="star in 5" :key="star">{{ star <=
                                                            route.driver.rating ? '★' : '☆' }}</span>
                                                    </div>
                                                    <span class="ml-2 text-sm text-gray-600">
                                                        {{ route.driver.rating }} ({{ route.driver.reviews }} รีวิว)
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="text-right">
                                                <div class="text-lg font-bold text-blue-600">{{ route.price }} บาท</div>
                                                <div class="text-sm text-gray-600">ต่อที่นั่ง</div>
                                            </div>
                                        </div>
                                        <div class="mt-3">
                                            <div class="flex flex-wrap items-center text-sm text-gray-600">
                                                <span class="font-medium">{{ route.date }}</span>
                                                <span class="mx-2 text-gray-300">|</span>
                                                <span class="font-medium">เวลาออก:</span>
                                                <span class="ml-1">{{ route.departureTime }}</span>
                                                <span class="mx-2 text-gray-300">|</span>
                                                <span class="font-medium">ระยะเวลา:</span>
                                                <span class="ml-1">{{ route.durationText }}</span>
                                                <span class="mx-2 text-gray-300">|</span>
                                                <span class="font-medium">ระยะทาง:</span>
                                                <span class="ml-1">{{ route.distanceText }}</span>
                                            </div>

                                            <div class="flex items-center mt-2 text-sm text-gray-600">
                                                <span :class="[
                                                    'px-2 py-1 rounded-full text-xs font-medium',
                                                    route.availableSeats > 2 ? 'bg-green-100 text-green-800' : route.availableSeats > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                                ]">
                                                    {{ route.availableSeats > 0 ? `เหลือ ${route.availableSeats}
                                                    ที่นั่ง` : 'เต็มแล้ว' }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div v-if="selectedRoute && selectedRoute.id === route.id"
                                    class="pt-4 mt-4 duration-300 border-t border-gray-300 animate-in slide-in-from-top">
                                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <h5 class="mb-2 font-medium text-gray-900">รายละเอียดเส้นทาง</h5>
                                            <ul class="space-y-1 text-sm text-gray-600">
                                                <li v-if="route.originArea">• จุดเริ่มต้น (พื้นที่): {{ route.originArea
                                                    }}</li>
                                                <li v-if="route.destinationArea">• จุดปลายทาง (พื้นที่): {{
                                                    route.destinationArea }}</li>
                                                <li v-for="stop in route.stops" :key="stop">• {{ stop }}</li>
                                            </ul>
                                            <ul class="space-y-1 text-sm text-gray-600">
                                                <li v-for="stop in route.stops" :key="stop">• {{ stop }}</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 class="mb-2 font-medium text-gray-900">รายละเอียดรถ</h5>
                                            <ul class="space-y-1 text-sm text-gray-600">
                                                <li v-for="detail in route.carDetails" :key="detail">• {{ detail }}</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="mt-4 space-y-4">
                                        <div v-if="route.conditions">
                                            <h5 class="mb-2 font-medium text-gray-900">เงื่อนไขการเดินทาง</h5>
                                            <p
                                                class="p-3 text-sm text-gray-700 border border-gray-300 rounded-md bg-gray-50">
                                                {{ route.conditions }}
                                            </p>
                                        </div>
                                        <div v-if="route.photos && route.photos.length > 0">
                                            <h5 class="mb-2 font-medium text-gray-900">รูปภาพรถยนต์</h5>
                                            <div class="grid grid-cols-3 gap-2 mt-2 ">
                                                <div v-for="(photo, index) in route.photos.slice(0, 3)" :key="index"
                                                    class="">
                                                    <img :src="photo" alt="Vehicle photo"
                                                        class="object-cover w-full transition-opacity border border-gray-300 rounded-lg shadow-sm cursor-pointer aspect-video hover:opacity-90">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex justify-end mt-4">
                                        <button @click.stop="openModal(route)" :disabled="route.availableSeats === 0"
                                            class="px-6 py-2 text-white transition duration-200 bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                                            จองที่นั่ง
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="lg:col-span-1">
                    <div class="sticky overflow-hidden bg-white border border-gray-300 rounded-lg shadow-md top-8">
                        <div class="p-6 border-b border-gray-300">
                            <h3 class="text-lg font-semibold text-gray-900">แผนที่เส้นทาง</h3>
                        </div>
                        <div ref="mapContainer" class="h-96"></div>
                    </div>
                </div>
            </div>
        </div>

        <transition name="modal-fade">
            <div v-if="showModal && bookingRoute" class="modal-overlay" @click.self="closeModal">
                <div class="modal-content">
                    <template v-if="!bookingPickingTarget">
                        <div class="flex items-center justify-between p-6 border-b border-gray-300">
                            <h3 class="text-xl font-semibold text-gray-900">ยืนยันการจอง</h3>
                            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                    </template>
                    <template v-else>
                        <div class="flex items-center justify-between p-4 border-b border-gray-300">
                            <h3 class="text-lg font-semibold text-gray-900">
                                เลือก{{ bookingPickingTarget === 'pickup' ? 'จุดขึ้นรถ' : 'จุดลงรถ' }}
                            </h3>
                            <button @click="stopBookingPicker" class="text-gray-400 hover:text-gray-600">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div class="p-0">
                            <div ref="bookingPickerMapEl" class="w-full" style="height: 72vh;"></div>
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
                    </template>
                    <div class="p-6">
                        <div class="mb-6">
                            <h4 class="mb-3 font-semibold text-gray-900">เดินทางกับ</h4>
                            <div class="flex items-center p-3 space-x-3 rounded-lg bg-gray-50">
                                <img :src="bookingRoute.driver.image" :alt="bookingRoute.driver.name"
                                    class="object-cover w-12 h-12 rounded-full">
                                <div>
                                    <!-- <div class="font-medium text-gray-900">{{ bookingRoute.driver.name }}</div> -->
                                    <div class="flex items-center">
                                        <div class="font-medium text-gray-900">{{ bookingRoute.driver.name }}</div>

                                        <div v-if="bookingRoute.driver.isVerified"
                                            class="relative group ml-1.5 flex items-center">
                                            <svg class="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                                                <path fill-rule="evenodd"
                                                    d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12c0 1.357-.6 2.573-1.549 3.397a4.49 4.49 0 01-1.307 3.498 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.07-.01l3.5-4.875z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                            <span
                                                class="absolute px-2 py-1 mb-2 text-xs text-white transition-opacity -translate-x-1/2 bg-gray-800 rounded-md opacity-0 pointer-events-none bottom-full left-1/2 w-max group-hover:opacity-100">
                                                ผู้ขับขี่ยืนยันตัวตนแล้ว
                                            </span>
                                        </div>
                                    </div>
                                    <div class="flex items-center">
                                        <div class="flex text-sm text-yellow-400">
                                            <span v-for="star in 5" :key="star">{{ star <= bookingRoute.driver.rating
                                                ? '★' : '☆' }}</span>
                                        </div>
                                        <span class="ml-2 text-sm text-gray-600">{{ bookingRoute.driver.rating }} ({{
                                            bookingRoute.driver.reviews }} รีวิว)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
                            <div>
                                <label class="block mb-2 text-sm font-medium text-gray-700">วันที่เดินทาง</label>
                                <div class="p-3 text-gray-900 rounded-lg bg-gray-50">
                                    {{ bookingRoute.date }}
                                </div>
                            </div>
                            <div>
                                <label class="block mb-2 text-sm font-medium text-gray-700">เวลาออก</label>
                                <div class="p-3 text-gray-900 rounded-lg bg-gray-50">
                                    {{ bookingRoute.departureTime }}
                                </div>
                            </div>
                        </div>
                        <div class="mb-6">
                            <h4 class="mb-3 font-semibold text-gray-900">เส้นทางการเดินทาง</h4>
                            <div class="flex items-center p-3 space-x-4 rounded-lg bg-gray-50">
                                <div class="flex-1">
                                    <div class="font-medium text-gray-900">{{ bookingRoute.originName }}</div>
                                    <div class="text-sm text-gray-600">จุดเริ่มต้น</div>
                                </div>
                                <div class="text-blue-600">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </div>
                                <div class="flex-1 text-right">
                                    <div class="font-medium text-gray-900">{{ bookingRoute.destinationName }}</div>
                                    <div class="text-sm text-gray-600">จุดปลายทาง</div>
                                </div>
                            </div>
                        </div>
                        <div class="mb-6 space-y-4">
                            <div>
                                <label
                                    class="block mb-2 text-sm font-medium text-gray-700">จำนวนที่นั่งที่ต้องการจอง</label>
                                <select v-model="bookingSeats"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option v-for="seat in bookingRoute.availableSeats" :key="seat" :value="seat">
                                        {{ seat }} ที่นั่ง
                                    </option>
                                </select>
                            </div>
                            <div>
                                <label class="block mb-2 text-sm font-medium text-gray-700">เลือกจุดขึ้นรถ</label>
                                <div class="relative">
                                    <input ref="pickupInputEl" v-model="pickupPoint" type="text"
                                        placeholder="พิมพ์ชื่อสถานที่..."
                                        class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
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
                                        class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
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
                        <div class="p-4 mb-6 rounded-lg bg-blue-50">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-gray-700">ราคาต่อที่นั่ง</span>
                                <span class="font-medium text-gray-900">{{ bookingRoute.price }} บาท</span>
                            </div>
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-gray-700">จำนวนที่นั่ง</span>
                                <span class="font-medium text-gray-900">{{ bookingSeats }} ที่นั่ง</span>
                            </div>
                            <div class="pt-2 mt-2 border-t border-gray-300">
                                <div class="flex items-center justify-between">
                                    <span class="font-semibold text-gray-900">ยอดรวม</span>
                                    <span class="text-lg font-bold text-blue-600">{{ bookingTotalPrice }} บาท</span>
                                </div>
                            </div>
                        </div>
                        <div class="flex space-x-4">
                            <button @click="closeModal"
                                class="flex-1 px-4 py-3 font-semibold text-gray-800 transition duration-200 bg-gray-200 rounded-md hover:bg-gray-300">
                                ยกเลิก
                            </button>
                            <button @click="confirmBooking"
                                class="flex-1 px-4 py-3 font-semibold text-white transition duration-200 bg-blue-600 rounded-md hover:bg-blue-700">
                                ยืนยันการจอง
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <!-- Map Picker Modal -->
        <transition name="modal-fade">
            <div v-if="showPlacePicker" class="modal-overlay" @click.self="closePlacePicker">
                <div class="modal-content">
                    <div class="flex items-center justify-between p-4 border-b border-gray-300">
                        <h3 class="text-lg font-semibold text-gray-900">เลือก{{ pickingField === 'origin' ?
                            'จุดเริ่มต้น' : 'จุดปลายทาง' }}</h3>
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
</template>


<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/th'
import buddhistEra from 'dayjs/plugin/buddhistEra'
import { useToast } from '~/composables/useToast';
import { useAuth } from '~/composables/useAuth';
import { navigateTo } from '#app';

dayjs.locale('th')
dayjs.extend(buddhistEra)

const { $api } = useNuxtApp()
const { toast } = useToast();
const { token } = useAuth();
const config = useRuntimeConfig()
const GMAPS_CB = '__gmapsReady__'

// --- Booking modal: Autocomplete + Picker ---
const pickupInputEl = ref(null)
const dropoffInputEl = ref(null)
let pickupAutocomplete = null
let dropoffAutocomplete = null

// โครงสร้างเต็มที่จะส่งให้ API
const pickupData = ref({ lat: null, lng: null, placeId: null, address: null, name: null })
const dropoffData = ref({ lat: null, lng: null, placeId: null, address: null, name: null })

// โหมดปักหมุดใน modal เดิม
const bookingPickingTarget = ref(/** @type {'pickup'|'dropoff'|null} */(null))
const bookingPickerMapEl = ref(null)
let bookingPickerMap = null
let bookingPickerMarker = null
const bookingPicked = ref({ name: '', lat: null, lng: null, placeId: null, address: null })

// ---- NEW: refs & state สำหรับ Autocomplete ----
const originInputEl = ref(null)
const destinationInputEl = ref(null)
let originAutocomplete = null
let destinationAutocomplete = null

// --- สำหรับ Map Picker ---
const showPlacePicker = ref(false)
const pickingField = ref(/** @type {'origin'|'destination'|null} */(null))
const placePickerMapEl = ref(null)
let placePickerMap = null
let placePickerMarker = null
const pickedPlace = ref({ name: '', lat: null, lng: null })

const headScripts = []
if (process.client && !window.google?.maps) {
    headScripts.push({
        key: 'gmaps',                        // ทำให้ Nuxt dedupe
        src: `https://maps.googleapis.com/maps/api/js?key=${config.public.googleMapsApiKey}&libraries=places,geometry&callback=${GMAPS_CB}`,
        async: true,
        defer: true
    })
}

useHead({
    title: 'ค้นหาเส้นทาง - Car Pool',
    link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap' },
        // { rel: 'stylesheet', href: 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css' }
    ],
    script: headScripts
})

const searchForm = ref({
    origin: '',
    destination: '',
    date: '',
    seats: '1'
})

const routes = ref([])
const selectedRoute = ref(null)
const isLoading = ref(false)

const mapContainer = ref(null)
let gmap = null               // แผนที่ของ Google
let activePolyline = null     // เส้นทางที่กำลังแสดงอยู่
let startMarker = null
let endMarker = null
let geocoder = null
let placesService = null
const mapReady = ref(false)

const showModal = ref(false)
const bookingRoute = ref(null)
const bookingSeats = ref(1)
const pickupPoint = ref('')
const dropoffPoint = ref('')

const bookingTotalPrice = computed(() => {
    if (!bookingRoute.value) return 0
    return bookingSeats.value * bookingRoute.value.price
})

async function handleSearch() {
    isLoading.value = true
    selectedRoute.value = null

    try {
        const apiRes = await $api('/routes')
        const raw = (apiRes?.data || apiRes || []).filter(r => r.status === 'AVAILABLE')

        // map ข้อมูลฐาน
        routes.value = raw.map(route => ({
            id: route.id,
            availableSeats: route.availableSeats,
            price: route.pricePerSeat,
            departureTime: dayjs(route.departureTime).format('HH:mm น.'),
            date: dayjs(route.departureTime).format('D MMMM BBBB'),
            start: route.startLocation,
            end: route.endLocation,
            // ตั้งชื่อเริ่มต้นเป็นพิกัดไว้ก่อน (กันหน้ากระพริบ)
            originName: `(${route.startLocation.lat.toFixed(2)}, ${route.startLocation.lng.toFixed(2)})`,
            destinationName: `(${route.endLocation.lat.toFixed(2)}, ${route.endLocation.lng.toFixed(2)})`,
            driver: {
                name: `${route.driver?.firstName || ''} ${route.driver?.lastName || ''}`.trim() || 'ไม่ระบุชื่อ',
                image: route.driver?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(route.driver?.firstName || 'U')}&background=random&size=64`,
                rating: 4.5,
                reviews: Math.floor(Math.random() * 50) + 5,
                isVerified: !!route.driver?.isVerified
            },
            carDetails: route.vehicle
                ? [`${route.vehicle.vehicleModel} (${route.vehicle.vehicleType})`, ...(route.vehicle.amenities || [])]
                : ['ไม่มีข้อมูลรถ'],
            conditions: route.conditions,
            photos: route.vehicle?.photos || [],
            durationText: route.duration || '-',    // ใช้ค่าจาก backend ที่ส่งมาแล้ว (เช่น "9 ชั่วโมง 10 นาที")
            distanceText: route.distance || '-',    // เช่น "687 กม."
            polyline: route.routePolyline || null,
        }))

        // รอให้ geocoder พร้อมก่อนค่อยทำ reverse geocode
        await waitMapReady()

        const jobs = routes.value.map(async (r, i) => {
            const [o, d] = await Promise.all([
                reverseGeocode(r.start.lat, r.start.lng),
                reverseGeocode(r.end.lat, r.end.lng)
            ])

            const oParts = await extractNameParts(o)
            const dParts = await extractNameParts(d)

            routes.value[i].originName = oParts.name || routes.value[i].originName   // ชื่อหลัก (สั้น)
            routes.value[i].destinationName = dParts.name || routes.value[i].destinationName
            routes.value[i].originArea = oParts.area || null                          // เก็บพื้นที่ไว้แสดงในรายละเอียด
            routes.value[i].destinationArea = dParts.area || null
        })
        await Promise.allSettled(jobs)

    } catch (e) {
        console.error('Failed to fetch routes:', e)
        routes.value = []
    } finally {
        isLoading.value = false
    }
}

function reverseGeocode(lat, lng) {
    return new Promise((resolve) => {
        if (!geocoder) return resolve(null)
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status !== 'OK' || !results?.length) return resolve(null)
            resolve(results[0]) // << คืน object เพื่อให้ formatShortAddress ใช้ address_components ได้
        })
    })
}

async function extractNameParts(geocodeResult) {
    if (!geocodeResult) return { name: null, area: null }

    const comps = geocodeResult.address_components || []
    const byType = (t) => comps.find(c => c.types.includes(t))?.long_name
    const byTypeShort = (t) => comps.find(c => c.types.includes(t))?.short_name

    const types = geocodeResult.types || []
    const isPoi = types.includes('point_of_interest') || types.includes('establishment') || types.includes('premise')

    // ---- ชื่อหลัก (name) ----
    let name = null
    if (isPoi && geocodeResult.place_id) {
        const poiName = await getPlaceName(geocodeResult.place_id)
        if (poiName) name = poiName
    }
    if (!name) {
        // ไม่ใช่ POI -> ใช้ถนน/ซอย (route) หรือเลขที่ + ถนน
        const streetNumber = byType('street_number')
        const route = byType('route')
        name = (streetNumber && route) ? `${streetNumber} ${route}` : (route || geocodeResult.formatted_address || null)
    }

    // ---- พื้นที่ (area) -> ตำบล/ย่าน + จังหวัด ----
    const sublocality =
        byType('sublocality') ||
        byType('neighborhood') ||
        byType('locality') ||
        byType('administrative_area_level_2')

    const province = byType('administrative_area_level_1') || byTypeShort('administrative_area_level_1')
    let area = null
    if (sublocality && province) area = `${sublocality}, ${province}`
    else if (province) area = province

    // ตัดประเทศทิ้งถ้าเผลอหลุดมา
    if (name) name = name.replace(/,?\s*(Thailand|ไทย)\s*$/i, '')

    return { name, area }
}

const toggleDetails = (route) => {
    if (selectedRoute.value && selectedRoute.value.id === route.id) {
        selectedRoute.value = null
        clearMapDrawing()
    } else {
        selectedRoute.value = route
        updateMapForRoute(route)
    }
}

function waitMapReady() {
    return new Promise((resolve) => {
        if (mapReady.value) return resolve(true)
        const t = setInterval(() => {
            if (mapReady.value) {
                clearInterval(t)
                resolve(true)
            }
        }, 50)
    })
}

function formatShortAddress(geocodeResult) {
    if (!geocodeResult) return null
    // ลองหยิบ locality / sublocality (ตำบล/เขต) + administrative_area_level_1 (จังหวัด)
    const comps = geocodeResult.address_components || []
    const byType = (t) => comps.find(c => c.types.includes(t))?.long_name

    const locality =
        byType('sublocality') ||
        byType('locality') ||
        byType('administrative_area_level_2') // อำเภอ/เขต

    const province = byType('administrative_area_level_1') // จังหวัด

    if (locality && province) return `${locality}, ${province}`
    if (province) return province
    // fallback เป็น formatted_address (สั้นสุดเท่าที่ได้)
    return geocodeResult.formatted_address || null
}

function clearMapDrawing() {
    if (activePolyline) { activePolyline.setMap(null); activePolyline = null }
    if (startMarker) { startMarker.setMap(null); startMarker = null }
    if (endMarker) { endMarker.setMap(null); endMarker = null }
}

async function updateMapForRoute(route) {
    if (!route) return
    // รอให้ Map พร้อมแน่ๆ
    await waitMapReady()
    if (!gmap || !(gmap instanceof google.maps.Map)) return

    clearMapDrawing()

    // วางหมุด
    startMarker = new google.maps.Marker({
        position: { lat: route.start.lat, lng: route.start.lng },
        map: gmap, label: 'A'
    })
    endMarker = new google.maps.Marker({
        position: { lat: route.end.lat, lng: route.end.lng },
        map: gmap, label: 'B'
    })

    // วาดเส้นจาก polyline ถ้ามี
    if (route.polyline && google.maps.geometry?.encoding) {
        const path = google.maps.geometry.encoding.decodePath(route.polyline)
        activePolyline = new google.maps.Polyline({
            path, map: gmap, strokeColor: '#2563eb', strokeOpacity: 0.9, strokeWeight: 5,
        })
        const bounds = new google.maps.LatLngBounds()
        path.forEach(p => bounds.extend(p))
        gmap.fitBounds(bounds) // << ตัด arg ที่ 2 ออก ป้องกัน overload เพี้ยน
    } else {
        // ไม่มี polyline: fit จาก A-B
        const sw = new google.maps.LatLng(
            Math.min(route.start.lat, route.end.lat),
            Math.min(route.start.lng, route.end.lng)
        )
        const ne = new google.maps.LatLng(
            Math.max(route.start.lat, route.end.lat),
            Math.max(route.start.lng, route.end.lng)
        )
        const bounds = new google.maps.LatLngBounds(sw, ne)
        gmap.fitBounds(bounds) // << ไม่ส่ง padding
    }
}

function getPlaceName(placeId) {
    return new Promise((resolve) => {
        if (!placesService || !placeId) return resolve(null)
        placesService.getDetails(
            { placeId, fields: ['name'] },
            (place, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && place?.name) {
                    resolve(place.name)
                } else {
                    resolve(null)
                }
            }
        )
    })
}

async function formatPrettyAddress(geocodeResult) {
    if (!geocodeResult) return null

    const comps = geocodeResult.address_components || []
    const byType = (t) => comps.find(c => c.types.includes(t))?.long_name
    const byTypeShort = (t) => comps.find(c => c.types.includes(t))?.short_name

    // ถ้าเป็นสถานที่ (POI / landmark) ลองดึงชื่อจริงจาก Places
    const types = geocodeResult.types || []
    const isPoi = types.includes('point_of_interest') || types.includes('establishment') || types.includes('premise')

    if (isPoi && geocodeResult.place_id) {
        const poiName = await getPlaceName(geocodeResult.place_id)
        if (poiName) {
            // ใส่พื้นที่กว้างๆ ต่อท้ายให้พอรู้เมือง
            const sublocality = byType('sublocality') || byType('neighborhood') || byType('locality') || byType('administrative_area_level_2')
            const province = byType('administrative_area_level_1') || byTypeShort('administrative_area_level_1')
            if (sublocality && province) return `${poiName}, ${sublocality}, ${province}`
            if (province) return `${poiName}, ${province}`
            return poiName
        }
    }

    // ไม่ใช่ POI: สร้างชื่อจากถนน/ซอย + ย่าน/ตำบล + จังหวัด
    const streetNumber = byType('street_number')
    const route = byType('route') // ชื่อถนน/ซอย
    const sublocality = byType('sublocality') || byType('neighborhood') || byType('locality') || byType('administrative_area_level_2')
    const province = byType('administrative_area_level_1') || byTypeShort('administrative_area_level_1')

    const street = (streetNumber && route) ? `${streetNumber} ${route}` : (route || null)

    if (street && sublocality && province) return `${street}, ${sublocality}, ${province}`
    if (street && province) return `${street}, ${province}`
    if (sublocality && province) return `${sublocality}, ${province}`

    // fallback: ใช้ formatted_address แต่พยายามตัดประเทศออก ให้สั้นลง
    const fa = geocodeResult.formatted_address || ''
    const trimmed = fa.replace(/,?\s*(Thailand|ไทย)\s*$/i, '')
    return trimmed || null
}

function openModal(route) {
    if (!token.value) {
        return navigateTo('/login');
    }
    if (route && route.availableSeats > 0) {
        bookingRoute.value = route
        bookingSeats.value = 1
        pickupPoint.value = ''
        dropoffPoint.value = ''
        pickupData.value = { lat: null, lng: null, placeId: null, address: null, name: null }
        dropoffData.value = { lat: null, lng: null, placeId: null, address: null, name: null }
        bookingPickingTarget.value = null
        showModal.value = true

        nextTick(() => initBookingAutocomplete())
    }
}

function closeModal() {
    showModal.value = false
    setTimeout(() => {
        bookingRoute.value = null
    }, 300);
}

async function confirmBooking() {
    if (!bookingRoute.value) return;

    // ถ้าผู้ใช้พิมพ์เองแต่ยังไม่มีพิกัด ให้ geocode จากข้อความ
    if (pickupPoint.value && !pickupData.value.lat) {
        const g1 = await geocodeText(pickupPoint.value)
        if (g1) pickupData.value = g1
    }
    if (dropoffPoint.value && !dropoffData.value.lat) {
        const g2 = await geocodeText(dropoffPoint.value)
        if (g2) dropoffData.value = g2
    }

    if (!pickupData.value.lat || !dropoffData.value.lat) {
        toast.warning('ข้อมูลไม่ครบถ้วน', 'กรุณาเลือกจุดขึ้นรถและจุดลงรถจากรายการหรือปักหมุดบนแผนที่');
        return;
    }

    const payload = {
        routeId: bookingRoute.value.id,
        numberOfSeats: bookingSeats.value,
        pickupLocation: pickupData.value,
        dropoffLocation: dropoffData.value
    };

    try {
        await $api('/bookings', { method: 'POST', body: payload });
        closeModal();
        toast.success('ส่งคำขอจองสำเร็จ!', 'คำขอของคุณถูกส่งไปให้ผู้ขับแล้ว โปรดรอการยืนยัน');
        setTimeout(() => navigateTo('/myTrip'), 1500);
    } catch (error) {
        console.error("Failed to create booking:", error);
        toast.error('เกิดข้อผิดพลาดในการจอง', error.data?.message || 'โปรดลองใหม่อีกครั้งในภายหลัง');
    }
}

const initializeMap = () => {
    if (!mapContainer.value || gmap) return
    gmap = new google.maps.Map(mapContainer.value, {
        center: { lat: 13.7563, lng: 100.5018 },
        zoom: 6,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
    })
    geocoder = new google.maps.Geocoder()
    placesService = new google.maps.places.PlacesService(gmap) // ← เพิ่มบรรทัดนี้
    mapReady.value = true
}

function initAutocomplete() {
    if (!originInputEl.value || !destinationInputEl.value) return
    if (!window.google?.maps?.places) return

    const commonOpts = {
        fields: ['place_id', 'name', 'formatted_address', 'geometry'],
        // จำกัดประเทศถ้าต้องการ: componentRestrictions: { country: ['th'] },
    }

    // จุดเริ่มต้น
    originAutocomplete = new google.maps.places.Autocomplete(originInputEl.value, {
        ...commonOpts,
        types: ['geocode', 'establishment'],
    })
    originAutocomplete.addListener('place_changed', () => {
        const p = originAutocomplete.getPlace()
        if (!p) return
        // อัปเดตช่อง input ด้วยชื่อที่อ่านง่าย (ถ้าไม่มี name จะใช้ formatted_address)
        searchForm.value.origin = p.name || p.formatted_address || searchForm.value.origin
        // เก็บข้อมูลเสริม (ไม่ไปใช้ค้นหาในขั้นนี้ ตามที่ขอ)
        searchForm.value._originMeta = {
            placeId: p.place_id || null,
            fullAddress: p.formatted_address || null,
            lat: p.geometry?.location?.lat?.() ?? null,
            lng: p.geometry?.location?.lng?.() ?? null,
        }
    })

    // จุดปลายทาง
    destinationAutocomplete = new google.maps.places.Autocomplete(destinationInputEl.value, {
        ...commonOpts,
        types: ['geocode', 'establishment'],
    })
    destinationAutocomplete.addListener('place_changed', () => {
        const p = destinationAutocomplete.getPlace()
        if (!p) return
        searchForm.value.destination = p.name || p.formatted_address || searchForm.value.destination
        searchForm.value._destinationMeta = {
            placeId: p.place_id || null,
            fullAddress: p.formatted_address || null,
            lat: p.geometry?.location?.lat?.() ?? null,
            lng: p.geometry?.location?.lng?.() ?? null,
        }
    })
}

function openPlacePicker(field) {
    pickingField.value = field // 'origin' | 'destination'
    pickedPlace.value = { name: '', lat: null, lng: null }
    showPlacePicker.value = true

    nextTick(() => {
        // สร้างแผนที่ใน modal
        const fallbackCenter = { lat: 13.7563, lng: 100.5018 } // กรุงเทพฯ
        // ถ้ามี meta เก่า ให้ซูมไปตำแหน่งนั้น
        const meta = field === 'origin' ? searchForm.value._originMeta : searchForm.value._destinationMeta
        const center = (meta?.lat && meta?.lng) ? { lat: meta.lat, lng: meta.lng } : fallbackCenter

        placePickerMap = new google.maps.Map(placePickerMapEl.value, {
            center, zoom: meta?.lat ? 14 : 6,
            mapTypeControl: false, streetViewControl: false, fullscreenControl: false
        })

        // คลิกเพื่อปักหมุด
        placePickerMap.addListener('click', (e) => {
            const pos = e.latLng
            setPickerMarker(pos)
            resolvePicked(pos)
        })
    })
}

function setPickerMarker(latlng) {
    if (placePickerMarker) {
        placePickerMarker.setPosition(latlng)
        return
    }
    placePickerMarker = new google.maps.Marker({
        position: latlng, map: placePickerMap, draggable: true
    })
    placePickerMarker.addListener('dragend', (e) => {
        resolvePicked(e.latLng)
    })
}

async function resolvePicked(latlng) {
    const lat = latlng.lat(), lng = latlng.lng()

    // 1) reverse geocode หาที่อยู่ก่อน
    const geocodeRes = await new Promise((resolve) => {
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === 'OK' && results?.length) resolve(results[0])
            else resolve(null)
        })
    })

    let name = ''
    if (geocodeRes) {
        const parts = await extractNameParts(geocodeRes)
        name = parts.name || '' // พยายามใช้ชื่อสั้นตาม logic เดิมก่อน
    }

    // 2) ถ้าได้เป็น Plus Code หรือยังว่าง ให้ลองหา POI ใกล้เคียงมาใช้ชื่อแทน
    if (!name || isPlusCode(name)) {
        const poi = await findNearestPoi(lat, lng, 120)
        if (poi?.name) {
            name = poi.name
        } else if (geocodeRes?.formatted_address) {
            // fallback สุดท้าย: ใช้ formatted_address (ตัด "Thailand/ไทย" ออก)
            name = geocodeRes.formatted_address.replace(/,?\s*(Thailand|ไทย)\s*$/i, '')
        }
    }

    pickedPlace.value = { name, lat, lng }
}

function applyPickedPlace() {
    if (!pickingField.value || !pickedPlace.value.name) return
    if (pickingField.value === 'origin') {
        searchForm.value.origin = pickedPlace.value.name
        searchForm.value._originMeta = {
            placeId: null, fullAddress: null,
            lat: pickedPlace.value.lat, lng: pickedPlace.value.lng
        }
    } else if (pickingField.value === 'destination') {
        searchForm.value.destination = pickedPlace.value.name
        searchForm.value._destinationMeta = {
            placeId: null, fullAddress: null,
            lat: pickedPlace.value.lat, lng: pickedPlace.value.lng
        }
    }
    closePlacePicker()
}
function closePlacePicker() {
    showPlacePicker.value = false
    pickingField.value = null
    // cleanup marker/map reference (ตัว DOM จะถูกทิ้งเมื่อ modal ปิด)
    placePickerMarker = null
    placePickerMap = null
}

function isPlusCode(text) {
    if (!text) return false
    // ครอบคลุมรูปแบบมาตรฐาน เช่น "FRGG+799" หรือ "FRGG+799, Khon Kaen"
    return /^[A-Z0-9]{4,}\+[A-Z0-9]{2,}/i.test(text.trim())
}

// helper: หา POI ที่ใกล้ที่สุดจากพิกัด เพื่อเอาชื่อมาใช้
function findNearestPoi(lat, lng, radius = 100) {
    return new Promise((resolve) => {
        if (!placesService) return resolve(null)
        placesService.nearbySearch(
            { location: { lat, lng }, radius }, // ใช้ radius เล็ก ๆ ให้ได้ชื่อที่เกี่ยวข้องจริง
            (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && results?.length) {
                    resolve(results[0])   // เอาตัวที่ใกล้ที่สุด
                } else {
                    resolve(null)
                }
            }
        )
    })
}

function initBookingAutocomplete() {
    if (!window.google?.maps?.places) return
    const opts = { fields: ['place_id', 'name', 'formatted_address', 'geometry'], types: ['geocode', 'establishment'] }

    if (pickupInputEl.value) {
        pickupAutocomplete?.unbindAll?.()
        pickupAutocomplete = new google.maps.places.Autocomplete(pickupInputEl.value, opts)
        pickupAutocomplete.addListener('place_changed', () => {
            const p = pickupAutocomplete.getPlace()
            if (!p) return
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
        dropoffAutocomplete?.unbindAll?.()
        dropoffAutocomplete = new google.maps.places.Autocomplete(dropoffInputEl.value, opts)
        dropoffAutocomplete.addListener('place_changed', () => {
            const p = dropoffAutocomplete.getPlace()
            if (!p) return
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

function startBookingPicker(target) {
    bookingPickingTarget.value = target // 'pickup' | 'dropoff'
    bookingPicked.value = { name: '', lat: null, lng: null, placeId: null, address: null }

    nextTick(() => {
        const fallbackCenter = { lat: 13.7563, lng: 100.5018 }
        const base = target === 'pickup' ? pickupData.value : dropoffData.value
        const center = (base.lat && base.lng) ? { lat: base.lat, lng: base.lng } : fallbackCenter

        bookingPickerMap = new google.maps.Map(bookingPickerMapEl.value, {
            center, zoom: base.lat ? 15 : 6,
            mapTypeControl: false, streetViewControl: false, fullscreenControl: false
        })

        bookingPickerMap.addListener('click', async (e) => {
            const pos = e.latLng
            setBookingPickerMarker(pos)
            await resolveBookingPicked(pos)
        })
    })
}
function stopBookingPicker() {
    bookingPickingTarget.value = null
    bookingPickerMap = null
    bookingPickerMarker = null
}
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
    if (geocodeRes) {
        const parts = await extractNameParts(geocodeRes)
        name = parts.name || ''
    }

    // ถ้ายังไม่มีชื่อสวย ๆ ลองดึง POI ใกล้ ๆ มาใช้
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
    if (address) address = address.replace(/,?\s*(Thailand|ไทย)\s*$/i, '')

    bookingPicked.value = { name, lat, lng, placeId, address }
}
function applyBookingPicked() {
    if (!bookingPickingTarget.value || !bookingPicked.value.name) return
    const data = {
        lat: bookingPicked.value.lat,
        lng: bookingPicked.value.lng,
        placeId: bookingPicked.value.placeId,
        address: bookingPicked.value.address,
        name: bookingPicked.value.name
    }
    if (bookingPickingTarget.value === 'pickup') {
        pickupPoint.value = data.name || data.address || ''
        pickupData.value = data
    } else {
        dropoffPoint.value = data.name || data.address || ''
        dropoffData.value = data
    }
    stopBookingPicker()
}

function geocodeText(text) {
    return new Promise((resolve) => {
        if (!text) return resolve(null)
        geocoder.geocode({ address: text }, async (results, status) => {
            if (status !== 'OK' || !results?.length) return resolve(null)
            const r = results[0]
            const lat = r.geometry?.location?.lat?.()
            const lng = r.geometry?.location?.lng?.()
            const parts = await extractNameParts(r)
            resolve({
                lat, lng,
                placeId: r.place_id || null,
                address: (r.formatted_address || '').replace(/,?\s*(Thailand|ไทย)\s*$/i, ''),
                name: parts.name || null
            })
        })
    })
}

onMounted(() => {
    // โหลดเสร็จแล้วในหน้านี้อยู่แล้ว
    if (window.google?.maps) {
        initializeMap()
        initAutocomplete()
        handleSearch()
        return
    }

    // ยังไม่เสร็จ: รอ callback จากสคริปต์
    window[GMAPS_CB] = () => {
        try {
            delete window[GMAPS_CB]
        } catch { }
        initializeMap()
        initAutocomplete()
        handleSearch()
    }
})
</script>

<style scoped>
body,
* {
    font-family: 'Kanit', sans-serif;
}

.route-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
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

.modal-overlay {
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-content {
    background-color: white;
    border-radius: 0.75rem;
    max-width: 600px;
    width: 95%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-fade-enter-active .modal-content,
.modal-fade-leave-active .modal-content {
    transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
    transform: scale(0.9) translateY(1rem);
}
</style>