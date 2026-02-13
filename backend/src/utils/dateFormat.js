// utils/dateFormat.js - 后端日期格式化工具

/**
 * 格式化日期时间为 YYYY-MM-DD HH:MM:SS 格式
 * @param {Date|string} datetime - 日期时间对象或字符串
 * @returns {string} 格式化后的日期时间字符串
 */
function formatDateTime(datetime) {
  if (!datetime) return null;

  const date = datetime instanceof Date ? datetime : new Date(datetime);

  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    return datetime;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 格式化日期为 YYYY-MM-DD 格式
 * @param {Date|string} date - 日期对象或字符串
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(date) {
  if (!date) return null;

  const dateObj = date instanceof Date ? date : new Date(date);

  // 检查日期是否有效
  if (isNaN(dateObj.getTime())) {
    // 如果已经是YYYY-MM-DD格式，直接返回
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }
    return date;
  }

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * 格式化订单对象中的日期字段
 * @param {Object} order - 订单对象
 * @returns {Object} 格式化后的订单对象
 */
function formatOrderDates(order) {
  if (!order) return order;

  return {
    ...order,
    created_at: formatDateTime(order.created_at),
    updated_at: formatDateTime(order.updated_at),
    paid_at: order.paid_at ? formatDateTime(order.paid_at) : null
  };
}

/**
 * 格式化人员对象中的日期字段
 * @param {Object} person - 人员对象
 * @returns {Object} 格式化后的人员对象
 */
function formatPersonDates(person) {
  if (!person) return person;

  return {
    ...person,
    birth_date: formatDate(person.birth_date),
    created_at: formatDateTime(person.created_at),
    updated_at: formatDateTime(person.updated_at)
  };
}

module.exports = {
  formatDateTime,
  formatDate,
  formatOrderDates,
  formatPersonDates
};
