# Build Version Tracker

一个通用的构建工具插件，用于版本跟踪和构建自动化（支持 Webpack 3.0+ 和 Vite）。

## 功能特性

- 📦 自动生成构建版本信息
- 🔍 记录构建人、分支和时间
- 📄 生成版本文件 (version.txt)
- 🗜️ 自动打包构建产物为 ZIP 文件
- 🌐 插件完全通过配置参数控制行为，不依赖环境变量
- ⚡ 同时支持 Webpack (3.0+) 和 Vite 构建工具
- 🔧 支持 ES 模块和 CommonJS 模块
- 🛠️ 智能版本检测，自动适配不同 Webpack 版本
- ✨ 支持自定义版本信息格式化

## 安装

### 基本安装

```bash
npm install build-version-tracker
# 或
pnpm add build-version-tracker
# 或
yarn add build-version-tracker
```

### 依赖安装

插件需要以下依赖才能正常工作，请根据您的使用场景安装：

#### 如果使用 Webpack 插件：
```bash
npm install adm-zip webpack
# 或
pnpm add adm-zip webpack
# 或
yarn add adm-zip webpack
```

#### 如果使用 Vite 插件：
```bash
npm install adm-zip
# 或
pnpm add adm-zip
# 或
yarn add adm-zip
```

#### 一次性安装所有依赖：
```bash
npm install build-version-tracker adm-zip webpack
# 或
pnpm add build-version-tracker adm-zip webpack
# 或
yarn add build-version-tracker adm-zip webpack
```

## 本地开发测试

### 使用 npm link 进行本地测试

如果您想在本地其他项目中测试该插件，可以使用 `npm link` 方法：

#### 1. 在插件项目中创建全局链接

```bash
# 进入插件项目目录
cd build-version-tracker

# 构建插件
npm run build

# 创建全局链接
npm link
```

#### 2. 在测试项目中链接插件

```bash
# 进入测试项目目录
cd /path/to/your/test-project

# 链接插件
npm link build-version-tracker

# 安装插件的 peerDependencies
npm install adm-zip webpack
```

#### 3. 在测试项目中使用插件

```javascript
// Webpack 配置示例
const BuildVersionTracker = require('build-version-tracker');

module.exports = {
  // ... 其他配置
  plugins: [
    new BuildVersionTracker({
      distPath: 'dist',
      isBuild: true
    })
  ]
};
```

#### 4. 取消链接（测试完成后）

```bash
# 在测试项目中取消链接
npm unlink build-version-tracker

# 重新安装正式版本（如果需要）
npm install build-version-tracker

# 在插件项目中取消全局链接
cd build-version-tracker
npm unlink
```

### 使用 pnpm link（如果使用 pnpm）

```bash
# 在插件项目中
pnpm link --global

# 在测试项目中
pnpm link build-version-tracker
```

### 使用 yarn link（如果使用 yarn）

```bash
# 在插件项目中
yarn link

# 在测试项目中
yarn link build-version-tracker
```

## 使用方法

### Webpack 插件使用

#### CommonJS 语法
```javascript
const BuildVersionTracker = require('build-version-tracker');

module.exports = {
  // ... 其他配置
  plugins: [
    new BuildVersionTracker({
      distPath: 'dist',     // 构建输出目录，默认 'dist'
      isBuild: false,      // 是否启用构建，默认 false
      htmlName: 'index.html', // HTML 文件名，默认 'index.html'
      // 自定义版本信息格式化
      formatVersion: (info) => {
        return `Version: ${info.time}, Branch: ${info.currentBranch}, User: ${info.userName}`;
      },
      // 自定义 HTML 版本信息格式化
      formatHtmlVersion: (info) => {
        return `<div class="version-info">
          <p>Build User: ${info.userName}</p>
          <p>Branch: ${info.currentBranch}</p>
          <p>Time: ${info.time}</p>
        </div>`;
      }
    })
  ]
};
```

