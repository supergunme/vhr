import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Tabs, Tag, Button, Loading } from 'tdesign-react';
import { ChevronLeftIcon } from 'tdesign-icons-react';
import { getEmployeeById } from '../../../api/employee';
import type { Employee } from '../../../types';
import './index.css';

const { TabPanel } = Tabs;

function formatDate(dateStr?: string): string {
  if (!dateStr) return '-';
  return dateStr.substring(0, 10);
}

export default function EmployeeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getEmployeeById(Number(id))
        .then((data) => {
          setEmployee(data);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="detail-loading">
        <Loading />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="detail-empty">
        <p>未找到员工信息</p>
        <Button variant="text" onClick={() => navigate(-1)}>返回</Button>
      </div>
    );
  }

  const basicFields = [
    { label: '姓名', value: employee.name },
    { label: '性别', value: employee.gender },
    { label: '出生日期', value: formatDate(employee.birthday) },
    { label: '身份证号', value: employee.idCard },
    { label: '婚姻状况', value: employee.wedlock },
    { label: '民族', value: employee.nation?.name },
    { label: '籍贯', value: employee.nativePlace },
    { label: '政治面貌', value: employee.politicsstatus?.name },
    { label: '电话', value: employee.phone },
    { label: '邮箱', value: employee.email },
    { label: '联系地址', value: employee.address, span: true },
    { label: '聘用形式', value: employee.engageForm },
  ];

  const contractFields = [
    { label: '入职日期', value: formatDate(employee.beginDate) },
    { label: '转正日期', value: formatDate(employee.conversionTime) },
    { label: '合同起始日', value: formatDate(employee.beginContract) },
    { label: '合同终止日', value: formatDate(employee.endContract) },
    { label: '合同期限(年)', value: employee.contractTerm != null ? String(employee.contractTerm) : undefined },
    { label: '在职状态', value: employee.workState },
  ];

  const educationFields = [
    { label: '最高学历', value: employee.tiptopDegree },
    { label: '毕业院校', value: employee.school },
    { label: '所属专业', value: employee.specialty },
  ];

  return (
    <div className="employee-detail-page">
      {/* Back button */}
      <Button
        className="back-btn"
        variant="text"
        icon={<ChevronLeftIcon />}
        onClick={() => navigate(-1)}
      >
        返回列表
      </Button>

      {/* Profile header card */}
      <Card bordered={false} className="profile-header-card">
        <div className="profile-header">
          <img
            className="profile-avatar"
            src={(employee as any).userface || '/avatars/cat.svg'}
            alt={employee.name}
          />
          <div className="profile-meta">
            <h1 className="profile-name">{employee.name}</h1>
            <p className="profile-sub">
              工号 {employee.workID} · {employee.department?.name || '-'} · {employee.position?.name || '-'}
            </p>
            {employee.jobLevel && (
              <p className="profile-level">{employee.jobLevel.name}</p>
            )}
          </div>
          <div className="profile-status">
            <Tag
              theme={employee.workState === '在职' ? 'success' : 'danger'}
              variant="light"
              size="large"
            >
              {employee.workState || '未知'}
            </Tag>
          </div>
        </div>
      </Card>

      {/* Info tabs */}
      <Card bordered={false} className="info-card">
        <Tabs defaultValue="basic">
          <TabPanel value="basic" label="基本信息">
            <div className="info-grid">
              {basicFields.map((field, idx) => (
                <div
                  className={`info-cell ${field.span ? 'span-full' : ''}`}
                  key={idx}
                >
                  <span className="info-label">{field.label}</span>
                  <span className="info-value">{field.value || '-'}</span>
                </div>
              ))}
            </div>
          </TabPanel>
          <TabPanel value="contract" label="合同信息">
            <div className="info-grid">
              {contractFields.map((field, idx) => (
                <div className="info-cell" key={idx}>
                  <span className="info-label">{field.label}</span>
                  <span className="info-value">
                    {field.label === '在职状态' ? (
                      <Tag
                        theme={field.value === '在职' ? 'success' : 'danger'}
                        variant="light"
                        size="small"
                      >
                        {field.value || '-'}
                      </Tag>
                    ) : (
                      field.value || '-'
                    )}
                  </span>
                </div>
              ))}
            </div>
          </TabPanel>
          <TabPanel value="education" label="教育信息">
            <div className="info-grid">
              {educationFields.map((field, idx) => (
                <div className="info-cell" key={idx}>
                  <span className="info-label">{field.label}</span>
                  <span className="info-value">{field.value || '-'}</span>
                </div>
              ))}
            </div>
          </TabPanel>
        </Tabs>
      </Card>
    </div>
  );
}
