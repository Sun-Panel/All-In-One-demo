/**
 * 生命周期小部件
 * 测试功能：生命周期钩子、多尺寸渲染
 */
import { SunPanelWidgetElement } from '@sun-panel/micro-app';
import { html, css } from 'lit';

export class LifecycleWidget extends SunPanelWidgetElement {
  static properties = {
    _logs: { state: true },
    _renderCount: { state: true },
    _showingInfo: { state: true }
  };

  constructor() {
    super();
    this._logs = [];
    this._renderCount = 0;
    this._showingInfo = false;
    this._addLog('constructor');
  }

  onConnected() {
    this._addLog('onConnected');
  }

  onInitialized() {
    this._addLog('onInitialized');
  }

  onFirstRendered() {
    this._addLog('onFirstRendered');
  }

  onDisconnected() {
    this._addLog('onDisconnected - 清理资源');
  }

  onWidgetInfoChanged(newInfo, oldInfo) {
    this._addLog(`onWidgetInfoChanged: ${oldInfo?.gridSize} -> ${newInfo?.gridSize}`);
    this.requestUpdate();
  }

  onDarkModeChanged(isDark, oldIsDark) {
    this._addLog(`onDarkModeChanged: ${oldIsDark} -> ${isDark}`);
  }

  onLanguageChanged(language, oldLanguage) {
    this._addLog(`onLanguageChanged: ${oldLanguage} -> ${language}`);
  }

  onNetworkModeChanged(networkMode, oldNetworkMode) {
    this._addLog(`onNetworkModeChanged: ${oldNetworkMode} -> ${networkMode}`);
  }

  _addLog(message) {
    const time = new Date().toLocaleTimeString();
    this._logs = [...this._logs, { time, message }].slice(-1000);
  }

  _showInfo() {
    this._showingInfo = !this._showingInfo;
  }

  _manualUpdate() {
    this._addLog('requestUpdate() 手动触发');
    this.requestUpdate();
  }

  render() {
    this._renderCount++;
    const size = this.spCtx?.widgetInfo?.gridSize || '2x2';
    
    switch(size) {
      case '1x1': return this._render1x1();
      case '1x2': return this._render1x2();
      case '2x1': return this._render2x1();
      case '2x2': return this._render2x2();
      case '2x4': return this._render2x4();
      case '1xfull': return this._render1xfull();
      default: return this._render2x2();
    }
  }

  _renderSizeIndicator(size) {
    return html`
      <div class="size-badge">${size}</div>
    `;
  }

  _renderLogs(maxHeight = '100px') {
    return html`
      <div class="logs-section" style="max-height: ${maxHeight}">
        <div class="logs-title">生命周期日志 (${this._logs.length})</div>
        <div class="logs-list">
          ${this._logs.slice().reverse().map(log => html`
            <div class="log-item">
              <span class="log-time">${log.time}</span>
              <span class="log-msg">${log.message}</span>
            </div>
          `)}
        </div>
      </div>
    `;
  }

  // _render1x1() {
  //   return html`
  //     <div class="container mini" ?dark=${this.spCtx.darkMode}>
  //       <div class="header">
  //         <span class="title">生命周期</span>
  //         <button class="info-btn" @click=${this._showInfo}>?</button>
  //       </div>
  //       ${this._renderSizeIndicator('1x1')}
  //       <div class="mini-stats">
  //         <div>渲染: ${this._renderCount}次</div>
  //       </div>
  //       ${this._showingInfo ? this._renderInfoPanel() : ''}
  //     </div>
  //   `;
  // }

