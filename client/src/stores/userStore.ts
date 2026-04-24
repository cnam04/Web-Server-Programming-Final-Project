import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, UserId } from '../types'
import { getUsers as getUsersApi } from '@/services/users'

export const useUserStore = defineStore('users', () => {
  const users = ref<User[]>([])

  async function fetchUsers() {
    const response = await getUsersApi()

    if (response.isSuccess) {
      users.value = response.data
    }
    return response
  }

  void fetchUsers().catch((error) => {
    console.error('Failed to fetch users:', error)
  })

  function getUserById(id: UserId): User | undefined {
    return users.value.find((user) => user.id === id)
  }

  function addUser(user: User) {
    return users.value.push(user)
  }

  function deleteUser(userId: UserId) {
    users.value = users.value.filter((user) => user.id !== userId)
  }

  function editUser(userId: UserId, updatedUser: Partial<User>) {
    const user = getUserById(userId)
    if (!user) return

    Object.assign(user, updatedUser)
  }

  function addFriend(userId: UserId, friendId: UserId) {
    const user = getUserById(userId)
    const friend = getUserById(friendId)

    if (!user || !friend) return

    if (!user.friendIds.includes(friendId)) {
      user.friendIds.push(friendId)
    }

    if (!friend.friendIds.includes(userId)) {
      friend.friendIds.push(userId)
    }
  }

  return {
    users,
    fetchUsers,
    getUserById,
    addUser,
    addFriend,
    deleteUser,
    editUser
  }
})