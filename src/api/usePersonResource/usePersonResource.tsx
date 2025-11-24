import { useApi } from "../../hooks/useApi";
import type { PersonDTO } from "./interfaces";

export const usePersonResource = () => {
  const getPeopleApi = useApi<PersonDTO>({
    url: "/api/people",
    method: "GET",
  });

  const putPeopleApi = useApi<any>({
    url: "/api/people",
    method: "PUT",
  });

  const deletePeopleApi = useApi<any>({
    url: "/api/people",
    method: "DELETE",
  });

  const patchPeopleApi = useApi<any>({
    url: "/api/people",
    method: "PATCH",
  });

  const getPeoplesApi = useApi<any>({
    url: "/api/people",
    method: "GET",
  });

  const postPeopleApi = useApi<any>({
    url: "/api/people",
    method: "POST",
  });

  const getHistoryPeopleApi = useApi<any>({
    url: "/api/people/history",
    method: "GET",
  });

  const getCardApi = useApi<any>({
    url: "/api/people/card",
    method: "GET",
  });

  const getXlsxApi = useApi<any>({
    url: "/api/people/xlsx",
    method: "GET",
  });

  const getHistoryPeoplesApi = useApi<any>({
    url: "/api/people/history",
    method: "GET",
  });

  return {
    getPeopleApi,
    putPeopleApi,
    deletePeopleApi,
    patchPeopleApi,
    getPeoplesApi,
    postPeopleApi,
    getHistoryPeopleApi,
    getCardApi,
    getXlsxApi,
    getHistoryPeoplesApi,
  };
};
