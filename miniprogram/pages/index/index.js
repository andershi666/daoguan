// pages/index/index.js
const app = getApp();
const { mockServices, mockCategories } = require('../../utils/mockData');

Page({
  data: {
    categories: [],
    currentCategory: 0, // 0表示全部
    services: [],
    allServices: [], // 存储所有服务
    loading: true
  },

  onLoad() {
    this.loadCategories();
    this.loadServices();
  },

  onShow() {
    // 每次显示页面时刷新数据
    this.loadServices();
  },

  // 加载分类列表
  loadCategories() {
    // 🔧 模拟数据模式
    if (app.globalData.useMockData) {
      this.setData({
        categories: [{ id: 0, name: '全部', icon: '📋' }, ...mockCategories]
      });
      return;
    }

    // 真实接口模式 - 从后端获取分类
    wx.request({
      url: `${app.globalData.baseUrl}/categories`,
      method: 'GET',
      success: (res) => {
        if (res.data.success) {
          this.setData({
            categories: [{ id: 0, name: '全部', icon: '📋' }, ...res.data.data]
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '加载分类失败',
          icon: 'none'
        });
      }
    });
  },

  // 加载服务列表
  loadServices() {
    this.setData({ loading: true });

    // 🔧 模拟数据模式
    if (app.globalData.useMockData) {
      console.log('📊 使用模拟服务数据');
      setTimeout(() => {
        this.setData({
          allServices: mockServices,
          services: mockServices,
          loading: false
        });
      }, 300); // 模拟网络延迟
      return;
    }

    // 真实接口模式
    wx.request({
      url: `${app.globalData.baseUrl}/services`,
      method: 'GET',
      success: (res) => {
        if (res.data.success) {
          this.setData({
            allServices: res.data.data,
            services: res.data.data,
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

  // 切换分类
  switchCategory(e) {
    const categoryId = e.currentTarget.dataset.id;
    this.setData({ currentCategory: categoryId });

    // 筛选服务
    if (categoryId === 0) {
      // 显示全部
      this.setData({ services: this.data.allServices });
    } else {
      // 按分类筛选
      const filtered = this.data.allServices.filter(s => s.category_id === categoryId);
      this.setData({ services: filtered });
    }
  },

  // 跳转到服务详情
  goToDetail(e) {
    const serviceId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/service-detail/service-detail?id=${serviceId}`
    });
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadServices();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  }
});
