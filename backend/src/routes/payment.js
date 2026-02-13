const express = require('express');
const router = express.Router();
const db = require('../config/database');
const axios = require('axios');

/**
 * 创建支付订单
 * POST /api/payment/create
 */
router.post('/create', async (req, res) => {
  try {
    const { order_id, user_id } = req.body;

    if (!order_id || !user_id) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数'
      });
    }

    // 获取订单信息
    const [orders] = await db.query('SELECT * FROM orders WHERE id = ? AND user_id = ?', [order_id, user_id]);

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: '订单不存在'
      });
    }

    const order = orders[0];

    if (order.payment_status === 'paid') {
      return res.status(400).json({
        success: false,
        message: '订单已支付'
      });
    }

    // TODO: 调用微信支付统一下单API
    // 这里需要实现微信支付的具体逻辑
    // 1. 获取微信access_token
    // 2. 调用统一下单接口
    // 3. 返回支付参数给小程序

    // 模拟返回支付参数
    res.json({
      success: true,
      message: '支付订单创建成功',
      data: {
        order_id: order.id,
        order_no: order.order_no,
        total_amount: order.total_amount,
        // 以下为微信支付需要的参数，实际使用时需要调用微信API生成
        payment_params: {
          timeStamp: Date.now().toString(),
          nonceStr: 'placeholder',
          package: 'prepay_id=placeholder',
          signType: 'RSA',
          paySign: 'placeholder'
        }
      }
    });

  } catch (error) {
    console.error('创建支付订单失败:', error);
    res.status(500).json({
      success: false,
      message: '创建支付订单失败'
    });
  }
});

/**
 * 支付回调通知
 * POST /api/payment/notify
 */
router.post('/notify', async (req, res) => {
  try {
    // TODO: 验证微信支付回调签名
    // TODO: 解析回调数据
    // TODO: 更新订单状态

    const { order_no, transaction_id, total_amount } = req.body;

    // 查询订单
    const [orders] = await db.query('SELECT * FROM orders WHERE order_no = ?', [order_no]);

    if (orders.length === 0) {
      return res.status(404).send('ORDER_NOT_FOUND');
    }

    const order = orders[0];

    // 更新订单支付状态
    await db.query(
      'UPDATE orders SET payment_status = ?, status = ?, paid_at = NOW() WHERE id = ?',
      ['paid', 'paid', order.id]
    );

    // 记录支付信息
    await db.query(
      'INSERT INTO payments (order_id, transaction_id, amount, pay_time) VALUES (?, ?, ?, NOW())',
      [order.id, transaction_id, total_amount]
    );

    // 返回成功给微信
    res.send('SUCCESS');

  } catch (error) {
    console.error('处理支付回调失败:', error);
    res.status(500).send('FAIL');
  }
});

/**
 * 查询支付状态
 * GET /api/payment/status/:order_id
 */
router.get('/status/:order_id', async (req, res) => {
  try {
    const { order_id } = req.params;

    const [orders] = await db.query('SELECT id, order_no, payment_status, paid_at FROM orders WHERE id = ?', [order_id]);

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: '订单不存在'
      });
    }

    res.json({
      success: true,
      data: orders[0]
    });

  } catch (error) {
    console.error('查询支付状态失败:', error);
    res.status(500).json({
      success: false,
      message: '查询支付状态失败'
    });
  }
});

module.exports = router;
