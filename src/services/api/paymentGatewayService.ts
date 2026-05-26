import { apiClient } from "./axios-config";

async function simulate(
  path: string,
  orderId: string,
  success: boolean,
): Promise<{ redirectUrl: string }> {
  const { data } = await apiClient.post<{
    message: string;
    redirectUrl: string;
  }>(path, { orderId, success });
  return { redirectUrl: data.redirectUrl };
}

export const paymentGatewayService = {
  simulateMomo: (orderId: string, success: boolean) =>
    simulate("/payments/momo/mock/simulate", orderId, success),

  simulatePaypal: (orderId: string, success: boolean) =>
    simulate("/payments/paypal/mock/simulate", orderId, success),

  simulateStripe: (orderId: string, success: boolean) =>
    simulate("/payments/stripe/mock/simulate", orderId, success),

  simulateVnpay: (orderId: string, success: boolean) =>
    simulate("/payments/vnpay/mock/simulate", orderId, success),

  verifyStripeSession: (sessionId: string, orderId: string) =>
    apiClient.post("/payments/stripe/verify-session", null, {
      params: { sessionId, orderId },
    }),

  capturePaypal: (paypalOrderId: string, orderId: string) =>
    apiClient.post("/payments/paypal/capture", null, {
      params: { paypalOrderId, orderId },
    }),
};
