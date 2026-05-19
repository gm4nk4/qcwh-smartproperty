# Visitor 子应用 — 并行任务清单

> **本文件是 visitor 子应用所有改造工作的唯一任务源,专为多 Agent 并行执行设计。**
> 动手前必须先读仓库根 `AGENTS.md`,并完整读完下面的「并行执行守则」一节。

---

## 并行执行守则(任何 Agent 必读)

### 1. 阶段(Phase)

| 阶段 | 并发模式 | 内容 | 启动前提 |
| --- | --- | --- | --- |
| **Phase 0** | **单 Agent 串行** | 打基础:引入公共组件、qiankun 接入、Layout、主题工具、**一次性加完 permission/portal 全部占位路由**、清理旧 layout | 无 |
| **Phase 1** | **多 Agent 并行**(3 条 Track) | Track-B 列表页改造、Track-C 权限/门户模块迁移、Track-D 边角 | **Phase 0 全部任务合并到 main 之后** |
| **Phase 2** | **单 Agent 串行** | i18n 收口、最终 lint、main-app 联调、截图录屏验收 | **Phase 1 所有用户指派的任务完成后** |

### 2. 任务定义格式(每个任务必备 4 字段)

- **Owns**:本任务**唯一**允许修改/新增的文件路径(glob)。改这些之外的任何文件 → 必须先停下来,在 PR 评论里说明,等用户决策。
- **依赖**:本任务开工前必须已合并到 main 的任务 ID 列表。
- **状态**:`☐ pending` / `🟡 in-progress (Agent ID, 分支)` / `☑ done (PR #x, YYYY-MM-DD)`。
- **历史**:已完成或正在进行中的工作日志,追加格式 `- YYYY-MM-DD PR #x 简述`。

### 3. 分支与 PR 约定

- 分支名:**`devin/<unix-timestamp>-<TASK_ID>-<short-slug>`**
  - 例: `devin/1700000000-B3-blacklist-refactor`、`devin/1700000010-C2-permission-user`
- **每个 PR 只完成一个任务 ID**(不要把 B1+B2 塞进同一个 PR)
- PR 标题必须以 `[<TASK_ID>] ` 开头,例:`[B3] visitor 黑名单页接入 ConfigurableTableWithForm`
- PR 描述里明写本次完成的任务 ID 及对应 Owns 文件清单

### 4. 公共文件冲突预防规则

| 公共文件 | 规则 |
| --- | --- |
| `visitor/package.json` | **Phase 0 后冻结**。Phase 1 任务不得新增依赖;如确实需要,先开议题、由 Phase 0 补 PR 处理 |
| `visitor/src/router/route.ts` | **Phase 0 一次性加完所有 permission/portal 占位路由**(component 暂时 import 一个 placeholder)。Phase 1 任务**不改 route.ts**,只在自己 Owns 目录写实际 component 文件 |
| `visitor/src/i18n/lang/zh-cn.ts` / `en.ts` | **Phase 2 由 P2-1 统一收口**。Phase 1 各任务把自己模块的多语言文本写在该模块目录内的 `i18n/zh-cn.ts` / `i18n/en.ts`(独立文件,模块内自给) |
| `visitor/src/stores/**` | Phase 0 后冻结。Phase 1 任务需新增 store 时,先和用户对齐 |
| `visitor/src/utils/**` | Phase 0 后冻结。新增工具放进自己模块目录内 |
| `visitor/MIGRATION_TASKS.md`(本文件) | 每个 PR **只改自己任务章节** 的「状态」与「历史」两字段。章节之间互相独立,Git 自动合并通常无冲突 |
| `AGENTS.md` | 不动,除非你的任务就是改它 |

### 5. 完工流程(Agent 合并前必做)

