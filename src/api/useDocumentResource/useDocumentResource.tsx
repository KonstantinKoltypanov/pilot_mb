import type { DocumentCard, DocumentDTO, DocumentRevision } from "./interfaces";
import { useApi } from "../../hooks/useApi";

export const useDocumentResource = () => {
  const getDocumentApi = useApi<DocumentDTO>({
    url: "/api/documents",
    method: "GET",
  });

  const putDocumentApi = useApi<DocumentDTO>({
    url: "/api/documents",
    method: "PUT",
  });

  const deleteDocumentApi = useApi<any>({
    url: "/api/documents",
    method: "DELETE",
  });

  const patchDocumentApi = useApi<any>({
    url: "/api/documents",
    method: "PATCH",
  });

  const getDocumentsApi = useApi<any>({
    url: "/api/documents",
    method: "GET",
  });

  const postDocumentsApi = useApi<any>({
    url: "/api/documents",
    method: "POST",
  });

  const getPersonDocumentApi = useApi<DocumentDTO>({
    url: "/api/documents/persons",
    method: "GET",
  });
  const getDocumentCardApi = useApi<DocumentCard>({
    url: "/api/documents/:id/card",
    method: "GET",
  });
  const getDocumentsCardApi = useApi<any>({
    url: "/api/documents/persons/:id/card",
    method: "GET",
  });

  const getDocumentHistoryApi = useApi<DocumentRevision[]>({
    url: "/api/documents/:id/history",
    method: "GET",
  });

  return {
    getDocumentApi,
    putDocumentApi,
    deleteDocumentApi,
    patchDocumentApi,
    getDocumentsApi,
    postDocumentsApi,
    getPersonDocumentApi,
    getDocumentsCardApi,
    getDocumentCardApi,
    getDocumentHistoryApi,
  };
};
