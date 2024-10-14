import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import mitt from 'mitt'
import 'font-awesome/css/font-awesome.min.css'
const app = createApp(App)
app.use(store).use(router).mount('#app')
app.config.globalProperties.$bus = mitt()
app.config.globalProperties.$ipc = require('electron').ipcRenderer;
