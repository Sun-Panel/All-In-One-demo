/**
 * 数据节点小部件
 * 测试功能：dataNode API、数据节点配置
 */
import { SunPanelWidgetElement } from '@sun-panel/micro-app';
import { html, css } from 'lit';

export class DataNodeWidget extends SunPanelWidgetElement {
  static properties = {
    _nodeKey: { state: true },
    _dataKey: { state: true },
    _dataValue: { state: true },
    _scope: { state: true },
    _nodeKey2: { state: true },
    _dataKeys: { state: true },
    _results: { state: true },
    _message: { state: true },
    _showingInfo: { state: true }
  };

  constructor() {
    super();
    this._nodeKey = 'userSettings';
    this._dataKey = '';
    this._dataValue = '';
    this._scope = 'user';
    this._nodeKey2 = 'userSettings';
    this._dataKeys = '';
    this._results = [];
    this._message = '';
    this._showingInfo = false;
  }

  _showMessage(msg, isError = false) {
    this._message = { text: msg, isError };
    setTimeout(() => { this._message = ''; this.requestUpdate(); }, 4000);
  }

  _getApi() {
    return this._scope === 'user' ? this.spCtx.api.dataNode.user : this.spCtx.api.dataNode.app;
  }

  async _getByKey() {
    if (!this._nodeKey || !this._dataKey) {
      this._showMessage('请输入节点名和数据键', true);
      return;
    }
    try {
      const api = this._getApi();
      const data = await api.getByKey(this._nodeKey, this._dataKey);
      this._results = [...this._results, {
        action: `getByKey(${this._nodeKey}, ${this._dataKey})`,
        result: data,
        time: new Date().toLocaleTimeString()
      }].slice(-10);
      this._showMessage('获取成功');
    } catch (e) {
      this._showMessage('获取失败: ' + e.message, true);
    }
  }

  async _getByKeys() {
    if (!this._nodeKey2 || !this._dataKeys) {
      this._showMessage('请输入节点名和数据键(逗号分隔)', true);
      return;
    }
    try {
      const api = this._getApi();
      const keys = this._dataKeys.split(',').map(k => k.trim());
      const data = await api.getByKeys(this._nodeKey2, keys);
      this._results = [...this._results, {
        action: `getByKeys(${this._nodeKey2}, [${keys.join(',')}])`,
        result: data,
        time: new Date().toLocaleTimeString()
      }].slice(-10);
      this._showMessage('批量获取成功');
    } catch (e) {
      this._showMessage('批量获取失败: ' + e.message, true);
    }
  }

  async _setByKey() {
    if (!this._nodeKey || !this._dataKey) {
      this._showMessage('请输入节点名和数据键', true);
      return;
    }
    try {
      const api = this._getApi();
      let value = this._dataValue;
      try { value = JSON.parse(this._dataValue); } catch (e) { /* keep as string */ }
      await api.setByKey(this._nodeKey, this._dataKey, value);
      this._showMessage('设置成功');
    } catch (e) {
      this._showMessage('设置失败: ' + e.message, true);
    }
  }

  async _delByKey() {
    if (!this._nodeKey || !this._dataKey) {
      this._showMessage('请输入节点名和数据键', true);
      return;
    }
    try {
      const api = this._getApi();
      await api.delByKey(this._nodeKey, this._dataKey);
      this._showMessage('删除成功');
    } catch (e) {
      this._showMessage('删除失败: ' + e.message, true);
    }
  }

  _showInfo() {
    this._showingInfo = !this._showingInfo;
  }

  render() {
    const size = this.spCtx?.widgetInfo?.gridSize || '2x2';
    
    if (size === '2x2') return this._render2x2();
    return this._render2x4();
  }

  _render2x2() {
    return html`
      <div class="container">
        <div class="header">
          <span class="title">数据节点小部件</span>
          <button class="info-btn" @click=${this._showInfo}>说明</button>
        </div>
        
        <div class="scope-toggle">
          <button class="${this._scope === 'user' ? 'active' : ''}"
            @click=${() => { this._scope = 'user'; }}>用户级</button>
          <button class="${this._scope === 'app' ? 'active' : ''}"
            @click=${() => { this._scope = 'app'; }}>应用级</button>
        </div>
        
        <div class="form-section">
          <div class="form-row">
            <input type="text" placeholder="节点名" .value=${this._nodeKey}
              @input=${(e) => this._nodeKey = e.target.value}>
            <input type="text" placeholder="数据键" .value=${this._dataKey}
              @input=${(e) => this._dataKey = e.target.value}>
          </div>
          <input type="text" placeholder="数据值 (JSON或字符串)" .value=${this._dataValue}
            @input=${(e) => this._dataValue = e.target.value}>
          <div class="form-actions">
            <button class="btn" @click=${this._getByKey}>获取</button>
            <button class="btn primary" @click=${this._setByKey}>设置</button>
            <button class="btn danger" @click=${this._delByKey}>删除</button>
          </div>
        </div>
        
        <div class="results">
          ${this._results.slice(-3).map(r => html`
            <div class="result-item">
              <div class="result-action">${r.time} ${r.action}</div>
              <div class="result-data">${JSON.stringify(r.result)}</div>
            </div>
          `)}
        </div>
        
        ${this._message ? html`<div class="message ${this._message.isError ? 'error' : ''}">${this._message.text}</div>` : ''}
        ${this._showingInfo ? this._renderInfoPanel() : ''}
      </div>
    `;
  }

