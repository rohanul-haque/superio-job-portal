import type { IApiResponse } from "@/interfaces/api-response.interface";

export type ApiResponse<T = unknown> = IApiResponse<T>;

export type SortOrder = "asc" | "desc";

export type StatusVariant = "default" | "success" | "warning" | "destructive" | "info" | "outline";
