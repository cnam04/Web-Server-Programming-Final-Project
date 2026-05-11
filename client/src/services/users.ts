import useSessionStore from '../stores/sessionStore'
import type { DataListEnvelope, DataEnvelope, PagingRequest } from '../../../server/types/dataEnvelopes'
import type { User, UserId, UpdateUserInput } from '../../../server/types'

function buildUsersQuery(params: PagingRequest = {}) {
    const query = new URLSearchParams()

    if (typeof params.search === 'string' && params.search.trim().length > 0) {
        query.set('search', params.search.trim())
    }
    if (params.page !== undefined) {
        query.set('page', String(params.page))
    }
    if (params.pageSize !== undefined) {
        query.set('pageSize', String(params.pageSize))
    }
    if (typeof params.sortBy === 'string' && params.sortBy.trim().length > 0) {
        query.set('sortBy', params.sortBy)
    }
    if (params.descending !== undefined) {
        query.set('descending', String(params.descending))
    }

    return query.toString()
}

export function getUsers(params: PagingRequest = {}){
    const session = useSessionStore()
    const queryString = buildUsersQuery(params)
    const endpoint = queryString.length > 0 ? `/users?${queryString}` : '/users'

    return session.api<DataListEnvelope<User>>(endpoint)
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