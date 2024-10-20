import axios from "axios";
const token = localStorage.getItem('token')
const BASE_URL = axios.create({
    baseURL: 'http://localhost:8080/api/v1/',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    }
})


export default BASE_URL;
