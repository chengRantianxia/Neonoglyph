/**
 * 数组工具函数
 */

// 数组去重
export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

// 数组排序
export function sortBy<T>(
  arr: T[],
  key: keyof T,
  order: "asc" | "desc" = "asc"
): T[] {
  return [...arr].sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];

    if (valueA === valueB) return 0;

    const result = valueA > valueB ? 1 : -1;
    return order === "asc" ? result : -result;
  });
}

// 数组分组
export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((groups, item) => {
    const value = String(item[key]);
    groups[value] = groups[value] || [];
    groups[value].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

// 数组移动
export function moveItem<T>(arr: T[], fromIndex: number, toIndex: number): T[] {
  const result = [...arr];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}
