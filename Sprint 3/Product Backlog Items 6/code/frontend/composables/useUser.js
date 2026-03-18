import { ref, computed } from 'vue'
import { useNuxtApp } from '#app'

export function useUser() {
  const { $api } = useNuxtApp()

  // --- State ---
  const accounts    = ref([])
  const isLoading   = ref(false)
  const loadError   = ref(false)

  const showCreateModal  = ref(false)
  const showEditModal    = ref(false)
  const showDeleteModal  = ref(false)

  const modalEmail      = ref('')
  const modalFirstName  = ref('')
  const modalLastName   = ref('')
  const modalPassword   = ref('')
  const modalRole       = ref('USER')
  const editId          = ref(null)
  const deleteId        = ref(null)

  const toasts          = ref([])

  // --- Computed: list of roles ถูกใช้ใน dropdown ---
  const rolesList = computed(() => {
    const uniq = new Set(accounts.value.map(u => u.role))
    return Array.from(uniq)
  })

  // --- Helper: Toast ---
  function pushToast(msg) {
    toasts.value.push(msg)
    setTimeout(() => {
      toasts.value.shift()
    }, 3000)
  }

  // --- Fetch all accounts ---
  async function fetchAccounts() {
    isLoading.value = true
    loadError.value  = false
    try {
      accounts.value = await $api('/users')
    } catch (e) {
      console.error('fetchAccounts failed', e)
      loadError.value = true
    } finally {
      isLoading.value = false
    }
  }

  // --- Create new account ---
  function openCreateModal() {
    modalEmail.value = ''
    modalFirstName.value = ''
    modalLastName.value = ''
    modalPassword.value = ''
    modalRole.value = rolesList.value[0] || 'USER'
    showCreateModal.value = true
  }
  function closeCreateModal() {
    showCreateModal.value = false
  }
  async function confirmCreate() {
    // ตรวจสอบค่าที่กรอกไม่ว่าง
    if (
      !modalEmail.value.trim() ||
      !modalFirstName.value.trim() ||
      !modalLastName.value.trim() ||
      !modalPassword.value.trim()
    ) return

    try {
      await $api('/users', {
        method: 'POST',
        body: {
          email: modalEmail.value.trim(),
          firstName: modalFirstName.value.trim(),
          lastName: modalLastName.value.trim(),
          password: modalPassword.value.trim(),
          role: modalRole.value
        }
      })
      closeCreateModal()
      await fetchAccounts()
      pushToast('Account created!')
    } catch (e) {
      console.error('confirmCreate failed', e)
      pushToast('Create failed')
    }
  }

  // --- Edit existing account ---
  function openEditModal(acc) {
    editId.value        = acc.id
    modalEmail.value    = acc.email
    modalFirstName.value= acc.firstName
    modalLastName.value = acc.lastName
    modalPassword.value = ''      
    modalRole.value     = acc.role
    showEditModal.value = true
  }
  function closeEditModal() {
    showEditModal.value = false
    editId.value        = null
  }
  async function confirmEdit() {
    const payload = {}
    if (modalEmail.value.trim())       payload.email     = modalEmail.value.trim()
    if (modalFirstName.value.trim())   payload.firstName = modalFirstName.value.trim()
    if (modalLastName.value.trim())    payload.lastName  = modalLastName.value.trim()
    if (modalPassword.value.trim())    payload.password  = modalPassword.value.trim()
    if (modalRole.value)               payload.role      = modalRole.value

    if (!Object.keys(payload).length) return

    try {
      await $api(`/users/${editId.value}`, {
        method: 'PUT',
        body: payload
      })
      closeEditModal()
      await fetchAccounts()
      pushToast('Account updated!')
    } catch (e) {
      console.error('confirmEdit failed', e)
      pushToast('Update failed')
    }
  }

  // --- Delete account ---
  function openDeleteModal(id) {
    deleteId.value       = id
    showDeleteModal.value = true
  }
  function closeDeleteModal() {
    showDeleteModal.value = false
    deleteId.value        = null
  }
  async function confirmDelete() {
    try {
      await $api(`/users/${deleteId.value}`, {
        method: 'DELETE'
      })
      closeDeleteModal()
      await fetchAccounts()
      pushToast('Account deleted!')
    } catch (e) {
      console.error('confirmDelete failed', e)
      pushToast('Delete failed')
    }
  }

  return {
    // state
    accounts,
    isLoading,
    loadError,
    showCreateModal,
    showEditModal,
    showDeleteModal,
    modalEmail,
    modalFirstName,
    modalLastName,
    modalPassword,
    modalRole,
    rolesList,
    editId,
    deleteId,
    toasts,
    // actions
    fetchAccounts,
    openCreateModal,
    closeCreateModal,
    confirmCreate,
    openEditModal,
    closeEditModal,
    confirmEdit,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete
  }
}
