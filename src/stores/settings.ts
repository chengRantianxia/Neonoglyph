import { defineStore } from "pinia";
import { ref } from "vue";

export const useSettingsStore = defineStore("settings", () => {
  const isLocked = ref(true);
  const isDark = ref(false);
  const language = ref<"zh" | "en">("zh");

  // 切换锁定状态
  function toggleLock() {
    isLocked.value = !isLocked.value;
  }

  // 切换暗黑模式
  function toggleDarkMode() {
    isDark.value = !isDark.value;
    document.documentElement.classList.toggle("dark", isDark.value);
  }

  // 设置语言
  function setLanguage(lang: "zh" | "en") {
    language.value = lang;
  }

  return {
    isLocked,
    isDark,
    language,
    toggleLock,
    toggleDarkMode,
    setLanguage,
  };
});
