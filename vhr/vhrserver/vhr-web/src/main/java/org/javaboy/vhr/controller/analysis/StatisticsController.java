package org.javaboy.vhr.controller.analysis;

import org.javaboy.vhr.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
public class StatisticsController {
    @Autowired
    StatisticsService statisticsService;

    @GetMapping("/overview")
    public Map<String, Object> getOverview() {
        return statisticsService.getOverview();
    }

    @GetMapping("/department-dist")
    public List<Map<String, Object>> getDepartmentDistribution() {
        return statisticsService.getDepartmentDistribution();
    }

    @GetMapping("/education-dist")
    public List<Map<String, Object>> getEducationDistribution() {
        return statisticsService.getEducationDistribution();
    }
}
