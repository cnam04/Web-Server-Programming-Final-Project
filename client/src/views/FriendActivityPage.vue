<script setup lang="ts">
import Navbar from '../components/navbar.vue'
import { computed } from 'vue'
import SessionCard from '../components/sessionCard.vue'
import { useSessionStore } from '../stores/sessionStore'
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';


const sessionStore = useSessionStore()
const authStore = useAuthStore()
const userStore = useUserStore()

const currentUser = computed(() =>
  userStore.users.find((user) => user.id === authStore.id)
)

const friendSessions = computed(() => {
  if (!currentUser.value) return []

  return sessionStore.sessions.filter((session) =>
    currentUser.value!.friendIds.includes(session.userId)
  )
})

</script>

<template>
  <Navbar />

  <section class="section">
    <div class="container">
      <h1 class="title">Friend Activity</h1>
      <p class="content">Browse recorded climbing sessions and the climbs in each one.</p>

      <div v-if="friendSessions.length === 0" class="notification">
        No friend sessions have been logged yet.
      </div>

      <div v-else class="columns is-multiline">
        <div
          v-for="session in friendSessions"
          :key="session.id"
          class="column is-12 is-6-desktop"
        >
          <SessionCard :session="session" />
        </div>
      </div>
    </div>
  </section>
</template>