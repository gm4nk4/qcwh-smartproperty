# 智慧物业管理系统 - 微前端使用说明

## 一、项目结构（Monorepo）

```
SmartPropertyManagementSystem/
├── main-app/           # 主应用（qiankun 基座）
│   ├── src/
│   │   ├── micro/      # 微前端配置
│   │   │   ├── apps.ts # 子应用注册配置
│   │   │   └── index.ts # qiankun 初始化
│   │   └── config/
│   │       └── proxy.config.js # 公共代理配置
│   └── vite.config.ts
│
├── components/          # 公共组件库（Monorepo 多包管理）
│   └── src/
│       ├── Welcome/    # Welcome 欢迎组件
│       │   ├── index.vue
│       │   ├── props.ts
│       │   └── index.ts
│       └── index.ts    # 统一导出
│
├── asset/              # 子应用 - 资产管理系统
├── work-order/         # 子应用 - 工单管理系统
├── security/           # 子应用 - 安防监控系统
├── visitor/            # 子应用 - 访客管理系统
├── energy/             # 子应用 - 智慧设备管理系统
├── power/              # 子应用 - 智慧能源管理系统
├── notice/             # 子应用 - 公告管理系统
├── parking/            # 子应用 - 停车管理系统
├── payment/            # 子应用 - 物业缴费系统
└── portal/             # 子应用 - 物业门户CMS
```

## 二、开发环境配置

### 2.1 克隆项目

开发时需要拉取以下项目：
```bash
git clone <主项目仓库>
```

项目结构应包含：`main-app`、`components`、以及负责的子应用（如 `asset`、`work-order` 等）

### 2.2 安装依赖

在每个项目目录下安装依赖：
```bash
cd main-app && npm install
cd ../components && npm install
cd ../asset && npm install
```

### 2.3 启动开发服务器

```bash
# 主应用（端口 3000）
cd main-app && npm run dev

# 子应用（各自端口，如 asset: 3002）
cd asset && npm run dev
```

访问 `http://localhost:3000` 即可看到主应用，点击子应用卡片可进入对应子应用。

## 三、代理配置原理

### 3.1 核心问题

多个子应用可能都使用 `/api` 作为 API 前缀，但实际需要指向不同的后端服务。

### 3.2 解决方案：自动切换代理

**原理**：
- 子应用**独立运行** → 使用子应用自己的 `vite.config.ts` 代理配置
- 子应用**挂载到主应用** → 使用主应用的 `proxy.config.js` 代理配置

### 3.3 具体配置

#### 主应用代理配置
文件：`main-app/src/config/proxy.config.js`

```javascript
const commonProxy = {
  // 工单管理系统
  "/workorder-api": {
    target: "http://xxx-server-1.nip.io",
    ws: true,
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/workorder-api/, ""),
  },
  // 资产管理系统
  "/asset-api": {
    target: "http://xxx-server-2.nip.io",
    ws: true,
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/asset-api/, ""),
  },
  // 其他子应用...
};

export default commonProxy;
```

#### 主应用 vite.config.ts
文件：`main-app/vite.config.ts`

```typescript
import commonProxy from './src/config/proxy.config';

export default defineConfig({
  server: {
    port: 3000,
    proxy: commonProxy,
  },
});
```

#### 子应用 .env.development
文件：`asset/.env.development`

```bash
# 开发环境
VITE_PORT = 3002
VITE_API_PREFIX = /api
VITE_ADMIN_PROXY_PATH = http://localhost:8080
```

#### 子应用 vite.config.ts
文件：`asset/vite.config.ts`

```typescript
export default defineConfig({
  server: {
    port: env.VITE_PORT as unknown as number,
    proxy: {
      [env.VITE_API_PREFIX || '/api']: {
        target: env.VITE_ADMIN_PROXY_PATH,
        ws: true,
        changeOrigin: true,
        rewrite: (path) => path.replace(new RegExp(`^${env.VITE_API_PREFIX || '/api'}`), ''),
      },
    },
  },
});
```

### 3.4 切换逻辑

| 运行方式 | 实际使用的代理 |
|---------|--------------|
| 子应用独立运行 | `vite.config.ts` 中的 `server.proxy` |
| 主应用加载子应用 | `main-app/src/config/proxy.config.js` |

**判断依据**：qiankun 会在子应用前注入 `__POWERED_BY_QIANKUN__` 全局变量

## 四、公共组件使用（Monorepo 方式）

