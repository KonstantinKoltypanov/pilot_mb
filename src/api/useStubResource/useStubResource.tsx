import { useApi } from "../../hooks/useApi";

export const useStubResource = () => {
  const getPersonsApi = useApi<any>({
    url: "/api/data/persons",
    method: "GET",
  });

  const getPersonApi = useApi<any>({
    url: "/api/data/persons",
    method: "GET",
  });

  const getBeneficiariesApi = useApi<any>({
    url: "/api/data/beneficiaries",
    method: "GET",
  });

  return {
    getPersonsApi,
    getPersonApi,
    getBeneficiariesApi,
  };
};
