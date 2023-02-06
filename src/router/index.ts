import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';

// Lazy load components
const CustomerView = () => import ('@/views/CustomerView.vue');
const AboutView = () => import ('@/views/AboutView.vue');
const DataView = () => import ('@/views/DataView.vue');
const DataExplorerView = () => import ('@/views/DataExplorerView.vue');
const CollectionView = () => import ('@/trash/CollectionView.vue');

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/customer',
      name: 'Customer',
      component: CustomerView
    },
    {
      path: '/component',
      name: 'Component',
      component: DataExplorerView
    },
    {
      path: '/data',
      name: 'Data',
      component: DataView
    },
    {
      path: '/about',
      name: 'Contact',
      component: AboutView
    }
  ]
})

export default router;
