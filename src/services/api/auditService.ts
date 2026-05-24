import { apiClient } from "./axios-config";

export interface AuditLog {
  id: string;
  userId: string | null;
  userEmail: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  detail: string | null;
  createdAt: string;
}

export interface AuditLogResponse {
  data: AuditLog[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const auditService = {
  async getAll(params?: {
    page?: number;
    limit?: number;
    action?: string;
    entity?: string;
  }): Promise<AuditLogResponse> {
    const { data } = await apiClient.get<AuditLogResponse>("/audit-logs", {
      params,
    });
    return data;
  },
};
