/**
 * 防抖函数
 */

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: number | null = null;

  return function (...args: Parameters<T>) {
    if (timer) {
      clearTimeout(timer);
    }

    timer = window.setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
}
