# AGENTS.md — qcwh-smartproperty 项目说明(给后续 Agent 看)

> **如果你是新接手这个仓库的 Agent,请先完整读完本文件,再读 `visitor/MIGRATION_TASKS.md`,然后再开始工作。**
> **不要再花时间去爬整个项目重新梳理,本文件已包含足够上下文。**
> **`visitor/MIGRATION_TASKS.md` 是多 Agent 并行执行专门设计的**,Agent 之间通过 Owns 文件清单 + Phase 分阶段避开冲突,具体规则在那份文件的「并行执行守则」一节。

---

## 1. 一句话项目定位

这是一个 **qiankun 微前端** 项目,主应用是 `main-app/`,目前开发重心是 **visitor 子应用**。其他子应用(`access/`、`parking/`)和公共组件库(`components/`)只是**参考来源**,**不允许修改**。

## 2. 顶层目录与边界

| 目录 | 角色 | 可否改动 | 备注 |
| --- | --- | --- | --- |
| `main-app/` | qiankun 主应用(统一门户) | 可改,但只在确实需要时(挂载新子应用、注册菜单) | 改动前请告知用户 |
| `visitor/` | **当前开发主战场**:访客管理子应用 | **必须改** | 所有迁移/样式调整都在这里;按 `visitor/MIGRATION_TASKS.md` 的 Phase/Track 推进 |
| `access/` | 参考子应用:门禁/统一门户/权限 | **❌ 严禁修改** | 仅用于参考实现 |
| `parking/` | 参考子应用:停车/能耗/告警 | **❌ 严禁修改** | 仅用于参考实现 |
| `components/` | 公共组件库 `@zhqc-smart/{layout,table,admin,settings,form,login}` | 可改,只在必须改时更改,且与用户沟通 | visitor 通过 `file:` 依赖引入使用 |

> 这一边界来自仓库根 README.md:**"其他均为参考项目(且不允许更改)"**。任何对 access/parking 的改动都会被驳回。

## 3. 多 Agent 并行工作模型(核心)

`visitor/MIGRATION_TASKS.md` 把所有改造工作组织成 **3 个 Phase**:

| Phase | 并发模式 | 内容概要 |
| --- | --- | --- |
| **Phase 0** | 单 Agent 串行 | 打基础:引入公共组件 + qiankun 接入 + Layout + 主题工具 + **一次性加完所有占位路由** + 清理旧 layout |
| **Phase 1** | **多 Agent 并行**(3 条 Track) | Track-B 列表页改造、Track-C 「统一门户+权限」模块迁移、Track-D 边角 |
| **Phase 2** | 单 Agent 串行 | i18n 收口、main-app 联调、最终 lint/build、截图录屏 |

**每个任务都有 4 字段**:`Owns`(允许改的文件清单)、`依赖`(必须先完成的任务 ID)、`状态`、`历史`。Agent 严格按 Owns 边界工作,章节互相独立 → git 自动合并基本无冲突。

### 关键防冲突约定(违反就会和别人撞 PR)

| 公共文件 | 规则 |
| --- | --- |
| `visitor/package.json` | Phase 0 后冻结 |
| `visitor/src/router/route.ts` | Phase 0 一次性加完所有路由占位;Phase 1 任务**不改 route.ts**,只写自己 Owns 目录内的 component |
| `visitor/src/i18n/lang/*.ts` | Phase 2 统一收口;Phase 1 任务写模块内独立 i18n 文件 |
| `visitor/src/stores/**`、`visitor/src/utils/**` | Phase 0 后冻结 |
| `visitor/MIGRATION_TASKS.md` | 每个 PR 只改本任务章节的 `状态` + `历史` |
| `AGENTS.md`(本文件) | 不改,除非任务就是改它 |

### 分支与 PR 命名

- 分支:`devin/<unix-timestamp>-<TASK_ID>-<slug>`,例 `devin/1700000000-B3-blacklist-refactor`
- PR 标题前缀:`[<TASK_ID>] ` 例 `[B3] visitor 黑名单页接入 ConfigurableTableWithForm`
- **每 PR 只一个任务 ID**

## 4. 技术栈与统一约定

- Vue **3.5.13** + TypeScript **5.6.x** + Vite **5.4.x**
- Element Plus **2.13.x**、Pinia **2.3.x**、vue-router **4.4.x**、vue-i18n **9.14.x**
- qiankun 接入:`vite-plugin-qiankun` + `renderWithQiankun`
- 路径别名:**`/@/`** 指向 `src/`(不是 `@/`)
- 样式:Tailwind + SCSS + Element Plus,主题切换走 `themeConfig` store + `themeSkin.ts`
- 代码风格:eslint(`npm run lint:eslint`) + prettier(`npm run prettier`)

## 5. 公共组件库(`components/packages/*`,只能用、不能改)

| 包名 | 路径 | 关键导出 |
| --- | --- | --- |
| `@zhqc-smart/layout` | `components/packages/layout` | `Layout`(整套页面布局,**支持 `showBack` + `@back` 用于「返回统一门户」按钮**)、`LayoutIframes`、`LayoutLink` |
| `@zhqc-smart/table` | `components/packages/table` | `ConfigurableTableWithForm`、`ConfigurableTable`、`ConfigurableQueryForm` 及 `TableColumn / TableConfig / QueryFormConfig / Operation` 类型 |
| `@zhqc-smart/admin` | `components/packages/admin` | 后台 client/dept/dict/file/log/menu/param/post/role/token/user CRUD 页面 |
| `@zhqc-smart/settings` | `components/packages/settings` | 系统配置中心(daemon/menu/operation/systemConfiguration/systemDictionary) |
| `@zhqc-smart/login` | `components/packages/login` | 登录页 |
| `@zhqc-smart/form` | `components/packages/form` | 配置化表单 |

