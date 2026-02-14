// app.js
App({
  globalData: {
    userInfo: null,
    openid: 'mock_user_001', // 模拟用户ID
    baseUrl: 'http://47.121.183.169/api', // 后端API地址，实际使用时需要改为线上地址

    // 🔧 开发配置：设置为 true 使用模拟数据，false 使用真实后端接口
    useMockData: false,

    // 📞 客服配置：修改为实际的客服微信号
    customerServiceWechat: 'daoguan_service'  // 客服微信号
  },

  onLaunch() {
    console.log('🚀 小程序启动');
    console.log('📊 模拟数据模式:', this.globalData.useMockData ? '开启' : '关闭');

    if (this.globalData.useMockData) {
      // 模拟模式：直接设置模拟用户ID
      this.globalData.openid = 'mock_user_001';
      console.log('✅ 使用模拟数据，无需后端服务');
    } else {
      // 真实模式：检查登录状态
      const openid = wx.getStorageSync('openid');
      if (openid) {
        this.globalData.openid = openid;
      } else {
        this.login();
      }
    }
  },

  // 微信登录
  login() {
    console.log('🔑 开始微信登录...');

    wx.login({
      success: (res) => {
        if (res.code) {
          console.log('✅ 获取到 code:', res.code);

          // 发送code到后端
          wx.request({
            url: `${this.globalData.baseUrl}/auth/login`,
            method: 'POST',
            data: { code: res.code },
            success: (result) => {
              console.log('🔐 登录响应:', result.data);

              if (result.data.success) {
                const { openid, session_key, isNewUser, mode } = result.data.data;
                this.globalData.openid = openid;
                wx.setStorageSync('openid', openid);

                if (mode === 'mock') {
                  console.log('⚠️  使用模拟登录模式 (请配置微信小程序信息)');
                  wx.showToast({
                    title: '模拟登录成功',
                    icon: 'none',
                    duration: 2000
                  });
                } else if (isNewUser) {
                  console.log('🎉 新用户注册');
                } else {
                  console.log('👤 用户登录成功');
                }
              } else {
                console.error('❌ 登录失败:', result.data.message);
                wx.showToast({
                  title: result.data.message || '登录失败',
                  icon: 'none'
                });
              }
            },
            fail: (err) => {
              console.error('❌ 网络请求失败:', err);
              wx.showToast({
                title: '网络错误',
                icon: 'none'
              });
            }
          });
        } else {
          console.error('❌ 获取 code 失败:', res.errMsg);
          wx.showToast({
            title: '登录失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        console.error('❌ wx.login 调用失败:', err);
        wx.showToast({
          title: '登录失败',
          icon: 'none'
        });
      }
    });
  },

  // 检查登录状态
  checkLogin() {
    if (!this.globalData.openid) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success: (res) => {
          if (res.confirm) {
            this.login();
          }
        }
      });
      return false;
    }
    return true;
  }
});
