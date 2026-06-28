import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Dropdown, Button, Avatar } from 'tdesign-react';
import {
  DashboardIcon,
  UserIcon,
  ChartIcon,
  SettingIcon,
  ViewListIcon,
  EditIcon,
  UploadIcon,
  ChartRadialIcon,
  ChartBarIcon,
  MenuFoldIcon,
  MenuUnfoldIcon,
  PoweroffIcon,
  BrowseIcon,
  StarIcon,
  DataBaseIcon,
  LogoGithubIcon,
  RootListIcon,
  FileIcon,
  BookIcon,
  UserCircleIcon,
  TrendingUpIcon,
} from 'tdesign-icons-react';
import { useAppStore } from '../../store';
import { getAvatarUrl } from '../../utils/avatar';
import './index.css';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useAppStore((s) => s.currentUser);
  const [collapsed, setCollapsed] = useState(false);

  const handleMenuChange = (value: string) => {
    navigate(value as string);
  };

  const handleLogout = () => {
    useAppStore.getState().logout();
    navigate('/');
  };

  const dropdownOptions = [
    { content: '个人中心', value: 'profile' },
    { content: '退出登录', value: 'logout', prefixIcon: <PoweroffIcon /> },
  ];

  const handleDropdown = (data: { value: string }) => {
    if (data.value === 'logout') handleLogout();
    if (data.value === 'profile') navigate('/app/profile');
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`app-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-logo">
          {collapsed ? (
            <img src="/logo.png" alt="农信" className="logo-img-small" />
          ) : (
            <>
              <img src="/logo.png" alt="黑龙江农信" className="logo-img" />
              <span className="logo-subtitle">员工信息同步平台</span>
            </>
          )}
        </div>
        <Menu
          theme="dark"
          value={location.pathname}
          collapsed={collapsed}
          onChange={(v) => handleMenuChange(v as string)}
          style={{ flex: 1, background: 'transparent' }}
        >
          <Menu.MenuItem value="/app/dashboard" icon={<DashboardIcon />}>
            仪表盘
          </Menu.MenuItem>
          <Menu.SubMenu value="employee" title="员工管理" icon={<UserIcon />}>
            <Menu.MenuItem value="/app/employee/list" icon={<ViewListIcon />}>
              员工列表
            </Menu.MenuItem>
            <Menu.MenuItem value="/app/employee/form" icon={<EditIcon />}>
              员工录入
            </Menu.MenuItem>
            <Menu.MenuItem value="/app/employee/import" icon={<UploadIcon />}>
              批量导入
            </Menu.MenuItem>
            <Menu.MenuItem value="/app/employee/rewards" icon={<StarIcon />}>
              奖惩管理
            </Menu.MenuItem>
          </Menu.SubMenu>
          <Menu.SubMenu value="analysis" title="数据分析" icon={<ChartIcon />}>
            <Menu.MenuItem value="/app/analysis/radar" icon={<ChartRadialIcon />}>
              员工雷达图
            </Menu.MenuItem>
            <Menu.MenuItem value="/app/analysis/compare" icon={<ChartBarIcon />}>
              对比分析
            </Menu.MenuItem>
          </Menu.SubMenu>
          <Menu.SubMenu value="leader" title="领导视图" icon={<BrowseIcon />}>
            <Menu.MenuItem value="/app/leader/overview" icon={<DataBaseIcon />}>团队概览</Menu.MenuItem>
            <Menu.MenuItem value="/app/analysis/recommend" icon={<TrendingUpIcon />}>岗位推荐</Menu.MenuItem>
          </Menu.SubMenu>
          <Menu.SubMenu value="system" title="系统管理" icon={<SettingIcon />}>
            <Menu.MenuItem value="/app/system/user" icon={<UserCircleIcon />}>用户管理</Menu.MenuItem>
            <Menu.MenuItem value="/app/system/org" icon={<RootListIcon />}>组织架构</Menu.MenuItem>
            <Menu.MenuItem value="/app/system/log" icon={<FileIcon />}>操作日志</Menu.MenuItem>
            <Menu.MenuItem value="/app/system/dict" icon={<BookIcon />}>数据字典</Menu.MenuItem>
          </Menu.SubMenu>
        </Menu>
      </aside>

      {/* Main area */}
      <div className="app-main">
        {/* Header */}
        <header className="app-header">
          <div className="header-left">
            <Button
              variant="text"
              shape="square"
              icon={collapsed ? <MenuUnfoldIcon /> : <MenuFoldIcon />}
              onClick={() => setCollapsed(!collapsed)}
            />
          </div>
          <div className="header-right">
            <Dropdown options={dropdownOptions} onClick={handleDropdown as any}>
              <div className="user-info">
                <Avatar size="small" image={getAvatarUrl(currentUser?.userface, currentUser?.id)} />
                <span className="user-name">{currentUser?.name || '管理员'}</span>
              </div>
            </Dropdown>
          </div>
        </header>

        {/* Content */}
        <div className="app-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
