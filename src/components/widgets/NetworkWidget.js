/**
 * 网络请求小部件
 * 测试功能：network.request API、权限声明、域名白名单
 */
import { SunPanelWidgetElement } from '@sun-panel/micro-app';
import { html, css } from 'lit';

export class NetworkWidget extends SunPanelWidgetElement {
  static properties = {
    _url: { state: true },
    _method: { state: true },
    _headers: { state: true },
    _body: { state: true },
    _response: { state: true },
    _loading: { state: true },
    _history: { state: true },
    _showingInfo: { state: true }
  };

  constructor() {
    super();
    this._url = 'https://jsonplaceholder.typicode.com/posts/1';
    this._method = 'GET';
    this._headers = '';
    this._body = '';
    this._response = null;
    this._loading = false;
    this._history = [];
    this._showingInfo = false;
  }

  async _sendRequest() {
    if (!this._url) return;
    
    this._loading = true;
    this._response = null;
    
    try {
      let headers = {};
      if (this._headers) {
        try { headers = JSON.parse(this._headers); } catch (e) {}
      }
      
      const options = {
        targetUrl: this._url,
        method: this._method,
        headers
      };
      
      if (this._body && ['POST', 'PUT', 'PATCH'].includes(this._method)) {
        options.body = this._body;
      }
      
      const response = await this.spCtx.api.network.request(options);
      this._response = {
        success: true,
        data: response
      };
      
      this._history = [...this._history, {
        url: this._url,
        method: this._method,
        status: 'success',
        time: new Date().toLocaleTimeString()
      }].slice(-10);
      
    } catch (error) {
      this._response = {
        success: false,
        error: {
          name: error.name,
          type: error.type,
          message: error.message
        }
      };
      
      this._history = [...this._history, {
        url: this._url,
        method: this._method,
        status: 'error: ' + (error.type || error.message),
        time: new Date().toLocaleTimeString()
      }].slice(-10);
    }
    
    this._loading = false;
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
          <span class="title">网络请求小部件</span>
          <button class="info-btn" @click=${this._showInfo}>说明</button>
        </div>
        
        <div class="form-section">
          <select .value=${this._method} @change=${(e) => this._method = e.target.value}>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
          <input type="text" placeholder="URL" .value=${this._url}
            @input=${(e) => this._url = e.target.value}>
          ${['POST', 'PUT', 'PATCH'].includes(this._method) ? html`
            <textarea placeholder="请求体 (JSON)" .value=${this._body}
              @input=${(e) => this._body = e.target.value}></textarea>
          ` : ''}
          <button class="btn primary" @click=${this._sendRequest} ?disabled=${this._loading}>
            ${this._loading ? '请求中...' : '发送请求'}
          </button>
        </div>
        
        ${this._response ? html`
          <div class="response ${this._response.success ? 'success' : 'error'}">
            <div class="response-header">
              ${this._response.success ? '响应结果' : '错误信息'}
            </div>
            <pre>${JSON.stringify(this._response.success ? this._response.data : this._response.error, null, 2)}</pre>
          </div>
        ` : ''}
        
        ${this._showingInfo ? this._renderInfoPanel() : ''}
      </div>
    `;
  }

  _render2x4() {
    return html`
      <div class="container large">
        <div class="header">
          <span class="title">网络请求小部件</span>
          <button class="info-btn" @click=${this._showInfo}>说明</button>
        </div>
        
        <div class="two-columns">
          <div class="column">
            <div class="section-title">请求配置</div>
            <div class="form-section">
              <div class="form-row">
                <select .value=${this._method} @change=${(e) => this._method = e.target.value}>
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
                <input type="text" placeholder="URL" .value=${this._url}
                  @input=${(e) => this._url = e.target.value}>
              </div>
              <textarea placeholder="请求头 (JSON)" .value=${this._headers}
                @input=${(e) => this._headers = e.target.value}></textarea>
              <textarea placeholder="请求体 (JSON)" .value=${this._body}
                @input=${(e) => this._body = e.target.value}></textarea>
              <button class="btn primary full" @click=${this._sendRequest} ?disabled=${this._loading}>
                ${this._loading ? '请求中...' : '发送请求'}
              </button>
            </div>
          </div>
          
          <div class="column">
            <div class="section-title">响应结果</div>
            <div class="response-area">
              ${this._response ? html`
                <pre class="${this._response.success ? 'success' : 'error'}">${
                  JSON.stringify(this._response.success ? this._response.data : this._response.error, null, 2)
                }</pre>
              ` : html`<div class="empty">暂无响应</div>`}
            </div>
          </div>
        </div>
        
        <div class="history-section">
          <div class="section-title">请求历史</div>
          <div class="history-list">
            ${this._history.length === 0 ? html`<div class="empty">暂无历史记录</div>` :
              this._history.map(h => html`
                <div class="history-item ${h.status.includes('error') ? 'error' : 'success'}">
                  <span class="time">${h.time}</span>
                  <span class="method">${h.method}</span>
                  <span class="url">${h.url.slice(0, 40)}${h.url.length > 40 ? '...' : ''}</span>
                  <span class="status">${h.status}</span>
                </div>
              `)}
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
          <p><strong>测试功能：</strong>network.request API、权限声明、域名白名单</p>
          <ul>
            <li>network.request() 发送网络请求</li>
            <li>测试 GET/POST 请求</li>
            <li>测试 templateReplacements 模板变量替换</li>
            <li>测试 cookieDataNodeKey cookie自动管理</li>
            <li>测试请求头设置</li>
            <li>显示错误类型处理 (SpNetworkRequestError)</li>
          </ul>
          <p style="margin-top: 12px; color: #666;">
            错误类型：<br>
            - microApp: 微应用权限错误<br>
            - targetUrl: 目标站点错误
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
    
    .container.large { padding: 12px; }
    
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
    
    .form-section { margin-bottom: 10px; }
    
    .form-row {
      display: flex;
      gap: 8px;
      margin-bottom: 6px;
    }
    
    select {
      padding: 6px 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 11px;
      background: white;
    }
    
    input {
      flex: 1;
      padding: 6px 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 11px;
    }
    
    textarea {
      width: 100%;
      padding: 6px 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 11px;
      min-height: 50px;
      resize: vertical;
      margin-bottom: 6px;
      box-sizing: border-box;
    }
    
    .btn {
      padding: 8px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    }
    
    .btn.primary { background: #fa8c16; color: white; }
    .btn.primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn.full { width: 100%; }
    
    .two-columns {
      display: flex;
      gap: 12px;
      flex: 1;
      overflow: hidden;
    }
    
    .column {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    
    .section-title {
      font-size: 11px;
      color: #666;
      margin-bottom: 6px;
    }
    
    .response {
      flex: 1;
      overflow: auto;
      border-radius: 4px;
      padding: 8px;
    }
    
    .response.success { background: #f6ffed; border: 1px solid #b7eb8f; }
    .response.error { background: #fff2f0; border: 1px solid #ffccc7; }
    
    .response-header {
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 6px;
    }
    
    .response pre, .response-area pre {
      font-size: 10px;
      margin: 0;
      white-space: pre-wrap;
      word-break: break-all;
    }
    
    .response-area {
      flex: 1;
      overflow: auto;
      background: rgba(0,0,0,0.05);
      border-radius: 4px;
      padding: 8px;
    }
    
    .response-area pre.success { color: #52c41a; }
    .response-area pre.error { color: #ff4d4f; }
    
    .history-section {
      margin-top: 12px;
    }
    
    .history-list {
      max-height: 80px;
      overflow-y: auto;
    }
    
    .history-item {
      display: flex;
      gap: 8px;
      font-size: 10px;
      padding: 4px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .history-item.success { color: #52c41a; }
    .history-item.error { color: #ff4d4f; }
    
    .time { color: #999; min-width: 60px; }
    .method { color: #fa8c16; min-width: 50px; }
    .url { flex: 1; }
    .status { min-width: 60px; text-align: right; }
    
    .empty {
      text-align: center;
      color: #999;
      font-size: 12px;
      padding: 12px;
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
    :host([dark]) select, :host([dark]) input, :host([dark]) textarea { 
      background: #333; border-color: #555; color: #fff; 
    }
    :host([dark]) .response { background: rgba(255,255,255,0.1); border-color: #555; }
    :host([dark]) .response-area { background: rgba(255,255,255,0.05); }
    :host([dark]) .info-btn { background: rgba(255,255,255,0.1); color: #ccc; }
    :host([dark]) .info-panel { background: rgba(30,30,30,0.98); }
    :host([dark]) .history-item { border-color: #333; }
  `;
}
