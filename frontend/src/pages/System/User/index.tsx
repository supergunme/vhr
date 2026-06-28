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
  Form,
} from 'tdesign-react';
import { SearchIcon, AddIcon } from 'tdesign-icons-react';
import { getHrList, deleteHr, updateHrRoles, toggleHrEnabled, getAllRoles, addHr, updateHr } from '../../../api/system';
import { ANIMAL_AVATARS } from '../../../utils/avatar';
import './index.css';

interface HrUser {
  id: number;
  name: string;
  username: string;
  phone?: string;
  address?: string;
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

  // Role dialog
  const [roleDialogVisible, setRoleDialogVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<HrUser | null>(null);
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);

  // Add/Edit dialog
  const [userDialogVisible, setUserDialogVisible] = useState(false);
  const [userDialogTitle, setUserDialogTitle] = useState('新增管理员');
  const [userForm, setUserForm] = useState<{ id?: number; name: string; username: string; password: string; phone: string }>({
    name: '',
    username: '',
    password: '',
    phone: '',
  });

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

  const handleSearch = () => loadUsers();

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

  // Role dialog
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

  // Add user dialog
  const openAddDialog = () => {
    setUserDialogTitle('新增管理员');
    setUserForm({ name: '', username: '', password: '', phone: '' });
    setUserDialogVisible(true);
  };

  // Edit user dialog
  const openEditDialog = (user: HrUser) => {
    setUserDialogTitle('编辑管理员');
    setUserForm({ id: user.id, name: user.name, username: user.username, password: '', phone: user.phone || '' });
    setUserDialogVisible(true);
  };

  const handleUserSubmit = async () => {
    if (!userForm.name.trim() || !userForm.username.trim()) {
      MessagePlugin.warning('姓名和用户名不能为空');
      return;
    }
    try {
      if (userForm.id) {
        // Update
        await updateHr({ id: userForm.id, name: userForm.name, phone: userForm.phone });
        MessagePlugin.success('更新成功');
      } else {
        // Add
        if (!userForm.password) {
          MessagePlugin.warning('请设置初始密码');
          return;
        }
        await addHr({ name: userForm.name, username: userForm.username, password: userForm.password, phone: userForm.phone });
        MessagePlugin.success('添加成功');
      }
      setUserDialogVisible(false);
      loadUsers();
    } catch {
      // handled by interceptor
    }
  };

  const columns = [
    {
      colKey: 'userface',
      title: '头像',
      width: 60,
      cell: ({ row }: { row: HrUser }) => (
        <Avatar size="small" image={row.userface?.startsWith('/avatars/') ? row.userface : ANIMAL_AVATARS[row.id % ANIMAL_AVATARS.length]} />
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
            <Tag key={r.id} theme="primary" variant="light" size="small">{r.nameZh}</Tag>
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
      width: 280,
      cell: ({ row }: { row: HrUser }) => (
        <Space size="small">
          <Button variant="text" theme="primary" size="small" onClick={() => openEditDialog(row)}>编辑</Button>
          <Button variant="text" theme="primary" size="small" onClick={() => openRoleDialog(row)}>角色</Button>
          <Switch size="small" value={row.enabled} onChange={() => handleToggleEnabled(row)} />
          <Popconfirm content={`确定删除「${row.name}」吗？`} onConfirm={() => handleDelete(row.id, row.name)}>
            <Button variant="text" theme="danger" size="small">删除</Button>
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
            <Button theme="primary" onClick={handleSearch}>搜索</Button>
          </Space>
          <Button theme="primary" icon={<AddIcon />} onClick={openAddDialog}>新增管理员</Button>
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

      {/* Add/Edit user dialog */}
      <Dialog
        header={userDialogTitle}
        visible={userDialogVisible}
        onClose={() => setUserDialogVisible(false)}
        onConfirm={handleUserSubmit}
        confirmBtn="确定"
        cancelBtn="取消"
        width={480}
      >
        <Form labelWidth={80}>
          <Form.FormItem label="姓名">
            <Input value={userForm.name} onChange={(v) => setUserForm({ ...userForm, name: v as string })} placeholder="请输入姓名" />
          </Form.FormItem>
          <Form.FormItem label="用户名">
            <Input
              value={userForm.username}
              onChange={(v) => setUserForm({ ...userForm, username: v as string })}
              placeholder="登录用户名"
              disabled={!!userForm.id}
            />
          </Form.FormItem>
          {!userForm.id && (
            <Form.FormItem label="初始密码">
              <Input type="password" value={userForm.password} onChange={(v) => setUserForm({ ...userForm, password: v as string })} placeholder="设置初始密码" />
            </Form.FormItem>
          )}
          <Form.FormItem label="电话">
            <Input value={userForm.phone} onChange={(v) => setUserForm({ ...userForm, phone: v as string })} placeholder="联系电话" />
          </Form.FormItem>
        </Form>
      </Dialog>

      {/* Role edit dialog */}
      <Dialog
        header="编辑角色"
        visible={roleDialogVisible}
        onClose={() => setRoleDialogVisible(false)}
        onConfirm={handleRoleSubmit}
        confirmBtn="确定"
        cancelBtn="取消"
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
