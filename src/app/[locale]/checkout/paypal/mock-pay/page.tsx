"use client";

import { Suspense } from "react";
import { Loader2, Wallet } from "lucide-react";
import GatewayMockPay from "@/components/checkout/GatewayMockPay";
import { paymentGatewayService } from "@/services/api/paymentGatewayService";

export default function PaypalMockPayPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-blue-200 bg-white p-8 shadow-sm">
        <Suspense
          fallback={
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          }
        >
          <GatewayMockPay
            title="PayPal giả lập (dev)"
            envKey="PAYPAL_MOCK"
            icon={Wallet}
            accentClass="bg-blue-100 text-blue-600"
            buttonClass="bg-blue-600 hover:bg-blue-700"
            simulate={paymentGatewayService.simulatePaypal}
          />
        </Suspense>
      </div>
    </div>
  );
}
