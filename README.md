# Build Version Tracker

一个通用的构建工具插件，用于版本跟踪和构建自动化（支持 Webpack 和 Vite）。

## 功能特性

- 📦 自动生成构建版本信息
- 🔍 记录构建人、分支和时间
- 📄 生成版本文件 (version.txt)
- 🗜️ 自动打包构建产物为 ZIP 文件
- 🌐 支持环境变量配置
- ⚡ 同时支持 Webpack 和 Vite 构建工具
- 🔧 支持 ES 模块和 CommonJS 模块

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
pnpm link --global build-version-tracker
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
      htmlName: 'index.html' // HTML 文件名，默认 'index.html'
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
      htmlName: 'index.html'
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
      htmlName: 'index.html' // HTML 文件名，默认 'index.html'
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
      htmlName: 'index.html'
    })
  ]
};
```

### 配置说明

插件完全通过配置参数控制行为，不依赖环境变量。

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
  htmlName: 'app.html'                  // 自定义 HTML 文件名
})

// Vite 自定义配置
viteVersionPlugin({
  distPath: 'build',
  isBuild: true,                        // 启用构建功能
  htmlName: 'app.html'
})

// 明确配置构建参数（推荐方式）
new BuildVersionTracker({
  distPath: 'dist',        // 明确指定输出目录
  isBuild: true,           // 明确控制构建行为
  htmlName: 'index.html'
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

### Vite 插件选项

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| distPath | string | 'dist' | 构建输出目录 |
| isBuild | boolean | false | 是否启用构建功能 |
| htmlName | string | 'index.html' | HTML 文件名 |

## 开发

### 项目结构

```
src/
├── index.js          # Webpack 插件实现
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

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！

- **提交 Issue**: [GitHub Issues](https://github.com/mingyangya/build-version-tracker/issues)
- **提交 Pull Request**: [GitHub Pull Requests](https://github.com/mingyangya/build-version-tracker/pulls)
- **项目仓库**: [GitHub Repository](https://github.com/mingyangya/build-version-tracker)

## 更新日志

### v0.0.1
- 初始版本发布
- 支持 Webpack 和 Vite 构建工具
- 支持 ES 模块和 CommonJS 模块
- 自动生成版本信息和打包构建产物