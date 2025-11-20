import axios, {type AxiosInstance, type AxiosRequestConfig, AxiosError } from 'axios';

// Создаем экземпляр axios с базовой конфигурацией
const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}:${import.meta.env.VITE_API_BASE_PORT}` || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor для запросов
axiosInstance.interceptors.request.use(
  (config) => {
    // Здесь можно добавить токен авторизации, например:
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor для ответов
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Обработка ошибок
    if (error.response) {
      // Сервер ответил с кодом ошибки
      switch (error.response.status) {
        case 401:
          // Неавторизован - можно перенаправить на страницу входа
          console.error('Unauthorized');
          break;
        case 403:
          console.error('Forbidden');
          break;
        case 404:
          console.error('Not Found');
          break;
        case 500:
          console.error('Server Error');
          break;
        default:
          console.error('Request Error:', error.message);
      }
    } else if (error.request) {
      // Запрос был отправлен, но ответа не получено
      console.error('Network Error:', error.message);
    } else {
      // Ошибка при настройке запроса
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

