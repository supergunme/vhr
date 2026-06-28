import { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Space, Loading } from 'tdesign-react';
import { UserIcon, EditIcon, UploadIcon, ChartIcon, RootListIcon, CalendarIcon } from 'tdesign-icons-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import { getEmployeeList } from '../../api/employee';
import './index.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useAppStore((s) => s.currentUser);
  const [totalEmployees, setTotalEmployees] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getEmployeeList(1, 1).then((resp) => {
      if (resp) setTotalEmployees(resp.total || 0);
    }).finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: '员工总数', value: totalEmployees.toLocaleString(), icon: <UserIcon size="24px" />, color: '#006b3f' },
    { label: '部门数量', value: '105', icon: <RootListIcon size="24px" />, color: '#1890ff' },
    { label: '本月入职', value: '12', icon: <CalendarIcon size="24px" />, color: '#c9a96e' },
    { label: '待处理事项', value: '3', icon: <EditIcon size="24px" />, color: '#f5222d' },
  ];

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 100 }}><Loading /></div>;
  }

  return (
    <div className="dashboard-page">
      {/* Welcome card */}
      <Card bordered={false} className="welcome-card">
        <div className="welcome-content">
          <div>
            <h2 className="welcome-title">欢迎回来，{currentUser?.name || '管理员'}</h2>
            <p className="welcome-desc">黑龙江省农村信用社联合社 · 员工信息同步平台</p>
          </div>
          <div className="welcome-date">
            {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
          </div>
        </div>
      </Card>

      {/* Stats */}
      <Row gutter={16} style={{ marginTop: 16 }}>
        {stats.map((item, idx) => (
          <Col span={3} key={idx}>
            <Card bordered={false} className="stat-card">
              <div className="stat-content">
                <div className="stat-icon" style={{ backgroundColor: item.color + '12', color: item.color }}>
                  {item.icon}
                </div>
                <div className="stat-info">
                  <div className="stat-value">{item.value}</div>
                  <div className="stat-label">{item.label}</div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Quick actions */}
      <Card bordered={false} title="快捷操作" style={{ marginTop: 16 }}>
        <Space size="large">
          <Button theme="primary" icon={<EditIcon />} onClick={() => navigate('/app/employee/form')}>
            录入员工
          </Button>
          <Button variant="outline" icon={<UploadIcon />} onClick={() => navigate('/app/employee/import')}>
            批量导入
          </Button>
          <Button variant="outline" icon={<UserIcon />} onClick={() => navigate('/app/employee/list')}>
            员工列表
          </Button>
          <Button variant="outline" icon={<ChartIcon />} onClick={() => navigate('/app/analysis/radar')}>
            数据分析
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default Dashboard;
