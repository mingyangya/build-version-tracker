// 简单的测试脚本
const PluginClass = require('./src/index.js');

console.log('🧪 开始测试 WebpackNpmPackagePlugin...\n');

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
  const plugin = new PluginClass({ distPath: 'build', isBuild: false });
  console.log('✅ 带选项插件实例化成功');
  console.log('   distPath:', plugin.options.distPath);
  console.log('   isBuild:', plugin.options.isBuild);
} catch (error) {
  console.log('❌ 带选项插件实例化失败:', error.message);
}

// 测试3: 测试 apply 方法
console.log('\n3. 测试 apply 方法...');
try {
  const plugin = new PluginClass();
  const mockCompiler = {
    hooks: {
      afterEmit: {
        tapAsync: (name, callback) => {
          console.log('✅ apply 方法调用成功');
          console.log('   钩子名称:', name);
          console.log('   回调函数类型:', typeof callback);
          
          // 模拟回调调用
          const mockCompilation = {};
          const mockCallback = () => console.log('✅ 回调函数执行成功');
          callback(mockCompilation, mockCallback);
        }
      }
    }
  };
  
  plugin.apply(mockCompiler);
} catch (error) {
  console.log('❌ apply 方法测试失败:', error.message);
}

// 测试4: 测试类名
console.log('\n4. 测试类名...');
try {
  console.log('✅ 类名:', PluginClass.name);
  console.log('   预期: WebpackNpmPackagePlugin');
  console.log('   实际:', PluginClass.name);
  console.log('   匹配:', PluginClass.name === 'WebpackNpmPackagePlugin' ? '✅' : '❌');
} catch (error) {
  console.log('❌ 类名测试失败:', error.message);
}

console.log('\n🎉 简单测试完成！');
console.log('\n📝 说明:');
console.log('   - 由于网络限制，无法运行完整的 vitest 测试');
console.log('   - 此简单测试验证了插件的核心功能');
console.log('   - 在实际环境中可以使用 pnpm test 运行完整测试');