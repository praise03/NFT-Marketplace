import { createApp } from 'vue'
import {apolloClient} from './apolloClient'
import { DefaultApolloClient } from '@vue/apollo-composable'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import Notifications from '@kyvg/vue3-notification'

import './style.css'
import App from './App.vue'


const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.provide(DefaultApolloClient, apolloClient)
app.use(router)
app.use(Notifications)
app.mount("#app")