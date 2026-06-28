import request from '../utils/request';

export function getOverview(): Promise<any> {
  return request.get('/api/statistics/overview');
}

export function getDepartmentDist(): Promise<any[]> {
  return request.get('/api/statistics/department-dist');
}

export function getEducationDist(): Promise<any[]> {
  return request.get('/api/statistics/education-dist');
}
