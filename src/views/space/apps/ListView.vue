<!--
 * @Date: 2026-09-06 16:54:46
 * @Author: parker
 * @FilePath: \llmops-apic:\Users\96082\Desktop\code\llmops\llmops-ui\src\views\space\apps\ListView.vue
 * @Description: 
-->
<script setup lang="ts">
/**
 * 演示把页面数据交给 Pinia store 管理:
 * 组件只负责“发指令 + 展示”,不直接发请求。
 * 链路: 组件 onMounted → store.fetchApps() → appsApi.list() → http.get → fetch
 */
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppsStore } from '@/stores/apps'

const store = useAppsStore()
// storeToRefs 让 store 的 state/getter 解构后仍保持响应式
const { list, loading, error } = storeToRefs(store)

onMounted(() => {
  // store.fetchApps()
})

function retry() {
  // store.fetchApps()
}
</script>

<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <div>
        <h1 class="text-lg font-semibold">AI 应用列表</h1>
        <!-- getter 用法演示 -->
        <p v-if="!loading && !error" class="mt-1 text-sm text-gray-400">
          共 {{ store.appCount }} 个应用
        </p>
      </div>
      <a-button type="primary" :loading="loading" @click="retry">
        {{ loading ? '加载中…' : '刷新' }}
      </a-button>
    </div>

    <!-- 错误态:后端未启动 / 接口未实现都走到这里 -->
    <div
      v-if="error"
      class="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700"
    >
      <p class="font-medium">列表加载失败</p>
      <p class="mt-1 break-all">{{ error }}</p>
      <p class="mt-1 text-amber-500">
        提示:请确认 llmops-api 后端已启动(127.0.0.1:5000),以及列表接口已实现。
      </p>
    </div>

    <!-- 加载中 -->
    <div v-else-if="loading" class="py-10 text-center text-gray-400">加载中…</div>

    <!-- 空态 -->
    <div v-else-if="!list.length" class="py-10 text-center text-gray-400">
      暂无数据
    </div>

    <!-- 数据列表 -->
    <ul v-else class="space-y-2">
      <li
        v-for="app in list"
        :key="app.id"
        class="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3"
      >
        <span>{{ app.name }}</span>
        <span class="text-xs text-gray-400">{{ app.id }}</span>
      </li>
    </ul>
  </div>
</template>
