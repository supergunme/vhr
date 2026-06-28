export interface RespBean {
  status: number;
  msg: string;
  obj?: unknown;
}

export interface RespPageBean {
  total: number;
  data: unknown[];
}

export interface User {
  id: number;
  name: string;
  phone?: string;
  telephone?: string;
  address?: string;
  enabled: boolean;
  username: string;
  userface?: string;
  remark?: string;
  roles?: Role[];
}

export interface Role {
  id: number;
  name: string;
  nameZh: string;
}

export interface Department {
  id: number;
  name: string;
  parentId: number;
  depPath?: string;
  enabled: boolean;
  isParent: boolean;
  children?: Department[];
}

export interface Position {
  id: number;
  name: string;
  createDate?: string;
  enabled: boolean;
}

export interface JobLevel {
  id: number;
  name: string;
  titleLevel?: string;
  createDate?: string;
  enabled: boolean;
}

export interface Nation {
  id: number;
  name: string;
}

export interface PoliticsStatus {
  id: number;
  name: string;
}

export interface Employee {
  id: number;
  name: string;
  gender: string;
  birthday?: string;
  idCard?: string;
  wedlock?: string;
  nationId?: number;
  nativePlace?: string;
  politicId?: number;
  email?: string;
  phone?: string;
  address?: string;
  departmentId?: number;
  jobLevelId?: number;
  posId?: number;
  engageForm?: string;
  tiptopDegree?: string;
  specialty?: string;
  school?: string;
  beginDate?: string;
  workState?: string;
  workID?: string;
  contractTerm?: number;
  conversionTime?: string;
  notWorkDate?: string;
  beginContract?: string;
  endContract?: string;
  workAge?: number;
  // Extended fields
  hireDate?: string;
  mainPositionExp?: string;
  positionYears?: number;
  expertiseArea?: string;
  specialContribution?: string;
  evaluationScore?: number;
  leadershipLevel?: string;
  // Relations
  nation?: Nation;
  politicsstatus?: PoliticsStatus;
  department?: Department;
  jobLevel?: JobLevel;
  position?: Position;
  salary?: Salary;
}

export interface Salary {
  id: number;
  basicSalary?: number;
  bonus?: number;
  lunchSalary?: number;
  trafficSalary?: number;
  allSalary?: number;
  pensionBase?: number;
  pensionPer?: number;
  medicalBase?: number;
  medicalPer?: number;
  accumulationFundBase?: number;
  accumulationFundPer?: number;
  name?: string;
}

export interface Employeeec {
  id: number;
  eid: number;
  ecdate?: string;
  ecreason?: string;
  ecpoint?: number;
  ectype?: number;
  remark?: string;
}

export interface EmployeeFilters {
  name?: string;
  politicId?: number;
  nationId?: number;
  posId?: number;
  jobLevelId?: number;
  engageForm?: string;
  departmentId?: number;
  beginDateScope?: string[];
}
