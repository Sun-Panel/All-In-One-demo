/**
 * 微应用配置文件
 * AllInOne Demo - 包含所有微应用功能的演示应用
 */

export default {
  // =======================
  // 应用基础信息
  // =======================
  author: 'sun-panel',
  microAppId: 'sun-panel-all-in-one-demo',
  version: '1.0.0',
  entry: 'main.js',
  icon: 'logo.png',

  // 应用信息 国际化配置
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

  // 权限配置
  permissions: [
    'network',    // 网络请求权限
    'dataNode',   // 数据节点权限
    'iframe'      // iframe权限
  ],

  // 网络域名白名单
  networkDomains: [
    'api.example.com',
    'jsonplaceholder.typicode.com'
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
