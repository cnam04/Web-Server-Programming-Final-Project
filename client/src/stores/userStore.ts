import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, UserId } from '../types'
import data from '../data/users.json'

export const useUserStore = defineStore('users', () => {
  const users = ref(data.users as User[])

  function getUserById(id: UserId): User | undefined {
    return users.value.find((user) => user.id === id)
  }

  function addUser(user: User) {
    users.value.push(user)
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
    getUserById,
    addUser,
    addFriend,
  }
})