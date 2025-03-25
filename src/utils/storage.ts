/**
 * 本地存储工具函数
 */

// 存储键前缀
const PREFIX = "programmer_box_";

// 存储数据
export function setStorage<T>(key: string, value: T): void {
  try {
    const data = JSON.stringify(value);
    localStorage.setItem(PREFIX + key, data);
  } catch (err) {
    console.error("Storage save error:", err);
  }
}

// 获取数据
export function getStorage<T>(key: string): T | null {
  try {
    const data = localStorage.getItem(PREFIX + key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error("Storage read error:", err);
    return null;
  }
}

// 删除数据
export function removeStorage(key: string): void {
  localStorage.removeItem(PREFIX + key);
}

// 清空所有数据
export function clearStorage(): void {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith(PREFIX)) {
      localStorage.removeItem(key);
    }
  });
}
