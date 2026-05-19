# 新的微服务直接copy应用及权限管理项目

- 仓库地址：<http://git.zhqc-wh.com/smartpropertymanagementsystem/access.git>
- master分支
- 安装依赖后只需更改 `.env` 中的以下配置即可使用

```typescript
// .env
// access 子应用名称
VITE_QIANKUN_NAME=access
// 子应用端口号
VITE_PORT=3010
```

## Qiankun 子应用使用指南

## 目录

- [子应用使用主应用方法](#子应用使用主应用方法)
- [子应用获取 Props](#子应用获取-props)
- [子应用改变 Props](#子应用改变-props)

---

## 子应用使用主应用方法

### 1. 挂载在 `window.__QIANKUN__` 上的方法

主应用在 `actions.ts` 中导出以下方法，供子应用直接调用：

```typescript
window.__QIANKUN__.goMainApp()       // 返回主应用首页
window.__QIANKUN__.navigateTo(path)  // 跳转指定路径
window.__QIANKUN__.goBack()          // 返回上一页
window.__QIANKUN__.toggleFullscreen() // 切换全屏
```

### 使用示例

```typescript
// 子应用中
const goToMainApp = () => {
  window.__QIANKUN__?.goMainApp?.();
};

const navigateToPath = (path: string) => {
  window.__QIANKUN__?.navigateTo?.('/subapp2/dashboard');
};

const goBack = () => {
  window.__QIANKUN__?.goBack?.();
};

const toggleFullscreen = () => {
  window.__QIANKUN__?.toggleFullscreen?.();
};
```

### 2. 通过 Props 传递的方法

主应用注册子应用时，可以通过 `props` 传递方法：

```typescript
// 主应用 micro/index.ts
registerMicroApps([
  {
    name: 'subapp1',
    entry: '//localhost:3001',
    container: '#micro-container',
    props: {
      onNavigate: (path: string) => {
        router.push(path);
      },
      onGoBack: () => {
        router.back();
      }
    }
  }
]);
```

子应用接收：

```typescript
// 子应用中
export function mount(props: any) {
  const { onNavigate, onGoBack } = props;

  // 使用主应用传递的方法
  onNavigate('/target/path');
  onGoBack();
}
```

---

## 子应用获取 Props

### 1. qiankun 生命周期中的 Props

qiankun 通过 `props` 参数将数据传递给子应用：

```typescript
// 子应用入口文件
export function mount(props: any) {
  // props 包含主应用传递的所有数据
  console.log(props.name);        // 子应用名称
  console.log(props.themeConfig);  // 主题配置
  console.log(props.userInfos);    // 用户信息
  console.log(props.apiPrefix);    // API 前缀
}
```

### 2. 通过 `onGlobalStateChange` 监听全局状态

子应用可以监听主应用的全局状态变化：

```typescript
import { initGlobalState } from 'qiankun';

const actions = initGlobalState({});

export function useGlobalState() {
  const getState = () => actions.getGlobalState();

  const onGlobalStateChange = (callback: (state: any) => void) => {
    return actions.onGlobalStateChange((state) => {
      callback(state);
    }, true); // true: 立即触发一次当前状态
  };

  return { getState, onGlobalStateChange };
}

// 使用
const { getState, onGlobalStateChange } = useGlobalState();

// 获取当前状态
const state = getState();
console.log(state.userInfos);
console.log(state.themeConfig);

// 监听状态变化
useEffect(() => {
  const unsubscribe = onGlobalStateChange((state) => {
    console.log('状态更新:', state);
  });
  return unsubscribe;
}, []);
```

### 3. 主应用传递的 Props 结构

主应用在 `micro/index.ts` 中传递的 props：

```typescript
props: {
  themeConfig,     // 主题配置对象
  userInfos,        // 用户信息对象
  ...
}
```

---

## 子应用改变 Props

### 1. 通过 `setGlobalState` 设置全局状态

子应用可以将数据同步给主应用和其他子应用：

```typescript
import { initGlobalState } from 'qiankun';

const actions = initGlobalState({});

// 设置用户信息
actions.setGlobalState({
  userInfo: {
    id: 1,
    name: '子应用用户',
    token: 'xxx'
  }
});

// 设置主题配置
actions.setGlobalState({
  themeConfig: {
    primaryColor: '#1890ff',
    isDark: false
  }
});
```

### 2. 通过 `__MESSAGE_FROM_SUB_APP__` 发送消息

主应用定义了 `__MESSAGE_FROM_SUB_APP__` 机制，子应用可以发送特定消息：

```typescript
actions.setGlobalState({
  __MESSAGE_FROM_SUB_APP__: {
    type: 'logout',           // 消息类型
    data: { reason: 'user click logout' }  // 消息数据
  }
});
```

主应用会处理以下消息类型：

| type           | 说明               |
| -------------- | ------------------ |
| `logout`       | 子应用触发退出登录 |
| `update:theme` | 子应用修改主题配置 |

### 3. 封装 `useQiankun` Hook 统一管理

推荐使用项目中封装好的 `useQiankun` Hook：

```typescript
// src/hooks/useQiankun.ts
import { ref, onMounted, onUnmounted } from 'vue';
import { getActions, isInQiankun } from '/@/qiankun/actions';
import type { GlobalState, Message } from '/@/qiankun/communication';

export function useQiankun() {
  const actions = getActions();
  const inQiankun = isInQiankun();

  const goMainApp = () => {
    if (!inQiankun) return;
    (window as any)?.__QIANKUN__?.goMainApp();
  };

  const navigateTo = (path: string) => {
    if (!inQiankun) return;
    (window as any)?.__QIANKUN__?.navigateTo(path);
  };

  const goBack = () => {
    if (!inQiankun) return;
    (window as any)?.__QIANKUN__?.goBack();
  };

  const globalState = ref<GlobalState>({});
  let offChange: (() => void) | null = null;

  onMounted(() => {
    if (!inQiankun || !actions) return;
    actions.onGlobalStateChange((state) => {
      globalState.value = state;
    }, true);
    offChange = actions.offGlobalStateChange;
  });

  function sendMessage<T = any>(type: Message['type'], data?: T) {
    if (!inQiankun || !actions) return;
    actions.setGlobalState({ __MESSAGE_FROM_SUB_APP__: { type, data } });
  }

  function updateGlobalState(state: Partial<GlobalState>) {
    if (!inQiankun || !actions) return;
    actions.setGlobalState(state);
  }

  onUnmounted(() => {
    if (offChange) offChange();
  });

  return {
    goMainApp,
    navigateTo,
    goBack,
    inQiankun,
    globalState,
    sendMessage,
    updateGlobalState,
  };
}
```

### 4. 使用示例

```typescript
import { useQiankun } from '@/hooks/useQiankun';

function MyComponent() {
  const {
    inQiankun,
    globalState,
    goMainApp,
    navigateTo,
    goBack,
    sendMessage,
    updateGlobalState,
  } = useQiankun();

  // globalState 是响应式的，直接使用
  console.log('用户信息:', globalState.value.userInfo);
  console.log('主题配置:', globalState.value.themeConfig);
  console.log('是否在乾坤环境:', inQiankun);

  // 返回主应用
  const backToMain = () => goMainApp();

  // 跳转指定路由
  const goToPage = () => navigateTo('/dashboard');

  // 返回上一页
  const goPrev = () => goBack();

  // 发送消息给主应用
  const logout = () => {
    sendMessage('logout', { reason: 'user click logout' });
  };

  // 更新主应用全局状态
  const updateUser = () => {
    updateGlobalState({ userInfo: { id: 1, name: '新用户' } });
  };

  return (
    <div>
      <p>用户: {globalState.value.userInfo?.name}</p>
      <button onClick={backToMain}>返回主应用</button>
      <button onClick={goToPage}>跳转路由</button>
      <button onClick={goPrev}>返回</button>
      <button onClick={logout}>退出登录</button>
      <button onClick={updateUser}>更新用户</button>
    </div>
  );
}
```

> **注意**：`globalState` 是响应式的，组件挂载后（`onMounted` 后）才能获取到主应用传递的真实数据。如果需要在数据更新时执行操作，推荐使用 `watch` 监听 `globalState` 变化。

---

## 完整流程图

```
┌─────────────────────────────────────────────────────────────┐
│                         主应用                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ micro/actions.ts                                    │    │
│  │ - initGlobalState(initialState)                    │    │
│  │ - registerNavigateCallback(fn)                     │    │
│  │ - registerGoBackCallback(fn)                      │    │
│  │ - onGlobalStateChange(callback)                    │    │
│  └─────────────────────────────────────────────────────┘    │
│                            │                                │
│                            │ window.__QIANKUN__              │
│                            ▼                                │
└─────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                         子应用                               │
│                                                             │
│  获取 Props:                                                │
│    mount(props) → props.userInfos, props.themeConfig        │
│                                                             │
│  监听状态:                                                   │
│    actions.onGlobalStateChange(callback)                   │
│                                                             │
│  更新状态:                                                   │
│    actions.setGlobalState({ userInfo: {...} })            │
│                                                             │
│  导航方法:                                                   │
│    window.__QIANKUN__.navigateTo('/path')                  │
│    window.__QIANKUN__.goBack()                             │
│    window.__QIANKUN__.goMainApp()                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 注意事项

1. **类型安全**：建议在子应用中定义 `GlobalState` 接口，确保类型安全
2. **生命周期**：`onGlobalStateChange` 返回取消订阅函数，组件卸载时记得调用
3. **空值处理**：调用导航方法前使用可选链 `?.` 防止报错
4. **循环监听**：避免在 `onGlobalStateChange` 回调中再次 `setGlobalState`，防止循环触发
