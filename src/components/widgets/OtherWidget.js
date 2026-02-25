/**
 * 其他功能小部件
 * 测试功能：打开数据节点测试窗口、打开网络透传测试窗口
 */
import { SunPanelWidgetElement } from '@sun-panel/micro-app';
import { html, css } from 'lit';

export class OtherWidget extends SunPanelWidgetElement {
  static properties = {
    _message: { state: true }
  };

  constructor() {
    super();
    this._message = '';
  }

  async _openDataNodeWindow() {
    try {
      const windowId = this.spCtx.api.window.open({
        componentName: 'data-node-test-page',
        title: '数据节点测试',
        windowConfig: {
          width: 700,
          height: 500,
          isFullScreen: false,
          background: '#ffffff'
        }
      });
      this._showMessage(`数据节点测试窗口已打开`);
    } catch (e) {
      this._showMessage('打开窗口失败: ' + e.message, true);
    }
  }

  async _openNetworkWindow() {
    try {
      const windowId = this.spCtx.api.window.open({
        componentName: 'network-test-page',
        title: '网络透传测试',
        windowConfig: {
          width: 600,
          height: 500,
          isFullScreen: false,
          background: '#ffffff'
        }
      });
      this._showMessage(`网络透传测试窗口已打开`);
    } catch (e) {
      this._showMessage('打开窗口失败: ' + e.message, true);
    }
  }

  _showMessage(msg, isError = false) {
    this._message = { text: msg, isError };
    setTimeout(() => { this._message = ''; this.requestUpdate(); }, 3000);
  }

  render() {
    return html`
      <div class="container">
        <div class="header">
          <span class="title">数据节点、网络透传演示</span>
        </div>
        <div class="description">由于这两项内容较多，不适合小部件形式演示，便以窗口页面的形式展示。</div>
        <div class="button-group">
          <button class="btn primary" @click=${this._openDataNodeWindow}>
            打开数据节点测试窗口
          </button>
          <button class="btn secondary" @click=${this._openNetworkWindow}>
            打开网络透传测试窗口
          </button>
        </div>
        ${this._message ? html`<div class="message ${this._message.isError ? 'error' : ''}">${this._message.text}</div>` : ''}
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
      margin-bottom: 16px;
    }

    .description {
      font-size: 12px;
      color: #666;
      margin-bottom: 16px;
    }
    
    .title { font-size: 14px; font-weight: 600; color: #333; }
    
    .button-group {
      display: flex;
      gap: 12px;
    }
    
    .btn {
      width: 100%;
      padding: 14px 16px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      transition: all 0.2s;
    }
    
    .btn.primary { 
      background: #13c2c2; 
      color: white; 
    }
    .btn.primary:hover { 
      background: #36cfc9; 
    }
    
    .btn.secondary { 
      background: #fa8c16; 
      color: white; 
    }
    .btn.secondary:hover { 
      background: #ffa940; 
    }
    
    .message {
      position: absolute;
      bottom: 12px;
      left: 12px;
      right: 12px;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
    }
    
    .message:not(.error) {
      background: #e6fffb;
      border: 1px solid #b5f5ec;
      color: #13c2c2;
    }
    
    .message.error {
      background: #fff2f0;
      border: 1px solid #ffccc7;
      color: #ff4d4f;
    }
    
    :host([dark]) .title { color: #fff; }
    :host([dark]) .btn.primary { background: #13c2c2; }
    :host([dark]) .btn.secondary { background: #fa8c16; }
    :host([dark]) .message { background: rgba(255,255,255,0.1); border-color: #555; }
  `;
}
