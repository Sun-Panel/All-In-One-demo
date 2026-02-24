# AllInOne Demo AI开发说明 - Sun-Panel微应用 

请先 阅读Sun-Panel微应用 开发文档（目录：sun-panel-doc/docs/v2/zh_cn/micro_app_dev），然后了解其所有的功能特性，然后参照（microapp-hello-world示例微应用）进行开发。

本应用说明：
本应用内要包含微应用开发文档中所有的功能特性。创建（8）个小部件，每个小部件右上角有个悬浮按钮，命名为"说明"。点击这个按钮可以显示当前小部件的一个说明内容。


## 小部件列表

### 1. 上下文信息小部件 (Context Info Widget)
**测试功能**：spCtx 上下文属性、响应式属性变化监听
- 显示 `darkMode` 深色模式状态
- 显示 `language` 当前语言
- 显示 `networkMode` 网络模式
- 显示 `role` 用户角色
- 显示 `staticPath` 静态资源路径
- 测试 `onDarkModeChanged()` 回调
- 测试 `onLanguageChanged()` 回调
- 测试 `onNetworkModeChanged()` 回调
- 支持尺寸：1x1, 1x2, 2x1

### 2. 小部件配置小部件 (Widget Config Widget)
**测试功能**：widgetInfo、配置保存、widget.save API
- 显示当前 `widgetId`
- 显示 `gridSize` 网格尺寸
- 显示用户配置数据 `config`
- 提供配置页面，可设置：
  - 自定义标题
  - 背景颜色
  - 显示/隐藏Logo
- 测试 `widget.save()` 保存配置
- 测试 `onWidgetInfoChanged()` 回调
- 支持尺寸：1x1, 2x2

### 3. 用户缓存小部件 (User Cache Widget)
**测试功能**：localCache.user API
- `localCache.user.set()` - 设置缓存
- `localCache.user.get()` - 获取缓存
- `localCache.user.del()` - 删除缓存
- `localCache.user.clear()` - 清空缓存
- `localCache.user.getKeys()` - 获取所有键
- 支持设置过期时间测试
- 显示缓存内容列表
- 支持尺寸：1x2, 2x2

<!-- ### 4. 应用缓存小部件 (App Cache Widget)
**测试功能**：localCache.app API
- `localCache.app.set()` - 设置应用级缓存
- `localCache.app.get()` - 获取应用级缓存
- `localCache.app.del()` - 删除应用级缓存
- `localCache.app.clear()` - 清空应用级缓存
- `localCache.app.getKeys()` - 获取所有键
- 与用户缓存对比，验证数据隔离
- 支持尺寸：1x2, 2x2 -->

### 5. 数据节点小部件 (Data Node Widget)
**测试功能**：dataNode API、数据节点配置
- `dataNode.user.getByKey()` - 获取用户数据节点
- `dataNode.user.getByKeys()` - 批量获取
- `dataNode.user.setByKey()` - 设置用户数据节点
- `dataNode.user.delByKey()` - 删除用户数据节点
- `dataNode.app.getByKey()` - 获取应用数据节点
- `dataNode.app.setByKey()` - 设置应用数据节点
- 测试不同 scope (app/user) 和 isPublic 配置
- 支持尺寸：2x2, 2x4

### 6. 网络请求小部件 (Network Widget)
**测试功能**：network.request API、权限声明、域名白名单
- `network.request()` 发送网络请求
- 测试 GET/POST 请求
- 测试 `templateReplacements` 模板变量替换
- 测试 `cookieDataNodeKey` cookie自动管理
- 测试请求头设置
- 显示错误类型处理 (`SpNetworkRequestError`)
  - `microApp` 类型错误（权限不足）
  - `targetUrl` 类型错误（目标站点错误）
- 支持尺寸：2x2, 2x4

### 7. 窗口管理小部件 (Window Manager Widget)
**测试功能**：window.open API、页面组件
- `window.open()` 打开新窗口
- 测试 `OpenWindowOptions` 参数：
  - `componentName` 组件名称
  - `windowConfig` 窗口配置（width/height/left/top/isFullScreen/background）
  - `customParam` 自定义参数传递
  - `title` 窗口标题
- 测试页面组件 `onInitialized({ widgetInfo, customParam })` 接收参数
- 测试 `window.close()` 关闭窗口
- 支持尺寸：1x2, 2x2

### 8. 生命周期小部件 (Lifecycle Widget)
**测试功能**：生命周期钩子、多尺寸渲染
- 测试所有生命周期钩子：
  - `constructor()` 实例创建
  - `onConnected()` 连接后
  - `onInitialized()` 初始化完成
  - `render()` 渲染
  - `onFirstRendered()` 首次渲染完成
  - `onDisconnected()` 断开连接
