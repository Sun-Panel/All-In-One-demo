/**
 * 窗口管理小部件
 * 测试功能：window.open API、页面组件
 */
import { SunPanelWidgetElement } from '@sun-panel/micro-app';
import { html, css } from 'lit';

export class WindowManagerWidget extends SunPanelWidgetElement {
  static properties = {
    _windowId: { state: true },
    _customParam: { state: true },
    _message: { state: true },
    _showingInfo: { state: true }
  };

  constructor() {
    super();
    this._windowId = '';
    this._customParam = '{"testData": "hello"}';
    this._message = '';
    this._showingInfo = false;
  }

  async _openWindow() {
    try {
      let customParam = {};
      if (this._customParam) {
        try { customParam = JSON.parse(this._customParam); } catch (e) {}
      }
      
      const windowId = this.spCtx.api.window.open({
        // componentName: 'window-demo-page',
        componentName: 'data-node-test-page',
        title: '窗口演示页面',
        windowConfig: {
          width: 600,
          height: 400,
          isFullScreen: false,
          background: '#ffffff'
        },
        customParam
      });
      
      this._windowId = windowId;
      this._showMessage(`窗口已打开: ${windowId}`);
    } catch (e) {
      this._showMessage('打开窗口失败: ' + e.message, true);
    }
  }

  _showMessage(msg, isError = false) {
    this._message = { text: msg, isError };
    setTimeout(() => { this._message = ''; this.requestUpdate(); }, 3000);
  }

  _showInfo() {
    this._showingInfo = !this._showingInfo;
  }

  render() {
    const size = this.spCtx?.widgetInfo?.gridSize || '2x2';
    
    if (size === '1x2') return this._render1x2();
    return this._render2x2();
  }

  _render1x2() {
    return html`
      <div class="container">
        <div class="header">
          <span class="title">窗口管理</span>
          <button class="info-btn" @click=${this._showInfo}>说明</button>
        </div>
        <div class="compact-content">
          <button class="btn primary" @click=${this._openWindow}>打开窗口</button>
          ${this._windowId ? html`<div class="window-id">ID: ${this._windowId}</div>` : ''}
        </div>
        ${this._showingInfo ? this._renderInfoPanel() : ''}
      </div>
    `;
  }

  _render2x2() {
    return html`
      <div class="container">
        <div class="header">
          <span class="title">窗口管理小部件</span>
          <button class="info-btn" @click=${this._showInfo}>说明</button>
        </div>
        <div class="form-section">
          <label>自定义参数 (JSON)</label>
          <textarea .value=${this._customParam}
            @input=${(e) => this._customParam = e.target.value}></textarea>
          
          <div class="btn-group">
            <button class="btn primary" @click=${this._openWindow}>
              打开窗口
            </button>
          </div>
        </div>
        
        <div class="info-section">
          <div class="info-row">
            <span class="label">组件名:</span>
            <span class="value">window-demo-page</span>
          </div>
          <div class="info-row">
            <span class="label">当前窗口ID:</span>
            <span class="value mono">${this._windowId || '-'}</span>
          </div>
        </div>
        
        <div class="form-section">
          <label>自定义参数 (JSON)</label>
          <textarea .value=${this._customParam}
            @input=${(e) => this._customParam = e.target.value}></textarea>
          
          <div class="btn-group">
            <button class="btn primary" @click=${this._openWindow}>
              打开窗口
            </button>
          </div>
        </div>
        
        <div class="options-info">
          <div class="section-title">OpenWindowOptions 参数:</div>
          <ul>
            <li><code>componentName</code> - 组件名称</li>
            <li><code>title</code> - 窗口标题</li>
            <li><code>windowConfig</code> - 窗口配置</li>
            <li><code>customParam</code> - 自定义参数</li>
          </ul>
        </div>
        
        ${this._message ? html`<div class="message ${this._message.isError ? 'error' : ''}">${this._message.text}</div>` : ''}
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
          <p><strong>测试功能：</strong>window.open API、页面组件</p>
          <ul>
            <li>window.open() 打开新窗口</li>
            <li>测试 OpenWindowOptions 参数：</li>
            <li style="padding-left: 20px;">- componentName 组件名称</li>
            <li style="padding-left: 20px;">- windowConfig 窗口配置</li>
            <li style="padding-left: 20px;">- customParam 自定义参数传递</li>
            <li style="padding-left: 20px;">- title 窗口标题</li>
            <li>测试页面组件 onInitialized() 接收参数</li>
            <li>测试 window.close() 关闭窗口</li>
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
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
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
    
    .info-section {
      background: rgba(0,0,0,0.05);
      border-radius: 4px;
      padding: 8px;
      margin-bottom: 12px;
    }
    
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      font-size: 12px;
    }
    
    .label { color: #666; }
    .value { color: #333; font-weight: 500; }
    .value.mono { font-family: monospace; font-size: 10px; }
    
    .form-section { margin-bottom: 12px; }
    
    .form-section label {
      display: block;
      font-size: 12px;
      color: #666;
      margin-bottom: 6px;
    }
    
    textarea {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 11px;
      min-height: 60px;
      resize: vertical;
      box-sizing: border-box;
      margin-bottom: 8px;
    }
    
    .btn-group {
      display: flex;
      gap: 8px;
    }
    
    .btn {
      flex: 1;
      padding: 8px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    }
    
    .btn.primary { background: #13c2c2; color: white; }
    .btn.primary:hover { background: #36cfc9; }
    
    .compact-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 20px 0;
    }
    
    .compact-content .btn {
      width: 80%;
    }
    
    .window-id {
      font-size: 10px;
      color: #999;
      font-family: monospace;
    }
    
    .options-info {
      background: rgba(19,194,194,0.1);
      border-radius: 4px;
      padding: 8px;
    }
    
    .section-title {
      font-size: 11px;
      color: #666;
      margin-bottom: 6px;
    }
    
    .options-info ul {
      margin: 0;
      padding-left: 16px;
      font-size: 11px;
    }
    
    .options-info li {
      margin: 2px 0;
      color: #666;
    }
    
    .options-info code {
      background: rgba(0,0,0,0.1);
      padding: 1px 4px;
      border-radius: 2px;
      font-family: monospace;
    }
    
    .message {
      position: absolute;
      bottom: 12px;
      left: 12px;
      right: 12px;
      padding: 6px 12px;
      background: #e6fffb;
      border: 1px solid #b5f5ec;
      border-radius: 4px;
      font-size: 11px;
      color: #13c2c2;
    }
    
    .message.error {
      background: #fff2f0;
      border-color: #ffccc7;
      color: #ff4d4f;
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
    
    :host([dark]) .title { color: #fff; }
    :host([dark]) .value { color: #eee; }
    :host([dark]) .label { color: #aaa; }
    :host([dark]) .info-section { background: rgba(255,255,255,0.1); }
    :host([dark]) .textarea { background: #333; border-color: #555; color: #fff; }
    :host([dark]) .options-info { background: rgba(19,194,194,0.2); }
    :host([dark]) .options-info code { background: rgba(255,255,255,0.1); }
    :host([dark]) .info-btn { background: rgba(255,255,255,0.1); color: #ccc; }
    :host([dark]) .info-panel { background: rgba(30,30,30,0.98); }
  `;
}
