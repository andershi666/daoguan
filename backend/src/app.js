const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 静态文件服务 - 管理后台
app.use('/admin', express.static(path.join(__dirname, '../public')));

// 导入路由
const categoriesRouter = require('./routes/categories');
const servicesRouter = require('./routes/services');
const ordersRouter = require('./routes/orders');
const paymentRouter = require('./routes/payment');
const authRouter = require('./routes/auth');

// 注册路由
app.use('/api/categories', categoriesRouter);
app.use('/api/services', servicesRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/auth', authRouter);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: '道观服务API运行中' });
});

// 获取时辰列表
const { getShichenList } = require('./utils/bazi');
app.get('/api/shichen', (req, res) => {
  res.json({
    success: true,
    data: getShichenList()
  });
});

// 管理后台 - 获取所有订单
app.get('/api/admin/orders', async (req, res) => {
  try {
    const db = require('./config/database');
    const [orders] = await db.query(
      `SELECT
        o.*,
        s.name as service_name,
        s.image_url as service_image,
        (SELECT name FROM order_persons WHERE order_id = o.id ORDER BY id LIMIT 1) as contact_name,
        (SELECT address FROM order_persons WHERE order_id = o.id ORDER BY id LIMIT 1) as contact_address
       FROM orders o
       LEFT JOIN services s ON o.service_id = s.id
       ORDER BY o.created_at DESC`
    );

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('获取订单列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取订单列表失败'
    });
  }
});

// 管理后台 - 获取所有服务（包括已下架）
app.get('/api/admin/services', async (req, res) => {
  try {
    const db = require('./config/database');
    const [services] = await db.query(
      `SELECT s.*, c.name as category_name
       FROM services s
       LEFT JOIN categories c ON s.category_id = c.id
       ORDER BY s.sort_order ASC, s.created_at DESC`
    );

    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('获取服务列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取服务列表失败'
    });
  }
});

// 管理后台 - 获取所有分类（包括已禁用）
app.get('/api/admin/categories', async (req, res) => {
  try {
    const db = require('./config/database');
    const [categories] = await db.query(
      `SELECT * FROM categories ORDER BY sort_order ASC, created_at DESC`
    );

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('获取分类列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取分类列表失败'
    });
  }
});

// 管理后台 - 获取所有报名人员
app.get('/api/admin/persons', async (req, res) => {
  try {
    const db = require('./config/database');
    const [persons] = await db.query(
      `SELECT
        p.*,
        o.order_no,
        o.user_id,
        o.remark as order_remarks,
        o.created_at as order_date,
        o.status as order_status,
        o.payment_status,
        s.name as service_name
       FROM order_persons p
       LEFT JOIN orders o ON p.order_id = o.id
       LEFT JOIN services s ON o.service_id = s.id
       ORDER BY p.created_at DESC`
    );

    res.json({
      success: true,
      data: persons
    });
  } catch (error) {
    console.error('获取人员列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取人员列表失败'
    });
  }
});

// 404处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在'
  });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 服务器启动成功`);
  console.log(`📍 端口: ${PORT}`);
  console.log(`🌍 环境: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 访问: http://localhost:${PORT}`);
});

module.exports = app;