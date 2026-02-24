/**
 * 组件配置文件
 * AllInOne Demo - 包含所有微应用功能的演示应用
 */

// Widgets
import { ContextInfoWidget } from '../src/components/widgets/ContextInfoWidget.js';
import { CounterWidget } from '../src/components/widgets/CounterWidget.js';
import { UserCacheWidget } from '../src/components/widgets/UserCacheWidget.js';
import { DataNodeWidget } from '../src/components/widgets/DataNodeWidget.js';
import { NetworkWidget } from '../src/components/widgets/NetworkWidget.js';
import { WindowManagerWidget } from '../src/components/widgets/WindowManagerWidget.js';
import { LifecycleWidget } from '../src/components/widgets/LifecycleWidget.js';

// Pages
import { CounterWidgetConfigPage } from '../src/components/pages/CounterWidgetConfigPage.js';
import { WindowDemoPage } from '../src/components/pages/WindowDemoPage.js';
import { DataNodeTestPage } from '../src/components/pages/DataNodeTestPage.js';


export default {
  // =======================
  // 页面注册
  // =======================
  pages: {
    // 小部件配置页面
    'counter-widget-config-page': {
      component: CounterWidgetConfigPage,
      background: '#ffffff',
      headerTextColor: 'black',
      type: 'config'
    },
    // 窗口演示页面
    'window-demo-page': {
      component: WindowDemoPage,
      background: '#ffffff',
      headerTextColor: '#333333',
      type: 'main'
    },
    "data-node-test-page": {
      component: DataNodeTestPage,
      background: '#ffffff',
      headerTextColor: '#333333',
      type: 'main'
    }
  },

  // =======================
  // 小部件（卡片）注册
  // =======================
  widgets: {
    // 1. 上下文信息小部件
    'context-info-widget': {
      component: ContextInfoWidget,
      size: ['2x4'],
      background: ''
    },
    // 2. 小部件配置小部件
    'counter-widget': {
      component: CounterWidget,
      configComponentName: 'counter-widget-config-page',
      size: ['1x1', '2x2'],
      background: ''
    },
    // 3. 用户缓存小部件
    'user-cache-widget': {
      component: UserCacheWidget,
      size: ['2x4'],
      background: ''
    },
    // // 4. 应用缓存小部件
    // 'app-cache-widget': {
    //   component: AppCacheWidget,
    //   size: ['2x4'],
    //   background: ''
    // },
    // 5. 数据节点小部件
    'data-node-widget': {
      component: DataNodeWidget,
      size: ['2x2', '2x4'],
      background: ''
    },
    // 6. 网络请求小部件
    'network-widget': {
      component: NetworkWidget,
      size: ['2x2', '2x4'],
      background: ''
    },
    // 7. 窗口管理小部件
    'window-manager-widget': {
      component: WindowManagerWidget,
      size: ['1x2', '2x2'],
      background: 'white'
    },
    // 8. 生命周期小部件
    'lifecycle-widget': {
      component: LifecycleWidget,
      size: ['1x1', '1x2', '2x1', '2x2', '2x4', '1xfull'],
      background: ''
    }
  }
};
