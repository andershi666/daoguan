const express = require('express');
const router = express.Router();
const axios = require('axios');

// 导入数据库模块
const db = require('../config/database');

/**
 * 微信小程序登录
 * POST /api/auth/login
 */
router.post('/login', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: '缺少code参数'
      });
    }

    // 检查是否配置了微信小程序信息
    if (!process.env.WECHAT_APP_ID || !process.env.WECHAT_APP_SECRET ||
        process.env.WECHAT_APP_ID === 'your_app_id' ||
        process.env.WECHAT_APP_SECRET === 'your_app_secret') {
      console.log('⚠️  微信小程序配置未完成,使用模拟登录模式');
      // 模拟登录模式 - 开发测试使用
      const mockOpenid = 'mock_user_' + Date.now();
      return res.json({
        success: true,
        data: {
          openid: mockOpenid,
          session_key: 'mock_session_key',
          isNewUser: true,
          mode: 'mock'
        }
      });
    }

    // 调用微信接口获取openid和session_key
    console.log('🔑 调用微信登录接口...');
    const response = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
      params: {
        appid: process.env.WECHAT_APP_ID,
        secret: process.env.WECHAT_APP_SECRET,
        js_code: code,
        grant_type: 'authorization_code'
      }
    });

    const { openid, session_key, errcode, errmsg } = response.data;

    if (errcode) {
      console.error('微信登录失败:', errcode, errmsg);
      return res.status(400).json({
        success: false,
        message: errmsg || '微信登录失败',
        errcode
      });
    }

    // 检查用户是否已存在
    const [existingUsers] = await db.execute(
      'SELECT id, openid, nickname, avatar_url FROM users WHERE openid = ?',
      [openid]
    );

    let isNewUser = false;

    if (existingUsers.length === 0) {
      // 新用户,插入数据库
      isNewUser = true;
      await db.execute(
        'INSERT INTO users (openid, session_key) VALUES (?, ?)',
        [openid, session_key]
      );
      console.log('✅ 新用户注册:', openid);
    } else {
      // 老用户,更新session_key
      await db.execute(
        'UPDATE users SET session_key = ? WHERE openid = ?',
        [session_key, openid]
      );
      console.log('✅ 用户登录:', openid);
    }

    // 生成JWT token (可选,这里简单返回openid)
    res.json({
      success: true,
      data: {
        openid,
        session_key,
        isNewUser,
        mode: 'wechat'
      }
    });

  } catch (error) {
    console.error('登录失败:', error.message);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * 更新用户信息
 * POST /api/auth/update-profile
 */
router.post('/update-profile', async (req, res) => {
  try {
    const { openid, nickname, avatar_url, phone } = req.body;

    if (!openid) {
      return res.status(400).json({
        success: false,
        message: '缺少openid参数'
      });
    }

    // 更新用户信息
    await db.execute(
      'UPDATE users SET nickname = ?, avatar_url = ?, phone = ? WHERE openid = ?',
      [nickname || null, avatar_url || null, phone || null, openid]
    );

    res.json({
      success: true,
      message: '用户信息更新成功'
    });

  } catch (error) {
    console.error('更新用户信息失败:', error);
    res.status(500).json({
      success: false,
      message: '更新失败'
    });
  }
});

/**
 * 获取用户信息
 * GET /api/auth/profile
 */
router.get('/profile', async (req, res) => {
  try {
    const { openid } = req.query;

    if (!openid) {
      return res.status(400).json({
        success: false,
        message: '缺少openid参数'
      });
    }

    const [users] = await db.execute(
      'SELECT id, openid, nickname, avatar_url, phone, created_at FROM users WHERE openid = ?',
      [openid]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    res.json({
      success: true,
      data: users[0]
    });

  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({
      success: false,
      message: '获取失败'
    });
  }
});

module.exports = router;
