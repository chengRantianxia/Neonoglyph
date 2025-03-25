<script setup lang="ts">
import { ref, computed } from "vue";
import { useBookmarkStore } from "@/stores/bookmark";
import { useSettingsStore } from "@/stores/settings";
import type { Bookmark } from "@/types/bookmark";
import { ElMessage, ElMessageBox, ElDialog } from "element-plus";
import { Edit, Delete, Link } from "@element-plus/icons-vue";
import BookmarkPreview from "./BookmarkPreview.vue";
const props = defineProps<{
  bookmark: Bookmark;
}>();

const emit = defineEmits<{
  (e: "edit", bookmark: Bookmark): void;
}>();

const bookmarkStore = useBookmarkStore();
const settingsStore = useSettingsStore();

const isHovering = ref(false);
const showPreview = ref(false);
const dialogVisible = ref(false);

const faviconUrl = computed(() => {
  if (props.bookmark.iconUrl) return props.bookmark.iconUrl;
  try {
    const url = new URL(props.bookmark.url);
    return `${url.origin}/favicon.ico`;
  } catch (e) {
    return "/default-favicon.png";
  }
});

function handleEdit() {
  emit("edit", props.bookmark);
}

async function handleDelete() {
  try {
    await ElMessageBox.confirm(
      "确定要删除这个书签吗？此操作不可恢复。",
      "删除确认",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    );

    await bookmarkStore.deleteBookmark(props.bookmark.id);
    ElMessage.success("书签已删除");
  } catch (err) {
    if (err !== "cancel") {
      ElMessage.error("删除书签失败");
      console.error(err);
    }
  }
}

function openUrl() {
  window.open(props.bookmark.url, "_blank");
}

function handleMouseEnter() {
  isHovering.value = true;
  const timer = setTimeout(() => {
    showPreview.value = true;
  }, 500);

  return () => clearTimeout(timer);
}

function handleMouseLeave() {
  isHovering.value = false;
  showPreview.value = false;
}

function showPreviewDialog() {
  dialogVisible.value = true;
}
</script>

<template>
  <div
    class="bookmark-card"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="bookmark-card__content" @click="openUrl">
      <div class="bookmark-card__icon">
        <img v-if="faviconUrl" :src="faviconUrl" />
      </div>
      <div class="bookmark-card__info">
        <h3 class="bookmark-card__title">{{ bookmark.title }}</h3>
        <p v-if="bookmark.description" class="bookmark-card__description">
          {{ bookmark.description }}
        </p>
        <div v-if="bookmark.tags.length" class="bookmark-card__tags">
          <el-tag
            v-for="tag in bookmark.tags"
            :key="tag"
            size="small"
            effect="plain"
          >
            {{ tag }}
          </el-tag>
        </div>
      </div>
    </div>

    <div class="bookmark-card__actions" v-show="isHovering">
      <el-button
        type="warning"
        size="small"
        circle
        @click.stop="handleEdit"
        v-if="!settingsStore.isLocked"
        :icon="Edit"
      />
      <el-button
        type="danger"
        size="small"
        circle
        @click.stop="handleDelete"
        v-if="!settingsStore.isLocked"
        :icon="Delete"
      />
      <el-button
        type="info"
        size="default"
        circle
        @click.stop="showPreviewDialog"
        v-if="settingsStore.isLocked"
      >
        预览
      </el-button>
    </div>
  </div>

  <el-dialog
    v-model="dialogVisible"
    width="80%"
    destroy-on-close
    title="书签预览"
  >
    <BookmarkPreview :url="bookmark.url" />
  </el-dialog>
</template>

<style scoped lang="scss">
.bookmark-card {
  position: relative;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 16px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.2);
  }

  &__content {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  &__icon {
    flex-shrink: 0;
    width: 32px;
    height: 32px;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__title {
    margin: 0 0 8px;
    font-size: 16px;
    font-weight: 600;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__description {
    margin: 0 0 8px;
    font-size: 14px;
    color: #666;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  &__actions {
    position: absolute;
    top: 8px;
    right: 8px;
    display: flex;
    gap: 4px;
  }

  &__preview {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 10;
    width: 320px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    margin-top: 8px;
  }
}
</style>
