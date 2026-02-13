-- =============================================
-- 数据库迁移：将居住地址从订单表移到人员信息表
-- 执行日期：2026-02-13
-- =============================================

USE daoguan_db;

-- 1. 为 order_persons 表添加 address 字段
ALTER TABLE order_persons
ADD COLUMN address VARCHAR(500) DEFAULT '' COMMENT '居住地址'
AFTER lunar_date;

-- 2. 如果需要，可以将现有订单的地址复制到所有关联的人员记录中
-- （可选步骤，取决于业务需求）
-- UPDATE order_persons op
-- JOIN orders o ON op.order_id = o.id
-- SET op.address = o.address
-- WHERE o.address IS NOT NULL AND o.address != '';

-- 3. 注意：orders 表中的 address 字段保留用于向后兼容
-- 如果确定不再需要，可以执行以下语句删除：
-- ALTER TABLE orders DROP COLUMN address;

-- 验证修改
DESCRIBE order_persons;

-- 查看示例数据
SELECT * FROM order_persons LIMIT 1;
