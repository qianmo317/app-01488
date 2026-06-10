import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home/index.vue')
  },
  {
    path: '/game',
    name: 'Game',
    component: () => import('@/views/Game/index.vue')
  },
  {
    path: '/help',
    name: 'Help',
    component: () => import('@/views/Help/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
