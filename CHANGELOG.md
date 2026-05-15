# 更新日志 (CHANGELOG)

## [2026-05-16] v0.2.0 — 多语言国际化 + 视觉设计大改版

### 新增功能
- **6 语言国际化系统**：支持中文、English、日本語、한국어、Français、Español
  - 智能浏览器语言检测，首次访问自动匹配
  - 语言选择持久化（localStorage），刷新不丢失
  - LanguageSwitcher 组件置于 Header 顶部左侧，Globe 图标下拉切换
  - 全站文本覆盖：Landing、登录/注册、Dashboard、设置、侧边栏
- **CHANGELOG.md**：项目更新日志，记录每次迭代的变更内容

### 视觉设计革新
- **全新色彩体系**：温润学院靛蓝（Warm Academic Indigo）
  - brand（靛蓝）、accent（琥珀金）、surface（暖白）、ink（暖深色）
  - 告别冷蓝/通用 SaaS 风格，打造有校园辨识度的温暖质感
- **现代视觉特效**：
  - 玻璃拟态（glass morphism）卡片变体
  - 柔阴影 + 渐变发光阴影系统
  - 微交互动画：fade-up/down、scale-in、pulse-soft、shimmer、float
  - 点阵背景纹理 + 装饰性渐变光晕
  - 按钮按压反馈 `active:scale-[0.98]`
- **UI 组件全面重设计**（7 个核心组件）：
  - Button：渐变主色 + hover 发光 + 按压反馈
  - Input：柔边框 + focus glow + 温感标签
  - Card：3 种变体（default / glass / elevated）+ hover 发光
  - Avatar：渐变底色 + 过渡动画
  - Dialog：模糊背景 + 缩放动画入场
  - Spinner：SVG 渐变填充
  - Toast：玻璃拟态 + 彩色左边框
- **页面全面重设计**：
  - Landing：交错入场动画 + 装饰性渐变 blob + 特性卡片主题色 + 统计数字栏
  - 登录/注册：品牌图标头 + elevated 卡片 + 错误态彩色容器
  - Dashboard：Sparkles 欢迎动画 + 快捷卡片渐变色 + 入门提示条
  - 功能占位页：主题色图标 + Coming Soon 徽章 + 脉冲点点动画
  - 设置：图标段标题 + 红色危险区 + 保存按钮 loading 态

### 工程改进
- 修复 Alembic 配置目录结构（`alembic.ini` 移至 backend 根目录）
- 新增数据库初始迁移文件
- 修复 TypeScript 类型错误（chat-store 导出 Message/Conversation 类型）
- `.gitignore` 新增 `*.tsbuildinfo` 过滤

### 安全
- `.env` 包含真实 API Key，已通过 `.gitignore` 排除，不会提交至仓库
- `.env.example` 仅含占位符，可安全提交

---

## [2026-05-14] v0.1.0 — 项目初始化

### 基础架构
- FastAPI 后端骨架：auth/chat/knowledge/agents 模块
- Next.js 15 前端骨架：App Router + TailwindCSS + Zustand
- PostgreSQL 16 + Redis 7 数据层
- Docker Compose 开发环境
- JWT 认证体系
- DeepSeek AI 对接（LangChain + OpenAI SDK）
