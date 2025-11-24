import { useState, useCallback, useEffect } from "react";
import axiosInstance from "../api/axios";
import type { AxiosRequestConfig } from "axios";

interface UseApiOptions {
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  immediate?: boolean | FetchParams; // Выполнить запрос сразу при монтировании (можно передать параметры)
}

interface FetchParams {
  id?: string | number;
  body?: any;
  params?: Record<string, any>;
  config?: AxiosRequestConfig;
}

export const useApi = <T = any>({
  url,
  method,
  immediate = false,
}: UseApiOptions) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(
    async ({ id, body, params, config }: FetchParams = {}) => {
      setLoading(true);
      setError(null);

      try {
        let requestUrl = url;

        if (id !== undefined) {
          requestUrl = `${url}/${id}`;
        }

        let response;

        switch (method) {
          case "GET":
            response = await axiosInstance.get<T>(requestUrl, {
              params,
              ...config,
            });
            break;
          case "POST":
            response = await axiosInstance.post<T>(requestUrl, body, {
              params,
              ...config,
            });
            break;
          case "PUT":
            response = await axiosInstance.put<T>(requestUrl, body, {
              params,
              ...config,
            });
            break;
          case "PATCH":
            response = await axiosInstance.patch<T>(requestUrl, body, {
              params,
              ...config,
            });
            break;
          case "DELETE":
            response = await axiosInstance.delete<T>(requestUrl, {
              params,
              ...config,
            });
            break;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }

        setData(response.data);
        return response.data;
      } catch (err: any) {
        const error =
          err instanceof Error ? err : new Error("An error occurred");
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [url, method],
  );

  useEffect(() => {
    if (immediate) {
      if (typeof immediate === "boolean") {
        fetch();
      } else {
        fetch(immediate);
      }
    }
  }, []);

  return { data, fetch, loading, error };
};
