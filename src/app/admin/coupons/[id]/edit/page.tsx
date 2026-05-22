"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { couponService } from "@/services/api/couponService";
import type { CouponType } from "@/types/coupon-types";

export default function EditCouponPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    code: "",
    type: "PERCENT" as CouponType,
    value: 10,
    minOrderAmount: 0,
    maxDiscount: "",
    usageLimit: "",
    isActive: true,
  });

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const c = await couponService.getById(String(id));
      setForm({
        code: c.code,
        type: c.type,
        value: c.value,
        minOrderAmount: c.minOrderAmount,
        maxDiscount: c.maxDiscount != null ? String(c.maxDiscount) : "",
        usageLimit: c.usageLimit != null ? String(c.usageLimit) : "",
        isActive: c.isActive,
      });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    try {
      await couponService.update(String(id), {
        code: form.code,
        type: form.type,
        value: Number(form.value),
        minOrderAmount: Number(form.minOrderAmount) || 0,
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
        isActive: form.isActive,
      });
      router.push("/admin/coupons");
    } catch {
      alert("Không cập nhật được mã.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/coupons" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Sửa mã {form.code}</h1>
      </div>
      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="space-y-4 rounded-lg bg-white p-6 shadow"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Mã
          </label>
          <input
            required
            value={form.code}
            onChange={(e) =>
              setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 uppercase"
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
              <option value="PERCENT">Phần trăm</option>
              <option value="FIXED">Cố định</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Giá trị
            </label>
            <input
              type="number"
              min={0}
              value={form.value}
              onChange={(e) =>
                setForm((f) => ({ ...f, value: Number(e.target.value) }))
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) =>
              setForm((f) => ({ ...f, isActive: e.target.checked }))
            }
          />
          Hoạt động
        </label>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-white hover:bg-orange-600 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Đang lưu..." : "Cập nhật"}
        </button>
      </form>
    </div>
  );
}
