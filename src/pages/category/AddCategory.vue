<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useCategoryStore } from "@/stores/category";
import type { CategoryFormData } from "@/types/category";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";

const router = useRouter();
const categoryStore = useCategoryStore();

const formData = ref<CategoryFormData>({
  name: "",
  description: "",
  icon: "",
});

const rules = {
  name: [
    { required: true, message: "请输入分类名称", trigger: "blur" },
    { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" },
  ],
};

const formRef = ref();
const isSubmitting = ref(false);

async function handleSubmit() {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    isSubmitting.value = true;

    await categoryStore.addCategory({
      ...formData.value,
      order: 0, // 默认排序
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    ElMessage.success("分类添加成功");
    router.push("/");
  } catch (error) {
    if (error !== "validation") {
      ElMessage.error("添加分类失败");
      console.error(error);
    }
  } finally {
    isSubmitting.value = false;
  }
}

function handleCancel() {
  router.back();
}
</script>

<template>
  <div class="add-category">
    <div class="add-category__header">
      <h2>添加新分类</h2>
    </div>

    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
      class="add-category__form"
    >
      <el-form-item label="分类名称" prop="name">
        <el-input
          v-model="formData.name"
          placeholder="请输入分类名称"
          maxlength="20"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="分类图标">
        <el-input v-model="formData.icon" placeholder="请输入图标的 URL 地址">
          <template #append>
            <el-upload
              class="icon-uploader"
              action="/api/upload"
              :show-file-list="false"
              :on-success="(res) => (formData.icon = res.url)"
            >
              <el-button :icon="Plus">上传</el-button>
            </el-upload>
          </template>
        </el-input>
        <div v-if="formData.icon" class="icon-preview">
          <img :src="formData.icon" alt="分类图标" />
        </div>
      </el-form-item>

      <el-form-item label="分类描述">
        <el-input
          v-model="formData.description"
          type="textarea"
          rows="4"
          placeholder="请输入分类描述"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>

      <el-form-item class="form-buttons">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="isSubmitting">
          保存
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
.add-category {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  &__header {
    margin-bottom: 24px;

    h2 {
      margin: 0;
      font-size: 24px;
      color: var(--el-text-color-primary);
    }
  }

  &__form {
    .form-buttons {
      margin-top: 32px;
      text-align: right;
    }
  }
}

.icon-preview {
  margin-top: 8px;
  width: 48px;
  height: 48px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

:deep(.icon-uploader) {
  display: inline-block;
}
</style>
