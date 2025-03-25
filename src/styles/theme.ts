import { useDark, useToggle } from "@vueuse/core";

// 主题变量
export const themeVars = {
  light: {
    colors: {
      primary: "#409eff",
      success: "#67c23a",
      warning: "#e6a23c",
      danger: "#f56c6c",
      info: "#909399",

      background: "#f5f7fa",
      surface: "#ffffff",
      border: "#dcdfe6",

      textPrimary: "#303133",
      textRegular: "#606266",
      textSecondary: "#909399",
      textPlaceholder: "#c0c4cc",
    },
    shadows: {
      sm: "0 2px 4px rgba(0,0,0,0.12)",
      md: "0 2px 8px rgba(0,0,0,0.12)",
      lg: "0 4px 16px rgba(0,0,0,0.12)",
    },
  },
  dark: {
    colors: {
      primary: "#409eff",
      success: "#67c23a",
      warning: "#e6a23c",
      danger: "#f56c6c",
      info: "#909399",

      background: "#141414",
      surface: "#1e1e1e",
      border: "#4c4d4f",

      textPrimary: "#e5eaf3",
      textRegular: "#cfd3dc",
      textSecondary: "#a3a6ad",
      textPlaceholder: "#8d9095",
    },
    shadows: {
      sm: "0 2px 4px rgba(0,0,0,0.3)",
      md: "0 2px 8px rgba(0,0,0,0.3)",
      lg: "0 4px 16px rgba(0,0,0,0.3)",
    },
  },
};

// CSS变量
export const cssVars = {
  light: {
    "--el-color-primary": themeVars.light.colors.primary,
    "--el-color-success": themeVars.light.colors.success,
    "--el-color-warning": themeVars.light.colors.warning,
    "--el-color-danger": themeVars.light.colors.danger,
    "--el-color-info": themeVars.light.colors.info,

    "--el-bg-color": themeVars.light.colors.background,
    "--el-bg-color-overlay": themeVars.light.colors.surface,
    "--el-border-color": themeVars.light.colors.border,

    "--el-text-color-primary": themeVars.light.colors.textPrimary,
    "--el-text-color-regular": themeVars.light.colors.textRegular,
    "--el-text-color-secondary": themeVars.light.colors.textSecondary,
    "--el-text-color-placeholder": themeVars.light.colors.textPlaceholder,

    "--el-box-shadow-light": themeVars.light.shadows.sm,
    "--el-box-shadow": themeVars.light.shadows.md,
    "--el-box-shadow-dark": themeVars.light.shadows.lg,
  },
  dark: {
    "--el-color-primary": themeVars.dark.colors.primary,
    "--el-color-success": themeVars.dark.colors.success,
    "--el-color-warning": themeVars.dark.colors.warning,
    "--el-color-danger": themeVars.dark.colors.danger,
    "--el-color-info": themeVars.dark.colors.info,

    "--el-bg-color": themeVars.dark.colors.background,
    "--el-bg-color-overlay": themeVars.dark.colors.surface,
    "--el-border-color": themeVars.dark.colors.border,

    "--el-text-color-primary": themeVars.dark.colors.textPrimary,
    "--el-text-color-regular": themeVars.dark.colors.textRegular,
    "--el-text-color-secondary": themeVars.dark.colors.textSecondary,
    "--el-text-color-placeholder": themeVars.dark.colors.textPlaceholder,

    "--el-box-shadow-light": themeVars.dark.shadows.sm,
    "--el-box-shadow": themeVars.dark.shadows.md,
    "--el-box-shadow-dark": themeVars.dark.shadows.lg,
  },
};

// 主题切换Hook
export function useTheme() {
  const isDark = useDark();
  const toggleDark = useToggle(isDark);

  function applyTheme(dark = false) {
    const vars = dark ? cssVars.dark : cssVars.light;
    const root = document.documentElement;

    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }

  return {
    isDark,
    toggleDark,
    applyTheme,
  };
}
