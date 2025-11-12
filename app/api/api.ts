import axios from 'axios';

const baseURL =
  (process.env.NEXT_PUBLIC_API_URL ||
    'https://travel-fs116-teamproject-backend.onrender.com') + '/api';

if (process.env.NODE_ENV === 'development') {
  console.log('API Base URL:', baseURL);
  console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
}

export const api = axios.create({
  baseURL,
  withCredentials: true,
});
