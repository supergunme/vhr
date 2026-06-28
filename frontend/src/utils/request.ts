import axios from 'axios';
import { MessagePlugin } from 'tdesign-react';

const request = axios.create({
  baseURL: '',
  timeout: 15000,
  withCredentials: true,
});

// Request interceptor
request.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
request.interceptors.response.use(
  (response) => {
    const data = response.data;
    if (data && data.status === 500) {
      MessagePlugin.error(data.msg || '请求失败');
      return Promise.reject(new Error(data.msg));
    }
    return data;
  },
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      MessagePlugin.warning('登录已过期，请重新登录');
      window.location.href = '/';
    } else if (status === 403) {
      MessagePlugin.error('权限不足，请联系管理员');
    } else if (status === 404 || status === 504) {
      MessagePlugin.error('服务器异常，请稍后重试');
    } else {
      MessagePlugin.error(error.message || '网络错误');
    }
    return Promise.reject(error);
  }
);

export default request;
