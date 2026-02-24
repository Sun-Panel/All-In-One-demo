/**
 * 小部件配置页面
 * 分为两个设置部分：小部件设置 和 卡片设置
 * @extends {SunPanelPageElement}
 */
import { SunPanelPageElement } from '@sun-panel/micro-app';
import { html, css } from 'lit';

// 更友好的类型提示，开发时无需关注
/** @import { PageInitializedParam, WidgetInfo, SpContextPage } from '@sun-panel/micro-app' */

export class CounterWidgetConfigPage extends SunPanelPageElement {
  static properties = {
    // 小部件设置
    _step: { state: true, type: Number },
    _cacheScope: { state: true, type: String },
    // 卡片设置
    _cardTitle: { state: true, type: String },
    _cardBackground: { state: true, type: String },
    // UI状态
    _activeTab: { state: true, type: String },
    _message: { state: true, type: String }
  };

  constructor() {
    super();
    this._step = 1;
    this._cacheScope = 'user';
    this._cardTitle = '';
    this._cardBackground = '';
    this._activeTab = 'widget';
    this._message = '';
  }

  /**
   * 页面初始化时触发
   * @param {PageInitializedParam} param - 小部件信息
   */
  onInitialized({ widgetInfo }) {
    // widgetInfo = this.spCtx.widgetInfo;
    console.log('[WidgetConfigPage] onInitialized:', widgetInfo);

    this._cardTitle = widgetInfo.title || '';
    this._cardBackground = widgetInfo.background || '';

    if (widgetInfo?.config) {
      this._step = widgetInfo.config.step || 1;
      this._cacheScope = widgetInfo.config.cacheScope || 'user';
    }
  }

  /**
   * 保存配置
   */
  async _saveConfig() {
    try {
      await this.spCtx.api.widget.save({
        ...this.spCtx.widgetInfo,
        config: {
          step: this._step,
          cacheScope: this._cacheScope,
          cardTitle: this._cardTitle,
          cardBackground: this._cardBackground,
        },
        title: this._cardTitle,
        background: this._cardBackground
      });
      this._message = '配置保存成功!';
    } catch (e) {
      this._message = '保存失败: ' + e.message;
    }
  }

  // 渲染页面
  render() {
    return html`
      <div class="container">
        <div class="header">
          <h2>小部件配置</h2>
        </div>
        
        <div class="tabs">
          <button class="tab ${this._activeTab === 'widget' ? 'active' : ''}"
            @click=${() => this._activeTab = 'widget'}>
            小部件设置
          </button>
          <button class="tab ${this._activeTab === 'card' ? 'active' : ''}"
            @click=${() => this._activeTab = 'card'}>
            卡片设置
          </button>
        </div>
        
        <div class="content">
          ${this._activeTab === 'widget' ? this._renderWidgetSettings() : this._renderCardSettings()}
        </div>
        
        <button class="save-btn" @click=${this._saveConfig}>
          保存配置
        </button>
        
        ${this._message ? html`
          <div class="message">${this._message}</div>
        ` : ''}
      </div>
    `;
  }

  _renderWidgetSettings() {
    return html`
      <div class="settings-group">
        <h3>自增计数器设置 <span class="data-source">(数据源:this.spCtx.widgetInfo.config)</span></h3>
        
        <div class="form-group">
          <label>自增步进数值 <span class="data-source">(数据源:this.spCtx.widgetInfo.config.step)</span></label>
          <div class="step-control">
            <button class="step-btn" @click=${() => { if (this._step > 1) this._step--; }}>-</button>
            <input type="number" .value=${String(this._step)} min="1" max="100"
              @input=${(e) => { const v = parseInt(e.target.value); if (v > 0) this._step = v; }}>
            <button class="step-btn" @click=${() => this._step++}>+</button>
          </div>
          <div class="hint">每次点击自增按钮增加的数值 (1-100)</div>
        </div>
        
        <div class="form-group">
          <label>缓存方案 <span class="data-source">(数据源:this.spCtx.widgetInfo.config.cacheScope)</span></label>
          <div class="cache-options">
            <label class="radio-card ${this._cacheScope === 'user' ? 'selected' : ''}">
              <input type="radio" name="cacheScope" value="user" 
                ?checked=${this._cacheScope === 'user'}
                @change=${() => this._cacheScope = 'user'}>
              <div class="radio-content">
                <div class="radio-title">用户级缓存</div>
                <div class="radio-desc">数据仅当前用户可见</div>
              </div>
            </label>
            <label class="radio-card ${this._cacheScope === 'app' ? 'selected' : ''}">
              <input type="radio" name="cacheScope" value="app"
                ?checked=${this._cacheScope === 'app'}
                @change=${() => this._cacheScope = 'app'}>
              <div class="radio-content">
                <div class="radio-title">应用级缓存</div>
                <div class="radio-desc">所有用户共享数据</div>
              </div>
            </label>
          </div>
        </div>
      </div>
    `;
  }

