import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/category`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const fetchServices = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get('http://localhost:8080/api/v1/service', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    throw error;
  }
};