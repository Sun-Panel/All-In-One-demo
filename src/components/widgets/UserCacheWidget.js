/**
 * 用户缓存小部件
 * 测试功能：localCache.user API
 */
import { SunPanelWidgetElement } from '@sun-panel/micro-app';
import { html, css } from 'lit';

export class UserCacheWidget extends SunPanelWidgetElement {
  static properties = {
    _showingInfo: { state: true }
  };

  constructor() {
    super();
    this._showingInfo = false;
  }

  // 模拟缓存key和值
  get _mockKey() {
    return 'test_cache_key';
  }

  get _mockValue() {
    return { name: '测试数据', "test": { "testKey": "testValue" }, timestamp: Date.now() };
  }

  onInitialized() {
    this._log('用户缓存小部件初始化完成');
  }

  async _setCache() {
    try {
      const key = this._mockKey;
      const value = this._mockValue;
      await this.spCtx.api.localCache.user.set(key, value);
      this._log(`设置缓存成功 - key: ${key}, value:`, value);
    } catch (e) {
      this._log('设置缓存失败:', e.message);
    }
  }

  async _getCache() {
    try {
      const key = this._mockKey;
      const value = await this.spCtx.api.localCache.user.get(key);
      this._log(`获取缓存 - key: ${key}, value:`, value);
    } catch (e) {
      this._log('获取缓存失败:', e.message);
    }
  }

  async _setCacheWithExpire() {
    try {
      const key = this._mockKey;
      const value = this._mockValue;
      const expire = 30; // 30秒过期
      await this.spCtx.api.localCache.user.set(key, value, expire);
      this._log(`设置缓存成功(30s过期) - key: ${key}, value:`, value);
    } catch (e) {
      this._log('设置缓存失败:', e.message);
    }
  }

  async _delCache() {
    try {
      const key = this._mockKey;
      await this.spCtx.api.localCache.user.del(key);
      this._log(`删除缓存成功 - key: ${key}`);
    } catch (e) {
      this._log('删除缓存失败:', e.message);
    }
  }

  async _clearCache() {
    try {
      await this.spCtx.api.localCache.user.clear();
      this._log('清空所有缓存成功');
    } catch (e) {
      this._log('清空缓存失败:', e.message);
    }
  }

  async _getKeys() {
    try {
      const keys = await this.spCtx.api.localCache.user.getKeys();
      this._log('获取所有keys:', keys);
    } catch (e) {
      this._log('获取keys失败:', e.message);
    }
  }

  async _createMultipleData() {
    try {
      const dataCount = 5;
      for (let i = 1; i <= dataCount; i++) {
        const key = `mock_data_${i}`;
        const value = {
          id: i,
          name: `模拟数据${i}`,
          timestamp: Date.now()
        };
        await this.spCtx.api.localCache.user.set(key, value);
        this._log(`创建缓存 - key: ${key}, value:`, value);
      }
      this._log(`成功创建${dataCount}条模拟数据`);
    } catch (e) {
      this._log('创建模拟数据失败:', e.message);
    }
  }

  _log(...params) {
    console.log(`UserCacheWidget-ItemId-${this.spCtx.widgetInfo.id}:`, ...params);
  }

  _showInfo() {
    this._showingInfo = !this._showingInfo;
  }

  _renderInfoPanel() {
    return html`
      <div class="info-panel">
        <div class="info-panel-header">
          <span>功能说明</span>
          <button class="close-btn" @click=${this._showInfo}>×</button>
        </div>
        <div class="info-panel-content">
          <p>此组件演示了用户缓存功能，调用了以下方法：</p>
          <ul>
            <li><code>localCache.user.set()</code> - 设置缓存</li>
            <li><code>localCache.user.get()</code> - 获取缓存</li>
            <li><code>localCache.user.del()</code> - 删除缓存</li>
            <li><code>localCache.user.clear()</code> - 清空缓存</li>
            <li><code>localCache.user.getKeys()</code> - 获取所有键</li>
          </ul>
          <p>所有实时调试内容可以结合代码和F12浏览器调试工具查看。</p>
          <p><strong>用户级别 vs 应用级别：</strong></p>
          <ul>
            <li>用户级别：<code>this.spCtx.api.localCache.user.xxx</code> - 数据在账号之间隔离</li>
            <li>应用级别：<code>this.spCtx.api.localCache.app.xxx</code> - 数据在任意账号间可读取</li>
          </ul>
        </div>
      </div>
    `;
  }

