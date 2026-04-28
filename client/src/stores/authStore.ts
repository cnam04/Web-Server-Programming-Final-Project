import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '../types'
import { DataEnvelope } from '../../../server/types'
import { api as myApi } from '../services/myFetch'
import { useSessionStore } from './sessionStore'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)
  const sessionStore = useSessionStore()

  const isAdmin = computed(() => currentUser.value?.isAdmin === true)
  const id = computed(() => currentUser.value?.id)
  const username = computed(() => currentUser.value?.username)
  const token = ref<string | null>(null)

  async function login(email: string) {
    const response = await myApi<DataEnvelope<{ user: User; token: string }>>(
      '/auth/login',
      { email},
      { method: 'POST' },
    )
    if (!response.isSuccess) {
      sessionStore.addMessage(response.message || 'Login failed', 'danger')
      return
    }
    const { user: loggedInUser, token: authToken } = response.data
    currentUser.value = loggedInUser
    token.value = authToken
  }

  function logout() {
    currentUser.value = null
    token.value = null
  }

  return { 
    currentUser, 
    isAdmin, 
    username, 
    login, 
    logout, 
    id,
    token
  }
})


