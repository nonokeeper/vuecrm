import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import userRouter from "@/router/users.routes";
import { createPinia } from "pinia";
import './assets/tailwind.css'
import { createRouter, createWebHistory } from 'vue-router';

// Store management with PINIA
const pinia = createPinia();

pinia.use( (ctx) => {
  const storeId = ctx.store.$id;
  console.log('main.ts > Store ID : ', storeId);
  const serializer = {
    serialize : JSON.stringify,
    deserialize: JSON.parse
  }
  // sync store with localstorage
  if (window.localStorage.getItem(storeId)) {
    const fromStorage = serializer.deserialize(window.localStorage.getItem(storeId)!);
    if (fromStorage) {
      ctx.store.$patch(fromStorage)
    }
  }

  // listen to changes
  ctx.store.$subscribe((mutation, state) => {
    console.log('main.ts > mutation state : ', mutation, state);
    window.localStorage.setItem(storeId, serializer.serialize(state))
  })
})

const app = createApp(App)

app.directive("click-outside", {
    beforeMount(el, binding) {
      el.clickOutsideEvent = (event: { target: any }) => {
        if (!(el === event.target || el.contains(event.target))) {
            binding.value(event, el);
        }
      };
      document.body.addEventListener("click", el.clickOutsideEvent);
    },
    unmounted (el) {
      document.body.removeEventListener("click", el.clickOutsideEvent);
    },
});

const mainRoutes = router.options.routes;
const userRoutes = userRouter.options.routes;

var tmpRoutes: any[] = []
const allRoutes = tmpRoutes.concat(mainRoutes, userRoutes);

const allrouters = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: allRoutes
})

app
.use(allrouters)
.use(pinia)
.mount('#app')
