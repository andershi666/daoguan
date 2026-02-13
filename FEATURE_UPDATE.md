# 功能更新说明

## 📅 更新时间：2024-01-20

## ✨ 新增功能

### 1. 服务分类功能

#### 前端实现

**页面：首页 (pages/index/)**

- 新增横向滚动的分类标签栏
- 支持按分类筛选服务
- 分类包括：全部、法事服务、祈福服务、吉祥物品
- 选中状态高亮显示（浅黄色背景）

**文件修改：**

- [miniprogram/pages/index/index.wxml](miniprogram/pages/index/index.wxml)
  - 添加 `<scroll-view>` 分类标签栏
  - 显示分类图标和名称

- [miniprogram/pages/index/index.wxss](miniprogram/pages/index/index.wxss)
  - 分类标签样式 `.category-tab`
  - 激活状态样式 `.category-tab.active`
  - 服务卡片分类标签 `.service-category`

- [miniprogram/pages/index/index.js](miniprogram/pages/index/index.js)
  - `loadCategories()` - 加载分类列表
  - `switchCategory()` - 切换分类筛选
  - 新增 `categories`、`currentCategory`、`allServices` 数据字段

**模拟数据：**

- [miniprogram/utils/mockData.js](miniprogram/utils/mockData.js)
  - 新增 `mockCategories` 数组
  - 更新 `mockServices` 添加 `category_id` 和 `category_name` 字段
  - 新增第6个服务："健康祈福"

#### 后端实现

**数据库：**

- [backend/database/schema.sql](backend/database/schema.sql)
  - 新增 `categories` 表（分类表）
    - id: 分类ID
    - name: 分类名称
    - icon: 分类图标（emoji）
    - sort_order: 排序值
    - status: 状态（active/inactive）
  - 更新 `services` 表
    - 新增 `category_id` 字段，关联到 categories 表
  - 插入示例分类数据：法事服务、祈福服务、吉祥物品

**API接口：**

- [backend/src/routes/categories.js](backend/src/routes/categories.js) （新建）
  - `GET /api/categories` - 获取所有分类
  - `GET /api/categories/:id` - 获取单个分类
  - `POST /api/categories` - 创建分类（管理员）

- [backend/src/routes/services.js](backend/src/routes/services.js) （修改）
  - `GET /api/services` - 支持 `?category_id=xx` 参数筛选
  - 查询结果包含 `category_name` 字段
  - `POST /api/services` - 创建服务时需要提供 `category_id`

- [backend/src/app.js](backend/src/app.js) （修改）
  - 注册 `/api/categories` 路由

### 2. 底部导航栏

#### 实现

**配置文件：**

- [miniprogram/app.json](miniprogram/app.json)
  - 新增 `tabBar` 配置
  - 两个标签：
    - 服务 (pages/index/index)
    - 订单 (pages/order-list/order-list)
  - 样式配置：
    - 默认颜色：#666666
    - 选中颜色：#8B4513（棕色，与主题一致）
    - 背景色：白色

**功能说明：**

- 用户可以随时切换到"订单"页面查看历史订单
- 底部固定显示，不会遮挡页面内容
- 自动适配页面底部的 `padding-bottom: 120rpx`

## 📋 分类列表

| ID | 名称 | 图标 | 说明 |
|----|------|------|------|
| 0 | 全部 | 📋 | 显示所有服务 |
| 1 | 法事服务 | 🙏 | 祈福法事、超度法事等 |
| 2 | 祈福服务 | ✨ | 姻缘祈福、事业祈福、健康祈福等 |
| 3 | 吉祥物品 | 🎁 | 平安符等 |

## 📦 服务数据更新

新增第6个服务：
```javascript
{
  id: 6,
  name: '健康祈福',
  description: '祈求身体健康，疾病消除',
  base_price: '150.00',
  price_per_person: '40.00',
  category_id: 2,
  category_name: '祈福服务'
}
```

## 🎨 界面效果

### 分类标签栏
- 横向滚动，支持多个分类
- 每个标签显示图标和名称
- 选中状态：浅黄色背景（#fff5e6）+ 棕色粗体文字

### 服务卡片
- 在服务名称旁边显示小标签（分类名称）
- 小标签样式：棕色文字 + 浅黄色背景

### 底部导航栏
- 固定在底部
- 两个标签：服务 / 订单
- 选中时文字变为棕色

## 🔄 使用流程

### 前端开发（模拟数据模式）
1. 确保 [miniprogram/app.js](miniprogram/app.js) 中 `useMockData: true`
2. 直接运行小程序，无需启动后端
3. 可以测试分类切换和服务筛选功能

### 生产环境（真实数据模式）
1. 设置 `useMockData: false`
2. 启动后端服务
3. 执行数据库迁移脚本 [backend/database/schema.sql](backend/database/schema.sql)
4. 后端将从数据库读取分类和服务数据

## 📝 数据库迁移

如果已有旧数据库，需要执行以下SQL：

```sql
-- 1. 创建分类表
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  icon VARCHAR(10) DEFAULT '',
  sort_order INT DEFAULT 0,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. 插入默认分类
INSERT INTO categories (name, icon, sort_order) VALUES
('法事服务', '🙏', 1),
('祈福服务', '✨', 2),
('吉祥物品', '🎁', 3);

-- 3. 给 services 表添加 category_id 字段
ALTER TABLE services ADD COLUMN category_id INT NOT NULL DEFAULT 1 AFTER description;
ALTER TABLE services ADD FOREIGN KEY (category_id) REFERENCES categories(id);

-- 4. 更新现有服务的分类ID（根据实际情况调整）
UPDATE services SET category_id = 1 WHERE name IN ('祈福法事', '超度法事');
UPDATE services SET category_id = 2 WHERE name IN ('姻缘祈福', '事业祈福', '健康祈福');
UPDATE services SET category_id = 3 WHERE name IN ('平安符');
```

## ✅ 完成状态

- ✅ 服务分类功能（前端 + 后端）
- ✅ 底部导航栏
- ✅ 数据库schema更新
- ✅ 模拟数据更新
- ✅ API路由更新

## 🔗 相关文件

### 前端
- [miniprogram/app.json](miniprogram/app.json) - tabBar配置
- [miniprogram/pages/index/index.js](miniprogram/pages/index/index.js) - 分类逻辑
- [miniprogram/pages/index/index.wxml](miniprogram/pages/index/index.wxml) - 分类UI
- [miniprogram/pages/index/index.wxss](miniprogram/pages/index/index.wxss) - 分类样式
- [miniprogram/utils/mockData.js](miniprogram/utils/mockData.js) - 模拟数据

### 后端
- [backend/database/schema.sql](backend/database/schema.sql) - 数据库设计
- [backend/src/routes/categories.js](backend/src/routes/categories.js) - 分类API
- [backend/src/routes/services.js](backend/src/routes/services.js) - 服务API（已更新）
- [backend/src/app.js](backend/src/app.js) - 路由注册

---

**更新完成！** 🎉

现在用户可以：
1. 通过分类标签快速筛选服务
2. 使用底部导航栏随时查看订单
3. 更好地浏览和选择道观服务
