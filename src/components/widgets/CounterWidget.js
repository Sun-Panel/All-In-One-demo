/**
 * 自增计数器小部件
 * 功能演示：按钮点击自增，支持用户级/应用级缓存
 */
import { SunPanelWidgetElement } from '@sun-panel/micro-app';
import { html, css } from 'lit';

export class CounterWidget extends SunPanelWidgetElement {
  static properties = {
    _step: { state: true },
    _cacheScope: { state: true },
    _count: { state: true },
    _showingInfo: { state: true }
  };

  // 判断是否为暗色模式
  _isDark() {
    const bg = this.spCtx?.widgetInfo?.background;
    return bg === '' || bg === 'black' || bg === 'transparent';
  }

  constructor() {
    super();
    this._step = 1;
    this._cacheScope = 'user';
    this._count = 0;
    this._showingInfo = false;
  }

  async onInitialized() {
    console.log('WidgetConfigWidget onInitialized');
    await this._loadConfig();
    await this._loadCount();
  }

  onWidgetInfoChanged(newInfo, oldInfo) {
    console.log('WidgetConfigWidget onWidgetInfoChanged', newInfo, oldInfo);
    if (newInfo?.config) {
      this._step = newInfo.config.step || 1;
      this._cacheScope = newInfo.config.cacheScope || 'user';

      // 如果缓存范围改变，将重新读取计数值
      if (oldInfo?.config.cacheScope !== newInfo.config.cacheScope) {
        this._loadCount();
      }
    }

  }

  async _loadConfig() {
    if (this.spCtx?.widgetInfo?.config) {
      const config = this.spCtx.widgetInfo.config;
      this._step = config.step || 1;
      this._cacheScope = config.cacheScope || 'user';
    }
  }

  async _loadCount() {
    try {
      const cacheKey = 'counter';
      const api = this._cacheScope === 'user'
        ? this.spCtx.api.localCache.user
        : this.spCtx.api.localCache.app;
      console.log(this._cacheScope)
      const data = await api.get(cacheKey);
      if (data !== null && data !== undefined) {
        this._count = typeof data === 'object' ? data.count || 0 : data;
      }
    } catch (e) {
      console.log('Load count error:', e);
    }
  }

  async _increment() {
    this._count += this._step;
    await this._saveCount();
  }

  async _reset() {
    this._count = 0;
    await this._saveCount();
    // this._showMessage('已重置');
  }

  async _saveCount() {
    try {
      const cacheKey = 'counter';
      const api = this._cacheScope === 'user'
        ? this.spCtx.api.localCache.user
        : this.spCtx.api.localCache.app;
      await api.set(cacheKey, { count: this._count, scope: this._cacheScope });
    } catch (e) {
      // this._showMessage('保存失败: ' + e.message);
    }
  }

  _showInfo() {
    this._showingInfo = !this._showingInfo;
  }

  _openConfig() {
    this.spCtx.api.window.open({
      componentName: 'widget-config-page',
      title: '自增计数器配置',
      windowConfig: {
        width: 500,
        height: 500,
        background: '#ffffff'
      }
    });
  }

  render() {
    console.log("我render了")
    const size = this.spCtx?.widgetInfo?.gridSize || '2x2';

    if (size === '1x1') return this._render1x1();
    return this._render2x2();
  }

  _render1x1() {
    return html`
      <div class="container mini" 
       ?dark=${this._isDark()}
       @click=${this._increment}>
        <div class="mini-count">${this._count}</div>
      </div>
    `;
  }

  _render2x2() {
    return html`
      <div class="container" ?dark=${this._isDark()}>
        <div class="header">
          <span class="title">自增计数器</span>
          <button class="info-btn" @click=${this._showInfo}>说明</button>
        </div>
        
        <div class="counter-section">
          <div class="counter-header">
            <span>计数器</span>
            <span class="cache-badge ${this._cacheScope}">${this._cacheScope === 'user' ? '用户级缓存' : '应用级缓存'}</span>
          </div>
          <div class="count-display">${this._count}</div>          
          <div class="counter-actions">
            <button class="btn primary" @click=${this._increment}>
              点击 +${this._step}
            </button>
            <button class="btn" @click=${this._reset}>
              重置
            </button>
          </div>
        </div>
        
        ${this._showingInfo ? this._renderInfoPanel() : ''}
      </div>
    `;
  }

