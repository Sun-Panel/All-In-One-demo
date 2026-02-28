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
    _showingInfo: { state: true },
    _windowConfig: { state: true }
  };

  constructor() {
    super();
    this._windowId = '';
    this._customParam = '{"testData": "hello"}';
    this._message = '';
    this._showingInfo = false;
    this._windowConfig = {
      width: 800,
      height: 600,
      background: '#ffffff',
      headerTextColor: '#333333',
      showFullscreenBtn: false,
      resize: true,
      move: true
    };
  }

  async _openWindow() {
    try {
      let customParam = {};
      if (this._customParam) {
        try { customParam = JSON.parse(this._customParam); } catch (e) {}
      }
      
      const windowId = this.spCtx.api.window.open({
        componentName: 'window-demo-page',
        title: '窗口演示页面',
        // 窗口配置，可以不填，不填将使用默认配置
        windowConfig: {
          width: this._windowConfig.width,
          height: this._windowConfig.height,
          background: this._windowConfig.background,
          headerTextColor: this._windowConfig.headerTextColor,
          showFullscreenBtn: this._windowConfig.showFullscreenBtn,
          resize: this._windowConfig.resize,
          move: this._windowConfig.move,
          showMask: false,
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
          <span class="title">窗口管理演示</span>
          <button class="info-btn" @click=${this._showInfo}>说明</button>
        </div>
        
        <div class="config-section">
          <div class="section-title">窗口配置</div>
          <div class="config-row">
            <div class="config-item">
              <label>宽度</label>
              <input type="number" .value=${String(this._windowConfig.width)}
                @input=${(e) => this._windowConfig = {...this._windowConfig, width: parseInt(e.target.value) || 800}}>
            </div>
            <div class="config-item">
              <label>高度</label>
              <input type="number" .value=${String(this._windowConfig.height)}
                @input=${(e) => this._windowConfig = {...this._windowConfig, height: parseInt(e.target.value) || 600}}>
            </div>
            <div class="config-item">
              <label>背景颜色</label>
              <input type="color" .value=${this._windowConfig.background}
                @input=${(e) => this._windowConfig = {...this._windowConfig, background: e.target.value}}>
            </div>
            <div class="config-item">
              <label>标题文字颜色</label>
              <input type="color" .value=${this._windowConfig.headerTextColor}
                @input=${(e) => this._windowConfig = {...this._windowConfig, headerTextColor: e.target.value}}>
            </div>
          </div>
          <div class="config-row">
            <div class="config-item checkbox">
              <label>
                <input type="checkbox" ?checked=${this._windowConfig.showFullscreenBtn}
                  @change=${(e) => this._windowConfig = {...this._windowConfig, showFullscreenBtn: e.target.checked}}>
                显示全屏按钮
              </label>
            </div>
            <div class="config-item checkbox">
              <label>
                <input type="checkbox" ?checked=${this._windowConfig.resize}
                  @change=${(e) => this._windowConfig = {...this._windowConfig, resize: e.target.checked}}>
                可调整大小
              </label>
            </div>
            <div class="config-item checkbox">
              <label>
                <input type="checkbox" ?checked=${this._windowConfig.move}
                  @change=${(e) => this._windowConfig = {...this._windowConfig, move: e.target.checked}}>
                可移动
              </label>
            </div>
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
          </ul>
        </div>
      </div>
    `;
  }

  static styles = css`
    .container {
      padding: 8px;
      height: 100%;
      box-sizing: border-box;
      position: relative;
      overflow-y: auto;
      overflow-x: hidden;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    
    .title { font-size: 13px; font-weight: 600; color: #333; }
    
    .info-btn {
      background: rgba(0,0,0,0.1);
      border: none;
      border-radius: 4px;
      padding: 1px 6px;
      font-size: 11px;
      cursor: pointer;
      color: #666;
    }
    
    .info-section {
      background: rgba(0,0,0,0.05);
      border-radius: 4px;
      padding: 6px;
      margin-bottom: 8px;
    }
    
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 2px 0;
      font-size: 11px;
    }
    
    .label { color: #666; }
    .value { color: #333; font-weight: 500; }
    .value.mono { font-family: monospace; font-size: 10px; }
    
    .form-section { margin-bottom: 8px; }
    
    .form-section label {
      display: block;
      font-size: 11px;
      color: #666;
      margin-bottom: 4px;
    }
    
    .config-section {
      background: rgba(0,0,0,0.05);
      border-radius: 4px;
      padding: 6px;
      margin-bottom: 8px;
    }
    
    .config-row {
      display: flex;
      gap: 6px;
      margin-bottom: 6px;
    }
    
    .config-row:last-child {
      margin-bottom: 0;
    }
    
    .config-item {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    
    .config-item.checkbox {
      flex-direction: row;
      align-items: center;
    }
    
    .config-item label {
      font-size: 10px;
      color: #666;
      margin-bottom: 2px;
    }
    
    .config-item.checkbox label {
      margin-bottom: 0;
      display: flex;
      align-items: center;
      gap: 3px;
      font-size: 11px;
    }
    
    .config-item input[type="number"] {
      width: 100%;
      padding: 3px 4px;
      border: 1px solid #ddd;
      border-radius: 3px;
      font-size: 11px;
      box-sizing: border-box;
    }
    
    .config-item input[type="color"] {
      width: 100%;
      height: 24px;
      padding: 1px;
      border: 1px solid #ddd;
      border-radius: 3px;
      box-sizing: border-box;
    }
    
    .config-item input[type="checkbox"] {
      width: 12px;
      height: 12px;
    }
    
    textarea {
      width: 100%;
      padding: 6px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 10px;
      min-height: 50px;
      resize: vertical;
      box-sizing: border-box;
      margin-bottom: 6px;
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
      position: fixed;
      bottom: 8px;
      left: 8px;
      right: 8px;
      padding: 4px 8px;
      background: #e6fffb;
      border: 1px solid #b5f5ec;
      border-radius: 4px;
      font-size: 10px;
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
      padding: 8px;
      overflow-y: auto;
    }
    
    .info-panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      font-weight: 600;
      font-size: 12px;
    }
    
    .close-btn {
      background: none;
      border: none;
      font-size: 16px;
      cursor: pointer;
      color: #666;
    }
    
    .info-panel-content {
      font-size: 11px;
      line-height: 1.5;
    }
    
    .info-panel-content ul {
      margin: 6px 0;
      padding-left: 16px;
    }
    
    .info-panel-content li { margin: 3px 0; }
  `;
}
