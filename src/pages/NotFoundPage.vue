<script setup lang="ts">
import { useRouter } from "vue-router";
import { Back } from "@element-plus/icons-vue";

const router = useRouter();

function goBack() {
  router.back();
}

function goHome() {
  router.push("/");
}
</script>

<template>
  <div class="not-found">
    <div class="not-found__content">
      <!-- <img src="@/assets/404.svg" alt="404" class="not-found__image" /> -->

      <h1 class="not-found__title">404</h1>
      <p class="not-found__text">抱歉，您访问的页面不存在</p>

      <div class="not-found__actions">
        <el-button type="primary" @click="goHome">返回首页</el-button>
        <el-button :icon="Back" @click="goBack">返回上一页</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--el-bg-color);

  &__content {
    text-align: center;
    padding: 40px;
  }

  &__image {
    width: 300px;
    max-width: 100%;
    margin-bottom: 40px;
  }

  &__title {
    font-size: 72px;
    font-weight: 700;
    color: var(--el-color-primary);
    margin: 0 0 20px;
  }

  &__text {
    font-size: 20px;
    color: var(--el-text-color-regular);
    margin: 0 0 40px;
  }

  &__actions {
    display: flex;
    gap: 16px;
    justify-content: center;
  }
}
</style>
