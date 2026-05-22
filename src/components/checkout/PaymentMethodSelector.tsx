"use client";

import type { PublicPaymentOptions } from "@/types/settings-types";
import {
  getEnabledPaymentMethods,
  type PaymentMethodCode,
} from "@/lib/payment-methods";

interface PaymentMethodSelectorProps {
  options: PublicPaymentOptions;
  value: PaymentMethodCode | "";
  onChange: (code: PaymentMethodCode) => void;
  disabled?: boolean;
}

export default function PaymentMethodSelector({
  options,
  value,
  onChange,
  disabled,
}: PaymentMethodSelectorProps) {
  const methods = getEnabledPaymentMethods(options);

  if (methods.length === 0) {
    return (
      <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Hiện chưa có phương thức thanh toán nào được bật. Vui lòng liên hệ cửa
        hàng.
      </p>
    );
  }

  return (
    <div className="space-y-3" role="radiogroup" aria-label="Phương thức thanh toán">
      {methods.map((method) => {
        const Icon = method.icon;
        const selected = value === method.code;
        return (
          <label
            key={method.code}
            className={`flex cursor-pointer gap-3 rounded-lg border p-4 transition ${
              selected
                ? "border-orange-500 bg-orange-50 ring-1 ring-orange-500"
                : "border-gray-200 hover:border-orange-200 hover:bg-gray-50"
            } ${disabled ? "pointer-events-none opacity-60" : ""}`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.code}
              checked={selected}
              disabled={disabled}
              onChange={() => onChange(method.code)}
              className="mt-1 h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <Icon
              className={`h-5 w-5 shrink-0 ${selected ? "text-orange-600" : "text-gray-400"}`}
            />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900">{method.label}</p>
              <p className="mt-0.5 text-sm text-gray-600">{method.description}</p>
            </div>
          </label>
        );
      })}
    </div>
  );
}