  render() {
    return html`
      <div 
        class="container" 
        ?dark=${this.spCtx.darkMode}
      >
        <div class="header">
          <span>用户缓存测试 (F12 浏览器调试工具查看)</span>
          <button class="info-btn" @click=${this._showInfo}>说明</button>
        </div>
        <div class="btn-group">
          <button class="btn primary" @click=${this._setCache}>设置缓存</button>
          <button class="btn" @click=${this._getCache}>获取缓存</button>
          <button class="btn warning" @click=${this._setCacheWithExpire}>设置缓存(30s)</button>
          <button class="btn danger" @click=${this._delCache}>删除缓存</button>
          <button class="btn success" @click=${this._createMultipleData}>创建模拟数据</button>
          <button class="btn" @click=${this._getKeys}>获取所有Key</button>
          <button class="btn danger" @click=${this._clearCache}>清空所有key</button>
        </div>
        ${this._showingInfo ? this._renderInfoPanel() : ''}
      </div>
    `;
  }

  static styles = css`
    .container {
      padding: 12px;
      height: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      position: relative;
      background: white;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      font-size: 14px;
      font-weight: 600;
      color: #333;
    }

    .info-btn {
      background: rgba(0,0,0,0.1);
      border: none;
      border-radius: 4px;
      padding: 2px 8px;
      font-size: 12px;
      cursor: pointer;
      color: #666;
    }

    .btn-group {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: center;
    }

    .btn {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      background: white;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.2s;
      flex: 0 0 calc(33.33% - 6px);
      max-width: 120px;
    }

    .btn:hover {
      background: #f5f5f5;
    }

    .btn.primary {
      background: #1890ff;
      border-color: #1890ff;
      color: white;
    }

    .btn.primary:hover {
      background: #40a9ff;
    }

    .btn.warning {
      background: #faad14;
      border-color: #faad14;
      color: white;
    }

    .btn.warning:hover {
      background: #ffc53d;
    }

    .btn.danger {
      background: #ff4d4f;
      border-color: #ff4d4f;
      color: white;
    }

    .btn.danger:hover {
      background: #ff7875;
    }

    .btn.success {
      background: #52c41a;
      border-color: #52c41a;
      color: white;
    }

    .btn.success:hover {
      background: #73d13d;
    }

    .container[dark] .header {
      color: #fff;
    }

    .container[dark] .btn {
      background: #333;
      border-color: #555;
      color: #ccc;
    }

    .container[dark] .btn:hover {
      background: #444;
    }

    .container[dark] .btn.primary {
      background: #1890ff;
      border-color: #1890ff;
      color: white;
    }

    .container[dark] .btn.warning {
      background: #faad14;
      border-color: #faad14;
      color: white;
    }

    .container[dark] .btn.danger {
      background: #ff4d4f;
      border-color: #ff4d4f;
      color: white;
    }

    .container[dark] .btn.success {
      background: #52c41a;
      border-color: #52c41a;
      color: white;
    }

    .container[dark] .info-btn {
      background: rgba(255,255,255,0.1);
      color: #ccc;
    }

    .info-panel {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255,255,255,0.98);
      z-index: 10;
      padding: 12px;
      overflow-y: auto;
    }

    .info-panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      font-weight: 600;
      font-size: 14px;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      color: #666;
    }

    .info-panel-content {
      font-size: 12px;
      line-height: 1.6;
    }

    .info-panel-content ul {
      margin: 8px 0;
      padding-left: 20px;
    }

    .info-panel-content li {
      margin: 4px 0;
    }

    .info-panel-content code {
      background: #f5f5f5;
      padding: 2px 4px;
      border-radius: 3px;
      font-size: 11px;
    }

    .container[dark] {
      background: #333;
      color: #ccc;
    }

    .container[dark] .info-panel {
      background: rgba(30,30,30,0.98);
      color: #ccc;
    }

    .container[dark] .info-panel-content code {
      background: #333;
    }
  `;
}
