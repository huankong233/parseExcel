import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/assets/main.scss'
import App from './App.vue'

// import Vconsole from 'vconsole'
// let vConsole = new Vconsole()

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(ElementPlus)
// app.use(vConsole)
app.mount('#app')