### 4.1 组件目录结构

```
components/src/
├── Welcome/
│   ├── index.vue      # 组件实现
│   ├── props.ts       # Props 定义
│   └── index.ts       # 导出入口
└── index.ts           # 统一导出
```

### 4.2 导出组件
文件：`components/src/index.ts`

```typescript
export { Welcome } from './Welcome';
export type { WelcomeProps } from './Welcome';
```

### 4.3 子应用配置

#### vite.config.ts 添加别名
```typescript
const alias: Record<string, string> = {
  '/@': pathResolve('./src/'),
  '@common': pathResolve('../components/src/'),  // 新增
};
```

#### tsconfig.json 添加路径映射
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "/@/*": ["src/*"],
      "@common/*": ["../components/src/*"]
    }
  }
}
```

#### 组件中使用
```vue
<template>
  <div>
    <Welcome title="欢迎使用" name="资产管理系统" />
  </div>
</template>

<script setup lang="ts">
import { Welcome } from '@common/index';
</script>
```

### 4.4 新增公共组件流程

1. 在 `components/src/` 下创建组件文件夹
2. 编写组件代码
3. 在 `components/src/index.ts` 中导出
4. 所有子应用即可通过 `@common` 使用

## 五、新增子应用指南

### 5.1 创建子应用

1. 在 `SmartPropertyManagementSystem/` 下创建子应用文件夹
2. 配置 `vite.config.ts`、`tsconfig.json`、`.env.development`
3. 添加 `@common` 别名指向 `../components/src/`

### 5.2 注册到主应用

文件：`main-app/src/micro/apps.ts`

```typescript
const subApps = [
  {
    name: "your-app",
    entry: "http://localhost:3003",  // 子应用端口
    container: "#subapp-container",
    routePath: "/your-app",
    description: "你的子系统",
    icon: "IconName",
    color: "#409EFF",
    apiPrefix: "/your-api",  // API 前缀
  },
];

export default subApps;
```

### 5.3 配置代理

在 `main-app/src/config/proxy.config.js` 中添加：
```javascript
"/your-api": {
  target: "http://your-backend-server.nip.io",
  ws: true,
  changeOrigin: true,
  rewrite: (path) => path.replace(/^\/your-api/, ""),
},
```

### 5.4 添加欢迎组件

在子应用 `src/views/home/index.vue` 中：
```vue
<template>
  <div class="layout-padding">
    <div class="layout-padding-auto layout-padding-view">
      <el-row :gutter="20">
        <el-col :span="24">
          <Welcome title="欢迎使用" name="你的系统名称" />
        </el-col>
      </el-row>
      <!-- 其他内容 -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { Welcome } from '@common/index';
</script>
```

## 六、上线后方案

### 6.1 抽离 NPM 包（生产环境）

当项目成熟后，可将 `components` 抽离为独立 NPM 包：

```bash
# 发布到私有 NPM
npm publish --registry=https://your-npm-registry.com

# 其他项目安装
npm install your-common-lib --registry=https://your-npm-registry.com
```

### 6.2 使用方式变更

```typescript
// 从 Monorepo 方式
import { Welcome } from '@common/index';

// 改为 NPM 包方式
import { Welcome } from 'your-common-lib';
```

## 七、常见问题

### Q1: 子应用独立运行正常，但挂载到主应用后 API 请求失败

检查主应用的 `proxy.config.js` 是否配置了对应的 API 前缀代理。

### Q2: 组件引入报错 "Cannot resolve import"

确认子应用的 `vite.config.ts` 和 `tsconfig.json` 都正确配置了 `@common` 别名。

### Q3: 多个子应用使用相同端口

确保每个子应用在 `.env.development` 中设置了不同的 `VITE_PORT`。

## 八、团队协作建议

### 开发分工
- **主应用组**：负责 `main-app`、整体架构、微前端集成
- **组件组**：负责 `components` 公共组件库
- **子应用组**：各自负责一个或多个子应用（如 asset、work-order）

### Git 工作流
```bash
# 克隆主项目
git clone <main-repo>

# 创建功能分支
git checkout -b feature/asset-welcome

# 开发完成后提交
git add .
git commit -m "feat: add welcome component to asset"
git push origin feature/asset-welcome
```

### 代码规范
- 公共组件统一放在 `components` 中
- 子应用特定组件放在各自 `src/components` 中
- 遵循 Element Plus 组件规范