- 测试所有尺寸渲染方法：
  - `render1x1()`
  - `render1x2()`
  - `render2x1()`
  - `render2x2()`
  - `render2x4()`
  - `render1xfull()`
- 显示生命周期执行顺序日志
- 测试 `requestUpdate()` 手动触发渲染
- 支持尺寸：全部 (1x1, 1x2, 2x1, 2x2, 2x4, 1xfull)

---

## 配置要求

### app.config.js 配置

```javascript
export default {
  author: 'sun-panel',
  microAppId: 'sun-panel-all-in-one-demo',
  version: '1.0.0',
  entry: 'main.js',
  icon: 'logo.png',

  appInfo: {
    'zh-CN': {
      appName: 'AllInOne Demo',
      description: '包含所有微应用功能的演示应用',
      networkDescription: '用于测试网络请求功能'
    },
    'en-US': {
      appName: 'AllInOne Demo',
      description: 'Demo app with all micro app features',
      networkDescription: 'For testing network request functionality'
    }
  },

  // 声明所有权限
  permissions: [
    'network',    // 网络请求权限
    'dataNode',   // 数据节点权限
    'iframe'      // iframe权限（如有需要）
  ],

  // 网络域名白名单
  networkDomains: [
    'api.example.com',
    'jsonplaceholder.typicode.com'  // 测试用
  ],

  // 数据节点配置
  dataNodes: {
    // APP级别 - 公开可读
    appConfig: {
      scope: 'app',
      isPublic: true
    },
    // APP级别 - 仅管理员可写
    apiKey: {
      scope: 'app',
      isPublic: false
    },
    // USER级别 - 公开可读
    userSettings: {
      scope: 'user',
      isPublic: true
    },
    // USER级别 - 私有
    privateData: {
      scope: 'user',
      isPublic: false
    },
    // 用于网络请求的配置
    networkConfig: {
      scope: 'user',
      isPublic: false
    },
    // 用于cookie存储
    cookieStore: {
      scope: 'user',
      isPublic: false
    }
  }
};
```

### components.config.js 配置

```javascript
export default {
  // 页面组件
  pages: {
    // 小部件配置页面
    'widget-config-page': {
      component: WidgetConfigPage,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      headerTextColor: '#ffffff',
      type: 'config'
    },
    // 主页面（窗口测试）
    'window-demo-page': {
      component: WindowDemoPage,
      background: '#f5f5f5',
      headerTextColor: '#333333',
      type: 'main'
    },
    // 网络请求详情页面
    'network-detail-page': {
      component: NetworkDetailPage,
      background: '#ffffff',
      headerTextColor: '#333333',
      type: 'main'
    }
  },

  // 小部件组件
  widgets: {
    'context-info-widget': {
      component: ContextInfoWidget,
      size: ['1x1', '1x2', '2x1'],
      background: '',
    },
    'widget-config-widget': {
      component: WidgetConfigWidget,
      configComponentName: 'widget-config-page',
      size: ['1x1', '2x2'],
      background: '',
    },
    'user-cache-widget': {
      component: UserCacheWidget,
      size: ['1x2', '2x2'],
      background: '',
    },
    'app-cache-widget': {
      component: AppCacheWidget,
      size: ['1x2', '2x2'],
      background: '',
    },
    'data-node-widget': {
      component: DataNodeWidget,
      size: ['2x2', '2x4'],
      background: '',
    },
    'network-widget': {
      component: NetworkWidget,
      configComponentName: 'network-detail-page',
      size: ['2x2', '2x4'],
      background: '',
    },
    'window-manager-widget': {
      component: WindowManagerWidget,
      size: ['1x2', '2x2'],
      background: '',
    },
    'lifecycle-widget': {
      component: LifecycleWidget,
      size: ['1x1', '1x2', '2x1', '2x2', '2x4', '1xfull'],
      background: '',
    },
  },
};
```

---

## 开发说明

### 通用组件结构

每个小部件需要：
1. 右上角悬浮"说明"按钮，点击显示该小部件功能说明
2. 支持深色模式 (`:host([dark])` 样式适配)
3. 使用 `getAssetPath()` 获取静态资源路径

### API调用示例

#### 本地缓存
```javascript
// 用户级缓存
await this.spCtx.api.localCache.user.set('key', { data: 'value' }, 3600);
const value = await this.spCtx.api.localCache.user.get('key');
const keys = await this.spCtx.api.localCache.user.getKeys();
await this.spCtx.api.localCache.user.del('key');
await this.spCtx.api.localCache.user.clear();

// 应用级缓存（用法相同）
await this.spCtx.api.localCache.app.set('appKey', { data: 'value' });
```

