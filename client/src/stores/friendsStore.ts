import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { User, UserId } from '../types'
import { 
  getFriends as getFriendsApi,
  addFriend as addFriendApi,
  removeFriend as removeFriendApi
} from '@/services/friends'
import { useAuthStore } from './authStore'
import { useClimbingSessionStore } from './climbingSessionStore'

export const getFriendsStore = defineStore('friends', () => {
    const friends = ref<User[]>([])
    const authStore = useAuthStore()
    const climbingSessionStore = useClimbingSessionStore()

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
            void loadFriends().catch(() => undefined)
        },
        { immediate: true }
    )

    async function addFriend(userId: UserId, friendId: UserId) {
        await addFriendApi(userId, friendId)
        await loadFriends()
        await climbingSessionStore.refreshFriendSessions(userId)
    }

    async function removeFriend(userId: UserId, friendId: UserId) {
        await removeFriendApi(userId, friendId)
        await climbingSessionStore.refreshFriendSessions(userId)
        friends.value = friends.value.filter((friend) => friend.id !== friendId)
    }

    return{
        friends,
        addFriend,
        removeFriend
    }
}) 

export default getFriendsStore