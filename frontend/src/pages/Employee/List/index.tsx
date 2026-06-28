import { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  Tag,
  Space,
  MessagePlugin,
  Popconfirm,
  Card,
  Row,
  Col,
  DateRangePicker,
} from 'tdesign-react';
import { SearchIcon, AddIcon, DownloadIcon, UploadIcon } from 'tdesign-icons-react';
import { useNavigate } from 'react-router-dom';
import {
  getEmployeeList,
  deleteEmployee,
  exportEmployees,
  getAllNations,
  getAllPoliticsStatus,
  getAllJobLevels,
  getAllPositions,
  getAllDepartments,
} from '../../../api/employee';
import type { Employee, EmployeeFilters, Nation, PoliticsStatus, JobLevel, Position, Department } from '../../../types';
import './index.css';

export default function EmployeeList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<EmployeeFilters>({});

  // Dropdown data
  const [nations, setNations] = useState<Nation[]>([]);
  const [politicsStatuses, setPoliticsStatuses] = useState<PoliticsStatus[]>([]);
  const [jobLevels, setJobLevels] = useState<JobLevel[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const loadEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const params: EmployeeFilters = { ...filters };
      if (keyword) params.name = keyword;
      const resp = await getEmployeeList(page, size, params);
      if (resp) {
        setEmployees((resp.data || []) as Employee[]);
        setTotal(resp.total || 0);
      }
    } catch {
      // error handled by interceptor
    } finally {
      setLoading(false);
    }
  }, [page, size, keyword, filters]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  useEffect(() => {
    // Load dropdown data with sessionStorage caching
    const loadCached = async (key: string, fetchFn: () => Promise<any>, setter: (d: any) => void) => {
      const cached = sessionStorage.getItem(key);
      if (cached) {
        setter(JSON.parse(cached));
      } else {
        const d = await fetchFn();
        if (d) {
          setter(d);
          sessionStorage.setItem(key, JSON.stringify(d));
        }
      }
    };
    loadCached('cache_nations', getAllNations, (d) => setNations(d as Nation[]));
    loadCached('cache_politics', getAllPoliticsStatus, (d) => setPoliticsStatuses(d as PoliticsStatus[]));
    loadCached('cache_joblevels', getAllJobLevels, (d) => setJobLevels(d as JobLevel[]));
    loadCached('cache_positions', getAllPositions, (d) => setPositions(d as Position[]));
    loadCached('cache_departments', getAllDepartments, (d) => setDepartments(d as Department[]));
  }, []);

  const handleDelete = async (id: number, name: string) => {
    try {
      await deleteEmployee(id);
      MessagePlugin.success(`已删除员工「${name}」`);
      loadEmployees();
    } catch {
      // handled by interceptor
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadEmployees();
  };

  const handleReset = () => {
    setKeyword('');
    setFilters({});
    setPage(1);
  };

  const columns = [
    { colKey: 'name', title: '姓名', width: 90, fixed: 'left' as const },
    { colKey: 'workID', title: '工号', width: 100 },
    { colKey: 'gender', title: '性别', width: 60 },
    {
      colKey: 'department',
      title: '部门',
      width: 120,
      cell: ({ row }: { row: Employee }) => row.department?.name || '-',
    },
    {
      colKey: 'position',
      title: '职位',
      width: 100,
      cell: ({ row }: { row: Employee }) => row.position?.name || '-',
    },
    {
      colKey: 'jobLevel',
      title: '职称',
      width: 100,
      cell: ({ row }: { row: Employee }) => row.jobLevel?.name || '-',
    },
    { colKey: 'phone', title: '电话', width: 130 },
    {
      colKey: 'workState',
      title: '状态',
      width: 80,
      cell: ({ row }: { row: Employee }) => (
        <Tag theme={row.workState === '在职' ? 'success' : 'danger'} variant="light">
          {row.workState}
        </Tag>
      ),
    },
    { colKey: 'email', title: '邮箱', width: 180, ellipsis: true },
    {
      colKey: 'beginDate',
      title: '入职日期',
      width: 110,
      cell: ({ row }: { row: Employee }) => row.beginDate?.substring(0, 10) || '-',
    },
    {
      colKey: 'operation',
      title: '操作',
      width: 180,
      fixed: 'right' as const,
      cell: ({ row }: { row: Employee }) => (
        <Space>
          <Button
            theme="primary"
            variant="text"
            size="small"
            onClick={() => navigate(`/app/employee/detail/${row.id}`)}
          >
            查看
          </Button>
          <Button
            theme="default"
            variant="text"
            size="small"
            onClick={() => navigate(`/app/employee/form?id=${row.id}`)}
          >
            编辑
          </Button>
          <Popconfirm
            content={`确定删除员工「${row.name}」吗？`}
            onConfirm={() => handleDelete(row.id, row.name)}
          >
            <Button theme="danger" variant="text" size="small">
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const flattenDepts = (depts: Department[]): { label: string; value: number }[] => {
    const result: { label: string; value: number }[] = [];
    const traverse = (list: Department[], prefix = '') => {
      list.forEach((d) => {
        result.push({ label: prefix + d.name, value: d.id });
        if (d.children?.length) traverse(d.children, prefix + d.name + ' / ');
      });
    };
    traverse(depts);
    return result;
  };

  return (
    <div className="employee-list-page">
      {/* Header */}
      <Card bordered={false} className="search-card">
        <div className="search-bar">
          <Space>
            <Input
              prefixIcon={<SearchIcon />}
              placeholder="搜索员工姓名"
              value={keyword}
              onChange={(v) => setKeyword(v as string)}
              onEnter={handleSearch}
              style={{ width: 240 }}
            />
            <Button theme="primary" onClick={handleSearch}>
              搜索
            </Button>
            <Button variant="outline" onClick={() => setShowFilter(!showFilter)}>
              {showFilter ? '收起筛选' : '高级筛选'}
            </Button>
            <Button variant="outline" onClick={handleReset}>
              重置
            </Button>
          </Space>
          <Space>
            <Button theme="primary" icon={<AddIcon />} onClick={() => navigate('/app/employee/form')}>
              录入员工
            </Button>
            <Button variant="outline" icon={<UploadIcon />} onClick={() => navigate('/app/employee/import')}>
              批量导入
            </Button>
            <Button variant="outline" icon={<DownloadIcon />} onClick={exportEmployees}>
              导出Excel
            </Button>
          </Space>
        </div>

        {/* Advanced filters */}
        {showFilter && (
          <div className="filter-panel">
            <Row gutter={[16, 12]}>
              <Col span={3}>
                <Select
                  placeholder="民族"
                  clearable
                  value={filters.nationId}
                  onChange={(v) => setFilters({ ...filters, nationId: v as number })}
                  options={nations.map((n) => ({ label: n.name, value: n.id }))}
                />
              </Col>
              <Col span={3}>
                <Select
                  placeholder="政治面貌"
                  clearable
                  value={filters.politicId}
                  onChange={(v) => setFilters({ ...filters, politicId: v as number })}
                  options={politicsStatuses.map((p) => ({ label: p.name, value: p.id }))}
                />
              </Col>
              <Col span={3}>
                <Select
                  placeholder="职位"
                  clearable
                  value={filters.posId}
                  onChange={(v) => setFilters({ ...filters, posId: v as number })}
                  options={positions.map((p) => ({ label: p.name, value: p.id }))}
                />
              </Col>
              <Col span={3}>
                <Select
                  placeholder="职称"
                  clearable
                  value={filters.jobLevelId}
                  onChange={(v) => setFilters({ ...filters, jobLevelId: v as number })}
                  options={jobLevels.map((j) => ({ label: j.name, value: j.id }))}
                />
              </Col>
              <Col span={4}>
                <Select
                  placeholder="所属部门"
                  clearable
                  filterable
                  value={filters.departmentId}
                  onChange={(v) => setFilters({ ...filters, departmentId: v as number })}
                  options={flattenDepts(departments)}
                />
              </Col>
              <Col span={4}>
                <Select
                  placeholder="聘用形式"
                  clearable
                  value={filters.engageForm}
                  onChange={(v) => setFilters({ ...filters, engageForm: v as string })}
                  options={[
                    { label: '劳动合同', value: '劳动合同' },
                    { label: '劳务合同', value: '劳务合同' },
                  ]}
                />
              </Col>
              <Col span={4}>
                <DateRangePicker
                  placeholder={['入职起始', '入职截止']}
                  value={filters.beginDateScope as [string, string]}
                  onChange={(v) => setFilters({ ...filters, beginDateScope: v as string[] })}
                />
              </Col>
            </Row>
          </div>
        )}
      </Card>

      {/* Table */}
      <Card bordered={false} style={{ marginTop: 16 }}>
        <Table
          data={employees}
          columns={columns}
          rowKey="id"
          loading={loading}
          stripe
          bordered
          size="small"
          tableLayout="fixed"
          pagination={{
            current: page,
            pageSize: size,
            total,
            showJumper: true,
            pageSizeOptions: [10, 20, 50],
            onChange: ({ current, pageSize }) => {
              setPage(current);
              setSize(pageSize);
            },
          }}
        />
      </Card>
    </div>
  );
}
