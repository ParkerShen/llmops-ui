/**
 * Pinia store 示例 —— 数据列表型(Options 风格:state / getters / actions)
 *
 * 用法(在组件里):
 *   import { storeToRefs } from 'pinia'
 *   import { useAppsStore } from '@/stores/apps'
 *   const store = useAppsStore()
 *   const { list, loading, error } = storeToRefs(store)  // 响应式,别解构 store 本身
 *   onMounted(() => store.fetchApps())
 *
 * 说明:
 *  - state 里的字段用普通函数返回;改成普通对象会丢失响应式
 *  - actions 里用 this.xxx 访问同 store 的其它 state/getter/action
 *  - 组件里可以直接调用 store 上的 action:store.fetchApps()
 */
import { defineStore } from 'pinia'
import { appsApi, type AppItem } from '@/services/apps'

export const useAppsStore = defineStore('apps', {
  state: () => ({
    list: [] as AppItem[], // 列表数据
    loading: false, // 是否请求中(用来驱动 loading 态)
    error: '', // 空字符串表示无错误
    total: 0, // 后端总数(分页用)
  }),

  getters: {
    // 带参数不行,getter 只读缓存;展示类派生值放这里
    appCount: (state) => state.list.length,
    hasError: (state) => !!state.error,
  },

  actions: {
    /** 拉取应用列表(失败不抛,把错误放 state,由界面展示) */
    async fetchApps(params?: { page?: number; size?: number }) {
      this.loading = true
      this.error = ''
      try {
        const data = await appsApi.list(params)
        this.list = data ?? []
        this.total = data?.length ?? 0
      } catch (e) {
        // request 已把各种错误归一成 Error,取 message 展示即可
        this.list = []
        this.total = 0
        this.error = e instanceof Error ? e.message : String(e)
      } finally {
        this.loading = false
      }
    },

    /** 清空,便于重置状态(比如退出账号时) */
    reset() {
      this.list = []
      this.total = 0
      this.error = ''
      this.loading = false
    },
  },
})

export default useAppsStore
