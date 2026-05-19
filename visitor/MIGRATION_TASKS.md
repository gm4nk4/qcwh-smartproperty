# Visitor 子应用 — 迁移与样式改造 任务清单

> **本文件是 visitor 子应用所有后续改造工作的唯一任务源。**
> 在动手之前请先读仓库根的 `AGENTS.md`,了解项目边界(`access/`、`parking/`、`components/` 不可改动)。
>
> **完成任务必须做的事**:
> 1. 将对应任务前的 `[ ]` 改成 `[x]`
> 2. 在该任务条目下方追加一行(2 空格缩进 + `-`)记录:**日期 / PR 号 / 主要改动文件**
> 3. 若清单需要新增/拆分/废弃任务,在同一 PR 里改,并在 PR 描述里说明理由
> 4. 不要私自删除未完成的任务;如要废弃,加删除线 `~~A1~~` 并写原因

---

## 范围说明

- 本清单仅涉及 `visitor/` 和(必要时)`main-app/` 的改动。
- `access/`、`parking/`、`components/` 仅作为参考,**禁止修改**。
- visitor 子应用目前所有功能均已具备且使用模拟数据,**当前阶段不对接后端**,主要工作是样式调整 + 公共能力迁移。

---

## 一、基础设施 / 框架对齐(让 visitor 拥有和 access/parking 一致的运行底座)

- [ ] **A1. package.json 引入公共依赖** — 在 `visitor/package.json` `dependencies` 中新增以下 file 依赖(参考 `access/package.json`):
  - `"@zhqc-smart/layout": "file:../components/packages/layout"`
  - `"@zhqc-smart/table": "file:../components/packages/table"`
  - `"@zhqc-smart/admin": "file:../components/packages/admin"`
  - `"@zhqc-smart/settings": "file:../components/packages/settings"`
- [ ] **A2. 新增 `visitor/src/qiankun/` 目录** — 从 `access/src/qiankun/` 复制 `actions.ts` 与 `communication.ts`,提供 `setActions / getActions / isInQiankun / initGlobalStateListener / destroyGlobalStateListener`
- [ ] **A3. 新增 `visitor/src/hooks/useQiankun.ts`** — 与 `access/src/hooks/useQiankun.ts` 一致,暴露 `inQiankun / goMainApp / navigateTo / goBack / toggleFullscreen / sendMessage / globalState`
- [ ] **A4. 重写 `visitor/src/main.ts`** — 对齐 access/parking:
  - import `setActions / initGlobalStateListener / destroyGlobalStateListener`
  - 用 `isInQiankun()` 替换 `qiankunWindow.__POWERED_BY_QIANKUN__`
  - `mount(props)` 里调 `setActions(props)` + `initGlobalStateListener()`
  - `unmount()` 里调 `destroyGlobalStateListener()`
- [ ] **A5. 重写 `visitor/src/layout/index.vue`** — 由自研 4 套布局统一切换为 `<Layout :showBack="inQiankun" @back="onBack" />`(`onBack = () => goMainApp()`),实现侧栏「← 返回统一门户」按钮。参考 `access/src/layout/index.vue`
- [ ] **A6. 清理 visitor 自研 layout** — 移除 `visitor/src/layout/main/{defaults,classic,transverse,columns}.vue` 及配套的 `component/`、`navBars/`、`navMenu/`、`routerView/`、`footer/`、`lockScreen/`、`logo/`(确认无残留引用后删除)
- [ ] **A7. 同步主题与工具** — 从 access 复制 `themeSkin.ts`、`themeImages.ts`、`themeLayoutIcons.ts`、`themeSidebar.ts`、`resolveComponent.ts` 到 `visitor/src/utils/`,并同步 `visitor/src/theme/config/skin.ts` 与 `theme/index.scss` 的差异
- [ ] **A8. 同步 stores** — 将 `visitor/src/stores/themeConfig.ts` 对齐 access(基于 skin 的主题体系),保留 visitor 模块特有内容
- [ ] **A9. 同步 `App.vue`** — 引入 `applyThemeCssVars / applyThemeMode`,保证主题切换即时生效

## 二、列表页统一改用公共表格组件(`@zhqc-smart/table`)

> 参考实现:`access/src/views/permission/user/index.vue`、`access/src/views/portal/application/index.vue`
> 核心组件:`ConfigurableTableWithForm`(查询表单 + 表格 + 分页一体)、`ConfigurableTable`(仅表格)、`ConfigurableQueryForm`(仅查询表单)

- [ ] **B1. 预约记录** — 重构 `visitor/src/views/visitor/appointment-records/index.vue`,将自研 `<el-table>` + 查询面板替换为 `ConfigurableTableWithForm`,保留:列定义、查询表单字段、分页、操作列、详情弹窗
- [ ] **B2. 通行记录** — 重构 `visitor/src/views/visitor/access-records/index.vue`,同上
- [ ] **B3. 黑名单管理** — 重构 `visitor/src/views/visitor/blacklist/index.vue`,使用 `ConfigurableTableWithForm`,保留"新增/移除"操作及新增弹窗
- [ ] **B4. 访客配置** — 重构 `visitor/src/views/visitor/config/index.vue` 中的设备表格,使用 `ConfigurableTable`(本页无查询面板)
- [ ] **B5. 访客总览** — `visitor/src/views/visitor/overview/index.vue` 统一卡片/图表样式与 access `home/index.vue` 风格一致,复用相同的 `dashboardVars`/主题 CSS 变量,无需表格组件
- [ ] **B6. 园区访客管理说明** — `visitor/src/views/visitor/park-guide/index.vue` 仅做样式微调与栅格对齐