  _renderInfoPanel() {
    return html`
      <div class="info-panel">
        <div class="info-panel-header">
          <span>功能说明</span>
          <button class="close-btn" @click=${this._showInfo}>×</button>
        </div>
        <div class="info-panel-content">
          <p><strong>测试功能：</strong>widgetInfo、配置读取和保存、widget.save API、localCache.user/app.get/set API</p>
          <p><strong>功能演示：</strong></p>
          <ul>
            <li>点击按钮实现自增计数</li>
            <li>自增步进数值可配置</li>
            <li>支持用户级/应用级缓存切换</li>
            <li>计数值根据缓存方案存储</li>
          </ul>
        </div>
      </div>
    `;
  }

  static styles = css`
    .container {
      padding: 12px;
      height: 100%;
      box-sizing: border-box;
      position: relative;
      display: flex;
      flex-direction: column;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    
    .title {
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
    
    .cache-badge {
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 500;
    }
    
    .cache-badge.user {
      background: #e6f7ff;
      color: #1890ff;
    }
    
    .cache-badge.app {
      background: #f9f0ff;
      color: #722ed1;
    }
    
    .counter-section {
      flex: 1;
      padding: 8px;
      background: rgba(0,0,0,0.05);
      border-radius: 8px;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    
    .counter-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      font-size: 12px;
      color: #666;
    }
    
    .count-display {
      font-size: 30px;
      font-weight: 700;
      color: #1890ff;
      /* margin: 8px 0; */
    }
    
    .counter-info {
      font-size: 10px;
      color: #999;
      margin-bottom: 12px;
    }
    
    .data-source {
      font-size: 11px;
      color: #aaa;
      font-weight: 400;
      margin-left: 4px;
    }
    
    .counter-actions {
      display: flex;
      gap: 8px;
      justify-content: center;
    }
    
    .btn {
      padding: 2px 8px;
      border: 1px solid #ddd;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
    }
    
    .btn.primary {
      background: #1890ff;
      color: white;
      border-color: #1890ff;
    }
    
    .btn.primary:hover {
      background: #40a9ff;
    }
    
    .config-btn {
      width: 100%;
      padding: 10px;
      margin-top: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
    }
    
    .config-btn:hover {
      opacity: 0.9;
    }
    
    /* 1x1 迷你模式 */
    .container.mini {
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      user-select: none;
      transition: background 0.2s;
    }
    
    .container.mini:hover {
      background: rgba(24, 144, 255, 0.1);
    }
    
    .container.mini:active {
      background: rgba(24, 144, 255, 0.2);
    }
    
    .mini-count {
      font-size: 48px;
      font-weight: 700;
      color: #1890ff;
    }
    
    .mini-message {
      position: absolute;
      bottom: 8px;
      left: 8px;
      right: 8px;
      padding: 4px;
      background: rgba(82, 196, 26, 0.9);
      border-radius: 4px;
      font-size: 10px;
      color: white;
      text-align: center;
    }
    
    .message {
      position: absolute;
      bottom: 60px;
      left: 12px;
      right: 12px;
      padding: 8px;
      background: #f6ffed;
      border: 1px solid #b7eb8f;
      border-radius: 4px;
      font-size: 12px;
      color: #52c41a;
      text-align: center;
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
    
    .info-panel-content li { margin: 4px 0; }
    
    /* 暗色模式 */
    .container[dark] .title { color: #fff; }
    .container[dark] .counter-header { color: #aaa; }
    .container[dark] .count-display { color: #40a9ff; }
    .container[dark] .counter-info { color: #777; }
    .container[dark] .btn { background: #333; border-color: #555; color: #ccc; }
    .container[dark] .info-btn { background: rgba(255,255,255,0.1); color: #ccc; }
    .container[dark] .info-panel { background: rgba(30,30,30,0.98); color: #ccc; }
    .container[dark] .cache-badge.user { background: rgba(24,144,255,0.2); }
    .container[dark] .cache-badge.app { background: rgba(114,46,209,0.2); }
    .container[dark] .mini-count { color: #40a9ff; }
    .container[dark] .container.mini:hover { background: rgba(64, 169, 255, 0.1); }
    .container[dark] .container.mini:active { background: rgba(64, 169, 255, 0.2); }
  `;
}
