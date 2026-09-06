/**
 * localStorage 轻封装:
 * 1. 统一加前缀,避免多项目 key 冲突
 * 2. 自动 JSON 序列化/反序列化
 * 3. 读写失败(隐私模式/超限)静默降级,不抛异常打断业务
 */

const PREFIX = 'llmops:'

export function getStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // 忽略写入失败
  }
}

export function removeStorage(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key)
  } catch {
    // 忽略
  }
}
