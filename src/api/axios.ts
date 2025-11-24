import axios, {
  type AxiosInstance,
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import keycloak from "../auth/keycloakConfig";

const getBaseURL = (): string => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const port = import.meta.env.VITE_API_BASE_PORT;

  if (
    baseUrl &&
    (baseUrl.startsWith("http://") || baseUrl.startsWith("https://"))
  ) {
    return baseUrl;
  }

  if (baseUrl && port) {
    return `${baseUrl}:${port}`;
  }

  if (baseUrl) {
    return baseUrl;
  }

  return "http://localhost:8080";
};

const axiosInstance: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      if (keycloak && keycloak.authenticated && keycloak.token) {
        try {
          await keycloak.updateToken(70);
          if (keycloak.token) {
            config.headers.Authorization = `Bearer ${keycloak.token}`;
          }
        } catch (error) {
          console.warn("Не удалось обновить токен Keycloak:", error);
          if (keycloak.token) {
            config.headers.Authorization = `Bearer ${keycloak.token}`;
          }
        }
      }
    } catch (error) {
      console.warn("Keycloak не доступен для добавления токена:", error);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error("Unauthorized - требуется авторизация");
          try {
            if (keycloak && keycloak.authenticated) {
              keycloak.updateToken(70).catch(() => {
                if (keycloak.login) {
                  keycloak.login();
                }
              });
            } else {
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
      console.error("Network Error:", error.message);
    } else {
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
