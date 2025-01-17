import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';

// Lazy load components
const DataView = () => import ('@/views/DataView.vue');
const ComponentView = () => import ('@/views/Component.vue');

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/component',
      name: 'Component',
      component: ComponentView
    },
    {
      path: '/data',
      name: 'Data',
      component: DataView
    }
  ]
})

export default router;
