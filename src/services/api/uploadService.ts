import { apiClient } from "./axios-config";

export interface UploadImageResponse {
  url: string;
}

export const uploadService = {
  uploadProductImage: async (file: File): Promise<UploadImageResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<UploadImageResponse>(
      "/uploads/image",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
      },
    );

    return response.data;
  },
};
