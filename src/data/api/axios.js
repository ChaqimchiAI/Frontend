import axios from "axios";

const api = axios.create({
  baseURL: "https://erpbackend.pythonanywhere.com/api/v1",
});

/* =========================
   REQUEST INTERCEPTOR token qo‘shadi
========================= */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* =========================
   AUTO REFRESH TOKEN
========================= */

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Refresh endpoint o'zi 401 qaytarsa, cheksiz loop bo'lmasligi uchun o'tkazib yuboramiz
    const isRefreshRequest =
      originalRequest.url?.includes("/auth/refresh");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshRequest
    ) {
      // Agar refresh token yo'q bo'lsa, to'g'ridan-to'g'ri login ga o'tamiz
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Server kutayotgan body formatida yuboramiz
        const res = await axios.post(
          "https://erpbackend.pythonanywhere.com/api/v1/auth/refresh/",
          { refresh: refreshToken }
        );

        // Server javob formatini aniqlash (res.data.data.access yoki res.data.access)
        const newAccessToken =
          res.data?.data?.access ||
          res.data?.access ||
          res.data?.access_token;

        const newRefreshToken =
          res.data?.data?.refresh ||
          res.data?.refresh ||
          res.data?.refresh_token;

        if (!newAccessToken) {
          throw new Error("Refresh javobida access token topilmadi");
        }

        localStorage.setItem("access_token", newAccessToken);

        // Yangi refresh token ham qaytarilgan bo'lsa — yangilaymiz
        if (newRefreshToken) {
          localStorage.setItem("refresh_token", newRefreshToken);
        }

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
