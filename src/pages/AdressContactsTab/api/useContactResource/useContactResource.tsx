import { useApi } from "../../../../hooks/useApi";
import { type ContactDTO } from "./interfaces";
export const useContactResource = () => {
  const getContactApi = useApi<ContactDTO[]>({
    url: "/api/contacts",
    method: "GET",
  });

  const putContactApi = useApi<any>({
    url: "/api/contacts",
    method: "PUT",
  });

  const deleteContactApi = useApi<any>({
    url: "/api/contacts",
    method: "DELETE",
  });

  const patchContactApi = useApi<any>({
    url: "/api/contacts",
    method: "PATCH",
  });

  const getContactsApi = useApi<any>({
    url: "/api/contacts",
    method: "GET",
  });

  const postContactsApi = useApi<any>({
    url: "/api/contacts",
    method: "POST",
  });

  // const getHistoryApi = useApi<any>({
  //   url: "/api/contacts/history",
  //   method: "GET",
  // });

  const getPersonContactsApi = useApi<ContactDTO[]>({
    url: "/api/contacts/persons",
    method: "GET",
  });

  // const getHistoryApi = useApi<any>({
  //   url: "/api/contacts/persons/history",
  //   method: "GET",
  // });

  const getCardApi = useApi<any>({
    url: "/api/contacts/persons/card",
    method: "GET",
  });

  return {
    getContactApi,
    putContactApi,
    deleteContactApi,
    patchContactApi,
    getContactsApi,
    postContactsApi,
    // getHistoryApi,
    getPersonContactsApi,
    // getHistoryApi,
    getCardApi,
  };
};
