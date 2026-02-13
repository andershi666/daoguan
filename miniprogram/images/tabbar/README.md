# TabBar 图标说明

## 图标要求

微信小程序 TabBar 图标需要：
- 格式：PNG
- 尺寸：建议 81px × 81px（最小 40px × 40px）
- 每个 tab 需要两个图标：
  - 未选中状态（灰色）
  - 选中状态（棕色 #8B4513）

## 所需图标列表

### 1. 服务清单 (Service List)
- **未选中**: `service-normal.png` - 灰色列表图标
- **选中**: `service-active.png` - 棕色列表图标

推荐图标样式：
- 📋 列表图标
- 或者三层堆叠的横线图标
- 或者带勾选的清单图标

### 2. 我的订单 (My Orders)
- **未选中**: `order-normal.png` - 灰色订单图标
- **选中**: `order-active.png` - 棕色订单图标

推荐图标样式：
- 📄 文档图标
- 或者订单小票图标
- 或者带时钟的订单图标

## 临时解决方案

由于 Claude Code 无法直接创建图片文件，你可以：

### 方案1：使用在线图标库
访问以下网站下载图标：
- https://www.iconfont.cn/ (阿里巴巴矢量图标库)
- https://www.flaticon.com/ (Flaticon)
- https://iconmonstr.com/

搜索关键词：
- "list" / "清单" / "列表"
- "order" / "订单" / "document"

### 方案2：使用微信开发者工具
1. 打开微信开发者工具
2. 在左侧文件管理器中右键 `images/tabbar` 目录
3. 选择"在文件管理器中显示"
4. 将下载的图标文件放入该目录

### 方案3：使用 base64 内联图标（不推荐）
可以使用 base64 编码的小图标，但会增加包大小。

## 图标规范

### 颜色
- **未选中状态**: #666666 (灰色)
- **选中状态**: #8B4513 (棕色，与 navigationBar 颜色一致)

### 背景
- 透明背景（PNG 格式）

### 线条
- 线条粗细：2-3px
- 圆角：2-3px
- 风格：简约、扁平化

## 示例代码

图标准备好后，app.json 配置如下：

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

## 快速生成图标

如果你有设计工具（如 Figma, Sketch, Photoshop），可以：

1. 创建 81×81px 的画布
2. 在中心区域（60×60px）绘制图标
3. 导出两个版本：
   - 灰色版本 (#666666)
   - 棕色版本 (#8B4513)
4. 保存为 PNG 格式
5. 放入 `images/tabbar/` 目录
