import { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Tag, Loading } from 'tdesign-react';
import { UserIcon, CalendarIcon, SwapIcon, CheckCircleIcon } from 'tdesign-icons-react';
import ReactECharts from 'echarts-for-react';
import { getOverview, getDepartmentDist, getEducationDist } from '../../../api/statistics';
import './index.css';

const recentChanges = [
  { id: 1, date: '2024-06-28', name: '王建国', type: '入职', department: '信贷部' },
  { id: 2, date: '2024-06-27', name: '李明', type: '调岗', department: '风控部 → 运营部' },
  { id: 3, date: '2024-06-26', name: '张丽', type: '入职', department: '科技部' },
  { id: 4, date: '2024-06-25', name: '陈伟', type: '离职', department: '市场部' },
  { id: 5, date: '2024-06-24', name: '刘芳', type: '调岗', department: '人力部 → 运营部' },
];

const tableColumns = [
  { colKey: 'date', title: '日期', width: 120 },
  { colKey: 'name', title: '员工', width: 100 },
  {
    colKey: 'type',
    title: '类型',
    width: 80,
    cell: ({ row }: { row: typeof recentChanges[0] }) => {
      const themeMap: Record<string, 'success' | 'danger' | 'warning'> = {
        '入职': 'success',
        '离职': 'danger',
        '调岗': 'warning',
      };
      return <Tag theme={themeMap[row.type] || 'default'} variant="light">{row.type}</Tag>;
    },
  },
  { colKey: 'department', title: '部门', width: 200 },
];

export default function LeaderOverview() {
  const [loading, setLoading] = useState(true);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [deptData, setDeptData] = useState<{ name: string; value: number }[]>([]);
  const [eduData, setEduData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getOverview(),
      getDepartmentDist(),
      getEducationDist(),
    ]).then(([overview, dept, edu]) => {
      if (overview) setTotalEmployees(overview.totalEmployees || 0);
      if (dept) setDeptData(dept as any[]);
      if (edu) setEduData(edu as any[]);
    }).finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: '团队人数', value: totalEmployees.toLocaleString(), icon: <UserIcon size="24px" />, color: '#006b3f' },
    { label: '平均司龄', value: '6.8年', icon: <CalendarIcon size="24px" />, color: '#1890ff' },
    { label: '本月变动', value: '5', icon: <SwapIcon size="24px" />, color: '#c9a96e' },
    { label: '优秀员工', value: '128', icon: <CheckCircleIcon size="24px" />, color: '#52c41a' },
  ];

  const pieOption = {
    tooltip: { trigger: 'item' as const, formatter: '{b}: {c}人 ({d}%)' },
    legend: { bottom: 0, left: 'center' },
    color: ['#006b3f', '#00a651', '#c9a96e', '#1890ff', '#722ed1', '#d9d9d9'],
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
        label: { show: false },
        emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' } },
        data: deptData,
      },
    ],
  };

  const sortedEdu = [...eduData].sort((a, b) => Number(a.value) - Number(b.value));
  const barOption = {
    tooltip: { trigger: 'axis' as const },
    xAxis: { type: 'value' as const },
    yAxis: {
      type: 'category' as const,
      data: sortedEdu.map((d) => d.name),
    },
    grid: { left: 80, right: 30, top: 20, bottom: 30 },
    series: [
      {
        type: 'bar',
        data: sortedEdu.map((d) => d.value),
        itemStyle: { color: '#006b3f', borderRadius: [0, 4, 4, 0] },
        barWidth: 24,
      },
    ],
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 100 }}><Loading /></div>;
  }

  return (
    <div className="leader-overview">
      {/* Stats */}
      <Row gutter={16}>
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

      {/* Charts */}
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={6}>
          <Card bordered={false} title="部门人员分布">
            <ReactECharts option={pieOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} title="学历分布">
            <ReactECharts option={barOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      {/* Recent changes */}
      <Card bordered={false} title="近期人事变动" style={{ marginTop: 16 }}>
        <Table
          data={recentChanges}
          columns={tableColumns}
          rowKey="id"
          size="small"
          bordered
          stripe
        />
      </Card>
    </div>
  );
}
