// utils/mockData.js - 模拟数据
// 用于前端开发测试，无需启动后端服务

/**
 * 服务分类列表
 */
const mockCategories = [
  { id: 1, name: '法事服务', icon: '🙏' },
  { id: 2, name: '祈福服务', icon: '✨' },
  { id: 3, name: '吉祥物品', icon: '🎁' }
];

/**
 * 模拟服务列表数据
 */
const mockServices = [
  {
    id: 1,
    name: '祈福法事',
    short_description: '为您和家人祈求平安健康，消灾解厄',
    description: '祈福法事是道教传统仪式，通过诵经、焚香、供奉等方式，为信众祈求平安健康、消灾解厄。法事由道长主持，依据传统科仪进行，帮助您和家人化解困厄，获得平安顺遂。适合为家人健康、事业顺利、家庭和睦等祈福。',
    base_price: '200.00',
    price_per_person: '50.00',
    image_url: '',
    category_id: 1,
    category_name: '法事服务',
    sort_order: 1,
    status: 'active'
  },
  {
    id: 2,
    name: '超度法事',
    short_description: '为逝者超度，祈求往生净土',
    description: '超度法事是为亡者举行的道教仪式，通过诵经礼忏、焚化纸钱等方式，超度亡灵，帮助逝者早日往生净土，脱离轮回之苦。法事庄严肃穆，由经验丰富的道长主持，为逝者积累功德，同时也为在世亲人祈求平安。',
    base_price: '300.00',
    price_per_person: '80.00',
    image_url: '',
    category_id: 1,
    category_name: '法事服务',
    sort_order: 2,
    status: 'active'
  },
  {
    id: 3,
    name: '姻缘祈福',
    short_description: '祈求姻缘美满，早日觅得良缘',
    description: '姻缘祈福法事专为单身人士或情侣设立，通过向月老、和合二仙祈福，帮助善信早日觅得良缘，或使现有感情更加和谐美满。法事中将为您点燃姻缘灯，祈求美好姻缘早日到来，或现有感情能够长长久久。',
    base_price: '180.00',
    price_per_person: '40.00',
    image_url: '',
    category_id: 2,
    category_name: '祈福服务',
    sort_order: 3,
    status: 'active'
  },
  {
    id: 4,
    name: '事业祈福',
    short_description: '祈求事业顺利，财运亨通',
    description: '事业祈福法事为事业发展、财运提升而设。通过向财神、文昌帝君等神祇祈福，帮助信众事业顺遂、财源广进。适合创业者、职场人士、生意人等，祈求工作顺利、升职加薪、生意兴隆、贵人相助。',
    base_price: '180.00',
    price_per_person: '40.00',
    image_url: '',
    category_id: 2,
    category_name: '祈福服务',
    sort_order: 4,
    status: 'active'
  },
  {
    id: 5,
    name: '平安符',
    short_description: '请平安符，保佑平安顺遂',
    description: '平安符是经过道长开光加持的护身符，随身佩戴可保平安顺遂、驱邪避凶。符纸由道观法师亲自书写，经过开光仪式加持，具有强大的护佑之力。适合日常佩戴或赠送亲友，为自己和家人祈求一份平安保障。',
    base_price: '100.00',
    price_per_person: '30.00',
    image_url: '',
    category_id: 3,
    category_name: '吉祥物品',
    sort_order: 5,
    status: 'active'
  },
  {
    id: 6,
    name: '健康祈福',
    short_description: '祈求身体健康，疾病消除',
    description: '健康祈福法事专为身体欠佳或希望保持健康的信众设立。通过向药王菩萨、保生大帝等医药之神祈福，祈求身体健康、疾病早日康复、免受病痛之苦。法事中将为您点燃健康灯，祈愿身体安康、精神饱满。',
    base_price: '150.00',
    price_per_person: '40.00',
    image_url: '',
    category_id: 2,
    category_name: '祈福服务',
    sort_order: 6,
    status: 'active'
  }
];

/**
 * 模拟时辰列表
 */
const mockShichen = [
  { name: '子时（23:00-01:00）', value: 0, earthlyBranch: '子', displayName: '子时' },
  { name: '丑时（01:00-03:00）', value: 1, earthlyBranch: '丑', displayName: '丑时' },
  { name: '寅时（03:00-05:00）', value: 2, earthlyBranch: '寅', displayName: '寅时' },
  { name: '卯时（05:00-07:00）', value: 3, earthlyBranch: '卯', displayName: '卯时' },
  { name: '辰时（07:00-09:00）', value: 4, earthlyBranch: '辰', displayName: '辰时' },
  { name: '巳时（09:00-11:00）', value: 5, earthlyBranch: '巳', displayName: '巳时' },
  { name: '午时（11:00-13:00）', value: 6, earthlyBranch: '午', displayName: '午时' },
  { name: '未时（13:00-15:00）', value: 7, earthlyBranch: '未', displayName: '未时' },
  { name: '申时（15:00-17:00）', value: 8, earthlyBranch: '申', displayName: '申时' },
  { name: '酉时（17:00-19:00）', value: 9, earthlyBranch: '酉', displayName: '酉时' },
  { name: '戌时（19:00-21:00）', value: 10, earthlyBranch: '戌', displayName: '戌时' },
  { name: '亥时（21:00-23:00）', value: 11, earthlyBranch: '亥', displayName: '亥时' },
  { name: '吉时（时辰未知）', value: 99, earthlyBranch: '吉', displayName: '吉时' }
];

