import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { nanoid } from "nanoid";
import db from "@/db";
import type { Category, CategoryFormData } from "@/types/category";
import { useBookmarkStore } from "./bookmark";

export const useCategoryStore = defineStore("category", () => {
  const categories = ref<Category[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // 获取所有分类
  async function fetchCategories() {
    isLoading.value = true;
    error.value = null;

    try {
      const result = await db.categories.toArray();
      categories.value = result.sort((a, b) => a.order - b.order);
    } catch (err) {
      error.value = "获取分类失败";
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  }

  // 排序后的分类
  const sortedCategories = computed(() => {
    return [...categories.value].sort((a, b) =>
      a.name.localeCompare(b.name, "zh-CN")
    );
  });

  // 添加分类
  async function addCategory(data: CategoryFormData) {
    const maxOrder =
      categories.value.length > 0
        ? Math.max(...categories.value.map((c) => c.order))
        : 0;

    const newCategory: Category = {
      id: nanoid(),
      ...data,
      order: maxOrder + 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    try {
      await db.categories.add(newCategory);
      categories.value.push(newCategory);
      return newCategory;
    } catch (err) {
      error.value = "添加分类失败";
      console.error(err);
      throw err;
    }
  }

  // 更新分类
  async function updateCategory(id: string, data: Partial<CategoryFormData>) {
    try {
      const category = categories.value.find((c) => c.id === id);
      if (!category) throw new Error("分类不存在");

      const updatedCategory = {
        ...category,
        ...data,
        updatedAt: Date.now(),
      };

      await db.categories.update(id, updatedCategory);

      const index = categories.value.findIndex((c) => c.id === id);
      if (index !== -1) {
        categories.value[index] = updatedCategory;
      }

      return updatedCategory;
    } catch (err) {
      error.value = "更新分类失败";
      console.error(err);
      throw err;
    }
  }

  // 删除分类
  async function deleteCategory(id: string) {
    const bookmarkStore = useBookmarkStore();

    try {
      // 检查分类下是否有书签
      const bookmarksInCategory = bookmarkStore.bookmarks.filter(
        (b) => b.categoryId === id
      );
      if (bookmarksInCategory.length > 0) {
        throw new Error("该分类下还有书签，无法删除");
      }

      await db.categories.delete(id);
      categories.value = categories.value.filter((c) => c.id !== id);
    } catch (err) {
      error.value =
        typeof err === "object" && err !== null && "message" in err
          ? String(err.message)
          : "删除分类失败";
      console.error(err);
      throw err;
    }
  }

  // 更新分类顺序
  async function updateCategoryOrder(orderedIds: string[]) {
    try {
      const updates = orderedIds.map((id, index) => ({
        id,
        order: index,
      }));

      await db.transaction("rw", db.categories, async () => {
        for (const update of updates) {
          await db.categories.update(update.id, { order: update.order });
        }
      });

      // 更新本地状态
      categories.value = categories.value.map((category) => {
        const orderUpdate = updates.find((u) => u.id === category.id);
        if (orderUpdate) {
          return { ...category, order: orderUpdate.order };
        }
        return category;
      });
    } catch (err) {
      error.value = "更新分类顺序失败";
      console.error(err);
      throw err;
    }
  }

  return {
    categories,
    sortedCategories,
    isLoading,
    error,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    updateCategoryOrder,
  };
});
