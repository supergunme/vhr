# CODEBUDDY.md

This file provides guidance to CodeBuddy Code when working with code in this repository.

## Project Overview

vhr (员工信息同步平台) is a front-end/back-end separated HR management system. It is a scaffold/teaching project (SpringBoot 2.7 + Vue 2). The backend lives in `vhr/` (Maven multi-module) and the Vue frontend in `vuehr/`.

**This project has been refactored from the original 微人事 project**, with the following major changes:
- Removed: RabbitMQ mail server (`mailserver/`), WebSocket/STOMP chat, FastDFS file storage
- Added: Local avatar system (SVG animal avatars), personnel management pages (employee info + rewards/punishments)
- Frontend migrated from vue-cli/webpack to **Vite**
- Platform renamed to "员工信息同步平台"

## Repository Layout

- `vhr/` — Maven parent (`org.javaboy:vhr`) with one module:
  - `vhrserver/` — the main HR application, a multi-module Maven project (see below). Runs on port **8081**.
- `vuehr/` — Vue 2 + ElementUI + Vite frontend. Dev server on port **8088**, proxies API requests to `localhost:8081` via `vite.config.js`.
- `vhr.sql` — full DB dump (reference only; schema is applied via Flyway).

### vhrserver submodules (layered architecture)

`vhr-web` → `vhr-service` → `vhr-mapper` → `vhr-model`

- `vhr-model` — POJOs / entities (`org.javaboy.vhr.model`).
- `vhr-mapper` — MyBatis mapper interfaces + co-located `*.xml` mapper files (`org.javaboy.vhr.mapper`).
- `vhr-service` — business services, POI/Excel utils (`org.javaboy.vhr.service`, `.utils`).
- `vhr-web` — controllers, Spring Security config, the `VhrApplication` entry point, and **all packaged static frontend assets** under `src/main/resources/static`.

The MyBatis mapper XMLs live next to the Java interfaces in `vhr-mapper/src/main/java`, so `vhr-web/pom.xml` adds `src/main/java/**/*.xml` as a build resource. `@MapperScan` is declared on `VhrApplication`.

## Build & Run

The application entry point is `VhrApplication` in `vhr-web`. Always run Maven commands from the `vhr/` directory.

```bash
# Build the whole backend (run from vhr/)
cd vhr && mvn clean install -DskipTests

# Run the main HR server (port 8081)
cd vhr && mvn spring-boot:run -pl vhrserver/vhr-web
```

### Frontend (vuehr/)

```bash
cd vuehr
npm install
npm run dev       # dev server on localhost:8088, proxies to :8081
npm run build     # outputs to vuehr/dist
```

To deploy the frontend into the backend: after `npm run build`, copy `vuehr/dist/static` and `vuehr/dist/index.html` into `vhr/vhrserver/vhr-web/src/main/resources/static/`.

### Tests

```bash
cd vhr && mvn test
cd vhr && mvn -pl vhrserver/vhr-web test -Dtest=ClassName#methodName
```

## Infrastructure Dependencies

- **MySQL** — database named `vhr` must exist. Schema is created automatically by **Flyway** from `vhr-web/src/main/resources/db/migration/V1__vhr.sql` on first boot. `V2__update_avatars.sql` updates default avatars to local SVG files.
- **Redis** — used for Spring Cache (`menus_cache`).

Config file: `vhr/vhrserver/vhr-web/src/main/resources/application.yml` (edit hosts/credentials for your environment).

## Security & Authorization Model

Authorization is **dynamic and database-driven**, not annotation-based:

- `config/SecurityConfig.java` — Spring Security. Login endpoint is `/doLogin` via custom `LoginFilter`. JSON responses for all auth events. Single-session enforcement.
- `config/CustomFilterInvocationSecurityMetadataSource.java` — URL-to-role matching from DB.
- `config/CustomUrlDecisionManager.java` — role-based access decisions.
- `HrService` implements `UserDetailsService`; passwords use `BCryptPasswordEncoder`.

Static resources whitelisted in SecurityConfig: `/css/**`, `/js/**`, `/index.html`, `/img/**`, `/fonts/**`, `/favicon.ico`, `/verifyCode`, `/userface/**`, `/avatars/**`.

## API Proxy (Frontend → Backend)

Vite proxy config in `vuehr/vite.config.js` forwards these prefixes to `localhost:8081`:
`/doLogin`, `/logout`, `/verifyCode`, `/hr`, `/employee`, `/system`, `/salary`, `/personnel`

## Backend API Endpoints

| Prefix | Controller | Description |
|--------|-----------|-------------|
| `/employee/basic/` | `EmpBasicController` | Employee CRUD, import/export |
| `/personnel/emp/` | `PerEmpController` | Employee info query (personnel module) |
| `/personnel/ec/` | `PerEcController` | Employee rewards/punishments CRUD |
| `/system/basic/` | System controllers | Positions, job levels, departments, etc. |
| `/system/hr/` | `SysHrController` | HR user management |
| `/salary/` | Salary controllers | Salary management |

## Frontend Conventions

- All HTTP goes through `vuehr/src/utils/api.js` — centralizes axios interceptors. Use `getRequest/postRequest/putRequest/deleteRequest/postKeyValueRequest` helpers.
- Dynamic routing via `vuehr/src/utils/menus.js` — fetches menu from backend, maps component name prefixes (`Emp`/`Per`/`Sal`/`Sta`/`Sys`/`Home`) to directories under `views/`.
- Animation library: `animate.css` imported globally in `main.js`.
- Employee custom tags stored in `localStorage` (`emp_custom_tags` key).

## Local Avatar System

- SVG animal avatars stored in `vhr/vhrserver/vhr-web/src/main/resources/static/avatars/` (cat, dog, rabbit, bear, bird).
- User-uploaded avatars stored in `{user.dir}/userface/`, served via `WebMvcConfig.java` resource handler.
- Default avatars assigned via Flyway migration `V2__update_avatars.sql`.

## Conventions

- Java base package: `org.javaboy.vhr` across all modules.
- Controllers return `RespBean` wrapper (`RespBean.ok(...)` / `RespBean.error(...)`), paginated results use `RespPageBean`.
- Exceptions handled in `web/exception/GlobalExceptionHandler.java`.
- Spring Boot 2.7.18, Java 8+ compatible.
