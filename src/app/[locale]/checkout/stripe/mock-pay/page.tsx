"use client";

import { Suspense } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import GatewayMockPay from "@/components/checkout/GatewayMockPay";
import { paymentGatewayService } from "@/services/api/paymentGatewayService";

export default function StripeMockPayPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-indigo-200 bg-white p-8 shadow-sm">
        <Suspense
          fallback={
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          }
        >
          <GatewayMockPay
            title="Thẻ Visa/Mastercard giả lập (dev)"
            envKey="STRIPE_MOCK"
            icon={CreditCard}
            accentClass="bg-indigo-100 text-indigo-600"
            buttonClass="bg-indigo-600 hover:bg-indigo-700"
            simulate={paymentGatewayService.simulateStripe}
          />
        </Suspense>
      </div>
    </div>
  );
}
