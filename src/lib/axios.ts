import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api` || 'http://localhost:8000/api',
  withCredentials: true, // send cookies!
});

export default api;
