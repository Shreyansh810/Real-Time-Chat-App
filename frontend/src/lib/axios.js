import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: "http://localhost:5001/api",
    withCredentials: true, // specifies that take cookie with you
});