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

app.use(router).use(store)

app.mount('#app')
