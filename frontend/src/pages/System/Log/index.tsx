import { useState } from 'react';
import { Table, Card, DateRangePicker, Tag, Space } from 'tdesign-react';
import './index.css';

const mockLogs = [
  { id: 1, time: '2024-06-28 14:30:00', content: '管理员登录系统', operator: '系统管理员' },
  { id: 2, time: '2024-06-28 14:35:12', content: '导出员工数据', operator: '系统管理员' },
  { id: 3, time: '2024-06-28 15:01:33', content: '修改员工信息: 张三', operator: '系统管理员' },
  { id: 4, time: '2024-06-27 09:15:00', content: '批量导入员工数据(50条)', operator: '人事专员' },
  { id: 5, time: '2024-06-27 10:20:00', content: '新增员工: 李四', operator: '人事专员' },
  { id: 6, time: '2024-06-26 16:45:00', content: '删除员工: 王五', operator: '系统管理员' },
  { id: 7, time: '2024-06-26 11:20:00', content: '修改角色权限: 人事专员', operator: '系统管理员' },
  { id: 8, time: '2024-06-25 08:30:00', content: '系统启动', operator: '系统' },
];

export default function SystemLog() {
  const [dateRange, setDateRange] = useState<string[]>([]);

  const filteredLogs = dateRange.length === 2
    ? mockLogs.filter((log) => log.time >= dateRange[0] && log.time <= dateRange[1] + ' 23:59:59')
    : mockLogs;

  const columns = [
    { colKey: 'time', title: '操作时间', width: 180 },
    { colKey: 'content', title: '操作内容' },
    {
      colKey: 'operator',
      title: '操作人',
      width: 120,
      cell: ({ row }: { row: typeof mockLogs[0] }) => (
        <Tag variant="light" theme={row.operator === '系统管理员' ? 'primary' : 'warning'} size="small">
          {row.operator}
        </Tag>
      ),
    },
  ];

  return (
    <div className="system-log-page">
      <Card bordered={false} title="操作日志">
        <Space style={{ marginBottom: 16 }}>
          <DateRangePicker
            placeholder={['开始日期', '结束日期']}
            value={dateRange as [string, string]}
            onChange={(v) => setDateRange((v || []) as string[])}
            clearable
          />
        </Space>
        <Table
          data={filteredLogs}
          columns={columns}
          rowKey="id"
          stripe
          bordered
          size="small"
        />
      </Card>
    </div>
  );
}
