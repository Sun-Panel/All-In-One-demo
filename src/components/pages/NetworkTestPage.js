/**
 * 网络透传测试页面
 * 测试功能：network.request API
 */
import { SunPanelPageElement } from '@sun-panel/micro-app';
import { html, css } from 'lit';

export class NetworkTestPage extends SunPanelPageElement {
  static properties = {
    _url: { state: true },
    _method: { state: true },
    _headers: { state: true },
    _body: { state: true },
    _response: { state: true },
    _loading: { state: true },
    _message: { state: true },
    _activeTab: { state: true },
    // 高级测试相关
    _advancedUrl: { state: true },
    _advancedMethod: { state: true },
    _advancedHeaders: { state: true },
    _sensitiveData: { state: true },
    _advancedResponse: { state: true },
    _advancedLoading: { state: true }
  };

  constructor() {
    super();
    this._url = 'https://jsonplaceholder.typicode.com/posts/1';
    this._method = 'GET';
    this._headers = '';
    this._body = '';
    this._response = null;
    this._loading = false;
    this._message = '';
    this._activeTab = 'simple';
    // 高级测试
    this._advancedUrl = 'https://{{apihost}}/v7/weather/now?location=101010100';
    this._advancedMethod = 'GET';
    this._advancedHeaders = '{\n  "X-QW-Api-Key": "{{apikey}}"\n}';
    this._sensitiveData = { apikey: '', apihost: '' };
    this._advancedResponse = null;
    this._advancedLoading = false;
  }

  async _loadSensitiveData() {
    try {
      const config = await this.spCtx.api.dataNode.user.getByKeys('networkConfig', ['apikey', 'apihost']);
      if (config) {
        this._sensitiveData = {
          apikey: config.apikey || '',
          apihost: config.apihost || ''
        };
      }
    } catch (error) {
      console.log('未找到已保存的敏感数据');
    }
  }

  async _saveSensitiveData() {
    try {
      await this.spCtx.api.dataNode.user.setByKeys('networkConfig', this._sensitiveData);
      this._showMessage('敏感数据保存成功');
    } catch (error) {
      this._showMessage('保存失败: ' + error.message, true);
    }
  }

  async _sendAdvancedRequest() {
    this._advancedLoading = true;
    this._advancedResponse = null;

    try {
      let headers = {};
      if (this._advancedHeaders) {
        try { headers = JSON.parse(this._advancedHeaders); } catch (e) {}
      }

      const requestConfig = {
        targetUrl: this._advancedUrl,
        method: this._advancedMethod,
        headers,
        templateReplacements: [
          {
            placeholder: '{{apikey}}',
            fields: ['headers'],
            dataNode: 'networkConfig.apikey'
          },
          {
            placeholder: '{{apihost}}',
            fields: ['targetUrl'],
            dataNode: 'networkConfig.apihost'
          }
        ]
      };

      const response = await this.spCtx.api.network.request(requestConfig);
      this._advancedResponse = {
        success: true,
        data: response
      };
    } catch (error) {
      this._advancedResponse = {
        success: false,
        error: {
          name: error.name,
          type: error.type,
          message: error.message
        }
      };
    }

    this._advancedLoading = false;
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
      this._showMessage('请求成功');
    } catch (error) {
      this._response = {
        success: false,
        error: {
          name: error.name,
          type: error.type,
          message: error.message
        }
      };
      this._showMessage('请求失败: ' + (error.type || error.message), true);
    }
    
