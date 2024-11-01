import axiosInstance from '../utils/axiosConfig';

export const fetchSalons = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await axiosInstance.get('/salon', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Salon API Response:', response.data);
    
    // Kiểm tra response.data có đúng format không
    if (response.data && typeof response.data.code !== 'undefined') {
      return response.data;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('Error fetching salons:', error);
    throw error;
  }
};