<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useBookmarkStore } from "@/stores/bookmark";
import { useCategoryStore } from "@/stores/category";
import { useSettingsStore } from "@/stores/settings";
import BookmarkCard from "@/components/bookmark/BookmarkCard.vue";
import BookmarkForm from "@/components/bookmark/BookmarkForm.vue";
import CategoryNavigation from "@/components/category/CategoryNavigation.vue";
import type { Bookmark } from "@/types/bookmark";
import { Plus } from "@element-plus/icons-vue";

const bookmarkStore = useBookmarkStore();
const categoryStore = useCategoryStore();
const settingsStore = useSettingsStore();

const isLoading = ref(true);
const showBookmarkForm = ref(false);
const editingBookmark = ref<Bookmark | undefined>(undefined);
const selectedCategoryId = ref<string | null>(null);

onMounted(async () => {
  try {
    await Promise.all([
      bookmarkStore.fetchBookmarks(),
      categoryStore.fetchCategories(),
    ]);
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
});

function handleAddBookmark() {
  if (settingsStore.isLocked) return;
  editingBookmark.value = undefined;
  showBookmarkForm.value = true;
}

function handleEditBookmark(bookmark: Bookmark) {
  if (settingsStore.isLocked) return;
  editingBookmark.value = bookmark;
  showBookmarkForm.value = true;
}

function handleSaved() {
  showBookmarkForm.value = false;
  editingBookmark.value = undefined;
}

function handleCancel() {
  showBookmarkForm.value = false;
  editingBookmark.value = undefined;
}

function handleCategorySelect(categoryId: string) {
  selectedCategoryId.value = categoryId;
}
</script>

<template>
  <div class="home-page">
    <div class="home-page__sidebar">
      <CategoryNavigation @select="handleCategorySelect" />
    </div>

    <div class="home-page__content">
      <el-skeleton :loading="isLoading" animated :count="4">
        <template #default>
          <template v-if="categoryStore.categories.length">
            <div
              v-for="category in categoryStore.sortedCategories"
              :key="category.id"
              :class="{
                'bookmark-section': true,
                'bookmark-section--hidden':
                  selectedCategoryId && selectedCategoryId !== category.id,
              }"
            >
              <div class="bookmark-section__header">
                <h2>{{ category.name }}</h2>
                <el-button
                  v-if="!settingsStore.isLocked"
                  type="primary"
                  :icon="Plus"
                  circle
                  @click="handleAddBookmark"
                />
              </div>

              <div class="bookmark-section__content">
                <template
                  v-if="
                    bookmarkStore.getBookmarksByCategory(category.id).length > 0
                  "
                >
                  <BookmarkCard
                    v-for="bookmark in bookmarkStore.getBookmarksByCategory(
                      category.id
                    )"
                    :key="bookmark.id"
                    :bookmark="bookmark"
                    @edit="handleEditBookmark"
                  />
                </template>
                <el-empty v-else description="暂无书签" />
              </div>
            </div>
          </template>
          <el-empty v-else description="暂无分类，请先添加分类" />
        </template>
      </el-skeleton>
    </div>

    <el-dialog
      :title="editingBookmark ? '编辑书签' : '新增书签'"
      v-model="showBookmarkForm"
      width="500px"
      destroy-on-close
    >
      <BookmarkForm
        :bookmark="editingBookmark"
        :category-id="selectedCategoryId || undefined"
        @saved="handleSaved"
        @cancel="handleCancel"
      />
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.home-page {
  height: calc(100vh - 100px);
  display: flex;
  gap: 20px;

  &__sidebar {
    width: 200px;
    background-color: white;
    border-radius: 8px;
    overflow: hidden;
  }

  &__content {
    flex: 1;
    overflow-y: auto;
    padding-right: 20px;
  }
}

.bookmark-section {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;

  &--hidden {
    display: none;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }
  }

  &__content {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }
}
</style>
