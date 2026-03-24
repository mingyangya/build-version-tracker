// 简单的测试脚本
import PluginClass from '../dist/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

import removeScriptTags from '../test/test-build.js';

// 在 ES 模块中获取 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.resolve(__dirname, './dist-example');

console.log('🧪 开始测试 WebpackNpmPackagePlugin...\n');

removeScriptTags()

// 测试1: 创建插件实例
console.log('1. 测试插件实例化...');
try {
  const plugin = new PluginClass();
  console.log('✅ 插件实例化成功');
  console.log('   类名:', PluginClass.name);
  console.log('   选项:', plugin.options);
} catch (error) {
  console.log('❌ 插件实例化失败:', error.message);
}

// 测试2: 创建带选项的插件实例
console.log('\n2. 测试带选项的插件实例化...');
try {
  const plugin = new PluginClass({ distPath, isBuild: true });
  console.log('✅ 带选项的插件实例化成功');
  console.log('   选项:', plugin.options);
} catch (error) {
  console.log('❌ 带选项的插件实例化失败:', error.message);
}

// 测试3: 测试 apply 方法
console.log('\n3. 测试 apply 方法...');
try {
  const plugin = new PluginClass({ distPath, isBuild: true });
  // 创建模拟的 compiler 对象
  const compiler = {
    webpack: { version: '5.0.0' },
    hooks: {
      afterEmit: {
        tapAsync: (name, handler) => {
          console.log('✅ afterEmit 钩子已注册');
          // 调用钩子处理函数
          handler({}, () => {
            console.log('✅ afterEmit 钩子处理完成');
          });
        }
      }
    }
  };
  plugin.apply(compiler);
} catch (error) {
  console.log('❌ apply 方法测试失败:', error.message);
}

console.log('\n🎉 所有测试完成!');

// 测试4: 测试去除 script 标签的功能
console.log('\n4. 测试去除 script 标签的功能...');
try {
  // 动态导入 CommonJS 模块
  import('../test/test-build.js').then((module) => {
    const removeScriptTags = module.default;
    const htmlPath = path.resolve(__dirname, './dist-example/index.html');
    const outputPath = path.resolve(__dirname, './dist-example/index-no-script.html');
    
    const result = removeScriptTags(htmlPath, outputPath);
    console.log('✅ 去除 script 标签成功');
    console.log('   处理后的 HTML 长度:', result.length);
  }).catch((error) => {
    console.log('❌ 导入 removeScriptTags 方法失败:', error.message);
  });
} catch (error) {
  console.log('❌ 去除 script 标签测试失败:', error.message);
}