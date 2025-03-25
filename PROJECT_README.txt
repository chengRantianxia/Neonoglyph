├── .vscode/ # VS Code 配置
├── public/ # 静态资源
│ ├── favicon.ico
│ └── logo.png
├── src/
│ ├── assets/ # 项目资源
│ │ ├── fonts/ # 字体文件
│ │ ├── icons/ # 图标资源
│ │ └── styles/ # 全局样式
│ │ ├── base.scss # 基础样式
│ │ ├── variables.scss # 变量定义
│ │ └── index.scss # 样式入口
│ ├── components/ # 通用组件
│ │ ├── common/ # 基础组件
│ │ │ ├── AppHeader.vue # 应用头部
│ │ │ ├── AppSidebar.vue # 侧边栏
│ │ │ └── AppFooter.vue # 应用底部
│ │ ├── bookmark/ # 书签相关组件
│ │ │ ├── BookmarkCard.vue # 书签卡片
│ │ │ ├── BookmarkForm.vue # 书签表单
│ │ │ ├── BookmarkList.vue # 书签列表
│ │ │ └── BookmarkPreview.vue # 书签预览
│ │ └── category/ # 分类相关组件
│ │ ├── CategoryForm.vue # 分类表单
│ │ ├── CategoryList.vue # 分类列表
│ │ └── CategoryNavigation.vue # 分类导航
│ ├── composables/ # 组合式函数
│ │ ├── useBookmark.ts # 书签相关逻辑
│ │ ├── useCategory.ts # 分类相关逻辑
│ │ ├── useTheme.ts # 主题切换逻辑
│ │ ├── useSearch.ts # 搜索功能逻辑
│ │ └── useImportExport.ts # 导入导出逻辑
│ ├── db/ # 数据库相关
│ │ ├── index.ts # 数据库初始化
│ │ ├── bookmarkDb.ts # 书签数据操作
│ │ └── categoryDb.ts # 分类数据操作
│ ├── layouts/ # 布局组件
│ │ ├── DefaultLayout.vue # 默认布局
│ │ └── EmptyLayout.vue # 空布局
│ ├── locales/ # 国际化
│ │ ├── en.json # 英文翻译
│ │ ├── zh.json # 中文翻译
│ │ └── index.ts # 国际化配置
│ ├── pages/ # 页面组件
│ │ ├── HomePage.vue # 首页
│ │ ├── SettingsPage.vue # 设置页面
│ │ └── ImportExportPage.vue # 导入导出页面
│ ├── router/ # 路由配置
│ │ └── index.ts # 路由定义
│ ├── stores/ # 状态管理
│ │ ├── bookmark.ts # 书签状态
│ │ ├── category.ts # 分类状态
│ │ ├── settings.ts # 设置状态
│ │ └── index.ts # 状态管理入口
│ ├── types/ # 类型定义
│ │ ├── bookmark.ts # 书签相关类型
│ │ ├── category.ts # 分类相关类型
│ │ └── common.ts # 通用类型
│ ├── utils/ # 工具函数
│ │ ├── chromeImport.ts # Chrome 书签导入
│ │ ├── jsonExport.ts # JSON 导出
│ │ ├── validation.ts # 表单验证
│ │ └── helpers.ts # 辅助函数
│ ├── App.vue # 应用入口组件
│ ├── main.ts # 应用入口文件
│ └── env.d.ts # 环境变量类型
├── .eslintrc.js # ESLint 配置
├── .prettierrc # Prettier 配置
├── index.html # HTML 模板
├── package.json # 项目依赖
├── tsconfig.json # TypeScript 配置
├── vite.config.ts # Vite 配置
└── README.md # 项目说明
