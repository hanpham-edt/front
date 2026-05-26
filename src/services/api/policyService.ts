import { apiClient } from "./axios-config";
import type {
  CreatePolicyPage,
  PolicyPage,
  UpdatePolicyPage,
} from "@/types/policy-types";

export const policyService = {
  async getAllPublic(): Promise<PolicyPage[]> {
    const { data } = await apiClient.get<PolicyPage[]>("/policies");
    return data;
  },

  async getBySlug(slug: string): Promise<PolicyPage> {
    const { data } = await apiClient.get<PolicyPage>(`/policies/slug/${slug}`);
    return data;
  },

  async getAllAdmin(): Promise<PolicyPage[]> {
    const { data } = await apiClient.get<PolicyPage[]>("/policies/admin/all");
    return data;
  },

  async getBySlugAdmin(slug: string): Promise<PolicyPage> {
    const { data } = await apiClient.get<PolicyPage>(
      `/policies/admin/${slug}`,
    );
    return data;
  },

  async create(payload: CreatePolicyPage): Promise<PolicyPage> {
    const { data } = await apiClient.post<PolicyPage>(
      "/policies/admin",
      payload,
    );
    return data;
  },

  async update(slug: string, payload: UpdatePolicyPage): Promise<PolicyPage> {
    const { data } = await apiClient.patch<PolicyPage>(
      `/policies/admin/${slug}`,
      payload,
    );
    return data;
  },

  async remove(slug: string): Promise<void> {
    await apiClient.delete(`/policies/admin/${slug}`);
  },
};
