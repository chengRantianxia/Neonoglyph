<script setup lang="ts">
import { ref, reactive } from "vue";
import { useCategoryStore } from "@/stores/category";
import { useBookmarkStore } from "@/stores/bookmark";
import type { CategoryFormData, Category } from "@/types/category";
import { ElMessage } from "element-plus";

const props = defineProps<{
  category?: Category;
}>();

const emit = defineEmits<{
  (e: "saved", category: Category): void;
  (e: "cancel"): void;
}>();

const categoryStore = useCategoryStore();
const bookmarkStore = useBookmarkStore();
const isLoading = ref(false);

const form = reactive<CategoryFormData>({
  name: props.category?.name || "",
  description: props.category?.description || "",
});

const rules = {
  name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
};

const formRef = ref();

async function handleSubmit() {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    isLoading.value = true;

    let category: Category;

    if (props.category) {
      category = await categoryStore.updateCategory(props.category.id, form);
      await bookmarkStore.fetchBookmarksByCategory(category.id);
      ElMessage.success("分类已更新");
    } else {
      category = await categoryStore.addCategory(form);
      ElMessage.success("分类已添加");
    }

    // 重置表单
    formRef.value.resetFields();
    // 发送保存成功事件
    emit("saved", category);
  } catch (err) {
    console.error(err);
    ElMessage.error("保存失败");
  } finally {
    isLoading.value = false;
  }
}

function handleCancel() {
  emit("cancel");
}
</script>

<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="rules"
    label-width="80px"
    class="category-form"
  >
    <el-form-item label="名称" prop="name">
      <el-input v-model="form.name" placeholder="请输入分类名称" />
    </el-form-item>

    <el-form-item label="描述" prop="description">
      <el-input
        v-model="form.description"
        type="textarea"
        :rows="3"
        placeholder="请输入分类描述（可选）"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="handleSubmit" :loading="isLoading">
        {{ props.category ? "更新" : "添加" }}
      </el-button>
      <el-button @click="handleCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss">
.category-form {
  max-width: 600px;
}
</style>