/**
 * 模拟订单列表
 */
const mockOrders = [
  {
    id: 1,
    order_no: 'DD1704000001TEST',
    user_id: 'mock_user_001',
    service_id: 1,
    service_name: '祈福法事',
    service_image: '',
    total_amount: '300.00',
    person_count: 2,
    address: '北京市朝阳区',
    remark: '请在农历初一举行',
    status: 'paid',
    payment_status: 'paid',
    paid_at: '2024-01-15 10:30:00',
    created_at: '2024-01-15 10:00:00'
  },
  {
    id: 2,
    order_no: 'DD1704000002TEST',
    user_id: 'mock_user_001',
    service_id: 3,
    service_name: '姻缘祈福',
    service_image: '',
    total_amount: '220.00',
    person_count: 1,
    address: '上海市浦东新区',
    remark: '',
    status: 'pending',
    payment_status: 'unpaid',
    paid_at: null,
    created_at: '2024-01-20 14:20:00'
  }
];

/**
 * 模拟订单详情
 */
const mockOrderDetail = {
  id: 1,
  order_no: 'DD1704000001TEST',
  user_id: 'mock_user_001',
  service_id: 1,
  service_name: '祈福法事',
  service_description: '为您和家人祈求平安健康，消灾解厄',
  service_image: '',
  total_amount: '300.00',
  person_count: 2,
  address: '北京市朝阳区',
  remark: '请在农历初一举行',
  status: 'paid',
  payment_status: 'paid',
  paid_at: '2024-01-15 10:30:00',
  created_at: '2024-01-15 10:00:00',
  persons: [
    {
      id: 1,
      order_id: 1,
      name: '张三',
      gender: 'male',
      birth_date: '1990-05-20',
      shichen_value: 6,
      shichen_name: '午时',
      bazi_year: '庚午',
      bazi_month: '辛巳',
      bazi_day: '甲子',
      bazi_hour: '庚午',
      bazi_full: '庚午 辛巳 甲子 庚午',
      wuxing_year: '金火',
      wuxing_month: '金火',
      wuxing_day: '木水',
      wuxing_hour: '金火',
      shengxiao: '马',
      lunar_date: '一九九〇年四月廿六',
      address: '北京市朝阳区'
    },
    {
      id: 2,
      order_id: 1,
      name: '李四',
      gender: 'female',
      birth_date: '1992-08-15',
      shichen_value: 2,
      shichen_name: '寅时',
      bazi_year: '壬申',
      bazi_month: '戊申',
      bazi_day: '丙寅',
      bazi_hour: '庚寅',
      bazi_full: '壬申 戊申 丙寅 庚寅',
      wuxing_year: '水金',
      wuxing_month: '土金',
      wuxing_day: '火木',
      wuxing_hour: '金木',
      shengxiao: '猴',
      lunar_date: '一九九二年七月十七',
      address: '北京市海淀区'
    }
  ]
};

/**
 * 模拟订单ID计数器
 */
let mockOrderIdCounter = 3;

/**
 * 模拟创建订单
 */
function mockCreateOrder(orderData) {
  const newOrderId = mockOrderIdCounter++;
  const orderNo = 'DD' + Date.now() + 'TEST';

  // 模拟计算八字
  const personsWithBazi = orderData.persons.map((person, index) => {
    return {
      ...person,
      bazi_year: '甲子',
      bazi_month: '乙丑',
      bazi_day: '丙寅',
      bazi_hour: '丁卯',
      bazi_full: '甲子 乙丑 丙寅 丁卯',
      wuxing_year: '木水',
      wuxing_month: '木土',
      wuxing_day: '火木',
      wuxing_hour: '火木',
      shengxiao: '鼠',
      lunar_date: '二〇二四年正月初一'
    };
  });

  return {
    success: true,
    message: '订单创建成功',
    data: {
      order_id: newOrderId,
      order_no: orderNo,
      total_amount: orderData.total_amount,
      person_count: orderData.persons.length
    }
  };
}

module.exports = {
  mockCategories,
  mockServices,
  mockShichen,
  mockOrders,
  mockOrderDetail,
  mockCreateOrder
};
