package org.javaboy.vhr.service;

import org.javaboy.vhr.mapper.EmployeeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class StatisticsService {
    @Autowired
    EmployeeMapper employeeMapper;

    public Map<String, Object> getOverview() {
        Map<String, Object> result = new HashMap<>();
        result.put("totalEmployees", employeeMapper.getTotalCount());
        result.put("totalDepartments", employeeMapper.getDepartmentCount());
        result.put("hiredThisMonth", employeeMapper.getHiredThisMonth());
        result.put("pendingItems", 3);
        return result;
    }

    public List<Map<String, Object>> getDepartmentDistribution() {
        return employeeMapper.getDepartmentDistribution();
    }

    public List<Map<String, Object>> getEducationDistribution() {
        return employeeMapper.getEducationDistribution();
    }
}
