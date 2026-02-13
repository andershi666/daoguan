// pages/service-detail/service-detail.js
const app = getApp();
const { mockServices } = require('../../utils/mockData');

Page({
  data: {
    serviceId: null,
    service: null,
    loading: true
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ serviceId: options.id });
      this.loadService();
    }
  },

  loadService() {
    // 🔧 模拟数据模式
    if (app.globalData.useMockData) {
      const service = mockServices.find(s => s.id == this.data.serviceId);
      setTimeout(() => {
        this.setData({
          service: service || mockServices[0],
          loading: false
        });
      }, 300);
      return;
    }

    // 真实接口模式
    wx.request({
      url: `${app.globalData.baseUrl}/services/${this.data.serviceId}`,
      method: 'GET',
      success: (res) => {
        if (res.data.success) {
          this.setData({
            service: res.data.data,
            loading: false
          });
        }
      },
      fail: () => {
        this.setData({ loading: false });
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        });
      }
    });
  },

  // 立即预约
  goToOrderCreate() {
    wx.navigateTo({
      url: `/pages/order-create/order-create?id=${this.data.serviceId}`
    });
  }
});
