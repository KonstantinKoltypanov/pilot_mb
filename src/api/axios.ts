import axios, {
  type AxiosInstance,
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import keycloak from "../auth/keycloakConfig";

// Создаем экземпляр axios с базовой конфигурацией
const getBaseURL = (): string => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const port = import.meta.env.VITE_API_BASE_PORT;

  // Если задан полный URL (с протоколом), используем его
  if (
    baseUrl &&
    (baseUrl.startsWith("http://") || baseUrl.startsWith("https://"))
  ) {
    return baseUrl;
  }

  // Если заданы и URL и порт, комбинируем их
  if (baseUrl && port) {
    return `${baseUrl}:${port}`;
  }

  // Если задан только URL, используем его
  if (baseUrl) {
    return baseUrl;
  }

  // Значение по умолчанию
  return "http://localhost:8080/api";
};

const axiosInstance: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor для запросов - добавляем токен Keycloak
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Получаем токен из Keycloak
    try {
      if (keycloak && keycloak.authenticated && keycloak.token) {
        // Обновляем токен если он скоро истечет
        try {
          await keycloak.updateToken(70);
          if (keycloak.token) {
            config.headers.Authorization = `Bearer ${keycloak.token}`;
          }
        } catch (error) {
          console.warn("Не удалось обновить токен Keycloak:", error);
          // Если токен все еще есть, используем его
          if (keycloak.token) {
            config.headers.Authorization = `Bearer ${keycloak.token}`;
          }
        }
      }
    } catch (error) {
      // Если Keycloak не инициализирован, продолжаем без токена
      console.warn("Keycloak не доступен для добавления токена:", error);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
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
          // Неавторизован - перенаправляем на страницу входа Keycloak
          console.error("Unauthorized - требуется авторизация");
          try {
            if (keycloak && keycloak.authenticated) {
              // Если пользователь был авторизован, но токен истек, обновляем его
              keycloak.updateToken(70).catch(() => {
                if (keycloak.login) {
                  keycloak.login();
                }
              });
            } else {
              // Если пользователь не авторизован, перенаправляем на логин
              if (keycloak && keycloak.login) {
                keycloak.login();
              }
            }
          } catch (error) {
            console.error("Ошибка при обработке 401:", error);
          }
          break;
        case 403:
          console.error("Forbidden");
          break;
        case 404:
          console.error("Not Found");
          break;
        case 500:
          console.error("Server Error");
          break;
        default:
          console.error("Request Error:", error.message);
      }
    } else if (error.request) {
      // Запрос был отправлен, но ответа не получено
      console.error("Network Error:", error.message);
    } else {
      // Ошибка при настройке запроса
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
