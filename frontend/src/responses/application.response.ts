import type { IJobApplication } from "@/interfaces/application.interface";

export interface IApplicationListResponse {
  applications: IJobApplication[];
  total?: number;
}

export interface IApplicationDetailResponse {
  application: IJobApplication;
}
