import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Send cookies for JWT auth
});

// Response interceptor to handle 401s (e.g. redirect to login)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optional: Handle auto-logout or refresh token logic here
      // For now, let the components handle the 401
    }
    return Promise.reject(error);
  }
);

export default api;
