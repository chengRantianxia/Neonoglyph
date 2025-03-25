/**
 * URL相关工具函数
 */

// 验证URL格式
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// 获取网站favicon
export function getFaviconUrl(url: string): string {
  try {
    const { protocol, hostname } = new URL(url);
    return `${protocol}//${hostname}/favicon.ico`;
  } catch {
    return "/default-favicon.png";
  }
}

// 获取网站域名
export function getDomain(url: string): string {
  try {
    const { hostname } = new URL(url);
    return hostname;
  } catch {
    return "";
  }
}
