import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, UserId } from '../types'
import { 
  getUsers, 
  getUserById as getSingularUserApi, 
  createUser as createUserApi,
  deleteUser as deleteUserApi
} from '@/services/users'

export const useUserStore = defineStore('users', () => {
  
  getUsers().then((data) => {
    users.value = data.data
  })
  
  const users = ref<User[]>([])

  async function getUserById(id: UserId){
    const response = await getSingularUserApi(id)
    return response.data
  }

  async function addUser(user: User) {
    const response = await createUserApi(user)
    users.value.push(response.data)
  }

  async function deleteUser(userId: UserId) {
    const response = await deleteUserApi(userId)
    users.value = users.value.filter((user) => user.id !== userId)
  }

  async function editUser(userId: UserId, updatedUser: Partial<User>) {
    const user = await getUserById(userId)
    if (!user) return

    Object.assign(user, updatedUser)
  }

  return {
    users,
    getUserById,
    addUser,
    deleteUser,
    editUser
  }
})