#### ES 模块语法
```javascript
import BuildVersionTracker from 'build-version-tracker';

export default {
  // ... 其他配置
  plugins: [
    new BuildVersionTracker({
      distPath: 'dist',
      isBuild: false,
      htmlName: 'index.html',
      // 自定义版本信息格式化
      formatVersion: (info) => {
        return `Version: ${info.time}, Branch: ${info.currentBranch}, User: ${info.userName}`;
      }
    })
  ]
};
```

### Vite 插件使用

#### CommonJS 语法
```javascript
const viteVersionPlugin = require('build-version-tracker/vite');

export default {
  plugins: [
    viteVersionPlugin({
      distPath: 'dist',     // 构建输出目录，默认 'dist'
      isBuild: false,      // 是否启用构建，默认 false
      htmlName: 'index.html', // HTML 文件名，默认 'index.html'
      // 自定义版本信息格式化
      formatVersion: (info) => {
        return `Version: ${info.time}, Branch: ${info.currentBranch}, User: ${info.userName}`;
      }
    })
  ]
};
```

#### ES 模块语法
```javascript
import viteVersionPlugin from 'build-version-tracker/vite';

export default {
  plugins: [
    viteVersionPlugin({
      distPath: 'dist',
      isBuild: false,
      htmlName: 'index.html',
      // 自定义版本信息格式化
      formatVersion: (info) => {
        return `Version: ${info.time}, Branch: ${info.currentBranch}, User: ${info.userName}`;
      }
    })
  ]
};
```

### 配置说明

插件完全通过配置参数控制行为，不依赖环境变量。

### 插件生命周期

#### Webpack 插件
- **Webpack 3.x**: 使用 `plugin('after-emit')` 方法
- **Webpack 4+**: 使用 `hooks.afterEmit.tapAsync()` 方法
- **Webpack 5+**: 使用 `hooks.afterEmit.tapAsync()` 方法（新钩子系统）
- 智能版本检测，自动适配不同 Webpack 版本

#### Vite 插件
- 使用 `closeBundle` 钩子，确保在所有构建操作完成后执行版本信息生成
- 避免使用 `buildEnd` 钩子，防止文件被后续构建步骤覆盖

## 示例

### Webpack 基础使用

```javascript
// webpack.config.js
const BuildVersionTracker = require('build-version-tracker');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new BuildVersionTracker()
  ]
};
```

### Vite 基础使用

```javascript
// vite.config.js
import viteVersionPlugin from 'build-version-tracker/vite';

export default {
  plugins: [
    viteVersionPlugin()
  ],
  build: {
    outDir: 'dist'
  }
};
```

### 自定义配置

```javascript
// Webpack 自定义配置
new BuildVersionTracker({
  distPath: 'build',                    // 自定义输出目录
  isBuild: true,                        // 启用构建功能
  htmlName: 'app.html',                  // 自定义 HTML 文件名
  // 自定义版本信息格式化
  formatVersion: (info) => {
    return `Build: ${info.time}, Branch: ${info.currentBranch}, By: ${info.userName}`;
  }
})

// Vite 自定义配置
viteVersionPlugin({
  distPath: 'build',
  isBuild: true,                        // 启用构建功能
  htmlName: 'app.html',
  // 自定义版本信息格式化
  formatVersion: (info) => {
    return `Build: ${info.time}, Branch: ${info.currentBranch}, By: ${info.userName}`;
  }
})

// 明确配置构建参数（推荐方式）
new BuildVersionTracker({
  distPath: 'dist',        // 明确指定输出目录
  isBuild: true,           // 明确控制构建行为
  htmlName: 'index.html',
  // 自定义版本信息格式化
  formatVersion: (info) => {
    return `Version: ${info.time}, Branch: ${info.currentBranch}, User: ${info.userName}`;
  }
})
```

## 输出文件

插件会在构建完成后生成以下文件：

1. **version.txt**: 包含构建信息的文本文件
2. **dist.zip**: 构建产物的压缩包
3. **HTML 文件更新**: 在 body 标签后插入版本信息脚本

### version.txt 内容示例

```
构建人： username, 构建分支：main, 构建时间：2024-01-01 12:00:00，构建后文件位于：dist
```

### 自定义格式示例

```
Version: 2024-01-01 12:00:00, Branch: main, User: username
```

