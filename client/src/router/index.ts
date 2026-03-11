import ActivityFeedPage from '../views/ActivityFeedPage.vue'

import { createWebHistory, createRouter } from 'vue-router'

const routes = [
  { path: '/', 
    component: () => ActivityFeedPage
  },
  { path: '/add-activity', 
    component: () => import('../views/AddActivityPage.vue')
  },
  { path: '/friend-activity', 
    component: () => import('../views/FriendActivityPage.vue') 
  },
  { path: '/add-friends', 
    component: () => import('../views/AddFriendsPage.vue')
  },
  {
    path: '/admin',
    component: () => import('../views/AdminDashboardPage.vue')
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})


export default router