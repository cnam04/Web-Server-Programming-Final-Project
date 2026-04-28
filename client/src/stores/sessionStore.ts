import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { api as myApi } from '../services/myFetch'
import { useAuthStore } from './authStore'

export type FeedbackMessage = {
  type: 'success' | 'danger' | 'info'
  text: string
}

export const useSessionStore = defineStore('sessions', () => {
  const authStore = useAuthStore()
  const token = computed(() => authStore.token ?? null)
  

  const messages = ref<FeedbackMessage[]>([])
  function addMessage(text: string, type: FeedbackMessage['type'] = 'info') {
    messages.value.push({ type, text })
  }
  function handleError(error: Error | string) {
    const message = typeof error === 'string' ? error : error.message
    addMessage(message, 'danger')
    console.error(error)
  }
  const loadingCount = ref(0)
    const isLoading = computed(() => loadingCount.value > 0)

    function api<T>(endpoint: string, data?: unknown, options: RequestInit = {}) {
    loadingCount.value++
    options.headers = {
        ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
      ...options.headers,
    }
    return myApi<T>(endpoint, data, options)
      .catch((error) => {
        handleError(error)
        throw error
      })
      .finally(() => {
        loadingCount.value--
      })
  }

  return {
    messages,
    addMessage,
    handleError,
    isLoading,
    api,
  }
})

export default useSessionStore