  _render2x4() {
    return html`
      <div class="container large">
        <div class="header">
          <span class="title">数据节点小部件</span>
          <button class="info-btn" @click=${this._showInfo}>说明</button>
        </div>
        
        <div class="scope-toggle">
          <button class="${this._scope === 'user' ? 'active' : ''}"
            @click=${() => { this._scope = 'user'; }}>用户级</button>
          <button class="${this._scope === 'app' ? 'active' : ''}"
            @click=${() => { this._scope = 'app'; }}>应用级</button>
        </div>
        
        <div class="two-columns">
          <div class="column">
            <div class="section-title">单个操作</div>
            <div class="form-section">
              <div class="form-row">
                <input type="text" placeholder="节点名" .value=${this._nodeKey}
                  @input=${(e) => this._nodeKey = e.target.value}>
                <input type="text" placeholder="数据键" .value=${this._dataKey}
                  @input=${(e) => this._dataKey = e.target.value}>
              </div>
              <input type="text" placeholder="数据值 (JSON或字符串)" .value=${this._dataValue}
                @input=${(e) => this._dataValue = e.target.value}>
              <div class="form-actions">
                <button class="btn" @click=${this._getByKey}>获取</button>
                <button class="btn primary" @click=${this._setByKey}>设置</button>
                <button class="btn danger" @click=${this._delByKey}>删除</button>
              </div>
            </div>
          </div>
          
          <div class="column">
            <div class="section-title">批量获取</div>
            <div class="form-section">
              <input type="text" placeholder="节点名" .value=${this._nodeKey2}
                @input=${(e) => this._nodeKey2 = e.target.value}>
              <input type="text" placeholder="数据键 (逗号分隔)" .value=${this._dataKeys}
                @input=${(e) => this._dataKeys = e.target.value}>
              <button class="btn primary full" @click=${this._getByKeys}>批量获取</button>
            </div>
          </div>
        </div>
        
        <div class="results-section">
          <div class="section-title">操作结果</div>
          <div class="results">
            ${this._results.length === 0 ? html`<div class="empty">暂无操作结果</div>` :
              this._results.map(r => html`
                <div class="result-item">
                  <div class="result-action">${r.time} ${r.action}</div>
                  <div class="result-data">${JSON.stringify(r.result, null, 2)}</div>
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
          <p><strong>测试功能：</strong>dataNode API、数据节点配置</p>
          <ul>
            <li>dataNode.user.getByKey() - 获取用户数据节点</li>
            <li>dataNode.user.getByKeys() - 批量获取</li>
            <li>dataNode.user.setByKey() - 设置用户数据节点</li>
            <li>dataNode.user.delByKey() - 删除用户数据节点</li>
            <li>dataNode.app.getByKey() - 获取应用数据节点</li>
            <li>dataNode.app.setByKey() - 设置应用数据节点</li>
            <li>测试不同 scope (app/user) 和 isPublic 配置</li>
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
    
    .container.large {
      padding: 12px;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
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
    
    .scope-toggle {
      display: flex;
      gap: 4px;
      margin-bottom: 10px;
    }
    
    .scope-toggle button {
      flex: 1;
      padding: 6px;
      border: 1px solid #ddd;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    }
    
    .scope-toggle button.active {
      background: #52c41a;
      color: white;
      border-color: #52c41a;
    }
    
    .form-section { margin-bottom: 10px; }
    
    .form-row {
      display: flex;
      gap: 8px;
      margin-bottom: 6px;
    }
    
    .form-section input {
      width: 100%;
      padding: 6px 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 11px;
      margin-bottom: 6px;
      box-sizing: border-box;
    }
    
    .form-actions {
      display: flex;
      gap: 6px;
    }
    
    .btn {
      flex: 1;
      padding: 6px 8px;
      border: 1px solid #ddd;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      font-size: 11px;
    }
    
    .btn.primary { background: #52c41a; color: white; border-color: #52c41a; }
    .btn.danger { color: #ff4d4f; border-color: #ff4d4f; }
    .btn.full { width: 100%; }
    
    .two-columns {
      display: flex;
      gap: 12px;
      margin-bottom: 12px;
    }
    
    .column {
      flex: 1;
    }
    
    .section-title {
      font-size: 11px;
      color: #666;
      margin-bottom: 6px;
    }
    
    .results {
      flex: 1;
      overflow-y: auto;
      background: rgba(0,0,0,0.05);
      border-radius: 4px;
      padding: 6px;
    }
    
    .results-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    
    .results-section .results {
      flex: 1;
      max-height: none;
    }
    
    .result-item {
      background: white;
      border-radius: 4px;
      padding: 6px;
      margin-bottom: 4px;
    }
    
    .result-action {
      font-size: 10px;
      color: #666;
      margin-bottom: 2px;
    }
    
    .result-data {
      font-size: 10px;
      font-family: monospace;
      color: #333;
      word-break: break-all;
      white-space: pre-wrap;
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
    :host([dark]) .result-data { color: #eee; }
    :host([dark]) .scope-toggle button { background: #333; border-color: #555; color: #ccc; }
    :host([dark]) .scope-toggle button.active { background: #52c41a; }
    :host([dark]) .form-section input { background: #333; border-color: #555; color: #fff; }
    :host([dark]) .btn { background: #333; border-color: #555; color: #ccc; }
    :host([dark]) .btn.primary { background: #52c41a; }
    :host([dark]) .results { background: rgba(255,255,255,0.1); }
    :host([dark]) .result-item { background: #333; }
    :host([dark]) .info-btn { background: rgba(255,255,255,0.1); color: #ccc; }
    :host([dark]) .info-panel { background: rgba(30,30,30,0.98); }
  `;
}
