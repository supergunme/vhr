import { useState, useEffect } from 'react';
import { Card, Tabs, Tag, Input, Button, Space, MessagePlugin } from 'tdesign-react';
import { AddIcon } from 'tdesign-icons-react';
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

  const handleRemove = (tag: string) => {
    const current = dictData[activeTab] || [];
    const updated = { ...dictData, [activeTab]: current.filter((t) => t !== tag) };
    saveData(updated);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };

  const categories = Object.keys(dictData);

  return (
    <div className="system-dict-page">
      <Card bordered={false} title="数据字典管理">
        <Tabs value={activeTab} onChange={(v) => setActiveTab(v as string)}>
          {categories.map((cat) => (
            <TabPanel key={cat} value={cat} label={cat}>
              <div className="dict-content">
                <div className="dict-add-row" onKeyDown={handleKeyDown}>
                  <Space>
                    <Input
                      placeholder={`新增${cat}标签`}
                      value={newTag}
                      onChange={(v) => setNewTag(v as string)}
                      style={{ width: 240 }}
                    />
                    <Button theme="primary" icon={<AddIcon />} onClick={handleAdd}>
                      添加
                    </Button>
                  </Space>
                </div>
                <div className="dict-tags">
                  {(dictData[cat] || []).map((tag) => (
                    <Tag
                      key={tag}
                      closable
                      theme="primary"
                      variant="light"
                      size="medium"
                      onClose={() => handleRemove(tag)}
                    >
                      {tag}
                    </Tag>
                  ))}
                  {(dictData[cat] || []).length === 0 && (
                    <span className="empty-hint">暂无数据，请添加</span>
                  )}
                </div>
              </div>
            </TabPanel>
          ))}
        </Tabs>
      </Card>
    </div>
  );
}
