"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { ProductService } from "@/services/api/productService";

type StockMovement = {
  id: string;
  type: string;
  quantity: number;
  stockBefore: number;
  stockAfter: number;
  note: string | null;
  userEmail: string | null;
  createdAt: string;
};

export default function StockAdjustPanel({
  productId,
  currentStock,
  onStockChanged,
}: {
  productId: string;
  currentStock: number;
  onStockChanged: () => void;
}) {
  const [delta, setDelta] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await ProductService.getStockMovements(productId);
      setMovements(res.data);
    } catch {
      setMovements([]);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const handleAdjust = async () => {
    const quantity = Number(delta);
    if (!Number.isFinite(quantity) || quantity === 0) {
      alert("Nhập số lượng điều chỉnh (+/-).");
      return;
    }
    setSaving(true);
    try {
      await ProductService.adjustStock(productId, quantity, note);
      setDelta("");
      setNote("");
      onStockChanged();
      await loadHistory();
    } catch {
      alert("Không điều chỉnh được tồn kho.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-medium text-gray-900">
        Quản lý tồn kho (hiện tại: {currentStock})
      </h3>
      <div className="mt-4 flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1 block text-sm text-gray-600">
            Điều chỉnh (+/-)
          </label>
          <input
            type="number"
            value={delta}
            onChange={(e) => setDelta(e.target.value)}
            className="w-32 rounded-md border border-gray-300 px-3 py-2"
            placeholder="VD: 10 hoặc -5"
          />
        </div>
        <div className="min-w-[200px] flex-1">
          <label className="mb-1 block text-sm text-gray-600">Ghi chú</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Nhập kho, kiểm kê..."
          />
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={() => void handleAdjust()}
          className="rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
        >
          {saving ? "Đang lưu..." : "Cập nhật tồn"}
        </button>
      </div>

      <h4 className="mt-6 text-sm font-medium text-gray-700">Lịch sử thay đổi</h4>
      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
        </div>
      ) : movements.length === 0 ? (
        <p className="py-4 text-sm text-gray-500">Chưa có lịch sử.</p>
      ) : (
        <ul className="mt-2 divide-y divide-gray-100 text-sm">
          {movements.map((m) => (
            <li key={m.id} className="flex flex-wrap gap-2 py-2">
              <span className="text-gray-500">
                {new Date(m.createdAt).toLocaleString("vi-VN")}
              </span>
              <span
                className={
                  m.quantity >= 0 ? "text-green-700" : "text-red-700"
                }
              >
                {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
              </span>
              <span className="text-gray-600">
                {m.stockBefore} → {m.stockAfter}
              </span>
              {m.note ? (
                <span className="text-gray-500">— {m.note}</span>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
