import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { User, UserId } from '../types'
import { 
  getFriends as getFriendsApi,
  addFriend as addFriendApi,
  removeFriend as removeFriendApi
} from '@/services/friends'
import { useAuthStore } from './authStore'

export const getFriendsStore = defineStore('friends', () => {
    const friends = ref<User[]>([])
    const authStore = useAuthStore()

    async function loadFriends() {
        if (authStore.id === undefined) {
            friends.value = []
            return
        }
        const response = await getFriendsApi(authStore.id as UserId)
        friends.value = response.data as User[]
    }

    watch(
        () => authStore.id,
        () => {
            loadFriends()
        },
        { immediate: true }
    )

    async function addFriend(userId: UserId, friendId: UserId) {
        await addFriendApi(userId, friendId)
        await loadFriends()
    }

    async function removeFriend(userId: UserId, friendId: UserId) {
        await removeFriendApi(userId, friendId)
        friends.value = friends.value.filter((friend) => friend.id !== friendId)
    }

    return{
        friends,
        addFriend,
        removeFriend
    }
}) 

export default getFriendsStore