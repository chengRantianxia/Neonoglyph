import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { nanoid } from "nanoid";
import db from "@/db";
import type { Bookmark, BookmarkFormData } from "@/types/bookmark";

export const useBookmarkStore = defineStore("bookmark", () => {
  const bookmarks = ref<Bookmark[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // 获取所有书签
  async function fetchBookmarks() {
    isLoading.value = true;
    error.value = null;

    try {
      const result = await db.bookmarks.toArray();
      bookmarks.value = result;
    } catch (err) {
      error.value = "获取书签失败";
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  }

  // 按分类获取书签
  const getBookmarksByCategory = computed(() => {
    return (categoryId: string) => {
      return bookmarks.value
        .filter((bookmark) => bookmark.categoryId === categoryId)
        .sort((a, b) => a.order - b.order);
    };
  });

  // 添加书签
  async function addBookmark(
    bookmarkData: BookmarkFormData
  ): Promise<Bookmark> {
    try {
      // 获取当前分类下的最大 order
      const categoryBookmarks = await db.bookmarks
        .where("categoryId")
        .equals(bookmarkData.categoryId)
        .toArray();

      const maxOrder =
        categoryBookmarks.length > 0
          ? Math.max(...categoryBookmarks.map((b) => b.order))
          : -1;

      // 构建新的书签对象，严格按照 Bookmark 接口定义
      const newBookmark: Omit<Bookmark, "id"> = {
        title: bookmarkData.title,
        url: bookmarkData.url,
        description: bookmarkData.description || "",
        categoryId: bookmarkData.categoryId,
        tags: [...bookmarkData.tags],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        order: maxOrder + 1,
      };

      // 添加书签并获取生成的 id
      const id = await db.bookmarks.add(newBookmark);
      const addedBookmark = { ...newBookmark, id: id.toString() };

      // 更新本地状态
      bookmarks.value.push(addedBookmark);

      return addedBookmark;
    } catch (error) {
      console.error("添加书签失败:", error);
      throw error;
    }
  }

  // 更新书签
  async function updateBookmark(
    id: string,
    bookmarkData: BookmarkFormData
  ): Promise<Bookmark> {
    try {
      // 获取现有书签数据以保留 order 和 createdAt
      const existingBookmark = await db.bookmarks.get(id);
      if (!existingBookmark) {
        throw new Error("书签不存在");
      }

      const sanitizedData = {
        ...bookmarkData,
        id, // 确保包含 id
        tags: [...bookmarkData.tags],
        updatedAt: new Date().getTime(), // 使用时间戳
        order: existingBookmark.order, // 保留原有顺序
        createdAt: existingBookmark.createdAt, // 保留创建时间
      };

      await db.bookmarks.put(sanitizedData);
      return sanitizedData;
    } catch (error) {
      console.error("更新书签失败:", error);
      throw error;
    }
  }

  // 删除书签
  async function deleteBookmark(id: string) {
    try {
      await db.bookmarks.delete(id);
      bookmarks.value = bookmarks.value.filter((b) => b.id !== id);
    } catch (err) {
      error.value = "删除书签失败";
      console.error(err);
      throw err;
    }
  }

  // 更新书签顺序
  async function updateBookmarkOrder(categoryId: string, orderedIds: string[]) {
    try {
      const updates = orderedIds.map((id, index) => ({
        id,
        order: index,
      }));

      await db.transaction("rw", db.bookmarks, async () => {
        for (const update of updates) {
          await db.bookmarks.update(update.id, { order: update.order });
        }
      });

      // 更新本地状态
      bookmarks.value = bookmarks.value.map((bookmark) => {
        const orderUpdate = updates.find((u) => u.id === bookmark.id);
        if (orderUpdate && bookmark.categoryId === categoryId) {
          return { ...bookmark, order: orderUpdate.order };
        }
        return bookmark;
      });
    } catch (err) {
      error.value = "更新书签顺序失败";
      console.error(err);
      throw err;
    }
  }

  // 添加 fetchBookmarksByCategory 方法
  async function fetchBookmarksByCategory(categoryId: string) {
    try {
      const result = await db.bookmarks
        .where("categoryId")
        .equals(categoryId)
        .toArray();

      // 更新本地状态中对应分类的书签
      bookmarks.value = bookmarks.value
        .filter((b) => b.categoryId !== categoryId)
        .concat(result)
        .sort((a, b) => a.order - b.order);

      return result;
    } catch (err) {
      console.error("获取分类书签失败:", err);
      throw err;
    }
  }

  return {
    bookmarks,
    isLoading,
    error,
    fetchBookmarks,
    getBookmarksByCategory,
    addBookmark,
    updateBookmark,
    deleteBookmark,
    updateBookmarkOrder,
    fetchBookmarksByCategory,
  };
});
