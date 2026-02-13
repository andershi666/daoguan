/**
 * 使用 Canvas 生成 TabBar 图标
 *
 * 安装依赖：
 * npm install canvas
 *
 * 运行：
 * node miniprogram/images/tabbar/generate-icons-canvas.js
 */

const fs = require('fs');
const path = require('path');

// 检查 canvas 是否安装
let Canvas;
try {
  Canvas = require('canvas');
} catch (e) {
  console.error('❌ 未安装 canvas 库');
  console.error('请运行: npm install canvas');
  console.error('或使用浏览器版本的生成器: icon-generator.html');
  process.exit(1);
}

const { createCanvas } = Canvas;

// 配置
const SIZE = 81;
const COLORS = {
  normal: '#666666',
  active: '#8B4513'
};

/**
 * 绘制服务清单图标（列表）
 */
function drawServiceIcon(ctx, color) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // 三行列表
  const lines = [
    { x: 20, y: 25, width: 41 },
    { x: 20, y: 40, width: 41 },
    { x: 20, y: 55, width: 41 }
  ];

  lines.forEach(line => {
    // 圆点
    ctx.beginPath();
    ctx.arc(line.x, line.y, 3, 0, Math.PI * 2);
    ctx.fill();

    // 横线
    ctx.beginPath();
    ctx.moveTo(line.x + 8, line.y);
    ctx.lineTo(line.x + line.width, line.y);
    ctx.stroke();
  });
}

/**
 * 绘制订单图标（文档）
 */
function drawOrderIcon(ctx, color) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // 文档外框
  ctx.beginPath();
  ctx.moveTo(25, 18);
  ctx.lineTo(48, 18);
  ctx.lineTo(56, 26);
  ctx.lineTo(56, 63);
  ctx.lineTo(25, 63);
  ctx.closePath();
  ctx.stroke();

  // 右上角折角
  ctx.beginPath();
  ctx.moveTo(48, 18);
  ctx.lineTo(48, 26);
  ctx.lineTo(56, 26);
  ctx.stroke();

  // 文档内容线条
  [35, 43, 51].forEach(y => {
    ctx.beginPath();
    ctx.moveTo(32, y);
    ctx.lineTo(49, y);
    ctx.stroke();
  });
}

/**
 * 生成图标
 */
function generateIcon(name, drawFunc, color) {
  const canvas = createCanvas(SIZE, SIZE);
  const ctx = canvas.getContext('2d');

  // 清除画布（透明背景）
  ctx.clearRect(0, 0, SIZE, SIZE);

  // 绘制图标
  drawFunc(ctx, color);

  // 保存为 PNG
  const buffer = canvas.toBuffer('image/png');
  const filePath = path.join(__dirname, `${name}.png`);
  fs.writeFileSync(filePath, buffer);

  console.log(`✅ 生成: ${name}.png`);
}

// 生成所有图标
console.log('🎨 开始生成 TabBar 图标...\n');

generateIcon('service-normal', drawServiceIcon, COLORS.normal);
generateIcon('service-active', drawServiceIcon, COLORS.active);
generateIcon('order-normal', drawOrderIcon, COLORS.normal);
generateIcon('order-active', drawOrderIcon, COLORS.active);

console.log('\n✅ 所有图标生成完成！');
console.log('📁 位置: miniprogram/images/tabbar/');
console.log('\n下一步：在 app.json 中恢复 iconPath 配置');
