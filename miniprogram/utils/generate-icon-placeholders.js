const fs = require('fs');
const path = require('path');

/**
 * 生成简单的 PNG 图标
 * 这是一个基础的 PNG 生成器，创建带有简单图形的 81x81 透明背景图标
 */

// 颜色配置
const COLORS = {
  normal: { r: 102, g: 102, b: 102 },    // #666666
  active: { r: 139, g: 69, b: 19 }       // #8B4513
};

// 图标尺寸
const SIZE = 81;

/**
 * 创建基础 PNG 数据结构
 * 注意：这是一个简化版本，实际应使用 canvas 或 sharp 库
 */
function createIconData(color, type) {
  // 创建一个简单的数据结构说明
  return {
    width: SIZE,
    height: SIZE,
    color: color,
    type: type,
    note: '请使用浏览器打开 icon-generator.html 生成实际的 PNG 图标文件'
  };
}

// 创建占位文件
const iconsDir = path.join(__dirname, '../images/tabbar');

// 确保目录存在
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
  console.log('✅ 创建目录:', iconsDir);
}

// 创建说明文件
const readmeContent = `# TabBar 图标

## ⚠️ 重要提示

这些图标需要手动生成！当前目录下的占位文件不是真实的 PNG 图片。

## 快速生成图标

### 方法一：使用浏览器生成器（推荐）⭐

1. 在浏览器中打开 \`icon-generator.html\`
2. 点击"一键下载全部图标"
3. 将下载的 4 个 PNG 文件放到本目录

### 方法二：使用 Node.js 生成（需要安装依赖）

\`\`\`bash
npm install canvas
node generate-icons-canvas.js
\`\`\`

### 方法三：手动下载

从以下网站下载合适的图标：
- [阿里图标库](https://www.iconfont.cn/)
- [Flaticon](https://www.flaticon.com/)

图标规格：
- 尺寸：81×81px
- 格式：PNG
- 背景：透明
- 颜色：灰色 #666666（未选中）/ 棕色 #8B4513（选中）

## 所需文件

- service-normal.png
- service-active.png
- order-normal.png
- order-active.png

## 临时解决方案

如果暂时不需要图标，可以在 app.json 中移除 iconPath 配置：

\`\`\`json
{
  "tabBar": {
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "服务清单"
        // 暂时注释掉图标配置
        // "iconPath": "images/tabbar/service-normal.png",
        // "selectedIconPath": "images/tabbar/service-active.png"
      }
    ]
  }
}
\`\`\`
`;

fs.writeFileSync(path.join(iconsDir, 'README.md'), readmeContent);
console.log('✅ 创建说明文件: README.md');

// 创建 JSON 元数据文件
const icons = [
  { name: 'service-normal', color: COLORS.normal, type: 'list' },
  { name: 'service-active', color: COLORS.active, type: 'list' },
  { name: 'order-normal', color: COLORS.normal, type: 'document' },
  { name: 'order-active', color: COLORS.active, type: 'document' }
];

icons.forEach(icon => {
  const data = createIconData(icon.color, icon.type);
  const jsonPath = path.join(iconsDir, `${icon.name}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
  console.log(`✅ 创建图标元数据: ${icon.name}.json`);
});

console.log('\n📝 下一步操作：');
console.log('1. 在浏览器中打开: miniprogram/images/tabbar/icon-generator.html');
console.log('2. 点击"一键下载全部图标"按钮');
console.log('3. 将下载的 PNG 文件放到: miniprogram/images/tabbar/');
console.log('4. 在 app.json 中恢复 iconPath 配置');
console.log('\n或者直接使用文字 TabBar（已暂时移除图标配置）\n');
