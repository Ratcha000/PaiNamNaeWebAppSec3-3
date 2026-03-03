<template>
  <div class="bg-white border border-gray-300 rounded-lg shadow-sm">

    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-4 border-b border-gray-200 sm:px-6">
      <div class="text-sm text-gray-600">
        ทั้งหมด {{ users.length }} บัญชีที่ถูกแบน
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="p-8 text-center text-gray-500">
      กำลังโหลดข้อมูล...
    </div>

    <!-- Error -->
    <div v-else-if="loadError" class="p-8 text-center text-red-600">
      {{ loadError }}
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">
              ผู้ใช้
            </th>
            <th class="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">
              อีเมล
            </th>
            <th class="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">
              เหตุผลที่แบน
            </th>
            <th class="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">
              วันที่แบน
            </th>
          </tr>
        </thead>

        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="u in users"
            :key="u.id"
            class="hover:bg-gray-50"
          >
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <img
                  :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(u.firstName)}&background=random&size=64`"
                  class="object-cover rounded-full w-9 h-9"
                />
                <div>
                  <div class="font-medium text-gray-900">
                    {{ u.firstName }} {{ u.lastName }}
                  </div>
                </div>
              </div>
            </td>

            <td class="px-4 py-3 text-gray-700">
              {{ u.email }}
            </td>

            <td class="px-4 py-3">
              <span class="inline-flex items-center px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
                {{ u.blacklistReason || 'ไม่ระบุเหตุผล' }}
              </span>
            </td>

            <td class="px-4 py-3 text-gray-700">
              {{ formatDate(u.blacklistedAt) }}
            </td>
          </tr>

          <tr v-if="!users.length">
            <td colspan="4" class="px-4 py-10 text-center text-gray-500">
              ไม่มีผู้ใช้ที่ถูกแบน
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRuntimeConfig, useCookie } from "#app"
import axios from "axios"

const users = ref([])
const isLoading = ref(false)
const loadError = ref("")

const fetchBlacklist = async () => {
  isLoading.value = true
  loadError.value = ""

  try {
    const config = useRuntimeConfig()

    const token =
      useCookie("token").value ||
      (process.client ? localStorage.getItem("token") : null)

    if (!token) {
      loadError.value = "ไม่พบ Token"
      return
    }

    const res = await axios.get(
      `${config.public.apiBase}/reports`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
  page: 1,
  limit: 100,
  status: "reviewed"
}
      }
    )

    const reports = Array.isArray(res.data?.data)
      ? res.data.data
      : []

    const blacklistReports = reports.filter(
  r =>
    r.severity &&
    r.severity.toLowerCase().trim() === "blacklist" &&
    r.status === "reviewed"
)
    
console.log("ALL REPORTS:", reports)
console.log("BLACKLIST:", blacklistReports)

    const uniqueUsers = {}

   blacklistReports.forEach(r => {
  if (r.reportedUser) {
    const existing = uniqueUsers[r.reportedUser.id]
    // เอา record ที่ใหม่กว่า หรือมี adminNote
    if (!existing || new Date(r.updatedAt) > new Date(existing.blacklistedAt)) {
      uniqueUsers[r.reportedUser.id] = {
        id: r.reportedUser.id,
        firstName: r.reportedUser.firstName,
        lastName: r.reportedUser.lastName,
        email: r.reportedUser.email,
        blacklistReason: r.adminNote || r.description, 
        blacklistedAt: r.updatedAt
      }
    }
  }
})

    users.value = Object.values(uniqueUsers)

  } catch (err) {
    console.error(err)
    loadError.value =
      err?.response?.data?.message || "โหลดข้อมูลไม่สำเร็จ"
    users.value = []
  } finally {
    isLoading.value = false
  }
}

const formatDate = (date) => {
  if (!date) return "-"
  return new Date(date).toLocaleString("th-TH")
}

onMounted(fetchBlacklist)
</script>