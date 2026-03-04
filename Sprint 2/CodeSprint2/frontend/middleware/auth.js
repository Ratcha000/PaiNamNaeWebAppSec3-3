export default defineNuxtRouteMiddleware((to) => {
  if (process.server) return

  const token = useCookie('token').value
  if (!token && to.path !== '/login') {
    return navigateTo('/login')
  }
})