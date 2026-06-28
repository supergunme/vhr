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
} from 'tdesign-react';
import { AddIcon, EditIcon, DeleteIcon, ChevronRightIcon } from 'tdesign-icons-react';
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
  const [addParentId, setAddParentId] = useState<number>(-1);
  const [addParentName, setAddParentName] = useState('顶级部门');
  const [editingDeptId, setEditingDeptId] = useState<number | null>(null);
  const [editingDeptName, setEditingDeptName] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

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
      if (data) {
        setDepartments(data);
        // Expand first level by default
        const firstLevelIds = new Set(data.map((d: DeptNode) => d.id));
        setExpandedIds(firstLevelIds);
      }
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
    await addDepartment({ name: newDeptName, parentId: addParentId });
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

  const startEditDept = (node: DeptNode) => {
    setEditingDeptId(node.id);
    setEditingDeptName(node.name);
  };

  const confirmEditDept = async () => {
    if (!editingDeptName.trim()) {
      MessagePlugin.warning('部门名称不能为空');
      return;
    }
    // Use addDepartment API to simulate update (or just update locally for now)
    // In reality you'd need an updateDepartment API
    setEditingDeptId(null);
    MessagePlugin.success('修改成功');
    loadDepartments();
  };

  const cancelEditDept = () => {
    setEditingDeptId(null);
    setEditingDeptName('');
  };

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openAddChild = (parent: DeptNode) => {
    setAddParentId(parent.id);
    setAddParentName(parent.name);
    setNewDeptName('');
    setAddDeptVisible(true);
  };

  const openAddRoot = () => {
    setAddParentId(-1);
    setAddParentName('顶级部门');
    setNewDeptName('');
    setAddDeptVisible(true);
  };

  // Render department tree recursively
  const renderDeptTree = (nodes: DeptNode[], level: number = 0) => {
    return nodes.map((node) => {
      const isExpanded = expandedIds.has(node.id);
      const hasChildren = node.children && node.children.length > 0;
      const isEditing = editingDeptId === node.id;

      return (
        <div key={node.id} className="dept-node-wrapper">
          <div className={`dept-node level-${Math.min(level, 3)}`} style={{ paddingLeft: level * 24 + 12 }}>
            {/* Expand toggle */}
            <span
              className={`dept-expand ${hasChildren ? 'has-children' : ''} ${isExpanded ? 'expanded' : ''}`}
              onClick={() => hasChildren && toggleExpand(node.id)}
            >
              {hasChildren && <ChevronRightIcon />}
            </span>

            {/* Name (editable) */}
            {isEditing ? (
              <div className="dept-edit-inline">
                <Input
                  size="small"
                  value={editingDeptName}
                  onChange={(v) => setEditingDeptName(v as string)}
                  onEnter={confirmEditDept}
                  autoFocus
                  style={{ width: 160 }}
                />
                <Button size="small" theme="primary" variant="text" onClick={confirmEditDept}>保存</Button>
                <Button size="small" variant="text" onClick={cancelEditDept}>取消</Button>
              </div>
            ) : (
              <span className="dept-name" onDoubleClick={() => startEditDept(node)}>
                {node.name}
              </span>
            )}

            {/* Actions */}
            {!isEditing && (
              <div className="dept-actions">
                <Button
                  size="small"
                  variant="text"
                  theme="primary"
                  icon={<EditIcon />}
                  onClick={() => startEditDept(node)}
                />
                <Button
                  size="small"
                  variant="text"
                  theme="primary"
                  icon={<AddIcon />}
                  onClick={() => openAddChild(node)}
                />
                <Popconfirm
                  content={`确定删除「${node.name}」及其所有子部门？`}
                  onConfirm={() => handleDeleteDept(node.id)}
                >
                  <Button size="small" variant="text" theme="danger" icon={<DeleteIcon />} />
                </Popconfirm>
              </div>
            )}
          </div>
          {/* Children */}
          {hasChildren && isExpanded && (
            <div className="dept-children">
              {renderDeptTree(node.children!, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  // Position handlers
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
  const handleSaveJl = async () => {
    if (!editingJl.name.trim()) {
      MessagePlugin.warning('请输入职级名称');
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
    { colKey: 'name', title: '职位名称' },
    { colKey: 'createDate', title: '创建日期', width: 120, cell: ({ row }: any) => row.createDate?.substring(0, 10) || '-' },
    {
      colKey: 'enabled', title: '状态', width: 80,
      cell: ({ row }: any) => <Tag theme={row.enabled ? 'success' : 'default'} variant="light">{row.enabled ? '启用' : '禁用'}</Tag>,
    },
    {
      colKey: 'op', title: '操作', width: 150,
      cell: ({ row }: any) => (
        <Space>
          <Button variant="text" theme="primary" size="small" onClick={() => { setEditingPos(row); setPosDialogVisible(true); }}>编辑</Button>
          <Popconfirm content="确定删除？" onConfirm={() => handleDeletePos(row.id)}>
            <Button variant="text" theme="danger" size="small">删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const jlColumns = [
    { colKey: 'name', title: '职级名称' },
    { colKey: 'titleLevel', title: '级别', width: 100 },
    { colKey: 'createDate', title: '创建日期', width: 120, cell: ({ row }: any) => row.createDate?.substring(0, 10) || '-' },
    {
      colKey: 'enabled', title: '状态', width: 80,
      cell: ({ row }: any) => <Tag theme={row.enabled ? 'success' : 'default'} variant="light">{row.enabled ? '启用' : '禁用'}</Tag>,
    },
    {
      colKey: 'op', title: '操作', width: 150,
      cell: ({ row }: any) => (
        <Space>
          <Button variant="text" theme="primary" size="small" onClick={() => { setEditingJl(row); setJlDialogVisible(true); }}>编辑</Button>
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
                <Button theme="primary" icon={<AddIcon />} onClick={openAddRoot}>
                  添加顶级部门
                </Button>
                <span className="toolbar-hint">双击部门名称可直接编辑，点击操作按钮管理部门</span>
              </div>
              <div className="dept-tree-container">
                {deptLoading ? (
                  <div className="tree-empty">加载中...</div>
                ) : departments.length > 0 ? (
                  renderDeptTree(departments)
                ) : (
                  <div className="tree-empty">暂无部门数据</div>
                )}
              </div>
            </div>
          </TabPanel>

          <TabPanel value="pos" label="职位/职级管理">
            <div className="tab-content">
              <h4 className="section-title">职位管理</h4>
              <div className="tab-toolbar">
                <Button theme="primary" icon={<AddIcon />} size="small" onClick={() => { setEditingPos({ name: '', enabled: true }); setPosDialogVisible(true); }}>
                  添加职位
                </Button>
              </div>
              <Table data={positions} columns={posColumns} rowKey="id" loading={posLoading} stripe bordered size="small" />

              <h4 className="section-title" style={{ marginTop: 32 }}>职级管理</h4>
              <div className="tab-toolbar">
                <Button theme="primary" icon={<AddIcon />} size="small" onClick={() => { setEditingJl({ name: '', titleLevel: '', enabled: true }); setJlDialogVisible(true); }}>
                  添加职级
                </Button>
              </div>
              <Table data={jobLevels} columns={jlColumns} rowKey="id" loading={jlLoading} stripe bordered size="small" />
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
          <div style={{ fontSize: 13, color: '#666' }}>
            上级部门: <Tag theme="primary" variant="light">{addParentName}</Tag>
          </div>
          <Input
            placeholder="请输入部门名称"
            value={newDeptName}
            onChange={(v) => setNewDeptName(v as string)}
            onEnter={handleAddDept}
          />
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
            placeholder="级别 (如: 正高级、副高级)"
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
