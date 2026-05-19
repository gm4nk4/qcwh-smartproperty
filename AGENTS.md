# AGENTS.md — qcwh-smartproperty 项目说明(给后续 Agent 看)

> **如果你是新接手这个仓库的 Agent,请先完整读完本文件,再读 `visitor/MIGRATION_TASKS.md`,然后再开始工作。**
> **不要再花时间去爬整个项目重新梳理,本文件已包含足够上下文。**

---

## 1. 一句话项目定位

这是一个 **qiankun 微前端** 项目,主应用是 `main-app/`,目前的开发重心是 **visitor 子应用**。其他子应用(`access/`、`parking/`)和公共组件库(`components/`)只是**参考来源**,**不允许修改**。

## 2. 顶层目录与边界

| 目录 | 角色 | 可否改动 | 备注 |
| --- | --- | --- | --- |
| `main-app/` | qiankun 主应用(统一门户) | 可改,但只在确实需要时(例如挂载新子应用、注册菜单) | 改动前请告知用户 |
| `visitor/` | **当前开发主战场**:访客管理子应用 | **必须改** | 所有迁移/样式调整都在这里 |
| `access/` | 参考子应用:门禁/统一门户/权限 | **❌ 严禁修改** | 仅用于参考实现 |
| `parking/` | 参考子应用:停车/能耗/告警 | **❌ 严禁修改** | 仅用于参考实现 |
| `components/` | 公共组件库 `@zhqc-smart/{layout,table,admin,settings,form,login}` | **❌ 严禁修改** | visitor 应通过 `file:` 依赖引入并使用 |

> 这一边界来自仓库根 README.md:**"其他均为参考项目(且不允许更改)"**。任何对 access/parking/components 的改动都会被驳回。

## 3. 技术栈与统一约定

- Vue **3.5.13** + TypeScript **5.6.x** + Vite **5.4.x**
- Element Plus **2.13.x**、Pinia **2.3.x**、vue-router **4.4.x**、vue-i18n **9.14.x**
- qiankun 接入:`vite-plugin-qiankun` + `renderWithQiankun`
- 路径别名:**`/@/`** 指向 `src/`(注意不是 `@/`)
- 样式:Tailwind + SCSS + Element Plus 主题,主题切换走 `themeConfig` store + `themeSkin.ts`
- 代码风格:eslint(`npm run lint:eslint`) + prettier(`npm run prettier`)

## 4. 公共组件库(`components/packages/*`,只能用、不能改)

| 包名 | 路径 | 关键导出 |
| --- | --- | --- |
| `@zhqc-smart/layout` | `components/packages/layout` | `Layout`(整套页面布局,含侧栏/顶栏/tagsView;**支持 `showBack` + `@back` 用于「返回统一门户」按钮**)、`LayoutIframes`、`LayoutLink` |
| `@zhqc-smart/table` | `components/packages/table` | `ConfigurableTableWithForm`(查询表单 + 表格 + 分页一体)、`ConfigurableTable`、`ConfigurableQueryForm`、`TableColumn` / `TableConfig` / `QueryFormConfig` / `Operation` 类型 |
| `@zhqc-smart/admin` | `components/packages/admin` | 后台 client/dept/dict/file/log/menu/param/post/role/token/user 等通用 CRUD 页面 |
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

## 5. qiankun 接入要点(visitor 当前缺这块,要补齐)

参考实现:`access/src/main.ts`、`access/src/qiankun/{actions,communication}.ts`、`access/src/hooks/useQiankun.ts`、`access/src/layout/index.vue`

子应用必须做的事:

1. 在 `src/qiankun/` 下放 `actions.ts` + `communication.ts`,提供 `setActions / getActions / isInQiankun / initGlobalStateListener / destroyGlobalStateListener`。
2. `src/hooks/useQiankun.ts` 暴露 `inQiankun / goMainApp / navigateTo / goBack / toggleFullscreen / sendMessage / globalState`。
3. `src/main.ts` 在 `renderWithQiankun.mount(props)` 中调用 `setActions(props)` 与 `initGlobalStateListener()`,在 `unmount()` 中调用 `destroyGlobalStateListener()`。
4. `src/layout/index.vue` 改用 `import { Layout } from '@zhqc-smart/layout'`,模板写 `<Layout :showBack="inQiankun" @back="onBack" />`,`onBack = () => goMainApp()`。这样左侧栏顶部就会自动显示 **「← 返回统一门户」** 按钮(由公共 layout 内部渲染,见 `components/packages/layout/src/component/aside.vue` 第 10-23 行)。
5. `app.config.globalProperties.baseURL = isQiankun ? VITE_API_URL_QIANKUN : VITE_API_URL`。

