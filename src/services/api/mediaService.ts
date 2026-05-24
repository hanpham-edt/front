import type { MediaFolder } from "@/lib/media-folders";
import { apiClient } from "./axios-config";

export interface MediaAsset {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  alt?: string | null;
  folder: string;
  uploadedBy?: {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface MediaListResponse {
  data: MediaAsset[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface MediaFolderSummary {
  folder: MediaFolder;
  label: string;
  count: number;
}

export const mediaService = {
  getFolders: async (): Promise<MediaFolderSummary[]> => {
    const response = await apiClient.get<MediaFolderSummary[]>(
      "/media/folders",
    );
    return response.data;
  },

  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    folder?: MediaFolder;
  }): Promise<MediaListResponse> => {
    const response = await apiClient.get<MediaListResponse>("/media", {
      params,
    });
    return response.data;
  },

  upload: async (
    file: File,
    folder?: MediaFolder,
  ): Promise<{ id: string; url: string; folder: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    if (folder) {
      formData.append("folder", folder);
    }
    const response = await apiClient.post<{
      id: string;
      url: string;
      folder: string;
    }>("/media/upload", formData, {
      params: folder ? { folder } : undefined,
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000,
    });
    return response.data;
  },

  remove: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(
      `/media/${id}`,
    );
    return response.data;
  },
};
