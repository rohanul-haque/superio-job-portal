export interface IApiResponse<T = unknown> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPage?: number;
  };
  errorSources?: Array<{
    path: string | number;
    message: string;
  }>;
}
