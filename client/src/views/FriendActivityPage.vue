<script setup lang="ts">
import Navbar from '../components/navbar.vue'
import { computed } from 'vue'
import SessionCard from '../components/sessionCard.vue'
import { useClimbingSessionStore } from '../stores/climbingSessionStore'
import { getFriendsStore } from '@/stores/friendsStore'


const climbingSessionStore = useClimbingSessionStore()
const friendsStore = getFriendsStore()

const friendIds = computed(() => friendsStore.friends.map((friend) => friend.id))

const friendSessions = computed(() => {
  if (friendIds.value.length === 0) return []

  const sessions = climbingSessionStore.sessions.filter((session) =>
    friendIds.value.includes(session.userId)
  )

  sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return sessions
})

</script>

<template>
  <Navbar />

  <section class="section">
    <div class="container">
      <div class="has-text-centered mb-5">
        <h1 class="title">Friend Activity</h1>
        <p class="content">Browse recorded climbing sessions and the climbs in each one.</p>
      </div>

      <div v-if="friendSessions.length === 0" class="notification">
        No friend sessions have been logged yet.
      </div>

      <div v-else class="sessions-scroll-wrapper">
        <div class="columns is-multiline is-centered">
          <div
            v-for="session in friendSessions"
            :key="session.id"
            class="column is-12 is-8-desktop is-7-widescreen"
          >
          <div class="session-card-shell">
            <SessionCard :session="session" />
          </div>
            
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>


.sessions-scroll-wrapper {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 0.5rem;
}

.session-card-shell {
  position: relative;
}

.container {
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
}
</style>