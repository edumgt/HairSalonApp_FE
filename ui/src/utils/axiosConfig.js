import axios from 'axios';
import { message } from 'antd';
import moment from 'moment';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000,
  paramsSerializer: params => {
    // Ensure date is properly formatted
    if (params.date) {
      params.date = moment(params.date).format('YYYY-MM-DD');
    }
    // Convert all params to strings
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      searchParams.append(key, String(params[key]));
    });
    return searchParams.toString();
  }
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log detailed request info
    console.log('Request details:', {
      url: `${config.baseURL}${config.url}`,
      method: config.method,
      params: config.params,
      headers: config.headers,
      data: config.data
    });
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful response
    console.log('Success response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    // Log detailed error information
    console.error('Error details:', {
      url: error.config?.url,
      method: error.config?.method,
      params: error.config?.params,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    const errorMessage = error.response?.data?.message || 'Đã có lỗi xảy ra';

    switch (error.response?.status) {
      case 400:
        message.error(`Yêu cầu không hợp lệ: ${errorMessage}`);
        break;
      case 401:
        message.error('Phiên đăng nhập đã hết hạn');
        localStorage.clear();
        window.location.href = '/login';
        break;
      default:
        message.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;