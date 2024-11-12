import axios from 'axios';

export const fetchCombos = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No token found');
  }

  try {
    const response = await axios.get('http://localhost:8080/api/v1/combo', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
      throw new Error('Unauthorized access');
    }
    console.error('Error fetching combos:', error);
    throw error;
  }
};