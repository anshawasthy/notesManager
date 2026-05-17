import axios from 'axios';

const api = axios.create({
  baseURL: Meta.process.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export default api;

