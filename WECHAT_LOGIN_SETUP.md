# 微信小程序登录配置指南

## 概述

本系统已实现微信小程序登录功能,支持:
- ✅ 微信小程序授权登录
- ✅ 用户信息自动注册
- ✅ 模拟登录模式 (开发测试用)

## 配置步骤

### 1. 获取微信小程序 AppID 和 AppSecret

1. 登录 [微信小程序管理后台](https://mp.weixin.qq.com/)
2. 进入 **开发管理** -> **开发设置**
3. 复制以下信息:
   - **AppID** (小程序ID)
   - **AppSecret** (小程序密钥)

### 2. 配置后端环境变量

在服务器的 `/opt/daoguan/backend/.env` 文件中配置:

```env
# 微信小程序配置
WECHAT_APP_ID=wx你的AppID
WECHAT_APP_SECRET=你的AppSecret
```

配置完成后重启服务:

```bash
cd /opt/daoguan/backend
pm2 restart daoguan-backend
pm2 logs daoguan-backend
```

### 3. 配置小程序端

在小程序 `miniprogram/app.js` 中:

```javascript
globalData: {
  baseUrl: 'http://your-server-ip/api',  // 修改为你的服务器地址
  useMockData: false,  // 设置为 false 使用真实登录
  // ...
}
```

### 4. 配置微信小程序服务器域名

在微信小程序管理后台:
1. 进入 **开发管理** -> **开发设置** -> **服务器域名**
2. 在 **request 合法域名** 中添加你的域名:
   ```
   https://your-domain.com
   ```
3. 保存

**注意**: 微信小程序要求使用 HTTPS 域名,开发期间可以在开发者工具中勾选"不校验合法域名"。

## 登录流程

### 正式流程
1. 小程序调用 `wx.login()` 获取 code
2. 将 code 发送到后端 `/api/auth/login`
3. 后端调用微信接口获取 openid 和 session_key
4. 后端检查用户是否存在,不存在则创建
5. 返回 openid 给小程序
6. 小程序保存 openid 到本地存储

### 模拟登录 (开发测试用)
如果未配置微信小程序信息,系统会自动使用模拟登录模式:
- 返回模拟的 openid
- 不需要调用微信接口
- 仅用于开发和测试

**生产环境必须配置真实的微信小程序信息!**

## API 接口

### 1. 登录接口

**接口**: `POST /api/auth/login`

**请求参数**:
```json
{
  "code": "微信登录code"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "openid": "用户openid",
    "session_key": "会话密钥",
    "isNewUser": true,
    "mode": "wechat"
  }
}
```

### 2. 更新用户信息

**接口**: `POST /api/auth/update-profile`

**请求参数**:
```json
{
  "openid": "用户openid",
  "nickname": "用户昵称",
  "avatar_url": "头像地址",
  "phone": "手机号"
}
```

### 3. 获取用户信息

**接口**: `GET /api/auth/profile?openid=xxx`

**响应**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "openid": "xxx",
    "nickname": "用户昵称",
    "avatar_url": "https://xxx.jpg",
    "phone": "13800138000",
    "created_at": "2024-01-01 00:00:00"
  }
}
```

## 数据库表

用户信息存储在 `users` 表中:

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  openid VARCHAR(100) UNIQUE NOT NULL,
  session_key VARCHAR(100),
  nickname VARCHAR(100),
  avatar_url VARCHAR(500),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 常见问题

### 1. 登录返回 400 错误

**原因**:
- 后端未配置微信小程序 AppID 和 AppSecret
- 请求中缺少 code 参数

**解决**:
- 检查后端 `.env` 文件配置
- 确认小程序正确调用了 `wx.login()`

### 2. 登录返回 "模拟登录模式"

**原因**: 后端未配置或配置了错误的微信小程序信息

**解决**: 在服务器 `/opt/daoguan/backend/.env` 中正确配置:
```env
WECHAT_APP_ID=wx你的真实AppID
WECHAT_APP_SECRET=你的真实AppSecret
```

### 3. 网络请求失败

**原因**:
- 服务器地址错误
- 网络不通
- 防火墙拦截

**解决**:
- 检查小程序 `app.js` 中的 `baseUrl` 配置
- 确保服务器可以访问
- 检查阿里云安全组是否开放 3000 端口

### 4. 微信小程序要求使用 HTTPS

**原因**: 微信小程序正式版要求使用 HTTPS 域名

**解决**:
1. 配置域名并购买 SSL 证书
2. 使用 Let's Encrypt 免费证书
3. 在 Nginx 中配置 HTTPS

配置 HTTPS:
```bash
sudo certbot --nginx -d your-domain.com
```

## 开发调试

### 使用开发者工具调试

在微信开发者工具中:
1. 打开 **详情** -> **本地设置**
2. 勾选 **不校验合法域名、web-view(业务域名)、TLS 版本以及 HTTPS 证书**
3. 这样可以使用 HTTP 地址进行开发测试

### 查看日志

**后端日志**:
```bash
pm2 logs daoguan-backend
```

**小程序日志**:
- 打开微信开发者工具
- 点击控制台查看日志输出

## 安全建议

1. **生产环境必须配置真实的微信小程序信息**
2. **使用 HTTPS 协议**
3. **定期更新 AppSecret**
4. **不要在前端代码中暴露敏感信息**
5. **对用户数据进行加密传输**

## 获取帮助

如遇到问题:
1. 检查后端日志: `pm2 logs daoguan-backend`
2. 检查网络连接
3. 确认微信小程序配置正确
4. 查看微信小程序官方文档
