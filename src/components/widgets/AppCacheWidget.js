/**
 * 应用缓存小部件
 * 测试功能：localCache.app API
 */
import { SunPanelWidgetElement } from '@sun-panel/micro-app';
import { html, css } from 'lit';

export class AppCacheWidget extends SunPanelWidgetElement {
  static properties = {
    _keys: { state: true },
    _inputKey: { state: true },
    _inputValue: { state: true },
    _message: { state: true },
    _showingInfo: { state: true }
  };

  constructor() {
    super();
    this._keys = [];
    this._inputKey = '';
    this._inputValue = '';
    this._message = '';
    this._showingInfo = false;
  }

  onInitialized() {
    this._refreshKeys();
  }

  async _refreshKeys() {
    try {
      this._keys = await this.spCtx.api.localCache.app.getKeys() || [];
    } catch (e) {
      this._showMessage('获取键列表失败: ' + e.message, true);
    }
  }

  async _setCache() {
    if (!this._inputKey) {
      this._showMessage('请输入键名', true);
      return;
    }
    try {
      await this.spCtx.api.localCache.app.set(this._inputKey, this._inputValue);
      this._showMessage('设置成功');
      this._refreshKeys();
    } catch (e) {
      this._showMessage('设置失败: ' + e.message, true);
    }
  }

  async _getCache(key) {
    try {
      const value = await this.spCtx.api.localCache.app.get(key);
      this._showMessage(`获取 "${key}": ${JSON.stringify(value)}`);
    } catch (e) {
      this._showMessage('获取失败: ' + e.message, true);
    }
  }

  async _delCache(key) {
    try {
      await this.spCtx.api.localCache.app.del(key);
      this._showMessage('删除成功');
      this._refreshKeys();
    } catch (e) {
      this._showMessage('删除失败: ' + e.message, true);
    }
  }

