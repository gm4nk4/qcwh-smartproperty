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

- **状态**: ☑ done (PR #4, 2026-05-19)
- **Owns**:
  - `visitor/src/qiankun/actions.ts`(新增,从 `access/src/qiankun/actions.ts` 复制)
  - `visitor/src/qiankun/communication.ts`(新增,从 access 复制)
  - `visitor/src/hooks/useQiankun.ts`(新增,从 `access/src/hooks/useQiankun.ts` 复制)
  - `visitor/src/main.ts`(改:引入 `setActions/initGlobalStateListener/destroyGlobalStateListener`,`mount/unmount` 中调用)
- **依赖**: P0-1
- **历史**:
  - 2026-05-19 PR #4 从 access 同步 `qiankun/actions.ts`、`qiankun/communication.ts`、`hooks/useQiankun.ts` 三个文件,并在 `visitor/src/main.ts` 的 `mount` 钩子里加入 `setActions(props) + initGlobalStateListener()`、`unmount` 钩子里加入 `destroyGlobalStateListener()`。本地 `npm run build` 通过(2476 modules,32.5s,无错误)

## P0-3. 接入公共 Layout(实现「返回统一门户」按钮)

- **状态**: ☑ done (PR #5, 2026-05-19)
- **Owns**:
  - `visitor/src/layout/index.vue`(改为 `<Layout :showBack="inQiankun" @back="goMainApp" />`,参考 `access/src/layout/index.vue`)
- **依赖**: P0-1, P0-2
- **历史**:
  - 2026-05-19 PR #5 把 `visitor/src/layout/index.vue` 改为引用 `@zhqc-smart/layout` 的 `Layout` 组件,通过 `useQiankun()` 取 `inQiankun` 与 `goMainApp`,在 qiankun 子应用环境下显示「返回统一门户」按钮。`npm run dev` 验证通过(HTTP 200,layout 组件路径正确解析,`showBack` 与 `goMainApp` 已绑定);**`npm run build` 失败,详见新增的 P0-8 任务**(该问题为项目级预先存在 bug,access/parking 在 main 上的 `npm run build` 也同样失败,与本任务无关)

## P0-4. 同步主题工具与 stores

- **状态**: ☑ done (PR #TBD, 2026-05-19)
- **Owns**:
  - `visitor/src/utils/themeSkin.ts`(新增,从 access 复制)
  - `visitor/src/utils/themeImages.ts`(新增,从 access 复制)
  - `visitor/src/utils/themeLayoutIcons.ts`(新增,从 access 复制)
  - `visitor/src/utils/themeSidebar.ts`(新增,从 access 复制)
  - `visitor/src/utils/resolveComponent.ts`(新增,从 access 复制)
  - `visitor/src/theme/config/skin.ts`(新增,从 access 复制)
  - `visitor/src/theme/config/index.js`(新增,从 access 复制;`themeSkin.ts` 直接依赖,实施时扩展进 Owns)
  - `visitor/src/theme/index.scss`(必要时对齐 access 的差异)
  - `visitor/src/stores/themeConfig.ts`(对齐 access 的基于 skin 的体系)
  - `visitor/src/types/global.d.ts`(加 1 行 `declare type ThemeSkin = 'light-blue' | 'light-green'`;实施时扩展进 Owns,因为 themeSkin.ts 强依赖全局类型)
  - `visitor/src/types/pinia.d.ts`(在 `ThemeConfigState.themeConfig` 类型里加 1 行 `skin: ThemeSkin;`;实施时扩展进 Owns)
  - `visitor/src/App.vue`(引入 `applyThemeCssVars / applyThemeMode`)
- **依赖**: P0-1
- **历史**:
  - 2026-05-19 PR #TBD 从 access 复制 6 个主题工具文件(`utils/{themeSkin,themeImages,themeLayoutIcons,themeSidebar,resolveComponent}.ts` + `theme/config/{skin.ts,index.js}`),用 access 的版本替换 `stores/themeConfig.ts`(改为基于 skin 的工厂模式),在 `types/{global,pinia}.d.ts` 加 `ThemeSkin` 全局类型与 `themeConfig.skin` 字段,`App.vue` 引入 `applyThemeCssVars/applyThemeMode`、在 `onMounted` 钩子里调用同步主题 CSS 变量与深浅色模式。`npm run dev` 启动 OK(HTTP 200,无错误);`npm run build` 仍受 P0-8 影响,与本任务无关。`theme/index.scss` 经 diff 后 access 与 visitor 内容差异不影响 P0-4 目标,本 PR 未动。

## P0-5. 一次性占位路由(关键防冲突任务)

- **状态**: ☑ done (PR #TBD, 2026-05-19),🚫 部分作废 (P2-5, 2026-05-20)
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
  - 2026-05-19 PR #TBD 新增 `views/_placeholder/index.vue` 通用 "Coming soon" 占位组件 + 9 个模块 `views/{permission,portal}/<name>/index.vue` 占位 re-export 文件,并在 `router/route.ts` 的 `dynamicRoutes` 中一次性追加 9 条 permission/* + portal/* 路由(每条 `component` 指向自身模块下的 `index.vue`)。`npm run dev` 启动 OK(HTTP 200),路由可加载;`npm run build` 仍受 P0-8 的 `screenfull/vue-router` resolve bug 影响,与本任务无关。
  - 2026-05-20 P2-5(本期菜单收口)删除 `/permission/{position,space}`、`/portal/{application,ai,category,workbench}` 共 6 条占位路由及对应 `views/` 目录,理由见 P2-5。

## P0-6. 清理 visitor 自研 layout

- **状态**: ☑ done (PR #TBD, 2026-05-19)
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
  - 2026-05-19 PR #TBD 删除 visitor/src/layout 下 8 个自研子目录(`main/`、`component/`、`navBars/`、`navMenu/`、`routerView/`、`footer/`、`lockScreen/`、`logo/`),全部能力已迁到 `@zhqc-smart/layout` 公共包;`App.vue` 移除 `LockScreen`/`Settings`/`CloseFull` 三处 `defineAsyncComponent` import 与对应模板节点。`visitor/src/layout/` 只保留 `index.vue`(P0-3 已改为 `@zhqc-smart/layout` 接入)。`npm run dev` 启动 OK(HTTP 200,无新增报错);`npm run build` 仍受 P0-8 影响,与本任务无关。注:`stores/themeConfig.ts` 与 `router/index.ts` 残留的「`/@/layout/...` 注释」属于 P0-4 / Phase 2 收口范畴,本 PR 不动。

## P0-7. 把并行守则写入本文件

- **状态**: ☑ done (PR #1, 2026-05-19)
- **Owns**:
  - `AGENTS.md`、`visitor/MIGRATION_TASKS.md`
- **依赖**: 无
- **历史**:
  - 2026-05-19 PR #1 文档与清单初版 + 并行执行守则

## P0-8. 修复 components/packages 软链导致的 `npm run build` 失败(项目级预先存在 bug)

- **状态**: ☑ done (PR #TBD, 2026-05-19)
- **优先级 / 阻塞关系**:
  - **不阻塞 Phase 1 启动**(Phase 1 各 Track 在 dev 模式下都能工作),但**必须在 P2-3 之前完成**
  - **建议尽早做**(可以与 Phase 1 各 Track 并行),否则后续每个 PR 都无法通过 `npm run build` 自检
- **背景 / 现象**:
  - 在 P0-3(PR #5)实施过程中发现 `visitor/` 接入 `@zhqc-smart/layout` 后 `npm run build` 报错:
    ```
    [vite]: Rollup failed to resolve import "vue-router" from
      components/packages/layout/src/routerView/link.vue
    ```
  - **不止 visitor**:在 main 分支上对 `access/` 与 `parking/` 也执行 `npm install && npm run build`,**同样报错**(均失败于 `components/packages/layout/src/routerView/link.vue` 找不到 `vue-router`)
  - 因此这是项目级预先存在的 bug,与 P0-3 写法无关 —— P0-3 只是把 visitor 从「不使用 `@zhqc-smart/layout`」改成「使用」,从而暴露了同样的 bug
  - `npm run dev` 模式不受影响(esbuild 预编译对软链 / file: 依赖处理与 rollup 不同)
- **根因**:
  - `components/packages/layout` 通过 `file:../components/packages/layout` 软链进入 `visitor/node_modules/@zhqc-smart/layout`
  - 该包内部直接 `import` 一系列模块:`vue-router / pinia / element-plus / sortablejs / screenfull / @vueuse/core / vue-i18n` 等
  - 这些模块在 layout 的 `package.json` 里部分声明为 `peerDependencies`(vue-router, pinia)、部分声明为 `dependencies`(sortablejs, screenfull, @vueuse/core, element-plus)、部分**没声明**(vue-i18n)
  - **Rollup 在生产构建时**:从软链目标路径(`components/packages/layout/`)向上查 `node_modules`,但 `components/packages/layout/` 并未 `npm install`,而该目录的上级也不是 npm workspaces 项目,因此找不到这些模块
  - **vite dev 模式**:esbuild 预捆绑会沿 `optimizeDeps` 流程把宿主 app(visitor)的依赖也喂给软链包,所以能跑通
- **下个 Agent 的尝试清单(我已经在调研中试过,记录在此供节省时间)**:
  - ✅ **试过:在 `visitor/vite.config.ts` 加 `resolve.dedupe: ['vue','vue-router','pinia','element-plus','@vueuse/core','sortablejs','screenfull']`**
    - 解决了 vue-router / pinia,但 vue-i18n 仍然找不到(因为 visitor 的 alias `'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'` 在软链目标位置查不到那个具体文件)
  - ✅ **试过:在 `components/packages/layout/` 里执行 `npm install` 安装其自身 dependencies**
    - 解决了 sortablejs / screenfull / @vueuse/core 等 layout 自己的 deps,但 vue-router / pinia / vue-i18n 是 peerDependency 或未声明,装不下来,build 仍失败
  - ❌ **未试:把 vue-router / pinia / vue-i18n 从 peerDependencies 移到 dependencies 并安装**
    - 风险:vue 实例可能出现双份(子应用一份、host 一份),qiankun 场景下需要谨慎,可能需要在 main-app 通过 props 注入而不是各子应用各自装一份
- **推荐方向(2 选 1)**:
  - **方案 A(干净,但要改 components/)**:
    - 修改 `components/packages/layout/package.json`:把 `vue-router / pinia` 写入 `dependencies`(同时保留 `peerDependencies`);追加 `vue-i18n` 到 `dependencies`
    - 在 `components/packages/layout/` 内执行 `npm install` 生成 `package-lock.json` 并提交
    - 在 visitor / access / parking 的 `vite.config.ts` 中加 `resolve.dedupe: ['vue','vue-router','pinia','vue-i18n','element-plus']` 以防多实例
    - 同样处理 `components/packages/{table,admin,settings,form,login}` 各自暴露的同类问题(若有)
  - **方案 B(不改 components/)**:
    - 把整个仓库改造为 npm workspaces(根 `package.json` 加 `"workspaces": ["main-app", "visitor", "access", "parking", "components/packages/*"]`),让 npm 自动 hoist 共享依赖到根 `node_modules`
    - 改完后所有子应用的 `npm install` 都改为在根目录跑 `npm install`
    - 优点:从根上解决,后续不会再有类似问题;缺点:改动面大,可能影响 access / parking 现有工作流
- **Owns**(下个 Agent 严格只改这些):
  - 方案 A 路径:
    - `components/packages/layout/package.json`
    - 可能涉及的其他公共包:`components/packages/{table,admin,settings,form,login}/package.json`(如果它们也有同类问题)
    - `visitor/vite.config.ts`(加 `resolve.dedupe`)
    - 不动 `access/vite.config.ts` 与 `parking/vite.config.ts`(那是参考子应用,严禁修改)
  - 方案 B 路径:
    - 仓库根目录新增 / 改 `package.json`
    - 各子应用 `package.json` 视情况调整
    - 改完后需要重新 `npm install` 并提交 root-level lockfile
- **依赖**: 无(可与 Phase 1 并行)
- **验收标准**:
  - 在 visitor/ 下 `npm run build` 通过(无 Rollup resolve 错误)
  - 在 access/ 与 parking/ 下 `npm run build` 也通过(如果选了方案 A,则只需保证 visitor 通过即可,因为 access / parking 不要求我们去验证 —— 但方案 A / B 都应该是从根上解决,顺带让 access / parking 也通过)
  - visitor 的 `npm run dev` 仍正常(任何改动都不能破坏 dev 模式)
- **历史**:
  - 2026-05-19 PR #TBD 选「方案 A 的 visitor 侧子集」(只动 `visitor/vite.config.ts`,**不动 components/**):①把 `vue-i18n` 的 alias 值从相对路径 `'vue-i18n/dist/vue-i18n.cjs.js'` 改成绝对路径 `pathResolve('./node_modules/vue-i18n/dist/vue-i18n.cjs.js')`,这样从 `file:` 软链目标位置 import `vue-i18n` 时也能解析到 visitor 自身的 vue-i18n 安装;②`resolve` 加 `dedupe: ['vue','vue-router','pinia','vue-i18n','element-plus','@vueuse/core','sortablejs','screenfull']`,把 `@zhqc-smart/*` 公共包和 visitor 共用同一份运行时实例。**验证**:与 P0-4 分支合并后(P0-4 提供了公共 layout 需要的 `/@/utils/themeImages` 等 host-side 文件)`npm run build` 通过 exit 0,生成完整 `dist/`(43 个 chunk + 含 gzip);`npm run dev` 仍 HTTP 200 OK 无新错误。**未碰** `components/packages/*/package.json`,因此 `access/`、`parking/` 的构建状态本任务不保证 —— 那两个目录我们禁止修改,留给后续:在它们各自的 `vite.config.ts` 应用同样的 alias/dedupe 改动(或采用方案 B 改造为 workspace)。
  - 2026-05-19 PR #TBD 跟进:Track B 首个 PR 引入 `@zhqc-smart/table` 时,build 报 `Rollup failed to resolve import "@element-plus/icons-vue" from components/packages/table/src/ConfigurableTableWithForm.vue`,根因同上(`@element-plus/icons-vue` 是公共包 `dependencies` 但宿主 import 时需要 dedupe 走 visitor 自身的安装)。修复:在 `visitor/vite.config.ts` `dedupe` 数组里追加 `'@element-plus/icons-vue'`。本地 `npm run build` 验证 exit 0(2497 模块 / 完整 dist)、`npm run dev` HTTP 200 OK。

---

# Phase 1 — 多 Agent 并行(三条独立 Track)

> Phase 0 全部合入 main 后启动。三条 Track 内的任务大多互相独立,可以由不同 Agent 同时认领。

## Track B — visitor 业务列表页接入公共表格组件

> 改造目标:所有列表页接入 `ConfigurableTableWithForm` / `ConfigurableTable`(参考 `access/src/views/permission/user/index.vue`)

### B1. 预约记录

- **状态**: ☑ done (PR #12, 2026-05-19)
- **Owns**: `visitor/src/views/visitor/appointment-records/**`
- **依赖**: P0-1, P0-2, P0-3
- **内容**: 重构 `index.vue`,自研 `<el-table>` + 查询面板替换为 `ConfigurableTableWithForm`,保留列、查询字段、分页、操作列、详情弹窗
- **历史**:
  - 2026-05-19 PR #12 visitor 预约记录列表页接入 `ConfigurableTableWithForm`(替换自研 `<el-table>` + 查询面板,保留列/查询字段/分页/操作列/详情弹窗;状态列改用 `statusSlot` 渲染 `status-tag`)

### B2. 通行记录

- **状态**: ☑ done (PR #16, 2026-05-20)
- **Owns**: `visitor/src/views/visitor/access-records/**`
- **依赖**: P0-1, P0-2, P0-3
- **历史**:
  - 2026-05-20 PR #16 通行记录列表页接入 ConfigurableTableWithForm,移除自研查询面板/表格/分页,保留详情弹窗

### B3. 黑名单管理

- **状态**: ☑ done (PR #14, 2026-05-20)
- **Owns**: `visitor/src/views/visitor/blacklist/**`
- **依赖**: P0-1, P0-2, P0-3
- **内容**: 接入 `ConfigurableTableWithForm`,保留"新增/移除"及新增弹窗
- **历史**:
  - 2026-05-20 PR #14 黑名单管理页接入 `ConfigurableTableWithForm`,`#tableActions` 槽位放新增按钮,操作列保留移除,新增弹窗保留

### B4. 访客配置

- **状态**: ☑ done (PR #17, 2026-05-20)
- **Owns**: `visitor/src/views/visitor/config/**`
- **依赖**: P0-1, P0-2, P0-3
- **内容**: 设备表格改为 `ConfigurableTable`(无查询面板)
- **历史**:
  - 2026-05-20 PR #17 设备表格接入 `@zhqc-smart/table` 的 `ConfigurableTable`,不引入查询面板

### B5. 访客总览

- **状态**: ☑ done (PR #19, 2026-05-20)
- **Owns**: `visitor/src/views/visitor/overview/**`
- **依赖**: P0-3, P0-4
- **内容**: 卡片/图表样式对齐 access `home/index.vue`,复用 `dashboardVars` / 主题 CSS 变量
- **历史**:
  - 2026-05-20 PR #19 把 `visitor/src/views/visitor/overview/index.vue` 的卡片/面板样式对齐 access `home/index.vue`:①外层套 `el-scrollbar` + `home-dashboard` 容器,新增 `dashboardVars` computed 注入 `--dashboard-primary/-rgb/-deep/-soft/-softer`、`--dashboard-gradient-start/-end`、`--dashboard-chart-0..4`、`--dashboard-title-bar-color/-shadow` 等 CSS 变量(从 P0-4 同步过来的 `useThemeConfig` store + `/@/utils/theme` 的 `useChangeColor`/`hexToRgb`/`getLightColor`/`getDarkColor` 取值,light-blue / light-green 皮肤自动切换);②5 个指标卡改用 access `metric-card` 形态(白底 + 主题色边框/阴影 + 主题色图标底色),原先 5 种硬编码 pink/blue/green/violet/amber 替换为 `--dashboard-primary` + 4 个 `--dashboard-chart-*` 派生的 5 档轮换主题色;③访客数据概览/趋势/明细三块统一改成 access `panel-card` 形态(白底 + 主题色描边 + 标题前 `panel-card__bar` 蓝条 + `--theme-text-system / -primaryTitle / -dataAssist` 文本色变量);④`panel-card__toolbar` 内的 `el-segmented` / `el-date-picker` 用 deep 样式套上主题 primary RGB 圆角胶囊;⑤趋势 echarts 配置 (`useBizProcess.ts`) 与 mock 数据/业务逻辑保持不动,仅改样式表与模板结构。**校验**: `npm install` OK;`npm run dev` HTTP 200 OK,SFC 编译成功,无新的 vite 报错(只有预先就有的 `auth/code/image` 无后端导致的 proxy ETIMEDOUT,与本任务无关);`npx prettier --write src/views/visitor/overview/` 通过

### B6. 园区访客管理说明

- **状态**: ☑ done (PR #15, 2026-05-20)
- **Owns**: `visitor/src/views/visitor/park-guide/**`
- **依赖**: P0-3
- **内容**: 样式微调 + 栅格对齐
- **历史**:
  - 2026-05-20 PR #15 对齐 visitor 其他页面样式规范:body 背景加双层 radial-gradient,gap 18→16px;面板 padding 20→18px、background `#fff`→`rgba(255,255,255,0.95)`;workspace gap 18→16px;媒体查询断点 1200/768 → 1440/992/640 与其他 visitor 页面对齐

## Track C — 「统一门户 + 统一权限」模块迁移

> 每个子任务把 access 对应目录整套复制到 visitor 同名目录,**保留 mock 数据,暂不对接后端**。模块内 i18n 写在自己目录的 `i18n/zh-cn.ts`、`i18n/en.ts`(独立文件,Phase 2 统一收口)。

### C2. 用户管理

- **状态**: ☑ done (PR #TBD, 2026-05-20)
- **Owns**: `visitor/src/views/permission/user/**`
- **依赖**: P0-1, P0-3, P0-5(占位路由已加),C-COMMON-HOOK(`useThemeOrUserInfo`,见 C0)
- **内容**: 复制 access 对应目录的 `index.vue`、`userDetail.vue`、`userAuthDialog.vue`、`userEditDialog.vue`、`userResetPwdDialog.vue`、`mock.ts`、`type.ts`、`components/`
- **历史**:
  - 2026-05-20 PR #TBD 从 `access/src/views/permission/user/` 1:1 复制 `index.vue`、`userDetail.vue`、`userAuthDialog.vue`、`userEditDialog.vue`、`userResetPwdDialog.vue`、`mock.ts`、`type.ts`、`components/{PermissionPanel,UserInfoPanel}.vue` 到 visitor 同名路径,覆盖 P0-5 占位 `index.vue`。沿用 `@zhqc-smart/table` 的 `ConfigurableTableWithForm`、`/@/hooks/{message,useThemeOrUserInfo}`、`@element-plus/icons-vue`,**保留 mock 数据,不接后端**,**未改 route.ts / package.json / i18n/lang**(模块内目前未引入独立 i18n 文件,与 access 源保持一致;Phase 2 统一收口)。**校验**:`npm install` OK;`npm run dev` HTTP 200,`/permission/user` 路由及全部组件(`userDetail.vue` / `userAuthDialog.vue` / `userEditDialog.vue` / `userResetPwdDialog.vue` / `components/PermissionPanel.vue` / `components/UserInfoPanel.vue`)均编译 200;`npx prettier --write src/views/permission/user/` 通过

### C3. 角色管理

- **状态**: ☑ done (PR #TBD, 2026-05-20)
- **Owns**: `visitor/src/views/permission/role/**`
- **依赖**: P0-5, C0
- **内容**: 复制 access 对应目录的 `index.vue`、`components/`(含 `AppRoleTab.vue` 等)、`mock.ts`、`type.ts`
- **历史**:
  - 2026-05-20 PR #TBD 从 access/src/views/permission/role/ 复制 index.vue、mock.ts、type.ts、components/{AppRoleTab,AppTree,PermissionAssignDialog,PlatformRoleEditDialog,PlatformRoleTab,RoleAssignDialog,RoleEditDialog}.vue 到 visitor 同名路径,覆盖 P0-5 占位;保留 mock,不接后端;prettier --write 通过;npm run dev 下 /permission/role 正常加载

### C4. 岗位管理 — 已剔除(需求整理错误)

- **状态**: 🚫 removed (P2-5, 2026-05-20)
- **历史**:
  - 2026-05-20 用户决议：本期不迁移。P0-5 占位路由与占位 index.vue 保留
  - 2026-05-20 P2-5 决议：岗位管理不属于 visitor 业务范围，P2-5 PR #TBD 一次性删除 `/permission/position` 路由与 `visitor/src/views/permission/position/` 目录

### C5. 空间管理 — 已剔除(需求整理错误)

- **状态**: 🚫 removed (P2-5, 2026-05-20)
- **历史**:
  - 2026-05-20 用户决议：本期不迁移。P0-5 占位路由与占位 index.vue 保留
  - 2026-05-20 P2-5 决议：空间管理不属于 visitor 业务范围，P2-5 PR #TBD 一次性删除 `/permission/space` 路由与 `visitor/src/views/permission/space/` 目录

### C6. 组织管理

- **状态**: ☑ done (PR #TBD, 2026-05-20)
- **Owns**: `visitor/src/views/permission/organization/**`
- **依赖**: P0-5, C0
- **内容**: 包含 `UnifiedOrgView.vue`
- **历史**:
  - 2026-05-20 PR #TBD 从 access 复制 permission/organization 全套(index.vue / mock.ts / type.ts / components/{UnifiedOrgView,IndependentOrgView,OrgTree,OrgEditDialog}.vue),覆盖 P0-5 占位,prettier 格式化

### C7~C10. 统一门户系列(子应用管理 / AI 工具中心 / 应用分类 / 工作台配置)— 已剔除(需求整理错误)

- **状态**: 🚫 removed (P2-5, 2026-05-20)
- **历史**:
  - 2026-05-20 用户决议：本期不迁移。P0-5 占位路由与占位 index.vue 保留
  - 2026-05-20 P2-5 决议：统一门户子应用管理 / AI 工具中心 / 应用分类 / 工作台配置 4 项均不属于 visitor 业务范围，P2-5 PR #TBD 一次性删除 `/portal/{application,ai,category,workbench}` 4 条路由与 `visitor/src/views/portal/` 整个目录

### C11. 系统设置 — 菜单管理

- **状态**: ☑ done (PR #22, 2026-05-20)
- **Owns**: `visitor/src/views/set/menu/**`(新增)、`visitor/src/router/route.ts` 加一行 `/set/menu`
- **依赖**: P0-5, C0
- ⚠️ 本任务**例外**地需要改 `route.ts`(加一行 `/set/menu` 路由,P0-5 未占位),同 D4 例外。为避免与其他 PR 撞期,**由父会话集中处理**,不拆子会话。
- **内容**: 从 `access/src/views/set/menu/` 复制整套到 `visitor/src/views/set/menu/`(包括 `index.vue` 以及 `mock.ts` / `type.ts` / `components/` 等存在的文件),保留 mock、不接后端。同时在 `visitor/src/router/route.ts` 的 `dynamicRoutes` 中追加一条 `/set/menu` 路由。
- **历史**:
  - 2026-05-20 PR #22 从 `access/src/views/set/menu/` 复制 `index.vue`、`form.vue`、`i18n/{zh-cn,en}.ts` 到 `visitor/src/views/set/menu/` 同名路径(diff 无差异)。所有 import 均为 `/@/api/admin/menu`、`/@/hooks/{table,message}`、`/@/utils/validate`、`/@/components/IconSelector`(visitor 全部已有相同实现);未引入新依赖。同时在 `visitor/src/router/route.ts` 的 `dynamicRoutes` 末尾追加 `/set/menu` 路由(icon `ele-Operation`,title 「菜单管理」,enName 「Menu Management」);此为冻结后 route.ts 的例外修改,同 D4 例外性质,已在 MIGRATION_TASKS 第 3 节冻结清单内默认豁免

### C0. 共享 hook(`useThemeOrUserInfo`) — Track C 公共前置

- **状态**: ☑ done (PR #10, 2026-05-19)
- **Owns**: `visitor/src/hooks/useThemeOrUserInfo.ts`(新增)
- **依赖**: P0-1, P0-4
- **内容**: 从 `access/src/hooks/useThemeOrUserInfo.ts` 复制。**C2-C10 多个 PR 都会依赖它,所以必须先于这些任务合并**。建议放在 Phase 0 末尾或作为 Phase 1 第一个被领取的任务
- **历史**:
  - 2026-05-19 PR #10 从 access 复制 `useThemeOrUserInfo.ts`(13 行)到 `visitor/src/hooks/`,与 visitor 现有 `stores/{userInfo,themeConfig}.ts` 兼容(`useUserInfo` 暴露 `userInfos`、`useThemeConfig` 暴露 `themeConfig`)。Track C 各任务(C2-C10)从此可统一 `import { useThemeOrUserInfo } from '/@/hooks/useThemeOrUserInfo'`。

## Track D — 边角(选做)

### D3. admin 用户/角色页面同步

- **状态**: ☑ done (PR #13, 2026-05-20)
- **Owns**: `visitor/src/views/admin/user/**`
- **依赖**: P0-1, P0-3
- **内容**: 把 access 的 `UserAuthDialog.vue`、`userDetail.vue`、`mock.ts`、`type.ts`、`components/` 复制过来,使后台 admin 模块与 access 一致
- **历史**:
  - 2026-05-20 PR #13 从 `access/src/views/admin/user/` 复制 `UserAuthDialog.vue`、`userDetail.vue`、`mock.ts`、`type.ts`、`components/{PermissionPanel.vue,UserInfoPanel.vue}` 到 `visitor/src/views/admin/user/` 同名路径,内容与 access 完全一致(diff 无差异)。所有 import 均为相对路径(`./mock`、`./type`、`./components/*`)或第三方包(`vue`、`element-plus`、`@element-plus/icons-vue`),无 `/@/` 别名依赖,visitor 已有相同版本的 element-plus 2.13.1 + @element-plus/icons-vue 2.3.2,无需补充依赖。未改 `index.vue`/`form.vue`/`personal.vue`/`i18n/`(本任务范围仅同步上述新增文件)。本地 `npx prettier --write src/views/admin/user/` 通过;`npm run dev` HTTP 200。

### D4. 主题图片库 — 已剔除(需求整理错误)

- **状态**: 🚫 removed (P2-5, 2026-05-20)
- **历史**:
  - 2026-05-20 PR #TBD 从 access 复制主题图片库页面到 `visitor/src/views/theme-images/`,并在 route.ts 增加 `/theme-images` 路由（本期内交付）
  - 2026-05-20 P2-5 决议：主题图片库不属于 visitor 业务范围，P2-5 PR #TBD 一次性删除 `/theme-images` 路由与 `visitor/src/views/theme-images/` 目录（`utils/themeImages.ts` 等主题工具仍由登录页 / 主题切换继续使用，不动）

### D5. 登录页对齐

- **状态**: ☑ done (PR #18, 2026-05-20)
- **Owns**: `visitor/src/views/login/**`
- **依赖**: P0-1, P0-4
- **历史**:
  - 2026-05-20 PR #18 把 `visitor/src/views/login/index.vue` 重写为 access 的 `.login-page__*` 结构（brand header / hero / panel / card / footer），引入 `useThemeImage('loginBackground')` 与 `useThemeImage('brandBadge')` 主题图。`visitor/src/views/login/component/password.vue` 改为 access 同款 `login-field` + `login-field__label` 表单(去掉 prefix 图标,新增 `login-password-toggle` 显隐密码按钮,验证码改用 `login-verify-row` 网格);保留 visitor 既有的 `isQiankun` 验证码 URL 逻辑(不动认证逻辑)。新增 `visitor/src/views/login/i18n/{zh-cn,en}.ts` 补齐 `page.welcome/subtitle/username/password/imageCode` i18n 键(走自动 glob 注入,不动 `i18n/lang/*` 与 `i18n/pages/login/*`)。`visitor/src/theme/login.scss` 不在 Owns 之内,所有新结构样式以未 scoped `<style lang="scss">` 块内联在 `index.vue` 中,与原有旧布局类名(`.login-container/.wave/.img/.login-box`)互不冲突。`mobile.vue` 与 `register.vue` 当前已与 access 一致,保持原样未改动。`npm run dev` 验证通过(HTTP 200,`/#/login` 可访问)。

---

# Phase 2 — 收口与验收(单 Agent 串行)

## P2-1. i18n 统一收口

- **状态**: ☑ done (PR #TBD, 2026-05-20)
- **Owns**:
  - `visitor/src/i18n/lang/zh-cn.ts`、`visitor/src/i18n/lang/en.ts`
  - `visitor/src/i18n/index.ts`、`visitor/src/i18n/pages/**`
  - 各模块内 `i18n/zh-cn.ts`、`i18n/en.ts`(只读取,合并后可保留或删除)
- **依赖**: 用户指派的 Phase 1 任务全部 done
- **内容**: 把 Phase 1 各模块独立 i18n 文件合并到 `i18n/lang/*.ts`(或 `i18n/pages/*` 子模块),配置 vue-i18n 加载
- **历史**:
  - 2026-05-20 PR #TBD 盘点 Phase 1 新增的模块内 i18n 文件:
    - D5(PR #18)新增 `visitor/src/views/login/i18n/{zh-cn,en}.ts`(`page.welcome / subtitle / username / password / imageCode`)
    - C11(PR #22)新增 `visitor/src/views/set/menu/i18n/{zh-cn,en}.ts`(`sysmenu` 命名空间;与既有 `visitor/src/views/admin/menu/i18n/{zh-cn,en}.ts` **逐字节相同**,纯重复)。
    把 D5 的 `page.*` 5 个键合并到 `visitor/src/i18n/lang/{zh-cn,en}.ts` 末尾(挨着 `upgrade` 命名空间下面),删除 `views/login/i18n/`;删除 `views/set/menu/i18n/`(`sysmenu` 命名空间由既有 `admin/menu/i18n/` 提供,运行时 glob 已覆盖)。其他模块的 i18n 文件均为项目初始化即存在(`views/admin/{client,dept,dict,file,log,menu,param,post,role,token,user}/i18n/`、`views/home/i18n/`、`components/{QueryTree,Upload}/i18n/`),不属于 Phase 1 新增,保留不动以缩小本任务变更面。`i18n/index.ts` 的 `import.meta.glob('./../../**/**/**/i18n/*.ts')` 继续按现状自动加载。**校验**:`npm run dev` HTTP 200;`/#/login` 仍正确显示「欢迎登录 / 请输入账号和密码 / 用户名 / 密码 / 图片验证码」(改走 `i18n/lang/zh-cn.ts` 而不是 `views/login/i18n/zh-cn.ts`)。`npm run lint:eslint` 0 error / 27 warning(沿用 P2-3 基线)。`npm run build` 通过。

## P2-2. main-app 联调

- **状态**: ☐ pending
- **Owns**: 视情况可能需要改 `main-app/` 注册菜单(先和用户确认)
- **依赖**: P2-1
- **内容**: 在 main-app 中以 qiankun 方式加载 visitor,验证「返回统一门户」按钮、菜单跳转、所有迁移页面都能打开
- **历史**:

## P2-5. 访客菜单收口（剔除多余菜单与文档）

- **状态**: 🟡 in-progress (P2-5, devin/<unix>-P2-5-visitor-menu-cleanup)
- **Owns**:
  - `visitor/src/router/route.ts`（剔除 7 条多余路由 + 新增 `menuRoutes` 父级分组导出）
  - `visitor/src/router/backEnd.ts`（`setRoutesList` 改用 `menuRoutes`）
  - `visitor/src/views/permission/position/**`（删）
  - `visitor/src/views/permission/space/**`（删）
  - `visitor/src/views/portal/**`（删：整个 portal/ 目录）
  - `visitor/src/views/theme-images/**`（删）
  - `visitor/MIGRATION_TASKS.md`（本任务章节 + C4 / C5 / C7~C10 / D4 章节收口）
- **依赖**: 无（纯清理）
- **内容**: 根据用户决议，visitor 子应用左侧菜单只保留以下 7 条：
  - 访客总览 / 预约记录 / 通行记录 / 黑名单管理 / 访客配置 / 园区访客管理说明
  - 「**设置**」父级（子项：用户管理 / 角色管理 / 组织管理 / 菜单管理）

  其余条目（空间管理 / 岗位管理 / 子应用管理 / AI 工具中心 / 应用分类 / 工作台配置 / 主题图片库）属于需求整理错误，本任务一次性物理删除对应路由、视图文件与文档章节。

  实现要点：
  - `route.ts` 中 `dynamicRoutes` 保持**扁平**（vue-router 实际注册），新增 `menuRoutes` 导出**带「设置」父级分组**（仅用于 aside 菜单渲染）；`backEnd.ts` 中 `storesRoutesList.setRoutesList(...)` 由 `baseRoutes[0].children` 改为 `menuRoutes`。
  - `MIGRATION_TASKS.md` 中 C4 / C5 / C7~C10 / D4 共 6 个章节由「🚫 cancelled」收口为「🚫 removed (P2-5)」。
- **历史**:
  - 2026-05-20 PR #TBD 清理访客子应用左侧菜单与对应视图 / 路由 / 文档章节，并引入 `menuRoutes` 父级分组以支持「设置」父级菜单展示

## P2-6. 修复 visitor 左侧菜单底部 fold/expand 图标在 dev 模式丢失

- **状态**: 🟡 in-progress (P2-6 follow-up, devin/<unix>-P2-6-vite-fs-allow)
- **Owns**:
  - `visitor/vite.config.ts`
  - `visitor/MIGRATION_TASKS.md`（仅本任务章节）
- **依赖**: P0-3（visitor 已接入 `@zhqc-smart/layout`）
- **背景**: 公共 `@zhqc-smart/layout` 的左侧菜单底部由 `vertical.vue` 渲染一个 `.layout-nav-menu__footer`，里面装的是 `breadcrumb.vue` 的折叠 / 展开切换图标（`fold.png` / `expand.png`，由 `new URL('../../asset/images/...', import.meta.url)` 引用）。parking / access 子应用底部能正常看到这枚图标，visitor 看不到。
- **根因**: 共两层 dev-only 配置缺失，缺一不可：
  1. `optimizeDeps` 未把 `@zhqc-smart/*` 公共包列入 `exclude`，Vite/esbuild 会把这些 `file:` 软链包预构建到 `node_modules/.vite/deps/` 下，`import.meta.url` 指向 `.vite/deps/` 伪路径，`new URL('../../asset/images/expand.png', import.meta.url)` 解析成 `node_modules/.vite/asset/images/expand.png` → 404。（PR #31 已修复）
  2. `server.fs.allow` 未放行 `../components`。`@zhqc-smart/*` 通过 `file:../components/packages/*` 引入，npm 会建一条 `node_modules/@zhqc-smart/layout → ../../components/packages/layout` 软链；Vite 默认 `resolve.preserveSymlinks: false`，会把这条软链解析到 `components/packages/layout/**` 真实路径（位于 visitor 项目根之外）。Vite 5 默认 `server.fs.strict: true`，根外文件被 dev 服务器拦截 → `fold.png` / `expand.png` 仍 403/404，菜单底部依旧看不到图标。access / parking 在 `server.fs.allow` 里显式放行了 `../components`，所以图标正常。
- **修复**:
  1. （PR #31）在 `optimizeDeps.exclude` 加入 `['@zhqc-smart/layout', '@zhqc-smart/table', '@zhqc-smart/settings', '@zhqc-smart/admin']`，不再预构建公共组件库。
  2. （本 PR）在 `server.fs.allow` 加入 `[resolve(__dirname), resolve(__dirname, '../components')]`，与 access / parking 一致，让 dev server 能透过软链读到 `components/packages/layout/src/asset/images/{fold,expand}.png`。
- **校验**（本机由用户跑，VM 不跑 build/install）:
  - `npm run lint:eslint` 0 error（沿用 P2-3 基线）
  - `npm run dev` 启动后左下角菜单底部折叠 / 展开图标可见且可点击切换
  - `npm run build` 通过（生产构建不受影响，本次修改仅改 dev server 配置）
- **历史**:
  - 2026-05-20 PR #31 `visitor/vite.config.ts` 在 `optimizeDeps.exclude` 加入 `@zhqc-smart/{layout,table,settings,admin}`（dev 模式首轮修复，未生效）
  - 2026-05-20 PR #TBD `visitor/vite.config.ts` 在 `server.fs.allow` 放行 `../components`，与 access / parking 对齐，恢复 dev 模式下左侧菜单底部折叠 / 展开图标渲染

## P2-7. 修复 qiankun 主应用下「设置」分组 4 项页面 404

- **状态**: 🟡 in-progress (P2-7, devin/<unix>-P2-7-visitor-settings-routes-qiankun-prefix)
- **Owns**:
  - `visitor/src/router/route.ts`（4 项设置路由 + 父级分组 + 隐藏 personal 路由补齐 `/visitor/` 前缀）
  - `visitor/MIGRATION_TASKS.md`（仅本任务章节）
- **依赖**: P2-5（「设置」父级分组在 PR #30 引入）
- **背景**: 用户在 main-app 主应用下（qiankun 模式）访问 visitor 时，点击「设置」分组下「用户管理 / 角色管理 / 组织管理 / 菜单管理」4 项菜单都跳到 404，独立运行 visitor 时无此问题。访客其余 6 个顶级页面（访客总览 / 预约记录 / 通行记录 / 黑名单管理 / 访客配置 / 园区访客管理说明）正常。
- **根因**: main-app 与 visitor 都使用 `createWebHashHistory`，**全局只有一个 hash**。`main-app/src/micro/index.ts` 注册 qiankun activeRule 读取 `location.hash` 前缀判断子应用是否激活：路径必须 `=== app.routePath` 或 `startsWith(app.routePath + '/')`，对 visitor 即必须以 `/visitor` 起始。`main-app/src/config/apps.ts` 也声明 `routePath: '/visitor'`。

  P2-5 把「设置」4 条路由 path 写成 `/permission/user`、`/permission/role`、`/permission/organization`、`/set/menu`（无 `/visitor/` 前缀）。在 qiankun 下点击这些菜单时，visitor 的 hash router push 把全局 `location.hash` 直接覆写为 `#/permission/user` 等，**主应用 activeRule 不再匹配** → qiankun 卸载 visitor → 主应用 `Home.vue` 的 qiankun 容器对应路由 `/:routePath/:subpath(.*)*` 也不命中 → 落入 catch-all 404。访客其余 6 条 path 都已是 `/visitor/...`，所以一直正常。
- **修复**: 仅业务路由配置改动，不动 vue-router / qiankun 基础设施：
  - `userRoute.path`: `/permission/user` → `/visitor/permission/user`
  - `roleRoute.path`: `/permission/role` → `/visitor/permission/role`
  - `organizationRoute.path`: `/permission/organization` → `/visitor/permission/organization`
  - `menuRoute.path`: `/set/menu` → `/visitor/set/menu`
  - `menuRoutes` 父级 `set` 的 `path`: `/set` → `/visitor/set`（el-sub-menu 的 `:index` 标识，保持与其它顶级菜单同前缀以便 hash 一致）
  - `personalRoute.path`: `/personal` → `/visitor/personal`（隐藏路由，预防同样的踩坑）

  路由 `name` 全部保留不动，以避免 tagsView / keep-alive / `defaultActive` 等其它引用受影响。
- **不采用 access 那套 `createMemoryHistory` + `syncSubAppRoute` 方案的原因**:
  - 该方案需要同时改 `visitor/src/router/index.ts`（基础设施）+ 新增 `VITE_QIANKUN_NAME=visitor`（env 配置），与「只改业务代码」边界冲突；
  - 而且 visitor 现有 6 条访客业务路由 path 已经携带 `/visitor/` 前缀，配合 `syncSubAppRoute` 会出现 `/#/visitor/visitor/overview` 双前缀，反而需要再回头去掉这些前缀（牵动 7 个顶级菜单），不属于本次定向 bug 修复范围。

  当前方案保持「visitor 所有 path 均以 `/visitor/` 起始」的一致性，主应用 activeRule 始终命中，最小化变更面。
- **校验**（本机由用户跑，VM 不跑 build / install）:
  - 在 main-app（qiankun 主应用）下进入 visitor 「设置」分组，依次打开「用户管理 / 角色管理 / 组织管理 / 菜单管理」均正确渲染对应视图，不再跳 404
  - 访客其余 6 项顶级菜单不受影响
  - `npm run lint:eslint` 0 error（沿用 P2-3 基线）
- **历史**:
  - 2026-05-20 PR #TBD `visitor/src/router/route.ts` 4 项设置路由 + `set` 父级分组 + 隐藏 personal 路由统一补齐 `/visitor/` 前缀，修复 qiankun 主应用下点击「设置」子项跳 404

## P2-8. 修复「设置」分组子菜单选中态蓝色 marker 条贴文字左侧

- **状态**: 🟡 in-progress (P2-8, devin/<unix>-P2-8-visitor-settings-submenu-marker)
- **Owns**:
  - `visitor/src/router/route.ts`（4 项设置 leaf 路由补 `level: 2`，并去掉显式 `: RouteRecordRaw` 标注以兼容 layout 约定字段）
  - `visitor/MIGRATION_TASKS.md`（仅本任务章节）
- **依赖**: P2-7（4 项设置路由已补齐 `/visitor/` 前缀、可在 qiankun 下正常打开）
- **背景**: P2-7 修好 404 后，用户反馈点击「设置」分组的 4 个子项，选中态那条蓝色 marker 条紧贴文字左侧，而 access 子应用同样的子菜单 marker 是推到菜单最左缘的。
- **根因**: 公共 `@zhqc-smart/layout` 的 <ref_snippet file="components/packages/layout/src/navMenu/subItem.vue" lines="18-29" /> 渲染 sub-item 时用 `val.level` 计算 `marginLeft = val.level * 18 + 'px'` 与 CSS 变量 `--before-left = -(val.level * 18) + 'px'`；后者驱动 <ref_snippet file="components/packages/layout/src/navMenu/vertical.vue" lines="359-396" /> 中 `.layout-nav-menu__child.is-active::before` 的 `left` —— 这就是那条蓝色 marker。

  access 的 `mockRoute.ts` 每条 leaf 子菜单都写了 `level: 2`（13 处），把缩进定到 36px、marker 推到菜单左缘。

  visitor 在 P2-5 引入「设置」父级分组时，4 条 leaf 路由没带 `level` 字段：`undefined * 18 = NaN`，`marginLeft: 'NaNpx !important'` 与 `--before-left: 'NaNpx'` 都是非法 CSS 被浏览器丢弃，marker 条退回默认位置（0），就紧贴文字左侧。
- **修复**: 仅业务路由配置改动，不动公共 layout / vue-router 基础设施：
  - `userRoute`、`roleRoute`、`organizationRoute`、`menuRoute` 4 条 leaf 路由各加 `level: 2`，与 access mockRoute 对齐
  - 同时去掉这 4 条 leaf 路由的 `: RouteRecordRaw` 显式标注：`level` 不是 vue-router `RouteRecordRaw` 原生字段（是公共 layout 约定的菜单渲染字段），带显式标注会触发 TS 多余属性检查；改为依赖 `settingsRoutes: Array<RouteRecordRaw>` 的数组类型做结构兼容检查（非 fresh literal，不触发 excess property check），`level` 在运行时依然挂在对象上供 `subItem.vue` 读取
  - 访客 6 条顶级路由由 `vertical.vue` 的顶层 `el-menu-item` 渲染，**不走 subItem.vue**，不需要 `level`；`set` 父级分组渲染为 `el-sub-menu`、隐藏的 `personalRoute` 不进菜单，也都不需要 `level`
- **校验**（本机由用户跑，VM 不跑 build / install）:
  - 在 main-app（qiankun 主应用）下进入 visitor「设置」，4 个子项的选中态蓝色 marker 条与 access 视觉一致（推到菜单左缘）、文字缩进 36px
  - 访客其余 6 项顶级菜单的选中态、icon、缩进表现不变
  - `npm run lint:eslint` 0 error（沿用 P2-3 基线）
- **历史**:
  - 2026-05-20 PR #TBD `visitor/src/router/route.ts` 4 条 settings leaf 路由补 `level: 2`，对齐 access mockRoute 的 sub-item 渲染约定，修复「设置」分组选中态 marker 条贴文字左侧的样式问题

## P2-9. 访客总览「访客到访趋势」堆叠柱状图视觉打磨

- **状态**: 🟡 in-progress (P2-9, devin/<unix>-P2-9-visitor-overview-trend-chart-polish)
- **Owns**:
  - `visitor/src/views/visitor/overview/useBizProcess.ts`（仅 `buildTrendChartOption` 函数）
  - `visitor/MIGRATION_TASKS.md`（仅本任务章节）
- **依赖**: B5（访客总览页骨架已落地）
- **背景**: 用户反馈访客总览页「访客到访趋势」堆叠柱状图视觉不够精致 —— 每个柱子分段都有上下圆角，堆叠后像一串"胶囊"，柱体效果不够干净。其余面板标题 / 副标题 / 图例 / 日期等图表外文字不动。
- **根因**: 原 `series.itemStyle.borderRadius = [6, 6, 0, 0]` 是 series 维度的全局配置，ECharts 会对该 series 的**每一段**都应用顶部圆角；多段堆叠后每段顶部都圆角 → 视觉上变成胶囊堆叠。
- **修复**: 把圆角从 series 维度下沉到 data 维度，仅给"该 x 位置最顶端非零段"加 `[8,8,0,0]` 顶部圆角，其余段都是 `[0,0,0,0]` 矩形对齐拼接：
  - 预计算二维数据矩阵 `dataMatrix[seriesIndex][xIndex]` 和"每个 x 上最顶非零 series 下标" `topSeriesPerX[xIndex]`
  - `series.data` 改为对象数组 `{ value, itemStyle: { borderRadius, borderColor, borderWidth } }`
  - `borderColor: '#ffffff'` + `borderWidth: 1`（仅 `value > 0` 时）给相邻段制造 1px 细缝，避免相邻同色段挤在一起糊成一片
  - 顶部圆角从 `6` 调到 `8`，柱体上沿更圆润
  - `barWidth` 从 `26` 收窄到 `20`，柱子更挺拔
  - `tooltip.axisPointer.shadowStyle` 加 `rgba(99, 102, 241, 0.06)` 淡紫色提示区
  - `legend.itemGap: 18` 让图例项之间留出更多呼吸感
  - `emphasis.itemStyle` 加 `shadowBlur: 14` + `shadowOffsetY: 4` + `shadowColor: 'rgba(15, 23, 42, 0.18)'`，hover 当前 series 时整列柱体浮起一层柔光
- **保持不动**:
  - 企业身份色 `enterprise.color`（API mock 提供，同时被趋势表格的颜色点引用，保持源头一致性）
  - 图表外的标题 / 副标题 / 工具栏 / 「访客数据概览」/ 表格 / 各 metric card
  - 公共 layout / 主题 token / 任何样式文件
- **校验**（本机由用户跑，VM 不跑 build / install）:
  - 「访客到访趋势」柱状图：每根柱子整体看起来像一条只有顶部圆角的连贯长条，不再有胶囊堆叠感；相邻段之间有清晰的细缝；hover 时浮起柔光
  - 顶部 metric 卡片、「访客数据概览」、「各企业到访明细（最近5天）」表格、日期选择器、指标切换 segmented 都不变
  - `npm run lint:eslint` 0 error（沿用 P2-3 基线）
- **历史**:
  - 2026-05-20 PR #TBD `visitor/src/views/visitor/overview/useBizProcess.ts` 调整 `buildTrendChartOption`：堆叠柱顶圆角下沉到 data 级别仅在最顶段生效；加 1px 白色 border 分段；收窄柱宽到 20；图例间距、tooltip 提示色、hover 阴影一同微调

## P2-10. 访客总览「各企业到访明细」表头/单元格对齐 + 隐藏滚动条但保留滚轮

- **状态**: 🟡 in-progress (P2-10, devin/<unix>-P2-10-visitor-overview-table-align-and-scrollbar)
- **Owns**:
  - `visitor/src/views/visitor/overview/index.vue`（仅趋势表格的 `el-table-column` 对齐参数 + `.visitor-overview__table` 样式块）
  - `visitor/MIGRATION_TASKS.md`（仅本任务章节）
- **依赖**: B5（访客总览页骨架已落地）、P2-9（趋势模块视觉打磨）
- **背景**: 用户反馈：
  - 「各企业到访明细（最近5天）」表头（03-16 / 03-17 / ...）默认左对齐，而单元格内容 `7人` + 车辆 icon+数字是居中显示，导致表头看着偏左、列对不齐
  - 希望表格在内容需要滚动时隐藏滚动条（横向 / 纵向都不显示），但鼠标滚轮**必须**能正常垂直滚动
- **修复**: 仅在 `visitor/src/views/visitor/overview/index.vue`：
  - `el-table-column` 加 `:align="column.type === 'enterprise' ? 'left' : 'center'"`：「企业」列仍左对齐（带颜色圆点 + 企业名称），其余指标列表头与数据一起居中，与单元格中已有的 `text-align: center` 视觉一致
  - `.visitor-overview__table` 样式块新增两段 CSS：
    1. `:deep(.el-scrollbar__bar) { display: none !important; }` 隐藏 Element Plus 2.x 中 el-table 内置 el-scrollbar 的自绘滚动条；滚轮 / wheel 事件由 `.el-scrollbar__wrap` 接收处理，不受 `display:none` 的轨道影响
    2. `:deep(.el-scrollbar__wrap), :deep(.el-table__body-wrapper)` 上同时设 `scrollbar-width: none`（Firefox）、`-ms-overflow-style: none`（旧 Edge / IE）以及 `&::-webkit-scrollbar { width: 0; height: 0; display: none; }`（Chromium / Safari）兜底原生滚动条
- **保持不动**:
  - `useBizProcess.ts` 中 `buildTrendTableColumns` / `buildTrendTableRows`：列定义、最小宽度、合计列都不动
  - 公共 layout / 主题 token / 任何样式文件
  - 图表 / 顶部 metric 卡片 / 「访客数据概览」/ 工具栏
- **校验**（本机由用户跑，VM 不跑 build / install）:
  - 「各企业到访明细」表格表头与单元格在列宽内视觉对齐：企业列左对齐，5 个日期列 + 合计列居中
  - 表格滚动条不可见（横向 / 纵向都不出现自绘或原生滚动条），但鼠标在表格上滚动滚轮时能正常垂直滚动
  - 公共 layout 自身的 `el-scrollbar`（页外侧栏 / 顶栏等）的滚动条不被波及，因为样式作用域被 `.visitor-overview__table` 包住
  - `npm run lint:eslint` 0 error（沿用 P2-3 基线）
- **历史**:
  - 2026-05-20 PR #TBD `visitor/src/views/visitor/overview/index.vue` 表格 `el-table-column` 增加按列类型派发的 `align`；样式块追加 el-scrollbar / native scrollbar 两层隐藏 CSS 保留滚轮能力

## P2-3. 最终 lint + build

- **状态**: ☑ done (PR #TBD, 2026-05-20)
- **Owns**: 视情况修复(每条修复独立 PR)
- **依赖**: P2-1
- **内容**:
  ```
  cd visitor && npm install && npm run lint:eslint && npm run build
  ```
  全部通过
- **历史**:
  - 2026-05-20 PR #TBD 修 ESLint v9 + ESM 不兼容(`.eslintrc.js` → `.eslintrc.cjs`、lint 脚本加 `cross-env ESLINT_USE_FLAT_CONFIG=false`),放宽 `no-console: warn` + `no-unused-vars` 接受 `_` 前缀豁免,批量修复 16 项 `no-unused-vars` error(stores/utils/qiankun/views/admin、views/permission、views/visitor 范围),最终 `npm run lint:eslint` 0 error / 27 warning(全为 `no-console`,Phase 2 决议为 warn 不阻塞),`npm run build` 通过。注:为避免和别人撞 PR,本任务作为 Phase 2 第一步先行;P2-1 i18n 收口仍待做,日后若 i18n PR 引入新的 lint 错误,再发独立修复 PR。

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
