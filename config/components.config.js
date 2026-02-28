/**
 * 组件配置文件
 * AllInOne Demo - 包含所有微应用功能的演示应用
 */

// Widgets
import { ContextInfoWidget } from '../src/components/widgets/ContextInfoWidget.js';
import { CounterWidget } from '../src/components/widgets/CounterWidget.js';
import { UserCacheWidget } from '../src/components/widgets/UserCacheWidget.js';
import { NetworkWidget } from '../src/components/widgets/NetworkWidget.js';
import { WindowManagerWidget } from '../src/components/widgets/WindowManagerWidget.js';
import { LifecycleWidget } from '../src/components/widgets/LifecycleWidget.js';
import { OtherWidget } from '../src/components/widgets/OtherWidget.js';

// Pages
import { CounterWidgetConfigPage } from '../src/components/pages/CounterWidgetConfigPage.js';
import { WindowDemoPage } from '../src/components/pages/WindowDemoPage.js';
import { DataNodeTestPage } from '../src/components/pages/DataNodeTestPage.js';
import { NetworkTestPage } from '../src/components/pages/NetworkTestPage.js';


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
      type: 'config',
      resize: true,
      move: true,
      background: '#ffffff',
      showMask: false,
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
    },
    "network-test-page": {
      component: NetworkTestPage,
      background: '#ffffff',
      headerTextColor: '#333333',
      type: 'main'
    }
  },

  // =======================
  // 小部件（卡片）注册
  // =======================
  widgets: {
    // 上下文信息小部件
    'context-info-widget': {
      component: ContextInfoWidget,
      size: ['2x4'],
      background: ''
    },
    
    // 计数器小部件
    'counter-widget': {
      component: CounterWidget,
      configComponentName: 'counter-widget-config-page',
      size: ['1x1', '2x2'],
      background: ''
    },

    // 用户缓存小部件
    'user-cache-widget': {
      component: UserCacheWidget,
      size: ['2x4'],
      background: ''
    },

    // 其他小组件
    'other-widget': {
      component: OtherWidget,
      size: ['2x4'],
      background: 'white'
    },

    // 网络请求小部件
    'network-widget': {
      component: NetworkWidget,
      size: ['2x4'],
      background: ''
    },

    // 窗口管理小部件
    'window-manager-widget': {
      component: WindowManagerWidget,
      size: ['2x4'],
      background: 'white'
    },

    // 生命周期小部件
    'lifecycle-widget': {
      component: LifecycleWidget,
      size: ['2x4'],
      background: ''
    }
  }
};
