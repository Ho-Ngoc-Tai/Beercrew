import { LoadingStatus } from "@constants/status";

export interface PaginationMeta {
  page?: number;
  pageSize?: number;
  total?: number;
  totalPages?: number;
  hasMore?: boolean;
}

export interface FetchDataArgs {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filter?: Record<string, unknown>;
}

export interface ApiResponse<T = unknown> {
  code: number;
  success: boolean;
  message?: string;
  data: T;
  meta?: PaginationMeta;
  error?: string | Record<string, unknown>;
}

export interface BaseReducerState<T, P = FetchDataArgs> {
  status: LoadingStatus;
  error: unknown;
  params: P;
  total: number;
  items: T[];
  data?: T;
}
