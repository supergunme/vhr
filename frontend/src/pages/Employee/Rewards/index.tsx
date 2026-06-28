import { useState, useEffect } from 'react';
import {
  Card,
  Select,
  Button,
  Table,
  Tag,
  Space,
  Dialog,
  Form,
  Input,
  InputNumber,
  Radio,
  DatePicker,
  Textarea,
  Popconfirm,
  MessagePlugin,
} from 'tdesign-react';
import { AddIcon } from 'tdesign-icons-react';
import { getBriefEmployees } from '../../../api/analysis';
import type { Employeeec } from '../../../api/rewards';
import {
  getRewardsByEid,
  addReward,
  updateReward,
  deleteReward,
} from '../../../api/rewards';
import './index.css';

export default function EmployeeRewards() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [currentEid, setCurrentEid] = useState<number | null>(null);
  const [records, setRecords] = useState<Employeeec[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('添加奖惩记录');
  const [form, setForm] = useState<Employeeec>({
    eid: 0,
    ectype: 0,
    ecdate: '',
    ecreason: '',
    ecpoint: 0,
    remark: '',
  });

  useEffect(() => {
    getBriefEmployees().then((data) => {
      if (data) setEmployees(data);
    });
  }, []);

  const loadRecords = async (eid: number) => {
    setLoading(true);
    try {
      const data = await getRewardsByEid(eid);
      if (data) setRecords(data);
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeChange = (val: number) => {
    setCurrentEid(val);
    if (val) loadRecords(val);
    else setRecords([]);
  };

  const showAddDialog = () => {
    setDialogTitle('添加奖惩记录');
    setForm({
      eid: currentEid!,
      ectype: 0,
      ecdate: '',
      ecreason: '',
      ecpoint: 0,
      remark: '',
    });
    setDialogVisible(true);
  };

  const showEditDialog = (row: Employeeec) => {
    setDialogTitle('编辑奖惩记录');
    setForm({ ...row });
    setDialogVisible(true);
  };

  const handleSubmit = async () => {
    if (!form.ecdate || !form.ecreason) {
      MessagePlugin.warning('请填写日期和原因');
      return;
    }
    try {
      if (form.id) {
        await updateReward(form);
      } else {
        await addReward(form);
      }
      MessagePlugin.success(form.id ? '更新成功' : '添加成功');
      setDialogVisible(false);
      if (currentEid) loadRecords(currentEid);
    } catch {
      // handled by interceptor
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteReward(id);
      MessagePlugin.success('删除成功');
      if (currentEid) loadRecords(currentEid);
    } catch {
      // handled by interceptor
    }
  };

  const updateField = (field: keyof Employeeec, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const columns = [
    {
      colKey: 'ecdate',
      title: '日期',
      width: 120,
      cell: ({ row }: { row: Employeeec }) =>
        row.ecdate ? row.ecdate.substring(0, 10) : '-',
    },
    {
      colKey: 'ectype',
      title: '类型',
      width: 80,
      cell: ({ row }: { row: Employeeec }) => (
        <Tag theme={row.ectype === 0 ? 'success' : 'danger'} variant="light">
          {row.ectype === 0 ? '奖励' : '惩罚'}
        </Tag>
      ),
    },
    { colKey: 'ecreason', title: '原因', ellipsis: true },
    { colKey: 'ecpoint', title: '积分', width: 80 },
    { colKey: 'remark', title: '备注', ellipsis: true },
    {
      colKey: 'operation',
      title: '操作',
      width: 150,
      cell: ({ row }: { row: Employeeec }) => (
        <Space>
          <Button variant="text" theme="primary" size="small" onClick={() => showEditDialog(row)}>
            编辑
          </Button>
          <Popconfirm content="确定删除该记录吗？" onConfirm={() => handleDelete(row.id!)}>
            <Button variant="text" theme="danger" size="small">
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="rewards-page">
      <Card bordered={false}>
        <div className="rewards-header">
          <Space>
            <Select
              value={currentEid as any}
              onChange={(val) => handleEmployeeChange(val as number)}
              placeholder="选择员工"
              filterable
              style={{ width: 280 }}
              options={employees.map((e: any) => ({
                label: `${e.name} (${e.workID || ''})`,
                value: e.id,
              }))}
            />
            <Button
              theme="primary"
              icon={<AddIcon />}
              disabled={!currentEid}
              onClick={showAddDialog}
            >
              添加奖惩
            </Button>
          </Space>
        </div>

        <Table
          data={records}
          columns={columns}
          rowKey="id"
          loading={loading}
          stripe
          bordered
          size="small"
          style={{ marginTop: 16 }}
          empty="请选择员工或暂无奖惩记录"
        />
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog
        header={dialogTitle}
        visible={dialogVisible}
        onClose={() => setDialogVisible(false)}
        onConfirm={handleSubmit}
        width={500}
      >
        <Form labelWidth={80}>
          <Form.FormItem label="类型">
            <Radio.Group
              value={form.ectype}
              onChange={(val) => updateField('ectype', val as number)}
            >
              <Radio value={0}>奖励</Radio>
              <Radio value={1}>惩罚</Radio>
            </Radio.Group>
          </Form.FormItem>
          <Form.FormItem label="日期">
            <DatePicker
              value={form.ecdate}
              onChange={(val) => updateField('ecdate', val)}
              format="YYYY-MM-DD"
              style={{ width: '100%' }}
            />
          </Form.FormItem>
          <Form.FormItem label="原因">
            <Input
              value={form.ecreason}
              onChange={(val) => updateField('ecreason', val)}
              placeholder="请输入奖惩原因"
            />
          </Form.FormItem>
          <Form.FormItem label="积分">
            <InputNumber
              value={form.ecpoint}
              onChange={(val) => updateField('ecpoint', val)}
              min={-100}
              max={100}
            />
          </Form.FormItem>
          <Form.FormItem label="备注">
            <Textarea
              value={form.remark || ''}
              onChange={(val) => updateField('remark', val)}
              placeholder="备注信息"
              autosize={{ minRows: 3 }}
            />
          </Form.FormItem>
        </Form>
      </Dialog>
    </div>
  );
}
