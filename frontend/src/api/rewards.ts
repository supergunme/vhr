import request from '../utils/request';

export interface Employeeec {
  id?: number;
  eid: number;
  ectype: number;    // 0=reward, 1=punishment
  ecdate: string;
  ecreason: string;
  ecpoint: number;
  remark?: string;
}

export function getRewardsByEid(eid: number): Promise<Employeeec[]> {
  return request.get('/personnel/ec/', { params: { eid } });
}

export function addReward(data: Employeeec): Promise<any> {
  return request.post('/personnel/ec/', data);
}

export function updateReward(data: Employeeec): Promise<any> {
  return request.put('/personnel/ec/', data);
}

export function deleteReward(id: number): Promise<any> {
  return request.delete(`/personnel/ec/${id}`);
}