## 三、迁移 access 的「统一门户 + 统一权限」整模块到 visitor

> 来源:`access/src/views/portal/*`、`access/src/views/permission/*`、`access/src/router/mockRoute.ts`、对应的 i18n / mock / type / components

- [ ] **C1. 路由结构** — 在 visitor 中新增 `permission` 与 `portal` 两个一级菜单,并按下列子菜单注册(前端写死或参考 access 的 `mockRoute.ts`):
  - `permission/user`(用户管理)
  - `permission/role`(角色管理)
  - `permission/position`(岗位管理)
  - `permission/space`(空间管理)
  - `permission/organization`(组织管理)
  - `portal/application`(子应用管理)
  - `portal/ai`(AI 工具中心)
  - `portal/category`(应用分类)
  - `portal/workbench`(工作台配置)
- [ ] **C2. 用户管理(permission/user)** — 复制到 `visitor/src/views/permission/user/`:`index.vue`、`userDetail.vue`、`userAuthDialog.vue`、`userEditDialog.vue`、`userResetPwdDialog.vue`、`mock.ts`、`type.ts`、`components/`
- [ ] **C3. 角色管理(permission/role)** — 复制到 `visitor/src/views/permission/role/`:`index.vue`、`components/`(含 `AppRoleTab.vue` 等)、`mock.ts`、`type.ts`
- [ ] **C4. 岗位管理(permission/position)** — 复制到 `visitor/src/views/permission/position/`
- [ ] **C5. 空间管理(permission/space)** — 复制到 `visitor/src/views/permission/space/`
- [ ] **C6. 组织管理(permission/organization)** — 复制到 `visitor/src/views/permission/organization/`(含 `UnifiedOrgView.vue`)
- [ ] **C7. 统一门户 - 子应用管理(portal/application)** — 复制到 `visitor/src/views/portal/application/`
- [ ] **C8. 统一门户 - AI 工具中心(portal/ai)** — 复制到 `visitor/src/views/portal/ai/`(含 `components/ModelsManage.vue` 等)
- [ ] **C9. 统一门户 - 应用分类(portal/category)** — 复制到 `visitor/src/views/portal/category/`
- [ ] **C10. 统一门户 - 工作台配置(portal/workbench)** — 复制到 `visitor/src/views/portal/workbench/`
- [ ] **C11. i18n / mock / api 兼容** — 按 visitor 现有 i18n 目录结构(`i18n/pages` 子目录)接入各模块多语言文本;mock 数据原样保留,**暂不对接后端**
- [ ] **C12. `useThemeOrUserInfo` 钩子** — 因迁移的 user/role 页面会用到,需要复制 `access/src/hooks/useThemeOrUserInfo.ts` 到 visitor

## 四、公共/边角细节

- [ ] **D1. 返回统一门户按钮** — 由 A5 一并实现:子应用在 qiankun 中运行时左侧侧栏顶部出现「← 返回统一门户」,点击后 `goMainApp()` 回到 main-app
- [ ] **D2. 主菜单跳转方式** — 与 access/parking 一致,visitor 默认进入 `/visitor/overview`(已就绪),迁移后侧栏同时展示 visitor 业务菜单 + 统一门户 + 权限菜单
- [ ] **D3. admin 用户/角色页面同步(可选)** — `visitor/src/views/admin/user/{index,personal}.vue` 与 access 版本有差异;若要后台一致,需要同步 `UserAuthDialog.vue`、`userDetail.vue`、`mock.ts`、`type.ts`
- [ ] **D4. theme-images 库(可选)** — access 中存在 `views/theme-images/index.vue` 主题图片库页面,visitor 没有,按需迁移
- [ ] **D5. 登录页对齐** — 检查并对齐 `visitor/src/views/login/index.vue` 与 access 版本的视觉风格
- [ ] **D6. 主应用注册(待确认)** — 如果以上模块要在统一门户中入口可见,需要确认 `main-app` 中是否新增 visitor 子菜单条目

## 五、验收 / 质量保证

- [ ] **E1. `npm install` & `npm run dev`** — visitor 子应用本地启动通过
- [ ] **E2. `npm run lint:eslint`** — eslint 通过
- [ ] **E3. main-app 加载验证** — 在 `main-app` 中以 qiankun 微前端方式加载 visitor,验证侧栏「返回统一门户」按钮、菜单跳转、迁移页面均可正常打开并展示 mock 数据
- [ ] **E4. 截图/录屏** — 在 PR 描述里附带迁移后的页面与样式对比

---

## 待确认问题(动 C 区之前先和用户对一遍)

1. 「统一门户和权限」是否作为 visitor 顶级菜单常驻显示?还是仅在特定角色下显示?
2. visitor 现有的 4 套布局切换成 `@zhqc-smart/layout` 后,是否完全弃用本地 layout?(建议:弃用,与 access/parking 保持一致)
3. visitor 迁移过来的 permission/portal 页面菜单图标(iconfont)是否要重新设计?
4. 顶部 tagsView、面包屑是否完全依赖 `@zhqc-smart/layout` 内置,无需另外定制?
5. 是否同步 access 的「日志管理(log/audit/login/visit/maintenance)」与「set(daemon/menu/operation/systemConfiguration/systemDictionary)」整套配置中心?当前清单未包含,如需要可加入 C 区。

---

## 任务执行历史(每次完成任务在这里追加一条)

> 格式:`YYYY-MM-DD · PR #xx · 任务编号 · 简述`

<!-- 例子:2026-05-19 · PR #1 · 初始化 · 增加 AGENTS.md 与 MIGRATION_TASKS.md -->
