import axios from 'axios';
import { GET_ACCESS_TOKEN } from './constants';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Token': `${GET_ACCESS_TOKEN()}`,
    },
    withCredentials: true,
});

export default api;