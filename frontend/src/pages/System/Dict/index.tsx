import { useState, useEffect } from 'react';
import { Card, Tabs, Tag, Input, Button, Space, MessagePlugin, Table, Popconfirm, Dialog } from 'tdesign-react';
import { AddIcon, EditIcon, DeleteIcon } from 'tdesign-icons-react';
import './index.css';

const { TabPanel } = Tabs;

const DEFAULT_DATA: Record<string, string[]> = {
  擅长领域: ['信贷管理', '风险控制', '财务管理', '信息科技', '人力资源', '市场营销', '合规管理', '运营管理'],
  岗位类别: ['管理岗', '专业技术岗', '操作岗'],
  聘用形式: ['劳动合同', '劳务合同'],
  学历: ['博士', '硕士', '本科', '大专', '高中', '初中'],
};

const STORAGE_KEY = 'dict_data';

export default function SystemDict() {
  const [dictData, setDictData] = useState<Record<string, string[]>>(DEFAULT_DATA);
  const [activeTab, setActiveTab] = useState('擅长领域');
  const [newTag, setNewTag] = useState('');
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number>(-1);
  const [editingValue, setEditingValue] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setDictData(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  const saveData = (data: Record<string, string[]>) => {
    setDictData(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const handleAdd = () => {
    if (!newTag.trim()) {
      MessagePlugin.warning('请输入标签名称');
      return;
    }
    const current = dictData[activeTab] || [];
    if (current.includes(newTag.trim())) {
      MessagePlugin.warning('该标签已存在');
      return;
    }
    const updated = { ...dictData, [activeTab]: [...current, newTag.trim()] };
    saveData(updated);
    setNewTag('');
    MessagePlugin.success('添加成功');
  };

  const handleRemove = (index: number) => {
    const current = [...(dictData[activeTab] || [])];
    const removed = current.splice(index, 1);
    const updated = { ...dictData, [activeTab]: current };
    saveData(updated);
    MessagePlugin.success(`已删除「${removed[0]}」`);
  };

  const openEdit = (index: number) => {
    const current = dictData[activeTab] || [];
    setEditingIndex(index);
    setEditingValue(current[index]);
    setEditDialogVisible(true);
  };

  const handleEdit = () => {
    if (!editingValue.trim()) {
      MessagePlugin.warning('名称不能为空');
      return;
    }
    const current = [...(dictData[activeTab] || [])];
    // Check duplicate
    if (current.some((t, i) => t === editingValue.trim() && i !== editingIndex)) {
      MessagePlugin.warning('该名称已存在');
      return;
    }
    current[editingIndex] = editingValue.trim();
    const updated = { ...dictData, [activeTab]: current };
    saveData(updated);
    setEditDialogVisible(false);
    MessagePlugin.success('修改成功');
  };

  const categories = Object.keys(dictData);
  const currentTags = dictData[activeTab] || [];

  const tableData = currentTags.map((tag, index) => ({ id: index, name: tag }));

  const columns = [
    {
      colKey: 'index',
      title: '序号',
      width: 70,
      cell: ({ rowIndex }: any) => rowIndex + 1,
    },
    {
      colKey: 'name',
      title: '名称',
      cell: ({ row }: any) => (
        <Tag theme="primary" variant="light">{row.name}</Tag>
      ),
    },
    {
      colKey: 'operation',
      title: '操作',
      width: 160,
      cell: ({ row }: any) => (
        <Space>
          <Button variant="text" theme="primary" size="small" icon={<EditIcon />} onClick={() => openEdit(row.id)}>
            编辑
          </Button>
          <Popconfirm content={`确定删除「${row.name}」？此操作不可恢复。`} onConfirm={() => handleRemove(row.id)}>
            <Button variant="text" theme="danger" size="small" icon={<DeleteIcon />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="system-dict-page">
      <Card bordered={false} title="数据字典管理">
        <Tabs value={activeTab} onChange={(v) => setActiveTab(v as string)}>
          {categories.map((cat) => (
            <TabPanel key={cat} value={cat} label={cat}>
              <div className="dict-content">
                <div className="dict-add-row">
                  <Space>
                    <Input
                      placeholder={`新增${cat}标签`}
                      value={newTag}
                      onChange={(v) => setNewTag(v as string)}
                      onEnter={handleAdd}
                      style={{ width: 280 }}
                    />
                    <Button theme="primary" icon={<AddIcon />} onClick={handleAdd}>
                      添加
                    </Button>
                  </Space>
                  <span className="dict-count">共 {currentTags.length} 项</span>
                </div>
                <Table
                  data={tableData}
                  columns={columns}
                  rowKey="id"
                  size="small"
                  bordered
                  stripe
                  empty="暂无数据，请添加"
                />
              </div>
            </TabPanel>
          ))}
        </Tabs>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        visible={editDialogVisible}
        header="编辑字典项"
        onClose={() => setEditDialogVisible(false)}
        onConfirm={handleEdit}
        confirmBtn="保存"
        cancelBtn="取消"
      >
        <Input
          value={editingValue}
          onChange={(v) => setEditingValue(v as string)}
          onEnter={handleEdit}
          placeholder="请输入名称"
        />
      </Dialog>
    </div>
  );
}
