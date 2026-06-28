import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Loading } from 'tdesign-react';

// Lazy-loaded pages
const Login = React.lazy(() => import('../pages/Login'));
const Layout = React.lazy(() => import('../components/Layout'));
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const EmployeeList = React.lazy(() => import('../pages/Employee/List'));
const EmployeeDetail = React.lazy(() => import('../pages/Employee/Detail'));
const EmployeeForm = React.lazy(() => import('../pages/Employee/Form'));
const EmployeeImport = React.lazy(() => import('../pages/Employee/Import'));
const AnalysisRadar = React.lazy(() => import('../pages/Analysis/Radar'));
const AnalysisCompare = React.lazy(() => import('../pages/Analysis/Compare'));
const AnalysisRecommend = React.lazy(() => import('../pages/Analysis/Recommend'));
const LeaderOverview = React.lazy(() => import('../pages/Leader/Overview'));
const SystemUser = React.lazy(() => import('../pages/System/User'));
const SystemLog = React.lazy(() => import('../pages/System/Log'));
const SystemDict = React.lazy(() => import('../pages/System/Dict'));

const LazyWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense
    fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Loading />
      </div>
    }
  >
    {children}
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <LazyWrapper>
        <Login />
      </LazyWrapper>
    ),
  },
  {
    path: '/app',
    element: (
      <LazyWrapper>
        <Layout />
      </LazyWrapper>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/app/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: (
          <LazyWrapper>
            <Dashboard />
          </LazyWrapper>
        ),
      },
      {
        path: 'employee/list',
        element: (
          <LazyWrapper>
            <EmployeeList />
          </LazyWrapper>
        ),
      },
      {
        path: 'employee/detail/:id',
        element: (
          <LazyWrapper>
            <EmployeeDetail />
          </LazyWrapper>
        ),
      },
      {
        path: 'employee/form',
        element: (
          <LazyWrapper>
            <EmployeeForm />
          </LazyWrapper>
        ),
      },
      {
        path: 'employee/form/:id',
        element: (
          <LazyWrapper>
            <EmployeeForm />
          </LazyWrapper>
        ),
      },
      {
        path: 'employee/import',
        element: (
          <LazyWrapper>
            <EmployeeImport />
          </LazyWrapper>
        ),
      },
      {
        path: 'analysis/radar',
        element: (
          <LazyWrapper>
            <AnalysisRadar />
          </LazyWrapper>
        ),
      },
      {
        path: 'analysis/compare',
        element: (
          <LazyWrapper>
            <AnalysisCompare />
          </LazyWrapper>
        ),
      },
      {
        path: 'analysis/recommend',
        element: (
          <LazyWrapper>
            <AnalysisRecommend />
          </LazyWrapper>
        ),
      },
      {
        path: 'leader/overview',
        element: (
          <LazyWrapper>
            <LeaderOverview />
          </LazyWrapper>
        ),
      },
      {
        path: 'system/user',
        element: (
          <LazyWrapper>
            <SystemUser />
          </LazyWrapper>
        ),
      },
      {
        path: 'system/log',
        element: (
          <LazyWrapper>
            <SystemLog />
          </LazyWrapper>
        ),
      },
      {
        path: 'system/dict',
        element: (
          <LazyWrapper>
            <SystemDict />
          </LazyWrapper>
        ),
      },
    ],
  },
]);

export default router;
