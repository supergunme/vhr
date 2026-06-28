import { useState, useEffect } from 'react';
import { Card, Select, Table, Tag, Button, Space, MessagePlugin } from 'tdesign-react';
import ReactECharts from 'echarts-for-react';
import { getBriefEmployees, getRadarDataBatch } from '../../../api/analysis';
import './index.css';

interface BriefEmployee {
  id: number;
  name: string;
  workID: string;
  departmentName: string;
}

interface RadarData {
  employeeId: number;
  employeeName: string;
  workID: string;
  tenure: number;
  positionExp: number;
  expertise: number;
  evaluation: number;
  contribution: number;
  rewardPoints: number;
}

const dimensions = ['司龄', '岗位经验', '擅长领域', '考评得分', '特殊贡献', '奖惩积分'];
const dimensionKeys: (keyof RadarData)[] = ['tenure', 'positionExp', 'expertise', 'evaluation', 'contribution', 'rewardPoints'];
const seriesColors = ['#006b3f', '#c9a96e', '#1890ff', '#f5222d'];

export default function ComparePage() {
  const [employees, setEmployees] = useState<BriefEmployee[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [compareData, setCompareData] = useState<RadarData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getBriefEmployees().then((data) => {
      if (data) setEmployees(data);
    });
  }, []);

  const handleCompare = async () => {
    if (selectedIds.length < 2) {
      MessagePlugin.warning('请至少选择2名员工进行对比');
      return;
    }
    setLoading(true);
    try {
      const data = await getRadarDataBatch(selectedIds);
      if (data) setCompareData(data);
    } finally {
      setLoading(false);
    }
  };

  const getChartOption = () => {
    if (compareData.length === 0) return {};
    return {
      tooltip: { trigger: 'item' },
      legend: {
        data: compareData.map((d) => d.employeeName),
        top: 10,
      },
      radar: {
        indicator: dimensions.map((name) => ({ name, max: 100 })),
        shape: 'polygon',
        splitNumber: 5,
        axisName: {
          color: '#1a2b3c',
          fontSize: 13,
        },
      },
      series: [
        {
          type: 'radar',
          data: compareData.map((d, idx) => ({
            value: dimensionKeys.map((k) => d[k] as number),
            name: d.employeeName,
            areaStyle: { color: seriesColors[idx] + '33' },
            lineStyle: { color: seriesColors[idx], width: 2 },
            itemStyle: { color: seriesColors[idx] },
          })),
        },
      ],
    };
  };

  const getTableColumns = () => {
    const cols: any[] = [
      { colKey: 'dimension', title: '维度', width: 100, fixed: 'left' },
    ];
    compareData.forEach((d, idx) => {
      cols.push({
        colKey: `emp_${d.employeeId}`,
        title: d.employeeName,
        width: 120,
        cell: ({ row }: { row: any }) => {
          const score = row[`emp_${d.employeeId}`] as number;
          const isMax = row._maxIdx === idx;
          return (
            <span style={{ fontWeight: isMax ? 700 : 400, color: isMax ? '#006b3f' : '#1a2b3c' }}>
              {Math.round(score)}
              {isMax && <Tag size="small" theme="success" variant="light" style={{ marginLeft: 4 }}>最高</Tag>}
            </span>
          );
        },
      });
    });
    return cols;
  };

  const getTableData = () => {
    return dimensions.map((dim, dimIdx) => {
      const row: any = { dimension: dim, key: dimIdx };
      let maxVal = -1;
      let maxIdx = 0;
      compareData.forEach((d, empIdx) => {
        const val = d[dimensionKeys[dimIdx]] as number;
        row[`emp_${d.employeeId}`] = val;
        if (val > maxVal) {
          maxVal = val;
          maxIdx = empIdx;
        }
      });
      row._maxIdx = maxIdx;
      return row;
    });
  };

  return (
    <div className="compare-page">
      <Card bordered={false} title="员工对比分析">
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div className="compare-controls">
            <Select
              value={selectedIds}
              onChange={(v) => {
                const vals = v as number[];
                if (vals.length <= 4) setSelectedIds(vals);
                else MessagePlugin.warning('最多选择4名员工');
              }}
              placeholder="选择员工（最多4人）"
              filterable
              multiple
              style={{ width: 500 }}
              options={employees.map((e) => ({
                label: `${e.name} (${e.workID}) - ${e.departmentName || ''}`,
                value: e.id,
              }))}
            />
            <Button
              theme="primary"
              onClick={handleCompare}
              loading={loading}
              disabled={selectedIds.length < 2}
            >
              开始对比
            </Button>
          </div>

          {compareData.length === 0 && !loading && (
            <div className="compare-placeholder">
              <p>请至少选择2名员工进行对比分析</p>
            </div>
          )}

          {compareData.length >= 2 && (
            <>
              <div className="compare-chart-wrapper">
                <ReactECharts
                  option={getChartOption()}
                  style={{ height: 500, width: '100%' }}
                  opts={{ renderer: 'svg' }}
                />
              </div>

              <Card bordered title="对比数据表">
                <Table
                  data={getTableData()}
                  columns={getTableColumns()}
                  rowKey="key"
                  size="small"
                  bordered
                  stripe
                />
              </Card>
            </>
          )}
        </Space>
      </Card>
    </div>
  );
}
