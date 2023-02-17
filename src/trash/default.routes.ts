import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/trash/LoginView.vue';

const defaultRouter = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: LoginView
    }
  ]
})

export default defaultRouter;