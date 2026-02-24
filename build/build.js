/**
 * 构建脚本
 * 生成配置文件和组件注册信息
 */

import { generateAppJson } from './generators/app-json.js';

console.log('\n🚀 开始构建...\n');

// 生成 app.json
generateAppJson();

console.log('\n✅ 构建完成!\n');
