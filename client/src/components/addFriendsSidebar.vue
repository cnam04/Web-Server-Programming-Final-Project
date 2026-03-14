<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useAuthStore } from '@/stores/authStore'

const props = defineProps<{
  width: number
  isActive: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const userStore = useUserStore()
const authStore = useAuthStore()

const nonFriends = computed(() => {
  const currentUser = authStore.currentUser
  if (!currentUser) return []
  return userStore.users.filter(
    (u) => u.id !== currentUser.id && !currentUser.friendIds.includes(u.id)
  )
})

const friends = computed(() => {
  const currentUser = authStore.currentUser
  if (!currentUser) return []
  return userStore.users.filter((u) => currentUser.friendIds.includes(u.id))
})

const searchQuery = ref('')

function addFriend(friendId: number) {
  if (authStore.id !== undefined) {
    userStore.addFriend(authStore.id, friendId)
  }
}

function removeFriend(friendId: number) {
  const currentUser = authStore.currentUser
  if (!currentUser) return
  currentUser.friendIds = currentUser.friendIds.filter((id) => id !== friendId)
  const friend = userStore.getUserById(friendId)
  if (friend) {
    friend.friendIds = friend.friendIds.filter((id) => id !== currentUser.id)
  }
}
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
      <p class="is-size-5 has-text-weight-semibold">Add Friends</p>
      <button class="sidebar-close-btn" aria-label="close" @click="emit('close')">
        <span class="icon"><i class="fas fa-times"></i></span>
      </button>
    </div>

    <!-- Body -->
    <div class="sidebar-body">
      <div v-if="!authStore.currentUser" class="has-text-centered py-5">
        <p class="sidebar-muted">Log in to add friends.</p>
      </div>

      <div v-else>
        <!-- Search bar -->
        <div class="field mb-4">
          <div class="control has-icons-left">
            <input
              v-model="searchQuery"
              class="input sidebar-input"
              type="text"
              placeholder="Search users..."
            />
            <span class="icon is-left sidebar-icon">
              <i class="fas fa-search"></i>
            </span>
          </div>
        </div>

        <!-- Add Friends Section -->
        <p class="sidebar-section-label">Add Friends</p>

        <div v-if="nonFriends.length === 0" class="has-text-centered py-3">
          <p class="sidebar-muted">You're friends with everyone!</p>
        </div>

        <div
          v-for="user in nonFriends"
          :key="user.id"
          class="sidebar-user-row"
        >
          <div class="sidebar-user-info">
            <figure class="image is-32x32 mr-3">
              <img
                class="is-rounded"
                :src="user.imageLink || 'https://bulma.io/images/placeholders/32x32.png'"
                :alt="user.username"
              />
            </figure>
            <span class="sidebar-username">{{ user.username }}</span>
          </div>
          <button class="button is-small is-success is-rounded" @click="addFriend(user.id)">
            Add
          </button>
        </div>

        <!-- Your Friends Section -->
        <p class="sidebar-section-label mt-5">Your Friends</p>

        <div v-if="friends.length === 0" class="has-text-centered py-3">
          <p class="sidebar-muted">No friends added yet.</p>
        </div>

        <div
          v-for="user in friends"
          :key="user.id"
          class="sidebar-user-row"
        >
          <div class="sidebar-user-info">
            <figure class="image is-32x32 mr-3">
              <img
                class="is-rounded"
                :src="user.imageLink || 'https://bulma.io/images/placeholders/32x32.png'"
                :alt="user.username"
              />
            </figure>
            <span class="sidebar-username">{{ user.username }}</span>
          </div>
          <button class="button is-small is-danger is-rounded" @click="removeFriend(user.id)">
            Remove
          </button>
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
  right: 0;
  height: 100dvh;
  background: black;
  z-index: 100;
  box-shadow: -4px 0 32px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
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
