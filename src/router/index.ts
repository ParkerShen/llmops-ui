/*
 * @Date: 2026-09-05 16:18:02
 * @Author: parker
 * @FilePath: \llmops-apic:\Users\96082\Desktop\code\llmops\llmops-ui\src\router\index.ts
 * @Description:
 */
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import {isLogin} from '@/utils/auth'
import DefaultLayout from '@/views/layouts/DefaultLayout.vue'
import BlankLayout from '@/views/layouts/BlankLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/space/apps',
  },
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: 'space/apps',
        name: 'space-apps-list',
        meta: { title: 'AI 应用列表' },
        component: () => import('@/views/space/apps/ListView.vue'),
      },
    ],
  },
  {
    path: '/',
    component: BlankLayout,
    children: [
      {
        path: 'auth/login',
        name: 'auth-login',
        meta: { title: '登录' },
        component: () => import('@/views/auth/LoginView.vue'),
      },
      {
  path: 'space/apps/:app_id',
  name: 'space-apps-detail',
  component: () => import('@/views/space/apps/DetailView.vue'),
},
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 路由守卫功能待补充
router.beforeEach(async (to,from) => {
  if(!isLogin() && to.name != 'auth-login'){
    return {path:'/login'}
  }
})

export default router