### HTML 文件更新示例

构建后，HTML 文件会在 `</body>` 标签前插入版本信息脚本：

```html
<script>console.log("%c构建人： username, 构建分支：main, 构建时间：2024-01-01 12:00:00", 'color:blue')</script>
</body>
```

## API

### Webpack 插件选项

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| distPath | string | 'dist' | 构建输出目录 |
| isBuild | boolean | false | 是否启用构建功能 |
| htmlName | string | 'index.html' | HTML 文件名 |
| formatVersion | function | null | 自定义版本信息格式化函数 |
| formatHtmlVersion | function | null | 自定义 HTML 版本信息格式化函数 |

### Vite 插件选项

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| distPath | string | 'dist' | 构建输出目录 |
| isBuild | boolean | false | 是否启用构建功能 |
| htmlName | string | 'index.html' | HTML 文件名 |
| formatVersion | function | null | 自定义版本信息格式化函数 |
| formatHtmlVersion | function | null | 自定义 HTML 版本信息格式化函数 |

### 自定义格式化函数参数

| 参数 | 类型 | 描述 |
|------|------|------|
| userName | string | 构建人 |
| currentBranch | string | 构建分支 |
| time | string | 构建时间 |
| distPath | string | 构建产物路径 |

## 开发

### 项目结构

```
src/
├── index.js          # Webpack 插件实现（支持 3.0+）
├── vite-plugin.js    # Vite 插件实现
└── utils.js          # 公共工具函数
```

### 构建项目

```bash
pnpm run build
# 或
npm run build
```

### 运行测试

```bash
pnpm test
# 或
npm test
```

## 技术实现

### 版本检测机制

插件使用智能版本检测机制，自动适配不同版本的 Webpack：

1. **Webpack 4+**: 从 `compiler.webpack.version` 获取版本信息
2. **Webpack 3.x**: 从 `compiler.version` 获取版本信息
3. **降级策略**: 通过检测钩子系统存在性推断版本

### 钩子系统适配

- **Webpack 3.x**: 使用 `compiler.plugin('after-emit')`
- **Webpack 4+**: 使用 `compiler.hooks.afterEmit.tapAsync()`
- **Vite**: 使用 `closeBundle` 钩子确保构建完成后执行

### 错误处理

插件包含完善的错误处理机制，确保在各种情况下都能优雅降级：
- 版本检测失败时使用默认版本
- 钩子系统不存在时提供详细警告
- 构建过程中的错误会被捕获并记录

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！

- **提交 Issue**: [GitHub Issues](https://github.com/mingyangya/build-version-tracker/issues)
- **提交 Pull Request**: [GitHub Pull Requests](https://github.com/mingyangya/build-version-tracker/pulls)
- **项目仓库**: [GitHub Repository](https://github.com/mingyangya/build-version-tracker)

## 更新日志

### v0.0.4
- 初始版本发布
- 支持 Webpack (3.0+) 和 Vite 构建工具
- 支持 ES 模块和 CommonJS 模块
- 自动生成版本信息和打包构建产物
- 智能版本检测，自动适配不同 Webpack 版本
- 完善的错误处理和降级策略
- 优化测试脚本，支持 ES 模块语法
- ✨ 支持自定义版本信息格式化


### v0.0.3
- 初始版本发布
- 支持 Webpack (3.0+) 和 Vite 构建工具
- 支持 ES 模块和 CommonJS 模块
- 自动生成版本信息和打包构建产物
- 智能版本检测，自动适配不同 Webpack 版本
- 完善的错误处理和降级策略
- ✨优化测试脚本，支持 ES 模块语法

### v0.0.2
- 初始版本发布
- ✨ 支持 Webpack (3.0+) 和 Vite 构建工具
- 支持 ES 模块和 CommonJS 模块
- 自动生成版本信息和打包构建产物
- ✨ 智能版本检测，自动适配不同 Webpack 版本
- ✨ 完善的错误处理和降级策略

### v0.0.1
- 初始版本发布
- 支持 Webpack 和 Vite 构建工具
- 支持 ES 模块和 CommonJS 模块
- 自动生成版本信息和打包构建产物