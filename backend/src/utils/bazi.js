const { Lunar, Solar } = require('lunar-javascript');

/**
 * 天干地支与五行对应关系
 */
const WU_XING_MAP = {
  // 天干
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
  // 地支
  '子': '水', '丑': '土',
  '寅': '木', '卯': '木',
  '辰': '土', '巳': '火',
  '午': '火', '未': '土',
  '申': '金', '酉': '金',
  '戌': '土', '亥': '水'
};

/**
 * 获取天干或地支的五行属性
 */
function getWuXing(ganOrZhi) {
  return WU_XING_MAP[ganOrZhi] || '';
}

/**
 * 时辰对应关系
 */
const SHICHEN = [
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
 * 计算八字
 * @param {string} birthDate - 出生日期 (YYYY-MM-DD)
 * @param {number} shichenValue - 时辰值 (0-11正常时辰, 99表示吉时未知)
 * @param {string} gender - 性别 ('male' or 'female')
 * @returns {object} 八字信息
 */
function calculateBazi(birthDate, shichenValue, gender) {
  try {
    const [year, month, day] = birthDate.split('-').map(Number);

    // 特殊处理：吉时（时辰未知）
    if (shichenValue === 99) {
      // 使用正午时（午时）作为默认时辰进行计算
      const solar = Solar.fromYmdHms(year, month, day, 12, 0, 0);
      const lunar = solar.getLunar();
      const baZi = lunar.getEightChar();

      return {
        success: true,
        bazi: {
          year: `${baZi.getYearGan()}${baZi.getYearZhi()}`,
          month: `${baZi.getMonthGan()}${baZi.getMonthZhi()}`,
          day: `${baZi.getDayGan()}${baZi.getDayZhi()}`,
          hour: '时辰未知',
          full: `${baZi.getYearGan()}${baZi.getYearZhi()} ${baZi.getMonthGan()}${baZi.getMonthZhi()} ${baZi.getDayGan()}${baZi.getDayZhi()} 时辰未知`
        },
        wuxing: {
          year: `${getWuXing(baZi.getYearGan())}${getWuXing(baZi.getYearZhi())}`,
          month: `${getWuXing(baZi.getMonthGan())}${getWuXing(baZi.getMonthZhi())}`,
          day: `${getWuXing(baZi.getDayGan())}${getWuXing(baZi.getDayZhi())}`,
          hour: '未知'
        },
        shengxiao: lunar.getYearShengXiao(),
        lunar: {
          date: `${lunar.getYearInChinese()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
          year: lunar.getYear(),
          month: lunar.getMonth(),
          day: lunar.getDay()
        },
        solar: {
          date: birthDate,
          year,
          month,
          day
        },
        shichen: '吉时（时辰未知）',
        gender: gender
      };
    }

    // 正常时辰处理：根据时辰值确定具体时刻
    // 使用每个时辰的起始时间,确保与标准八字排盘一致
    // 特别注意: 子时(23:00-01:00)跨日,传统命理学使用23:00(早子时)
    const SHICHEN_HOUR_MAP = {
      0: 23,  // 子时: 23:00 (早子时, 传统命理学标准, 23:00-01:00)
      1: 1,   // 丑时: 01:00 (01:00-03:00)
      2: 3,   // 寅时: 03:00 (03:00-05:00)
      3: 5,   // 卯时: 05:00 (05:00-07:00)
      4: 7,   // 辰时: 07:00 (07:00-09:00)
      5: 9,   // 巳时: 09:00 (09:00-11:00)
      6: 11,  // 午时: 11:00 (11:00-13:00)
      7: 13,  // 未时: 13:00 (13:00-15:00)
      8: 15,  // 申时: 15:00 (15:00-17:00)
      9: 17,  // 酉时: 17:00 (17:00-19:00)
      10: 19, // 戌时: 19:00 (19:00-21:00)
      11: 21  // 亥时: 21:00 (21:00-23:00)
    };

    const shichenHour = SHICHEN_HOUR_MAP[shichenValue];
    if (shichenHour === undefined) {
      throw new Error(`Invalid shichen value: ${shichenValue}. Must be 0-11 or 99.`);
    }

    // 创建公历日期对象
    const solar = Solar.fromYmdHms(year, month, day, shichenHour, 0, 0);

    // 转换为农历
    const lunar = solar.getLunar();

    // 获取八字
    const baZi = lunar.getEightChar();

    // 年柱
    const yearGan = baZi.getYearGan(); // 年干
    const yearZhi = baZi.getYearZhi(); // 年支
    const yearPillar = `${yearGan}${yearZhi}`;

    // 月柱
    const monthGan = baZi.getMonthGan();
    const monthZhi = baZi.getMonthZhi();
    const monthPillar = `${monthGan}${monthZhi}`;

    // 日柱
    const dayGan = baZi.getDayGan();
    const dayZhi = baZi.getDayZhi();
    const dayPillar = `${dayGan}${dayZhi}`;

    // 时柱
    const hourGan = baZi.getTimeGan();
    const hourZhi = baZi.getTimeZhi();
    const hourPillar = `${hourGan}${hourZhi}`;

    // 获取五行（使用天干地支对象的五行属性）
    const yearGanWuXing = baZi.getYearGan() ? getWuXing(baZi.getYearGan()) : '';
    const yearZhiWuXing = baZi.getYearZhi() ? getWuXing(baZi.getYearZhi()) : '';
    const monthGanWuXing = baZi.getMonthGan() ? getWuXing(baZi.getMonthGan()) : '';
    const monthZhiWuXing = baZi.getMonthZhi() ? getWuXing(baZi.getMonthZhi()) : '';
    const dayGanWuXing = baZi.getDayGan() ? getWuXing(baZi.getDayGan()) : '';
    const dayZhiWuXing = baZi.getDayZhi() ? getWuXing(baZi.getDayZhi()) : '';
    const hourGanWuXing = baZi.getTimeGan() ? getWuXing(baZi.getTimeGan()) : '';
    const hourZhiWuXing = baZi.getTimeZhi() ? getWuXing(baZi.getTimeZhi()) : '';

    const yearWuXing = `${yearGanWuXing}${yearZhiWuXing}`;
    const monthWuXing = `${monthGanWuXing}${monthZhiWuXing}`;
    const dayWuXing = `${dayGanWuXing}${dayZhiWuXing}`;
    const hourWuXing = `${hourGanWuXing}${hourZhiWuXing}`;

    // 获取生肖
    const shengXiao = lunar.getYearShengXiao();

    // 获取农历日期
    const lunarDate = `${lunar.getYearInChinese()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`;

    return {
      success: true,
      bazi: {
        year: yearPillar,
        month: monthPillar,
        day: dayPillar,
        hour: hourPillar,
        full: `${yearPillar} ${monthPillar} ${dayPillar} ${hourPillar}`
      },
      wuxing: {
        year: yearWuXing,
        month: monthWuXing,
        day: dayWuXing,
        hour: hourWuXing
      },
      shengxiao: shengXiao,
      lunar: {
        date: lunarDate,
        year: lunar.getYear(),
        month: lunar.getMonth(),
        day: lunar.getDay()
      },
      solar: {
        date: birthDate,
        year,
        month,
        day
      },
      shichen: SHICHEN[shichenValue].name,
      gender: gender
    };
  } catch (error) {
    console.error('八字计算错误:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 获取所有时辰列表
 */
function getShichenList() {
  return SHICHEN.map(sc => ({
    name: sc.name,
    value: sc.value,
    earthlyBranch: sc.earthlyBranch,
    displayName: sc.displayName
  }));
}

module.exports = {
  calculateBazi,
  getShichenList,
  SHICHEN
};
