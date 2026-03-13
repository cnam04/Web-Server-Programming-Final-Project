
<script setup lang="ts">
import { computed } from 'vue'
import navbar from '../components/navbar.vue';
import SessionCard from '../components/sessionCard.vue'
import { useSessionStore } from '../stores/sessionStore'
import { useAuthStore } from '@/stores/authStore';

const sessionStore = useSessionStore()
const authStore = useAuthStore()

const currentId = computed(() => authStore.id)
const currentUsername = computed(() => authStore.username)
const mySessions = computed(() => {
  if (currentId.value === undefined) return []
  return sessionStore.getSessionsByUserId(currentId.value)
})

function deleteSession(sessionId: number) {
  sessionStore.removeSession(sessionId)
}
</script>


<template>
  <navbar></navbar>

  <section class="section my-activity-page">
    <div class="container activity-container">
      <div class="has-text-centered mb-5">
    <h1 class="title">Here's your activity, {{ currentUsername || 'Climber' }}</h1>
    <p class="content">Browse recorded climbing sessions and the climbs in each one.</p>
    </div>
      <div v-if="mySessions.length === 0" class="notification is-light">
        No sessions have been logged yet.
      </div>

      <div v-else class="sessions-scroll-wrapper">
        <div class="columns is-multiline is-centered">
          <div
            v-for="session in mySessions"
            :key="session.id"
            class="column is-12 is-8-desktop is-7-widescreen"
          >
            <div class="session-card-shell">
              <button
                class="delete session-delete-button"
                @click="deleteSession(session.id)"
                aria-label="Delete session"
              ></button>

              <SessionCard :session="session" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.my-activity-page {
  min-height: 100vh;
  padding-bottom: 0;
}

.activity-container {
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
}

.sessions-scroll-wrapper {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 0.5rem;
}

.session-card-shell {
  position: relative;
}

.session-delete-button {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 20;
}
</style>