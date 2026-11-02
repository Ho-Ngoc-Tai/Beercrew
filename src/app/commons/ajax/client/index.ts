import { clientService } from "./service";
import { ApiResponse } from "@interfaces/base";
import { AxiosRequestConfig } from "axios";

export const get = <T = unknown>(
  url: string,
  params?: Record<string, unknown>,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => clientService.get<T>(url, params, config);

export const post = <T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => clientService.post<T>(url, data, config);

export const put = <T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => clientService.put<T>(url, data, config);

export const patch = <T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => clientService.patch<T>(url, data, config);

export const del = <T = unknown>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => clientService.delete<T>(url, config);

export { clientService };
