import { useApi } from "../../hooks/useApi";

export const useReferenceResource = () => {
  const getRoleApi = useApi<any>({
    url: "/api/reference/role",
    method: "GET",
  });

  const getRoleSearchTypeApi = useApi<any>({
    url: "/api/reference/role-search-type",
    method: "GET",
  });

  const getPersonTypeApi = useApi<any>({
    url: "/api/reference/person-type",
    method: "GET",
  });

  const getOkopfApi = useApi<any>({
    url: "/api/reference/okopf",
    method: "GET",
  });

  const getNameAndIdentitySearchTypeApi = useApi<any>({
    url: "/api/reference/name-and-identity-search-type",
    method: "GET",
  });

  const getCountryApi = useApi<any>({
    url: "/api/reference/country",
    method: "GET",
  });

  return {
    getRoleApi,
    getRoleSearchTypeApi,
    getPersonTypeApi,
    getOkopfApi,
    getNameAndIdentitySearchTypeApi,
    getCountryApi,
  };
};
