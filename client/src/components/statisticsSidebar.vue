<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useClimbingSessionStore } from '@/stores/climbingSessionStore'
import { buildUserStatRows } from '@/utils/userStatistics'

const props = defineProps<{
  width: number
  isActive: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const authStore = useAuthStore()
const climbingSessionStore = useClimbingSessionStore()

const currentUserSessions = computed(() => {
  if (authStore.id === undefined) return []
  return climbingSessionStore.getSessionsByUserId(authStore.id)
})

const statRows = computed(() => buildUserStatRows(currentUserSessions.value))

</script>

<template>
  <!-- Backdrop overlay -->
  <Transition name="fade">
    <div v-if="isActive" class="sidebar-overlay" @click="emit('close')" />
  </Transition>

  <!-- Slide-in panel -->
  <aside class="sidebar-panel" :class="{ 'is-active': isActive }" :style="{ width: `${width}px` }">
    <!-- Header -->
    <div class="sidebar-header">
      <p class="is-size-5 has-text-weight-semibold">My statistics</p>
      <button class="sidebar-close-btn" aria-label="close" @click="emit('close')">
        <span class="icon"><i class="fas fa-times"></i></span>
      </button>
    </div>

    <!-- Body -->
    <div class="sidebar-body">
      <div v-if="!authStore.currentUser" class="has-text-centered py-4">
        <p class="sidebar-muted">Log in to see your stats.</p>
      </div>

      <div v-else>
        <p class="sidebar-section-label">Current User</p>
        <p class="sidebar-username mb-4">{{ authStore.currentUser.username }}</p>

        <div class="sidebar-stats-list">
          <div v-for="row in statRows" :key="row.label" class="sidebar-stat-row">
            <span class="sidebar-stat-label">{{ row.label }}</span>
            <span class="sidebar-stat-value">{{ row.value }}</span>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
/* ── Dark palette ── */
:root {
  --sb-bg: #1a1a2e;
  --sb-header: #16213e;
  --sb-divider: #2a2a4a;
  --sb-text: #e2e8f0;
  --sb-muted: #7a8499;
  --sb-input-bg: #0f3460;
  --sb-row-hover: #22223b;
  --sb-label: #a0aec0;
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 99;
}

.sidebar-panel {
  top: 0;
  position: fixed;
  left: 0;
  height: 100dvh;
  background: black;
  z-index: 100;
  box-shadow: 4px 0 32px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

.sidebar-panel.is-active {
  transform: translateX(0);
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background: var(--sb-header);
  border-bottom: 1px solid var(--sb-divider);
  flex-shrink: 0;
  color: var(--sb-text);
}

.sidebar-body {
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem 1.25rem;
  color: var(--sb-text);
}

.sidebar-close-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--sb-muted);
  padding: 0.25rem;
  line-height: 1;
  transition: color 0.2s;
}
.sidebar-close-btn:hover {
  color: var(--sb-text);
}

.sidebar-input {
  background: var(--sb-input-bg) !important;
  border-color: var(--sb-divider) !important;
  color: var(--sb-text) !important;
}
.sidebar-input::placeholder {
  color: var(--sb-muted) !important;
}
.sidebar-input:focus {
  border-color: #4a9eff !important;
  box-shadow: 0 0 0 2px rgba(74, 158, 255, 0.2) !important;
}

.sidebar-icon {
  color: var(--sb-muted) !important;
}

.sidebar-section-label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--sb-label);
  margin-bottom: 0.5rem;
}

.sidebar-muted {
  color: var(--sb-muted);
  font-size: 0.875rem;
}

.sidebar-username {
  color: var(--sb-text);
  font-weight: 500;
}

.sidebar-user-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--sb-divider);
  border-radius: 4px;
  transition: background 0.15s;
}
.sidebar-user-row:hover {
  background: var(--sb-row-hover);
  padding-left: 0.4rem;
  padding-right: 0.4rem;
}

.sidebar-user-info {
  display: flex;
  align-items: center;
}

.sidebar-stats-list {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.sidebar-stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 1px solid var(--sb-divider);
  padding: 0.6rem 0;
}

.sidebar-stat-label {
  color: var(--sb-muted);
  font-size: 0.9rem;
}

.sidebar-stat-value {
  color: var(--sb-text);
  font-weight: 600;
}

/* Fade transition for overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
