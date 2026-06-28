-- Add analysis fields to employee table
ALTER TABLE employee ADD COLUMN hire_date DATE NULL COMMENT '入社日期';
ALTER TABLE employee ADD COLUMN position_years INT DEFAULT 0 COMMENT '岗位年限';
ALTER TABLE employee ADD COLUMN expertise_area VARCHAR(500) NULL COMMENT '擅长领域(逗号分隔)';
ALTER TABLE employee ADD COLUMN special_contribution TEXT NULL COMMENT '特殊贡献';
ALTER TABLE employee ADD COLUMN evaluation_score DECIMAL(5,2) DEFAULT 0 COMMENT '综合考评分';
ALTER TABLE employee ADD COLUMN leadership_level VARCHAR(20) DEFAULT '普通员工' COMMENT '管理层级';

-- Add ROLE_leader
INSERT INTO role(id, name, nameZh) VALUES (22, 'ROLE_leader', '领导') ON DUPLICATE KEY UPDATE nameZh='领导';
