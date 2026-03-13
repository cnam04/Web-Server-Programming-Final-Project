import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '../types'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)

  const isAdmin = computed(() => currentUser.value?.isAdmin === true)

  const id = computed(() => currentUser.value?.id)
  const username = computed(() => currentUser.value?.username)

  function login(user: User) {
    currentUser.value = user
  }

  function logout() {
    currentUser.value = null
  }

  return { currentUser, isAdmin, username, login, logout, id }
})