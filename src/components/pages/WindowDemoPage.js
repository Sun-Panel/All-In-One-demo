/**
 * 窗口演示页面
 * 用于 WindowManagerWidget 测试窗口打开和参数传递
 */
import { SunPanelPageElement } from '@sun-panel/micro-app';
import { html, css } from 'lit';

export class WindowDemoPage extends SunPanelPageElement {
  static properties = {
    _widgetInfo: { state: true },
    _customParam: { state: true },
    _logs: { state: true }
  };

  constructor() {
    super();
    this._widgetInfo = null;
    this._customParam = null;
    this._logs = [];
  }

  onInitialized({ widgetInfo, customParam }) {
    this._widgetInfo = widgetInfo;
    this._customParam = customParam;
    this._addLog(`onInitialized 接收参数`);
    this._addLog(`widgetInfo: ${JSON.stringify(widgetInfo)}`);
    this._addLog(`customParam: ${JSON.stringify(customParam)}`);
  }

  _addLog(message) {
    const time = new Date().toLocaleTimeString();
    this._logs = [...this._logs, { time, message }];
  }

  _closeWindow() {
    this.spCtx.api.window.close();
  }

  render() {
    return html`
      <div class="container">
        <div class="header">
          <h2>窗口演示页面</h2>
        </div>
        
        <div class="info-card">
          <h3>接收到的参数</h3>
          <div class="param-section">
            <div class="param-label">widgetInfo:</div>
            <!-- <pre class="param-value">${JSON.stringify(this._widgetInfo, null, 2)}</pre> -->
            <div>此参数仅当窗口作为小部件的配置组件打开并且为系统调用（创建小部件时触发的打开引导页、右键小部件菜单中打开配置页面）时才能获取到。其他主动触发行为请使用 customPatam 参数自行传递。</div>
          </div>
          <div class="param-section">
            <div class="param-label">customParam:</div>
            <pre class="param-value">${JSON.stringify(this._customParam, null, 2)}</pre>
          </div>
        </div>
        
        <div class="api-info">
          <h3>window API 测试</h3>
          <ul>
            <li><code>window.open()</code> - 已在父窗口调用</li>
          </ul>
        </div>
        
        <div class="logs-section">
          <h3>日志</h3>
          <div class="logs">
            ${this._logs.map(log => html`
              <div class="log-item">
                <span class="log-time">[${log.time}]</span>
                <span class="log-msg">${log.message}</span>
              </div>
            `)}
          </div>
        </div>
      </div>
    `;
  }

  static styles = css`
    .container {
      padding: 24px;
      max-width: 500px;
      margin: 0 auto;
    }
    
    .header {
      text-align: center;
      margin-bottom: 24px;
    }
    
    .header h2 {
      margin: 0;
      color: #333;
      font-size: 20px;
    }
    
    .info-card {
      background: #f5f5f5;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
    }
    
    .info-card h3 {
      margin: 0 0 12px 0;
      font-size: 14px;
      color: #666;
    }
    
    .param-section {
      margin-bottom: 12px;
    }
    
    .param-label {
      font-size: 12px;
      color: #999;
      margin-bottom: 4px;
    }
    
    .param-value {
      font-size: 11px;
      background: white;
      padding: 8px;
      border-radius: 4px;
      margin: 0;
      overflow-x: auto;
      white-space: pre-wrap;
      word-break: break-all;
    }
    
    .api-info {
      background: #e6f7ff;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
    }
    
    .api-info h3 {
      margin: 0 0 8px 0;
      font-size: 14px;
      color: #1890ff;
    }
    
    .api-info ul {
      margin: 0;
      padding-left: 20px;
    }
    
    .api-info li {
      font-size: 12px;
      color: #666;
      margin: 4px 0;
    }
    
    .api-info code {
      background: rgba(24,144,255,0.1);
      padding: 2px 6px;
      border-radius: 3px;
      font-family: monospace;
    }
    
    .logs-section {
      background: #fafafa;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
    }
    
    .logs-section h3 {
      margin: 0 0 8px 0;
      font-size: 14px;
      color: #666;
    }
    
    .logs {
      max-height: 100px;
      overflow-y: auto;
    }
    
    .log-item {
      font-size: 11px;
      padding: 2px 0;
      font-family: monospace;
    }
    
    .log-time {
      color: #999;
    }
    
    .log-msg {
      color: #333;
    }
    
    .close-btn {
      width: 100%;
      padding: 12px;
      background: #ff4d4f;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      cursor: pointer;
      transition: background 0.3s;
    }
    
    .close-btn:hover {
      background: #ff7875;
    }
  `;
}
