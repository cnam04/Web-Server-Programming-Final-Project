import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.ts'
import { createOruga, OrugaComponentPlugins } from '@oruga-ui/oruga-next'
import '@oruga-ui/theme-oruga/style.css'

const oruga = createOruga({}, OrugaComponentPlugins)

createApp(App).use(createPinia()).use(router).use(oruga).mount('#app')
