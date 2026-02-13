require('dotenv').config();

// 检查是否使用 Mock 模式
const USE_MOCK = process.env.USE_MOCK === 'true';

let pool;

if (USE_MOCK) {
  // 使用 Mock 数据库
  console.log('🔧 使用 Mock 数据库模式（无需 MySQL）');
  pool = require('./mockDatabase');
} else {
  // 使用真实 MySQL 数据库
  console.log('🔧 使用 MySQL 数据库模式');
  const mysql = require('mysql2/promise');

  // 创建数据库连接池
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  // 测试数据库连接
  pool.getConnection()
    .then(conn => {
      console.log('✅ 数据库连接成功');
      conn.release();
    })
    .catch(err => {
      console.error('❌ 数据库连接失败:', err.message);
    });
}

module.exports = pool;
