import { useState } from 'react';
import { Card, Upload, Button, MessagePlugin, Alert, Space } from 'tdesign-react';
import { DownloadIcon, UploadIcon } from 'tdesign-icons-react';
import { useNavigate } from 'react-router-dom';
import { importEmployees } from '../../../api/employee';
import './index.css';

export default function EmployeeImport() {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; msg: string } | null>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setResult(null);
    try {
      const resp = await importEmployees(file);
      if (resp && resp.status === 200) {
        setResult({ success: true, msg: resp.msg || '导入成功' });
        MessagePlugin.success('导入成功');
      } else {
        setResult({ success: false, msg: resp?.msg || '导入失败' });
      }
    } catch {
      setResult({ success: false, msg: '导入失败，请检查文件格式' });
    } finally {
      setUploading(false);
    }
    return { status: 'success' as const };
  };

  const handleDownloadTemplate = () => {
    window.open('/employee/basic/export', '_blank');
  };

  return (
    <div className="import-page">
      <Card bordered={false} title="批量导入员工">
        <div className="import-steps">
          <div className="step-item">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>下载模板</h4>
              <p>下载 Excel 模板文件，按照模板格式填写员工信息</p>
              <Button icon={<DownloadIcon />} variant="outline" onClick={handleDownloadTemplate}>
                下载导入模板
              </Button>
            </div>
          </div>

          <div className="step-item">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>上传文件</h4>
              <p>选择填写完成的 Excel 文件上传（支持 .xls / .xlsx 格式）</p>
              <Upload
                action=""
                accept=".xls,.xlsx"
                draggable
                theme="custom"
                autoUpload={false}
                requestMethod={({ raw }) => handleUpload(raw)}
              >
                <div className="upload-area">
                  <UploadIcon size="48" color="#006b3f" />
                  <p className="upload-text">点击或拖拽文件到此处上传</p>
                  <p className="upload-hint">支持 .xls / .xlsx 格式</p>
                </div>
              </Upload>
            </div>
          </div>

          <div className="step-item">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>查看结果</h4>
              <p>上传完成后查看导入结果</p>
              {uploading && <Alert theme="info" message="正在导入中，请稍候..." />}
              {result && (
                <Alert
                  theme={result.success ? 'success' : 'error'}
                  message={result.msg}
                />
              )}
            </div>
          </div>
        </div>

        <div className="import-footer">
          <Space>
            <Button variant="outline" onClick={() => navigate('/app/employee/list')}>
              返回列表
            </Button>
            {result?.success && (
              <Button theme="primary" onClick={() => navigate('/app/employee/list')}>
                查看员工列表
              </Button>
            )}
          </Space>
        </div>
      </Card>
    </div>
  );
}
