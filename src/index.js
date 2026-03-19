import { packAndRenameDist, writeVersion, updateMainHtml, getPackageInfo, kebabToPascalCase } from './utils';
import path from 'path';

// 从 package.json 中获取包名
const { packageName } = getPackageInfo();

// 将 kebab-case 转换为 PascalCase 作为类名
const PascalCaseName = kebabToPascalCase(packageName, 'Plugin');

// 使用原始包名作为 pluginName
const pluginName = packageName;


// 动态创建类
const PluginClass = class {

  constructor(options) {
    this.options = options || {};
  }

  apply(compiler) {
    const distPath = this.options.distPath || 'dist';
    const isBuild = this.options.isBuild || false;
    const htmlName = this.options.htmlName || 'index.html';

    // Webpack 构建结束后的钩子
    compiler.hooks.afterEmit.tapAsync(pluginName, async (_compilation, callback) => {
      if (!isBuild) {
        console.log(`⏭️ ${pluginName} 构建已禁用，跳过版本信息生成`);
        callback();
        return;
      }

      try {
        console.log(`📝 ${pluginName} 开始生成版本信息...`);

        // 写入版本信息
        const str = await writeVersion(distPath);

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
        callback();

      } catch (error) {
        console.error(`❌ ${pluginName} 版本信息生成失败:`, error);
        callback(error);
      }
    });
  }
};

// 设置类名
Object.defineProperty(PluginClass, 'name', {
  value: PascalCaseName,
  writable: false
});

// 导出
export default PluginClass;
