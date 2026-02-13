// pages/contact/contact.js
const app = getApp();

Page({
  data: {
    wechatId: '',
    faqList: [
      {
        id: 1,
        question: '如何预约道观服务？',
        answer: '您可以在"服务"页面选择需要的服务，填写相关信息后提交订单即可完成预约。',
        expanded: false
      },
      {
        id: 2,
        question: '订单支付后多久可以开始服务？',
        answer: '支付成功后，我们会在24小时内与您确认服务时间和具体安排。',
        expanded: false
      },
      {
        id: 3,
        question: '可以取消或修改订单吗？',
        answer: '未支付的订单可以直接取消。已支付的订单如需修改或取消，请联系客服处理。',
        expanded: false
      },
      {
        id: 4,
        question: '服务费用包含哪些内容？',
        answer: '服务费用包含法事材料费、法师费用等。具体内容会在服务详情中说明。',
        expanded: false
      },
      {
        id: 5,
        question: '如何查看我的订单？',
        answer: '点击底部导航栏的"订单"即可查看您的所有订单记录。',
        expanded: false
      }
    ]
  },

  onLoad() {
    this.setData({
      wechatId: app.globalData.customerServiceWechat
    });
  },

  // 复制微信号
  copyWechat() {
    const wechatId = this.data.wechatId;
    wx.setClipboardData({
      data: wechatId,
      success: () => {
        wx.showToast({
          title: '微信号已复制',
          icon: 'success',
          duration: 2000
        });
      },
      fail: () => {
        wx.showToast({
          title: '复制失败',
          icon: 'none'
        });
      }
    });
  },

  // 展开/收起常见问题
  toggleFaq(e) {
    const id = e.currentTarget.dataset.id;
    const faqList = this.data.faqList.map(item => {
      if (item.id === id) {
        item.expanded = !item.expanded;
      }
      return item;
    });
    this.setData({ faqList });
  }
});
