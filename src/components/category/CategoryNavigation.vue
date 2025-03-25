<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useCategoryStore } from "@/stores/category";
import { useSettingsStore } from "@/stores/settings";
import type { Category } from "@/types/category";
import { Folder, FolderOpened, Delete } from "@element-plus/icons-vue";
import { ElMessageBox, ElMessage } from "element-plus";

const emit = defineEmits<{
  (e: "select", categoryId: string | null): void;
}>();

const categoryStore = useCategoryStore();
const settingsStore = useSettingsStore();
const activeCategory = ref<string | null>("all");

onMounted(async () => {
  if (!categoryStore.categories.length) {
    await categoryStore.fetchCategories();
  }
});

function handleSelect(categoryId: string | null) {
  activeCategory.value = categoryId;
  emit("select", categoryId === "all" ? null : categoryId);
}

async function handleDelete(category: Category, event: Event) {
  // 阻止事件冒泡，避免触发选择事件
  event.stopPropagation();

  try {
    await ElMessageBox.confirm(
      `确定要删除分类"${category.name}"吗？`,
      "删除确认",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    );

    await categoryStore.deleteCategory(category.id);

    // 如果删除的是当前选中的分类，则切换到"所有分类"
    if (activeCategory.value === category.id) {
      handleSelect("all");
    }
  } catch (error) {
    console.error(error);
    ElMessage.error(typeof error === "string" ? error : "删除分类失败");
  }
}
</script>

<template>
  <div class="category-navigation">
    <el-menu
      :default-active="activeCategory"
      class="category-menu"
      @select="handleSelect"
    >
      <el-menu-item index="all" class="category-menu-item">
        <el-icon><Folder /></el-icon>
        <span>所有分类</span>
      </el-menu-item>

      <el-menu-item
        v-for="category in categoryStore.sortedCategories"
        :key="category.id"
        :index="category.id"
        class="category-menu-item"
      >
        <el-icon><FolderOpened /></el-icon>
        <span>{{ category.name }}</span>
        <el-icon
          v-if="!settingsStore.isLocked"
          class="delete-icon"
          @click="handleDelete(category, $event)"
        >
          <Delete />
        </el-icon>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<style scoped lang="scss">
.category-navigation {
  height: 100%;
  border-right: 1px solid var(--el-border-color);
}

.category-menu {
  border-right: none;
}

.category-menu-item {
  position: relative;
  padding-right: 40px !important;

  &:hover {
    background-color: rgba(125, 67, 204, 0.1);

    .delete-icon {
      opacity: 1;
    }
  }

  &.is-active {
    background-color: rgba(125, 67, 204, 0.2) !important;
    color: #7d43cc !important;
    border-right: 2px solid #7d43cc;

    .el-icon {
      color: #7d43cc !important;
    }
  }

  .el-icon {
    margin-right: 12px;
    font-size: 18px;
  }

  .delete-icon {
    position: absolute;
    right: 12px;
    opacity: 0;
    transition: opacity 0.2s;
    cursor: pointer;

    &:hover {
      color: var(--el-color-danger);
    }
  }
}
</style>
