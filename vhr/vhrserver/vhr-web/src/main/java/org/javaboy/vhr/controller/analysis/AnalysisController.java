package org.javaboy.vhr.controller.analysis;

import org.javaboy.vhr.model.RadarDataVO;
import org.javaboy.vhr.service.AnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analysis")
public class AnalysisController {
    @Autowired
    AnalysisService analysisService;

    @GetMapping("/radar")
    public RadarDataVO getRadarData(@RequestParam Integer id) {
        return analysisService.getRadarData(id);
    }

    @GetMapping("/radar/compare")
    public List<RadarDataVO> getRadarCompare(@RequestParam String ids) {
        List<Integer> idList = new ArrayList<>();
        for (String s : ids.split(",")) {
            try {
                idList.add(Integer.parseInt(s.trim()));
            } catch (NumberFormatException e) {
                // skip invalid
            }
        }
        return analysisService.getRadarDataBatch(idList);
    }

    @GetMapping("/employees/brief")
    public List<Map<String, Object>> getBriefEmployees() {
        return analysisService.getBriefEmployees();
    }
}
