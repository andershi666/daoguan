-- =============================================
-- 道观服务预约小程序数据库设计
-- =============================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS daoguan_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE daoguan_db;

-- =============================================
-- 1. 服务分类表 (categories)
-- =============================================
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT '分类ID',
  name VARCHAR(50) NOT NULL COMMENT '分类名称',
  icon VARCHAR(10) DEFAULT '' COMMENT '分类图标（emoji）',
  sort_order INT DEFAULT 0 COMMENT '排序值，越小越靠前',
  status ENUM('active', 'inactive') DEFAULT 'active' COMMENT '状态：active-启用，inactive-停用',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_status (status),
  INDEX idx_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='服务分类表';

-- =============================================
-- 2. 服务表 (services)
-- =============================================
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT '服务ID',
  name VARCHAR(100) NOT NULL COMMENT '服务名称',
  short_description VARCHAR(200) DEFAULT '' COMMENT '短描述（用于列表展示）',
  description TEXT COMMENT '详细描述（用于详情页）',
  category_id INT NOT NULL COMMENT '分类ID',
  base_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT '基础价格',
  price_per_person DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT '每人加价',
  image_url VARCHAR(500) DEFAULT '' COMMENT '服务图片URL',
  sort_order INT DEFAULT 0 COMMENT '排序值，越小越靠前',
  status ENUM('active', 'inactive') DEFAULT 'active' COMMENT '状态：active-上架，inactive-下架',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_category_id (category_id),
  INDEX idx_status (status),
  INDEX idx_sort (sort_order),
  FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='服务表';

