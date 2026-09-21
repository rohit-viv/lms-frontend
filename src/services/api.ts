import axios from 'axios';

const AUTH_LOGOUT_EVENT = 'auth:logout';

const api = axios.create({
    baseURL:
        process.env.NEXT_PUBLIC_API_URL ||
        'http://localhost:4000/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token =
                localStorage.getItem('accessToken');

            if (token) {
                config.headers.Authorization =
                    `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            const refreshToken =
                localStorage.getItem('refreshToken');

            if (!refreshToken) {
                return Promise.reject(error);
            }

            try {
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1'}/auth/refresh`,
                    {
                        refreshToken,
                    },
                );

                const payload =
                    response.data.data ??
                    response.data;
                const newAccessToken =
                    payload?.accessToken;
                const newRefreshToken =
                    payload?.refreshToken;

                if (!newAccessToken) {
                    throw new Error(
                        'Refresh token response did not include a new access token.',
                    );
                }

                localStorage.setItem(
                    'accessToken',
                    newAccessToken,
                );

                if (newRefreshToken) {
                    localStorage.setItem(
                        'refreshToken',
                        newRefreshToken,
                    );
                }

                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                window.dispatchEvent(
                    new CustomEvent(AUTH_LOGOUT_EVENT),
                );

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);

export default api;
export { AUTH_LOGOUT_EVENT };
