import axios from "axios";
import {
  getAccessToken,
  saveAccessToken,
  clearAccessToken,
} from "./tokenHelper.js";

// Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// Separate instance for refresh to avoid interceptor recursion
const refreshApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

let refreshPromise = null;

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Refresh access token directly
export const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = refreshApi
      .post("/token/refresh/")
      .then((response) => {
        const newAccessToken = response.data.access;

        if (!newAccessToken) {
          throw new Error("New access token not received");
        }

        saveAccessToken(newAccessToken);

        return newAccessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

// Response interceptor
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/token/refresh/") &&
      !originalRequest.url?.includes("/login/") &&
      !originalRequest.url?.includes("/logout/")
    ) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        clearAccessToken();
        sessionStorage.removeItem("authUser");

        // Redirect only if not already on login page
        if (window.location.pathname !== "/login") {
          window.location.replace("/login");
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// API methods
export const get = (url, config = {}) => api.get(url, config);

export const post = (url, data, config = {}) => api.post(url, data, config);

export const put = (url, data, config = {}) => api.put(url, data, config);

export const patch = (url, data, config = {}) => api.patch(url, data, config);

export const del = (url, config = {}) => api.delete(url, config);

export default api;
