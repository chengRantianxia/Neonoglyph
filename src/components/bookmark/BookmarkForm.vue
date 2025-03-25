<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useBookmarkStore } from "@/stores/bookmark";
import { useCategoryStore } from "@/stores/category";
import type { BookmarkFormData, Bookmark } from "@/types/bookmark";
import { ElMessage } from "element-plus";

const props = defineProps<{
  bookmark?: Bookmark;
  categoryId?: string;
}>();

const emit = defineEmits<{
  (e: "saved", bookmark: Bookmark): void;
  (e: "cancel"): void;
}>();

const bookmarkStore = useBookmarkStore();
const categoryStore = useCategoryStore();
const isLoading = ref(false);

const form = reactive<BookmarkFormData>({
  title: "",
  url: "",
  description: "",
  tags: [],
  categoryId: props.categoryId || "",
});

const rules = {
  title: [{ required: true, message: "请输入标题", trigger: "blur" }],
  url: [
    { required: true, message: "请输入URL", trigger: "blur" },
    {
      validator: (rule: any, value: string, callback: Function) => {
        try {
          new URL(value);
          callback();
        } catch (e) {
          callback(new Error("请输入有效的URL"));
        }
      },
      trigger: "blur",
    },
  ],
  categoryId: [{ required: true, message: "请选择分类", trigger: "change" }],
};

const formRef = ref();
const tagInputVisible = ref(false);
const tagInputValue = ref("");
const tagInputRef = ref();

onMounted(async () => {
  if (!categoryStore.categories.length) {
    await categoryStore.fetchCategories();
  }

  if (props.bookmark) {
    form.title = props.bookmark.title;
    form.url = props.bookmark.url;
    form.description = props.bookmark.description || "";
    form.tags = [...props.bookmark.tags];
    form.categoryId = props.bookmark.categoryId;
  }
});

async function handleSubmit() {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    isLoading.value = true;

    const bookmarkData = {
      title: form.title,
      url: form.url,
      description: form.description,
      tags: [...form.tags],
      categoryId: form.categoryId,
    };

    let bookmark: Bookmark;

    if (props.bookmark) {
      bookmark = await bookmarkStore.updateBookmark(
        props.bookmark.id,
        bookmarkData
      );
      if (props.bookmark.categoryId !== bookmark.categoryId) {
        await bookmarkStore.fetchBookmarksByCategory(props.bookmark.categoryId);
      }
      await bookmarkStore.fetchBookmarksByCategory(bookmark.categoryId);
      ElMessage.success("书签已更新");
    } else {
      bookmark = await bookmarkStore.addBookmark(bookmarkData);
      await bookmarkStore.fetchBookmarksByCategory(bookmark.categoryId);
      ElMessage.success("书签已添加");
    }

    emit("saved", bookmark);
  } catch (err) {
    console.error(err);
    ElMessage.error("保存书签时出错");
  } finally {
    isLoading.value = false;
  }
}

function handleCancel() {
  emit("cancel");
}

function handleTagClose(tag: string) {
  form.tags = form.tags.filter((t) => t !== tag);
}

function showTagInput() {
  tagInputVisible.value = true;
  nextTick(() => {
    tagInputRef.value?.input?.focus();
  });
}

function handleTagInputConfirm() {
  if (tagInputValue.value) {
    if (!form.tags.includes(tagInputValue.value)) {
      form.tags.push(tagInputValue.value);
    }
  }
  tagInputVisible.value = false;
  tagInputValue.value = "";
}
</script>

<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="rules"
    label-width="80px"
    class="bookmark-form"
  >
    <el-form-item label="标题" prop="title">
      <el-input v-model="form.title" placeholder="请输入书签标题" />
    </el-form-item>

    <el-form-item label="URL" prop="url">
      <el-input v-model="form.url" placeholder="请输入网站URL" />
    </el-form-item>

    <el-form-item label="描述" prop="description">
      <el-input
        v-model="form.description"
        type="textarea"
        :rows="3"
        placeholder="请输入网站描述（可选）"
      />
    </el-form-item>

    <el-form-item label="分类" prop="categoryId">
      <el-select
        v-model="form.categoryId"
        placeholder="请选择分类"
        style="width: 100%"
      >
        <el-option
          v-for="category in categoryStore.sortedCategories"
          :key="category.id"
          :label="category.name"
          :value="category.id"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="标签">
      <div class="tag-container">
        <el-tag
          v-for="tag in form.tags"
          :key="tag"
          closable
          @close="handleTagClose(tag)"
        >
          {{ tag }}
        </el-tag>

        <el-input
          v-if="tagInputVisible"
          ref="tagInputRef"
          v-model="tagInputValue"
          class="tag-input"
          size="small"
          @keyup.enter="handleTagInputConfirm"
          @blur="handleTagInputConfirm"
        />

        <el-button
          v-else
          class="button-new-tag"
          size="small"
          @click="showTagInput"
        >
          + 新标签
        </el-button>
      </div>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="handleSubmit" :loading="isLoading">
        {{ props.bookmark ? "更新" : "添加" }}
      </el-button>
      <el-button @click="handleCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss">
.bookmark-form {
  max-width: 600px;
}

.tag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.tag-input {
  width: 90px;
  margin-right: 8px;
  vertical-align: bottom;
}
</style>
