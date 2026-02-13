// pages/order-list/order-list.js
const app = getApp();
const { mockOrders } = require('../../utils/mockData');
const { formatDateTime } = require('../../utils/dateFormat');

Page({
  data: {
    orders: [],
    loading: true,
    statusMap: {
      'pending': '待支付',
      'paid': '已支付',
      'processing': '处理中',
      'completed': '已完成',
      'cancelled': '已取消'
    }
  },

  onLoad() {
    this.loadOrders();
  },

  onShow() {
    this.loadOrders();
  },

  loadOrders() {
    if (!app.checkLogin()) {
      this.setData({ loading: false });
      return;
    }

    this.setData({ loading: true });

    // 🔧 模拟数据模式
    if (app.globalData.useMockData) {
      setTimeout(() => {
        const orders = mockOrders.map(order => ({
          ...order,
          created_at: formatDateTime(order.created_at)
        }));
        this.setData({
          orders: orders,
          loading: false
        });
      }, 300);
      return;
    }

    // 真实接口模式
    wx.request({
      url: `${app.globalData.baseUrl}/orders`,
      method: 'GET',
      data: {
        user_id: app.globalData.openid
      },
      success: (res) => {
        if (res.data.success) {
          const orders = res.data.data.map(order => ({
            ...order,
            created_at: formatDateTime(order.created_at)
          }));
          this.setData({
            orders: orders,
            loading: false
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        });
        this.setData({ loading: false });
      }
    });
  },

  // 跳转到订单详情
  goToDetail(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/order-detail/order-detail?id=${orderId}`
    });
  },

  // 支付订单
  payOrder(e) {
    const orderId = e.currentTarget.dataset.id;

    wx.showLoading({ title: '准备支付...' });

    // 创建支付订单
    wx.request({
      url: `${app.globalData.baseUrl}/payment/create`,
      method: 'POST',
      data: {
        order_id: orderId,
        user_id: app.globalData.openid
      },
      success: (res) => {
        wx.hideLoading();

        if (res.data.success) {
          const paymentParams = res.data.data.payment_params;

          // 调起微信支付
          wx.requestPayment({
            ...paymentParams,
            success: () => {
              wx.showToast({
                title: '支付成功',
                icon: 'success'
              });
              this.loadOrders();
            },
            fail: () => {
              wx.showToast({
                title: '支付已取消',
                icon: 'none'
              });
            }
          });
        } else {
          wx.showToast({
            title: res.data.message || '支付失败',
            icon: 'none'
          });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
      }
    });
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadOrders();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  }
});
