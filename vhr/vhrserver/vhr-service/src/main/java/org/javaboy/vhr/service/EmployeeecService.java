package org.javaboy.vhr.service;

import org.javaboy.vhr.mapper.EmployeeecMapper;
import org.javaboy.vhr.model.Employeeec;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeecService {
    @Autowired
    EmployeeecMapper employeeecMapper;

    public List<Employeeec> getByEid(Integer eid) {
        return employeeecMapper.getByEid(eid);
    }

    public int add(Employeeec employeeec) {
        return employeeecMapper.insertSelective(employeeec);
    }

    public int update(Employeeec employeeec) {
        return employeeecMapper.updateByPrimaryKeySelective(employeeec);
    }

    public int delete(Integer id) {
        return employeeecMapper.deleteByPrimaryKey(id);
    }
}
