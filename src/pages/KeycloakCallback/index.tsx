import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Spin, Alert } from "antd";

export const KeycloakCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Парсим параметры из URL (Keycloak может использовать как hash, так и query параметры)
    const hash = location.hash;
    const search = location.search;

    // Проверяем наличие ошибки в параметрах
    const urlParams = new URLSearchParams(search);
    const hashParams = hash
      ? new URLSearchParams(hash.substring(1))
      : new URLSearchParams();

    const error = urlParams.get("error") || hashParams.get("error");
    const errorDescription =
      urlParams.get("error_description") || hashParams.get("error_description");
    const code = urlParams.get("code") || hashParams.get("code");

    console.log("Keycloak callback параметры:", {
      error,
      errorDescription,
      code,
      hash,
      search,
    });

    if (error) {
      console.error("Keycloak ошибка:", error, errorDescription);

      // Обрабатываем различные типы ошибок
      if (error === "login_required") {
        // Пользователь должен войти - очищаем URL и перенаправляем
        // Keycloak автоматически покажет форму входа при следующей попытке
        window.history.replaceState({}, document.title, "/");
        setTimeout(() => {
          navigate("/persons", { replace: true });
        }, 1000);
      } else {
        // Другие ошибки - очищаем URL и перенаправляем
        window.history.replaceState({}, document.title, "/");
        setTimeout(() => {
          navigate("/persons", { replace: true });
        }, 1000);
      }
    } else if (code) {
      // Успешный callback с кодом авторизации - Keycloak обработает его автоматически
      // Очищаем URL и перенаправляем
      window.history.replaceState({}, document.title, "/");
      setTimeout(() => {
        navigate("/persons", { replace: true });
      }, 500);
    } else {
      // Если нет ни ошибки, ни кода - просто перенаправляем
      window.history.replaceState({}, document.title, "/");
      setTimeout(() => {
        navigate("/persons", { replace: true });
      }, 500);
    }
  }, [location, navigate]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        gap: 20,
      }}
    >
      <Spin size="large" tip="Обработка авторизации..." />
      <Alert
        message="Перенаправление..."
        description="Пожалуйста, подождите, идет обработка авторизации"
        type="info"
        showIcon
      />
    </div>
  );
};
