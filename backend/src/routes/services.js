const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * 获取所有服务列表
 * GET /api/services
 * 可选查询参数: category_id - 按分类筛选
 */
router.get('/', async (req, res) => {
  try {
    const { category_id } = req.query;

    let query = `
      SELECT s.*, c.name as category_name
      FROM services s
      LEFT JOIN categories c ON s.category_id = c.id
      WHERE s.status = ?
    `;
    const params = ['active'];

    // 如果指定了分类ID，添加筛选条件
    if (category_id) {
      query += ' AND s.category_id = ?';
      params.push(category_id);
    }

    query += ' ORDER BY s.sort_order ASC, s.created_at DESC';

    const [rows] = await db.query(query, params);

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('获取服务列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取服务列表失败'
    });
  }
});

/**
 * 获取单个服务详情
 * GET /api/services/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      'SELECT s.*, c.name as category_name FROM services s LEFT JOIN categories c ON s.category_id = c.id WHERE s.id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '服务不存在'
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('获取服务详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取服务详情失败'
    });
  }
});

/**
 * 创建新服务 (管理员功能)
 * POST /api/services
 */
router.post('/', async (req, res) => {
  try {
    const { name, short_description, description, category_id, base_price, price_per_person, image_url, sort_order } = req.body;

    const [result] = await db.query(
      'INSERT INTO services (name, short_description, description, category_id, base_price, price_per_person, image_url, sort_order, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, short_description || '', description || '', category_id, base_price, price_per_person, image_url || '', sort_order || 0, 'active']
    );

    res.json({
      success: true,
      message: '服务创建成功',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('创建服务失败:', error);
    res.status(500).json({
      success: false,
      message: '创建服务失败'
    });
  }
});

/**
 * 更新服务信息 (管理员功能)
 * PUT /api/services/:id
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, short_description, description, category_id, base_price, price_per_person, image_url, sort_order, status } = req.body;

    const [result] = await db.query(
      'UPDATE services SET name = ?, short_description = ?, description = ?, category_id = ?, base_price = ?, price_per_person = ?, image_url = ?, sort_order = ?, status = ?, updated_at = NOW() WHERE id = ?',
      [name, short_description || '', description || '', category_id, base_price, price_per_person, image_url || '', sort_order || 0, status || 'active', id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: '服务不存在'
      });
    }

    res.json({
      success: true,
      message: '服务更新成功'
    });
  } catch (error) {
    console.error('更新服务失败:', error);
    res.status(500).json({
      success: false,
      message: '更新服务失败'
    });
  }
});

/**
 * 更新服务状态 (管理员功能)
 * PATCH /api/services/:id/status
 */
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: '无效的状态值'
      });
    }

    const [result] = await db.query(
      'UPDATE services SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: '服务不存在'
      });
    }

    res.json({
      success: true,
      message: status === 'active' ? '服务已上架' : '服务已下架'
    });
  } catch (error) {
    console.error('更新服务状态失败:', error);
    res.status(500).json({
      success: false,
      message: '更新服务状态失败'
    });
  }
});

module.exports = router;
