import { PersonCard } from "./pages/PersonCard";
import { PersonList } from "./pages/PersonList";
import { KeycloakCallback } from "./pages/KeycloakCallback";
import type { RouteConfig } from "./types/router";

export const AppUrls = {
  PERSON_CARD: "/person/:id",
  PERSON_LIST: "/persons",
  KEYCLOAK_CALLBACK: "/keycloak-callback",
} as const;

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
    component: PersonList,
  },
];
