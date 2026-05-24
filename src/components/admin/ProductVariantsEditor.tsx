"use client";

import { Plus, Trash2 } from "lucide-react";
import type { ProductVariant } from "@/types/product-types";
import CurrencyInput from "@/components/admin/CurrencyInput";

export type VariantFormRow = {
  id?: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  sortOrder: number;
  isActive: boolean;
};

const emptyRow = (): VariantFormRow => ({
  name: "",
  sku: "",
  price: 0,
  stock: 0,
  sortOrder: 0,
  isActive: true,
});

export function buildVariantsPayload(rows: VariantFormRow[]) {
  return rows
    .filter((r) => r.name.trim() && r.sku.trim())
    .map((r, i) => ({
      ...(r.id ? { id: r.id } : {}),
      name: r.name.trim(),
      sku: r.sku.trim(),
      price: r.price,
      stock: r.stock,
      sortOrder: r.sortOrder ?? i,
      isActive: r.isActive,
    }));
}

export function variantsFromProduct(
  variants?: ProductVariant[],
): VariantFormRow[] {
  if (!variants?.length) return [];
  return variants.map((v) => ({
    id: v.id,
    name: v.name,
    sku: v.sku,
    price: v.price,
    stock: v.stock,
    sortOrder: v.sortOrder,
    isActive: v.isActive,
  }));
}

export default function ProductVariantsEditor({
  rows,
  onChange,
  productSku,
}: {
  rows: VariantFormRow[];
  onChange: (rows: VariantFormRow[]) => void;
  productSku: string;
}) {
  const update = (index: number, patch: Partial<VariantFormRow>) => {
    onChange(rows.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  };

  const remove = (index: number) => {
    onChange(rows.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Biến thể sản phẩm</h3>
          <p className="text-sm text-gray-500">
            Quy cách, dung tích (VD: 500g, 1 hộp). Khi có biến thể, khách phải chọn
            trước khi mua.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            onChange([
              ...rows,
              {
                ...emptyRow(),
                sku: productSku ? `${productSku}-${rows.length + 1}` : "",
                sortOrder: rows.length,
              },
            ])
          }
          className="inline-flex items-center gap-1 rounded-md border border-orange-500 px-3 py-1.5 text-sm text-orange-600 hover:bg-orange-50"
        >
          <Plus className="h-4 w-4" />
          Thêm biến thể
        </button>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-md border border-dashed border-gray-200 py-6 text-center text-sm text-gray-500">
          Chưa có biến thể — sản phẩm dùng giá và tồn kho mặc định ở trên.
        </p>
      ) : (
        <div className="space-y-3">
          {rows.map((row, index) => (
            <div
              key={row.id ?? `new-${index}`}
              className="grid grid-cols-1 gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 md:grid-cols-6"
            >
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs text-gray-600">Tên *</label>
                <input
                  value={row.name}
                  onChange={(e) => update(index, { name: e.target.value })}
                  placeholder="500g"
                  className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-600">SKU *</label>
                <input
                  value={row.sku}
                  onChange={(e) => update(index, { sku: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-600">Giá *</label>
                <CurrencyInput
                  value={row.price}
                  onChange={(price) => update(index, { price })}
                  className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 tabular-nums"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-600">Tồn *</label>
                <input
                  type="number"
                  min={0}
                  value={row.stock}
                  onChange={(e) =>
                    update(index, { stock: Number(e.target.value) || 0 })
                  }
                  className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
                />
              </div>
              <div className="flex items-end justify-between gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={row.isActive}
                    onChange={(e) =>
                      update(index, { isActive: e.target.checked })
                    }
                  />
                  Bán
                </label>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-600 hover:text-red-800"
                  title="Xóa biến thể"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
