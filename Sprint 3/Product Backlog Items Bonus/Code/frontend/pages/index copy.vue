<template>
    <div>
        <template v-if="!token">
            <h1>please login</h1>
        </template>

        <template v-else>
            <h1 v-if="user?.role === 'ADMIN'">
                welcome Role, {{ user.firstName }}!
            </h1>
            <h1 v-else-if="user?.role === 'PASSENGER'">
                welcome Role passenger, {{ user.firstName }}
            </h1>
            <h1 v-else-if="user?.role === 'DRIVER'">
                welcome Role DRIVER, {{ user.firstName }}
            </h1>
        </template>
    </div>
    
</template>

<script setup>
import { useAuth } from '~/composables/useAuth'

const { token, user, logout } = useAuth()

// definePageMeta({ middleware: 'auth' })
</script>

<style scoped>

</style>