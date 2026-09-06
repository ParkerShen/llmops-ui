/**
 * Pinia store 示例 —— 用户/登录型(状态存 localStorage,刷新页面不丢)
 *
 * 登录状态的两层含义要分清:
 *  - store.token          → 内存态,重启就没了
 *  - localStorage token  → 持久态,靠它做“记住登录”
 * 这里初始化时读一次 localStorage,之后读写都同步 storage。
 */
import { defineStore } from 'pinia'
import { http } from '@/utils/request'
import { TOKEN_KEY } from '@/config'
import { getStorage, setStorage, removeStorage } from '@/utils/storage'

export interface UserInfo {
  id: string
  name: string
  email?: string
  avatar?: string
}

/** 后端登录接口的返回(示例,以后端为准) */
interface LoginResult {
  token: string
  user: UserInfo
}

export const useAccountStore = defineStore('account', {
  state: () => ({
    // 初始化时从 localStorage 恢复,实现刷新不掉线
    token: getStorage<string>(TOKEN_KEY) ?? '',
    user: null as UserInfo | null,
  }),

  getters: {
    /** 是否已登录(组件里 if (store.isLogin) ...) */
    isLogin: (state) => !!state.token,
    /** 展示名,未登录给个兜底 */
    nickname: (state) => state.user?.name ?? '未登录',
  },

  actions: {
    /**
     * 密码登录示例:
     * 调用后端登录接口 → 拿到 token+user → 写入内存与 localStorage。
     * 后端接口还没做的话,先看 setLogin 那个纯前端版本。
     */
    async loginByPassword(username: string, password: string) {
      const result = await http.post<LoginResult>('/auth/login', {
        username,
        password,
      })
      this.token = result.token
      this.user = result.user
      setStorage(TOKEN_KEY, result.token)
      return result.user
    },

    /** 直接写入登录态(后端已登录/拿到 token 后调用) */
    setLogin(token: string, user: UserInfo) {
      this.token = token
      this.user = user
      setStorage(TOKEN_KEY, token)
    },

    /** 登出:清内存 + localStorage,再跳登录页 */
    logout() {
      this.token = ''
      this.user = null
      removeStorage(TOKEN_KEY)
      // 注意与 router 里登录页的真实路径保持一致
      location.href = '/auth/login'
    },

    /** 拉取当前用户信息(示例;后端暂无则先不用) */
    async fetchUserInfo() {
      if (!this.token) return
      this.user = await http.get<UserInfo>('/auth/profile')
    },
  },
})

export default useAccountStore
