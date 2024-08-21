// src/axiosInstance.js
import axios from 'axios';

// Define the base URL
const getBaseURL = () => 'https://example.shop/api';

// Create an instance of axios
const axiosInstance = axios.create({
    baseURL: getBaseURL(), // Use the base URL function
    withCredentials: true,
    headers: {
        "Accept": "application/json",
        'X-Requested-With': 'XMLHttpRequest',
    },
});

// Optional: Add an interceptor if needed
axiosInstance.interceptors.request.use(
    (config) => {
        // Update baseURL before sending the request if necessary
        config.baseURL = getBaseURL();
        return config;
    },
    (error) => {
        // Handle request errors here
        return Promise.reject(error);
    }
);

// Export the configured axios instance
export default axiosInstance;
