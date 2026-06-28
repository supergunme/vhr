import { useState } from 'react';
import { Input, Button, MessagePlugin } from 'tdesign-react';
import { LockOnIcon, UserIcon } from 'tdesign-icons-react';
import { doLogin } from '../../api/auth';
import { useAppStore } from '../../store';
import './index.css';

const Login: React.FC = () => {
  const setCurrentUser = useAppStore((s) => s.setCurrentUser);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      MessagePlugin.warning('请输入用户名和密码');
      return;
    }
    setLoading(true);
    try {
      const resp: any = await doLogin(username, password, '');
      if (resp && resp.status === 200) {
        setCurrentUser(resp.obj);
        window.location.href = '/app/dashboard';
      } else if (resp) {
        MessagePlugin.error(resp.msg || '登录失败');
      }
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo-icon">农信</div>
          <h1 className="login-title">员工信息同步平台</h1>
          <p className="login-subtitle">黑龙江省农村信用社联合社</p>
        </div>

        <div className="login-form" onKeyDown={handleKeyDown}>
          <Input
            className="form-field"
            prefixIcon={<UserIcon />}
            placeholder="请输入用户名"
            value={username}
            onChange={(v) => setUsername(v as string)}
            size="large"
          />
          <Input
            className="form-field"
            prefixIcon={<LockOnIcon />}
            type="password"
            placeholder="请输入密码"
            value={password}
            onChange={(v) => setPassword(v as string)}
            size="large"
          />
          <Button
            className="login-btn"
            theme="primary"
            block
            loading={loading}
            onClick={() => handleLogin()}
            size="large"
          >
            登 录
          </Button>
        </div>

        <div className="login-footer">
          © 2024 黑龙江省农村信用社联合社
        </div>
      </div>
    </div>
  );
};

export default Login;
