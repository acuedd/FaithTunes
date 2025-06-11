import axios from 'axios';
import { store } from '../store';
import { refreshAccessToken } from '../services/auth.service';
import { setTokens, logout } from '../store/slices/authSlice';

const API = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API,
});

// Attach Authorization header with access token from Redux store to every request
api.interceptors.request.use(
  (config) => {
    const { auth } = store.getState();
    const token = auth.accessToken;

    if (token && config.headers?.set) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(error => Promise.reject(error));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { auth } = store.getState();
        const { refreshToken } = auth;
        const data = await refreshAccessToken(refreshToken as string);

        store.dispatch(setTokens({
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          user: data.user,
        }));

        api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
        originalRequest.headers['Authorization'] = `Bearer ${data.access_token}`;

        processQueue(null, data.access_token);
        return api(originalRequest);
      } catch (error) {
        processQueue(error, null);
        store.dispatch(logout());
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default api;