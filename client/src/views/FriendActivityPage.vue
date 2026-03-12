<script setup lang="ts">
import Navbar from '../components/navbar.vue'
import SessionCard from '../components/sessionCard.vue'
import { useSessionStore } from '../stores/sessionStore'

const sessionStore = useSessionStore()
</script>

<template>
  <Navbar />

  <section class="section">
    <div class="container">
      <h1 class="title">Friend Activity</h1>
      <p class="content">Browse recorded climbing sessions and the climbs in each one.</p>

      <div v-if="sessionStore.sessions.length === 0" class="notification is-light">
        No sessions have been logged yet.
      </div>

      <div v-else class="columns is-multiline">
        <div
          v-for="session in sessionStore.sessions"
          :key="session.id"
          class="column is-12 is-6-desktop"
        >
          <SessionCard :session="session" />
        </div>
      </div>
    </div>
  </section>
</template>