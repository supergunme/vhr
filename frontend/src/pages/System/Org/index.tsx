import { useState, useEffect } from 'react';
import {
  Card,
  Tabs,
  Table,
  Button,
  Input,
  Dialog,
  MessagePlugin,
  Popconfirm,
  Space,
  Tag,
  Switch,
  Tree,
} from 'tdesign-react';
import { AddIcon } from 'tdesign-icons-react';
import {
  getDepartments,
  addDepartment,
  deleteDepartment,
  getPositions,
  addPosition,
  updatePosition,
  deletePosition,
  getJobLevels,
  addJobLevel,
  updateJobLevel,
  deleteJobLevel,
} from '../../../api/system';
import './index.css';

const { TabPanel } = Tabs;

interface DeptNode {
  id: number;
  name: string;
  parentId: number;
  enabled: boolean;
  isParent: boolean;
  children?: DeptNode[];
}

export default function SystemOrg() {
  // Department state
  const [departments, setDepartments] = useState<DeptNode[]>([]);
  const [deptLoading, setDeptLoading] = useState(false);
  const [addDeptVisible, setAddDeptVisible] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);

  // Position state
  const [positions, setPositions] = useState<any[]>([]);
  const [posLoading, setPosLoading] = useState(false);
  const [posDialogVisible, setPosDialogVisible] = useState(false);
  const [editingPos, setEditingPos] = useState<any>({ name: '', enabled: true });

  // Job level state
  const [jobLevels, setJobLevels] = useState<any[]>([]);
  const [jlLoading, setJlLoading] = useState(false);
  const [jlDialogVisible, setJlDialogVisible] = useState(false);
  const [editingJl, setEditingJl] = useState<any>({ name: '', titleLevel: '', enabled: true });

  useEffect(() => {
    loadDepartments();
    loadPositions();
    loadJobLevels();
  }, []);

  const loadDepartments = async () => {
    setDeptLoading(true);
    try {
      const data = await getDepartments();
      if (data) setDepartments(data);
    } finally {
      setDeptLoading(false);
    }
  };

  const loadPositions = async () => {
    setPosLoading(true);
    try {
      const data = await getPositions();
      if (data) setPositions(data);
    } finally {
      setPosLoading(false);
    }
  };

  const loadJobLevels = async () => {
    setJlLoading(true);
    try {
      const data = await getJobLevels();
      if (data) setJobLevels(data);
    } finally {
      setJlLoading(false);
    }
  };

  // Department handlers
  const handleAddDept = async () => {
    if (!newDeptName.trim()) {
      MessagePlugin.warning('请输入部门名称');
      return;
    }
    await addDepartment({ name: newDeptName, parentId: selectedParentId || -1 });
    MessagePlugin.success('添加成功');
    setAddDeptVisible(false);
    setNewDeptName('');
    loadDepartments();
  };

  const handleDeleteDept = async (id: number) => {
    await deleteDepartment(id);
    MessagePlugin.success('删除成功');
    loadDepartments();
  };

  // Convert department tree to TDesign Tree data format
  const convertTreeData = (nodes: DeptNode[]): any[] => {
    return nodes.map((node) => ({
      value: node.id,
      label: node.name,
      children: node.children ? convertTreeData(node.children) : [],
    }));
  };

  // Position handlers
  const handleAddPos = () => {
    setEditingPos({ name: '', enabled: true });
    setPosDialogVisible(true);
  };

  const handleEditPos = (row: any) => {
    setEditingPos({ ...row });
    setPosDialogVisible(true);
  };

  const handleSavePos = async () => {
    if (!editingPos.name.trim()) {
      MessagePlugin.warning('请输入职位名称');
      return;
    }
    if (editingPos.id) {
      await updatePosition(editingPos);
    } else {
      await addPosition(editingPos);
    }
    MessagePlugin.success('保存成功');
    setPosDialogVisible(false);
    loadPositions();
  };

  const handleDeletePos = async (id: number) => {
    await deletePosition(id);
    MessagePlugin.success('删除成功');
    loadPositions();
  };

  // Job level handlers
  const handleAddJl = () => {
    setEditingJl({ name: '', titleLevel: '', enabled: true });
    setJlDialogVisible(true);
  };

  const handleEditJl = (row: any) => {
    setEditingJl({ ...row });
    setJlDialogVisible(true);
  };

  const handleSaveJl = async () => {
    if (!editingJl.name.trim()) {
      MessagePlugin.warning('请输入职称名称');
      return;
    }
    if (editingJl.id) {
      await updateJobLevel(editingJl);
    } else {
      await addJobLevel(editingJl);
    }
    MessagePlugin.success('保存成功');
    setJlDialogVisible(false);
    loadJobLevels();
  };

  const handleDeleteJl = async (id: number) => {
    await deleteJobLevel(id);
    MessagePlugin.success('删除成功');
    loadJobLevels();
  };

  const posColumns = [
    { colKey: 'name', title: '名称', width: 200 },
    { colKey: 'createDate', title: '创建日期', width: 150, cell: ({ row }: any) => row.createDate?.substring(0, 10) || '-' },
    {
      colKey: 'enabled',
      title: '是否启用',
      width: 100,
      cell: ({ row }: any) => (
        <Tag theme={row.enabled ? 'success' : 'default'} variant="light">
          {row.enabled ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      colKey: 'operation',
      title: '操作',
      width: 150,
      cell: ({ row }: any) => (
        <Space>
          <Button variant="text" theme="primary" size="small" onClick={() => handleEditPos(row)}>编辑</Button>
          <Popconfirm content="确定删除？" onConfirm={() => handleDeletePos(row.id)}>
            <Button variant="text" theme="danger" size="small">删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const jlColumns = [
    { colKey: 'name', title: '名称', width: 200 },
    { colKey: 'titleLevel', title: '级别', width: 120 },
    { colKey: 'createDate', title: '创建日期', width: 150, cell: ({ row }: any) => row.createDate?.substring(0, 10) || '-' },
    {
      colKey: 'enabled',
      title: '是否启用',
      width: 100,
      cell: ({ row }: any) => (
        <Tag theme={row.enabled ? 'success' : 'default'} variant="light">
          {row.enabled ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      colKey: 'operation',
      title: '操作',
      width: 150,
      cell: ({ row }: any) => (
        <Space>
          <Button variant="text" theme="primary" size="small" onClick={() => handleEditJl(row)}>编辑</Button>
          <Popconfirm content="确定删除？" onConfirm={() => handleDeleteJl(row.id)}>
            <Button variant="text" theme="danger" size="small">删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="org-page">
      <Card bordered={false}>
        <Tabs defaultValue="dept">
          <TabPanel value="dept" label="部门管理">
            <div className="tab-content">
              <div className="tab-toolbar">
                <Button theme="primary" icon={<AddIcon />} onClick={() => setAddDeptVisible(true)}>
                  添加部门
                </Button>
              </div>
              <div className="dept-tree-container">
                {departments.length > 0 ? (
                  <Tree
                    data={convertTreeData(departments)}
                    activable
                    line
                    expandAll
                    label={({ node }: any) => (
                      <div className="dept-tree-node">
                        <span>{node.label}</span>
                        <Popconfirm content={`确定删除「${node.label}」？`} onConfirm={() => handleDeleteDept(node.value)}>
                          <Button variant="text" theme="danger" size="small">删除</Button>
                        </Popconfirm>
                      </div>
                    )}
                    onActive={(actived: any) => {
                      if (actived.length > 0) setSelectedParentId(actived[0]);
                    }}
                  />
                ) : (
                  <div style={{ color: '#999', textAlign: 'center', padding: 40 }}>
                    {deptLoading ? '加载中...' : '暂无部门数据'}
                  </div>
                )}
              </div>
            </div>
          </TabPanel>
          <TabPanel value="pos" label="职位/职级管理">
            <div className="tab-content">
              <h4 style={{ margin: '0 0 12px' }}>职位列表</h4>
              <div className="tab-toolbar">
                <Button theme="primary" icon={<AddIcon />} size="small" onClick={handleAddPos}>
                  添加职位
                </Button>
              </div>
              <Table data={positions} columns={posColumns} rowKey="id" loading={posLoading} stripe size="small" bordered />

              <h4 style={{ margin: '24px 0 12px' }}>职级列表</h4>
              <div className="tab-toolbar">
                <Button theme="primary" icon={<AddIcon />} size="small" onClick={handleAddJl}>
                  添加职级
                </Button>
              </div>
              <Table data={jobLevels} columns={jlColumns} rowKey="id" loading={jlLoading} stripe size="small" bordered />
            </div>
          </TabPanel>
        </Tabs>
      </Card>

      {/* Add Department Dialog */}
      <Dialog
        visible={addDeptVisible}
        header="添加部门"
        onClose={() => setAddDeptVisible(false)}
        onConfirm={handleAddDept}
        confirmBtn="确定"
        cancelBtn="取消"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input
            placeholder="部门名称"
            value={newDeptName}
            onChange={(v) => setNewDeptName(v as string)}
          />
          <div style={{ fontSize: 12, color: '#999' }}>
            {selectedParentId ? `将作为选中部门的子部门添加（父ID: ${selectedParentId}）` : '将添加为顶级部门'}
          </div>
        </div>
      </Dialog>

      {/* Position Dialog */}
      <Dialog
        visible={posDialogVisible}
        header={editingPos.id ? '编辑职位' : '添加职位'}
        onClose={() => setPosDialogVisible(false)}
        onConfirm={handleSavePos}
        confirmBtn="确定"
        cancelBtn="取消"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input
            placeholder="职位名称"
            value={editingPos.name}
            onChange={(v) => setEditingPos({ ...editingPos, name: v })}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>启用:</span>
            <Switch
              value={editingPos.enabled}
              onChange={(v) => setEditingPos({ ...editingPos, enabled: v })}
            />
          </div>
        </div>
      </Dialog>

      {/* Job Level Dialog */}
      <Dialog
        visible={jlDialogVisible}
        header={editingJl.id ? '编辑职级' : '添加职级'}
        onClose={() => setJlDialogVisible(false)}
        onConfirm={handleSaveJl}
        confirmBtn="确定"
        cancelBtn="取消"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input
            placeholder="职级名称"
            value={editingJl.name}
            onChange={(v) => setEditingJl({ ...editingJl, name: v })}
          />
          <Input
            placeholder="级别（如：正高级、副高级、中级等）"
            value={editingJl.titleLevel}
            onChange={(v) => setEditingJl({ ...editingJl, titleLevel: v })}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>启用:</span>
            <Switch
              value={editingJl.enabled}
              onChange={(v) => setEditingJl({ ...editingJl, enabled: v })}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
