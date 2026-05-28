# Pocket Gardener API

这是口袋园丁项目的后端服务，提供用户认证、植物档案、养护日志、养护任务、天气提醒、AI 养护建议、植物识图、社区互动和成就统计等 REST API。

## 技术栈

- Java 17
- Spring Boot 3.3
- Spring MVC
- Spring Data JPA
- Flyway
- MySQL 8
- H2 Test Database
- JUnit + MockMvc

## 启动数据库

```bash
docker compose up -d
```

开发用 MySQL 默认映射到本机 `3307` 端口。

## 环境变量

真实密钥不要写入代码仓库，只通过本机环境变量或部署平台注入。

| 变量 | 说明 |
|---|---|
| `DB_URL` | MySQL JDBC 地址 |
| `DB_USERNAME` | 数据库用户名 |
| `DB_PASSWORD` | 数据库密码 |
| `QWEATHER_HOST` | 和风天气 API Host |
| `QWEATHER_API_KEY` | 和风天气 API Key |
| `QWEATHER_LOCATION` | 城市 Location ID |
| `QWEATHER_CITY` | 城市展示名称 |
| `AI_BASE_URL` | OpenAI 兼容 API 地址 |
| `AI_API_KEY` | AI API Key |
| `AI_MODEL` | AI 模型名称 |

## 启动服务

```bash
mvn spring-boot:run
```

服务默认运行在 `http://localhost:8080`，接口前缀为 `/api`。

也可以使用 H2 文件数据库进行演示：

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=demo
```

## 演示账号

| 用户名 | 密码 |
|---|---|
| `demo` | `123456` |

## 测试

```bash
mvn test
```

测试环境使用 H2，不依赖本机 MySQL。
