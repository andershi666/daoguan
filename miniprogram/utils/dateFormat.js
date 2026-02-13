// utils/dateFormat.js - 日期格式化工具

/**
 * 格式化日期时间为 YYYY-MM-DD HH:MM:SS 格式
 * @param {string|Date} datetime - 日期时间字符串或Date对象
 * @returns {string} 格式化后的日期时间字符串
 */
function formatDateTime(datetime) {
  if (!datetime) return '';

  const date = typeof datetime === 'string' ? new Date(datetime) : datetime;

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
 * @param {string|Date} date - 日期字符串或Date对象
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(date) {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

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

module.exports = {
  formatDateTime,
  formatDate
};
