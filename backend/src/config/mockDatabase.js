/**
 * Mock 数据库 - 用于开发测试，无需安装 MySQL
 * 使用内存存储数据
 */

const { formatOrderDates, formatPersonDates } = require('../utils/dateFormat');

// 内存数据存储
const mockData = {
  categories: [
    {
      id: 1,
      name: '法事服务',
      icon: '🙏',
      sort_order: 1,
      status: 'active',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 2,
      name: '祈福服务',
      icon: '✨',
      sort_order: 2,
      status: 'active',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 3,
      name: '吉祥物品',
      icon: '🎁',
      sort_order: 3,
      status: 'active',
      created_at: new Date(),
      updated_at: new Date()
    }
  ],
  services: [
    {
      id: 1,
      name: '祈福法事',
      short_description: '为您和家人祈求平安健康，消灾解厄',
      description: '祈福法事是道教传统仪式，通过诵经、焚香、供奉等方式，为信众祈求平安健康、消灾解厄。法事由道长主持，依据传统科仪进行，帮助您和家人化解困厄，获得平安顺遂。适合为家人健康、事业顺利、家庭和睦等祈福。',
      category_id: 1,
      base_price: 200.00,
      price_per_person: 50.00,
      image_url: '',
      sort_order: 1,
      status: 'active',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 2,
      name: '超度法事',
      short_description: '为逝者超度，祈求往生净土',
      description: '超度法事是为亡者举行的道教仪式，通过诵经礼忏、焚化纸钱等方式，超度亡灵，帮助逝者早日往生净土，脱离轮回之苦。法事庄严肃穆，由经验丰富的道长主持，为逝者积累功德，同时也为在世亲人祈求平安。',
      category_id: 1,
      base_price: 300.00,
      price_per_person: 80.00,
      image_url: '',
      sort_order: 2,
      status: 'active',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 3,
      name: '姻缘祈福',
      short_description: '祈求姻缘美满，早日觅得良缘',
      description: '姻缘祈福法事专为单身人士或情侣设立，通过向月老、和合二仙祈福，帮助善信早日觅得良缘，或使现有感情更加和谐美满。法事中将为您点燃姻缘灯，祈求美好姻缘早日到来，或现有感情能够长长久久。',
      category_id: 2,
      base_price: 180.00,
      price_per_person: 40.00,
      image_url: '',
      sort_order: 3,
      status: 'active',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 4,
      name: '事业祈福',
      short_description: '祈求事业顺利，财运亨通',
      description: '事业祈福法事为事业发展、财运提升而设。通过向财神、文昌帝君等神祇祈福，帮助信众事业顺遂、财源广进。适合创业者、职场人士、生意人等，祈求工作顺利、升职加薪、生意兴隆、贵人相助。',
      category_id: 2,
      base_price: 180.00,
      price_per_person: 40.00,
      image_url: '',
      sort_order: 4,
      status: 'active',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 5,
      name: '平安符',
      short_description: '请平安符，保佑平安顺遂',
      description: '平安符是经过道长开光加持的护身符，随身佩戴可保平安顺遂、驱邪避凶。符纸由道观法师亲自书写，经过开光仪式加持，具有强大的护佑之力。适合日常佩戴或赠送亲友，为自己和家人祈求一份平安保障。',
      category_id: 3,
      base_price: 100.00,
      price_per_person: 30.00,
      image_url: '',
      sort_order: 5,
      status: 'active',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 6,
      name: '健康祈福',
      short_description: '祈求身体健康，疾病消除',
      description: '健康祈福法事专为身体欠佳或希望保持健康的信众设立。通过向药王菩萨、保生大帝等医药之神祈福，祈求身体健康、疾病早日康复、免受病痛之苦。法事中将为您点燃健康灯，祈愿身体安康、精神饱满。',
      category_id: 2,
      base_price: 150.00,
      price_per_person: 40.00,
      image_url: '',
      sort_order: 6,
      status: 'active',
      created_at: new Date(),
      updated_at: new Date()
    }
  ],
  orders: [],
  order_persons: [],
  payments: [],
  users: []
};

// 自增 ID 计数器
const autoIncrementIds = {
  categories: 4,
  services: 7,
  orders: 1,
  order_persons: 1,
  payments: 1,
  users: 1
};

/**
 * 解析简单的 SQL 查询
 */
function parseQuery(sql, params = []) {
  const sqlLower = sql.toLowerCase().trim();

  // SELECT 查询
  if (sqlLower.startsWith('select')) {
    return handleSelect(sql, params);
  }

  // INSERT 查询
  if (sqlLower.startsWith('insert')) {
    return handleInsert(sql, params);
  }

  // UPDATE 查询
  if (sqlLower.startsWith('update')) {
    return handleUpdate(sql, params);
  }

  // DELETE 查询
  if (sqlLower.startsWith('delete')) {
    return handleDelete(sql, params);
  }

  throw new Error('不支持的 SQL 查询类型');
}

/**
 * 处理 SELECT 查询
 */
