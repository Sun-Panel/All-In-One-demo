/**
 * 上下文信息窗口页面
 * 演示在窗口中展示完整的上下文信息
 */
import { SunPanelPageElement } from '@sun-panel/micro-app';
import { html, css } from 'lit';

export class ContextInfoPage extends SunPanelPageElement {
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
    this._logs = [...this._logs.slice(-19), `[${time}] ${message}`];
  }

  _getRoleName(role) {
    switch(role) {
      case 0: return '公开';
      case 1: return '管理';
      case 2: return '普通';
      default: return '-';
    }
  }

  render() {
    return html`
      <div class="container" ?dark=${this.spCtx?.darkMode}>
        <div class="info-section">
          <h3>上下文属性</h3>
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
          <div class="info-row">
            <span class="label">静态路径:</span>
            <span class="value">${this.spCtx?.staticPath || '-'}</span>
          </div>
        </div>

       
     
        <div class="logs-section">
          <h3>回调日志</h3>
          <div class="logs">
            ${this._logs.map(log => html`<div class="log-item">${log}</div>`)}
          </div>
        </div>
      </div>
    `;
  }

  static styles = css`
    .container {
      height: 100%;
      width: 100%;
    }

    h3 {
      margin: 0 0 12px 0;
      font-size: 14px;
      color: #333;
    }

    .info-section, .widget-section, .api-section, .logs-section {
      background: rgba(0,0,0,0.03);
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 12px;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 12px;
      background: rgba(255,255,255,0.8);
      border-radius: 4px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 12px;
      background: rgba(255,255,255,0.8);
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

    .code-block {
      background: #f8f8f8;
      padding: 12px;
      border-radius: 4px;
      font-size: 11px;
      overflow-x: auto;
      white-space: pre-wrap;
      word-break: break-all;
      margin: 0;
    }

    .api-section ul {
      margin: 0;
      padding-left: 20px;
    }

    .api-section li {
      font-size: 12px;
      margin: 4px 0;
    }

    .api-section code {
      background: rgba(19,194,194,0.1);
      padding: 2px 6px;
      border-radius: 3px;
      font-family: monospace;
    }

    .logs {
      max-height: 150px;
      overflow-y: auto;
      background: rgba(255,255,255,0.8);
      padding: 8px;
      border-radius: 4px;
    }

    .log-item {
      font-size: 11px;
      color: #666;
      padding: 2px 0;
      font-family: monospace;
    }

    /* 深色模式 */
    .container[dark] { background: #1e1e1e; }
    .container[dark] h3 { color: #eee;}
    .container[dark] .info-section,
    .container[dark] .widget-section,
    .container[dark] .api-section,
    .container[dark] .logs-section {
      background: rgba(255,255,255,0.05);
    }
    .container[dark] .info-item,
    .container[dark] .info-row,
    .container[dark] .logs {
      background: rgba(255,255,255,0.1);
    }
    .container[dark] .label { color: #aaa; }
    .container[dark] .value { color: #eee; }
    .container[dark] .code-block { background: rgba(0,0,0,0.3); color: #ddd; }
    .container[dark] .log-item { color: #888; }
  `;
}
