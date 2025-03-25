<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useCategoryStore } from "@/stores/category";
import type { Category } from "@/types/category";
import { ElMessage, ElMessageBox } from "element-plus";
import { Edit, Delete } from "@element-plus/icons-vue";
import CategoryForm from "./CategoryForm.vue";

const categoryStore = useCategoryStore();
const showForm = ref(false);
const editingCategory = ref<Category | undefined>(undefined);

onMounted(async () => {
  if (!categoryStore.categories.length) {
    await categoryStore.fetchCategories();
  }
});

function handleEdit(category: Category) {
  editingCategory.value = category;
  showForm.value = true;
}

async function handleDelete(category: Category) {
  try {
    await ElMessageBox.confirm(
      "确定要删除这个分类吗？如果分类下有书签，将无法删除。",
      "删除确认",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    );

    await categoryStore.deleteCategory(category.id);
    ElMessage.success("分类已删除");
  } catch (err) {
    if (err !== "cancel") {
      ElMessage.error(
        typeof err === "object" && err !== null && "message" in err
          ? String(err.message)
          : "删除分类失败"
      );
      console.error(err);
    }
  }
}

function handleSaved() {
  showForm.value = false;
  editingCategory.value = undefined;
}

function handleCancel() {
  showForm.value = false;
  editingCategory.value = undefined;
}
</script>

<template>
  <div class="category-list">
    <div class="category-list__header">
      <h2>分类管理</h2>
      <el-button type="primary" @click="showForm = true">新增分类</el-button>
    </div>

    <el-table :data="categoryStore.sortedCategories" style="width: 100%">
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="description" label="描述" />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button
            type="warning"
            size="small"
            circle
            @click="handleEdit(row)"
            :icon="Edit"
          />
          <el-button
            type="danger"
            size="small"
            circle
            @click="handleDelete(row)"
            :icon="Delete"
          />
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="editingCategory ? '编辑分类' : '新增分类'"
      v-model="showForm"
      width="500px"
      destroy-on-close
    >
      <CategoryForm
        :category="editingCategory"
        @saved="handleSaved"
        @cancel="handleCancel"
      />
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.category-list {
  padding: 20px;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
    }
  }
}
</style>
