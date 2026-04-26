import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { Session, SessionId, UserId, LoggedClimb, LoggedClimbId } from '../types'
import { useUserStore } from './userStore'
import { useAuthStore } from './authStore'
import {
  getUserSessions as getUserSessionsApi,
  getFriendsSessions as getFriendsSessionsApi,
  addSession as addSessionApi,
  deleteSession as deleteSessionApi,
  updateSession as updateSessionApi,
} from '@/services/sessions'


export const useClimbingSessionStore = defineStore('climbing-sessions', () => {
  const sessions = ref<Session[]>([])

  const authStore = useAuthStore()
  const userStore = useUserStore()

  async function hydrateSessions(userId: UserId) {
    const [userSessionsResponse, friendSessionsResponse] = await Promise.all([
      getUserSessionsApi(userId),
      getFriendsSessionsApi(userId),
    ])

    sessions.value = [...userSessionsResponse.data, ...friendSessionsResponse.data]
  }

  watch(
    () => authStore.id,
    (userId) => {
      if (userId === undefined) {
        sessions.value = []
        return
      }

      hydrateSessions(userId)
    },
    { immediate: true }
  )

  function replaceSessionInState(updatedSession: Session) {
    const index = sessions.value.findIndex((session) => session.id === updatedSession.id)
    if (index === -1) {
      sessions.value.push(updatedSession)
      return
    }

    sessions.value[index] = updatedSession
  }
    
  function getSessionById(id: SessionId): Session | undefined {
    return sessions.value.find((session) => session.id === id)
  }

  function getSessionsByUserId(userId: UserId): Session[] {
    return sessions.value.filter((session) => session.userId === userId)
  }

  function getUsernameBySessionId(sessionId: SessionId): string {
    const session = getSessionById(sessionId)
    if (!session) return 'Unknown user'

    const user = userStore.users.find((candidate) => candidate.id === session.userId)
    return user?.username ?? 'Unknown user'
  }

  async function addSession(session: Session) {
    const { id: _ignored, ...newSession } = session
    const response = await addSessionApi(newSession)
    sessions.value.push(response.data)
  }

  async function removeSession(sessionId: SessionId) {
    await deleteSessionApi(sessionId)
    sessions.value = sessions.value.filter((session) => session.id !== sessionId)
  }

  async function addClimbToSession(sessionId: SessionId, climb: LoggedClimb) {
    const session = getSessionById(sessionId)
    if (!session) return

    const response = await updateSessionApi(sessionId, {
      climbs: [...session.climbs, climb],
    })
    replaceSessionInState(response.data)
  }

  async function removeClimbFromSession(sessionId: SessionId, climbId: LoggedClimbId) {
    const session = getSessionById(sessionId)
    if (!session) return

    const response = await updateSessionApi(sessionId, {
      climbs: session.climbs.filter((climb) => climb.id !== climbId),
    })
    replaceSessionInState(response.data)
  }

  async function updateSession(updatedSession: Session) {
    const response = await updateSessionApi(updatedSession.id, updatedSession)
    replaceSessionInState(response.data)
  }

  async function updateClimbInSession(sessionId: SessionId, updatedClimb: LoggedClimb) {
    const session = getSessionById(sessionId)
    if (!session) return

    const index = session.climbs.findIndex((climb) => climb.id === updatedClimb.id)
    if (index === -1) return

    const updatedClimbs = [...session.climbs]
    updatedClimbs[index] = updatedClimb
    const response = await updateSessionApi(sessionId, {
      climbs: updatedClimbs,
    })
    replaceSessionInState(response.data)
  }

  function getClimbFromSession(
    sessionId: SessionId,
    climbId: LoggedClimbId
  ): LoggedClimb | undefined {
    const session = getSessionById(sessionId)
    if (!session) return undefined

    return session.climbs.find((climb) => climb.id === climbId)
  }

  return {
    sessions,
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
  }
})

export default useClimbingSessionStore