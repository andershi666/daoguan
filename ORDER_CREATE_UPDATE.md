# 订单创建页面UI优化更新

## 更新日期
2026-02-13

## 更新内容

### 1. 调整字段高度
- **出生日期** 和 **出生时辰** 字段的高度已调整为与姓名输入框相同（80rpx）
- 移除了 `display: flex` 和 `align-items: center`，改用 `line-height: 80rpx` 实现垂直居中
- 调整了内边距为 `0 20rpx` 以保持一致性

### 2. 地址字段重构
- **居住地址** 字段已从"其他信息"部分移至每个人员信息中
- 现在每个人员都有独立的居住地址字段
- 每添加一个人员，该人员都需要维护自己的居住地址信息

## 修改文件清单

### 前端修改

1. **miniprogram/pages/order-create/order-create.wxml**
   - 在人员信息卡片中添加了居住地址输入框
   - 从"其他信息"部分移除了居住地址字段

2. **miniprogram/pages/order-create/order-create.wxss**
   - 调整 `.picker-display` 样式：
     - `line-height: 80rpx` (原: 40rpx)
     - `padding: 0 20rpx` (原: 20rpx)
     - 移除 `display: flex` 和 `align-items: center`

3. **miniprogram/pages/order-create/order-create.js**
   - 数据结构中为每个 person 添加 `address: ''` 字段
   - 更新 `addPerson()` 方法，新增人员包含 address 字段
   - 更新 `onAddressInput()` 方法，现在接收 `data-index` 并更新对应人员的地址
   - 提交订单时移除全局 `address` 字段

4. **miniprogram/pages/order-detail/order-detail.wxml**
   - 在人员信息显示中添加地址字段
   - 从"其他信息"部分移除地址显示（仅保留备注说明）

5. **miniprogram/utils/mockData.js**
   - 为模拟订单详情的 persons 数组中的每个人员添加 `address` 字段

### 后端修改

1. **backend/database/schema.sql**
   - 在 `order_persons` 表中添加 `address VARCHAR(500)` 字段

2. **backend/database/migration_add_address_to_persons.sql** (新增)
   - 数据库迁移脚本，用于更新现有数据库
   - 为 `order_persons` 表添加 `address` 字段

3. **backend/src/routes/orders.js**
   - 移除创建订单时的全局 `address` 参数
   - 更新订单插入 SQL，移除 `address` 字段
   - 从 person 对象中提取 `address` 字段
   - 在插入人员信息时包含 `address` 字段

## 数据库迁移

如果已有数据库，需要执行以下迁移：

```bash
mysql -u root -p daoguan_db < backend/database/migration_add_address_to_persons.sql
```

或者手动执行：

```sql
USE daoguan_db;

ALTER TABLE order_persons
ADD COLUMN address VARCHAR(500) DEFAULT '' COMMENT '居住地址'
AFTER lunar_date;
```

## 兼容性说明

- `orders` 表中的 `address` 字段保留以实现向后兼容
- 如果确定不再需要，可以删除该字段：
  ```sql
  ALTER TABLE orders DROP COLUMN address;
  ```

## 测试建议

1. 测试创建订单时为每个人员输入不同的地址
2. 验证订单详情页面正确显示每个人员的地址
3. 测试删除人员时地址信息也被正确删除
4. 测试添加多个人员时每个人员的地址独立维护

## 视觉效果

- 出生日期和出生时辰选择器现在与姓名输入框高度一致
- 表单布局更加统一和美观
- 每个人员信息卡片完整包含该人员的所有信息（包括地址）