## 6. visitor 子应用现状摘要(2026-05 时点)

- **已有的 6 个业务页面**(全部使用模拟数据,**当前阶段不对接后端**):
  - `views/visitor/overview` — 访客总览(卡片 + 趋势图)
  - `views/visitor/appointment-records` — 预约记录
  - `views/visitor/access-records` — 通行记录
  - `views/visitor/blacklist` — 黑名单管理
  - `views/visitor/config` — 访客配置(默认通行公区权限 + 有效期)
  - `views/visitor/park-guide` — 园区访客管理说明
- **现状问题**:
  - 没有引入任何 `@zhqc-smart/*` 公共组件,所有列表页都是自研 `<el-table>` + 自定义查询表单。
  - 自研了 4 套 layout(defaults/classic/transverse/columns),**没有「返回统一门户」按钮**。
  - 缺 qiankun 钩子(`src/qiankun/` 不存在,`hooks/useQiankun.ts` 缺失),`main.ts` 也没有调 `setActions / initGlobalStateListener`。
  - 缺主题工具(`themeSkin.ts`、`themeImages.ts`、`themeLayoutIcons.ts`、`themeSidebar.ts`、`resolveComponent.ts`)。
  - 没有「统一门户」与「权限(用户/角色/岗位/空间/组织)」相关页面。

## 7. 后续工作怎么做 — 看 `visitor/MIGRATION_TASKS.md`

`visitor/MIGRATION_TASKS.md` 是**唯一的任务源**,所有要做的事(以及完成状态)都在那里。

### Agent 必须遵守的工作流

1. **开工前**:打开 `visitor/MIGRATION_TASKS.md`,找到用户指派的任务编号(如 `A1`、`B3`、`C2`),阅读上下文。
2. **执行时**:严格只改动 `visitor/`(必要时改 `main-app/`,但要先和用户确认)。**禁止** 修改 `access/`、`parking/`、`components/` 下的任何文件。
3. **完工后**:**必须** 在同一个 PR 里把对应任务前的 `[ ]` 改成 `[x]`,并在该任务条目正下方追加一行(缩进 2 空格 + `-`)记录 **PR 号 / commit / 主要改动文件**,例如:

```markdown
- [x] **B1. 预约记录** — 重构 ...
  - 2026-05-19, PR #42, 重写 `visitor/src/views/visitor/appointment-records/index.vue`,接入 `ConfigurableTableWithForm`
```

4. 如果发现清单需要新增/删除/拆分任务,在 PR 中一并改 `MIGRATION_TASKS.md`,在 PR 描述里说明改动理由。
5. **永远不要** 自行删掉清单里没完成的任务条目,如果某项判断为不必要,标记为 `~~A1~~`(删除线)并在下方注明原因,让用户决定是否真的去除。

## 8. 本地启动 / 校验

```bash
# 在 visitor/ 目录
npm install      # 首次或依赖变化后
npm run dev      # 启动开发服务器
npm run lint:eslint
npm run build    # 生产构建,迁移大改动后建议跑一次
```

完整体验需要同时跑 `main-app/`(统一门户)+ `visitor/`(子应用),由 main-app 加载 visitor 才能验证「返回统一门户」按钮等 qiankun 行为。

## 9. 给用户的反馈方式

- 所有改动走 PR,PR 描述里贴出本次完成的任务编号、勾选状态变化。
- 涉及视觉的改动(列表页样式、布局)在 PR 描述里附 **截图或录屏**。
- 任何与 access/parking/components 行为偏离的设计选择,需要先在 PR 评论或消息里向用户说明并确认。

---

**最后再强调一次**:
- ❌ 不要改 `access/`、`parking/`、`components/`。
- ✅ 只改 `visitor/`(必要时 `main-app/`,先确认)。
- ✅ 完成任务后必须更新 `visitor/MIGRATION_TASKS.md`。
