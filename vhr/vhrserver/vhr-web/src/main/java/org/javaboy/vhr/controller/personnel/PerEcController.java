package org.javaboy.vhr.controller.personnel;

import org.javaboy.vhr.model.Employeeec;
import org.javaboy.vhr.model.RespBean;
import org.javaboy.vhr.service.EmployeeecService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/personnel/ec")
public class PerEcController {
    @Autowired
    EmployeeecService employeeecService;

    @GetMapping("/")
    public List<Employeeec> getByEid(@RequestParam Integer eid) {
        return employeeecService.getByEid(eid);
    }

    @PostMapping("/")
    public RespBean add(@RequestBody Employeeec employeeec) {
        if (employeeecService.add(employeeec) == 1) {
            return RespBean.ok("添加成功!");
        }
        return RespBean.error("添加失败!");
    }

    @PutMapping("/")
    public RespBean update(@RequestBody Employeeec employeeec) {
        if (employeeecService.update(employeeec) == 1) {
            return RespBean.ok("更新成功!");
        }
        return RespBean.error("更新失败!");
    }

    @DeleteMapping("/{id}")
    public RespBean delete(@PathVariable Integer id) {
        if (employeeecService.delete(id) == 1) {
            return RespBean.ok("删除成功!");
        }
        return RespBean.error("删除失败!");
    }
}
