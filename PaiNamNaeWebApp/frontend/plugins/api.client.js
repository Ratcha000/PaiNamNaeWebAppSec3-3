import { useCookie } from '#app'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const api = $fetch.create({
    baseURL: config.public.apiBase,
    credentials: 'include',

    async onRequest({ options }) {
      const token = useCookie('token').value
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        }
      }
    },

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

    onResponseError({ response }) {
      let body = response?._data

      if (typeof body === 'string') {
        try {
          body = JSON.parse(body)
        } catch {}
      }

      const msg =
        body?.message ||
        body?.error?.message ||
        body?.error ||
        response?.statusText ||
        'Request failed'

      throw createError({
        statusCode: response?.status || 500,
        statusMessage: msg,
        data: body,
      })
    },
  })

  return { provide: { api } }
})
