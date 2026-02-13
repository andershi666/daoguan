-- =============================================
-- 数据库迁移：为服务表添加短描述字段
-- 执行日期：2026-02-13
-- =============================================

USE daoguan_db;

-- 1. 添加 short_description 字段
ALTER TABLE services
ADD COLUMN short_description VARCHAR(200) DEFAULT '' COMMENT '短描述（用于列表展示）'
AFTER name;

-- 2. 更新现有数据：将 description 的前 50 个字符作为 short_description
-- （如果现有数据的 description 比较短，可以直接复制）
UPDATE services SET short_description =
  CASE
    WHEN CHAR_LENGTH(description) <= 50 THEN description
    ELSE CONCAT(SUBSTRING(description, 1, 47), '...')
  END
WHERE short_description = '';

-- 3. 为新增服务提供完整的短描述和长描述示例
-- 注意：这会覆盖现有数据，仅用于示例
UPDATE services SET
  short_description = '为您和家人祈求平安健康，消灾解厄',
  description = '祈福法事是道教传统仪式,通过诵经、焚香、供奉等方式，为信众祈求平安健康、消灾解厄。法事由道长主持，依据传统科仪进行，帮助您和家人化解困厄，获得平安顺遂。适合为家人健康、事业顺利、家庭和睦等祈福。'
WHERE name = '祈福法事';

UPDATE services SET
  short_description = '为逝者超度，祈求往生净土',
  description = '超度法事是为亡者举行的道教仪式，通过诵经礼忏、焚化纸钱等方式，超度亡灵，帮助逝者早日往生净土，脱离轮回之苦。法事庄严肃穆，由经验丰富的道长主持，为逝者积累功德，同时也为在世亲人祈求平安。'
WHERE name = '超度法事';

UPDATE services SET
  short_description = '祈求姻缘美满，早日觅得良缘',
  description = '姻缘祈福法事专为单身人士或情侣设立，通过向月老、和合二仙祈福，帮助善信早日觅得良缘，或使现有感情更加和谐美满。法事中将为您点燃姻缘灯，祈求美好姻缘早日到来，或现有感情能够长长久久。'
WHERE name = '姻缘祈福';

UPDATE services SET
  short_description = '祈求事业顺利，财运亨通',
  description = '事业祈福法事为事业发展、财运提升而设。通过向财神、文昌帝君等神祇祈福，帮助信众事业顺遂、财源广进。适合创业者、职场人士、生意人等，祈求工作顺利、升职加薪、生意兴隆、贵人相助。'
WHERE name = '事业祈福';

UPDATE services SET
  short_description = '请平安符，保佑平安顺遂',
  description = '平安符是经过道长开光加持的护身符，随身佩戴可保平安顺遂、驱邪避凶。符纸由道观法师亲自书写，经过开光仪式加持，具有强大的护佑之力。适合日常佩戴或赠送亲友，为自己和家人祈求一份平安保障。'
WHERE name = '平安符';

UPDATE services SET
  short_description = '祈求身体健康，疾病消除',
  description = '健康祈福法事专为身体欠佳或希望保持健康的信众设立。通过向药王菩萨、保生大帝等医药之神祈福，祈求身体健康、疾病早日康复、免受病痛之苦。法事中将为您点燃健康灯，祈愿身体安康、精神饱满。'
WHERE name = '健康祈福';

-- 验证修改
DESCRIBE services;

-- 查看更新后的数据
SELECT id, name, short_description, LEFT(description, 50) as description_preview FROM services;
