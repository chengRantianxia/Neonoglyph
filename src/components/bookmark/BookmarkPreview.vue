<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElDialog } from "element-plus";

const props = defineProps<{
  url: string;
}>();

const isLoading = ref(true);
const error = ref<string | null>(null);

onMounted(() => {
  // 这里可以进行其他初始化操作
});
</script>

<template>
  <div class="bookmark-preview">
    <iframe
      :src="props.url"
      class="bookmark-preview__iframe"
      frameborder="0"
      @load="isLoading = false"
    ></iframe>
  </div>
</template>

<style scoped lang="scss">
.bookmark-preview {
  width: 100%;
  height: 500px;
  overflow: hidden;

  &__loading {
    padding: 16px;
  }

  &__iframe {
    width: 100%;
    height: 100%;
    border: none; /* 去掉边框 */
  }
}
</style>
