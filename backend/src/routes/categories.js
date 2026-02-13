const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * 获取所有分类列表
 * GET /api/categories
 */
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM categories WHERE status = ? ORDER BY sort_order ASC, created_at DESC',
      ['active']
    );

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('获取分类列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取分类列表失败'
    });
  }
});

/**
 * 获取单个分类详情
 * GET /api/categories/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '分类不存在'
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('获取分类详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取分类详情失败'
    });
  }
});

/**
 * 创建新分类 (管理员功能)
 * POST /api/categories
 */
router.post('/', async (req, res) => {
  try {
    const { name, icon, sort_order } = req.body;

    const [result] = await db.query(
      'INSERT INTO categories (name, icon, sort_order, status) VALUES (?, ?, ?, ?)',
      [name, icon || '', sort_order || 0, 'active']
    );

    res.json({
      success: true,
      message: '分类创建成功',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('创建分类失败:', error);
    res.status(500).json({
      success: false,
      message: '创建分类失败'
    });
  }
});

/**
 * 更新分类信息 (管理员功能)
 * PUT /api/categories/:id
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon, sort_order, status } = req.body;

    const [result] = await db.query(
      'UPDATE categories SET name = ?, icon = ?, sort_order = ?, status = ?, updated_at = NOW() WHERE id = ?',
      [name, icon || '', sort_order || 0, status || 'active', id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: '分类不存在'
      });
    }

    res.json({
      success: true,
      message: '分类更新成功'
    });
  } catch (error) {
    console.error('更新分类失败:', error);
    res.status(500).json({
      success: false,
      message: '更新分类失败'
    });
  }
});

module.exports = router;
