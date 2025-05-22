// src/helpers/api_helper.js
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000/";

const axiosApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request Interceptor
axiosApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Special handling for FormData - let browser set Content-Type with boundary
        if (config.data instanceof FormData) {
            config.headers['Content-Type'] = 'multipart/form-data';
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && 
            originalRequest.url !== 'api/token/refresh/' && 
            !originalRequest._retry) {
            
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) throw new Error('No refresh token');
                
                const refreshResponse = await axios.post(`${API_URL}api/token/refresh/`, { refresh: refreshToken });
                const { access: newAccessToken } = refreshResponse.data;

                localStorage.setItem('accessToken', newAccessToken);
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                return axiosApi(originalRequest);
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                toast.error("Session expired. Please login again.");
                localStorage.clear();
                if (window.location.pathname !== '/login') window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

// Enhanced post function for FormData
export async function post(url, data, config = {}) {
    if (data instanceof FormData) {
        // Create new config with headers that work for FormData
        const formDataConfig = {
            ...config,
            headers: {
                ...config.headers,
                // Explicitly set Content-Type for FormData
                'Content-Type': 'multipart/form-data'
            }
        };
        
        // Debug log to check what's being sent
        console.log("Sending FormData with headers:", formDataConfig.headers);
        for (let [key, value] of data.entries()) {
            console.log(key, value);
        }

        return axiosApi.post(url, data, formDataConfig)
            .then(response => response.data)
            .catch(error => {
                console.error("FormData upload error:", error);
                throw error;
            });
    }

    // Regular JSON post
    return axiosApi.post(url, data, { ...config })
        .then(response => response.data);
}

// Other HTTP methods remain the same
export async function get(url, config = {}) {
    return axiosApi.get(url, { ...config }).then(response => response.data);
}

export async function put(url, data, config = {}) {
    return axiosApi.put(url, data, { ...config }).then(response => response.data);
}

export async function patch(url, data, config = {}) {
    return axiosApi.patch(url, data, { ...config }).then(response => response.data);
}

export async function del(url, config = {}) {
    return axiosApi.delete(url, { ...config }).then(response => response.data);
}

export { axiosApi };