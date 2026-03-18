<template>
  <div>
    <AdminHeader />
    <AdminSidebar />

    <main class="main-content mt-16 ml-0 lg:ml-[280px] p-6">
      <div class="mx-auto max-w-8xl">

        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-semibold text-gray-800">
            Incident Management
          </h1>
        </div>

        <!-- Card -->
        <div class="bg-white border border-gray-300 rounded-lg shadow-sm">

          <div class="px-4 py-4 border-b text-sm text-gray-600">
            All {{ incidents.length }} incidents
          </div>

          <!-- Loading -->
          <div v-if="isLoading" class="p-8 text-center text-gray-500">
            Loading...
          </div>

          <!-- Error -->
          <div v-else-if="loadError" class="p-8 text-center text-red-500">
            {{ loadError }}
          </div>

          <!-- Table -->
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y">

              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-xs text-left uppercase">Title</th>
                  <th class="px-4 py-3 text-xs text-left uppercase">Description</th>
                  <th class="px-4 py-3 text-xs text-left uppercase">Reported By</th>
                  <th class="px-4 py-3 text-xs text-left uppercase">Status</th>
                  <th class="px-4 py-3 text-xs text-center uppercase">Action</th>
                </tr>
              </thead>

              <tbody>

                <tr v-if="!incidents.length">
                  <td colspan="5" class="text-center py-10 text-gray-400">
                    No incidents found
                  </td>
                </tr>

                <tr v-for="item in incidents" :key="item.id" class="hover:bg-gray-50">

                  <td class="px-4 py-3 font-medium">
                    {{ item.title }}
                  </td>

                  <td class="px-4 py-3">
                    {{ item.description }}
                  </td>

                  <!-- ✅ USER -->
                  <td class="px-4 py-3">
                    <div class="font-medium">
                      {{ item.user?.firstName }} {{ item.user?.lastName }}
                    </div>
                    <div class="text-xs text-gray-400">
                      {{ item.user?.email }}
                    </div>
                  </td>

                  <!-- STATUS -->
                  <td class="px-4 py-3">
                    <span
                      class="px-2 py-1 text-xs rounded-full"
                      :class="statusBadge(item.status)"
                    >
                      {{ item.status }}
                    </span>
                  </td>

                  <td class="px-4 py-3 text-center">
                    <button
                      @click="goDetail(item.id)"
                      class="text-blue-600 hover:underline"
                    >
                      View
                    </button>
                  </td>

                </tr>

              </tbody>
            </table>
          </div>

        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRuntimeConfig, useCookie } from '#app'
import AdminHeader from '~/components/admin/AdminHeader.vue'
import AdminSidebar from '~/components/admin/AdminSidebar.vue'

const incidents = ref([])
const isLoading = ref(false)
const loadError = ref('')

function statusBadge(s) {
  if (s === 'PENDING') return 'bg-yellow-100 text-yellow-700'
  if (s === 'IN PROGRESS') return 'bg-blue-100 text-blue-700'
  if (s === 'RESOLVED') return 'bg-green-100 text-green-700'
  if (s === 'REJECTED') return 'bg-red-100 text-red-700'
  return 'bg-gray-100 text-gray-600'
}

async function fetchIncidents() {
  isLoading.value = true
  loadError.value = ''

  try {
    const config = useRuntimeConfig()
    const token =
      useCookie('token').value ||
      (process.client ? localStorage.getItem('token') : '')

    const res = await $fetch('/incidents', {
      baseURL: config.public.apiBase,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    incidents.value = res.data

  } catch (err) {
    console.error(err)
    loadError.value = 'Failed to load incidents'
  } finally {
    isLoading.value = false
  }
}

function goDetail(id) {
  navigateTo(`/admin/incidents/${id}`)
}

onMounted(fetchIncidents)
</script>