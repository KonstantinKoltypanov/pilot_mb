import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useKeycloak } from "../../auth/useKeycloak";

export const KeycloakHandler: React.FC = () => {
  const { initialized } = useKeycloak();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!initialized) return;

    const hash = location.hash;
    const search = location.search;

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

      window.history.replaceState({}, document.title, location.pathname);

      if (error || code) {
        const currentPath = location.pathname;
        if (currentPath !== "/persons") {
          console.log(
            "KeycloakHandler: Пропускаем перенаправление на странице карточки персоны",
          );
          return;
        }

        setTimeout(() => {
          navigate(currentPath, { replace: true });
        }, 500);
      }
    }
  }, [location, initialized, navigate]);

  return null;
};
