/**
 * 应用(space/apps)相关接口
 * 对 http 再包一层,集中维护 URL 与出入参类型,
 * 组件/store 只 import 这里的方法,不直接碰 fetch 细节。
 * 后端路由参考 llmops-api internal/router/router.py。
 */
import { http } from '@/utils/request'

/** 应用记录(以后端 model 为准,字段可继续补) */
export interface AppItem {
  id: string
  name: string
  description?: string
  icon?: string
  [key: string]: unknown
}

/** 新建/更新应用入参 */
export interface AppForm {
  name: string
  description?: string
  icon?: string
  [key: string]: unknown
}

/** /app/completion 补全入参(query 必填,后端 CompletionReq 校验 1~1000 字) */
export interface CompletionParams {
  query: string
  [key: string]: unknown
}

/** POST /app/completion 返回:后端统一信封解包后,data 的结构是 { content } */
export interface CompletionResult {
  content: string
}

export const appsApi = {
  /** 列表(注:后端目前还没有 GET /app 列表接口,等后端补了即可用) */
  list(params?: { page?: number; size?: number; keyword?: string }) {
    return http.get<AppItem[]>('/app', { params })
  },

  /** 详情 GET /app/{id} */
  detail(id: string) {
    return http.get<AppItem>(`/app/${id}`)
  },

  /** 新建 POST /app */
  create(form: AppForm) {
    return http.post<AppItem>('/app', form)
  },

  /** 更新 POST /app/{id} */
  update(id: string, form: AppForm) {
    return http.post<AppItem>(`/app/${id}`, form)
  },

  /** 删除 POST /app/{id}/delete */
  remove(id: string) {
    return http.post<{ id: string }>(`/app/${id}/delete`)
  },

  /** 补全 POST /app/completion */
  completion(params: CompletionParams) {
    return http.post<CompletionResult>('/app/completion', params)
  },

  /** 调试对话 POST /app/{id}/debug */
  debug(id: string, params: CompletionParams) {
    return http.post<CompletionResult>(`/app/${id}/debug`, params)
  },
}

export default appsApi
