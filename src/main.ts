/*
 * @Date: 2026-09-05 15:30:34
 * @Author: parker
 * @FilePath: \llmops-apic:\Users\96082\Desktop\code\llmops\llmops-ui\src\main.ts
 * @Description: 
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import router from "@/router"


import ArcoVue from '@arco-design/web-vue';
import '@/assets/main.css'

import ArcoVueIcon from '@arco-design/web-vue/es/icon'

import '@arco-design/web-vue/dist/arco.css';

const app = createApp(App);
app.use(ArcoVue);
app.use(router);
app.use(ArcoVueIcon);
app.use(createPinia())
app.mount('#app');
