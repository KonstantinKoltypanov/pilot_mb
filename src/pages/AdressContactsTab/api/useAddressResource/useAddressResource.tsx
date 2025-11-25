import { useApi } from "../../../../hooks/useApi";
import type { AddressCard, AddressDTO, AddressRevision } from "./interfaces";

export const useAddressResource = () => {
  const getAddresseApi = useApi<AddressDTO>({
    url: "/api/addresses",
    method: "GET",
  });

  const putAddresseApi = useApi<AddressDTO>({
    url: "/api/addresses",
    method: "PUT",
  });

  const deleteAddresseApi = useApi<{}>({
    url: "/api/addresses",
    method: "DELETE",
  });

  const patchAddresseApi = useApi<AddressDTO>({
    url: "/api/addresses",
    method: "PATCH",
  });

  const getAddressesApi = useApi<AddressDTO[]>({
    url: "/api/addresses",
    method: "GET",
  });

  const postAddressesApi = useApi<any>({
    url: "/api/addresses",
    method: "POST",
  });

  const getAdressCardApi = useApi<AddressCard>({
    url: "/api/addresses/:id/card",
    method: "GET",
  });

  const getPersonAdressApi = useApi<AddressDTO[]>({
    url: "/api/addresses/persons",
    method: "GET",
  });

  const getPersonAdressCardApi = useApi<any>({
    url: "/api/addresses/persons/:id/card",
    method: "GET",
  });

  const getAddressHistoryApi = useApi<AddressRevision[]>({
    url: "/api/addresses/:id/history",
    method: "GET",
  });

  return {
    getAddresseApi,
    putAddresseApi,
    deleteAddresseApi,
    patchAddresseApi,
    getAddressesApi,
    postAddressesApi,
    getPersonAdressApi,
    getPersonAdressCardApi,
    getAdressCardApi,
    getAddressHistoryApi,
  };
};