1. PR 准备合并前,从最新 main rebase 一次。
2. 把本任务章节的 **状态** 从 `☐ pending` → `☑ done (PR #x, YYYY-MM-DD)`。
3. 在本任务章节的 **历史** 段追加一行:`- YYYY-MM-DD PR #x <一句话简述>`。
4. **不要动其他任务的章节**(即使你"顺手"把别的也做了)。
5. PR 描述里:
   - 第一行声明任务 ID
   - 附本次新增/修改的 Owns 文件清单
   - 视觉改动附截图

### 6. Rebase 冲突处理

- 若 rebase 时 `MIGRATION_TASKS.md` 冲突:**保留 main 的所有其他任务章节,只保留自己任务章节里的修改**。
- 若 rebase 时其他源码冲突:说明 Owns 边界划错了,**停下来**先通知用户决策。

---

# Phase 0 — 基础设施(单 Agent 串行,Phase 1 启动前必须全部合并)

> 这一阶段所有任务可以由同一个 Agent 在一个 PR 里一次性做完,也可以拆成多个小 PR 串行做。**关键是 Phase 1 启动时,P0-1 ~ P0-7 必须全部 done。**

## P0-1. 引入公共组件依赖

- **状态**: ☑ done (PR #2, 2026-05-19)
- **Owns**:
  - `visitor/package.json`(只新增 4 行 file 依赖)
- **依赖**: 无
- **内容**: 在 `visitor/package.json` 的 `dependencies` 中新增(参考 `access/package.json`):
  - `"@zhqc-smart/layout": "file:../components/packages/layout"`
  - `"@zhqc-smart/table": "file:../components/packages/table"`
  - `"@zhqc-smart/admin": "file:../components/packages/admin"`
  - `"@zhqc-smart/settings": "file:../components/packages/settings"`
- **历史**:
  - 2026-05-19 PR #2 在 `visitor/package.json` dependencies 中加入 `@zhqc-smart/{admin,layout,settings,table}` 4 个 file 依赖,本地 `npm install` 验证 4 个包均被正确软链到 `components/packages/*`

## P0-2. 接入 qiankun 通信

- **状态**: ☐ pending
- **Owns**:
  - `visitor/src/qiankun/actions.ts`(新增,从 `access/src/qiankun/actions.ts` 复制)
  - `visitor/src/qiankun/communication.ts`(新增,从 access 复制)
  - `visitor/src/hooks/useQiankun.ts`(新增,从 `access/src/hooks/useQiankun.ts` 复制)
  - `visitor/src/main.ts`(改:引入 `setActions/initGlobalStateListener/destroyGlobalStateListener`,`mount/unmount` 中调用)
- **依赖**: P0-1
- **历史**:

## P0-3. 接入公共 Layout(实现「返回统一门户」按钮)

- **状态**: ☐ pending
- **Owns**:
  - `visitor/src/layout/index.vue`(改为 `<Layout :showBack="inQiankun" @back="goMainApp" />`,参考 `access/src/layout/index.vue`)
- **依赖**: P0-1, P0-2
- **历史**:

## P0-4. 同步主题工具与 stores

- **状态**: ☐ pending
- **Owns**:
  - `visitor/src/utils/themeSkin.ts`(新增,从 access 复制)
  - `visitor/src/utils/themeImages.ts`(新增,从 access 复制)
  - `visitor/src/utils/themeLayoutIcons.ts`(新增,从 access 复制)
  - `visitor/src/utils/themeSidebar.ts`(新增,从 access 复制)
  - `visitor/src/utils/resolveComponent.ts`(新增,从 access 复制)
  - `visitor/src/theme/config/skin.ts`(新增,从 access 复制)
  - `visitor/src/theme/index.scss`(必要时对齐 access 的差异)
  - `visitor/src/stores/themeConfig.ts`(对齐 access 的基于 skin 的体系)
  - `visitor/src/App.vue`(引入 `applyThemeCssVars / applyThemeMode`)
- **依赖**: P0-1
- **历史**:

## P0-5. 一次性占位路由(关键防冲突任务)

- **状态**: ☐ pending
- **Owns**:
  - `visitor/src/router/route.ts`(改:加完下面 9 条 permission/portal 路由,component 全部指向 `views/_placeholder/index.vue`)
  - `visitor/src/views/_placeholder/index.vue`(新增:一个简单的 "Coming soon" 占位组件)
- **依赖**: P0-3
- **内容**: 加入以下 9 条路由(细节参照 `access/src/router/mockRoute.ts`):
  - `/permission/user`、`/permission/role`、`/permission/position`、`/permission/space`、`/permission/organization`
  - `/portal/application`、`/portal/ai`、`/portal/category`、`/portal/workbench`

  ⚠️ **重要**:每条路由的 `component` 在 P0-5 中先指向 `_placeholder/index.vue`。Phase 1 的 C2-C10 各自任务**复制实际页面到对应目录后,改导入路径**这一步**也算 Phase 1 的工作**(因为 Phase 1 任务允许改自己 Owns 内的文件,而 `route.ts` 仍冻结)→ 为此请用如下技巧:

  ```ts
  // P0-5 中写法,Phase 1 任务无需改 route.ts
  { path: '/permission/user', component: () => import('/@/views/permission/user/index.vue'), ... }
  ```

  C2-C10 只负责把 `views/permission/user/index.vue` 这个文件**真正写出来**(替代占位),不需要再动 `route.ts`。

  ⚠️ **占位实现要点**:`views/_placeholder/index.vue` 文件保留;`views/permission/user/index.vue` 在 P0-5 阶段**也写一个临时占位**(再 export 一个 placeholder),这样路由能跑通且 Phase 1 任务直接覆盖该文件即可。

- **历史**:

## P0-6. 清理 visitor 自研 layout

- **状态**: ☐ pending
- **Owns**:
  - `visitor/src/layout/main/**`(删)
  - `visitor/src/layout/component/**`(删)
  - `visitor/src/layout/navBars/**`(删)
  - `visitor/src/layout/navMenu/**`(删)
  - `visitor/src/layout/routerView/**`(删)
  - `visitor/src/layout/footer/**`(删)
  - `visitor/src/layout/lockScreen/**`(删,迁到 `@zhqc-smart/layout`)
  - `visitor/src/layout/logo/**`(删)
  - `visitor/src/App.vue`(清理 lockScreen / settings 等引用,若 P0-4 已处理则跳过)
- **依赖**: P0-3
- **历史**:

## P0-7. 把并行守则写入本文件

- **状态**: ☑ done (PR #1, 2026-05-19)
- **Owns**:
  - `AGENTS.md`、`visitor/MIGRATION_TASKS.md`
- **依赖**: 无
- **历史**:
  - 2026-05-19 PR #1 文档与清单初版 + 并行执行守则

---

# Phase 1 — 多 Agent 并行(三条独立 Track)

> Phase 0 全部合入 main 后启动。三条 Track 内的任务大多互相独立,可以由不同 Agent 同时认领。

## Track B — visitor 业务列表页接入公共表格组件

> 改造目标:所有列表页接入 `ConfigurableTableWithForm` / `ConfigurableTable`(参考 `access/src/views/permission/user/index.vue`)

### B1. 预约记录

- **状态**: ☐ pending
- **Owns**: `visitor/src/views/visitor/appointment-records/**`
- **依赖**: P0-1, P0-2, P0-3
- **内容**: 重构 `index.vue`,自研 `<el-table>` + 查询面板替换为 `ConfigurableTableWithForm`,保留列、查询字段、分页、操作列、详情弹窗
- **历史**:

### B2. 通行记录

- **状态**: ☐ pending
- **Owns**: `visitor/src/views/visitor/access-records/**`
- **依赖**: P0-1, P0-2, P0-3
- **历史**:

### B3. 黑名单管理

- **状态**: ☐ pending
- **Owns**: `visitor/src/views/visitor/blacklist/**`
- **依赖**: P0-1, P0-2, P0-3
- **内容**: 接入 `ConfigurableTableWithForm`,保留"新增/移除"及新增弹窗
- **历史**:

### B4. 访客配置

- **状态**: ☐ pending
- **Owns**: `visitor/src/views/visitor/config/**`
- **依赖**: P0-1, P0-2, P0-3
- **内容**: 设备表格改为 `ConfigurableTable`(无查询面板)
- **历史**:

### B5. 访客总览

- **状态**: ☐ pending
- **Owns**: `visitor/src/views/visitor/overview/**`
- **依赖**: P0-3, P0-4
- **内容**: 卡片/图表样式对齐 access `home/index.vue`,复用 `dashboardVars` / 主题 CSS 变量
- **历史**:

### B6. 园区访客管理说明

- **状态**: ☐ pending
- **Owns**: `visitor/src/views/visitor/park-guide/**`
- **依赖**: P0-3
- **内容**: 样式微调 + 栅格对齐
- **历史**:

## Track C — 「统一门户 + 统一权限」模块迁移

> 每个子任务把 access 对应目录整套复制到 visitor 同名目录,**保留 mock 数据,暂不对接后端**。模块内 i18n 写在自己目录的 `i18n/zh-cn.ts`、`i18n/en.ts`(独立文件,Phase 2 统一收口)。

### C2. 用户管理

- **状态**: ☐ pending
- **Owns**: `visitor/src/views/permission/user/**`
- **依赖**: P0-1, P0-3, P0-5(占位路由已加),C-COMMON-HOOK(`useThemeOrUserInfo`,见 C0)
- **内容**: 复制 access 对应目录的 `index.vue`、`userDetail.vue`、`userAuthDialog.vue`、`userEditDialog.vue`、`userResetPwdDialog.vue`、`mock.ts`、`type.ts`、`components/`
- **历史**:

### C3. 角色管理

- **状态**: ☐ pending
- **Owns**: `visitor/src/views/permission/role/**`
- **依赖**: P0-5, C0
- **内容**: 复制 access 对应目录的 `index.vue`、`components/`(含 `AppRoleTab.vue` 等)、`mock.ts`、`type.ts`
- **历史**:

### C4. 岗位管理

- **状态**: ☐ pending
- **Owns**: `visitor/src/views/permission/position/**`
- **依赖**: P0-5, C0
- **历史**:

### C5. 空间管理

- **状态**: ☐ pending
- **Owns**: `visitor/src/views/permission/space/**`
- **依赖**: P0-5, C0
- **历史**:

### C6. 组织管理

- **状态**: ☐ pending
- **Owns**: `visitor/src/views/permission/organization/**`
- **依赖**: P0-5, C0
- **内容**: 包含 `UnifiedOrgView.vue`
- **历史**:

### C7. 统一门户 — 子应用管理

- **状态**: ☐ pending
- **Owns**: `visitor/src/views/portal/application/**`
- **依赖**: P0-5, C0
- **历史**:

### C8. 统一门户 — AI 工具中心

- **状态**: ☐ pending
- **Owns**: `visitor/src/views/portal/ai/**`
- **依赖**: P0-5, C0
- **内容**: 包含 `components/ModelsManage.vue` 等
- **历史**:

### C9. 统一门户 — 应用分类

- **状态**: ☐ pending
- **Owns**: `visitor/src/views/portal/category/**`
- **依赖**: P0-5, C0
- **历史**:

### C10. 统一门户 — 工作台配置

- **状态**: ☐ pending
- **Owns**: `visitor/src/views/portal/workbench/**`
- **依赖**: P0-5, C0
- **历史**:

### C0. 共享 hook(`useThemeOrUserInfo`) — Track C 公共前置

- **状态**: ☐ pending
- **Owns**: `visitor/src/hooks/useThemeOrUserInfo.ts`(新增)
- **依赖**: P0-1, P0-4
- **内容**: 从 `access/src/hooks/useThemeOrUserInfo.ts` 复制。**C2-C10 多个 PR 都会依赖它,所以必须先于这些任务合并**。建议放在 Phase 0 末尾或作为 Phase 1 第一个被领取的任务
- **历史**:

## Track D — 边角(选做)

### D3. admin 用户/角色页面同步

- **状态**: ☐ pending
- **Owns**: `visitor/src/views/admin/user/**`
- **依赖**: P0-1, P0-3
- **内容**: 把 access 的 `UserAuthDialog.vue`、`userDetail.vue`、`mock.ts`、`type.ts`、`components/` 复制过来,使后台 admin 模块与 access 一致
- **历史**:

### D4. 主题图片库

- **状态**: ☐ pending
- **Owns**: `visitor/src/views/theme-images/**`(新增)、`visitor/src/router/route.ts` 加一行
- **依赖**: P0-4
- ⚠️ 本任务**例外**地需要改 `route.ts`(加一行 `/theme-images`),开 PR 前请先通知用户、避免和其他 PR 撞期。如果用户接受,可以一并放进 P0-5 一起做(更稳)
- **历史**:

### D5. 登录页对齐

- **状态**: ☐ pending
- **Owns**: `visitor/src/views/login/**`
- **依赖**: P0-1, P0-4
- **历史**:

---

# Phase 2 — 收口与验收(单 Agent 串行)

## P2-1. i18n 统一收口

- **状态**: ☐ pending
- **Owns**:
  - `visitor/src/i18n/lang/zh-cn.ts`、`visitor/src/i18n/lang/en.ts`
  - `visitor/src/i18n/index.ts`、`visitor/src/i18n/pages/**`
  - 各模块内 `i18n/zh-cn.ts`、`i18n/en.ts`(只读取,合并后可保留或删除)
- **依赖**: 用户指派的 Phase 1 任务全部 done
- **内容**: 把 Phase 1 各模块独立 i18n 文件合并到 `i18n/lang/*.ts`(或 `i18n/pages/*` 子模块),配置 vue-i18n 加载
- **历史**:

## P2-2. main-app 联调

- **状态**: ☐ pending
- **Owns**: 视情况可能需要改 `main-app/` 注册菜单(先和用户确认)
- **依赖**: P2-1
- **内容**: 在 main-app 中以 qiankun 方式加载 visitor,验证「返回统一门户」按钮、菜单跳转、所有迁移页面都能打开
- **历史**:

## P2-3. 最终 lint + build

- **状态**: ☐ pending
- **Owns**: 视情况修复(每条修复独立 PR)
- **依赖**: P2-1
- **内容**:
  ```
  cd visitor && npm install && npm run lint:eslint && npm run build
  ```
  全部通过
- **历史**:

## P2-4. 截图/录屏

- **状态**: ☐ pending
- **Owns**: 仅产出资源(放 PR 描述)
- **依赖**: P2-2
- **历史**:

---

# 待确认问题(开 Phase 1 Track C 前请用户回答)

1. 「统一门户和权限」是否作为 visitor 顶级菜单常驻显示?还是仅在特定角色下显示?
2. visitor 现有的 4 套布局切换成 `@zhqc-smart/layout` 后,是否完全弃用本地 layout?(建议:弃用,与 access/parking 保持一致 → 默认按此执行)
3. 迁移过来的 permission/portal 页面菜单图标(iconfont)是否要重新设计?
4. 顶部 tagsView、面包屑是否完全依赖 `@zhqc-smart/layout` 内置?
5. 是否同步 access 的「日志管理(log/audit/login/visit/maintenance)」与「set(daemon/menu/operation/systemConfiguration/systemDictionary)」整套配置中心?**当前清单未包含**,如需要请告知,会在 Track C 下补 C13-Cxx 新任务。
