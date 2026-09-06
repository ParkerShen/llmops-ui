<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { IconApps } from '@arco-design/web-vue/es/icon'

const route = useRoute()
const router = useRouter()

const collapsed = ref(false)

// 根据当前路由高亮对应菜单
const selectedKeys = computed(() => [route.path])

// 顶部栏标题来自路由 meta
const pageTitle = computed(() => {
  const t = route.meta.title
  return typeof t === 'string' ? t : ''
})

function handleMenuClick(key: string) {
  if (key !== route.path) {
    router.push(key)
  }
}
</script>

<template>
  <a-layout class="app-layout">
    <a-layout-sider
      v-model:collapsed="collapsed"
      collapsible
      breakpoint="lg"
      :width="220"
      theme="light"
    >
      <div class="brand">LLMOps 控制台</div>
      <a-menu
        :selected-keys="selectedKeys"
        theme="light"
        @menu-item-click="handleMenuClick"
      >
        <a-menu-item key="/space/apps">
          <template #icon>
            <IconApps />
          </template>
          AI 应用列表
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <a-layout-header class="app-header">
        <span>{{ pageTitle }}</span>
      </a-layout-header>
      <a-layout-content class="app-content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.app-layout {
  height: 100vh;
}

.brand {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  border-bottom: 1px solid var(--color-border);
}

.app-header {
  flex: none;
  display: flex;
  align-items: center;
  padding: 0 20px;
  background: #fff;
  border-bottom: 1px solid var(--color-border);
}

.app-content {
  flex: auto;
  padding: 16px;
  overflow: auto;
  background: var(--color-fill-2);
}
</style>
