# 生辰八字多端小程序

基于 uni-app 框架开发的生辰八字测算应用，支持微信小程序、抖音小程序、H5、APP等多个平台。

## 技术栈

- **框架**: uni-app (Vue 3)
- **样式**: SCSS
- **图标**: Font Awesome 6
- **图片**: Unsplash

## 项目结构

```
szbzMiniApp/
├── pages/              # 页面目录
│   ├── index/         # 首页
│   ├── info/          # 信息展示页
│   ├── payment/       # 支付页
│   └── result/        # 结果页
├── static/            # 静态资源
├── App.vue            # 应用入口
├── main.js            # 主入口文件
├── pages.json         # 页面配置
├── manifest.json      # 应用配置
└── package.json       # 依赖配置
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发运行

```bash
# 微信小程序
npm run dev:mp-weixin

# 抖音小程序
npm run dev:mp-toutiao

# H5
npm run dev:h5

# APP
npm run dev:app
```

### 构建打包

```bash
# 微信小程序
npm run build:mp-weixin

# 抖音小程序
npm run build:mp-toutiao

# H5
npm run build:h5

# APP
npm run build:app
```

## 功能特性

### 首页
- 性别选择（Tab切换）
- 出生年份选择（1950-2099年）
- 出生月份选择（1-12月）
- 出生日期选择（根据月份动态变化）
- 出生时辰选择（十二时辰）
- 表单验证与提交

### 设计风格
- 暖色系配色方案
- 中国红主题色 (#C8102E)
- 现代简约的UI设计
- 优雅的动画效果
- 响应式布局

## 开发说明

1. 推荐使用 HBuilderX 进行开发
2. 微信小程序需要在微信开发者工具中预览
3. 抖音小程序需要在抖音开发者工具中预览
4. 使用前请先配置相应平台的 appid

## 注意事项

- 确保已安装 Node.js 14+ 版本
- 开发微信小程序需安装微信开发者工具
- 开发抖音小程序需安装抖音开发者工具
- 使用外部图标库需要在小程序平台配置域名白名单
