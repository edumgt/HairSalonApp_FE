import axios from 'axios';

export const fetchCombos = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/v1/combo');
    return response.data;
  } catch (error) {
    console.error('Error fetching combos:', error);
    throw error;
  }
};