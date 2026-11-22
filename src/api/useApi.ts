import { createFetch } from '@vueuse/core'
import { ref } from 'vue'

const csrfToken = ref<string | null>(null)

export const useApi = createFetch({
  baseUrl: import.meta.env.VITE_API_URL,
  options: {
    async beforeFetch({ options }) {
      if (csrfToken.value) {
        options.headers = {
          ...options.headers,
          'x-csrf-token': csrfToken.value,
        }
      }
      return { options }
    },
    async onFetchError(ctx) {
      console.error('Error en API:', ctx.error)
      return ctx
    },
  },
  fetchOptions: {
    mode: 'cors',
    credentials: 'include',
  },
})

export async function initAnonymousSession() {
  if (csrfToken.value) return;

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/session/init`, {
      method: 'GET',
      credentials: 'include',
    })

    if (response.ok) {
      const data = await response.json()
      csrfToken.value = data.csrfToken
    }
  } catch (error) {
    console.error('No se pudo inicializar la sesión anónima:', error)
  }
}