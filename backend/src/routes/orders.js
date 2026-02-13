const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { calculateBazi } = require('../utils/bazi');
const { formatOrderDates, formatPersonDates } = require('../utils/dateFormat');
const { v4: uuidv4 } = require('uuid');

/**
 * 创建订单
 * POST /api/orders
 */
router.post('/', async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const {
      user_id,
      service_id,
      persons,
      remark
    } = req.body;

    // 验证必要参数
    if (!user_id || !service_id || !persons || persons.length === 0) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数'
      });
    }

    // 获取服务信息
    const [services] = await connection.query('SELECT * FROM services WHERE id = ?', [service_id]);
    if (services.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: '服务不存在'
      });
    }

    const service = services[0];

    // 计算总金额
    const personCount = persons.length;
    const totalAmount = parseFloat(service.base_price) + (personCount * parseFloat(service.price_per_person));

    // 生成订单号
    const orderNo = 'DD' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();

    // 插入订单
    const [orderResult] = await connection.query(
      `INSERT INTO orders (order_no, user_id, service_id, total_amount, person_count, remark, status, payment_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [orderNo, user_id, service_id, totalAmount, personCount, remark || '', 'pending', 'unpaid']
    );

    const orderId = orderResult.insertId;

    // 插入人员信息并计算八字
    for (const person of persons) {
      const { name, gender, birth_date, shichen_value, address } = person;

      // 计算八字
      const baziResult = calculateBazi(birth_date, shichen_value, gender);

      if (!baziResult.success) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: `计算${name}的八字失败: ${baziResult.error}`
        });
      }

      // 插入人员信息
      await connection.query(
        `INSERT INTO order_persons
         (order_id, name, gender, birth_date, shichen_value, shichen_name,
          bazi_year, bazi_month, bazi_day, bazi_hour, bazi_full,
          wuxing_year, wuxing_month, wuxing_day, wuxing_hour,
          shengxiao, lunar_date, address)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId, name, gender, birth_date, shichen_value, baziResult.shichen,
          baziResult.bazi.year, baziResult.bazi.month, baziResult.bazi.day, baziResult.bazi.hour, baziResult.bazi.full,
          baziResult.wuxing.year, baziResult.wuxing.month, baziResult.wuxing.day, baziResult.wuxing.hour,
          baziResult.shengxiao, baziResult.lunar.date, address || ''
        ]
      );
    }

    await connection.commit();

    res.json({
      success: true,
      message: '订单创建成功',
      data: {
        order_id: orderId,
        order_no: orderNo,
        total_amount: totalAmount,
        person_count: personCount
      }
    });

  } catch (error) {
    await connection.rollback();
    console.error('创建订单失败:', error);
    res.status(500).json({
      success: false,
      message: '创建订单失败'
    });
  } finally {
    connection.release();
  }
});

/**
 * 获取订单列表
 * GET /api/orders?user_id=xxx
 */
router.get('/', async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: '缺少user_id参数'
      });
    }

    const [orders] = await db.query(
      `SELECT o.*, s.name as service_name, s.image_url as service_image
       FROM orders o
       LEFT JOIN services s ON o.service_id = s.id
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      [user_id]
    );

    // 格式化所有订单的日期字段
    const formattedOrders = orders.map(order => formatOrderDates(order));

    res.json({
      success: true,
      data: formattedOrders
    });
  } catch (error) {
    console.error('获取订单列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取订单列表失败'
    });
  }
});

/**
 * 获取订单详情
 * GET /api/orders/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // 获取订单基本信息
    const [orders] = await db.query(
      `SELECT o.*, s.name as service_name, s.short_description as service_description, s.image_url as service_image
       FROM orders o
       LEFT JOIN services s ON o.service_id = s.id
       WHERE o.id = ?`,
      [id]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: '订单不存在'
      });
    }

    const order = orders[0];

    // 获取人员信息
    const [persons] = await db.query(
      'SELECT * FROM order_persons WHERE order_id = ? ORDER BY created_at ASC',
      [id]
    );

    // 格式化订单日期
    const formattedOrder = formatOrderDates(order);

    // 格式化人员日期
    formattedOrder.persons = persons.map(person => formatPersonDates(person));

    res.json({
      success: true,
      data: formattedOrder
    });
  } catch (error) {
    console.error('获取订单详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取订单详情失败'
    });
  }
});

/**
 * 取消订单
 * PATCH /api/orders/:id/cancel
 */
router.patch('/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: '缺少user_id参数'
      });
    }

    // 获取订单信息
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [id, user_id]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: '订单不存在或无权限操作'
      });
    }

    const order = orders[0];

    // 只有待支付状态的订单可以取消
    if (order.status !== 'pending' || order.payment_status !== 'unpaid') {
      return res.status(400).json({
        success: false,
        message: '只有待支付的订单可以取消'
      });
    }

    // 更新订单状态为已取消
    await db.query(
      'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?',
      ['cancelled', id]
    );

    res.json({
      success: true,
      message: '订单已取消'
    });

  } catch (error) {
    console.error('取消订单失败:', error);
    res.status(500).json({
      success: false,
      message: '取消订单失败'
    });
  }
});

module.exports = router;
