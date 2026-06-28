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

export function getDepartments(): Promise<any[]> {
  return request.get('/system/basic/department/');
}

export function addDepartment(data: any): Promise<any> {
  return request.post('/system/basic/department/', data);
}

export function deleteDepartment(id: number): Promise<any> {
  return request.delete(`/system/basic/department/${id}`);
}

export function getPositions(): Promise<any[]> {
  return request.get('/system/basic/pos/');
}

export function addPosition(data: any): Promise<any> {
  return request.post('/system/basic/pos/', data);
}

export function updatePosition(data: any): Promise<any> {
  return request.put('/system/basic/pos/', data);
}

export function deletePosition(id: number): Promise<any> {
  return request.delete(`/system/basic/pos/${id}`);
}

export function getJobLevels(): Promise<any[]> {
  return request.get('/system/basic/jl/');
}

export function addJobLevel(data: any): Promise<any> {
  return request.post('/system/basic/jl/', data);
}

export function updateJobLevel(data: any): Promise<any> {
  return request.put('/system/basic/jl/', data);
}

export function deleteJobLevel(id: number): Promise<any> {
  return request.delete(`/system/basic/jl/${id}`);
}
