<script setup lang="ts">
import type { Session } from '../types'
import ClimbCard from './climbCard.vue'
import { useSessionStore } from '../stores/sessionStore'
import { useAuthStore } from '@/stores/authStore';
import { computed } from 'vue'

const sessionStore = useSessionStore()
const authStore = useAuthStore()
const props = defineProps<{
  session: Session
}>()

const emit = defineEmits<{
  edit: [session: Session]
}>()

function formatDuration(duration: number | ''): string {
  if (duration === '') return 'No duration recorded'
  return `${duration} min`
}

function feelingLabel(feeling: number): string {
  const labels: Record<number, string> = {
    1: 'Very bad',
    2: 'Bad',
    3: 'Okay',
    4: 'Good',
    5: 'Great',
  }

  return labels[feeling] ?? String(feeling)
}


const canEdit = computed(() => {
  return authStore.id === props.session.userId
})

function handleEditClick() {
  emit('edit', props.session)
}
</script>

<template>
  <div class="box">
    <div class="level is-mobile mb-3">
      <div class="level-left">
        <div>
          <h2 class="title is-4 mb-1">{{ session.title }}</h2>
          <p class="subtitle is-6 mb-0">{{ session.location }}</p>
        </div>
      </div>

      <div class="level-right">
            <button
            v-if="canEdit"
            class="button is-small is-warning"
            @click="handleEditClick"
          >
            Edit
        </button>
        <span class="tag is-primary is-medium">{{ session.type }}</span>
      </div>
    </div>

    <div class="content">
      <p><strong>Date:</strong> {{ session.date }}</p>
      <p><strong>Duration:</strong> {{ formatDuration(session.duration) }}</p>
      <p><strong>Feeling:</strong> {{ feelingLabel(session.feeling) }}</p>
      <p><strong>Climber:</strong> {{ sessionStore.getUsernameBySessionId(session.id) }}</p>
      <p><strong>Notes:</strong> {{ session.notes || 'No notes recorded.' }}</p>
      <p><strong>Total climbs:</strong> {{ session.climbs.length }}</p>
    </div>

    <hr />

    <h3 class="title is-6">Climbs</h3>

    <div v-if="session.climbs.length === 0" class="notification">
      No climbs logged for this session.
    </div>

    <div v-else>
      <ClimbCard
        v-for="climb in session.climbs"
        :key="climb.id"
        :climb="climb"
      />
    </div>
  </div>
</template>