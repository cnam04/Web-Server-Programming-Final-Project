import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, UserId } from '../types'
import { 
  getUsers, 
  getUserById as getSingularUserApi, 
  createUser as createUserApi,
  updateUser as updateUserApi,
  deleteUser as deleteUserApi
} from '@/services/users'

export const useUserStore = defineStore('users', () => {
  const users = ref<User[]>([])

  getUsers().then((data) => {
    users.value = data.data
  })

  async function getUserById(id: UserId){
    const localUser = users.value.find((user) => user.id === id)
    if (localUser) return localUser

    const response = await getSingularUserApi(id)
    return response.data
  }

  async function addUser(user: User) {
    const response = await createUserApi(user)
    users.value.push(response.data)
  }

  async function deleteUser(userId: UserId) {
    await deleteUserApi(userId)
    users.value = users.value.filter((user) => user.id !== userId)
  }

  async function editUser(userId: UserId, updatedUser: Partial<User>) {
    const response = await updateUserApi(userId, updatedUser)
    const index = users.value.findIndex((user) => user.id === userId)

    if (index >= 0) {
      users.value[index] = response.data
      return
    }

    users.value.push(response.data)
  }

  return {
    users,
    getUserById,
    addUser,
    deleteUser,
    editUser
  }
})