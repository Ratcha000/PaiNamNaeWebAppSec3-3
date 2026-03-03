<template>
  <div>
    <AdminHeader />
    <AdminSidebar />
    <main id="main-content" class="ml-[280px] pt-20 p-6">
      <slot />
    </main>
  </div>
</template>

<script setup>
import AdminHeader from '~/components/admin/AdminHeader.vue'
import AdminSidebar from '~/components/admin/AdminSidebar.vue'
</script>
