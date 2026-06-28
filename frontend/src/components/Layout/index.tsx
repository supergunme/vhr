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
} from 'tdesign-icons-react';
import { useAppStore } from '../../store';
import './index.css';

const { SubMenu, MenuItem } = Menu;

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
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`app-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-logo">
          {collapsed ? (
            <span className="logo-title-short">农</span>
          ) : (
            <>
              <span className="logo-title">黑龙江农信</span>
              <span className="logo-subtitle">员工信息同步平台</span>
            </>
          )}
        </div>
        <Menu
          value={location.pathname}
          collapsed={collapsed}
          onChange={(v) => handleMenuChange(v as string)}
          style={{ flex: 1 }}
        >
          <MenuItem value="/app/dashboard" icon={<DashboardIcon />}>
            仪表盘
          </MenuItem>
          <SubMenu value="employee" title="员工管理" icon={<UserIcon />}>
            <MenuItem value="/app/employee/list" icon={<ViewListIcon />}>
              员工列表
            </MenuItem>
            <MenuItem value="/app/employee/form" icon={<EditIcon />}>
              员工录入
            </MenuItem>
            <MenuItem value="/app/employee/import" icon={<UploadIcon />}>
              批量导入
            </MenuItem>
          </SubMenu>
          <SubMenu value="analysis" title="数据分析" icon={<ChartIcon />}>
            <MenuItem value="/app/analysis/radar" icon={<ChartRadialIcon />}>
              员工雷达图
            </MenuItem>
            <MenuItem value="/app/analysis/compare" icon={<ChartBarIcon />}>
              对比分析
            </MenuItem>
          </SubMenu>
          <SubMenu value="leader" title="领导视图" icon={<BrowseIcon />}>
            <MenuItem value="/app/leader/overview">团队概览</MenuItem>
            <MenuItem value="/app/analysis/recommend">岗位推荐</MenuItem>
          </SubMenu>
          <SubMenu value="system" title="系统管理" icon={<SettingIcon />}>
            <MenuItem value="/app/system/user">用户管理</MenuItem>
            <MenuItem value="/app/system/log">操作日志</MenuItem>
            <MenuItem value="/app/system/dict">数据字典</MenuItem>
          </SubMenu>
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
                <Avatar size="small" image={currentUser?.userface || '/avatars/cat.svg'} />
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
