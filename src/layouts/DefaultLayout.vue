<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useSettingsStore } from "@/stores/settings";
import {
  Search,
  Setting,
  Upload,
  Lock,
  Unlock,
  Plus,
} from "@element-plus/icons-vue";

const router = useRouter();
const settingsStore = useSettingsStore();
const searchQuery = ref("");

function handleSearch() {
  // 实现搜索逻辑
}

function handleLockToggle() {
  settingsStore.toggleLock();
}

function navigateTo(path: string) {
  router.push(path);
}

function handleAddCategory() {
  router.push("/category/add");
}
</script>

<template>
  <div class="default-layout">
    <header class="header">
      <div class="header__left">
        <router-link to="/" class="header__logo">
          <!-- <img src="@/assets/logo.png" alt="Logo" /> -->
          <span>程序员的小盒子</span>
        </router-link>
      </div>

      <div class="header__center">
        <el-input
          v-model="searchQuery"
          placeholder="搜索书签..."
          class="header__search"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>

      <div class="header__right">
        <template v-if="!settingsStore.isLocked">
          <el-button
            type="primary"
            :icon="Plus"
            circle
            @click="handleAddCategory"
          />
        </template>
        <el-button
          :type="settingsStore.isLocked ? 'danger' : 'success'"
          :icon="settingsStore.isLocked ? Lock : Unlock"
          circle
          @click="handleLockToggle"
        />
        <el-button
          type="primary"
          :icon="Upload"
          circle
          @click="navigateTo('/import-export')"
        />
        <el-button
          type="info"
          :icon="Setting"
          circle
          @click="navigateTo('/settings')"
        />
      </div>
    </header>

    <main class="main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style scoped lang="scss">
.default-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  height: 60px;
  padding: 0 20px;
  background-color: white;
  border-bottom: 1px solid var(--el-border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;

  &__left {
    flex: 1;
  }

  &__logo {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: var(--el-text-color-primary);
    font-size: 18px;
    font-weight: 600;

    img {
      height: 32px;
      margin-right: 10px;
    }
  }

  &__center {
    flex: 2;
    max-width: 600px;
    margin: 0 20px;
  }

  &__search {
    width: 100%;
  }

  &__right {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    gap: 10px;

    .el-dropdown {
      margin-right: 8px;
    }
  }
}

.main {
  flex: 1;
  padding: 20px;
  background-color: var(--el-bg-color);
}

// 路由过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;

  .el-icon {
    margin-right: 4px;
  }
}
</style>
