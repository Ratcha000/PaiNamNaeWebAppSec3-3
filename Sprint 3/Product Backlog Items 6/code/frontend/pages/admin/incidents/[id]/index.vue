<template>
  <div>
    <AdminHeader />
    <AdminSidebar />

    <main class="main-content mt-16 ml-0 lg:ml-[280px] p-6">
      <div class="mx-auto max-w-4xl">

        <h1 class="text-2xl font-semibold mb-6">Incident Detail</h1>

        <div v-if="isLoading" class="text-center">Loading...</div>

        <div v-else class="bg-white p-6 rounded-lg shadow border space-y-4">

          <!-- Title -->
          <div>
            <label class="text-sm text-gray-500">Title</label>
            <p class="font-medium">{{ incident.title }}</p>
          </div>

          <!-- Description -->
          <div>
            <label class="text-sm text-gray-500">Description</label>
            <p>{{ incident.description }}</p>
          </div>

          <!-- Reported By -->
          <div>
            <label class="text-sm text-gray-500">Reported By</label>
            <p class="font-medium">
              {{ incident.user?.firstName }} {{ incident.user?.lastName }}
            </p>
            <p class="text-sm text-gray-400">
              {{ incident.user?.email }}
            </p>
          </div>

          <!-- 🔥 STATUS (มีสี) -->
          <div>
            <label class="text-sm text-gray-500">Status</label>

            <!-- Badge -->
            <div class="mb-2">
              <span
                class="px-3 py-1 text-sm rounded-full font-medium"
                :class="statusBadge(incident.status)"
              >
                {{ incident.status }}
              </span>
            </div>

            <!-- Dropdown -->
            <select
              v-model="incident.status"
              class="border px-3 py-2 rounded w-full"
            >
              <option value="PENDING">PENDING</option>
              <option value="IN PROGRESS">IN PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>

          <!-- Buttons -->
          <div class="flex gap-3 mt-4">
            <button
              @click="updateStatus"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Update Status
            </button>

            <button
              @click="goBack"
              class="bg-gray-300 px-4 py-2 rounded"
            >
              Back
            </button>
          </div>

        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRuntimeConfig, useCookie } from '#app'
import AdminHeader from '~/components/admin/AdminHeader.vue'
import AdminSidebar from '~/components/admin/AdminSidebar.vue'

const route = useRoute()
const config = useRuntimeConfig()

const incident = ref({})
const isLoading = ref(false)

// 🔥 สีสถานะ
function statusBadge(s) {
  if (s === 'PENDING') return 'bg-yellow-100 text-yellow-700'
  if (s === 'IN PROGRESS') return 'bg-blue-100 text-blue-700'
  if (s === 'RESOLVED') return 'bg-green-100 text-green-700'
  if (s === 'REJECTED') return 'bg-red-100 text-red-700'
  return 'bg-gray-100 text-gray-600'
}

// fetch
async function fetchData() {
  isLoading.value = true

  try {
    const token =
      useCookie('token').value ||
      (process.client ? localStorage.getItem('token') : '')

    const res = await $fetch(`/incidents/${route.params.id}`, {
      baseURL: config.public.apiBase,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    incident.value = res.data

  } catch (err) {
    console.error(err)
  }

  isLoading.value = false
}

// update
async function updateStatus() {
  try {
    const token =
      useCookie('token').value ||
      (process.client ? localStorage.getItem('token') : '')

    await $fetch(`/incidents/${route.params.id}/status`, {
      method: 'PATCH',
      baseURL: config.public.apiBase,
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        status: incident.value.status
      }
    })

    alert('Status updated successfully')

  } catch (err) {
    console.error(err)
  }
}

function goBack() {
  navigateTo('/admin/incidents')
}

onMounted(fetchData)
</script>