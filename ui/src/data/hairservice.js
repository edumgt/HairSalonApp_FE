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
  try {
    const response = await axios.get(`${API_BASE_URL}/service`);
    console.log('API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};