# 快速启动指南

## 📦 准备工作

### 1. 环境要求
- Node.js v14+
- MySQL 5.7+ 或 8.0+
- 微信开发者工具

### 2. 微信相关
- 微信小程序 AppID
- 微信支付商户号（用于支付功能）

## 🚀 启动步骤

### 第一步：配置数据库

1. 创建数据库
```bash
mysql -u root -p
```

```sql
CREATE DATABASE daoguan_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. 导入表结构
```bash
mysql -u root -p daoguan_db < backend/database/schema.sql
```

验证导入成功：
```sql
USE daoguan_db;
SHOW TABLES;
SELECT * FROM services;  -- 查看示例数据
```

### 第二步：配置后端

1. 进入后端目录
```bash
cd backend
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

4. 编辑 `.env` 文件，填入真实配置：
```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=你的数据库密码
DB_NAME=daoguan_db

# 微信小程序配置
WECHAT_APPID=你的小程序AppID
WECHAT_SECRET=你的小程序Secret

# 微信支付配置（暂时可以不填，不影响其他功能）
WECHAT_MCH_ID=your_mch_id
WECHAT_PAY_KEY=your_pay_key
```

5. 启动后端服务
```bash
# 开发模式（推荐）
npm run dev

# 或生产模式
npm start
```

看到以下提示表示启动成功：
```
✅ 数据库连接成功
🚀 服务器启动成功
📍 端口: 3000
🌍 环境: development
🔗 访问: http://localhost:3000
```

6. 测试接口
在浏览器访问：http://localhost:3000/health

应该看到：
```json
{"status":"ok","message":"道观服务API运行中"}
```

### 第三步：配置小程序

1. 打开微信开发者工具

2. 选择"导入项目"

3. 填写信息：
   - 项目目录：选择 `miniprogram` 文件夹
   - AppID：填入你的小程序 AppID
   - 项目名称：道观服务预约

4. 修改后端API地址

打开 `miniprogram/app.js`，修改第4行：
```javascript
baseUrl: 'http://localhost:3000/api'  // 本地开发
// 正式环境需要改为线上HTTPS地址
```

5. 在开发者工具中配置不校验合法域名（仅开发阶段）
   - 点击右上角"详情"
   - 勾选"不校验合法域名、web-view..."

### 第四步：测试运行

1. 在微信开发者工具中点击"编译"

2. 测试功能流程：
   - 查看服务列表 ✓
   - 点击服务进入详情 ✓
   - 点击"立即预约"创建订单 ✓
   - 填写人员信息（会自动计算八字）✓
   - 提交订单 ✓
   - 查看订单列表和详情 ✓

## ✅ 验证清单

- [ ] 数据库创建成功，包含5张表
- [ ] 数据库中有示例服务数据（5条）
- [ ] 后端服务启动成功，端口3000
- [ ] 访问 http://localhost:3000/health 返回正常
- [ ] 小程序编译成功，无报错
- [ ] 小程序首页能显示服务列表
- [ ] 能够创建订单并填写人员信息
- [ ] 人员出生信息能正确计算八字

## ⚠️ 常见问题

### 1. 数据库连接失败
```
❌ 数据库连接失败: ER_ACCESS_DENIED_ERROR
```
**解决方案**：检查 `.env` 文件中的数据库用户名和密码是否正确

### 2. 小程序请求失败
```
request:fail url not in domain list
```
**解决方案**：
- 开发阶段：在开发者工具"详情"中勾选"不校验合法域名"
- 正式环境：需要在微信公众平台配置服务器域名（HTTPS）

### 3. 端口被占用
```
Error: listen EADDRINUSE: address already in use :::3000
```
**解决方案**：
- 修改 `.env` 中的 `PORT=3001`
- 或关闭占用3000端口的其他程序

### 4. npm install 失败
**解决方案**：
```bash
# 切换npm镜像源
npm config set registry https://registry.npmmirror.com

# 重新安装
npm install
```

### 5. 八字计算错误
**可能原因**：
- 出生日期格式不正确（必须是 YYYY-MM-DD）
- 时辰值超出范围（必须是0-11）

## 📱 下一步

### 正式上线前的准备

1. **服务器部署**
   - 购买云服务器（阿里云、腾讯云等）
   - 部署后端代码
   - 配置HTTPS证书
   - 配置域名

2. **微信小程序配置**
   - 在微信公众平台配置服务器域名
   - 修改 `miniprogram/app.js` 中的 `baseUrl` 为线上地址
   - 上传代码并提交审核

3. **微信支付配置**
   - 申请微信支付商户号
   - 配置API密钥和证书
   - 完善支付回调逻辑

4. **功能测试**
   - 完整流程测试
   - 支付功能测试
   - 多设备兼容性测试

5. **数据备份**
   - 设置数据库定期备份
   - 配置日志系统

## 💡 开发建议

1. 开发新功能前先备份数据库
2. 代码提交前测试核心功能
3. 定期查看服务器日志
4. 重要配置信息不要提交到代码仓库

## 📞 获取帮助

遇到问题？查看完整文档：[README.md](README.md)

---

祝开发顺利！🎉
