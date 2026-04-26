import useSessionStore from '../stores/sessionStore'
import type { DataListEnvelope, DataEnvelope } from '../../../server/types/dataEnvelopes'
import type { User, UserId, UpdateUserInput } from '../../../server/types'

export function getUsers(){
    const session = useSessionStore()
    return session.api<DataListEnvelope<User>>('/users')
}

export function getUserById(id: UserId) {
    const session = useSessionStore()
    return session.api<DataEnvelope<User>>(`/users/${id}`)
}


export function createUser(user: Omit<User, 'id'>) {
    const session = useSessionStore()
    return session.api<DataEnvelope<User>>('/users', user)
}

export function updateUser(id: UserId, user: User | UpdateUserInput) {
    const session = useSessionStore()
    return session.api<DataEnvelope<User>>(`/users/${id}`, user, { method: 'PATCH' })
}

export function deleteUser(id: UserId) {
    const session = useSessionStore()
    return session.api(`/users/${id}`, undefined, { method: 'DELETE' })
}

export function getUserSessions(userId: UserId) {
    const session = useSessionStore()
    return session.api<DataListEnvelope<{ sessionId: string }>>(`/users/${userId}/sessions`)
}

export function getUserMetrics(userId: UserId) {
    const session = useSessionStore()
    return session.api<DataEnvelope<{ activeSessions: number; totalSessions: number }>>(`/users/${userId}/metrics`)
}