function handleSelect(sql, params) {
  const sqlLower = sql.toLowerCase();

  // 从 categories 表查询
  if (sqlLower.includes('from categories')) {
    let results = [...mockData.categories];

    // WHERE status = ? (前端用户查询，只看启用的)
    if (sqlLower.includes('where status')) {
      results = results.filter(item => item.status === params[0]);
    }

    // WHERE id = ?
    if (sqlLower.includes('where id')) {
      results = results.filter(item => item.id === parseInt(params[0]));
    }

    // ORDER BY
    if (sqlLower.includes('order by sort_order')) {
      results.sort((a, b) => a.sort_order - b.sort_order);
    }

    return [results];
  }

  // 从 services 表查询
  if (sqlLower.includes('from services')) {
    let results = [...mockData.services];

    // JOIN categories
    if (sqlLower.includes('join categories')) {
      results = results.map(service => {
        const category = mockData.categories.find(c => c.id === service.category_id);
        return {
          ...service,
          category_name: category ? category.name : ''
        };
      });
    }

    // WHERE status = ? (前端用户查询，只看上架的)
    if (sqlLower.includes('where s.status') || (sqlLower.includes('where status') && !sqlLower.includes('order by'))) {
      const statusIndex = sqlLower.includes('and s.category_id') ? 0 : 0;
      results = results.filter(item => item.status === params[statusIndex]);
    }

    // AND category_id = ?
    if (sqlLower.includes('and s.category_id') || sqlLower.includes('and category_id')) {
      const categoryId = parseInt(params[1] || params[0]);
      results = results.filter(item => item.category_id === categoryId);
    }

    // WHERE id = ?
    if (sqlLower.includes('where s.id') || (sqlLower.includes('where id') && !sqlLower.includes('where o.id'))) {
      const id = parseInt(params[params.length - 1]);
      results = results.filter(item => item.id === id);
    }

    // ORDER BY
    if (sqlLower.includes('order by')) {
      results.sort((a, b) => a.sort_order - b.sort_order);
    }

    return [results];
  }

  // 从 orders 表查询
  if (sqlLower.includes('from orders')) {
    let results = [...mockData.orders];

    // JOIN services
    if (sqlLower.includes('join services')) {
      results = results.map(order => {
        const service = mockData.services.find(s => s.id === order.service_id);
        return {
          ...order,
          service_name: service ? service.name : '',
          service_description: service ? service.short_description : '',
          service_image: service ? service.image_url : ''
        };
      });
    }

    // WHERE user_id = ? (用户订单查询)
    if (sqlLower.includes('where o.user_id') || (sqlLower.includes('where user_id') && !sqlLower.includes('order by'))) {
      results = results.filter(item => item.user_id === params[0]);
    }

    // WHERE id = ? (单个订单查询)
    if (sqlLower.includes('where o.id') || (sqlLower.includes('where id') && sqlLower.includes('from orders'))) {
      const id = parseInt(params[params.length - 1]);
      results = results.filter(item => item.id === id);
    }

    // ORDER BY created_at DESC
    if (sqlLower.includes('order by')) {
      results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    // 格式化订单日期
    results = results.map(order => formatOrderDates(order));

    return [results];
  }

  // 从 order_persons 表查询
  if (sqlLower.includes('from order_persons')) {
    let results = [...mockData.order_persons];

    // JOIN orders and services (管理后台人员列表查询)
    if (sqlLower.includes('join orders') && sqlLower.includes('join services')) {
      results = results.map(person => {
        const order = mockData.orders.find(o => o.id === person.order_id);
        if (order) {
          const service = mockData.services.find(s => s.id === order.service_id);
          return {
            ...person,
            order_no: order.order_no,
            user_id: order.user_id,
            order_date: order.created_at,
            order_status: order.status,
            payment_status: order.payment_status,
            service_name: service ? service.name : ''
          };
        }
        return person;
      });
    }

    // WHERE order_id = ? (单个订单的人员查询)
    if (sqlLower.includes('where order_id')) {
      results = results.filter(item => item.order_id === parseInt(params[0]));
    }

    // ORDER BY created_at
    if (sqlLower.includes('order by')) {
      if (sqlLower.includes('desc')) {
        results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      } else {
        results.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      }
    }

    // 格式化人员日期
    results = results.map(person => formatPersonDates(person));

    return [results];
  }

  return [[]];
}

/**
 * 处理 INSERT 查询
 */
function handleInsert(sql, params) {
  const sqlLower = sql.toLowerCase();

  // INSERT INTO categories
  if (sqlLower.includes('insert into categories')) {
    const id = autoIncrementIds.categories++;
    const newCategory = {
      id,
      name: params[0],
      icon: params[1] || '',
      sort_order: params[2] || 0,
      status: params[3] || 'active',
      created_at: new Date(),
      updated_at: new Date()
    };
    mockData.categories.push(newCategory);
    return [{ insertId: id }];
  }

  // INSERT INTO services
  if (sqlLower.includes('insert into services')) {
    const id = autoIncrementIds.services++;
    const newService = {
      id,
      name: params[0],
      short_description: params[1] || '',
      description: params[2] || '',
      category_id: parseInt(params[3]),
      base_price: parseFloat(params[4]),
      price_per_person: parseFloat(params[5]),
      image_url: params[6] || '',
      sort_order: params[7] || 0,
      status: params[8] || 'active',
      created_at: new Date(),
      updated_at: new Date()
    };
    mockData.services.push(newService);
    return [{ insertId: id }];
  }

  // INSERT INTO orders
  if (sqlLower.includes('insert into orders')) {
    const id = autoIncrementIds.orders++;
    const newOrder = {
      id,
      order_no: params[0],
      user_id: params[1],
      service_id: parseInt(params[2]),
      total_amount: parseFloat(params[3]),
      person_count: parseInt(params[4]),
      remark: params[5] || '',
      status: params[6] || 'pending',
      payment_status: params[7] || 'unpaid',
      paid_at: null,
      created_at: new Date(),
      updated_at: new Date()
    };
    mockData.orders.push(newOrder);
    return [{ insertId: id }];
  }

  // INSERT INTO order_persons
  if (sqlLower.includes('insert into order_persons')) {
    const id = autoIncrementIds.order_persons++;
    const newPerson = {
      id,
      order_id: parseInt(params[0]),
      name: params[1],
      gender: params[2],
      birth_date: params[3],
      shichen_value: parseInt(params[4]),
      shichen_name: params[5],
      bazi_year: params[6],
      bazi_month: params[7],
      bazi_day: params[8],
      bazi_hour: params[9],
      bazi_full: params[10],
      wuxing_year: params[11],
      wuxing_month: params[12],
      wuxing_day: params[13],
      wuxing_hour: params[14],
      shengxiao: params[15],
      lunar_date: params[16],
      address: params[17] || '',
      created_at: new Date(),
      updated_at: new Date()
    };
    mockData.order_persons.push(newPerson);
    return [{ insertId: id }];
  }

  return [{ insertId: 0 }];
}

/**
 * 处理 UPDATE 查询
 */
function handleUpdate(sql, params) {
  const sqlLower = sql.toLowerCase();

  // UPDATE services
  if (sqlLower.includes('update services')) {
    // 提取 WHERE id = ?
    const id = parseInt(params[params.length - 1]);
    const serviceIndex = mockData.services.findIndex(s => s.id === id);

    if (serviceIndex === -1) {
      return [{ affectedRows: 0 }];
    }

    // 更新服务状态
    if (sqlLower.includes('status = ?') && params.length === 2) {
      mockData.services[serviceIndex].status = params[0];
      mockData.services[serviceIndex].updated_at = new Date();
      return [{ affectedRows: 1 }];
    }

    // 完整更新服务
    if (params.length === 10) {
      mockData.services[serviceIndex] = {
        ...mockData.services[serviceIndex],
        name: params[0],
        short_description: params[1] || '',
        description: params[2] || '',
        category_id: parseInt(params[3]),
        base_price: parseFloat(params[4]),
        price_per_person: parseFloat(params[5]),
        image_url: params[6] || '',
        sort_order: params[7] || 0,
        status: params[8] || 'active',
        updated_at: new Date()
      };
      return [{ affectedRows: 1 }];
    }
  }

  // UPDATE categories
  if (sqlLower.includes('update categories')) {
    const id = parseInt(params[params.length - 1]);
    const categoryIndex = mockData.categories.findIndex(c => c.id === id);

    if (categoryIndex === -1) {
      return [{ affectedRows: 0 }];
    }

    // 更新分类
    if (params.length === 5) {
      mockData.categories[categoryIndex] = {
        ...mockData.categories[categoryIndex],
        name: params[0],
        icon: params[1] || '',
        sort_order: params[2] || 0,
        status: params[3] || 'active',
        updated_at: new Date()
      };
      return [{ affectedRows: 1 }];
    }
  }

  return [{ affectedRows: 1 }];
}

/**
 * 处理 DELETE 查询
 */
function handleDelete(sql, params) {
  // 简单实现，可根据需要扩展
  return [{ affectedRows: 1 }];
}

/**
 * Mock 数据库连接池
 */
const mockPool = {
  query: async (sql, params = []) => {
    try {
      console.log('📝 Mock SQL:', sql);
      console.log('📝 参数:', params);
      const result = parseQuery(sql, params);
      console.log('✅ Mock 查询结果:', JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.error('❌ Mock 查询失败:', error);
      throw error;
    }
  },

  getConnection: async () => {
    return {
      query: mockPool.query,
      beginTransaction: async () => {
        console.log('🔄 Mock: 开始事务');
      },
      commit: async () => {
        console.log('✅ Mock: 提交事务');
      },
      rollback: async () => {
        console.log('⚠️ Mock: 回滚事务');
      },
      release: () => {
        console.log('🔓 Mock: 释放连接');
      }
    };
  }
};

// 测试连接
console.log('✅ Mock 数据库已初始化');
console.log(`📊 分类数量: ${mockData.categories.length}`);
console.log(`📊 服务数量: ${mockData.services.length}`);

module.exports = mockPool;
