# 如何添加 TabBar 图标

## 当前状态

✅ TabBar 文字已更新：
- "服务" → "服务清单"
- "订单" → "我的订单"

⚠️ 图标配置已暂时移除，小程序可以正常运行

## 三种方法添加图标

### 方法一：使用浏览器生成器 ⭐ 推荐

**最简单！无需安装任何依赖**

1. 打开文件：`miniprogram/images/tabbar/icon-generator.html`
   - Windows: 双击文件
   - 或右键 → "打开方式" → 选择浏览器

2. 在浏览器中点击"一键下载全部图标"按钮

3. 将下载的 4 个 PNG 文件移动到项目中：
   ```
   daoguan-miniprogram/
     └── miniprogram/
         └── images/
             └── tabbar/
                 ├── service-normal.png   ← 下载的文件
                 ├── service-active.png   ← 下载的文件
                 ├── order-normal.png     ← 下载的文件
                 └── order-active.png     ← 下载的文件
   ```

4. 在 `app.json` 中恢复图标配置（见下方）

### 方法二：使用 Node.js 生成

**需要安装 canvas 库**

```bash
# 1. 安装依赖
npm install canvas

# 2. 生成图标
node miniprogram/images/tabbar/generate-icons-canvas.js

# 3. 在 app.json 中恢复图标配置
```

### 方法三：手动下载图标

从图标网站下载：
- [阿里图标库](https://www.iconfont.cn/) - 搜索"列表"、"订单"
- [Flaticon](https://www.flaticon.com/) - 搜索"list"、"order"
- [IconMonstr](https://iconmonstr.com/)

图标要求：
- 尺寸：81×81px（或更大如 162×162px）
- 格式：PNG
- 背景：透明
- 文件名：
  - service-normal.png（灰色 #666666）
  - service-active.png（棕色 #8B4513）
  - order-normal.png（灰色 #666666）
  - order-active.png（棕色 #8B4513）

## 恢复图标配置

图标文件准备好后，在 `app.json` 中修改 tabBar 配置：

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

## 验证图标

1. 在微信开发者工具中编译项目
2. 检查 TabBar 是否显示图标
3. 点击切换 tab，查看图标颜色是否正确变化
4. 如果图标不显示，尝试：
   - 清除缓存：工具栏 → 清缓存 → 清除文件缓存
   - 重新编译项目

## 当前可以不添加图标

如果你暂时不想添加图标，小程序已经可以正常运行了。TabBar 会只显示文字，这完全符合微信小程序规范。

图标是可选的，文字 TabBar 也很常见！

## 图标预览

添加图标后的效果：

```
┌─────────────────────────────┐
│  📋           📄            │
│  服务清单     我的订单       │
└─────────────────────────────┘
```

- 服务清单：三行列表图标
- 我的订单：文档/订单图标
