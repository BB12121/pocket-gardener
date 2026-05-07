# 口袋园丁 (Pocket Gardener)

移动端植物养护管理应用，帮助用户记录植物生长、管理养护任务、获取 AI 建议，并与社区交流经验。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 19 |
| 构建工具 | Vite 8 |
| 路由 | React Router v7 |
| 样式 | 纯 CSS（自定义属性 + 组件级内联样式） |
| 代码规范 | ESLint |
| 数据 | 前端 Mock 数据（`src/data/mockData.js`） |

## 项目结构

```
pocket-gardener/
├── public/
│   ├── images/plants/       # 植物图片资源
│   └── images/posts/        # 社区帖子图片资源
├── src/
│   ├── App.jsx              # 路由配置、页面切换动画、底部导航栏
│   ├── index.css            # 全局样式、设计变量、动画定义
│   ├── components/
│   │   ├── GrowthChart.jsx  # SVG 折线图（生长数据可视化）
│   │   ├── Heatmap.jsx      # GitHub 风格热力图（养护/打卡记录）
│   │   ├── Icon.jsx         # SVG 图标组件库
│   │   ├── Layout.jsx       # Tab 页面布局容器
│   │   └── SwipeCell.jsx    # 左滑操作组件
│   ├── data/
│   │   └── mockData.js      # 所有模拟数据
│   └── pages/
│       ├── Home.jsx         # 首页（植物列表 + 今日待办）
│       ├── Tasks.jsx        # 养护任务（排序、新建、左滑操作）
│       ├── Community.jsx    # 社区（关注/推荐/我的、搜索、筛选）
│       ├── Profile.jsx      # 个人中心（打卡热力图、成就）
│       ├── PlantDetail.jsx  # 植物详情（热力图、生长图表、AI建议）
│       ├── AddLog.jsx       # 记录养护日志
│       ├── AddPlant.jsx     # 添加新植物
│       ├── AiSuggestions.jsx# AI 养护建议详情
│       ├── Weather.jsx      # 天气预警
│       ├── NewPost.jsx      # 发布社区帖子
│       └── UserProfile.jsx  # 社区用户主页
```

## 功能模块

### 1. 首页
- 植物卡片网格展示（图片 + 状态标签）
- 今日待办任务预览
- 天气预警入口

### 2. 植物详情
- 植物基本信息 + 品种信息（可展开/收起）
- 养护日志热力图（点击查看当日记录）
- 生长数据图表（高度/叶片数/健康度切换）
- AI 养护建议
- 待办任务列表

### 3. 养护任务
- 按优先级/时间排序
- 左滑操作（完成、延后、忽略）
- 新建任务（选择植物、类型、时间、优先级）
- 分组显示：待处理 / 已延期 / 已处理

### 4. 社区
- 三栏 Tab：关注 / 推荐 / 我的（带滑动切换动画）
- 搜索框 + 筛选（类型：全部/经验/求助，排序：热度/时间）
- 帖子卡片（图片、标签、点赞、评论）
- 关注/取关用户
- 用户主页（头像、简介、统计、帖子列表）
- 悬浮按钮进入发帖页

### 5. 个人中心
- 用户信息 + 统计数据
- 打卡热力图（橙色）
- 成就系统（可展开/收起，进度条）
- 设置入口

## 设计规范

### 设计语言
- 微信/iOS 风格扁平设计
- 最大宽度 430px 居中显示
- 毛玻璃效果（`backdrop-filter: blur(20px)`）用于导航栏和底部 Tab

### CSS 变量
```css
--green: #07c160        /* 主色 */
--green-light: #95ec69  /* 浅绿 */
--green-bg: #f0f9eb     /* 绿色背景 */
--orange: #fa9d3b       /* 警告/延期 */
--red: #fa5151          /* 高优先级/错误 */
--blue: #10aeff         /* 信息/叶片数据 */
--bg: #f5f5f7           /* 页面背景 */
--text-primary: #1d1d1f
--text-secondary: #6e6e73
--text-placeholder: #aeaeb2
--border: #e5e5ea
--radius: 12px
```

### 页面切换动画
- Tab 页面间（首页/任务/社区/我的）：无动画，即时切换
- 进入子页面：从右侧滑入（`translateX(100%) → 0`）
- 返回上级：向右滑出（`translateX(0) → 100%`）

### 组件规范
- `.section`：白色卡片容器
- `.cell`：列表项（带底部分割线）
- `.btn` / `.btn-primary` / `.btn-default`：按钮（矩形，border-radius: 4px）
- `.tag`：标签（pill 形状，分 green/orange/red/gray）
- `.fab`：悬浮操作按钮

## 数据模型

### 植物 (Plant)
```js
{ id, nickname, speciesId, createDate, purchaseDate, location, status, tags, image }
```

### 品种 (Species)
```js
{ id, name, latin, category, waterCycle, fertCycle, light }
```

### 养护日志 (CareLog)
```js
{ id, plantId, type, time, note, status }
```

### 养护任务 (CareTask)
```js
{ id, plantId, type, planTime, priority, status, source }
```

### 生长数据 (PlantGrowthData)
```js
{ [plantId]: { height: [{date, value}], leaves: [{date, value}], health: [{date, value}] } }
```

### 社区帖子 (CommunityPost)
```js
{ id, type, authorId, author, title, content, time, likes, comments, tags, images }
```

### 打卡记录 (CheckinDays)
```js
['2026-04-01', '2026-04-02', ...]  // 日期字符串数组
```

## 开发指南

### 环境要求
- Node.js >= 18
- npm >= 9

### 本地开发
```bash
npm install          # 安装依赖
npm run dev          # 启动开发服务器 (默认 http://localhost:5173)
npm run build        # 生产构建
npm run preview      # 预览生产构建
npm run lint         # 代码检查
```

### 开发约定
1. 页面组件放在 `src/pages/`，通用组件放在 `src/components/`
2. 样式优先使用 `index.css` 中定义的全局类名，复杂布局用内联 style
3. 图标统一使用 `Icon.jsx` 组件，新增图标在该文件中添加 SVG path
4. 数据目前为前端 Mock，后续接入后端时替换 `src/data/mockData.js` 中的导出为 API 调用
5. 路由在 `App.jsx` 中统一管理，Tab 路由嵌套在 Layout 下，子页面为独立路由

### 后续开发方向
- [ ] 接入后端 API（用户认证、数据持久化）
- [ ] 植物图片上传与识别
- [ ] AI 建议接入大模型 API
- [ ] 天气数据接入真实天气 API
- [ ] 社区帖子评论功能
- [ ] 消息通知系统
- [ ] 养护提醒推送
- [ ] 数据导出功能
- [ ] 多语言支持
- [ ] 深色模式
