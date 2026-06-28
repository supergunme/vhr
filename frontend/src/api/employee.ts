import request from '../utils/request';
import type { Employee, EmployeeFilters, RespBean, RespPageBean } from '../types';

/**
 * Get paginated employee list with optional filters
 */
export function getEmployeeList(
  page: number,
  size: number,
  filters?: EmployeeFilters
): Promise<RespPageBean> {
  const params: Record<string, unknown> = { page, size, ...filters };
  return request.get('/employee/basic/', { params });
}

/**
 * Get single employee by ID (with full relations)
 */
export function getEmployeeById(id: number): Promise<Employee> {
  return request.get(`/personnel/emp/${id}`);
}

/**
 * Add a new employee
 */
export function addEmployee(data: Partial<Employee>): Promise<RespBean> {
  return request.post('/employee/basic/', data);
}

/**
 * Update an existing employee
 */
export function updateEmployee(data: Partial<Employee>): Promise<RespBean> {
  return request.put('/employee/basic/', data);
}

/**
 * Delete employee by ID
 */
export function deleteEmployee(id: number): Promise<RespBean> {
  return request.delete(`/employee/basic/${id}`);
}

/**
 * Export all employees as Excel download
 */
export function exportEmployees(): void {
  window.open('/employee/basic/export', '_blank');
}

/**
 * Import employees from Excel file
 */
export function importEmployees(file: File): Promise<RespBean> {
  const formData = new FormData();
  formData.append('file', file);
  return request.post('/employee/basic/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

/**
 * Get next available work ID
 */
export function getMaxWorkID(): Promise<RespBean> {
  return request.get('/employee/basic/maxWorkID');
}

/**
 * Get all nations for dropdown
 */
export function getAllNations(): Promise<unknown[]> {
  return request.get('/employee/basic/nations');
}

/**
 * Get all politics status for dropdown
 */
export function getAllPoliticsStatus(): Promise<unknown[]> {
  return request.get('/employee/basic/politicsstatus');
}

/**
 * Get all job levels for dropdown
 */
export function getAllJobLevels(): Promise<unknown[]> {
  return request.get('/employee/basic/joblevels');
}

/**
 * Get all positions for dropdown
 */
export function getAllPositions(): Promise<unknown[]> {
  return request.get('/employee/basic/positions');
}

/**
 * Get all departments (tree structure)
 */
export function getAllDepartments(): Promise<unknown[]> {
  return request.get('/employee/basic/deps');
}
