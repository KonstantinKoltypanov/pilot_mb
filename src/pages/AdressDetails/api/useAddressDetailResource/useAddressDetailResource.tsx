import { useApi } from "../../../../hooks/useApi";
import { type AddressDetailDTO } from "./interfaces";

export const useAddressDetailResource = () => {
  const getAddressDetailApi = useApi<AddressDetailDTO>({
    url: "/api/address-details",
    method: "GET",
  });

  const putAddressDetailApi = useApi<AddressDetailDTO>({
    url: "/api/address-details",
    method: "PUT",
  });

  const deleteAddressDetailApi = useApi<any>({
    url: "/api/address-details",
    method: "DELETE",
  });

  const patchAddressDetailApi = useApi<AddressDetailDTO>({
    url: "/api/address-details",
    method: "PATCH",
  });

  const getAddressDetailsApi = useApi<any>({
    url: "/api/address-details",
    method: "GET",
  });

  const postAddressDetailsApi = useApi<any>({
    url: "/api/address-details",
    method: "POST",
  });

  return {
    getAddressDetailApi,
    putAddressDetailApi,
    deleteAddressDetailApi,
    patchAddressDetailApi,
    getAddressDetailsApi,
    postAddressDetailsApi,
  };
};
