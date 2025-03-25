<script setup lang="ts">
import { useSettingsStore } from "@/stores/settings";

const settingsStore = useSettingsStore();
</script>

<template>
  <div class="settings-page">
    <h1>设置</h1>

    <el-card class="settings-section">
      <template #header>
        <div class="settings-section__header">
          <h3>外观设置</h3>
        </div>
      </template>

      <div class="settings-section__content">
        <div class="settings-item">
          <span class="settings-item__label">暗黑模式</span>
          <el-switch
            v-model="settingsStore.isDark"
            :active-icon="Moon"
            :inactive-icon="Sun"
            @change="settingsStore.toggleDarkMode"
          />
        </div>

        <div class="settings-item">
          <span class="settings-item__label">界面语言</span>
          <el-select
            v-model="settingsStore.language"
            style="width: 120px"
            @change="settingsStore.setLanguage"
          >
            <el-option label="中文" value="zh" />
            <el-option label="English" value="en" />
          </el-select>
        </div>
      </div>
    </el-card>

    <el-card class="settings-section">
      <template #header>
        <div class="settings-section__header">
          <h3>数据管理</h3>
        </div>
      </template>

      <div class="settings-section__content">
        <div class="settings-item">
          <span class="settings-item__label">自动备份</span>
          <el-switch v-model="autoBackup" />
        </div>

        <div class="settings-item">
          <span class="settings-item__label">备份频率</span>
          <el-select v-model="backupFrequency" style="width: 120px">
            <el-option label="每天" value="daily" />
            <el-option label="每周" value="weekly" />
            <el-option label="每月" value="monthly" />
          </el-select>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.settings-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;

  h1 {
    margin-bottom: 30px;
    font-size: 24px;
    font-weight: 600;
  }
}

.settings-section {
  margin-bottom: 20px;

  &__header {
    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
}

.settings-item {
  display: flex;
  justify-content: space-between;
  align-items: center;

  &__label {
    font-size: 14px;
    color: var(--el-text-color-regular);
  }
}
</style>
