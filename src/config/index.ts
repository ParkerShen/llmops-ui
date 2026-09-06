/**
 * 全局配置
 * - 开发环境默认走 '/api'(由 vite.config.ts 的 server.proxy 转发到后端 127.0.0.1:5000)
 * - 生产环境在 .env 里设置 VITE_API_BASE_URL 指向真实后端
 */
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? '/api'

/** token 在 localStorage 里存的 key(request.ts 自动带上,登录 store 负责写入) */
export const TOKEN_KEY = 'access_token'

/** 单个请求超时时间(ms) */
export const REQUEST_TIMEOUT = 15000
