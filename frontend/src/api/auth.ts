import request from '../utils/request';
import type { RespBean, User } from '../types';

/**
 * Login with form-encoded data (matching backend LoginFilter expectation)
 */
export function doLogin(username: string, password: string, verifyCode: string): Promise<RespBean> {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  params.append('verifyCode', verifyCode);
  return request.post('/doLogin', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
}

/**
 * Logout current session
 */
export function logout(): Promise<RespBean> {
  return request.get('/logout');
}

/**
 * Get current logged-in user's info (from /hr/info)
 */
export function getCurrentUser(): Promise<User> {
  return request.get('/hr/info');
}

/**
 * Get verification code image URL with cache-busting timestamp
 */
export function getVerifyCodeUrl(): string {
  return `/verifyCode?time=${Date.now()}`;
}