#### 数据节点
```javascript
// 用户数据节点
const data = await this.spCtx.api.dataNode.user.getByKey('userSettings', 'theme');
const multiData = await this.spCtx.api.dataNode.user.getByKeys('userSettings', ['theme', 'language']);
await this.spCtx.api.dataNode.user.setByKey('userSettings', 'theme', { mode: 'dark' });
await this.spCtx.api.dataNode.user.delByKey('userSettings', 'theme');

// 应用数据节点（用法相同）
await this.spCtx.api.dataNode.app.setByKey('appConfig', 'version', { num: '1.0.0' });
```

#### 网络请求
```javascript
try {
  const response = await this.spCtx.api.network.request({
    targetUrl: 'https://{{domain}}/api/data',
    method: 'GET',
    headers: {
      "Authorization": "Bearer {{token}}"
    },
    templateReplacements: [
      {
        placeholder: '{{token}}',
        fields: ['headers'],
        dataNode: 'networkConfig.token'
      },
      {
        placeholder: '{{domain}}',
        fields: ['targetUrl'],
        dataNode: 'networkConfig.domain'
      }
    ],
    cookieDataNodeKey: 'cookieStore'
  });
} catch (error) {
  if (error.name === 'SpNetworkRequestError') {
    switch (error.type) {
      case 'microApp':
        // 微应用权限错误
        break;
      case 'targetUrl':
        // 目标站点错误
        break;
    }
  }
}
```

#### 窗口管理
```javascript
// 打开窗口
const windowId = this.spCtx.api.window.open({
  componentName: 'window-demo-page',
  title: '窗口演示',
  windowConfig: {
    width: 800,
    height: 600,
    isFullScreen: false,
    background: '#ffffff'
  },
  customParam: { testData: 'hello' }
});

// 关闭窗口（在页面组件内）
this.spCtx.api.window.close();
```

#### 小部件配置保存
```javascript
await this.spCtx.api.widget.save({
  ...this.spCtx.widgetInfo,
  config: {
    customTitle: this.customTitle,
    bgColor: this.bgColor
  },
});
```

### 生命周期回调

```javascript
class MyWidget extends SunPanelWidgetElement {
  constructor() {
    super();
    console.log('constructor');
  }

  onConnected() {
    console.log('onConnected');
  }

  onInitialized() {
    console.log('onInitialized');
  }

  onFirstRendered() {
    console.log('onFirstRendered');
  }

  onWidgetInfoChanged(newInfo, oldInfo) {
    console.log('widgetInfo changed:', newInfo);
  }

  onDarkModeChanged(isDark, oldIsDark) {
    console.log('darkMode changed:', isDark);
  }

  onLanguageChanged(language, oldLanguage) {
    console.log('language changed:', language);
  }

  onNetworkModeChanged(networkMode, oldNetworkMode) {
    console.log('networkMode changed:', networkMode);
  }

  onDisconnected() {
    console.log('onDisconnected - 清理资源');
  }
}
```

### 多尺寸渲染

```javascript
render() {
  const size = this.spCtx.widgetInfo.gridSize;
  
  switch(size) {
    case '1x1': return this.render1x1();
    case '1x2': return this.render1x2();
    case '2x1': return this.render2x1();
    case '2x2': return this.render2x2();
    case '2x4': return this.render2x4();
    case '1xfull': return this.render1xfull();
    default: return this.render2x2();
  }
}

render1x1() {
  return html`<div class="mini">迷你视图</div>`;
}

render2x2() {
  return html`<div class="standard">标准视图</div>`;
}
```

### 深色模式适配

```javascript
static styles = css`
  .container {
    background: #ffffff;
    color: #333333;
  }

  :host([dark]) .container {
    background: #1a1a1a;
    color: #ffffff;
  }
`;
```

---

## 测试清单

- [ ] 上下文信息小部件：验证 darkMode/language/networkMode/role 属性变化监听
- [ ] 小部件配置小部件：验证配置保存和读取
- [ ] 用户缓存小部件：验证所有 localCache.user API
- [ ] 应用缓存小部件：验证所有 localCache.app API
- [ ] 数据节点小部件：验证所有 dataNode API 和权限隔离
- [ ] 网络请求小部件：验证网络请求和错误处理
- [ ] 窗口管理小部件：验证窗口打开/关闭和参数传递
- [ ] 生命周期小部件：验证所有生命周期钩子和多尺寸渲染
