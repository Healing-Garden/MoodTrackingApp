import axios from 'axios';
// Use 10.0.2.2 for Android Emulator to access host machine's localhost
const BASE_URL = 'http://10.12.96.97:8080/api';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add auth token (mocking for now until persistence is set up)
let authToken = null;

export const setAuthToken = (token) => {
    authToken = token;
};

api.interceptors.request.use(
    (config) => {
        if (authToken) {
            config.headers.Authorization = `Bearer ${authToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
