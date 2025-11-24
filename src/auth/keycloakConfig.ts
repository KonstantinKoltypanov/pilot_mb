import Keycloak from "keycloak-js";

// Конфигурация Keycloak из переменных окружения
export const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL || "http://localhost:8080",
  realm: import.meta.env.VITE_KEYCLOAK_REALM || "master",
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || "mbpilot",
};

// Логируем конфигурацию для отладки
console.log("Keycloak конфигурация:", {
  url: keycloakConfig.url,
  realm: keycloakConfig.realm,
  clientId: keycloakConfig.clientId,
});

// Создаем экземпляр Keycloak
const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