-- =============================================
-- 3. 订单表 (orders)
-- =============================================
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT '订单ID',
  order_no VARCHAR(50) NOT NULL UNIQUE COMMENT '订单号',
  user_id VARCHAR(100) NOT NULL COMMENT '用户ID（微信openid）',
  service_id INT NOT NULL COMMENT '服务ID',
  total_amount DECIMAL(10, 2) NOT NULL COMMENT '订单总金额',
  person_count INT NOT NULL DEFAULT 1 COMMENT '人员数量',
  address VARCHAR(500) DEFAULT '' COMMENT '居住地址',
  remark TEXT COMMENT '备注说明',
  status ENUM('pending', 'paid', 'processing', 'completed', 'cancelled') DEFAULT 'pending' COMMENT '订单状态',
  payment_status ENUM('unpaid', 'paid', 'refunded') DEFAULT 'unpaid' COMMENT '支付状态',
  paid_at TIMESTAMP NULL COMMENT '支付时间',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_order_no (order_no),
  INDEX idx_user_id (user_id),
  INDEX idx_service_id (service_id),
  INDEX idx_status (status),
  INDEX idx_payment_status (payment_status),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (service_id) REFERENCES services(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单表';

-- =============================================
-- 4. 订单人员信息表 (order_persons)
-- =============================================
CREATE TABLE IF NOT EXISTS order_persons (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT '人员ID',
  order_id INT NOT NULL COMMENT '订单ID',
  name VARCHAR(50) NOT NULL COMMENT '姓名',
  gender ENUM('male', 'female') NOT NULL COMMENT '性别：male-男，female-女',
  birth_date DATE NOT NULL COMMENT '出生日期',
  shichen_value INT NOT NULL COMMENT '时辰值（0-11）',
  shichen_name VARCHAR(30) NOT NULL COMMENT '时辰名称（子丑寅卯等）',

  -- 八字信息
  bazi_year VARCHAR(10) DEFAULT '' COMMENT '年柱',
  bazi_month VARCHAR(10) DEFAULT '' COMMENT '月柱',
  bazi_day VARCHAR(10) DEFAULT '' COMMENT '日柱',
  bazi_hour VARCHAR(10) DEFAULT '' COMMENT '时柱',
  bazi_full VARCHAR(50) DEFAULT '' COMMENT '完整八字',

  -- 五行信息
  wuxing_year VARCHAR(20) DEFAULT '' COMMENT '年柱五行',
  wuxing_month VARCHAR(20) DEFAULT '' COMMENT '月柱五行',
  wuxing_day VARCHAR(20) DEFAULT '' COMMENT '日柱五行',
  wuxing_hour VARCHAR(20) DEFAULT '' COMMENT '时柱五行',

  -- 其他信息
  shengxiao VARCHAR(10) DEFAULT '' COMMENT '生肖',
  lunar_date VARCHAR(50) DEFAULT '' COMMENT '农历日期',
  address VARCHAR(500) DEFAULT '' COMMENT '居住地址',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_order_id (order_id),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单人员信息表';

-- =============================================
-- 5. 支付记录表 (payments)
-- =============================================
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT '支付ID',
  order_id INT NOT NULL COMMENT '订单ID',
  transaction_id VARCHAR(100) DEFAULT '' COMMENT '微信交易号',
  amount DECIMAL(10, 2) NOT NULL COMMENT '支付金额',
  pay_time TIMESTAMP NULL COMMENT '支付时间',
  payment_method VARCHAR(50) DEFAULT 'wechat' COMMENT '支付方式',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX idx_order_id (order_id),
  INDEX idx_transaction_id (transaction_id),
  FOREIGN KEY (order_id) REFERENCES orders(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='支付记录表';

-- =============================================
-- 6. 用户表 (users) - 可选
-- =============================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
  openid VARCHAR(100) NOT NULL UNIQUE COMMENT '微信openid',
  nickname VARCHAR(100) DEFAULT '' COMMENT '昵称',
  avatar_url VARCHAR(500) DEFAULT '' COMMENT '头像URL',
  phone VARCHAR(20) DEFAULT '' COMMENT '手机号',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_openid (openid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- =============================================
-- 插入示例分类数据
-- =============================================
INSERT INTO categories (name, icon, sort_order, status) VALUES
('法事服务', '🙏', 1, 'active'),
('祈福服务', '✨', 2, 'active'),
('吉祥物品', '🎁', 3, 'active');

-- =============================================
-- 插入示例服务数据
-- =============================================
INSERT INTO services (name, short_description, description, category_id, base_price, price_per_person, sort_order, status) VALUES
('祈福法事', '为您和家人祈求平安健康，消灾解厄', '祈福法事是道教传统仪式，通过诵经、焚香、供奉等方式，为信众祈求平安健康、消灾解厄。法事由道长主持，依据传统科仪进行，帮助您和家人化解困厄，获得平安顺遂。适合为家人健康、事业顺利、家庭和睦等祈福。', 1, 200.00, 50.00, 1, 'active'),
('超度法事', '为逝者超度，祈求往生净土', '超度法事是为亡者举行的道教仪式，通过诵经礼忏、焚化纸钱等方式，超度亡灵，帮助逝者早日往生净土，脱离轮回之苦。法事庄严肃穆，由经验丰富的道长主持，为逝者积累功德，同时也为在世亲人祈求平安。', 1, 300.00, 80.00, 2, 'active'),
('姻缘祈福', '祈求姻缘美满，早日觅得良缘', '姻缘祈福法事专为单身人士或情侣设立，通过向月老、和合二仙祈福，帮助善信早日觅得良缘，或使现有感情更加和谐美满。法事中将为您点燃姻缘灯，祈求美好姻缘早日到来，或现有感情能够长长久久。', 2, 180.00, 40.00, 3, 'active'),
('事业祈福', '祈求事业顺利，财运亨通', '事业祈福法事为事业发展、财运提升而设。通过向财神、文昌帝君等神祇祈福，帮助信众事业顺遂、财源广进。适合创业者、职场人士、生意人等，祈求工作顺利、升职加薪、生意兴隆、贵人相助。', 2, 180.00, 40.00, 4, 'active'),
('平安符', '请平安符，保佑平安顺遂', '平安符是经过道长开光加持的护身符，随身佩戴可保平安顺遂、驱邪避凶。符纸由道观法师亲自书写，经过开光仪式加持，具有强大的护佑之力。适合日常佩戴或赠送亲友，为自己和家人祈求一份平安保障。', 3, 100.00, 30.00, 5, 'active'),
('健康祈福', '祈求身体健康，疾病消除', '健康祈福法事专为身体欠佳或希望保持健康的信众设立。通过向药王菩萨、保生大帝等医药之神祈福，祈求身体健康、疾病早日康复、免受病痛之苦。法事中将为您点燃健康灯，祈愿身体安康、精神饱满。', 2, 150.00, 40.00, 6, 'active');

-- =============================================
-- 查询语句示例
-- =============================================

-- 查看所有表
-- SHOW TABLES;

-- 查看服务列表
-- SELECT * FROM services WHERE status = 'active' ORDER BY sort_order;

-- 查看订单详情（包含服务信息和人员信息）
-- SELECT
--   o.*,
--   s.name as service_name,
--   GROUP_CONCAT(CONCAT(p.name, '(', p.bazi_full, ')') SEPARATOR ', ') as persons_info
-- FROM orders o
-- LEFT JOIN services s ON o.service_id = s.id
-- LEFT JOIN order_persons p ON o.id = p.order_id
-- WHERE o.id = 1
-- GROUP BY o.id;
