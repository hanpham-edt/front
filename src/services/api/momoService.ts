import { apiClient } from "./axios-config";

export const momoService = {
  isMockMode: async (): Promise<boolean> => {
    try {
      const { data } = await apiClient.get<{ mock: boolean }>(
        "/payments/momo/mock/status",
      );
      return data.mock === true;
    } catch {
      return false;
    }
  },

  simulatePayment: async (
    orderId: string,
    success: boolean,
  ): Promise<{ redirectUrl: string }> => {
    const { data } = await apiClient.post<{
      message: string;
      redirectUrl: string;
    }>("/payments/momo/mock/simulate", { orderId, success });
    return { redirectUrl: data.redirectUrl };
  },
};
