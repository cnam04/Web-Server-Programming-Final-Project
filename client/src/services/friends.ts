import useSessionStore from '../stores/sessionStore'
import type { DataListEnvelope, DataEnvelope } from '../../../server/types/dataEnvelopes'
import type { User, UserId, Friendship } from '../../../server/types'

export function getFriends(userId: UserId) {
    const session = useSessionStore()
    return session.api<DataListEnvelope<User>>(`/friends/${userId}`)
}

export function addFriend(userId: UserId, friendId: UserId) {
    const session = useSessionStore()
    return session.api<DataEnvelope<Friendship>>('/friends', { userId, friendId }, { method: 'POST' })
}

export function removeFriend(userId: UserId, friendId: UserId) {
    const session = useSessionStore()
    return session.api('/friends', { userId, friendId }, { method: 'DELETE' })
}