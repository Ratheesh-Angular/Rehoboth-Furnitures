import axios from "axios";
import { loadingService } from "./loading";

const api = axios.create({
  baseURL: "/api",
  // withCredentials: false,
});

// Request interceptor - start loading and add token
api.interceptors.request.use(
  (config) => {
    loadingService.startLoading();
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    loadingService.stopLoading();
    return Promise.reject(error);
  }
);

// Response interceptor - stop loading
api.interceptors.response.use(
  (response) => {
    loadingService.stopLoading();
    return response;
  },
  (error) => {
    loadingService.stopLoading();
    return Promise.reject(error);
  }
);

export default api;
