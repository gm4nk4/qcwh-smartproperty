# qcwh-smartproperty

这是一个 qiankun 微前端架构项目,主要负责 visitor 子应用的开发,main-app 项目是主应用,components 项目是依赖库,其他均为参考项目(且不允许更改)。

## 仓库导航

| 目录 | 角色 | 修改策略 |
| --- | --- | --- |
| [`main-app/`](./main-app) | qiankun 主应用(统一门户) | 可改,需要时配合 visitor 改造 |
| [`visitor/`](./visitor) | **当前开发主战场**:访客管理子应用 | **必须改** |
| [`access/`](./access) | 参考子应用:门禁/统一门户/权限 | ❌ 严禁修改(仅参考) |
| [`parking/`](./parking) | 参考子应用:停车/能耗/告警 | ❌ 严禁修改(仅参考) |
| [`components/`](./components) | 公共组件库 `@zhqc-smart/{layout,table,admin,settings,form,login}` | 可改,但只在必须改时改,且先与用户沟通 |

## 给 Agent 看的文档(开干前**必读**)

| 文档 | 用途 |
| --- | --- |
| [`AGENTS.md`](./AGENTS.md) | 项目说明 + 多 Agent 并行工作模型 + 硬性工作流规则 |
| [`visitor/MIGRATION_TASKS.md`](./visitor/MIGRATION_TASKS.md) | **visitor 子应用所有改造任务的唯一任务源**(Phase 0/1/2、Owns、依赖、状态、历史) |

## 任务清单(按子应用)

| 子应用 | 任务清单 | 当前状态 |
| --- | --- | --- |
| visitor | [`visitor/MIGRATION_TASKS.md`](./visitor/MIGRATION_TASKS.md) | Phase 0 进行中 |
| parking | (暂无,后续需要时新增 `parking/MIGRATION_TASKS.md`) | — |
| access | (参考实现,不修改) | — |
| main-app | (暂无,需要时新增 `main-app/MIGRATION_TASKS.md`) | — |

## Agent 工作流速记

1. 接到任务先打开 [`AGENTS.md`](./AGENTS.md) 与对应子应用的 `MIGRATION_TASKS.md`
2. 在任务清单中找到任务 ID(如 `P0-1`、`B3`、`C2`),严格按 `Owns` 字段限制改动文件
3. 分支名:`devin/<unix-timestamp>-<TASK_ID>-<slug>`,PR 标题前缀 `[<TASK_ID>] `,每 PR 只一个任务
4. PR 合并前把对应任务章节的 `状态` 改为 `☑ done (PR #x, YYYY-MM-DD)` 并追加 `历史` 一行
5. 不要动其他任务的章节、不要 drive-by 改非 Owns 文件
