/**
 * 上下文信息小部件
 * 测试功能：spCtx 上下文属性、响应式属性变化监听
 */
import { SunPanelWidgetElement } from '@sun-panel/micro-app';
import { html, css } from 'lit';

export class ContextInfoWidget extends SunPanelWidgetElement {
  static properties = {
    _logs: { state: true }
  };

  constructor() {
    super();
    this._logs = [];
  }

  onInitialized() {
    this._addLog('onInitialized');
  }

  onConnected() {
    this._addLog('onConnected');
  }

  onFirstRendered() {
    this._addLog('onFirstRendered');
  }

  onDarkModeChanged(isDark, oldIsDark) {
    this._addLog(`darkMode: ${oldIsDark} -> ${isDark}`);
    this.requestUpdate();
  }

  onLanguageChanged(language, oldLanguage) {
    this._addLog(`language: ${oldLanguage} -> ${language}`);
    this.requestUpdate();
  }

  onNetworkModeChanged(networkMode, oldNetworkMode) {
    this._addLog(`networkMode: ${oldNetworkMode} -> ${networkMode}`);
    this.requestUpdate();
  }

  _addLog(message) {
    const time = new Date().toLocaleTimeString();
    this._logs = [...this._logs.slice(-9), `[${time}] ${message}`];
  }

  _showInfo() {
    this._showingInfo = !this._showingInfo;
    this.requestUpdate();
  }

  render() {
    const size = this.spCtx?.widgetInfo?.gridSize || '2x4';
    
    return this._render2x4();
  }

  _render2x4() {
    return html`
      <div class="container" ?dark=${this.spCtx?.darkMode}>
        <div class="header">
          <span class="title">上下文信息演示</span>
          <button class="info-btn" @click=${this._showInfo}>说明</button>
        </div>
        <div class="content">
          <div class="info-grid">
            <div class="info-item">
              <span class="label">深色模式</span>
              <span class="value">${this.spCtx?.darkMode ? '是' : '否'}</span>
            </div>
            <div class="info-item">
              <span class="label">语言</span>
              <span class="value">${this.spCtx?.language || '-'}</span>
            </div>
            <div class="info-item">
              <span class="label">网络模式</span>
              <span class="value">${this.spCtx?.networkMode || '-'}</span>
            </div>
            <div class="info-item">
              <span class="label">用户角色</span>
              <span class="value">${this._getRoleName(this.spCtx?.role)}</span>
            </div>
          </div>
          <div class="static-path">
            <span class="label">静态路径:</span>
            <span class="value small">${this.spCtx?.staticPath || '-'}</span>
          </div>
          <div class="logs">
            <div class="logs-title">回调日志:</div>
            ${this._logs.map(log => html`<div class="log-item">${log}</div>`)}
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
          <p><strong>测试功能：</strong>spCtx 上下文属性、响应式属性变化监听</p>
          <ul>
            <li>显示 darkMode 深色模式状态</li>
            <li>显示 language 当前语言</li>
            <li>显示 networkMode 网络模式</li>
            <li>显示 role 用户角色</li>
            <li>显示 staticPath 静态资源路径</li>
            <li>测试 onDarkModeChanged() 回调</li>
            <li>测试 onLanguageChanged() 回调</li>
            <li>测试 onNetworkModeChanged() 回调</li>
          </ul>
        </div>
      </div>
    `;
  }

  _getRoleName(role) {
    switch(role) {
      case 0: return '公开';
      case 1: return '私有';
      case 2: return '管理员';
      default: return '-';
    }
  }

  static styles = css`
    .container {
      padding: 12px;
      height: 100%;
      box-sizing: border-box;
      position: relative;
      overflow: hidden;
      background: #fff;
      display: flex;
      flex-direction: column;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .content {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: 5px;
      overflow-y: auto;
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
    
    .info-btn:hover {
      background: rgba(0,0,0,0.2);
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    
    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 6px 8px;
      background: rgba(0,0,0,0.05);
      border-radius: 4px;
    }
    
    .label {
      color: #666;
      font-size: 12px;
    }
    
    .value {
      color: #333;
      font-size: 12px;
      font-weight: 500;
    }
    
    .value.small {
      font-size: 10px;
      word-break: break-all;
    }
    
    .horizontal-info {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
    
    .horizontal-info .info-item {
      background: transparent;
      padding: 0;
    }
    
    .static-path {
      padding: 8px;
      background: rgba(0,0,0,0.05);
      border-radius: 4px;
    }
    
    .logs {
      flex: 1;
      min-height: 60px;
      overflow-y: auto;
      padding: 8px;
      background: rgba(0,0,0,0.03);
      border-radius: 4px;
    }
    
    .logs-title {
      font-size: 12px;
      color: #666;
      margin-bottom: 4px;
    }
    
    .log-item {
      font-size: 10px;
      color: #999;
      padding: 2px 0;
    }
    
    .mini-info div {
      font-size: 12px;
      padding: 2px 0;
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
      display: flex;
      flex-direction: column;
    }
    
    .info-panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      font-weight: 600;
      flex-shrink: 0;
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
      overflow-y: auto;
      flex: 1;
    }
    
    .info-panel-content ul {
      margin: 8px 0;
      padding-left: 20px;
    }
    
    .info-panel-content li {
      margin: 4px 0;
    }
    
    .container[dark] { background: #333; }
    .container[dark] .title { color: #fff; }
    .container[dark] .value { color: #eee; }
    .container[dark] .label { color: #aaa; }
    .container[dark] .info-item { background: rgba(255,255,255,0.1); }
    .container[dark] .static-path { background: rgba(255,255,255,0.1); }
    .container[dark] .info-btn { background: rgba(255,255,255,0.1); color: #ccc; }
    .container[dark] .info-panel { background: rgba(30,30,30,0.98); color: #ccc; }
    .container[dark] .log-item { color: #777; }
    .container[dark] .mini-info div { color: #eee; }
  `;
}
