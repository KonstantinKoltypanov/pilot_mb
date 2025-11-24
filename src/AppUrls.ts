import { PersonCard } from "./pages/PersonCard";
import { PersonList } from "./pages/PersonList";
import { KeycloakCallback } from "./pages/KeycloakCallback";
import type { RouteConfig } from "./types/router";

/**
 * Константы URL-путей приложения
 */
export const AppUrls = {
  // Добавьте ваши URL-пути здесь
  // Пример:
  // HOME: '/',
  // ABOUT: '/about',
  PERSON_CARD: "/person/:id",
  PERSON_LIST: "/persons",
  KEYCLOAK_CALLBACK: "/keycloak-callback", // Обработка Keycloak callback
} as const;

/**
 * Объект роутинга: путь и компонент
 * ВАЖНО: Более специфичные маршруты должны идти первыми
 */
export const routes: RouteConfig[] = [
  {
    path: AppUrls.KEYCLOAK_CALLBACK,
    component: KeycloakCallback,
  },
  {
    path: AppUrls.PERSON_CARD,
    component: PersonCard,
  },
  {
    path: AppUrls.PERSON_LIST,
    component: PersonList,
  },
  {
    path: "/",
    component: PersonList, // Главная страница по умолчанию
  },
  // Добавьте другие маршруты здесь
  // {
  //   path: '/document/:id',
  //   component: DocumentCard,
  // },
];
