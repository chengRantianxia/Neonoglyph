# 项目介绍

程序员的小盒子是一款基于浏览器的收藏夹管理工具，旨在帮助程序员更高效地管理和组织收藏夹中的网站信息。通过该工具，用户可以快速查找、添加、编辑和删除网站，同时支持分类管理和锁定功能，以保护收藏夹的安全性。该工具还提供了导入导出功能，方便用户在不同设备之间同步收藏夹信息。

## 需求记录

### 一、页面功能设计

#### 1. 核心功能

- 网站收藏管理：增删改查网站信息（标题、URL、描述、图标等）
- 分类管理：创建/删除分类，分类内网站排序
- 收藏夹锁定：防止误操作
- 搜索功能：按标题、描述快速查找网站

#### 2. 增强功能

- 网站预览：鼠标悬停显示网站截图
- 标签系统：为网站添加多个标签
- 导入导出：支持 JSON 格式数据导入导出
- 支持 chrome 书签夹导入
- 暗黑模式：支持夜间浏览
- 多语言支持：支持中文和英文
- 多设备适配：支持 PC、平板、手机等设备
- 响应式设计：适应不同屏幕尺寸
- 无障碍设计：支持键盘导航
- 侧边栏书签分类导航：快捷定位分类位置

### 二、页面布局建议

#### 1. 顶部导航栏

- 网站标题（程序员的小盒子）
- 搜索框
- 锁定开关按钮
- 用户设置（暗黑模式切换等）

#### 2. 主体区域

- 分类列表
- 网站卡片放到每个分类下网格布局
- 每个卡片包含：网站图标、标题、简短描述、操作按钮（编辑、删除）
- 拖拽排序功能

#### 3. 侧边栏

- 分类管理面板，快速定位分类位置
- 快速操作按钮（新增网站、新增分类）

### 三、样式风格建议

#### 1. 色彩搭配

- 主色调：蓝色（#1E90FF）
- 辅助色：紫色（#8A2BE2）
- 背景色：浅灰色（#F5F5F5）
- 文字色：深灰色（#333333）

#### 2. 动画效果

- 卡片 hover 时轻微放大和阴影效果
- 按钮点击时的涟漪动画
- 页面切换时的淡入淡出效果

#### 3. 字体选择

- 英文字体：Inter（现代感强）
- 中文字体：思源黑体（简洁易读）

### 四、技术实现建议

#### 1. 前端

- 使用 Vue 3 + setup + TypeScript + Pinia + Vite
- UI 库：Element Plus
- 动画库：GSAP
- 图标库：Element Plus Icons

#### 2. 数据存储

- 使用 IndexedDB 存储用户数据
- 实现数据同步备份功能
- 支持数据导入导出
- 支持 Chrome 书签夹导入
- 动态更新，保证数据实时性

#### 3. 性能优化

- 使用虚拟滚动处理大量网站展示
- 图片懒加载
- 数据缓存

## 本地开发环境

- node 版本 16.15.0
- pnpm 8.5.1
- npm 8.5.5
