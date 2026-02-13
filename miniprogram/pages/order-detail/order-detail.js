// pages/order-detail/order-detail.js
const app = getApp();
const { mockOrderDetail } = require('../../utils/mockData');
const { formatDateTime, formatDate } = require('../../utils/dateFormat');

Page({
  data: {
    orderId: null,
    order: null,
    loading: true,
    statusMap: {
      'pending': '待支付',
      'paid': '已支付',
      'processing': '处理中',
      'completed': '已完成',
      'cancelled': '已取消'
    }
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ orderId: options.id });
      this.loadOrderDetail();
    }
  },

  // 返回上一页
  navigateBack() {
    wx.navigateBack({
      delta: 1
    });
  },

  loadOrderDetail() {
    // 🔧 模拟数据模式
    if (app.globalData.useMockData) {
      setTimeout(() => {
        const order = JSON.parse(JSON.stringify(mockOrderDetail));
        // 格式化时间
        order.created_at = formatDateTime(order.created_at);
        // 格式化人员出生日期
        if (order.persons && order.persons.length > 0) {
          order.persons = order.persons.map(person => ({
            ...person,
            birth_date: formatDate(person.birth_date)
          }));
        }
        this.setData({
          order: order,
          loading: false
        });
      }, 300);
      return;
    }

    // 真实接口模式
    wx.request({
      url: `${app.globalData.baseUrl}/orders/${this.data.orderId}`,
      method: 'GET',
      success: (res) => {
        if (res.data.success) {
          const order = res.data.data;
          // 格式化时间
          order.created_at = formatDateTime(order.created_at);
          // 格式化人员出生日期
          if (order.persons && order.persons.length > 0) {
            order.persons = order.persons.map(person => ({
              ...person,
              birth_date: formatDate(person.birth_date)
            }));
          }
          this.setData({
            order: order,
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

  // 支付订单
  payOrder() {
    wx.showLoading({ title: '准备支付...' });

    wx.request({
      url: `${app.globalData.baseUrl}/payment/create`,
      method: 'POST',
      data: {
        order_id: this.data.orderId,
        user_id: app.globalData.openid
      },
      success: (res) => {
        wx.hideLoading();

        if (res.data.success) {
          const paymentParams = res.data.data.payment_params;

          wx.requestPayment({
            ...paymentParams,
            success: () => {
              wx.showToast({
                title: '支付成功',
                icon: 'success'
              });
              setTimeout(() => {
                this.loadOrderDetail();
              }, 1500);
            },
            fail: () => {
              wx.showToast({
                title: '支付已取消',
                icon: 'none'
              });
            }
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

  // 联系客服
  contactService() {
    console.log('点击了联系客服按钮');

    const wechatId = app.globalData.customerServiceWechat;
    console.log('客服微信号:', wechatId);

    wx.showModal({
      title: '联系客服',
      content: `客服微信号：${wechatId}\n\n点击"复制"可将微信号复制到剪贴板，然后到微信中添加好友`,
      confirmText: '复制',
      cancelText: '取消',
      success: (res) => {
        console.log('弹窗结果:', res);
        if (res.confirm) {
          // 复制微信号到剪贴板
          wx.setClipboardData({
            data: wechatId,
            success: () => {
              console.log('微信号已复制:', wechatId);
              wx.showToast({
                title: '微信号已复制',
                icon: 'success',
                duration: 2000
              });
            },
            fail: (err) => {
              console.error('复制失败:', err);
              wx.showToast({
                title: '复制失败',
                icon: 'none'
              });
            }
          });
        }
      },
      fail: (err) => {
        console.error('弹窗失败:', err);
      }
    });
  },

  // 取消订单
  cancelOrder() {
    wx.showModal({
      title: '确认取消',
      content: '确定要取消这个订单吗？',
      confirmText: '确认取消',
      cancelText: '再想想',
      confirmColor: '#D2691E',
      success: (res) => {
        if (res.confirm) {
          this.performCancelOrder();
        }
      }
    });
  },

  performCancelOrder() {
    // 🔧 模拟数据模式
    if (app.globalData.useMockData) {
      wx.showLoading({ title: '取消中...' });
      setTimeout(() => {
        wx.hideLoading();
        wx.showToast({
          title: '订单已取消',
          icon: 'success'
        });
        // 更新订单状态
        const order = this.data.order;
        order.status = 'cancelled';
        this.setData({ order });
      }, 500);
      return;
    }

    // 真实接口模式
    wx.showLoading({ title: '取消中...' });

    wx.request({
      url: `${app.globalData.baseUrl}/orders/${this.data.orderId}/cancel`,
      method: 'PATCH',
      data: {
        user_id: app.globalData.openid
      },
      success: (res) => {
        wx.hideLoading();
        if (res.data.success) {
          wx.showToast({
            title: '订单已取消',
            icon: 'success'
          });
          // 刷新订单详情
          setTimeout(() => {
            this.loadOrderDetail();
          }, 1500);
        } else {
          wx.showToast({
            title: res.data.message || '取消失败',
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
  }
});
