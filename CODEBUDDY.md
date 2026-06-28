# CODEBUDDY.md

This file provides guidance to CodeBuddy Code when working with code in this repository.

## Project Overview

**黑龙江农信员工信息同步平台** — 面向黑龙江省农村信用社联合社的企业级员工信息管理系统。

技术栈：
- **后端**: SpringBoot 2.7.18 + MyBatis + Spring Security + Flyway (JDK 1.8)
- **前端**: React 18 + TypeScript + TDesign React + Vite + ECharts + Zustand
- **数据库**: MySQL 8.0 + Redis

品牌设计：
- 主色：农信绿 `#006b3f` / `#00a651`
- 辅助：金色 `#c9a96e`、深蓝灰 `#1a2b3c`
- Logo: `frontend/public/logo.png`（黑龙江农信标识）

## Repository Layout

```
/
├── vhr/                    # Maven parent (后端)
│   └── vhrserver/          # Multi-module: vhr-web → vhr-service → vhr-mapper → vhr-model
├── frontend/               # React + TDesign 前端 (NEW)
│   ├── src/
│   │   ├── api/            # API 接口定义 (auth, employee, analysis, rewards, system, statistics)
│   │   ├── components/     # 通用组件 (Layout)
│   │   ├── pages/          # 页面 (17个)
│   │   ├── store/          # Zustand 状态管理 (sessionStorage 持久化)
│   │   ├── utils/          # 工具 (request, avatar, cache)
│   │   ├── router/         # React Router v6
│   │   └── types/          # TypeScript 类型定义
│   └── public/             # 静态资源 (logo, avatars)
├── CODEBUDDY.md            # 本文件
└── 黑农logo.png            # 品牌 Logo 源文件
```

### vhrserver submodules (layered architecture)

`vhr-web` → `vhr-service` → `vhr-mapper` → `vhr-model`

- `vhr-model` — POJOs / entities, DTO (RadarDataVO)
- `vhr-mapper` — MyBatis mapper interfaces + co-located `*.xml` (含统计查询)
- `vhr-service` — EmployeeService, EmployeeecService, AnalysisService, StatisticsService, HrService
- `vhr-web` — Controllers, Spring Security, Flyway migrations, static assets

## Build & Run

```bash
# Backend (from vhr/)
cd vhr && mvn clean install -DskipTests
cd vhr && mvn spring-boot:run -pl vhrserver/vhr-web   # port 8081

# Frontend (from frontend/)
cd frontend && npm install
cd frontend && npm run dev    # port 3000, proxies to :8081
```

Login: `admin` / `123` (验证码已关闭)

## Database Migrations (Flyway)

| Version | Description |
|---------|-------------|
| V1 | 全量建表 (employee, hr, department, position, joblevel, role, menu, employeeec, salary...) |
| V2 | 更新默认头像为本地 SVG (/avatars/*.svg) |
| V3 | employee 新增分析字段 (hire_date, position_years, expertise_area, evaluation_score, special_contribution, leadership_level) + ROLE_leader |
| V4 | 填充 mock 数据 (分析字段 + 奖惩记录) |

## Backend API Endpoints

| Prefix | Controller | Description |
|--------|-----------|-------------|
| `POST /doLogin` | LoginFilter | 登录 (form-encoded, 验证码已跳过) |
| `GET /hr/info` | HrInfoController | 获取当前登录用户信息 |
| `/employee/basic/` | EmpBasicController | 员工 CRUD, 导入/导出, 下拉数据 |
| `/personnel/emp/` | PerEmpController | 员工详情查询 |
| `/personnel/ec/` | PerEcController | 员工奖惩 CRUD |
| `/api/analysis/` | AnalysisController | 雷达图数据, 对比分析, 员工简要列表 |
| `/api/statistics/` | StatisticsController | 仪表盘统计 (overview, department-dist, education-dist) |
| `/system/hr/` | HrController | 管理员 CRUD + 角色分配 + 启停 |
| `/system/basic/department/` | DepartmentController | 部门树 CRUD |
| `/system/basic/pos/` | PositionController | 职位 CRUD |
| `/system/basic/jl/` | JobLevelController | 职级 CRUD |

## Frontend Pages (17 pages)

| Module | Page | Route |
|--------|------|-------|
| Auth | 登录 | `/` |
| Home | 仪表盘 | `/app/dashboard` |
| Employee | 员工列表 | `/app/employee/list` |
| Employee | 员工详情 | `/app/employee/detail/:id` |
| Employee | 员工录入 | `/app/employee/form` |
| Employee | 批量导入 | `/app/employee/import` |
| Employee | 奖惩管理 | `/app/employee/rewards` |
| Analysis | 员工雷达图 | `/app/analysis/radar` |
| Analysis | 对比分析 | `/app/analysis/compare` |
| Analysis | 岗位推荐 | `/app/analysis/recommend` |
| Leader | 团队概览 | `/app/leader/overview` |
| System | 用户管理 | `/app/system/user` |
| System | 组织架构 | `/app/system/org` |
| System | 操作日志 | `/app/system/log` |
| System | 数据字典 | `/app/system/dict` |
| User | 个人中心 | `/app/profile` |

## Frontend Conventions

- HTTP 请求: `frontend/src/utils/request.ts` (Axios + interceptors, withCredentials)
- 状态管理: Zustand store, currentUser 持久化到 sessionStorage
- 缓存策略: 下拉数据(民族/政治面貌/职位/职级/部门)缓存到 sessionStorage, 避免重复请求
- 头像: `frontend/src/utils/avatar.ts` — 根据员工 ID 确定性分配本地动物头像
- TDesign 组件注意: SubMenu/MenuItem 必须用 `Menu.SubMenu`/`Menu.MenuItem`, FormItem 必须用 `Form.FormItem`
- Type-only imports: interface 导入必须用 `import type { X }` 而不是 `import { X }`

## Local Avatar System

- SVG 动物头像: `frontend/public/avatars/` (cat, dog, rabbit, bear, bird)
- 后端也有副本: `vhr/vhrserver/vhr-web/src/main/resources/static/avatars/`
- 通过 `getAvatarUrl(userface, id)` 统一处理: 外部URL/空值 → 本地头像

## Security

- 验证码校验已临时关闭 (LoginFilter.checkCode 为空方法)
- Session 管理: JSESSIONID cookie, 单会话限制
- 角色: ROLE_admin, ROLE_leader, ROLE_personnel, ROLE_recruiter 等
- URL 授权: 数据库驱动 (menu 表 url 字段 → role 映射)

## Infrastructure

- **MySQL**: database `vhr`, Flyway auto-migrate on boot
- **Redis**: Spring Cache (`menus_cache`)
- Config: `vhr/vhrserver/vhr-web/src/main/resources/application.yml`
- Flyway: `validate-on-migrate: false` (允许已执行脚本修改)
