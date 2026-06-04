# Pocket Gardener 口袋园丁

口袋园丁是一个面向家庭植物养护的全栈应用，提供植物档案、养护任务、养护日志、天气提醒、AI 养护建议、植物识图、社区互动和个人成就等功能。

## 功能概览

- 用户管理：注册、登录、登录态校验，业务接口使用 Bearer Token 鉴权。
- 植物管理：新增植物、查看植物详情、生长曲线和养护记录。
- 养护任务：创建任务、完成任务、延后任务、忽略任务，支持前端左滑操作。
- 养护日志：记录浇水、施肥、修剪、换盆等行为，支持添加照片，并同步更新打卡热力图。
- 天气提醒：接入和风天气接口，根据实时天气和预警信息辅助养护决策。
- AI 能力：接入 OpenAI 兼容接口，生成养护建议，并支持图片识别植物。
- 社区模块：发帖、图片附件、帖子详情、评论、点赞状态切换、关注用户、查看推荐和关注动态。
- 个人中心：统计植物数量、连续打卡、成就和活跃记录。

## 技术栈

| 模块 | 技术 |
|---|---|
| 前端 | React 19, Vite, React Router, CSS |
| 后端 | Java 17, Spring Boot 3.3, Spring MVC, Spring Data JPA |
| 数据库 | MySQL 8, Flyway |
| 测试 | ESLint, Vite Build, Node Test, JUnit, MockMvc, H2 |
| 外部服务 | QWeather, OpenAI-compatible AI API |

## 当前进展

- 前端已完成移动端风格的主要页面：花园首页、植物详情、任务、天气、AI 建议、社区和个人中心。
- 后端已接入 Spring Boot REST API，包含用户认证、植物、日志、任务、社区、天气和 AI 相关接口。
- 数据库使用 Flyway 管理结构迁移，当前已包含社区互动、评论、养护记录图片等迁移脚本。
- Android 版本已接入 Capacitor，可生成 debug APK 用于真机安装测试。
- 图片能力当前采用前端压缩后的 Data URL 存储方式，适合课程演示和本地真机测试；后续正式部署可替换为对象存储。
- 登录页支持“进入演示模式”，可在不启动后端的情况下直接浏览首页、植物、任务、社区和个人中心的本地演示数据。

## 项目结构

```text
pocket-gardener/
├── src/                         # 前端源码
│   ├── components/              # 通用组件
│   ├── context/                 # 前端状态管理
│   ├── pages/                   # 页面
│   ├── services/                # API 调用封装
│   └── utils/                   # 日期、图片处理等工具函数
├── pocket-gardener-api/         # Spring Boot 后端
│   ├── src/main/java/           # 后端业务代码
│   ├── src/main/resources/      # 配置与 Flyway 迁移脚本
│   └── src/test/                # 后端测试
├── android/                     # Capacitor Android 工程
├── docs/                        # 项目开发记录与课程文档
└── README.md
```

## 本地启动

### 1. 启动后端数据库

```bash
cd pocket-gardener-api
docker compose up -d
```

后端目录内的 `docker-compose.yml` 会启动 MySQL，并默认映射到本机 `3307` 端口，避免和本机已有 MySQL 的 `3306` 冲突。

### 2. 配置后端环境变量

真实密钥只放在本机环境变量或部署平台变量中，不要写入代码仓库。

```powershell
$env:DB_URL="jdbc:mysql://localhost:3307/pocket_gardener?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai&createDatabaseIfNotExist=true"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="root"
$env:QWEATHER_HOST="你的和风天气 API Host"
$env:QWEATHER_API_KEY="你的和风天气 Key"
$env:QWEATHER_LOCATION="101210101"
$env:QWEATHER_CITY="杭州"
$env:AI_BASE_URL="你的 AI API Base URL"
$env:AI_API_KEY="你的 AI API Key"
$env:AI_MODEL="gpt-5.4"
```

如果只是演示页面，也可以使用 H2 文件数据库启动：

```bash
cd pocket-gardener-api
mvn spring-boot:run -Dspring-boot.run.profiles=demo
```

### 3. 启动后端服务

```bash
cd pocket-gardener-api
mvn spring-boot:run
```

后端默认运行在 `http://localhost:8080`，接口前缀为 `/api`。

### 4. 启动前端

```bash
npm install
npm run dev
```

前端默认运行在 `http://localhost:5173`。网页端默认请求 `http://localhost:8080/api`，后端不可用时会使用内置演示数据兜底。

如果需要指定接口地址，可在启动或打包前设置：

```powershell
$env:VITE_API_BASE="http://你的后端地址:8080/api"
npm run dev
```

如果只想看前端展示效果，不启动后端也可以，直接在登录页点击“进入演示模式”即可进入本地 mock 数据界面。

## Android 调试包

项目已接入 Capacitor Android。Android 工程位于 `android/`，本地 SDK 路径写在 `android/local.properties` 中，该文件不会提交到 Git。

```bash
npm run android:sync
cd android
./gradlew assembleDebug
```

Windows PowerShell 可使用：

```powershell
npm run android:sync
cd android
.\gradlew.bat assembleDebug
```

调试 APK 输出位置：

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

Android 模拟器访问电脑本机后端时使用 `http://10.0.2.2:8081/api`。运行手机端调试包前，请确保 MySQL 已启动、后端已运行在 `8081`，并且后端环境变量只保存在本机或部署平台。

真机安装 APK 时不能使用 `localhost` 访问电脑后端，需要把前端 API 地址打包为电脑在当前局域网中的 IP，例如：

```powershell
$env:VITE_API_BASE="http://10.29.91.238:8080/api"
npm run android:sync
cd android
.\gradlew.bat assembleDebug
```

如果电脑切换 WiFi、局域网 IP 变化，或者后端端口变化，需要重新设置 `VITE_API_BASE` 并重新打包 APK。

## 演示账号

| 用户名 | 密码 |
|---|---|
| `demo` | `123456` |

## 主要接口

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/api/auth/login` | 登录 |
| POST | `/api/auth/register` | 注册 |
| GET | `/api/auth/me` | 获取当前用户 |
| GET | `/api/garden` | 获取首页聚合数据 |
| POST | `/api/plants` | 新增植物 |
| POST | `/api/logs` | 新增养护日志 |
| POST | `/api/tasks` | 新增养护任务 |
| PATCH | `/api/tasks/{taskId}` | 更新任务状态 |
| POST | `/api/ai/{plantId}/generate` | 生成 AI 养护建议 |
| POST | `/api/vision/plant` | 图片识别植物 |
| POST | `/api/posts` | 发布社区帖子 |
| GET | `/api/posts/{postId}/comments` | 获取帖子评论 |
| POST | `/api/posts/{postId}/comments` | 发表评论 |
| POST | `/api/posts/{postId}/like` | 点赞或取消点赞 |
| POST | `/api/community-users/{userId}/follow` | 关注或取消关注用户 |

除登录和注册外，业务接口需要携带：

```text
Authorization: Bearer <token>
```

## 安全说明

- 外部服务密钥只在后端读取环境变量，前端不保存密钥。
- 仓库忽略 `target/`、日志文件和本地数据库文件。
- Android debug APK、`dist/`、本地 H2 数据库和本地运行日志不应提交到仓库。
- 提交前应执行密钥扫描，避免把 `QWEATHER_API_KEY`、`AI_API_KEY` 等真实值写入 Git。

## 常用命令

```bash
# 前端检查
npm run lint
npm run build
node --test src/services/api.node.test.mjs

# 后端测试
cd pocket-gardener-api
mvn test
```
