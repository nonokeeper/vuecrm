import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';

// Lazy load components
const CustomerView = () => import ('@/views/CustomerView.vue');
const AboutView = () => import ('@/views/AboutView.vue');
const DataExplorerView = () => import ('@/views/DataExplorerView.vue');
const CollectionView = () => import ('@/views/CollectionView.vue');

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
      path: '/data',
      name: 'Data Explorer',
      component: DataExplorerView
    },
    {
      path: '/about',
      name: 'Contact',
      component: AboutView
    },
    {
      path: '/collection',
      name: 'Collection',
      component: CollectionView
    }
  ]
})

export default router;
