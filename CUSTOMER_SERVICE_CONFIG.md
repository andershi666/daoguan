# 客服配置说明

## 📞 配置客服微信号

### 配置位置

在 [miniprogram/app.js](miniprogram/app.js:11) 文件中：

```javascript
globalData: {
  // ... 其他配置

  // 📞 客服配置：修改为实际的客服微信号
  customerServiceWechat: 'daoguan_service'  // 改为你的客服微信号
}
```

### 修改方法

1. 打开 [miniprogram/app.js](miniprogram/app.js)
2. 找到 `customerServiceWechat` 配置项（第11行）
3. 将 `'daoguan_service'` 改为你实际的客服微信号
4. 保存文件并重新编译小程序

### 示例

```javascript
// 示例1：使用具体微信号
customerServiceWechat: 'weixinhao123'

// 示例2：使用带前缀的微信号
customerServiceWechat: 'daoguan_kefu001'

// 示例3：使用字母数字组合
customerServiceWechat: 'service2024'
```

## 🎯 使用场景

### 订单详情页 - 联系客服按钮

当用户在订单详情页点击"联系客服"按钮时：

1. **弹出提示框**
   - 显示客服微信号
   - 提示用户可以复制微信号

2. **用户操作**
   - 点击"复制微信号"按钮
   - 微信号自动复制到剪贴板
   - 显示"微信号已复制"提示

3. **后续步骤**
   - 用户打开微信
   - 在微信中搜索或添加好友
   - 粘贴刚才复制的微信号

## 💡 功能说明

### 弹窗内容

```
━━━━━━━━━━━━━━━━━━━━
       联系客服
━━━━━━━━━━━━━━━━━━━━

客服微信号：daoguan_service

点击"复制"可将微信号复制到
剪贴板，然后到微信中添加好友

━━━━━━━━━━━━━━━━━━━━
     取消        复制
━━━━━━━━━━━━━━━━━━━━
```

### 复制成功提示

点击"复制"后，会显示：
```
✅ 微信号已复制
```

用户可以直接到微信中粘贴添加好友。

## 🔧 技术实现

### 使用的API

1. **wx.showModal** - 显示弹窗
2. **wx.setClipboardData** - 复制到剪贴板
3. **wx.showToast** - 显示提示

### 重要限制

⚠️ **微信小程序限制**：
- `confirmText` 最多只能4个中文字符
- `cancelText` 最多只能4个中文字符
- 超过限制会导致弹窗无法显示

### 代码位置

- **配置**: [miniprogram/app.js](miniprogram/app.js:11)
- **实现**: [miniprogram/pages/order-detail/order-detail.js](miniprogram/pages/order-detail/order-detail.js:107-147)

## 📱 用户体验流程

```
用户查看订单详情
    ↓
点击"联系客服"按钮
    ↓
弹出客服微信号提示
    ↓
点击"复制"按钮
    ↓
微信号已复制到剪贴板
    ↓
打开微信
    ↓
搜索/添加好友
    ↓
粘贴微信号
    ↓
发送好友申请
```

## 🎨 界面截图说明

### 联系客服按钮
位置：订单详情页底部，左侧按钮
样式：白色背景，棕色边框和文字

### 提示弹窗
- 标题：联系客服
- 内容：显示微信号和使用说明
- 按钮：取消（灰色）/ 复制微信号（蓝色）

## ⚠️ 注意事项

### 1. 微信号格式要求

微信号必须符合微信官方规范：
- ✅ 支持6-20位字母、数字、下划线、减号
- ✅ 必须以字母开头
- ❌ 不能包含特殊字符（@、#、$等）
- ❌ 不能为纯数字

### 2. 建议

- 使用容易记忆的微信号
- 建议包含"道观"、"服务"等关键词
- 可以在多个客服之间轮换（如：kefu01, kefu02）

### 3. 多客服支持

如果需要配置多个客服，可以扩展为数组：

```javascript
// 多客服配置（扩展功能）
customerServiceWechats: [
  { name: '客服01', wechat: 'kefu01' },
  { name: '客服02', wechat: 'kefu02' },
  { name: '客服03', wechat: 'kefu03' }
]
```

## 🔄 未来扩展

### 可能的增强功能

1. **客服在线状态**
   - 显示客服是否在线
   - 自动选择在线客服

2. **企业微信集成**
   - 使用企业微信客服
   - 直接在小程序内聊天

3. **客服工作时间**
   - 显示客服服务时间
   - 非工作时间留言功能

4. **智能客服**
   - 常见问题自动回复
   - AI 辅助客服

## 📝 更新日志

- **v1.0** (2024-01-20)
  - ✅ 初始版本
  - ✅ 支持配置客服微信号
  - ✅ 一键复制微信号功能

---

**配置文件**: [miniprogram/app.js](miniprogram/app.js:11)
**功能文件**: [miniprogram/pages/order-detail/order-detail.js](miniprogram/pages/order-detail/order-detail.js:107-129)
