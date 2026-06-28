import { useState, useEffect } from 'react';
import { Card, Select, Table, Tag, Space } from 'tdesign-react';
import ReactECharts from 'echarts-for-react';
import { getBriefEmployees, getRadarData } from '../../../api/analysis';
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

function getRating(score: number): { text: string; theme: 'success' | 'warning' | 'primary' | 'danger' } {
  if (score > 80) return { text: '优秀', theme: 'success' };
  if (score > 60) return { text: '良好', theme: 'primary' };
  if (score > 40) return { text: '一般', theme: 'warning' };
  return { text: '待提升', theme: 'danger' };
}

export default function RadarPage() {
  const [employees, setEmployees] = useState<BriefEmployee[]>([]);
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);
  const [radarData, setRadarData] = useState<RadarData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getBriefEmployees().then((data) => {
      if (data) setEmployees(data);
    });
  }, []);

  useEffect(() => {
    if (selectedId) {
      setLoading(true);
      getRadarData(selectedId).then((data) => {
        if (data) setRadarData(data);
      }).finally(() => setLoading(false));
    } else {
      setRadarData(null);
    }
  }, [selectedId]);

  const getChartOption = () => {
    if (!radarData) return {};
    const values = dimensionKeys.map((k) => radarData[k] as number);
    return {
      tooltip: { trigger: 'item' },
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
          data: [
            {
              value: values,
              name: radarData.employeeName,
              areaStyle: { color: 'rgba(0, 107, 63, 0.3)' },
              lineStyle: { color: '#006b3f', width: 2 },
              itemStyle: { color: '#006b3f' },
            },
          ],
        },
      ],
    };
  };

  const tableData = radarData
    ? dimensionKeys.map((key, idx) => ({
        dimension: dimensions[idx],
        score: Math.round(radarData[key] as number),
        key: idx,
      }))
    : [];

  const tableColumns = [
    { colKey: 'dimension', title: '维度', width: 120 },
    { colKey: 'score', title: '得分', width: 80 },
    {
      colKey: 'rating',
      title: '评级',
      width: 100,
      cell: ({ row }: { row: { score: number } }) => {
        const rating = getRating(row.score);
        return <Tag theme={rating.theme} variant="light">{rating.text}</Tag>;
      },
    },
  ];

  return (
    <div className="radar-page">
      <Card bordered={false} title="员工雷达图分析">
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Select
            value={selectedId}
            onChange={(v) => setSelectedId(v as number)}
            placeholder="选择员工查看雷达图"
            filterable
            clearable
            style={{ width: 360 }}
            options={employees.map((e) => ({
              label: `${e.name} (${e.workID}) - ${e.departmentName || ''}`,
              value: e.id,
            }))}
          />

          {!radarData && !loading && (
            <div className="radar-placeholder">
              <p>请选择员工查看雷达图</p>
            </div>
          )}

          {radarData && (
            <>
              <div className="radar-chart-wrapper">
                <ReactECharts
                  option={getChartOption()}
                  style={{ height: 500, width: '100%' }}
                  opts={{ renderer: 'svg' }}
                />
              </div>

              <Card bordered title={`${radarData.employeeName} - 各维度得分`}>
                <Table
                  data={tableData}
                  columns={tableColumns}
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
