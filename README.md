# 黑龙江农信员工信息同步平台

> 面向黑龙江省农村信用社联合社的企业级员工信息管理系统

## 项目简介

本项目基于开源项目 [vhr (微人事)](https://github.com/lenve/vhr) 改造而来，经过全面重构升级为面向银行业的企业级应用。

## 技术栈

### 后端
- Spring Boot 2.7.18 (JDK 1.8)
- Spring Security (动态权限、数据库驱动)
- MyBatis + Flyway
- MySQL 8.0

### 前端
- React 18 + TypeScript
- TDesign React (腾讯组件库)
- Vite 5
- ECharts (数据可视化)
- Zustand (状态管理)

## 快速开始

### 环境要求
- JDK 1.8+
- MySQL 8.0
- Node.js 18+
- Maven 3.6+

### 启动后端
```bash
# 创建数据库 (仅首次)
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS vhr"

# 编译
cd vhr && mvn clean install -DskipTests

# 启动 (port 8081, Flyway 自动建表)
cd vhr && mvn spring-boot:run -pl vhrserver/vhr-web
```

### 启动前端
```bash
cd frontend && npm install
npm run dev    # http://localhost:3000
```

### 登录
- 用户名: `admin`
- 密码: `123`

## 功能模块

| 模块 | 功能 | 状态 |
|------|------|------|
| 仪表盘 | 统计卡片(员工数/部门数/入职/待办) + 快捷操作 | ✅ |
| 员工列表 | 高级筛选/分页/CRUD/导入导出 | ✅ |
| 员工详情 | 全息档案卡片(基本/合同/教育) | ✅ |
| 员工录入 | 4步向导表单(基本→岗位→教育→合同) | ✅ |
| 批量导入 | Excel模板下载+上传+校验 | ✅ |
| 奖惩管理 | 员工奖惩记录CRUD | ✅ |
| 员工雷达图 | ECharts六维评分(司龄/经验/领域/考评/贡献/积分) | ✅ |
| 对比分析 | 多人叠加雷达图对比 | ✅ |
| 岗位推荐 | 基于评分的候选人匹配排名 | ✅ |
| 团队概览 | 部门分布饼图/学历柱图/人事变动 | ✅ |
| 用户管理 | 管理员CRUD + 角色分配 + 启停 | ✅ |
| 组织架构 | 部门树(可编辑) + 职位/职级管理 | ✅ |
| 操作日志 | 日志查询 | ✅ |
| 数据字典 | 可配置枚举值管理 | ✅ |
| 个人中心 | 用户信息 + 修改密码 | ✅ |

## 项目结构

```
├── vhr/                     # Maven 后端
│   └── vhrserver/
│       ├── vhr-web/         # Controllers + Security + Flyway
│       ├── vhr-service/     # Business Logic
│       ├── vhr-mapper/      # MyBatis Mappers + XML
│       └── vhr-model/       # POJOs + DTOs
├── frontend/                # React 前端
│   ├── src/
│   │   ├── api/             # API 接口
│   │   ├── components/      # 通用组件 (Layout)
│   │   ├── pages/           # 17个功能页面
│   │   ├── store/           # Zustand (sessionStorage 持久化)
│   │   ├── utils/           # request, avatar, cache
│   │   ├── router/          # React Router v6
│   │   └── types/           # TypeScript 类型
│   └── public/              # Logo + SVG头像
├── vuehr/                   # Vue 2 旧前端 (废弃)
└── CODEBUDDY.md             # 开发指南
```

## 数据库迁移

| Version | 内容 |
|---------|------|
| V1 | 全量建表 |
| V2 | 本地SVG头像 |
| V3 | 员工分析字段 + ROLE_leader |
| V4 | Mock分析数据 + 奖惩记录 |

## 品牌设计

- 主色: 农信绿 `#006b3f` / `#00a651`
- 辅助: 金色 `#c9a96e`
- 导航: 深蓝灰 `#1a2b3c`
- Logo: 黑龙江省农村信用社联合社标识

## 改造记录

### 第一阶段：简化改造
- 移除 Redis (改内存缓存)、RabbitMQ、mailserver、WebSocket 聊天、FastDFS
- 前端构建工具从 vue-cli/webpack 迁移到 Vite
- 头像系统本地化 (SVG 动物头像)

### 第二阶段：版本升级
- Spring Boot 2.4 → 2.7.18
- MyBatis/Druid 升级
- 引入 Flyway 数据库版本管理

### 第三阶段：全面重构 (React)
- 前端用 React 18 + TypeScript + TDesign 完全重写
- 新增 17 个功能页面
- 后端新增 AnalysisController、StatisticsController
- 数据库扩展员工分析字段
- 实现六维雷达图 + 对比分析 + 岗位推荐
- SessionStorage 缓存策略 (替代 Redis)

## License

Apache License 2.0