引入方式(参考 `access/package.json` 与 `parking/package.json`):

```json
"dependencies": {
  "@zhqc-smart/layout":   "file:../components/packages/layout",
  "@zhqc-smart/table":    "file:../components/packages/table",
  "@zhqc-smart/admin":    "file:../components/packages/admin",
  "@zhqc-smart/settings": "file:../components/packages/settings"
}
```

## 6. qiankun 接入要点(visitor 当前缺这块,P0-2/P0-3 补齐)

参考实现:`access/src/main.ts`、`access/src/qiankun/{actions,communication}.ts`、`access/src/hooks/useQiankun.ts`、`access/src/layout/index.vue`

子应用必须做的事:

1. 在 `src/qiankun/` 下放 `actions.ts` + `communication.ts`,提供 `setActions / getActions / isInQiankun / initGlobalStateListener / destroyGlobalStateListener`。
2. `src/hooks/useQiankun.ts` 暴露 `inQiankun / goMainApp / navigateTo / goBack / toggleFullscreen / sendMessage / globalState`。
3. `src/main.ts` 在 `renderWithQiankun.mount(props)` 中调 `setActions(props)` 与 `initGlobalStateListener()`,`unmount()` 中调 `destroyGlobalStateListener()`。
4. `src/layout/index.vue` 改用 `import { Layout } from '@zhqc-smart/layout'`,模板 `<Layout :showBack="inQiankun" @back="onBack" />`,`onBack = () => goMainApp()`。这样左侧栏顶部会自动出现 **「← 返回统一门户」** 按钮(由公共 layout 内部渲染,见 `components/packages/layout/src/component/aside.vue` 10-23 行)。
5. `app.config.globalProperties.baseURL = isQiankun ? VITE_API_URL_QIANKUN : VITE_API_URL`。

## 7. visitor 子应用现状摘要(2026-05 时点)

- **6 个业务页面**(使用模拟数据,当前阶段不对接后端):
  - `views/visitor/overview` — 访客总览
  - `views/visitor/appointment-records` — 预约记录
  - `views/visitor/access-records` — 通行记录
  - `views/visitor/blacklist` — 黑名单管理
  - `views/visitor/config` — 访客配置
  - `views/visitor/park-guide` — 园区访客管理说明
- **现状问题**(全部由 Phase 0 / Phase 1 解决):
  - 未引入任何 `@zhqc-smart/*` 公共组件,所有列表页都是自研 `<el-table>` + 自定义查询表单
  - 自研 4 套 layout,**没有「返回统一门户」按钮**
  - 缺 qiankun 钩子(`src/qiankun/` 不存在,`hooks/useQiankun.ts` 缺失)
  - 缺主题工具(`themeSkin.ts`、`themeImages.ts`、`themeLayoutIcons.ts`、`themeSidebar.ts`、`resolveComponent.ts`)
  - 没有「统一门户」与「权限(用户/角色/岗位/空间/组织)」相关页面

## 8. Agent 工作流硬性规则(违反会被驳回)

1. **开工前**:打开 `visitor/MIGRATION_TASKS.md`,找到用户指派的任务 ID(如 `P0-1`、`B3`、`C2`),阅读该任务的 **Owns / 依赖 / 内容**。
2. **检查依赖**:任务的 `依赖` 字段列出的所有任务**必须已 done 并合并到 main**,否则不要开工(在 message 中告知用户)。
3. **执行时**:
   - 严格只改 **该任务 Owns 字段** 中列出的文件
   - 若发现需要改 Owns 外的文件,**停下来**先在消息里向用户说明,绝不"顺手"改其它东西
   - 禁止修改 `access/`、`parking/`、`components/` 下任何文件
4. **完工时**:
   - 把对应任务章节的 `状态` 从 `☐ pending` → `☑ done (PR #x, YYYY-MM-DD)`
   - 在该任务章节的 `历史` 段追加一行:`- YYYY-MM-DD PR #x 简述`
   - **不要动其它任务的章节**
5. **PR**:标题以 `[<TASK_ID>] ` 开头,描述里附 Owns 文件清单与视觉改动截图。

## 9. 本地启动 / 校验

```bash
# 在 visitor/ 目录
npm install      # 首次或依赖变化后
npm run dev      # 启动开发服务器
npm run lint:eslint
npm run build    # 大改动后建议跑一次
```

完整体验需要同时跑 `main-app/`(统一门户)+ `visitor/`(子应用),由 main-app 加载 visitor 才能验证「返回统一门户」按钮等 qiankun 行为。

---

**最后再强调一次**:
- ❌ 不要改 `access/`、`parking/`、`components/`。
- ✅ 只改 `visitor/`(必要时 `main-app/`,先确认)。
- ✅ 完成任务后必须更新 `visitor/MIGRATION_TASKS.md` 本任务章节的 `状态` + `历史`,不动别人章节。
- ✅ 按 Phase 推进,Phase 1 多 Agent 并行时严格守 Owns 边界。
