# TabBar 更新说明

## 更新日期
2026-02-13

## 更新内容

### TabBar 文字修改
- "服务" → "服务清单"
- "订单" → "我的订单"

### TabBar 图标添加
为两个 tab 添加了图标配置：

1. **服务清单**
   - 未选中图标：`images/tabbar/service-normal.png` (灰色)
   - 选中图标：`images/tabbar/service-active.png` (棕色)
   - 图标样式：三行列表图标

2. **我的订单**
   - 未选中图标：`images/tabbar/order-normal.png` (灰色)
   - 选中图标：`images/tabbar/order-active.png` (棕色)
   - 图标样式：文档/订单图标

## 图标规格

- **尺寸**: 81×81px
- **格式**: PNG (透明背景)
- **颜色**:
  - 未选中：#666666 (灰色)
  - 选中：#8B4513 (棕色)
- **线条粗细**: 3px
- **风格**: 简约、线条风格

## 如何生成图标

### 方法一：使用提供的生成器（推荐）

1. 在浏览器中打开 `miniprogram/images/tabbar/icon-generator.html`
2. 点击"一键下载全部图标"按钮
3. 将下载的 4 个 PNG 文件放入 `miniprogram/images/tabbar/` 目录
4. 完成！

### 方法二：使用在线图标库

访问以下网站下载合适的图标：
- [阿里巴巴矢量图标库](https://www.iconfont.cn/)
- [Flaticon](https://www.flaticon.com/)
- [IconMonstr](https://iconmonstr.com/)

搜索关键词：
- "list" / "menu" / "清单" (服务清单)
- "order" / "document" / "订单" (我的订单)

### 方法三：自己设计

如果你有设计工具（Figma, Sketch, Photoshop），可以：

1. 创建 81×81px 的画布
2. 在中心区域（约 60×60px）绘制图标
3. 导出两个颜色版本：
   - 灰色版本 (#666666)
   - 棕色版本 (#8B4513)
4. 保存为 PNG 格式（透明背景）
5. 按照文件名保存到指定目录

## 修改文件

### 1. app.json
更新了 tabBar 配置：

```json
{
  "tabBar": {
    "color": "#666666",
    "selectedColor": "#8B4513",
    "backgroundColor": "#ffffff",
    "borderStyle": "black",
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "服务清单",
        "iconPath": "images/tabbar/service-normal.png",
        "selectedIconPath": "images/tabbar/service-active.png"
      },
      {
        "pagePath": "pages/order-list/order-list",
        "text": "我的订单",
        "iconPath": "images/tabbar/order-normal.png",
        "selectedIconPath": "images/tabbar/order-active.png"
      }
    ]
  }
}
```

### 2. 新增目录和文件
- 创建目录：`miniprogram/images/tabbar/`
- 图标生成器：`icon-generator.html`
- 说明文档：`README.md`

## 所需图标文件清单

确保以下文件存在于 `miniprogram/images/tabbar/` 目录：

- ✅ `service-normal.png` - 服务清单未选中图标
- ✅ `service-active.png` - 服务清单选中图标
- ✅ `order-normal.png` - 我的订单未选中图标
- ✅ `order-active.png` - 我的订单选中图标

## 测试清单

- [ ] 在微信开发者工具中编译项目
- [ ] 检查 TabBar 是否显示"服务清单"和"我的订单"
- [ ] 检查图标是否正确显示
- [ ] 切换 tab 时检查图标颜色是否正确变化
- [ ] 检查图标是否清晰（不模糊）

## 常见问题

### Q: 图标不显示怎么办？
A: 检查以下几点：
1. 确认图标文件已放入 `miniprogram/images/tabbar/` 目录
2. 确认文件名完全匹配（区分大小写）
3. 确认图标格式为 PNG
4. 在微信开发者工具中点击"清缓存" → "清除文件缓存"
5. 重新编译项目

### Q: 图标显示模糊？
A:
1. 确保图标尺寸至少为 81×81px
2. 使用 2x 或 3x 尺寸的图标（162×162px 或 243×243px）以支持高清屏幕
3. 导出时选择"导出为 PNG"而非"导出为 JPG"

### Q: 可以使用 SVG 图标吗？
A: 微信小程序 TabBar 目前只支持 PNG 和 JPG 格式，不支持 SVG。

### Q: 图标颜色不对？
A:
1. 确认未选中图标使用 #666666
2. 确认选中图标使用 #8B4513
3. 如果图标是单色的，微信会自动应用配置的颜色

## 视觉效果

更新后的 TabBar：
```
┌──────────────────────────────────────┐
│  [📋]          [📄]                  │
│  服务清单      我的订单               │
└──────────────────────────────────────┘
```

- 图标清晰可见
- 文字描述更明确
- 整体风格统一，符合道观主题
