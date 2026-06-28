import { useState } from 'react';
import { Card, Avatar, Button, Input, Divider, MessagePlugin, Space } from 'tdesign-react';
import { useAppStore } from '../../store';
import './index.css';

export default function Profile() {
  const currentUser = useAppStore((s) => s.currentUser);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      MessagePlugin.warning('请填写完整密码信息');
      return;
    }
    if (newPassword !== confirmPassword) {
      MessagePlugin.error('两次输入的新密码不一致');
      return;
    }
    if (newPassword.length < 6) {
      MessagePlugin.warning('新密码长度不能少于6位');
      return;
    }
    // TODO: call API to change password
    MessagePlugin.success('密码修改成功（功能开发中）');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="profile-page">
      {/* User Info Card */}
      <Card bordered={false} className="profile-card">
        <div className="profile-header">
          <Avatar size="80px" image={currentUser?.userface || '/avatars/cat.svg'} />
          <div className="profile-info">
            <h2 className="profile-name">{currentUser?.name || '管理员'}</h2>
            <p className="profile-role">
              {currentUser?.roles?.map((r) => r.nameZh).join('、') || '系统用户'}
            </p>
          </div>
        </div>
        <Divider />
        <div className="profile-details">
          <div className="detail-item">
            <span className="detail-label">用户名</span>
            <span className="detail-value">{currentUser?.username || '-'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">电话</span>
            <span className="detail-value">{currentUser?.phone || '-'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">办公电话</span>
            <span className="detail-value">{currentUser?.telephone || '-'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">地址</span>
            <span className="detail-value">{currentUser?.address || '-'}</span>
          </div>
        </div>
      </Card>

      {/* Change Password Card */}
      <Card bordered={false} title="修改密码" className="password-card">
        <div className="password-form">
          <div className="form-row">
            <label>当前密码</label>
            <Input
              type="password"
              placeholder="请输入当前密码"
              value={oldPassword}
              onChange={(v) => setOldPassword(v as string)}
              style={{ width: 320 }}
            />
          </div>
          <div className="form-row">
            <label>新密码</label>
            <Input
              type="password"
              placeholder="请输入新密码（至少6位）"
              value={newPassword}
              onChange={(v) => setNewPassword(v as string)}
              style={{ width: 320 }}
            />
          </div>
          <div className="form-row">
            <label>确认新密码</label>
            <Input
              type="password"
              placeholder="请再次输入新密码"
              value={confirmPassword}
              onChange={(v) => setConfirmPassword(v as string)}
              style={{ width: 320 }}
            />
          </div>
          <div className="form-row">
            <label></label>
            <Space>
              <Button theme="primary" onClick={handleChangePassword}>确认修改</Button>
              <Button variant="outline" onClick={() => { setOldPassword(''); setNewPassword(''); setConfirmPassword(''); }}>重置</Button>
            </Space>
          </div>
        </div>
      </Card>
    </div>
  );
}
