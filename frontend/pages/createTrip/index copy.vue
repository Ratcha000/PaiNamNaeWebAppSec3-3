<template>
    <div>
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Page Title -->
            <div class="mb-8">
                <h2 class="text-3xl font-bold text-gray-900 mb-2">
                    สร้างการเดินทางของคุณ
                </h2>
                <p class="text-gray-600">
                    กำหนดจุดเริ่มต้น ปลายทาง และรายละเอียดต่างๆ เพื่อให้ผู้โดยสารมาร่วมทาง
                </p>
            </div>

            <!-- Main Form -->
            <div class="bg-white rounded-lg shadow-md p-8">
                <form id="postRouteForm" novalidate class="space-y-8">
                    <!-- Route Information -->
                    <div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                            ข้อมูลเส้นทาง
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label for="startPoint" class="block text-sm font-medium text-gray-700 mb-2">
                                    จุดเริ่มต้น <span class="text-red-500">*</span>
                                </label>
                                <input id="startPoint" name="startPoint" type="text"
                                    placeholder="เช่น กรุงเทพมหานคร, ถนนสุขุมวิท" required
                                    class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500" />
                            </div>
                            <div>
                                <label for="endPoint" class="block text-sm font-medium text-gray-700 mb-2">
                                    จุดปลายทาง <span class="text-red-500">*</span>
                                </label>
                                <input id="endPoint" name="endPoint" type="text"
                                    placeholder="เช่น เชียงใหม่, ถนนนิมมานเหมินท์" required
                                    class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500" />
                            </div>
                        </div>
                    </div>

                    <!-- Trip Details -->
                    <div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                            รายละเอียดการเดินทาง
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label for="travelDate" class="block text-sm font-medium text-gray-700 mb-2">
                                    วันที่เดินทาง <span class="text-red-500">*</span>
                                </label>
                                <input id="travelDate" name="travelDate" type="date" required
                                    class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500" />
                            </div>
                            <div>
                                <label for="travelTime" class="block text-sm font-medium text-gray-700 mb-2">
                                    เวลาออกเดินทาง <span class="text-red-500">*</span>
                                </label>
                                <input id="travelTime" name="travelTime" type="time" required
                                    class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500" />
                            </div>
                            <div>
                                <label for="seatCount" class="block text-sm font-medium text-gray-700 mb-2">
                                    จำนวนที่นั่งที่รับได้ <span class="text-red-500">*</span>
                                </label>
                                <input id="seatCount" name="seatCount" type="number" min="1"
                                    placeholder="กรอกจำนวนที่นั่ง (เช่น 4)" required
                                    class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500" />
                                <p class="text-xs text-gray-500 mt-1">
                                    รถยนต์ส่วนบุคคลทั่วไปมี 4–5 ที่นั่ง หากใช้รถตู้/รถบัส
                                    ให้ระบุจำนวนได้ตามจริง
                                </p>
                            </div>
                            <div>
                                <label for="pricePerSeat" class="block text-sm font-medium text-gray-700 mb-2">
                                    ราคาต่อที่นั่ง (บาท) <span class="text-red-500">*</span>
                                </label>
                                <input id="pricePerSeat" name="pricePerSeat" type="number" min="0"
                                    placeholder="เช่น 250" required
                                    class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500" />
                            </div>
                        </div>
                    </div>

                    <!-- Pickup & Stops -->
                    <div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                            จุดขึ้นรถ และจุดแวะพัก
                        </h3>
                        <div class="grid grid-cols-1 gap-6">
                            <div>
                                <label for="boardingPoint" class="block text-sm font-medium text-gray-700 mb-2">
                                    จุดขึ้นรถ <span class="text-red-500">*</span>
                                </label>
                                <input id="boardingPoint" name="boardingPoint" type="text"
                                    placeholder="เช่น BTS อโศก, MRT ห้วยขวาง" required
                                    class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500" />
                            </div>
                            <div>
                                <label for="stops" class="block text-sm font-medium text-gray-700 mb-2">
                                    จุดแวะพัก / รับส่งระหว่างทาง (ถ้ามี)
                                </label>
                                <textarea id="stops" name="stops" rows="3"
                                    placeholder="เช่น ปั้มบางจาก, ร้านอาหาร แวะได้ตามสะดวก"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 resize-none"></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Vehicle & Amenities -->
                    <div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                            ข้อมูลรถยนต์
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Brand & Model -->
                            <div>
                                <label for="carModel" class="block text-sm font-medium text-gray-700 mb-2">
                                    ยี่ห้อและรุ่นรถ <span class="text-red-500">*</span>
                                </label>
                                <input id="carModel" name="carModel" type="text" placeholder="เช่น Toyota Camry"
                                    required
                                    class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500" />
                            </div>
                            <!-- Color -->
                            <div>
                                <label for="carColor" class="block text-sm font-medium text-gray-700 mb-2">
                                    สีรถ
                                </label>
                                <input id="carColor" name="carColor" type="text" placeholder="เช่น สีดำ"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500" />
                            </div>

                            <!-- License Plate -->
                            <div>
                                <label for="carPlate" class="block text-sm font-medium text-gray-700 mb-2">
                                    หมายเลขทะเบียน
                                </label>
                                <input id="carPlate" name="carPlate" type="text" placeholder="เช่น กก 1234"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500" />
                            </div>
                            <!-- Amenities -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    สิ่งอำนวยความสะดวก
                                </label>
                                <div class="space-y-2">
                                    <label class="flex items-center">
                                        <input type="checkbox" name="amenities" value="เครื่องปรับอากาศ"
                                            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                        <span class="ml-2 text-gray-700">เครื่องปรับอากาศ</span>
                                    </label>
                                    <label class="flex items-center">
                                        <input type="checkbox" name="amenities" value="Wi-Fi"
                                            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                        <span class="ml-2 text-gray-700">Wi-Fi</span>
                                    </label>
                                    <label class="flex items-center">
                                        <input type="checkbox" name="amenities" value="เครื่องเสียง/บลูทูธ"
                                            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                        <span class="ml-2 text-gray-700">เครื่องเสียง/บลูทูธ</span>
                                    </label>
                                    <label class="flex items-center">
                                        <input type="checkbox" name="amenities" value="ที่ชาร์จโทรศัพท์"
                                            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                        <span class="ml-2 text-gray-700">ที่ชาร์จโทรศัพท์</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <!-- Car Images -->
                        <div class="mt-6">
                            <label class="block text-sm font-medium text-gray-700 mb-4">แนบภาพรถยนต์</label>
                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div
                                    class="upload-zone border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                                    <p class="text-center text-sm text-gray-600 mb-2">
                                        รูปหน้ารถ
                                    </p>
                                    <input type="file" id="carPhotoFront" name="carPhotoFront" accept="image/*" required
                                        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                </div>
                                <div
                                    class="upload-zone border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                                    <p class="text-center text-sm text-gray-600 mb-2">
                                        รูปท้ายรถ
                                    </p>
                                    <input type="file" id="carPhotoBack" name="carPhotoBack" accept="image/*" required
                                        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                </div>
                                <div
                                    class="upload-zone border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                                    <p class="text-center text-sm text-gray-600 mb-2">
                                        รูปข้างรถ
                                    </p>
                                    <input type="file" id="carPhotoSide" name="carPhotoSide" accept="image/*" required
                                        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                </div>
                            </div>
                            <p class="text-xs text-gray-500 mt-2">
                                รองรับ JPG/PNG ขนาดไม่เกิน 10MB ต่อภาพ
                            </p>
                        </div>
                    </div>

                    <!-- Terms & Conditions -->
                    <div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                            เงื่อนไขและข้อตกลง
                        </h3>
                        <textarea id="terms" name="terms" rows="4"
                            placeholder="ระบุเงื่อนไข เช่น ไม่สูบบุหรี่, ไม่นำสัตว์เลี้ยง, ชำระเงินล่วงหน้า 50%"
                            class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 resize-none"></textarea>
                    </div>

                    <!-- ปุ่มดำเนินการ -->
                    <div class="pt-6 flex justify-end gap-4">
                        <button type="button"
                            class="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            ยกเลิก
                        </button>
                        <button type="submit"
                            class="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            สร้างการเดินทาง
                        </button>
                    </div>
                </form>
            </div>

            <!-- Info Box -->
            <div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div class="flex items-start">
                    <svg class="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clip-rule="evenodd" />
                    </svg>
                    <div class="ml-3">
                        <h4 class="text-sm font-medium text-blue-800">ข้อมูลสำคัญ</h4>
                        <ul class="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
                            <li>โพสต์ของคุณจะขึ้นเมื่อได้รับการตรวจสอบ</li>
                            <li>กรุณาให้ข้อมูลที่ถูกต้องและครบถ้วน</li>
                            <li>สามารถแก้ไขหรือลบการเดินทางได้ภายหลัง</li>
                            <li>การยกเลิกทริปหลังมีการจองอาจมีค่าปรับ</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// definePageMeta({ middleware: 'auth' })

</script>

<style scoped>
.upload-zone {
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
}

.upload-zone:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}
</style>