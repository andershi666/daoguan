# 道观服务预约小程序

一个完整的微信小程序项目，用于道观服务预约、人员信息收集、八字计算和在线支付。

## 📋 项目概述

本项目为道观提供完整的线上服务预约解决方案，用户可以：
- 浏览各类道观服务
- 添加多位人员信息（姓名、性别、出生日期、时辰）
- 自动计算每位人员的八字信息
- 填写居住地址和备注说明
- 完成订单创建和微信在线支付

## 🏗️ 技术栈

### 后端
- **运行环境**: Node.js
- **框架**: Express
- **数据库**: MySQL
- **八字计算**: lunar-javascript
- **支付**: 微信支付V3 API

### 前端
- **平台**: 微信小程序（原生开发）
- **UI样式**: 自定义样式

## 📁 项目结构

```
daoguan-miniprogram/
├── backend/                    # 后端代码
│   ├── database/
│   │   └── schema.sql         # 数据库表结构
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js    # 数据库配置
│   │   ├── routes/
│   │   │   ├── auth.js        # 认证路由
│   │   │   ├── services.js    # 服务管理路由
│   │   │   ├── orders.js      # 订单管理路由
│   │   │   └── payment.js     # 支付路由
│   │   ├── utils/
│   │   │   └── bazi.js        # 八字计算工具
│   │   └── app.js             # 应用入口
│   ├── package.json
│   ├── .env.example           # 环境变量示例
│   └── .gitignore
│
└── miniprogram/               # 小程序代码
    ├── pages/
    │   ├── index/             # 服务列表页
    │   ├── service-detail/    # 服务详情页
    │   ├── order-create/      # 创建订单页
    │   ├── order-list/        # 订单列表页
    │   └── order-detail/      # 订单详情页
    ├── images/                # 图片资源
    ├── app.js                 # 小程序逻辑
    ├── app.json               # 小程序配置
    ├── app.wxss               # 全局样式
    ├── project.config.json    # 项目配置
    └── sitemap.json           # 站点地图
```

## 🗄️ 数据库设计

### 核心表

1. **services** - 服务表
   - 存储各类道观服务信息
   - 包含基础价格和每人加价

2. **orders** - 订单表
   - 存储订单基本信息
   - 关联用户和服务
   - 记录订单状态和支付状态

3. **order_persons** - 订单人员信息表
   - 存储每个订单的多位人员详细信息
   - 包含姓名、性别、出生信息
   - 自动计算的八字、五行、生肖等信息

4. **payments** - 支付记录表
   - 记录支付交易信息
   - 关联订单和微信交易号

5. **users** - 用户表（可选）
   - 存储微信用户基本信息

## 🚀 快速开始

### 后端部署

1. **安装依赖**
```bash
cd backend
npm install
```

2. **配置环境变量**
```bash
# 复制环境变量示例文件
cp .env.example .env

# 编辑.env文件，填入实际配置
# - 数据库连接信息
# - 微信小程序 AppID 和 Secret
# - 微信支付商户信息
```

3. **初始化数据库**
```bash
# 导入数据库结构
mysql -u root -p < database/schema.sql
```

4. **启动服务**
```bash
# 开发模式（使用nodemon自动重启）
npm run dev

# 生产模式
npm start
```

服务将在 http://localhost:3000 启动

### 小程序部署

1. **安装微信开发者工具**
   - 下载地址: https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html

2. **导入项目**
   - 打开微信开发者工具
   - 选择"导入项目"
   - 选择 `miniprogram` 目录
   - 填入小程序 AppID

3. **配置后端地址**
   - 编辑 [miniprogram/app.js](miniprogram/app.js)
   - 修改 `baseUrl` 为实际后端地址

4. **配置服务器域名**
   - 在微信公众平台配置服务器域名
   - 必须使用 HTTPS 协议

5. **上传代码**
   - 在开发者工具中点击"上传"
   - 提交审核并发布

## 🔧 核心功能说明

### 1. 八字计算

使用 `lunar-javascript` 库实现：
- 公历转农历
- 根据出生年月日时计算天干地支
- 计算五行属性
- 确定生肖

详见 [backend/src/utils/bazi.js](backend/src/utils/bazi.js:17-142)

### 2. 时辰对应

12个时辰对应关系：
- 子时(23:00-01:00) - 丑时(01:00-03:00)
- 寅时(03:00-05:00) - 卯时(05:00-07:00)
- 辰时(07:00-09:00) - 巳时(09:00-11:00)
- 午时(11:00-13:00) - 未时(13:00-15:00)
- 申时(15:00-17:00) - 酉时(17:00-19:00)
- 戌时(19:00-21:00) - 亥时(21:00-23:00)

### 3. 订单流程

1. 用户浏览服务列表
2. 选择服务进入详情页
3. 点击预约，填写订单信息：
   - 添加多位人员（姓名、性别、出生日期、时辰）
   - 填写居住地址
   - 填写备注说明