  // _render1x2() {
  //   return html`
  //     <div class="container compact" ?dark=${this.spCtx.darkMode}>
  //       <div class="header">
  //         <span class="title">生命周期小部件</span>
  //         <button class="info-btn" @click=${this._showInfo}>说明</button>
  //       </div>
  //       ${this._renderSizeIndicator('1x2')}
  //       <div class="stats">
  //         <div class="stat-item">
  //           <span class="stat-value">${this._renderCount}</span>
  //           <span class="stat-label">渲染次数</span>
  //         </div>
  //         <div class="stat-item">
  //           <span class="stat-value">${this._logs.length}</span>
  //           <span class="stat-label">日志条数</span>
  //         </div>
  //       </div>
  //       ${this._renderLogs('60px')}
  //       ${this._showingInfo ? this._renderInfoPanel() : ''}
  //     </div>
  //   `;
  // }

  // _render2x1() {
  //   return html`
  //     <div class="container horizontal" ?dark=${this.spCtx.darkMode}>
  //       <div class="header">
  //         <span class="title">生命周期小部件</span>
  //         <button class="info-btn" @click=${this._showInfo}>说明</button>
  //       </div>
  //       ${this._renderSizeIndicator('2x1')}
  //       <div class="h-content">
  //         <div class="h-stats">
  //           <span>渲染: ${this._renderCount}次</span>
  //           <span>日志: ${this._logs.length}条</span>
  //         </div>
  //         <button class="btn small" @click=${this._manualUpdate}>手动更新</button>
  //       </div>
  //       ${this._showingInfo ? this._renderInfoPanel() : ''}
  //     </div>
  //   `;
  // }

  // _render2x2() {
  //   return html`
  //     <div class="container" ?dark=${this.spCtx.darkMode}>
  //       <div class="header">
  //         <span class="title">生命周期小部件</span>
  //         <button class="info-btn" @click=${this._showInfo}>说明</button>
  //       </div>
  //       ${this._renderSizeIndicator('2x2')}
  //       <div class="stats">
  //         <div class="stat-item">
  //           <span class="stat-value">${this._renderCount}</span>
  //           <span class="stat-label">渲染次数</span>
  //         </div>
  //         <div class="stat-item">
  //           <span class="stat-value">${this._logs.length}</span>
  //           <span class="stat-label">日志条数</span>
  //         </div>
  //       </div>
  //       <button class="btn" @click=${this._manualUpdate}>手动触发 requestUpdate()</button>
  //       ${this._renderLogs('80px')}
  //       ${this._showingInfo ? this._renderInfoPanel() : ''}
  //     </div>
  //   `;
  // }

  _render2x4() {
    return html`
      <div class="container large" ?dark=${this.spCtx.darkMode}>
        <div class="header">
          <span class="title">生命周期演示</span>
          <button class="info-btn" @click=${this._showInfo}>说明</button>
        </div>
        <div class="two-columns">
          <div class="column">
            <div class="stats">
              <div class="stat-item">
                <span class="stat-label">渲染次数</span>
                <span class="stat-value">${this._renderCount}</span>
              </div>
            </div>
            <button class="btn" @click=${this._manualUpdate}>手动触发 requestUpdate()</button>
          </div>
          <div class="column">
            ${this._renderLogs('200px')}
          </div>
        </div>
        ${this._showingInfo ? this._renderInfoPanel() : ''}
      </div>
    `;
  }

