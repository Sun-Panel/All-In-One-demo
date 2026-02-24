/**
 * 打包脚本
 * 将构建产物打包成 .zip 组件包
 */

import AdmZip from 'adm-zip';
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { generateAppJson } from './generators/app-json.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

/**
 * 判断是否为开发环境
 */
const isDev = process.env.NODE_ENV === 'development';

/**
 * 递归复制目录
 */
function addDirectoryToZip(zip, dirPath, zipPath, excludedFiles = []) {
  const items = readdirSync(dirPath);

  items.forEach((item) => {
    const itemPath = join(dirPath, item);
    const itemZipPath = join(zipPath, item);
    const stat = statSync(itemPath);

    if (stat.isDirectory()) {
      addDirectoryToZip(zip, itemPath, itemZipPath, excludedFiles);
    } else {
      // 排除 .map 文件
      if (item.endsWith('.map')) {
        excludedFiles.push(itemZipPath.replace(/\\/g, '/'));
        return;
      }
      const content = readFileSync(itemPath);
      zip.addFile(itemZipPath.replace(/\\/g, '/'), content);
    }
  });
}

/**
 * 打包函数
 */
function pack() {
  console.log('\n📦 开始打包...\n');

  // 重新生成 app.json，确保使用正确的版本
  generateAppJson();

  const { microAppId, version } = JSON.parse(readFileSync(join(projectRoot, 'app.json'), 'utf-8'));
  const zipFileName = `${microAppId}-${version}.zip`;
  const zipPath = join(projectRoot, 'packages', zipFileName);

  const zip = new AdmZip();
  const excludedFiles = [];

  // 添加 app.json
  const appJsonContent = readFileSync(join(projectRoot, 'app.json'));
  zip.addFile('app.json', appJsonContent);

  // 添加 dist 目录下的所有文件（包括 main.js 和 assets）
  const distDir = join(projectRoot, 'dist');
  if (existsSync(distDir)) {
    addDirectoryToZip(zip, distDir, '', excludedFiles);
  }

  // 添加 public 目录下的所有文件到根目录
  const publicDir = join(projectRoot, 'public');
  if (existsSync(publicDir)) {
    const publicItems = readdirSync(publicDir);
    publicItems.forEach((item) => {
      const itemPath = join(publicDir, item);
      const stat = statSync(itemPath);

      if (stat.isFile()) {
        // 排除 .map 文件
        if (item.endsWith('.map')) {
          excludedFiles.push(item);
          return;
        }
        const content = readFileSync(itemPath);
        zip.addFile(item, content);
      } else if (stat.isDirectory()) {
        addDirectoryToZip(zip, itemPath, item, excludedFiles);
      }
    });
  }

  // 写入 zip 文件
  zip.writeZip(zipPath);

  console.log(`✅ 打包完成: ${zipPath}`);
  console.log(`📦 包名: ${zipFileName}`);
  console.log(`🔧 环境: ${isDev ? 'development' : 'production'}`);

  // 显示排除的文件
  if (excludedFiles.length > 0) {
    console.log(`\n🗑️  已排除 ${excludedFiles.length} 个 .map 文件:`);
    excludedFiles.forEach((file) => console.log(`   - ${file}`));
  }
  console.log();
}

// 执行打包
pack();
