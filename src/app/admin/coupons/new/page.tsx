"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { couponService } from "@/services/api/couponService";
import type { CouponType } from "@/types/coupon-types";

export default function NewCouponPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    code: "",
    type: "PERCENT" as CouponType,
    value: 10,
    minOrderAmount: 0,
    maxDiscount: "",
    usageLimit: "",
    startsAt: "",
    endsAt: "",
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await couponService.create({
        code: form.code,
        type: form.type,
        value: Number(form.value),
        minOrderAmount: Number(form.minOrderAmount) || 0,
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
        startsAt: form.startsAt || undefined,
        endsAt: form.endsAt || undefined,
        isActive: form.isActive,
      });
      router.push("/admin/coupons");
    } catch {
      alert("Không tạo được mã giảm giá.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/coupons" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Thêm mã giảm giá</h1>
      </div>
      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="space-y-4 rounded-lg bg-white p-6 shadow"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Mã *
          </label>
          <input
            required
            value={form.code}
            onChange={(e) =>
              setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 uppercase"
            placeholder="SALE10"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Loại
            </label>
            <select
              value={form.type}
              onChange={(e) =>
                setForm((f) => ({ ...f, type: e.target.value as CouponType }))
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="PERCENT">Phần trăm (%)</option>
              <option value="FIXED">Số tiền cố định</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Giá trị *
            </label>
            <input
              type="number"
              min={0}
              required
              value={form.value}
              onChange={(e) =>
                setForm((f) => ({ ...f, value: Number(e.target.value) }))
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Đơn tối thiểu (VNĐ)
            </label>
            <input
              type="number"
              min={0}
              value={form.minOrderAmount}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  minOrderAmount: Number(e.target.value),
                }))
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          {form.type === "PERCENT" ? (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Giảm tối đa (VNĐ)
              </label>
              <input
                type="number"
                min={0}
                value={form.maxDiscount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, maxDiscount: e.target.value }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          ) : null}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Giới hạn lượt dùng
            </label>
            <input
              type="number"
              min={1}
              value={form.usageLimit}
              onChange={(e) =>
                setForm((f) => ({ ...f, usageLimit: e.target.value }))
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm((f) => ({ ...f, isActive: e.target.checked }))
                }
              />
              Đang hoạt động
            </label>
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-white hover:bg-orange-600 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Đang lưu..." : "Lưu mã"}
        </button>
      </form>
    </div>
  );
}
