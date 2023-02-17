import { createRouter, createWebHistory } from 'vue-router';
import AccountView from '@/views/AccountView.vue';

const userRouter = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/profile',
      name: 'Profile',
      component: AccountView
    }
  ]
})

export default userRouter;