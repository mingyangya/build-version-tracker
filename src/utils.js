import { exec } from 'child_process';
import AdmZip from 'adm-zip';
import fs from 'fs';
import path from 'path';

/**
 * 打包本地 distDirPath 文件夹为 ZIP，并命名包内的文件夹名字为distName
 * @param distDirPath - 本地 dist 文件夹路径（绝对/相对）
 * @param outputZipPath - 最终输出的 ZIP 文件路径
 * @param distName - 包内的文件夹名字，默认dist
 */
async function packAndRenameDist({ distDirPath, outputZipPath, distName = 'dist' }) {
  try {
    // 校验本地 dist 文件夹是否存在
    if (!fs.existsSync(distDirPath) || !fs.statSync(distDirPath).isDirectory()) {
      throw new Error(`dist 文件夹不存在或不是目录：${distDirPath}`);
    }

    // 创建临时 ZIP 实例，打包文件夹
    const tempZip = new AdmZip();
    // 递归添加文件夹下的所有内容（保留目录结构）
    tempZip.addLocalFolder(distDirPath, distName); // 第二个参数指定压缩包内的根目录名

    // 写入最终的 ZIP 文件
    tempZip.writeZip(outputZipPath);
    console.log(`✅ 操作完成！最终压缩包已保存至：${path.resolve(outputZipPath)}`);

  } catch (error) {
    console.error('❌ 打包/重命名失败：', error);
    throw error;
  }
}

const getUserName = () => {
  return new Promise((resolve) => {
    exec('git config user.name', (error, stdout) => {
      if (error) {
        resolve('unknown');
        return;
      }
      resolve(stdout.trim());
    });
  });
};

const getCurrentBranchName = () => {
  return new Promise((resolve) => {
    exec('git rev-parse --abbrev-ref HEAD', (error, stdout) => {
      if (error) {
        resolve('unknown');
        return;
      }
      resolve(stdout.trim());
    });
  });
};

function formatDate(date) {
  const yyyy = date.getFullYear().toString().slice(0, 4);
  const mm = (date.getMonth() + 1).toString().padStart(2, '0');
  const dd = date.getDate().toString().padStart(2, '0');
  const hh = date.getHours().toString().padStart(2, '0');
  const mi = date.getMinutes().toString().padStart(2, '0');
  const ss = date.getSeconds().toString().padStart(2, '0');

  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

// 定义一个函数，用于写入版本信息
const writeVersion = async (options) => {
  const { distPath, formatVersion, formatTextVersion } = options;
  
  const userName = await getUserName();
  const currentBranch = await getCurrentBranchName();
  const time = formatDate(new Date());
  
  const versionInfo = {
    userName,
    currentBranch,
    time,
    distPath
  };
  
  // 使用自定义格式化回调或默认格式
  const str = formatVersion 
    ? formatVersion(versionInfo)
    : `构建人： ${userName}, 构建分支：${currentBranch}, 构建时间：${time}`;
    
  // 文本版本
  const writeHtml = formatTextVersion
    ? formatTextVersion(versionInfo)
    : `${str}，构建后文件位于：${distPath}`;

  const fileDistName = path.resolve(process.cwd(), `${distPath}/version.txt`);
  console.log('-------------fileDistName------------', fileDistName);
  try {
    fs.writeFileSync(fileDistName, writeHtml);
  } catch (error) {
    console.error(`❌ 写入版本信息失败：`, error);
    throw error;
  }

  console.log(`%c======${writeHtml}======`, 'color:blue');

  return str;
};

// 更新html，在body标签后插入版本号
function updateMainHtml(str, distPath, htmlName = 'index.html') {
  const mainHtml = path.resolve(process.cwd(), `${distPath}/${htmlName}`);
  if (fs.existsSync(mainHtml)) {
    let html = fs.readFileSync(mainHtml, 'utf-8');
    html = html.replace('</body>', `<script>console.log("%c${str}", 'color:blue')</script></body>`);
    fs.writeFileSync(mainHtml, html, 'utf-8');
  }
}

// 从 package.json 中获取包名和相关信息
function getPackageInfo() {
  const packageJsonPath = path.resolve(__dirname, '../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const packageName = packageJson.name;

  return {
    packageJson,
    packageName
  };
}

// 将 kebab-case 转换为 PascalCase
function kebabToPascalCase(str, suffix = '') {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('') + suffix;
}

// ES 模块导出
export {
  packAndRenameDist,
  getUserName,
  getCurrentBranchName,
  formatDate,
  writeVersion,
  updateMainHtml,
  getPackageInfo,
  kebabToPascalCase
};