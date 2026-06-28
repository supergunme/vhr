import request from '../utils/request';

export function getHrList(keyword?: string): Promise<any[]> {
  const params = keyword ? { keywords: keyword } : {};
  return request.get('/system/hr/', { params });
}

export function deleteHr(id: number): Promise<any> {
  return request.delete(`/system/hr/${id}`);
}

export function updateHrRoles(id: number, rids: number[]): Promise<any> {
  return request.put(`/system/hr/role?hrid=${id}&rids=${rids.join(',')}`);
}

export function toggleHrEnabled(id: number, enabled: boolean): Promise<any> {
  return request.put(`/system/hr/status`, { id, enabled });
}

export function getAllRoles(): Promise<any[]> {
  return request.get('/system/hr/roles');
}
