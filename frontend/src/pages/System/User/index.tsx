import { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Input,
  Button,
  Dialog,
  Tag,
  Avatar,
  Switch,
  Space,
  Popconfirm,
  MessagePlugin,
  Checkbox,
} from 'tdesign-react';
import { SearchIcon } from 'tdesign-icons-react';
import { getHrList, deleteHr, updateHrRoles, toggleHrEnabled, getAllRoles } from '../../../api/system';
import './index.css';

interface HrUser {
  id: number;
  name: string;
  username: string;
  phone?: string;
  userface?: string;
  enabled: boolean;
  roles?: { id: number; name: string; nameZh: string }[];
}

interface Role {
  id: number;
  name: string;
  nameZh: string;
}

const { CheckboxGroup } = Checkbox;

export default function SystemUser() {
  const [users, setUsers] = useState<HrUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [roleDialogVisible, setRoleDialogVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<HrUser | null>(null);
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const resp = await getHrList(keyword || undefined);
      if (resp) setUsers(resp as HrUser[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    getAllRoles().then((r) => {
      if (r) setRoles(r as Role[]);
    });
  }, []);

  const handleSearch = () => {
    loadUsers();
  };

  const handleDelete = async (id: number, name: string) => {
    await deleteHr(id);
    MessagePlugin.success(`已删除用户「${name}」`);
    loadUsers();
  };

  const handleToggleEnabled = async (user: HrUser) => {
    await toggleHrEnabled(user.id, !user.enabled);
    MessagePlugin.success(user.enabled ? '已禁用' : '已启用');
    loadUsers();
  };

  const openRoleDialog = (user: HrUser) => {
    setCurrentUser(user);
    setSelectedRoleIds(user.roles?.map((r) => r.id) || []);
    setRoleDialogVisible(true);
  };

  const handleRoleSubmit = async () => {
    if (currentUser) {
      await updateHrRoles(currentUser.id, selectedRoleIds);
      MessagePlugin.success('角色更新成功');
      setRoleDialogVisible(false);
      loadUsers();
    }
  };

  const columns = [
    {
      colKey: 'userface',
      title: '头像',
      width: 60,
      cell: ({ row }: { row: HrUser }) => (
        <Avatar size="small" image={row.userface || '/avatars/cat.svg'} />
      ),
    },
    { colKey: 'name', title: '姓名', width: 100 },
    { colKey: 'username', title: '用户名', width: 120 },
    { colKey: 'phone', title: '电话', width: 140 },
    {
      colKey: 'roles',
      title: '角色',
      width: 200,
      cell: ({ row }: { row: HrUser }) => (
        <Space size="small" breakLine>
          {row.roles?.map((r) => (
            <Tag key={r.id} theme="primary" variant="light" size="small">
              {r.nameZh}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      colKey: 'enabled',
      title: '状态',
      width: 80,
      cell: ({ row }: { row: HrUser }) => (
        <Tag theme={row.enabled ? 'success' : 'danger'} variant="light" size="small">
          {row.enabled ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      colKey: 'operation',
      title: '操作',
      width: 220,
      cell: ({ row }: { row: HrUser }) => (
        <Space size="small">
          <Button variant="text" theme="primary" size="small" onClick={() => openRoleDialog(row)}>
            编辑角色
          </Button>
          <Switch size="small" value={row.enabled} onChange={() => handleToggleEnabled(row)} />
          <Popconfirm content={`确定删除「${row.name}」吗？`} onConfirm={() => handleDelete(row.id, row.name)}>
            <Button variant="text" theme="danger" size="small">
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="system-user-page">
      <Card bordered={false}>
        <div className="search-bar">
          <Space>
            <Input
              prefixIcon={<SearchIcon />}
              placeholder="搜索用户姓名"
              value={keyword}
              onChange={(v) => setKeyword(v as string)}
              onEnter={handleSearch}
              style={{ width: 240 }}
            />
            <Button theme="primary" onClick={handleSearch}>
              搜索
            </Button>
          </Space>
        </div>
        <Table
          data={users}
          columns={columns}
          rowKey="id"
          loading={loading}
          stripe
          bordered
          size="small"
          style={{ marginTop: 16 }}
        />
      </Card>

      {/* Role edit dialog */}
      <Dialog
        header="编辑角色"
        visible={roleDialogVisible}
        onClose={() => setRoleDialogVisible(false)}
        onConfirm={handleRoleSubmit}
        confirmBtn={{ content: '确定', theme: 'primary' }}
        cancelBtn={{ content: '取消' }}
      >
        <p style={{ marginBottom: 12 }}>
          为用户 <strong>{currentUser?.name}</strong> 分配角色：
        </p>
        <CheckboxGroup
          value={selectedRoleIds}
          onChange={(val) => setSelectedRoleIds(val as number[])}
          options={roles.map((r) => ({ value: r.id, label: r.nameZh }))}
        />
      </Dialog>
    </div>
  );
}
