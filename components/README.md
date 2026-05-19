# Smart Component Library

企业级 Vue3 组件库，基于 Element Plus，提供通用业务组件。

## 📦 组件包列表

| 包名 | 说明 | 状态 |
|------|------|------|
| [@zhqc-smart/layout](packages/layout/README.md) | 布局组件（Header、Aside、TagsView） | ✅ 可用 |
| [@zhqc-smart/table](packages/table/README.md) | 表格组件（高级表格、数据分页） | 🚧 开发中 |
| [@zhqc-smart/form](packages/form/README.md) | 表单组件（动态表单、表单验证） | 🚧 规划中 |

## 🚀 快速开始

### 安装所有组件

```bash
npm install
```

### 开发单个组件

```bash
# 开发 layout 组件
cd packages/layout
npm install
npm run dev

# 开发 table 组件
cd packages/table
npm install
npm run dev
```

### 构建所有组件

```bash
npm run build:all
```

## 📁 目录结构

```
components/
├── packages/                    # 组件包目录
│   ├── layout/                  # 布局组件
│   │   ├── src/
│   │   │   ├── index.ts        # 入口文件
│   │   │   ├── index.vue       # 主组件
│   │   │   ├── types/          # 类型定义
│   │   │   └── components/     # 子组件
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   └── README.md
│   ├── table/                   # 表格组件（开发中）
│   │   └── README.md
│   └── form/                    # 表单组件（规划中）
│       └── README.md
├── package.json                 # Workspace 根配置
├── vitest.config.ts             # 测试配置
└── README.md                    # 本文档
```

## 🔧 开发指南

### 创建新组件包

1. 在 `packages/` 下创建新目录，如 `table`
2. 参考现有 `layout` 包的目录结构
3. 更新根 `package.json` 的 `workspaces` 配置

### 包命名规范

- 包名格式：`@zhqc-smart/<component-name>`
- 目录名：`packages/<component-name>/`
- 例如：`@zhqc-smart/layout` → `packages/layout/`

### 发布流程

```bash
# 1. 进入包目录
cd packages/layout

# 2. 更新版本号 (package.json)
# 3. 构建
npm run build

# 4. 发布
npm publish --access public
```

## 📚 文档

- [Layout 组件文档](packages/layout/README.md)
- [Table 组件文档](packages/table/README.md) (开发中)
- [Form 组件文档](packages/form/README.md) (规划中)

## 🛠 技术栈

- Vue 3.5+
- TypeScript 6+
- Element Plus 2.5+
- Vite 6+
- Vitest (测试)

## 📄 许可证

MIT