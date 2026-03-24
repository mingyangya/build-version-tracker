const fs = require('fs');
const path = require('path');

/**
 * 读取 HTML 文件并去除 script 标签的内容
 * @param {string} htmlPath - HTML 文件路径
 * @param {string} outputPath - 输出文件路径（可选）
 * @returns {string} - 去除 script 标签后的 HTML 内容
 */
function removeScriptTags(htmlPath, outputPath) {
  htmlPath = htmlPath || path.resolve(__dirname, './dist-example/index.html');
  outputPath = outputPath || path.resolve(__dirname, './dist-example/index.html');

  // 读取 HTML 文件
  const htmlStr = fs.readFileSync(htmlPath, 'utf-8');

  // 去除 script 标签的内容
  const htmlWithoutScript = htmlStr.replace(/<script[^>]*>.*?<\/script>/gs, '');

  // 如果提供了输出路径，将结果写回文件
  if (outputPath) {
    fs.writeFileSync(outputPath, htmlWithoutScript, 'utf-8');
    console.log(`✅ HTML without script tags has been saved to ${outputPath}`);
  }

  return htmlWithoutScript;
}

// 导出方法
module.exports = removeScriptTags;

// 如果直接运行此文件，则执行默认操作
if (require.main === module) {
  const htmlPath = path.resolve(__dirname, './dist-example/index.html');
  const outputPath = path.resolve(__dirname, './dist-example/index.html');

  const result = removeScriptTags(htmlPath, outputPath);

  console.log('Original HTML length:', fs.readFileSync(htmlPath, 'utf-8').length);
  console.log('HTML without script tags length:', result.length);
  console.log('\nHTML without script tags:');
  console.log(result);
}