    this._loading = false;
  }

  _showMessage(msg, isError = false) {
    this._message = { text: msg, isError };
    setTimeout(() => { this._message = ''; this.requestUpdate(); }, 3000);
  }

  render() {
    return html`
      <div class="container" ?dark=${this.spCtx.darkMode}>
        <div class="tabs">
          <button class="tab ${this._activeTab === 'simple' ? 'active' : ''}"
            @click=${() => this._activeTab = 'simple'}>简单测试</button>
          <button class="tab ${this._activeTab === 'advanced' ? 'active' : ''}"
            @click=${() => this._activeTab = 'advanced'}>高级测试（敏感数据模板替换）</button>
        </div>

        ${this._activeTab === 'simple' ? this._renderSimpleTest() : this._renderAdvancedTest()}
        
        ${this._message ? html`<div class="message ${this._message.isError ? 'error' : ''}">${this._message.text}</div>` : ''}
      </div>
    `;
  }

  _renderSimpleTest() {
    return html`
      <div class="panel">
        <div class="description">直接输入 URL 和参数进行测试。如果请求内容中含有敏感数据，请使用"高级测试"功能。</div>
        
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
          
          ${['POST', 'PUT', 'PATCH'].includes(this._method) ? html`
            <textarea placeholder="请求体 (JSON)" .value=${this._body}
              @input=${(e) => this._body = e.target.value}></textarea>
          ` : ''}
          
          <textarea placeholder="请求头 (JSON, 可选)" .value=${this._headers}
            @input=${(e) => this._headers = e.target.value}></textarea>
          
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
      </div>
    `;
  }

  _renderAdvancedTest() {
    return html`
      <div class="panel">
        <div class="description">
          此案例需结合代码查看方便理解。示例采用和风天气 API 进行测试。所需内容需要到 <a href="https://dev.qweather.com/" target="_blank">和风天气开发平台</a> 申请。
          示例首次使用需要先配置敏感数据并保存。保存成功后，即可使用模板替换功能进行请求。
          <!-- 使用模板替换功能，将敏感数据（如 token、密码等）存储在数据节点中，请求时自动替换。
          参阅文档：<a href="https://doc.sun-panel.top/v2/zh_cn/micro_app_dev/api.html#network" target="_blank">网络透传</a> -->
        </div>
        
        <div class="section-title">敏感数据配置</div>
        <div class="sensitive-data-form">
          <div class="form-row">
            <label>ApiKey:</label>
            <input type="text" placeholder="API Key" .value=${this._sensitiveData.apikey}
              @input=${(e) => this._sensitiveData = { ...this._sensitiveData, apikey: e.target.value }}>
          </div>
          <div class="form-row">
            <label>ApiHost:</label>
            <input type="text" placeholder="API Host （请确保此域名已经加入到微应用的信任域名中）" .value=${this._sensitiveData.apihost}
              @input=${(e) => this._sensitiveData = { ...this._sensitiveData, apihost: e.target.value }}>
          </div>
          <div class="btn-row">
            <button class="btn secondary" @click=${this._saveSensitiveData}>保存敏感数据</button>
            <button class="btn outline" @click=${this._loadSensitiveData}>获取敏感数据</button>
          </div>
        </div>
        
        <div class="section-title">请求配置</div>
        <div class="form-section">
          <div class="form-row">
            <select .value=${this._advancedMethod} @change=${(e) => this._advancedMethod = e.target.value}>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
            <input type="text" placeholder="URL (支持 {{placeholder}} 模板)" .value=${this._advancedUrl}
              @input=${(e) => this._advancedUrl = e.target.value}>
          </div>
          
          <textarea placeholder="请求头 (JSON, 支持 {{placeholder}} 模板)" .value=${this._advancedHeaders}
            @input=${(e) => this._advancedHeaders = e.target.value}></textarea>
          
          <button class="btn primary" @click=${this._sendAdvancedRequest} ?disabled=${this._advancedLoading}>
            ${this._advancedLoading ? '请求中...' : '发送请求（使用模板替换）'}
          </button>
        </div>
        
        ${this._advancedResponse ? html`
          <div class="response ${this._advancedResponse.success ? 'success' : 'error'}">
            <div class="response-header">
              ${this._advancedResponse.success ? '响应结果' : '错误信息'}
            </div>
            <pre>${JSON.stringify(this._advancedResponse.success ? this._advancedResponse.data : this._advancedResponse.error, null, 2)}</pre>
          </div>
        ` : ''}
      </div>
    `;
  }

  static styles = css`
    .container {
      padding: 12px;
      height: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    
    .tabs {
      display: flex;
      gap: 4px;
      margin-bottom: 12px;
      border-bottom: 1px solid #e8e8e8;
      padding-bottom: 8px;
    }
    
    .tab {
      padding: 6px 12px;
      border: none;
      background: transparent;
      cursor: pointer;
      font-size: 12px;
      color: #666;
      border-radius: 4px 4px 0 0;
      transition: all 0.2s;
    }
    
    .tab:hover { background: #f5f5f5; }
    .tab.active { 
      background: #fa8c16; 
      color: white; 
    }
    
    .panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      min-height: 0;
    }

    .description { 
      font-size: 12px; 
      color: #666; 
      margin-bottom: 12px;
      line-height: 1.5;
    }
    
    .section-title {
      font-size: 13px;
      font-weight: 600;
      color: #333;
      margin: 12px 0 8px 0;
      padding-bottom: 4px;
      border-bottom: 1px dashed #e8e8e8;
    }
    
    .form-section { margin-bottom: 12px; }
    
    .form-row {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
      align-items: center;
    }
    
    .form-row label {
      width: 70px;
      font-size: 12px;
      color: #666;
      flex-shrink: 0;
    }
    
    select {
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 12px;
      background: white;
    }
    
    input {
      flex: 1;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 12px;
    }
    
    textarea {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 11px;
      min-height: 60px;
      resize: vertical;
      margin-bottom: 8px;
      box-sizing: border-box;
      font-family: monospace;
    }
    
    .btn {
      width: 100%;
      padding: 10px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
    }
    
    .btn-row {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
    }
    
    .btn-row .btn { flex: 1; }
    
    .btn.primary { background: #fa8c16; color: white; }
    .btn.secondary { background: #52c41a; color: white; }
    .btn.outline { background: white; color: #666; border: 1px solid #ddd; }
    .btn.primary:disabled, .btn.secondary:disabled { opacity: 0.6; cursor: not-allowed; }
    
    .response {
      flex: 1;
      min-height: 200px;
      overflow: auto;
      border-radius: 4px;
      padding: 10px;
    }
    
    .response.success { background: #f6ffed; border: 1px solid #b7eb8f; }
    .response.error { background: #fff2f0; border: 1px solid #ffccc7; }
    
    .response-header {
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    
    .config-section {
      margin-bottom: 12px;
    }
    
    .config-title {
      font-size: 11px;
      color: #888;
      margin-bottom: 4px;
    }
    
    .response pre {
      font-size: 10px;
      margin: 0;
      white-space: pre-wrap;
      word-break: break-all;
    }
    
    .message {
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      margin-top: 8px;
    }
    
    .message.error { background: #fff2f0; border: 1px solid #ffccc7; color: #ff4d4f; }
    .message:not(.error) { background: #f6ffed; border: 1px solid #b7eb8f; color: #52c41a; }
    
    container[dark] .tab { color: #aaa; }
    container[dark] .tab:hover { background: #333; }
    container[dark] .section-title { color: #ddd; border-color: #444; }
    container[dark] .description { color: #aaa; }
    container[dark] select, container[dark] input, container[dark] textarea { 
      background: #333; border-color: #555; color: #fff; 
    }
    container[dark] .response { background: rgba(255,255,255,0.1); border-color: #555; }
  `;
}
