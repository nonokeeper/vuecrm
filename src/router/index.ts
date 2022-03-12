import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
// import AboutView from '@/views/AboutView.vue'
// import CustomerView from '@/views/Customer.vue'

// Lazy load components
const CustomerView = () => import ('@/views/CustomerView.vue');
const AboutView = () => import ('@/views/AboutView.vue');
const DataExplorerView = () => import ('@/views/DataExplorerView.vue');

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/customer',
      name: 'customer',
      component: CustomerView
    },
    {
      path: '/data',
      name: 'data',
      component: DataExplorerView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    }
  ]
})

export default router;
