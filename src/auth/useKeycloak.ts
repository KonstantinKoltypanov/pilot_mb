import { useEffect, useState, useRef } from "react";
import keycloak from "./keycloakConfig";
import { keycloakConfig } from "./keycloakConfig";

interface KeycloakState {
  isAuthenticated: boolean;
  token: string | undefined;
  initialized: boolean;
}

// Глобальный флаг для отслеживания инициализации
let isKeycloakInitialized = false;

export const useKeycloak = () => {
  const [keycloakState, setKeycloakState] = useState<KeycloakState>({
    isAuthenticated: false,
    token: undefined,
    initialized: false,
  });
  const initAttemptedRef = useRef(false);
  const tokenRefreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Предотвращаем множественную инициализацию
    if (initAttemptedRef.current || isKeycloakInitialized) {
      // Если Keycloak уже инициализирован, просто обновляем состояние
      if (isKeycloakInitialized && keycloak.authenticated !== undefined) {
        setKeycloakState({
          isAuthenticated: keycloak.authenticated || false,
          token: keycloak.token,
          initialized: true,
        });
      }
      return;
    }

    initAttemptedRef.current = true;
    let tokenRefreshInterval: ReturnType<typeof setInterval> | null = null;

    // Таймаут для инициализации (10 секунд)
    timeoutRef.current = setTimeout(() => {
      // Проверяем, что инициализация еще не завершена
      if (!isKeycloakInitialized) {
        console.warn(
          "Таймаут инициализации Keycloak. Продолжаем работу без авторизации.",
        );
        isKeycloakInitialized = true;
        setKeycloakState({
          isAuthenticated: false,
          token: undefined,
          initialized: true,
        });
      }
    }, 10000);

    // Инициализация Keycloak
    keycloak
      .init({
        onLoad: "check-sso", // Проверка SSO при загрузке
        checkLoginIframe: false, // Отключаем проверку через iframe для производительности
        pkceMethod: "S256", // Используем PKCE для безопасности
        enableLogging: true, // Включаем логирование для отладки
        silentCheckSsoRedirectUri:
          window.location.origin + "/silent-check-sso.html", // Для silent check SSO
      })
      .then((authenticated) => {
        // Очищаем таймаут, так как инициализация завершена
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        // Устанавливаем флаг ДО обновления состояния, чтобы таймаут не сработал
        isKeycloakInitialized = true;
        console.log(
          "Keycloak инициализирован успешно. Авторизован:",
          authenticated,
        );
        setKeycloakState({
          isAuthenticated: authenticated,
          token: keycloak.token,
          initialized: true,
        });

        // Обновляем токен перед истечением (каждую минуту)
        if (authenticated) {
          // Очищаем предыдущий интервал, если он существует
          if (tokenRefreshIntervalRef.current) {
            clearInterval(tokenRefreshIntervalRef.current);
          }

          tokenRefreshIntervalRef.current = setInterval(() => {
            keycloak
              .updateToken(70) // Обновляем токен если осталось меньше 70 секунд
              .then((refreshed) => {
                if (refreshed) {
                  setKeycloakState((prev) => ({
                    ...prev,
                    token: keycloak.token || undefined,
                  }));
                }
              })
              .catch((error) => {
                console.error("Ошибка обновления токена:", error);
                // Если не удалось обновить токен, перенаправляем на логин
                keycloak.login();
              });
          }, 60000); // Проверяем каждую минуту
          tokenRefreshInterval = tokenRefreshIntervalRef.current;
        }
      })
      .catch((error) => {
        // Очищаем таймаут при ошибке
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        console.error("Ошибка инициализации Keycloak:", error);
        console.error("Конфигурация:", {
          url: keycloakConfig.url || "не указан",
          realm: keycloakConfig.realm || "не указан",
          clientId: keycloakConfig.clientId || "не указан",
        });
        // Устанавливаем initialized в true, чтобы приложение могло продолжить работу
        // даже если Keycloak недоступен (для разработки)
        isKeycloakInitialized = true;
        setKeycloakState({
          isAuthenticated: false,
          token: undefined,
          initialized: true,
        });
      });

    // Обработчик обновления токена
    keycloak.onTokenExpired = () => {
      keycloak
        .updateToken(70)
        .then((refreshed) => {
          if (refreshed) {
            setKeycloakState((prev) => ({
              ...prev,
              token: keycloak.token || undefined,
            }));
          }
        })
        .catch((error) => {
          console.error("Ошибка обновления истекшего токена:", error);
          keycloak.login();
        });
    };

    // Обработчик ошибок авторизации
    keycloak.onAuthError = (error) => {
      console.error("Ошибка авторизации Keycloak:", error);
    };

    // Очистка интервала и таймаута при размонтировании
    return () => {
      if (tokenRefreshIntervalRef.current) {
        clearInterval(tokenRefreshIntervalRef.current);
        tokenRefreshIntervalRef.current = null;
      }
      if (tokenRefreshInterval) {
        clearInterval(tokenRefreshInterval);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  const login = () => {
    keycloak.login();
  };

  const logout = () => {
    keycloak.logout();
  };

  const getToken = () => {
    return keycloak.token;
  };

  return {
    ...keycloakState,
    login,
    logout,
    getToken,
    keycloak,
  };
};
