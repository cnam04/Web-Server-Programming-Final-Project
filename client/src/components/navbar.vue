<script setup lang="ts">
import { ref } from 'vue';
import addActivity from './addActivity.vue';
import { useAuthStore } from '@/stores/authStore';
import AddFriendsSidebar from './addFriendsSidebar.vue';
import StatisticsSidebar from './statisticsSidebar.vue';

const authStore = useAuthStore();
const isAdmin = authStore.isAdmin;

const isAddFriendsSidebarOpen = ref(false);
function toggleAddFriendsSidebar() {
  isAddFriendsSidebarOpen.value = !isAddFriendsSidebarOpen.value;
}

const isStatisticsSidebarOpen = ref(false);
function toggleStatisticsSidebar() {
  isStatisticsSidebarOpen.value = !isStatisticsSidebarOpen.value;
}

const isMenuOpen = ref(false);
const isMoreOpen = ref(false);
const toggleMenu = () => { 
  isMenuOpen.value = !isMenuOpen.value;
  if (!isMenuOpen.value) {
    isMoreOpen.value = false;
  }
};

const closeMenu = () => {
  isMenuOpen.value = false;
  isMoreOpen.value = false;
};

const toggleMore = () => {
  isMoreOpen.value = !isMoreOpen.value;
};

const closeAllMenus = () => {
  closeMenu();
};

</script>
<template>

<nav class="navbar" role="navigation" aria-label="main navigation">
  <div id="navbarBasicExample" class="navbar-menu" :class="{ 'is-active': isMenuOpen }">
    <div class="navbar-start">
      <RouterLink to="/"class="navbar-item" @click="closeMenu">
        My sessions
      </RouterLink>

      
      <div class="navbar-item has-dropdown is-hoverable" :class="{ 'is-active': isMoreOpen }">
        <a class="navbar-link">
          Social
        </a>

        <div class="navbar-dropdown">
          <RouterLink to="/friend-activity" class="navbar-item" @click="closeMenu">
            Friend Sessions
          </RouterLink>
        
          <button class="navbar-item" @click="toggleAddFriendsSidebar">
            Add friends
          </button>
        </div>
      </div>
      <button class="navbar-item" @click="toggleStatisticsSidebar">
        Statistics
      </button>
      <div v-if="isAdmin" class="navbar-item has-dropdown is-hoverable" :class="{ 'is-active': isMoreOpen }">
        <a class="navbar-link">
          Admin
        </a>

        <div class="navbar-dropdown">
          <RouterLink to="/admin" class="navbar-item" @click="closeAllMenus">
            Dashboard
          </RouterLink>
        </div>
      </div>
    </div>
    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <addActivity> </addActivity>
          <RouterLink to="/login" class="button is-light" @click="closeMenu">
            Log in
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</nav>

<AddFriendsSidebar :width="300" :isActive="isAddFriendsSidebarOpen" @close="isAddFriendsSidebarOpen = false" />
<StatisticsSidebar :width="320" :isActive="isStatisticsSidebarOpen" @close="isStatisticsSidebarOpen = false" />

</template>


<style scoped>
.brand-logo {
  display: block;
  width: clamp(120px, 26vw, 220px);
  height: auto;
}

.navbar-brand {
  min-width: 0;
}
.navbar-end {
  margin-left: auto;
}
.navbar-start {
  margin-right: auto;
}
</style>