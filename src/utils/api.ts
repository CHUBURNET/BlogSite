import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://api-social-che-mc.vercel.app',
});

// ====== QUEUE ======
let isRefreshing = false;
let failedQueue: {
    resolve: (value: unknown) => void;
    reject: (reason?: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// ====== REQUEST ======
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

// ====== RESPONSE ======
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        if (error.response?.status === 401 && !originalRequest._retry) {

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        return axiosInstance(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refreshToken');

            if (!refreshToken) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/auth';
                return Promise.reject(error);
            }

            try {
                const { data } = await axiosInstance.post<{
                    success: boolean;
                    data: {
                        accessToken: string;
                        refreshToken: string;
                    };
                }>('/user/refresh', {
                    refreshToken,
                });

                // 👇 ВАЖНО: достаем из data.data
                const accessToken = data.data.accessToken;
                const newRefreshToken = data.data.refreshToken;

                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', newRefreshToken);

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                }

                processQueue(null, accessToken);

                return axiosInstance(originalRequest);

            } catch (err) {
                processQueue(err, null);

                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');

                window.location.href = '/auth';

                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export { axiosInstance };
