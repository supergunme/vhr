import { useState, useEffect } from 'react';
import { Card, Select, Button, Progress, Tag, Space, Row, Col } from 'tdesign-react';
import { getBriefEmployees } from '../../../api/analysis';
import './index.css';

interface BriefEmployee {
  id: number;
  name: string;
  workID: string;
  departmentName: string;
}

interface Candidate {
  id: number;
  name: string;
  department: string;
  score: number;
  tags: string[];
}

const positionOptions = [
  { label: '信贷经理', value: '信贷经理' },
  { label: '风控主管', value: '风控主管' },
  { label: '运营主管', value: '运营主管' },
  { label: '科技部经理', value: '科技部经理' },
  { label: '人力资源经理', value: '人力资源经理' },
];

const dimensionTags = ['司龄:高', '考评:优', '经验:丰富', '领域:广', '贡献:突出', '积分:高'];

export default function AnalysisRecommend() {
  const [employees, setEmployees] = useState<BriefEmployee[]>([]);
  const [position, setPosition] = useState<string>('');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getBriefEmployees().then((data) => {
      if (data) setEmployees(data as BriefEmployee[]);
    });
  }, []);

  const handleRecommend = () => {
    if (!position) return;
    setLoading(true);
    // Mock recommendation: pick 10 random employees, assign scores, sort, take top 5
    setTimeout(() => {
      const shuffled = [...employees].sort(() => Math.random() - 0.5).slice(0, 10);
      const scored: Candidate[] = shuffled.map((emp) => ({
        id: emp.id,
        name: emp.name,
        department: emp.departmentName || '未知部门',
        score: Math.floor(Math.random() * 38) + 60, // 60-98
        tags: dimensionTags.sort(() => Math.random() - 0.5).slice(0, 3),
      }));
      scored.sort((a, b) => b.score - a.score);
      setCandidates(scored.slice(0, 5));
      setLoading(false);
    }, 800);
  };

  return (
    <div className="recommend-page">
      <Card bordered={false} title="岗位竞争力推荐">
        <div className="recommend-header">
          <Space size="large">
            <Select
              placeholder="选择目标岗位"
              value={position}
              onChange={(v) => setPosition(v as string)}
              options={positionOptions}
              style={{ width: 240 }}
              clearable
            />
            <Button theme="primary" loading={loading} onClick={handleRecommend} disabled={!position}>
              开始推荐
            </Button>
          </Space>
        </div>

        {candidates.length === 0 && !loading && (
          <div className="recommend-placeholder">
            <p>选择目标岗位后，系统将根据员工综合能力推荐最匹配的候选人</p>
          </div>
        )}

        {candidates.length > 0 && (
          <div className="candidates-list">
            <Row gutter={[16, 16]}>
              {candidates.map((candidate, idx) => (
                <Col span={12} key={candidate.id}>
                  <Card bordered className="candidate-card">
                    <div className="candidate-header">
                      <div className="candidate-rank">#{idx + 1}</div>
                      <div className="candidate-info">
                        <span className="candidate-name">{candidate.name}</span>
                        <span className="candidate-dept">({candidate.department})</span>
                      </div>
                      <div className="candidate-score">
                        匹配度: <strong>{candidate.score}%</strong>
                      </div>
                    </div>
                    <Progress
                      percentage={candidate.score}
                      color="#006b3f"
                      trackColor="#e8f5e9"
                      strokeWidth="8px"
                      label={false}
                      style={{ margin: '12px 0' }}
                    />
                    <div className="candidate-tags">
                      {candidate.tags.map((tag, tidx) => (
                        <Tag key={tidx} theme="primary" variant="light" size="small">
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Card>
    </div>
  );
}
