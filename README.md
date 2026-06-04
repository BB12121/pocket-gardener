# Pocket Gardener 展示版

这是口袋园丁的纯前端展示版本，用于课堂演示、前端单独提交和界面预览。

## 说明

- 不包含 Spring Boot 后端、数据库、Android 工程和服务端配置。
- 默认使用本地展示模式，不需要启动后端服务。
- 数据来自前端内置 mock 数据，适合演示首页、植物、任务、社区和个人中心等页面。
- 真实应用完整版请使用主项目 `pocket-gardener`。

## 启动

```powershell
npm install
npm run dev
```

默认访问：

```text
http://localhost:5173
```

打开页面后点击“进入本地展示”即可进入应用界面。

## 构建

```powershell
npm run build
```

构建产物输出到：

```text
dist/
```

## 检查

```powershell
npm run lint
```
