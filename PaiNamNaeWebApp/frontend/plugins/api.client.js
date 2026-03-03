import { useCookie, navigateTo } from '#app'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const api = $fetch.create({
    baseURL: config.public.apiBase,
    credentials: 'include',

    /* ======================
       REQUEST
    ====================== */
    async onRequest({ options }) {
      const token = useCookie('token').value
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        }
      }
    },

    /* ======================
       RESPONSE SUCCESS
    ====================== */
    onResponse({ response }) {
      const body = response._data

      if (
        body &&
        typeof body === 'object' &&
        Object.prototype.hasOwnProperty.call(body, 'data')
      ) {
        response._data = Object.prototype.hasOwnProperty.call(body, 'pagination')
          ? { data: body.data, pagination: body.pagination }
          : body.data
      }
    },

    /* ======================
       RESPONSE ERROR
    ====================== */
    onResponseError({ response }) {
      let body = response?._data

      if (typeof body === 'string') {
        try {
          body = JSON.parse(body)
        } catch {}
      }

      const status = response?.status

      const msg =
        body?.message ||
        body?.error?.message ||
        body?.error ||
        response?.statusText ||
        'Request failed'

      /* 🔥 ถ้าโดน 403 → blacklist → เด้งออก */
     if (status === 403) {
  const token = useCookie('token')

  alert('บัญชีของคุณถูกระงับ')

  setTimeout(() => {
    token.value = null
    navigateTo('/login')
  }, 2000)

  return
}

      throw createError({
        statusCode: status || 500,
        statusMessage: msg,
        data: body,
      })
    },
  })

  return { provide: { api } }
})
