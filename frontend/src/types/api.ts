export interface APIResponse<T = unknown> {
  code: number;
  message: string;
  data: T | null;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  total: number;
  page: number;
  page_size: number;
}
