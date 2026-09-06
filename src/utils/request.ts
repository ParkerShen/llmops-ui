/**
 * fetch 统一封装(基于浏览器原生 fetch,无需额外依赖)
 *
 * 职责:
 *  1. 自动拼接 API_BASE_URL、拼 query 参数
 *  2. 统一 JSON 序列化、自动带 Authorization 头
 *  3. 超时控制(AbortController)
 *  4. 解包后端统一响应 { code, message, data }
 *     - code === 'success'  → 直接返回 data
 *     - 其它 code           → 抛 ApiError(含后端 message)
 *     - code === 'unauthorized' → 清 token 并跳登录页
 *  5. 网络/超时/HTTP 层错误统一转成 ApiError
 */
import { API_BASE_URL, REQUEST_TIMEOUT, TOKEN_KEY } from '@/config'
import { getStorage, removeStorage } from './storage'

/** 后端统一响应结构(见 llmops-api pkg/response) */
interface ApiEnvelope<T> {
  code: string
  message: string
  data: T
}

/** 统一的业务错误:code 是后端业务码或内部标记 */
export class ApiError extends Error {
  code: string
  constructor(code: string, message: string) {
    super(message)
    this.name = 'ApiError'
    this.code = code
  }
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export interface RequestOptions {
  /** 拼到 query string 的参数(GET 常用),undefined/null/'' 会被跳过 */
  params?: Record<string, unknown>
  /** 额外的请求头(会合并,可覆盖默认) */
  headers?: Record<string, string>
  /** 覆盖默认超时(ms) */
  timeout?: number
  /** 外部信号,用于手动取消(如离开页面时) */
  signal?: AbortSignal
}

/** 拼完整 URL: base + path + ?query */
function buildUrl(url: string, params?: Record<string, unknown>): string {
  const base = url.startsWith('http') ? '' : API_BASE_URL
  const full = `${base}${url}`
  if (!params) return full

  const qs = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    qs.append(
      key,
      typeof value === 'object' ? JSON.stringify(value) : String(value),
    )
  })
  const query = qs.toString()
  if (!query) return full
  return `${full}${full.includes('?') ? '&' : '?'}${query}`
}

/** 解析响应:处理 JSON / 空响应 / 非 2xx / 业务码 */
async function parseResponse<T>(res: Response): Promise<T> {
  const text = await res.text()
  let body: ApiEnvelope<T> | null = null
  try {
    body = text ? (JSON.parse(text) as ApiEnvelope<T>) : null
  } catch {
    // 响应不是 JSON(比如网关返回的 HTML),body 保持 null
  }

  // HTTP 层失败(后端 4xx/5xx、网关错误)
  if (!res.ok) {
    throw new ApiError(
      body?.code ?? 'http_error',
      body?.message || `请求失败(HTTP ${res.status})`,
    )
  }

  // 后端统一业务码:只有 success 才算成功
  if (body && body.code !== 'success') {
    if (body.code === 'unauthorized') {
      removeStorage(TOKEN_KEY)
      if (!location.pathname.startsWith('/auth/login')) {
        location.href = '/auth/login'
      }
    }
    throw new ApiError(body.code, body.message || '请求失败')
  }

  return body ? body.data : (undefined as unknown as T)
}

/** 核心请求方法 */
async function request<T>(
  method: HttpMethod,
  url: string,
  data?: unknown,
  options?: RequestOptions,
): Promise<T> {
  const { params, headers, timeout = REQUEST_TIMEOUT, signal } = options ?? {}
  const token = getStorage<string>(TOKEN_KEY)

  // 超时控制:内部 controller 与外部 signal 合并
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), timeout)
  const mergedSignal = signal
    ? AbortSignal.any([signal, controller.signal])
    : controller.signal

  try {
    const res = await fetch(buildUrl(url, params), {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: data !== undefined ? JSON.stringify(data) : undefined,
      signal: mergedSignal,
    })
    return await parseResponse<T>(res)
  } catch (e) {
    if (e instanceof ApiError) throw e
    const aborted =
      e instanceof DOMException && e.name === 'AbortError' && !signal
    throw new ApiError(
      'network',
      aborted ? `请求超时(> ${timeout}ms)` : '网络错误,请检查后端服务是否启动',
    )
  } finally {
    window.clearTimeout(timer)
  }
}

/** 对外暴露的简洁 API */
export const http = {
  get<T>(url: string, options?: RequestOptions): Promise<T> {
    return request<T>('GET', url, undefined, options)
  },
  post<T>(url: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>('POST', url, data, options)
  },
  put<T>(url: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>('PUT', url, data, options)
  },
  delete<T>(url: string, options?: RequestOptions): Promise<T> {
    return request<T>('DELETE', url, undefined, options)
  },
}

export default http
