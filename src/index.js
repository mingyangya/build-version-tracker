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
    const formatVersion = this.options.formatVersion;
    const formatHtmlVersion = this.options.formatHtmlVersion;

    // Webpack 构建结束后的处理函数
    const buildHandler = async (compilation, callback) => {
      if (!isBuild) {
        console.log(`⏭️ ${pluginName} 构建已禁用，跳过版本信息生成`);
        if (callback) callback();
        return;
      }

      try {
        console.log(`📝 ${pluginName} 开始生成版本信息...`);

        // 写入版本信息
        const str = await writeVersion({
          distPath,
          formatVersion,
          formatHtmlVersion
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
        if (callback) callback();

      } catch (error) {
        console.error(`❌ ${pluginName} 版本信息生成失败:`, error);
        if (callback) callback(error);
      }
    };

    // 获取 Webpack 版本
    let webpackVersion = '3';
    try {
      // Webpack 4+ 中可以从 compiler.webpack.version 获取
      if (compiler.webpack && compiler.webpack.version) {
        webpackVersion = compiler.webpack.version;
      } 
      // Webpack 3.x 中可以尝试从编译器实例获取版本信息
      else if (compiler.version) {
        webpackVersion = compiler.version;
      }
      // 其他方式检测版本
      else if (compiler.hooks) {
        // 有 hooks 系统，至少是 Webpack 4+
        webpackVersion = '4';
      } else if (compiler.plugin) {
        // 有 plugin 方法，是 Webpack 3.x
        webpackVersion = '3';
      }
    } catch (e) {
      console.warn(`⚠️ ${pluginName} 无法检测 Webpack 版本，使用默认版本 3`);
    }

    // 使用 startsWith 方法判断 Webpack 版本
    const isWebpack5 = webpackVersion.startsWith('5');
    const isWebpack4 = webpackVersion.startsWith('4');
    const isWebpack3 = webpackVersion.startsWith('3');

    // 根据版本使用不同的钩子系统
    if (isWebpack5 || isWebpack4) {
      // Webpack 4+ 使用 hooks 系统
      if (compiler.hooks && compiler.hooks.afterEmit) {
        compiler.hooks.afterEmit.tapAsync(pluginName, (compilation, callback) => {
          buildHandler(compilation, callback);
        });
      } else {
        console.warn(`⚠️ ${pluginName} Webpack ${webpackVersion} 缺少 afterEmit 钩子，跳过版本信息生成`);
      }
    } else if (isWebpack3) {
      // Webpack 3.x 使用 plugin 方法
      if (compiler.plugin) {
        compiler.plugin('after-emit', (compilation, callback) => {
          buildHandler(compilation, callback);
        });
      } else {
        console.warn(`⚠️ ${pluginName} Webpack ${webpackVersion} 缺少 after-emit 插件钩子，跳过版本信息生成`);
      }
    } else {
      // 未知版本，尝试使用最兼容的方式
      console.warn(`⚠️ ${pluginName} 检测到未知 Webpack 版本 ${webpackVersion}，尝试使用兼容模式`);
      
      // 优先尝试 hooks 系统
      if (compiler.hooks && compiler.hooks.afterEmit) {
        compiler.hooks.afterEmit.tapAsync(pluginName, (compilation, callback) => {
          buildHandler(compilation, callback);
        });
      } 
      // 然后尝试 plugin 方法
      else if (compiler.plugin) {
        compiler.plugin('after-emit', (compilation, callback) => {
          buildHandler(compilation, callback);
        });
      } 
      // 都失败了
      else {
        console.warn(`⚠️ ${pluginName} 无法找到合适的钩子系统，跳过版本信息生成`);
      }
    }
  }
};

// 设置类名
Object.defineProperty(PluginClass, 'name', {
  value: PascalCaseName,
  writable: false
});

// 导出
export default PluginClass;