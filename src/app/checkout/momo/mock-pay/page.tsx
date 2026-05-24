"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Smartphone } from "lucide-react";
import { momoService } from "@/services/api/momoService";

function MockPayContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [loading, setLoading] = useState<"success" | "fail" | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!orderId) {
    return (
      <p className="text-center text-gray-600">
        Thiếu mã đơn hàng.{" "}
        <Link href="/" className="text-orange-600 hover:underline">
          Về trang chủ
        </Link>
      </p>
    );
  }

  const handleSimulate = async (success: boolean) => {
    setLoading(success ? "success" : "fail");
    setError(null);
    try {
      const { redirectUrl } = await momoService.simulatePayment(
        orderId,
        success,
      );
      router.replace(redirectUrl);
    } catch (err: unknown) {
      let msg =
        "Không mô phỏng được. Kiểm tra API đã bật MOMO_MOCK=true trong api/.env và đã restart server.";
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response
      ) {
        const data = err.response.data as { message?: string | string[] };
        if (typeof data.message === "string") msg = data.message;
        else if (Array.isArray(data.message)) msg = data.message.join(", ");
      }
      setError(msg);
      setLoading(null);
    }
  };

  return (
    <>
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100">
        <Smartphone className="h-8 w-8 text-pink-600" />
      </div>
      <h1 className="mb-2 text-center text-xl font-bold text-gray-900">
        MoMo giả lập (dev)
      </h1>
      <p className="mb-6 text-center text-sm text-gray-600">
        Đây là trang thay thế cổng MoMo khi{" "}
        <code className="rounded bg-gray-100 px-1">MOMO_MOCK=true</code>. Chọn
        kết quả để kiểm tra luồng thanh toán — không trừ tiền thật.
      </p>
      <p className="mb-6 text-center font-mono text-xs text-gray-500">
        orderId: {orderId}
      </p>

      {error ? (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          disabled={loading !== null}
          onClick={() => void handleSimulate(true)}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-pink-600 px-4 py-3 font-semibold text-white hover:bg-pink-700 disabled:opacity-60"
        >
          {loading === "success" ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : null}
          Thanh toán thành công
        </button>
        <button
          type="button"
          disabled={loading !== null}
          onClick={() => void handleSimulate(false)}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
        >
          {loading === "fail" ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : null}
          Thanh toán thất bại
        </button>
      </div>

      <p className="mt-6 text-center text-xs text-gray-400">
        Khi có tài khoản MoMo sandbox, tắt MOMO_MOCK và điền credentials thật.
      </p>
    </>
  );
}

export default function MomoMockPayPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-pink-200 bg-white p-8 shadow-sm">
        <Suspense
          fallback={
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-pink-600" />
            </div>
          }
        >
          <MockPayContent />
        </Suspense>
      </div>
    </div>
  );
}
