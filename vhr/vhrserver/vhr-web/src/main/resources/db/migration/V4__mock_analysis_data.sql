-- Populate analysis fields with mock data for demonstration
-- Set hire_date = beginDate for existing employees
UPDATE employee SET hire_date = beginDate WHERE hire_date IS NULL AND beginDate IS NOT NULL;

-- Set random position_years (1-15)
UPDATE employee SET position_years = FLOOR(1 + RAND() * 15) WHERE position_years IS NULL OR position_years = 0;

-- Set expertise_area for some employees
UPDATE employee SET expertise_area = '信贷管理,风险控制' WHERE id % 7 = 0 AND (expertise_area IS NULL OR expertise_area = '');
UPDATE employee SET expertise_area = '财务管理,合规管理' WHERE id % 7 = 1 AND (expertise_area IS NULL OR expertise_area = '');
UPDATE employee SET expertise_area = '信息科技,运营管理' WHERE id % 7 = 2 AND (expertise_area IS NULL OR expertise_area = '');
UPDATE employee SET expertise_area = '人力资源' WHERE id % 7 = 3 AND (expertise_area IS NULL OR expertise_area = '');
UPDATE employee SET expertise_area = '市场营销,信贷管理,风险控制' WHERE id % 7 = 4 AND (expertise_area IS NULL OR expertise_area = '');
UPDATE employee SET expertise_area = '合规管理,财务管理' WHERE id % 7 = 5 AND (expertise_area IS NULL OR expertise_area = '');
UPDATE employee SET expertise_area = '运营管理,人力资源,信息科技' WHERE id % 7 = 6 AND (expertise_area IS NULL OR expertise_area = '');

-- Set evaluation_score (50-98 range)
UPDATE employee SET evaluation_score = ROUND(50 + RAND() * 48, 1) WHERE evaluation_score IS NULL OR evaluation_score = 0;

-- Set special_contribution for top performers
UPDATE employee SET special_contribution = '参与核心系统升级改造项目,获得省级优秀员工称号' WHERE id % 13 = 0 AND (special_contribution IS NULL OR special_contribution = '');
UPDATE employee SET special_contribution = '带领团队完成年度信贷目标120%' WHERE id % 13 = 1 AND (special_contribution IS NULL OR special_contribution = '');
UPDATE employee SET special_contribution = '主导风控体系优化,降低不良率0.3%' WHERE id % 13 = 5 AND (special_contribution IS NULL OR special_contribution = '');

-- Set leadership_level
UPDATE employee SET leadership_level = '中层' WHERE id % 20 = 0;
UPDATE employee SET leadership_level = '高层' WHERE id % 50 = 0;

-- Add some reward/punishment records for demo
INSERT INTO employeeec (eid, ecDate, ecReason, ecPoint, ecType, remark) VALUES
(1, '2024-03-15', '年度考核优秀', 10, 0, '连续三年考核优秀'),
(1, '2024-06-20', '完成重点项目', 5, 0, '提前完成信贷系统迁移'),
(2, '2024-04-10', '客户服务表彰', 8, 0, '获客户锦旗'),
(3, '2024-05-01', '季度业绩突出', 6, 0, NULL),
(5, '2024-02-28', '违规操作', -5, 1, '未按流程审批'),
(10, '2024-01-15', '创新提案奖', 7, 0, '流程优化建议被采纳'),
(15, '2024-03-20', '优秀导师', 5, 0, '带教新员工表现突出'),
(20, '2024-04-05', '迟到累计', -3, 1, '本季度迟到3次');