  async _clearCache() {
    try {
      await this.spCtx.api.localCache.app.clear();
      this._showMessage('清空成功');
      this._refreshKeys();
    } catch (e) {
      this._showMessage('清空失败: ' + e.message, true);
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
          <span class="title">应用缓存</span>
          <button class="info-btn" @click=${this._showInfo}>说明</button>
        </div>
        <div class="compact-form">
          <input type="text" placeholder="键名" .value=${this._inputKey}
            @input=${(e) => this._inputKey = e.target.value}>
          <input type="text" placeholder="值" .value=${this._inputValue}
            @input=${(e) => this._inputValue = e.target.value}>
          <button @click=${this._setCache}>设置</button>
        </div>
        <div class="keys-list">
          ${this._keys.length === 0 ? html`<div class="empty">暂无缓存</div>` :
            this._keys.map(key => html`
              <div class="key-item">
                <span class="key-name">${key}</span>
                <div class="key-actions">
                  <button @click=${() => this._getCache(key)}>查</button>
                  <button @click=${() => this._delCache(key)}>删</button>
                </div>
              </div>
            `)}
        </div>
        ${this._message ? html`<div class="message ${this._message.isError ? 'error' : ''}">${this._message.text}</div>` : ''}
        ${this._showingInfo ? this._renderInfoPanel() : ''}
      </div>
    `;
  }

  _render2x2() {
    return html`
      <div class="container">
        <div class="header">
          <span class="title">应用缓存小部件</span>
          <button class="info-btn" @click=${this._showInfo}>说明</button>
        </div>
        
        <div class="notice">
          应用级缓存：所有用户共享数据
        </div>
        
        <div class="form-section">
          <div class="form-row">
            <input type="text" placeholder="键名" .value=${this._inputKey}
              @input=${(e) => this._inputKey = e.target.value}>
            <input type="text" placeholder="值" .value=${this._inputValue}
              @input=${(e) => this._inputValue = e.target.value}>
          </div>
          <div class="form-actions">
            <button class="btn primary" @click=${this._setCache}>设置缓存</button>
            <button class="btn danger" @click=${this._clearCache}>清空全部</button>
          </div>
        </div>
        
        <div class="keys-section">
          <div class="section-title">缓存键列表 (${this._keys.length})</div>
          <div class="keys-list">
            ${this._keys.length === 0 ? html`<div class="empty">暂无缓存数据</div>` :
              this._keys.map(key => html`
                <div class="key-item">
                  <span class="key-name">${key}</span>
                  <div class="key-actions">
                    <button class="btn-small" @click=${() => this._getCache(key)}>获取</button>
                    <button class="btn-small danger" @click=${() => this._delCache(key)}>删除</button>
                  </div>
                </div>
              `)}
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
          <p><strong>测试功能：</strong>localCache.app API</p>
          <ul>
            <li>localCache.app.set() - 设置应用级缓存</li>
            <li>localCache.app.get() - 获取应用级缓存</li>
            <li>localCache.app.del() - 删除应用级缓存</li>
            <li>localCache.app.clear() - 清空应用级缓存</li>
            <li>localCache.app.getKeys() - 获取所有键</li>
            <li>与用户缓存对比，验证数据隔离</li>
          </ul>
          <p style="margin-top: 12px; color: #666;">
            注意：应用级缓存是所有用户共享的，与用户级缓存数据隔离
          </p>
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
    
    .notice {
      padding: 6px 10px;
      background: #e6f7ff;
      border: 1px solid #91d5ff;
      border-radius: 4px;
      font-size: 11px;
      color: #1890ff;
      margin-bottom: 12px;
    }
    
    .form-section { margin-bottom: 12px; }
    
    .form-row {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
    }
    
    .form-row input {
      flex: 1;
      padding: 6px 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 12px;
    }
    
    .form-actions {
      display: flex;
      gap: 8px;
    }
    
    .btn {
      flex: 1;
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    }
    
    .btn.primary { background: #722ed1; color: white; }
    .btn.primary:hover { background: #9254de; }
    .btn.danger { background: #ff4d4f; color: white; }
    .btn.danger:hover { background: #ff7875; }
    
    .section-title {
      font-size: 12px;
      color: #666;
      margin-bottom: 8px;
    }
    
    .keys-section {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    
    .keys-list {
      flex: 1;
      overflow-y: auto;
      background: rgba(114,46,209,0.05);
      border-radius: 4px;
      padding: 4px;
    }
    
    .key-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 8px;
      background: white;
      border-radius: 4px;
      margin-bottom: 4px;
    }
    
    .key-name {
      font-size: 12px;
      font-family: monospace;
      color: #333;
    }
    
    .key-actions {
      display: flex;
      gap: 4px;
    }
    
    .btn-small {
      padding: 2px 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
      font-size: 11px;
      cursor: pointer;
    }
    
    .btn-small.danger { color: #ff4d4f; border-color: #ff4d4f; }
    
    .compact-form {
      display: flex;
      gap: 4px;
      margin-bottom: 8px;
    }
    
    .compact-form input {
      flex: 1;
      padding: 4px 6px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 11px;
    }
    
    .compact-form button {
      padding: 4px 8px;
      background: #722ed1;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 11px;
      cursor: pointer;
    }
    
    .empty {
      text-align: center;
      color: #999;
      font-size: 12px;
      padding: 12px;
    }
    
    .message {
      position: absolute;
      bottom: 12px;
      left: 12px;
      right: 12px;
      padding: 6px 12px;
      background: #f6ffed;
      border: 1px solid #b7eb8f;
      border-radius: 4px;
      font-size: 11px;
      color: #52c41a;
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
    :host([dark]) .key-name { color: #eee; }
    :host([dark]) .notice { background: rgba(114,46,209,0.2); border-color: #722ed1; }
    :host([dark]) .form-row input { background: #333; border-color: #555; color: #fff; }
    :host([dark]) .keys-list { background: rgba(255,255,255,0.05); }
    :host([dark]) .key-item { background: #333; }
    :host([dark]) .btn-small { background: #444; border-color: #555; color: #ccc; }
    :host([dark]) .info-btn { background: rgba(255,255,255,0.1); color: #ccc; }
    :host([dark]) .info-panel { background: rgba(30,30,30,0.98); }
  `;
}
