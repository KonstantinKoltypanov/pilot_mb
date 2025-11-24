import { useEffect, useState, useRef } from "react";
import keycloak from "./keycloakConfig";
import { keycloakConfig } from "./keycloakConfig";

interface KeycloakState {
  isAuthenticated: boolean;
  token: string | undefined;
  initialized: boolean;
}

let isKeycloakInitialized = false;
let keycloakInitPromise: Promise<boolean> | null = null;

export const useKeycloak = () => {
  const [keycloakState, setKeycloakState] = useState<KeycloakState>(() => {
    // Быстрая проверка: если Keycloak уже инициализирован, сразу возвращаем состояние
    if (isKeycloakInitialized && keycloak.authenticated !== undefined) {
      return {
        isAuthenticated: keycloak.authenticated || false,
        token: keycloak.token,
        initialized: true,
      };
    }
    return {
      isAuthenticated: false,
      token: undefined,
      initialized: false,
    };
  });
  const initAttemptedRef = useRef(false);
  const tokenRefreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Если уже инициализирован, сразу обновляем состояние
    if (isKeycloakInitialized && keycloak.authenticated !== undefined) {
      setKeycloakState({
        isAuthenticated: keycloak.authenticated || false,
        token: keycloak.token,
        initialized: true,
      });
      return;
    }

    // Если уже есть промис инициализации, ждем его
    if (keycloakInitPromise) {
      keycloakInitPromise
        .then((authenticated) => {
          setKeycloakState({
            isAuthenticated: authenticated,
            token: keycloak.token,
            initialized: true,
          });
        })
        .catch(() => {
          setKeycloakState({
            isAuthenticated: false,
            token: undefined,
            initialized: true,
          });
        });
      return;
    }

    if (initAttemptedRef.current) {
      return;
    }

    initAttemptedRef.current = true;
    let tokenRefreshInterval: ReturnType<typeof setInterval> | null = null;

    // Уменьшаем таймаут до 5 секунд
    timeoutRef.current = setTimeout(() => {
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
    }, 5000);

    // Создаем промис инициализации, чтобы другие хуки могли его использовать
    keycloakInitPromise = keycloak
      .init({
        onLoad: "check-sso",
        checkLoginIframe: false,
        pkceMethod: "S256",
        enableLogging: true,
        // Убираем silentCheckSsoRedirectUri для ускорения - он вызывает дополнительные запросы
      })
      .then((authenticated) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

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

        if (authenticated) {
          if (tokenRefreshIntervalRef.current) {
            clearInterval(tokenRefreshIntervalRef.current);
          }

          tokenRefreshIntervalRef.current = setInterval(() => {
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
                console.error("Ошибка обновления токена:", error);
                keycloak.login();
              });
          }, 60000);
          tokenRefreshInterval = tokenRefreshIntervalRef.current;
        }

        return authenticated;
      })
      .catch((error) => {
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
        isKeycloakInitialized = true;
        setKeycloakState({
          isAuthenticated: false,
          token: undefined,
          initialized: true,
        });
        throw error;
      });

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

    keycloak.onAuthError = (error) => {
      console.error("Ошибка авторизации Keycloak:", error);
    };

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
