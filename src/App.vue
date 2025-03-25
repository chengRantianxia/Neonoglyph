<script setup lang="ts">
import { onMounted } from "vue";
import { useTheme } from "@/styles/theme";
import { useSettingsStore } from "@/stores/settings";

const { applyTheme } = useTheme();
const settingsStore = useSettingsStore();

onMounted(() => {
  // 应用初始主题
  applyTheme(settingsStore.isDark);
});
</script>

<template>
  <router-view />
</template>
