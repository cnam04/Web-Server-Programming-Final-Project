import useSessionStore from '../stores/sessionStore'
import type { DataListEnvelope, DataEnvelope } from '../../../server/types/dataEnvelopes'
import type { UserId, Session, SessionId } from '@/types'

export function getUserSessions(userId: UserId){
    const session = useSessionStore()
    return session.api<DataListEnvelope<Session>>(`/users/${userId}/sessions`)
}

export function getFriendsSessions(userId: UserId) {
    const session = useSessionStore()
    return session.api<DataListEnvelope<Session>>(`/friends/${userId}/sessions`)
}


export function addSession(session: Omit<Session, 'id'>) {
    const sessionStore = useSessionStore()
    return sessionStore.api<DataEnvelope<Session>>('/sessions', session)
}

export function deleteSession(sessionId: SessionId) {
    const sessionStore = useSessionStore()
    return sessionStore.api(`/sessions/${sessionId}`, undefined, { method: 'DELETE' })
}

export function updateSession(sessionId: SessionId, session: Partial<Session>) {
    const sessionStore = useSessionStore()
    return sessionStore.api<DataEnvelope<Session>>(`/sessions/${sessionId}`, session, { method: 'PATCH' })
}