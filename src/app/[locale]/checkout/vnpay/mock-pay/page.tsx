"use client";

import { Suspense } from "react";
import { Landmark, Loader2 } from "lucide-react";
import GatewayMockPay from "@/components/checkout/GatewayMockPay";
import { paymentGatewayService } from "@/services/api/paymentGatewayService";

export default function VnpayMockPayPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-emerald-200 bg-white p-8 shadow-sm">
        <Suspense
          fallback={
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
          }
        >
          <GatewayMockPay
            title="VNPay / ATM nội địa giả lập (dev)"
            envKey="VNPAY_MOCK"
            icon={Landmark}
            accentClass="bg-emerald-100 text-emerald-600"
            buttonClass="bg-emerald-600 hover:bg-emerald-700"
            simulate={paymentGatewayService.simulateVnpay}
          />
        </Suspense>
      </div>
    </div>
  );
}
