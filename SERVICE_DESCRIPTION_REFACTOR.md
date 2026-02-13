# 服务描述字段重构说明

## 更新日期
2026-02-13

## 更新内容

### 字段重构
将服务的 `description` 字段拆分为两个字段：

1. **short_description (VARCHAR(200))** - 短描述
   - 用于列表展示
   - 简洁概括服务要点
   - 长度限制：200个字符

2. **description (TEXT)** - 长描述/详细描述
   - 用于详情页展示
   - 详细说明服务内容、流程、适用场景等
   - 无长度限制

## 使用场景

| 页面 | 使用字段 | 说明 |
|------|---------|------|
| 服务列表 (index) | `short_description` | 在卡片中快速展示服务概要 |
| 服务详情 (service-detail) | `description` | 完整展示服务的详细说明 |
| 订单创建 (order-create) | `short_description` | 简要说明所选服务 |
| 订单详情 (order-detail) | `short_description` | 回顾所购买的服务 |

## 数据示例

### 祈福法事

**短描述 (short_description):**
```
为您和家人祈求平安健康，消灾解厄
```

**长描述 (description):**
```
祈福法事是道教传统仪式，通过诵经、焚香、供奉等方式，为信众祈求平安健康、消灾解厄。
法事由道长主持，依据传统科仪进行，帮助您和家人化解困厄，获得平安顺遂。
适合为家人健康、事业顺利、家庭和睦等祈福。
```

### 超度法事

**短描述:**
```
为逝者超度，祈求往生净土
```

**长描述:**
```
超度法事是为亡者举行的道教仪式，通过诵经礼忏、焚化纸钱等方式，超度亡灵，
帮助逝者早日往生净土，脱离轮回之苦。法事庄严肃穆，由经验丰富的道长主持，
为逝者积累功德，同时也为在世亲人祈求平安。
```

## 修改文件清单

### 数据库修改

1. **backend/database/schema.sql**
   - 在 services 表添加 `short_description` 字段
   - 更新示例数据，包含短描述和长描述

2. **backend/database/migration_add_short_description.sql** (新增)
   - 数据库迁移脚本
   - 为现有数据库添加 `short_description` 字段
   - 提供数据迁移示例

### 后端修改

3. **backend/src/routes/orders.js**
   - 订单详情查询改为返回 `s.short_description as service_description`
   - 确保订单详情显示简洁描述

### 前端修改

4. **miniprogram/pages/index/index.wxml**
   - 服务列表使用 `{{item.short_description}}`

5. **miniprogram/pages/order-create/order-create.wxml**
   - 订单创建页使用 `{{service.short_description}}`

6. **miniprogram/pages/order-detail/order-detail.wxml**
   - 保持使用 `{{order.service_description}}`（后端已返回短描述）

7. **miniprogram/pages/service-detail/service-detail.wxml**
   - 继续使用 `{{service.description}}`（显示长描述）

8. **miniprogram/utils/mockData.js**
   - mockServices 添加 `short_description` 和 `description` 字段
   - 所有 6 个服务都包含完整的短描述和长描述

## 数据库迁移

### 执行迁移

```bash
mysql -u root -p daoguan_db < backend/database/migration_add_short_description.sql
```

### 或手动执行

```sql
USE daoguan_db;

-- 添加字段
ALTER TABLE services
ADD COLUMN short_description VARCHAR(200) DEFAULT '' COMMENT '短描述（用于列表展示）'
AFTER name;

-- 更新现有数据（参考迁移脚本中的 UPDATE 语句）
```

## 字段规范

### short_description (短描述)
- **长度**: 最多 200 字符（约 100 个汉字）
- **内容**:
  - 一句话概括服务核心价值
  - 突出服务的主要功能/效果
  - 使用简洁明了的语言
- **示例**:
  - ✅ "为您和家人祈求平安健康，消灾解厄"
  - ✅ "祈求事业顺利，财运亨通"
  - ❌ "这是一个非常好的服务，可以帮助您解决很多问题..." (太笼统)

### description (长描述)
- **长度**: 无限制（TEXT 类型）
- **内容**:
  - 详细介绍服务内容
  - 说明服务流程
  - 列举适用场景
  - 可以包含多个段落
- **结构建议**:
  1. 服务简介（是什么）
  2. 服务内容（做什么）
  3. 适用人群/场景（适合谁）

## 前端展示效果

### 服务列表页
```
┌─────────────────────────────────┐
│ 📷 祈福法事                      │
│                                  │
│ 为您和家人祈求平安健康，消灾解厄  │ ← short_description
│ 基础价格：¥200                   │
└─────────────────────────────────┘
```

### 服务详情页
```
┌─────────────────────────────────┐
│ 服务说明                         │
│                                  │
│ 祈福法事是道教传统仪式，通过诵经、│ ← description
│ 焚香、供奉等方式，为信众祈求平安健│   (完整长文)
│ 康、消灾解厄。法事由道长主持...   │
└─────────────────────────────────┘
```

## 优势

1. **列表页加载更快**: 短描述减少数据传输量
2. **用户体验更好**: 列表快速浏览，详情深入了解
3. **内容管理更灵活**: 可以针对不同场景优化文案
4. **SEO 更友好**: 短描述可用作 meta description

## 后续建议

1. **内容优化**:
   - 定期优化短描述，提高转化率
   - 长描述可以添加更多细节，如注意事项、FAQ 等

2. **字段扩展**:
   - 可以考虑添加 `highlights` 字段（服务亮点，数组格式）
   - 可以添加 `suitable_for` 字段（适合人群）

3. **多语言支持**:
   - 如需支持多语言，可以添加 `short_description_en`、`description_en` 等字段

## 兼容性

- ✅ 向后兼容：如果前端未更新，使用 `description` 仍可正常工作
- ✅ 向前兼容：如果数据库未迁移，`short_description` 默认为空字符串
- ⚠️  建议：同时更新数据库和前端代码以获得最佳体验
