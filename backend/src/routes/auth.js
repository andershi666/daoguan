const express = require('express');
const router = express.Router();
const axios = require('axios');

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

    // 调用微信接口获取openid和session_key
    const response = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
      params: {
        appid: process.env.WECHAT_APPID,
        secret: process.env.WECHAT_SECRET,
        js_code: code,
        grant_type: 'authorization_code'
      }
    });

    const { openid, session_key, errcode, errmsg } = response.data;

    if (errcode) {
      return res.status(400).json({
        success: false,
        message: errmsg || '登录失败'
      });
    }

    // TODO: 这里可以生成自定义token
    // TODO: 可以将用户信息存入数据库

    res.json({
      success: true,
      data: {
        openid,
        session_key
      }
    });

  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({
      success: false,
      message: '登录失败'
    });
  }
});

module.exports = router;
