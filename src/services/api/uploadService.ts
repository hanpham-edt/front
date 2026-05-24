import type { MediaFolder } from "@/lib/media-folders";
import { apiClient } from "./axios-config";

export interface UploadImageResponse {
  id: string;
  url: string;
}

export const uploadService = {
  uploadProductImage: async (
    file: File,
    folder?: MediaFolder,
  ): Promise<UploadImageResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<UploadImageResponse>(
      "/uploads/image",
      formData,
      {
        params: folder ? { folder } : undefined,
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
      },
    );

    return response.data;
  },
};