  _renderCardSettings() {
    return html`
      <div class="settings-group">
        <h3>卡片外观设置 <span class="data-source">(数据源:this.spCtx.widgetInfo)</span></h3>
        
        <div class="form-group">
          <label>卡片标题 <span class="data-source">(数据源:this.spCtx.widgetInfo.title)</span></label>
          <input type="text" .value=${this._cardTitle}
            @input=${(e) => this._cardTitle = e.target.value}
            placeholder="请输入卡片标题（留空显示默认标题）">
        </div>
        
        <div class="form-group">
          <label>卡片背景色 <span class="data-source">(数据源:this.spCtx.widgetInfo.background)</span></label>
          <div class="bg-options">
            <label class="bg-option ${this._cardBackground === '' ? 'selected' : ''}">
              <input type="radio" name="cardBackground" value=""
                ?checked=${this._cardBackground === ''}
                @change=${() => this._cardBackground = ''}>
              <div class="bg-preview system">默认（系统统一背景色）</div>
            </label>
            <label class="bg-option ${this._cardBackground === 'black' ? 'selected' : ''}">
              <input type="radio" name="cardBackground" value="black"
                ?checked=${this._cardBackground === 'black'}
                @change=${() => this._cardBackground = 'black'}>
              <div class="bg-preview black">黑色</div>
            </label>
            <label class="bg-option ${this._cardBackground === 'white' ? 'selected' : ''}">
              <input type="radio" name="cardBackground" value="white"
                ?checked=${this._cardBackground === 'white'}
                @change=${() => this._cardBackground = 'white'}>
              <div class="bg-preview white">白色</div>
            </label>
            <label class="bg-option ${this._cardBackground === 'transparent' ? 'selected' : ''}">
              <input type="radio" name="cardBackground" value="transparent"
                ?checked=${this._cardBackground === 'transparent'}
                @change=${() => this._cardBackground = 'transparent'}>
              <div class="bg-preview transparent">透明</div>
            </label>
          </div>
        </div>
      </div>
    `;
  }

  static styles = css`
    .container {
      padding: 20px;
      max-width: 480px;
      margin: 0 auto;
    }
    
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    
    .header h2 {
      margin: 0;
      color: #333;
      font-size: 20px;
    }
    
    .tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
    }
    
    .tab {
      flex: 1;
      padding: 10px;
      border: 1px solid #ddd;
      background: white;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s;
    }
    
    .tab.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-color: transparent;
    }
    
    .content {
      min-height: 200px;
    }
    
    .settings-group h3 {
      font-size: 14px;
      color: #666;
      margin: 0 0 16px 0;
      padding-bottom: 8px;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .data-source {
      font-size: 11px;
      color: #aaa;
      font-weight: 400;
      margin-left: 4px;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    .form-group > label {
      display: block;
      margin-bottom: 8px;
      color: #333;
      font-size: 13px;
      font-weight: 500;
    }
    
    .form-group input[type="text"],
    .form-group input[type="number"] {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      box-sizing: border-box;
    }
    
    .step-control {
      display: flex;
      align-items: center;
    }
    
    .step-btn {
      width: 40px;
      height: 40px;
      border: 1px solid #ddd;
      background: white;
      font-size: 18px;
      cursor: pointer;
    }
    
    .step-btn:first-child {
      border-radius: 6px 0 0 6px;
    }
    
    .step-btn:last-child {
      border-radius: 0 6px 6px 0;
    }
    
    .step-control input {
      width: 80px;
      height: 40px;
      border: none;
      border-top: 1px solid #ddd;
      border-bottom: 1px solid #ddd;
      text-align: center;
      font-size: 16px;
      font-weight: 600;
    }
    
    .hint {
      font-size: 12px;
      color: #999;
      margin-top: 6px;
    }
    
    .cache-options {
      display: flex;
      gap: 12px;
    }
    
    .radio-card {
      flex: 1;
      position: relative;
      cursor: pointer;
    }
    
    .radio-card input {
      position: absolute;
      opacity: 0;
    }
    
    .radio-content {
      padding: 12px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      text-align: center;
      transition: all 0.3s;
    }
    
    .radio-card.selected .radio-content {
      border-color: #1890ff;
      background: #e6f7ff;
    }
    
    .radio-title {
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin-bottom: 4px;
    }
    
    .radio-desc {
      font-size: 12px;
      color: #666;
    }
    
    .bg-options {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    
    .bg-option {
      position: relative;
      cursor: pointer;
    }
    
    .bg-option input {
      position: absolute;
      opacity: 0;
    }
    
    .bg-preview {
      padding: 16px;
      border-radius: 8px;
      text-align: center;
      font-size: 13px;
      font-weight: 500;
      border: 2px solid transparent;
      transition: all 0.3s;
    }
    
    .bg-option.selected .bg-preview {
      border-color: #1890ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }
    
    .bg-preview.system {
      /* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); */
      color: black;
    }
    
    .bg-preview.black {
      background: #1a1a1a;
      color: white;
    }
    
    .bg-preview.white {
      background: #ffffff;
      color: #333;
      border-color: #e0e0e0;
    }
    
    .bg-preview.transparent {
      background: repeating-conic-gradient(#e0e0e0 0% 25%, #f5f5f5 0% 50%) 50% / 16px 16px;
      color: #333;
    }
    
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
    }
    
    .checkbox-label input {
      width: 18px;
      height: 18px;
    }
    
    .checkbox-label span {
      font-size: 14px;
      color: #333;
    }
    
    .save-btn {
      width: 100%;
      padding: 14px;
      margin-top: 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
      transition: opacity 0.3s;
    }
    
    .save-btn:hover {
      opacity: 0.9;
    }
    
    .message {
      margin-top: 16px;
      padding: 12px;
      background: #f6ffed;
      border: 1px solid #b7eb8f;
      border-radius: 6px;
      color: #52c41a;
      text-align: center;
      font-size: 14px;
    }
  `;
}
