import axios from "axios";
import { navigate } from "./navigationService";



const axiosInstance: any = axios.create({
  baseURL: 'http://localhost:3000/', // Replace with your actual API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptors (optional)
axiosInstance.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers!['Authorization'] = `Bearer ${JSON.parse(token)}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Add response interceptors (optional)
axiosInstance.interceptors.response.use(
  (response: any) => response,
  (error: { response: { status: number; }; }) => {
    if (error.response && error.response.status === 401) {
      // Handle Unauthorized (maybe redirect to login)
      logout()
      console.error('Unauthorized, please login again');
    }
    return Promise.reject(error);
  }
);
export const logout = () => {

  localStorage.clear();
  navigate("/login")
};

export default axiosInstance;
