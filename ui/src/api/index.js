import axios from "axios";
// const token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIwOTg3NjU0MzIxIiwiaWF0IjoxNzI4NzM2Njg0LCJleHAiOjE3Mjg3NDAyODR9.SjdcCHPGOGCGTbtje-b4R6x2UUEIHR0aUGJxhf9810fI1BF9uCYRYG3nJXqZTRWCa27vkmETq8beL7zARDrxXw'
const BASE_URL = axios.create({
    baseURL: 'http://localhost:8080/api/v1/',
    headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`,
    }
})


export default BASE_URL;
