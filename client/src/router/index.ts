import ActivityFeedPage from '../views/ActivityFeedPage.vue'
import LoginPage from '../views/LoginPage.vue'

import { createWebHistory, createRouter } from 'vue-router'

const routes = [
  { path: '/', 
    component: ActivityFeedPage
  },
  { path: '/login',
    component: LoginPage
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