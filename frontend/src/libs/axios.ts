import { useAuthStore } from "@/features/auth/stores/authStore";
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.DEV
        ? import.meta.env.VITE_API_URL
        : "/api",
    withCredentials: true,
});

// ${window.location.hostname}

// Interceptor cho Request
api.interceptors.request.use((config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken && !config.url?.includes('/auth/')) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

// Interceptor cho Response
api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalRequest = err.config;

        if (![401, 403].includes(err.response?.status) || originalRequest._retry) {
            return Promise.reject(err);
        }

        originalRequest._retry = true;

        try {
            const res = await axios.post(
                `${api.defaults.baseURL}/auth/refresh`,
                {},
                { withCredentials: true }
            );

            const newAccessToken = res.data.accessToken;
            useAuthStore.getState().setAccessToken(newAccessToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
        } catch (refreshErr) {
            console.error("Refresh token thất bại");
            useAuthStore.getState().clearState();
            return Promise.reject(refreshErr);
        }
    }
);

export default api;