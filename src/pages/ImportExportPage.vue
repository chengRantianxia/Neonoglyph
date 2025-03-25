<script setup lang="ts">
import { ref } from "vue";
import { useBookmarkStore } from "@/stores/bookmark";
import { useCategoryStore } from "@/stores/category";
import { ElMessage } from "element-plus";
import { Download, Upload } from "@element-plus/icons-vue";

// 添加新的接口定义
interface ChromeBookmark {
  dateAdded: number;
  id: string;
  index: number;
  parentId: string;
  title: string;
  url?: string;
  children?: ChromeBookmark[];
}

const bookmarkStore = useBookmarkStore();
const categoryStore = useCategoryStore();
const isLoading = ref(false);

// 添加新的函数用于扁平化 Chrome 书签
function flattenChromeBookmarks(
  bookmarks: ChromeBookmark[],
  result: { title: string; url: string }[] = []
): { title: string; url: string }[] {
  for (const bookmark of bookmarks) {
    if (bookmark.url) {
      result.push({
        title: bookmark.title,
        url: bookmark.url,
      });
    }
    if (bookmark.children) {
      flattenChromeBookmarks(bookmark.children, result);
    }
  }
  return result;
}

async function handleExport() {
  try {
    const data = {
      bookmarks: bookmarkStore.bookmarks,
      categories: categoryStore.categories,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bookmark-export-${new Date().toISOString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (err) {
    console.error(err);
    ElMessage.error("导出失败");
  }
}

async function handleImport(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  isLoading.value = true;

  try {
    const text = await file.text();
    const data = JSON.parse(text);

    // 验证数据格式
    if (!data.bookmarks || !data.categories) {
      throw new Error("无效的数据格式");
    }

    // TODO: 实现导入逻辑
    ElMessage.success("导入成功");
  } catch (err) {
    console.error(err);
    ElMessage.error("导入失败");
  } finally {
    isLoading.value = false;
  }
}

// 更新 handleChromeImport 函数
async function handleChromeImport() {
  try {
    isLoading.value = true;

    // 创建文件输入元素
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".html";

    // 处理文件选择
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");
        const bookmarkElements = doc.querySelectorAll("a");

        // 确保存在"书签导入"分类
        let importCategoryId = categoryStore.categories.find(
          (c) => c.name === "书签导入"
        )?.id;
        if (!importCategoryId) {
          importCategoryId = await categoryStore.addCategory({
            name: "书签导入",
            description: "从 Chrome 导入的书签",
          });
        }

        // 转换书签
        const bookmarks = Array.from(bookmarkElements).map((a) => ({
          title: a.textContent || "未命名书签",
          url: a.getAttribute("href") || "",
          categoryId: importCategoryId as string,
          tags: [],
        }));

        // 过滤掉无效的 URL
        const validBookmarks = bookmarks.filter(
          (b) =>
            b.url &&
            (b.url.startsWith("http://") || b.url.startsWith("https://"))
        );

        console.log(validBookmarks);
        // 批量添加书签
        for (const bookmark of validBookmarks) {
          await bookmarkStore.addBookmark(bookmark);
        }

        ElMessage.success(`成功导入 ${validBookmarks.length} 个书签`);
      } catch (err) {
        console.error(err);
        ElMessage.error("导入失败");
      } finally {
        isLoading.value = false;
      }
    };

    // 触发文件选择
    input.click();
  } catch (err) {
    console.error(err);
    ElMessage.error("导入失败");
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="import-export-page">
    <h1>导入导出</h1>

    <el-card class="import-export-section">
      <template #header>
        <div class="import-export-section__header">
          <h3>数据导出</h3>
        </div>
      </template>

      <div class="import-export-section__content">
        <p class="description">
          导出所有书签和分类数据为 JSON 文件，可用于备份或迁移。
        </p>
        <el-button type="primary" :icon="Download" @click="handleExport">
          导出数据
        </el-button>
      </div>
    </el-card>

    <el-card class="import-export-section">
      <template #header>
        <div class="import-export-section__header">
          <h3>数据导入</h3>
        </div>
      </template>

      <div class="import-export-section__content">
        <p class="description">从 JSON 文件导入书签和分类数据。</p>
        <el-upload
          class="upload"
          action="#"
          :auto-upload="false"
          :show-file-list="false"
          accept=".json"
          :on-change="handleImport"
        >
          <el-button type="primary" :icon="Upload" :loading="isLoading">
            导入数据
          </el-button>
        </el-upload>
      </div>
    </el-card>

    <el-card class="import-export-section">
      <template #header>
        <div class="import-export-section__header">
          <h3>Chrome 书签导入</h3>
        </div>
      </template>

      <div class="import-export-section__content">
        <p class="description">从 Chrome 浏览器导入书签数据。</p>
        <el-button type="primary" :icon="Upload" @click="handleChromeImport">
          导入 Chrome 书签
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.import-export-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;

  h1 {
    margin-bottom: 30px;
    font-size: 24px;
    font-weight: 600;
  }
}

.import-export-section {
  margin-bottom: 20px;

  &__header {
    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .description {
      margin: 0;
      color: var(--el-text-color-regular);
    }
  }
}

.upload {
  display: inline-block;
}
</style>
