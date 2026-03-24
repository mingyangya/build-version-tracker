import { packAndRenameDist, writeVersion, updateMainHtml, getPackageInfo, kebabToPascalCase } from './utils';
import path from 'path';

// 从 package.json 中获取包名
const { packageName } = getPackageInfo();

// 将 kebab-case 转换为 PascalCase 作为插件名
const PascalCaseName = kebabToPascalCase(packageName, 'VitePlugin');

// 使用原始包名作为 pluginName
const pluginName = packageName;

/**
 * Vite 插件实现
 * Vite 插件是一个函数，返回一个插件对象
 */
function viteVersionPlugin(options = {}) {
  const distPath = options.distPath || 'dist';
  const isBuild = options.isBuild || false; // 默认不启用构建
  const htmlName = options.htmlName || 'index.html';
  const formatVersion = options.formatVersion;
  const formatTextVersion = options.formatTextVersion;

  return {
    name: pluginName,

    // 构建开始前的钩子
    buildStart() {
      console.log(`🚀 ${pluginName} 开始构建...`);
    },

    // 构建结束后的钩子
    buildEnd() {
      if (isBuild) {
        console.log(`📝 ${pluginName} 准备生成版本信息...`);
      }
    },

    // 关闭钩子（构建完全结束后）
    async closeBundle() {
      if (!isBuild) {
        console.log(`⏭️ ${pluginName} 构建已禁用，跳过版本信息生成`);
        return;
      }

      try {
        console.log(`📝 ${pluginName} 开始生成版本信息...`);

        // 写入版本信息
        const str = await writeVersion({
          distPath,
          formatVersion,
          formatTextVersion
        });

        // 更新 HTML 文件
        updateMainHtml(str, distPath, htmlName);

        // 打包构建产物
        const distDirPath = path.resolve(process.cwd(), distPath);
        const outputZipPath = path.resolve(process.cwd(), `${distPath}.zip`);

        await packAndRenameDist({
          distDirPath,
          outputZipPath,
        });

        console.log(`✅ ${pluginName} 版本信息生成完成`);

      } catch (error) {
        console.error(`❌ ${pluginName} 版本信息生成失败:`, error);
        throw error;
      }
    }
  };
}

// 设置插件显示名称
Object.defineProperty(viteVersionPlugin, 'name', {
  value: PascalCaseName,
  writable: false
});

// 导出插件函数
export default viteVersionPlugin;