4. 系统自动计算每位人员的八字
5. 根据人数计算订单总额
6. 提交订单
7. 调起微信支付
8. 支付成功后更新订单状态

### 4. 价格计算规则

```
订单总额 = 服务基础价格 + (人员数量 × 每人加价)
```

例如：
- 祈福法事基础价格：200元
- 每增加一人：+50元
- 3人订单总额：200 + (3 × 50) = 350元

## 🔐 环境配置说明

### 后端环境变量 (.env)

```env
# 数据库配置
DB_HOST=localhost          # 数据库主机
DB_PORT=3306              # 数据库端口
DB_USER=root              # 数据库用户名
DB_PASSWORD=your_password # 数据库密码
DB_NAME=daoguan_db        # 数据库名称

# 微信小程序配置
WECHAT_APPID=wxxxxxxxxxxx       # 小程序AppID
WECHAT_SECRET=xxxxxxxxxxxxxxxxx # 小程序Secret

# 微信支付配置
WECHAT_MCH_ID=1234567890                      # 商户号
WECHAT_PAY_KEY=xxxxxxxxxxxxxxxxxxxxxxxx       # API密钥
WECHAT_PAY_NOTIFY_URL=https://your-domain.com/api/payment/notify  # 支付回调地址
```

### 小程序配置

在 [miniprogram/project.config.json](miniprogram/project.config.json:19) 中配置：
```json
{
  "appid": "your_wechat_appid_here"
}
```

## 📡 API接口文档

### 认证相关

#### POST /api/auth/login
微信小程序登录

**请求参数:**
```json
{
  "code": "微信登录code"
}
```

### 服务相关

#### GET /api/services
获取服务列表

#### GET /api/services/:id
获取服务详情

#### POST /api/services
创建服务（管理员）

### 订单相关

#### POST /api/orders
创建订单

**请求参数:**
```json
{
  "user_id": "用户ID",
  "service_id": 1,
  "persons": [
    {
      "name": "张三",
      "gender": "male",
      "birth_date": "1990-01-01",
      "shichen_value": 0
    }
  ],
  "address": "北京市朝阳区",
  "remark": "备注信息"
}
```

#### GET /api/orders?user_id=xxx
获取用户订单列表

#### GET /api/orders/:id
获取订单详情

### 支付相关

#### POST /api/payment/create
创建支付订单

#### POST /api/payment/notify
微信支付回调通知（由微信服务器调用）

#### GET /api/payment/status/:order_id
查询支付状态

### 工具接口

#### GET /api/shichen
获取时辰列表

## 🎨 UI设计说明

### 颜色方案
- 主色调: `#8B4513` (棕褐色，代表道观古朴)
- 辅助色: `#A0522D` (棕色)
- 文字色: `#333` (深灰)
- 次要文字: `#666` / `#999`
- 背景色: `#f5f5f5`

### 页面风格
- 简洁大方，符合宗教场所的庄重感
- 圆角卡片设计，现代化界面
- 清晰的信息层级
- 友好的交互反馈

## ⚠️ 注意事项

### 1. 微信支付配置
- 需要在微信支付商户平台配置API密钥
- 需要下载并配置API证书
- 回调地址必须是HTTPS且已备案的域名

### 2. 服务器域名配置
小程序必须配置合法域名：
- request合法域名
- uploadFile合法域名
- downloadFile合法域名

### 3. 数据安全
- 用户隐私信息（姓名、生辰八字等）需妥善保管
- 支付相关接口需要严格的权限验证
- 建议启用HTTPS加密传输

### 4. 时辰计算
- 子时跨越两天（23:00-01:00），需要特殊处理
- 不同地区可能有时区差异，建议统一使用北京时间

### 5. 八字计算准确性
- 使用的农历算法基于现代天文计算
- 对于历史久远的日期可能存在误差
- 建议提示用户核对八字结果

## 📝 后续开发建议

### 功能扩展
1. **用户系统完善**
   - 用户注册/登录
   - 个人资料管理
   - 常用人员信息保存

2. **订单管理**
   - 订单取消功能
   - 退款功能
   - 订单评价

3. **后台管理系统**
   - 服务管理界面
   - 订单管理界面
   - 数据统计分析
   - 财务报表

4. **通知功能**
   - 订单状态变更通知
   - 法事安排通知
   - 模板消息推送

5. **优惠功能**
   - 优惠券系统
   - 会员积分
   - 推荐奖励

### 性能优化
- 接口响应缓存
- 图片CDN加速
- 数据库查询优化
- 分页加载优化

### 安全增强
- API接口鉴权
- 请求频率限制
- SQL注入防护
- XSS攻击防护

## 📞 技术支持

如有问题，请联系开发团队。

## 📄 许可证

MIT License

---

**祝项目顺利！** 🙏
