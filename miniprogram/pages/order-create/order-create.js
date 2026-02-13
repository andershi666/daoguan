// pages/order-create/order-create.js
const app = getApp();
const { mockServices, mockShichen, mockCreateOrder } = require('../../utils/mockData');

Page({
  data: {
    serviceId: null,
    service: null,
    persons: [{
      id: Date.now(),
      name: '',
      gender: 'male',
      birth_date: '',
      shichen_value: 99,
      shichen_name: '吉时（时辰未知）',
      address: ''
    }],
    shichenList: [],
    remark: '',
    totalAmount: 0,
    currentEditPersonIndex: null,
    showShichenPicker: false
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ serviceId: options.id });
      this.loadService();
      this.loadShichenList();
    }
  },

  // 加载服务信息
  loadService() {
    // 🔧 模拟数据模式
    if (app.globalData.useMockData) {
      const service = mockServices.find(s => s.id == this.data.serviceId);
      setTimeout(() => {
        this.setData({ service: service || mockServices[0] });
        this.calculateTotal();
      }, 200);
      return;
    }

    // 真实接口模式
    wx.request({
      url: `${app.globalData.baseUrl}/services/${this.data.serviceId}`,
      method: 'GET',
      success: (res) => {
        if (res.data.success) {
          this.setData({ service: res.data.data });
          this.calculateTotal();
        }
      }
    });
  },

  // 加载时辰列表
  loadShichenList() {
    // 🔧 模拟数据模式
    if (app.globalData.useMockData) {
      setTimeout(() => {
        this.setData({ shichenList: mockShichen });
      }, 100);
      return;
    }

    // 真实接口模式
    wx.request({
      url: `${app.globalData.baseUrl}/shichen`,
      method: 'GET',
      success: (res) => {
        if (res.data.success) {
          this.setData({ shichenList: res.data.data });
        }
      }
    });
  },

  // 计算总金额
  calculateTotal() {
    if (!this.data.service) return;

    const basePrice = parseFloat(this.data.service.base_price);
    const pricePerPerson = parseFloat(this.data.service.price_per_person);
    const personCount = this.data.persons.length;

    const total = basePrice + (personCount * pricePerPerson);
    this.setData({ totalAmount: total.toFixed(2) });
  },

  // 添加人员
  addPerson() {
    const newPerson = {
      id: Date.now(),
      name: '',
      gender: 'male',
      birth_date: '',
      shichen_value: 99,
      shichen_name: '吉时（时辰未知）',
      address: ''
    };

    this.setData({
      persons: [...this.data.persons, newPerson]
    });
    this.calculateTotal();
  },

  // 删除人员
  deletePerson(e) {
    const index = e.currentTarget.dataset.index;

    if (this.data.persons.length === 1) {
      wx.showToast({
        title: '至少保留一位人员',
        icon: 'none'
      });
      return;
    }

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这位人员吗？',
      success: (res) => {
        if (res.confirm) {
          const persons = this.data.persons.filter((_, i) => i !== index);
          this.setData({ persons });
          this.calculateTotal();
        }
      }
    });
  },

  // 输入姓名
  onNameInput(e) {
    const index = e.currentTarget.dataset.index;
    const persons = this.data.persons;
    persons[index].name = e.detail.value;
    this.setData({ persons });
  },

  // 选择性别
  onGenderChange(e) {
    const index = e.currentTarget.dataset.index;
    const persons = this.data.persons;
    persons[index].gender = e.detail.value;
    this.setData({ persons });
  },

  // 选择出生日期
  onBirthDateChange(e) {
    const index = e.currentTarget.dataset.index;
    const persons = this.data.persons;
    persons[index].birth_date = e.detail.value;
    this.setData({ persons });
  },

  // 显示时辰选择器
  showShichenPickerHandler(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentEditPersonIndex: index,
      showShichenPicker: true
    });
  },

  // 选择时辰
  onShichenChange(e) {
    const shichenIndex = e.detail.value;
    const selectedShichen = this.data.shichenList[shichenIndex];
    const persons = this.data.persons;
    const index = this.data.currentEditPersonIndex;

    persons[index].shichen_value = selectedShichen.value;
    persons[index].shichen_name = selectedShichen.name;

    this.setData({
      persons,
      showShichenPicker: false
    });
  },

  // 输入地址
  onAddressInput(e) {
    const index = e.currentTarget.dataset.index;
    const persons = this.data.persons;
    persons[index].address = e.detail.value;
    this.setData({ persons });
  },

  // 输入备注
  onRemarkInput(e) {
    this.setData({ remark: e.detail.value });
  },

  // 提交订单
  submitOrder() {
    if (!app.checkLogin()) return;

    // 验证必填项
    for (let i = 0; i < this.data.persons.length; i++) {
      const person = this.data.persons[i];
      if (!person.name) {
        wx.showToast({
          title: `请填写第${i + 1}位人员的姓名`,
          icon: 'none'
        });
        return;
      }
      if (!person.birth_date) {
        wx.showToast({
          title: `请选择第${i + 1}位人员的出生日期`,
          icon: 'none'
        });
        return;
      }
    }

    wx.showLoading({ title: '提交中...' });

    // 🔧 模拟数据模式
    if (app.globalData.useMockData) {
      const orderData = {
        user_id: app.globalData.openid,
        service_id: this.data.serviceId,
        persons: this.data.persons,
        remark: this.data.remark,
        total_amount: this.data.totalAmount
      };

      setTimeout(() => {
        const result = mockCreateOrder(orderData);
        wx.hideLoading();

        if (result.success) {
          wx.showToast({
            title: '订单创建成功',
            icon: 'success'
          });

          console.log('✅ 模拟订单创建成功:', result.data);

          // 跳转到订单详情页
          setTimeout(() => {
            wx.redirectTo({
              url: `/pages/order-detail/order-detail?id=${result.data.order_id}`
            });
          }, 1500);
        }
      }, 800);
      return;
    }

    // 真实接口模式
    wx.request({
      url: `${app.globalData.baseUrl}/orders`,
      method: 'POST',
      data: {
        user_id: app.globalData.openid,
        service_id: this.data.serviceId,
        persons: this.data.persons,
        remark: this.data.remark
      },
      success: (res) => {
        wx.hideLoading();
        if (res.data.success) {
          wx.showToast({
            title: '订单创建成功',
            icon: 'success'
          });

          // 跳转到订单详情页
          setTimeout(() => {
            wx.redirectTo({
              url: `/pages/order-detail/order-detail?id=${res.data.data.order_id}`
            });
          }, 1500);
        } else {
          wx.showToast({
            title: res.data.message || '提交失败',
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
