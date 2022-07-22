import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import store from './store'
import { mapState } from 'vuex'

export const mixin = {
    computed: mapState(['user','status'])
}

import './assets/tailwind.css'

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

app.use(router).use(store)

app.mount('#app')
