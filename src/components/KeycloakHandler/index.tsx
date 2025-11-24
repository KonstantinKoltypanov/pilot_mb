import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useKeycloak } from "../../auth/useKeycloak";

/**
 * Компонент для обработки Keycloak callback параметров в URL
 * Обрабатывает параметры авторизации и перенаправляет только на страницы списка
 */
export const KeycloakHandler: React.FC = () => {
  const { initialized } = useKeycloak();
  const location = useLocation();
  const navigate = useNavigate();
  console.log(initialized);
  useEffect(() => {
    if (!initialized) return;

    const hash = location.hash;
    const search = location.search;

    // Проверяем наличие параметров Keycloak в URL
    const hasKeycloakParams =
      (hash &&
        (hash.includes("error=") ||
          hash.includes("code=") ||
          hash.includes("state="))) ||
      (search &&
        (search.includes("error=") ||
          search.includes("code=") ||
          search.includes("state=")));

    if (hasKeycloakParams) {
      // Парсим параметры из URL
      const urlParams = new URLSearchParams(search);
      const hashParams = hash
        ? new URLSearchParams(hash.substring(1))
        : new URLSearchParams();

      const error = urlParams.get("error") || hashParams.get("error");
      const code = urlParams.get("code") || hashParams.get("code");

      console.log("Keycloak callback параметры:", {
        error,
        code,
        hash,
        search,
      });

      // Очищаем URL от параметров Keycloak
      window.history.replaceState({}, document.title, location.pathname);

      // Перенаправляем только если мы НЕ на странице карточки персоны
      // и только на страницы списка (/ или /persons)
      if (error || code) {
        const currentPath = location.pathname;
        // Не перенаправляем, если мы на странице карточки персоны
        if (currentPath !== "/persons") {
          console.log(
            "KeycloakHandler: Пропускаем перенаправление на странице карточки персоны",
          );
          return;
        }

        // Перенаправляем только на страницы списка

        setTimeout(() => {
          navigate(currentPath, { replace: true });
        }, 500);
      }
    }
  }, [location, initialized, navigate]);

  // Этот компонент не рендерит ничего видимого
  return null;
};
