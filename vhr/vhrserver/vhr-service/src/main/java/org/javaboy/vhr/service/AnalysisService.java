package org.javaboy.vhr.service;

import org.javaboy.vhr.mapper.EmployeeMapper;
import org.javaboy.vhr.model.Employee;
import org.javaboy.vhr.model.RadarDataVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
public class AnalysisService {
    @Autowired
    EmployeeMapper employeeMapper;

    public RadarDataVO getRadarData(Integer eid) {
        Employee emp = employeeMapper.getEmployeeById(eid);
        if (emp == null) {
            return null;
        }
        RadarDataVO vo = new RadarDataVO();
        vo.setEmployeeId(emp.getId());
        vo.setEmployeeName(emp.getName());
        vo.setWorkID(emp.getWorkID());

        // 1. Tenure (司龄): from hire_date or beginDate
        Date hireDate = emp.getBeginDate();
        double tenureYears = 0;
        if (hireDate != null) {
            long diffMs = System.currentTimeMillis() - hireDate.getTime();
            tenureYears = diffMs / (365.25 * 24 * 60 * 60 * 1000);
        }
        vo.setTenure(Math.min(tenureYears * 100.0 / 30.0, 100.0));

        // 2. Position Experience (岗位经验): from position_years field
        // Since the field is newly added, use a default
        int posYears = 0; // TODO: read from extended field when available
        vo.setPositionExp(Math.min(posYears * 100.0 / 20.0, 100.0));

        // 3. Expertise (擅长领域): count comma-separated items
        String expertiseArea = null; // TODO: read from extended field
        int expertiseCount = 0;
        if (expertiseArea != null && !expertiseArea.trim().isEmpty()) {
            expertiseCount = expertiseArea.split(",").length;
        }
        vo.setExpertise(Math.min(expertiseCount * 20.0, 100.0));

        // 4. Evaluation (考评得分): direct score
        vo.setEvaluation(0); // TODO: read from extended field

        // 5. Contribution (特殊贡献): has content = 80, empty = 0
        String contribution = null; // TODO: read from extended field
        vo.setContribution(contribution != null && !contribution.trim().isEmpty() ? 80.0 : 0.0);

        // 6. Reward Points (奖惩积分): from employeeec
        Integer ecSum = employeeMapper.getEcPointSum(eid);
        if (ecSum == null) ecSum = 0;
        // Map to 0-100: score = min((sum + 50) * 100 / 100, 100)
        double rewardScore = Math.min(Math.max((ecSum + 50) * 1.0, 0), 100);
        vo.setRewardPoints(rewardScore);

        return vo;
    }

    public List<RadarDataVO> getRadarDataBatch(List<Integer> ids) {
        List<RadarDataVO> result = new ArrayList<>();
        for (Integer id : ids) {
            RadarDataVO vo = getRadarData(id);
            if (vo != null) {
                result.add(vo);
            }
        }
        return result;
    }

    public List<Map<String, Object>> getBriefEmployees() {
        return employeeMapper.getBriefEmployees();
    }
}
