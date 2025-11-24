# Настройка Keycloak

## Переменные окружения

Создайте файл `.env` в корне проекта со следующими переменными:

```env
# Keycloak конфигурация
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=master
VITE_KEYCLOAK_CLIENT_ID=mbpilot

# API конфигурация
VITE_API_BASE_URL=http://localhost:8080/api
# или
# VITE_API_BASE_URL=http://localhost:8080
# VITE_API_BASE_PORT=8080
```

## Настройка Keycloak

1. Убедитесь, что Keycloak сервер запущен
2. Создайте realm (или используйте существующий)
3. Создайте клиент с типом `public` (для SPA приложений)
4. Настройте Valid Redirect URIs для вашего приложения (например: `http://localhost:5173/*`)
5. Включите PKCE в настройках клиента

## Использование

Приложение автоматически:

- Инициализирует Keycloak при загрузке
- Добавляет токен авторизации во все API запросы
- Обновляет токен автоматически перед истечением
- Перенаправляет на страницу входа при ошибке 401

## Функции

В компонентах можно использовать хук `useKeycloak()`:

```typescript
import { useKeycloak } from "../auth/useKeycloak";

const MyComponent = () => {
  const { isAuthenticated, login, logout, token } = useKeycloak();

  // ...
};
```
