import request from '../utils/request';

export function getBriefEmployees(): Promise<any[]> {
  return request.get('/api/analysis/employees/brief');
}

export function getRadarData(id: number): Promise<any> {
  return request.get('/api/analysis/radar', { params: { id } });
}

export function getRadarDataBatch(ids: number[]): Promise<any[]> {
  return request.get('/api/analysis/radar/compare', { params: { ids: ids.join(',') } });
}
