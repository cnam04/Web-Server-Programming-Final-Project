
<script setup lang="ts">
import { computed } from 'vue'
import navbar from '../components/navbar.vue';
import SessionCard from '../components/sessionCard.vue'
import ActivityForm from '../components/activityForm.vue'
import { useSessionStore } from '../stores/sessionStore'
import { useAuthStore } from '@/stores/authStore';
import { ref } from 'vue';
import { Session } from '@/types';
import Modal from '../components/modal.vue';
import { showToast } from '@/utils/toast';

const sessionStore = useSessionStore()
const authStore = useAuthStore()

const currentId = computed(() => authStore.id)
const currentUsername = computed(() => authStore.username)
const mySessions = computed(() => {
  if (currentId.value === undefined) return []
  return sessionStore.getSessionsByUserId(currentId.value).reverse()
})

function deleteSession(sessionId: number) {
  sessionStore.removeSession(sessionId)
  showToast('Session deleted successfully!', 'is-success')
}

const isEditModalOpen = ref(false)
const editingSession = ref<Session | null>(null)

function openEditModal(session: Session) {
  editingSession.value = session
  isEditModalOpen.value = true
}

function closeEditModal() {
  isEditModalOpen.value = false
  editingSession.value = null
  showToast('Session edited successfully!', 'is-success')
}

</script>


<template>
  <navbar></navbar>
  <modal :isActive="isEditModalOpen"
  title="Edit Session"
  confirmText="Save Changes"
  confirmFormId="edit-session-form"
  @close="closeEditModal">
  <ActivityForm mode="edit" :session="editingSession ?? undefined" @session-saved="closeEditModal"/>
  </modal>
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
            :key="session.date"
            class="column is-12 is-8-desktop is-7-widescreen"
          >
            <div class="session-card-shell">
              <button
                class="delete session-delete-button"
                @click="deleteSession(session.id)"
                aria-label="Delete session"
              ></button>

              <SessionCard :session="session" 
              @edit="openEditModal"
              />
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