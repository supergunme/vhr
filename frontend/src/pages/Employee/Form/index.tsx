import { useState, useEffect } from 'react';
import {
  Steps,
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Radio,
  Button,
  Space,
  MessagePlugin,
  InputNumber,
} from 'tdesign-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  getEmployeeById,
  addEmployee,
  updateEmployee,
  getMaxWorkID,
  getAllNations,
  getAllPoliticsStatus,
  getAllJobLevels,
  getAllPositions,
  getAllDepartments,
} from '../../../api/employee';
import type { Employee, Nation, PoliticsStatus, JobLevel, Position, Department } from '../../../types';
import './index.css';

const { StepItem } = Steps;
const { FormItem } = Form;

interface DeptOption {
  label: string;
  value: number;
}

function flattenDepartments(deps: Department[], prefix = ''): DeptOption[] {
  const result: DeptOption[] = [];
  deps.forEach((d) => {
    result.push({ label: prefix + d.name, value: d.id });
    if (d.children && d.children.length > 0) {
      result.push(...flattenDepartments(d.children, prefix + d.name + ' / '));
    }
  });
  return result;
}

export default function EmployeeForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');
  const isEdit = !!editId;

  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Employee>>({
    gender: '男',
    wedlock: '未婚',
    engageForm: '劳动合同',
    workState: '在职',
    tiptopDegree: '本科',
  });

  // Dropdown options
  const [nations, setNations] = useState<Nation[]>([]);
  const [politicsStatuses, setPoliticsStatuses] = useState<PoliticsStatus[]>([]);
  const [jobLevels, setJobLevels] = useState<JobLevel[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [deptOptions, setDeptOptions] = useState<DeptOption[]>([]);

  useEffect(() => {
    // Load dropdown data
    getAllNations().then((d) => setNations((d || []) as Nation[]));
    getAllPoliticsStatus().then((d) => setPoliticsStatuses((d || []) as PoliticsStatus[]));
    getAllJobLevels().then((d) => setJobLevels((d || []) as JobLevel[]));
    getAllPositions().then((d) => setPositions((d || []) as Position[]));
    getAllDepartments().then((d) => setDeptOptions(flattenDepartments((d || []) as Department[])));

    if (isEdit) {
      getEmployeeById(Number(editId)).then((emp) => {
        if (emp) setFormData(emp);
      });
    } else {
      // Get next work ID for new employee
      getMaxWorkID().then((resp: any) => {
        if (resp && resp.obj) {
          setFormData((prev) => ({ ...prev, workID: resp.obj as string }));
        }
      });
    }
  }, [editId, isEdit]);

  const updateField = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setCurrent((prev) => Math.min(prev + 1, 3));
  };

  const handlePrev = () => {
    setCurrent((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let resp: any;
      if (isEdit) {
        resp = await updateEmployee(formData);
      } else {
        resp = await addEmployee(formData);
      }
      if (resp && resp.status === 200) {
        MessagePlugin.success(isEdit ? '更新成功' : '添加成功');
        navigate('/app/employee/list');
      } else if (resp) {
        MessagePlugin.error(resp.msg || '操作失败');
      }
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  const degreeOptions = [
    { label: '博士', value: '博士' },
    { label: '硕士', value: '硕士' },
    { label: '本科', value: '本科' },
    { label: '大专', value: '大专' },
    { label: '高中', value: '高中' },
    { label: '初中', value: '初中' },
    { label: '小学', value: '小学' },
  ];

  const wedlockOptions = [
    { label: '已婚', value: '已婚' },
    { label: '未婚', value: '未婚' },
    { label: '离异', value: '离异' },
  ];

  const engageFormOptions = [
    { label: '劳动合同', value: '劳动合同' },
    { label: '劳务合同', value: '劳务合同' },
  ];

  const workStateOptions = [
    { label: '在职', value: '在职' },
    { label: '离职', value: '离职' },
  ];

  const renderStep1 = () => (
    <Form labelWidth={100} className="step-form">
      <div className="form-grid">
        <FormItem label="姓名" name="name">
          <Input
            value={formData.name || ''}
            onChange={(v) => updateField('name', v)}
            placeholder="请输入姓名"
          />
        </FormItem>
        <FormItem label="性别" name="gender">
          <Radio.Group
            value={formData.gender || '男'}
            onChange={(v) => updateField('gender', v)}
          >
            <Radio value="男">男</Radio>
            <Radio value="女">女</Radio>
          </Radio.Group>
        </FormItem>
        <FormItem label="出生日期" name="birthday">
          <DatePicker
            value={formData.birthday || ''}
            onChange={(v) => updateField('birthday', v)}
            format="YYYY-MM-DD"
            style={{ width: '100%' }}
          />
        </FormItem>
        <FormItem label="身份证号" name="idCard">
          <Input
            value={formData.idCard || ''}
            onChange={(v) => updateField('idCard', v)}
            placeholder="请输入身份证号"
          />
        </FormItem>
        <FormItem label="婚姻状况" name="wedlock">
          <Select
            value={formData.wedlock || '未婚'}
            onChange={(v) => updateField('wedlock', v)}
            options={wedlockOptions}
          />
        </FormItem>
        <FormItem label="民族" name="nationId">
          <Select
            value={formData.nationId}
            onChange={(v) => updateField('nationId', v)}
            options={nations.map((n) => ({ label: n.name, value: n.id }))}
            placeholder="请选择民族"
            filterable
          />
        </FormItem>
        <FormItem label="籍贯" name="nativePlace">
          <Input
            value={formData.nativePlace || ''}
            onChange={(v) => updateField('nativePlace', v)}
            placeholder="请输入籍贯"
          />
        </FormItem>
        <FormItem label="政治面貌" name="politicId">
          <Select
            value={formData.politicId}
            onChange={(v) => updateField('politicId', v)}
            options={politicsStatuses.map((p) => ({ label: p.name, value: p.id }))}
            placeholder="请选择政治面貌"
          />
        </FormItem>
        <FormItem label="电话" name="phone">
          <Input
            value={formData.phone || ''}
            onChange={(v) => updateField('phone', v)}
            placeholder="请输入电话号码"
          />
        </FormItem>
        <FormItem label="邮箱" name="email">
          <Input
            value={formData.email || ''}
            onChange={(v) => updateField('email', v)}
            placeholder="请输入邮箱"
          />
        </FormItem>
        <FormItem label="联系地址" name="address" className="form-full-width">
          <Input
            value={formData.address || ''}
            onChange={(v) => updateField('address', v)}
            placeholder="请输入联系地址"
          />
        </FormItem>
      </div>
    </Form>
  );

  const renderStep2 = () => (
    <Form labelWidth={100} className="step-form">
      <div className="form-grid">
        <FormItem label="所属部门" name="departmentId">
          <Select
            value={formData.departmentId}
            onChange={(v) => updateField('departmentId', v)}
            options={deptOptions}
            placeholder="请选择部门"
            filterable
          />
        </FormItem>
        <FormItem label="职位" name="posId">
          <Select
            value={formData.posId}
            onChange={(v) => updateField('posId', v)}
            options={positions.map((p) => ({ label: p.name, value: p.id }))}
            placeholder="请选择职位"
          />
        </FormItem>
        <FormItem label="职称" name="jobLevelId">
          <Select
            value={formData.jobLevelId}
            onChange={(v) => updateField('jobLevelId', v)}
            options={jobLevels.map((j) => ({ label: j.name, value: j.id }))}
            placeholder="请选择职称"
          />
        </FormItem>
        <FormItem label="聘用形式" name="engageForm">
          <Select
            value={formData.engageForm || '劳动合同'}
            onChange={(v) => updateField('engageForm', v)}
            options={engageFormOptions}
          />
        </FormItem>
        <FormItem label="在职状态" name="workState">
          <Select
            value={formData.workState || '在职'}
            onChange={(v) => updateField('workState', v)}
            options={workStateOptions}
          />
        </FormItem>
        <FormItem label="工号" name="workID">
          <Input
            value={formData.workID || ''}
            onChange={(v) => updateField('workID', v)}
            placeholder="自动生成"
          />
        </FormItem>
      </div>
    </Form>
  );

  const renderStep3 = () => (
    <Form labelWidth={100} className="step-form">
      <div className="form-grid">
        <FormItem label="最高学历" name="tiptopDegree">
          <Select
            value={formData.tiptopDegree || '本科'}
            onChange={(v) => updateField('tiptopDegree', v)}
            options={degreeOptions}
          />
        </FormItem>
        <FormItem label="毕业院校" name="school">
          <Input
            value={formData.school || ''}
            onChange={(v) => updateField('school', v)}
            placeholder="请输入毕业院校"
          />
        </FormItem>
        <FormItem label="所属专业" name="specialty">
          <Input
            value={formData.specialty || ''}
            onChange={(v) => updateField('specialty', v)}
            placeholder="请输入所属专业"
          />
        </FormItem>
      </div>
    </Form>
  );

  const renderStep4 = () => (
    <Form labelWidth={100} className="step-form">
      <div className="form-grid">
        <FormItem label="入职日期" name="beginDate">
          <DatePicker
            value={formData.beginDate || ''}
            onChange={(v) => updateField('beginDate', v)}
            format="YYYY-MM-DD"
            style={{ width: '100%' }}
          />
        </FormItem>
        <FormItem label="转正日期" name="conversionTime">
          <DatePicker
            value={formData.conversionTime || ''}
            onChange={(v) => updateField('conversionTime', v)}
            format="YYYY-MM-DD"
            style={{ width: '100%' }}
          />
        </FormItem>
        <FormItem label="合同起始日" name="beginContract">
          <DatePicker
            value={formData.beginContract || ''}
            onChange={(v) => updateField('beginContract', v)}
            format="YYYY-MM-DD"
            style={{ width: '100%' }}
          />
        </FormItem>
        <FormItem label="合同终止日" name="endContract">
          <DatePicker
            value={formData.endContract || ''}
            onChange={(v) => updateField('endContract', v)}
            format="YYYY-MM-DD"
            style={{ width: '100%' }}
          />
        </FormItem>
        <FormItem label="合同期限(年)" name="contractTerm">
          <InputNumber
            value={formData.contractTerm}
            onChange={(v) => updateField('contractTerm', v)}
            min={0}
            max={50}
            style={{ width: '100%' }}
          />
        </FormItem>
      </div>
    </Form>
  );

  const steps = [
    { title: '基本信息', content: renderStep1 },
    { title: '岗位信息', content: renderStep2 },
    { title: '教育背景', content: renderStep3 },
    { title: '合同信息', content: renderStep4 },
  ];

  return (
    <div className="employee-form-page">
      <Card bordered={false} className="form-card">
        <div className="form-header">
          <h2 className="form-title">{isEdit ? '编辑员工信息' : '录入新员工'}</h2>
          <Button variant="outline" onClick={() => navigate('/app/employee/list')}>
            返回列表
          </Button>
        </div>

        <Steps current={current} className="form-steps">
          {steps.map((step, idx) => (
            <StepItem key={idx} title={step.title} />
          ))}
        </Steps>

        <div className="form-content">
          {steps[current].content()}
        </div>

        <div className="form-actions">
          <Space>
            {current > 0 && (
              <Button variant="outline" onClick={handlePrev}>
                上一步
              </Button>
            )}
            {current < steps.length - 1 && (
              <Button theme="primary" onClick={handleNext}>
                下一步
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button theme="primary" loading={loading} onClick={handleSubmit}>
                {isEdit ? '保存修改' : '提交'}
              </Button>
            )}
          </Space>
        </div>
      </Card>
    </div>
  );
}
