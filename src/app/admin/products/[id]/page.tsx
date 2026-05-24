"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ArrowLeft, Edit, Package } from "lucide-react";

import { Product } from "@/types/product-types";
import ArticleHtmlContent from "@/components/articles/ArticleHtmlContent";
import { isHtmlContent } from "@/lib/html-content";
import { ProductService } from "@/services/api/productService";
import { formatCurrency } from "@/lib/format";

export default function AdminProductDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProduct = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await ProductService.getProductById(id);
      setProduct(res);
    } catch {
      setError("Không tìm thấy sản phẩm hoặc không thể tải dữ liệu.");
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadProduct();
  }, [loadProduct]);

  const imageUrls =
    product?.imageUrls?.length
      ? product.imageUrls
      : product?.imageUrl
        ? [product.imageUrl]
        : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-500">
        Đang tải...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-24">
        <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">{error ?? "Sản phẩm không tồn tại."}</p>
        <Link
          href="/admin/products"
          className="text-orange-600 hover:text-orange-700 font-medium"
        >
          ← Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/products">
              <button
                type="button"
                className="text-gray-600 hover:text-gray-900"
                aria-label="Quay lại"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-gray-600">Chi tiết sản phẩm · SKU: {product.sku}</p>
            </div>
          </div>
          <Link href={`/admin/products/${product.id}/edit`}>
            <button
              type="button"
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center"
            >
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </button>
          </Link>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 space-y-8">
        {imageUrls.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Hình ảnh</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {imageUrls.map((url, index) => (
                <div
                  key={`${url}-${index}`}
                  className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative"
                >
                  <Image
                    src={url}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Thông tin cơ bản
          </h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div>
              <dt className="text-gray-500">Danh mục</dt>
              <dd className="font-medium text-gray-900 mt-1">
                {product.category ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Giá bán</dt>
              <dd className="font-medium text-gray-900 mt-1 tabular-nums">
                {formatCurrency(product.price)}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Tồn kho</dt>
              <dd className="font-medium text-gray-900 mt-1">{product.stock}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Trạng thái</dt>
              <dd className="mt-1">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    product.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {product.isActive ? "Đang bán" : "Ngừng bán"}
                </span>
              </dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-gray-500 mb-2">Mô tả</dt>
              <dd className="mt-1">
                {!product.description ? (
                  <span className="text-gray-500">—</span>
                ) : isHtmlContent(product.description) ? (
                  <ArticleHtmlContent html={product.description} />
                ) : (
                  <p className="font-medium text-gray-900 whitespace-pre-wrap">
                    {product.description}
                  </p>
                )}
              </dd>
            </div>
            {product.updatedAt && (
              <div>
                <dt className="text-gray-500">Cập nhật lần cuối</dt>
                <dd className="font-medium text-gray-900 mt-1">
                  {new Date(product.updatedAt).toLocaleString("vi-VN")}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {product.variants && product.variants.length > 0 ? (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Biến thể
            </h3>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">
                      Quy cách
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">
                      SKU
                    </th>
                    <th className="px-4 py-2 text-right font-medium text-gray-500">
                      Giá
                    </th>
                    <th className="px-4 py-2 text-right font-medium text-gray-500">
                      Tồn
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {product.variants.map((v) => (
                    <tr key={v.id}>
                      <td className="px-4 py-2 font-medium text-gray-900">
                        {v.name}
                      </td>
                      <td className="px-4 py-2 text-gray-600">{v.sku}</td>
                      <td className="px-4 py-2 text-right tabular-nums font-medium text-gray-900">
                        {formatCurrency(v.price)}
                      </td>
                      <td className="px-4 py-2 text-right tabular-nums text-gray-900">
                        {v.stock}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                            v.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {v.isActive ? "Đang bán" : "Tắt"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