  _render1xfull() {
    return html`
      <div class="container full" ?dark=${this.spCtx.darkMode}>
        <div class="header">
          <span class="title">生命周期小部件</span>
          <button class="info-btn" @click=${this._showInfo}>说明</button>
        </div>
        ${this._renderSizeIndicator('1xfull')}
        <div class="full-content">
          <div class="stats">
            <div class="stat-item">
              <span class="stat-value">${this._renderCount}</span>
              <span class="stat-label">渲染次数</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">${this._logs.length}</span>
              <span class="stat-label">日志条数</span>
            </div>
          </div>
          <button class="btn" @click=${this._manualUpdate}>手动触发 requestUpdate()</button>
          ${this._renderLogs('150px')}
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
          <p><strong>测试功能：</strong>生命周期钩子、多尺寸渲染</p>
          <p><strong>测试所有生命周期钩子：</strong></p>
          <ul>
            <li>constructor() - 实例创建</li>
            <li>onConnected() - 连接后</li>
            <li>onInitialized() - 初始化完成</li>
            <li>render() - 渲染</li>
            <li>onFirstRendered() - 首次渲染完成</li>
            <li>onDisconnected() - 断开连接</li>
          </ul>
          <p><strong>支持所有尺寸渲染：</strong></p>
          <ul>
            <li>render1x1(), render1x2(), render2x1()</li>
            <li>render2x2(), render2x4(), render1xfull()</li>
          </ul>
          <p><strong>其他测试：</strong></p>
          <ul>
            <li>显示生命周期执行顺序日志</li>
            <li>测试 requestUpdate() 手动触发渲染</li>
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
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    
    .title { font-size: 14px; font-weight: 600; color: #333; }
    
    .info-btn {
      background: rgba(0,0,0,0.1);
      border: none;
      border-radius: 4px;
      padding: 2px 8px;
      font-size: 12px;
      cursor: pointer;
      color: #666;
    }
    
    .size-badge {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    
    .stats {
      display: flex;
      gap: 10px;
      margin-bottom: 12px;
    }
    
    .stat-item {
      display: flex;
      align-items: center;
      background: rgba(102,126,234,0.1);
      padding: 8px 16px;
      border-radius: 8px;
      gap: 8px;
    }
    
    .stat-value {
      font-size: 20px;
      font-weight: 700;
      color: #667eea;
    }
    
    .stat-label {
      font-size: 10px;
      color: #666;
    }
    
    .btn {
      width: 100%;
      padding: 8px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      margin-bottom: 12px;
    }
    
    .btn.small {
      padding: 4px 12px;
      width: auto;
      margin-bottom: 0;
    }
    
    .logs-section {
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    
    .logs-title {
      font-size: 11px;
      color: #666;
      margin-bottom: 6px;
    }
    
    .logs-list {
      flex: 1;
      overflow-y: auto;
      background: rgba(0,0,0,0.05);
      border-radius: 4px;
      padding: 6px;
    }
    
    .log-item {
      font-size: 10px;
      padding: 3px 0;
      border-bottom: 1px solid rgba(0,0,0,0.05);
    }
    
    .log-time {
      color: #999;
      margin-right: 6px;
    }
    
    .log-msg {
      color: #333;
    }
    
    .mini-stats {
      text-align: center;
      font-size: 12px;
      color: #666;
    }
    
    .h-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .h-stats {
      display: flex;
      gap: 16px;
      font-size: 12px;
      color: #666;
    }
    
    .two-columns {
      display: flex;
      gap: 12px;
      flex: 1;
      overflow-y: auto;
      min-height: 0;
    }
    
    .column {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    
    .full-content {
      display: flex;
      flex-direction: column;
      max-width: 300px;
    }
    
    .info-panel {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255,255,255,0.98);
      z-index: 1;
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
    
    .container[dark] { background: #333; color: #ccc; }
    .container[dark] .title { color: #fff; }
    .container[dark] .stat-value { color: #a3a3ff; }
    .container[dark] .stat-item { background: rgba(102,126,234,0.2); }
    .container[dark] .stat-label { color: #aaa; }
    .container[dark] .logs-list { background: rgba(255,255,255,0.1); }
    .container[dark] .log-item { border-color: rgba(255,255,255,0.1); }
    .container[dark] .log-msg { color: #eee; }
    .container[dark] .info-btn { background: rgba(255,255,255,0.1); color: #ccc; }
    .container[dark] .info-panel { background: rgba(30,30,30,0.98); }
    .container[dark] .btn { background: #444; color: #fff; }
    .container[dark] .mini-stats { color: #aaa; }
    .container[dark] .h-stats { color: #aaa; }
    .container[dark] .close-btn { color: #aaa; }
  `;
}
