import { useApi } from "../../../../hooks/useApi";
import type { AddressDTO } from "./interfaces";

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

  const getPersonAdressApi = useApi<AddressDTO[]>({
    url: "/api/addresses/persons",
    method: "GET",
  });

  const getCardApi = useApi<any>({
    url: "/api/addresses/persons/card",
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
    getCardApi,
  };
};
