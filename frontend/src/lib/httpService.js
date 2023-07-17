import axios from 'axios';
import { toast } from 'react-toastify';

const httpService = axios.create({
  baseURL: 'http://localhost:3000/api/v1/',
  // latest 
  // baseURL: 'https://knmulti-eopsr.ondigitalocean.app/api/v1/',
});
httpService.interceptors.request.use((config) => {
  if (!config.headers.Authorization && localStorage.getItem('auth')) {
    config.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem('auth')).token
    }`;
  }
  return config;
});

httpService.interceptors.response.use(
  (response) => response,
  (response) => {
    toast.error(response.response.data.message);
  }
);

export default httpService;
