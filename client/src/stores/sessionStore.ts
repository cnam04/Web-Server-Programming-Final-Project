import { defineStore } from 'pinia'
import { computed, handleError, ref } from 'vue'
import type { Session, SessionId, UserId, LoggedClimb, LoggedClimbId } from '../types'
import data from '../data/sessions.json'
import { useUserStore } from './userStore'

import { api as myApi } from '../services/myFetch'

type SessionStoreData = {
  sessions: Session[]
}

  export type FeedbackMessage = {
  type: 'success' | 'danger' | 'info'
  text: string
}

export const useSessionStore = defineStore('sessions', () => {
  const sessionData = data as SessionStoreData
  const sessions = ref(sessionData.sessions)
  const userStore = useUserStore()

  function getSessionById(id: SessionId): Session | undefined {
    return sessions.value.find((session) => session.id === id)
  }

  function getSessionsByUserId(userId: UserId): Session[] {
    return sessions.value.filter((session) => session.userId === userId)
  }

  function getUsernameBySessionId(sessionId: SessionId): string {
    const session = getSessionById(sessionId)
    if (!session) return 'Unknown user'

    const user = userStore.getUserById(session.userId)
    return user?.username ?? 'Unknown user'
  }

  function addSession(session: Session) {
    sessions.value.push(session)
  }

  function removeSession(sessionId: SessionId) {
    sessions.value = sessions.value.filter((session) => session.id !== sessionId)
  }

  function addClimbToSession(sessionId: SessionId, climb: LoggedClimb) {
    const session = getSessionById(sessionId)
    if (!session) return

    session.climbs.push(climb)
  }

  function removeClimbFromSession(sessionId: SessionId, climbId: LoggedClimbId) {
    const session = getSessionById(sessionId)
    if (!session) return

    session.climbs = session.climbs.filter((climb) => climb.id !== climbId)
  }

  function updateSession(updatedSession: Session) {
    const index = sessions.value.findIndex((session) => session.id === updatedSession.id)
    if (index === -1) return

    sessions.value[index] = updatedSession
  }

  function updateClimbInSession(sessionId: SessionId, updatedClimb: LoggedClimb) {
    const session = getSessionById(sessionId)
    if (!session) return

    const index = session.climbs.findIndex((climb) => climb.id === updatedClimb.id)
    if (index === -1) return

    session.climbs[index] = updatedClimb
  }

  function getClimbFromSession(
    sessionId: SessionId,
    climbId: LoggedClimbId
  ): LoggedClimb | undefined {
    const session = getSessionById(sessionId)
    if (!session) return undefined

    return session.climbs.find((climb) => climb.id === climbId)
  }
    


  const messages = ref<FeedbackMessage[]>([])
  function addMessage(text: string, type: FeedbackMessage['type'] = 'info') {
    messages.value.push({ type, text })
  }
  function handleError(error: Error | string) {
    const message = typeof error === 'string' ? error : error.message
    addMessage(message, 'danger')
    console.error(error)
  }
  const loadingCount = ref(0)
    const isLoading = computed(() => loadingCount.value > 0)

    function api<T>(endpoint: string, data?: unknown, options: RequestInit = {}) {
    loadingCount.value++

    return myApi<T>(endpoint, data, options)
      .catch((error) => {
        handleError(error)
        throw error
      })
      .finally(() => {
        loadingCount.value--
      })
  }

  return {
    sessions,
    messages,
    addMessage,
    handleError,
    isLoading,
    getSessionById,
    getSessionsByUserId,
    getUsernameBySessionId,
    addSession,
    removeSession,
    addClimbToSession,
    removeClimbFromSession,
    updateClimbInSession,
    getClimbFromSession,
    updateSession,
    api,
    
  }
})

export default useSessionStore