"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, X } from "lucide-react";
import Link from "next/link";

import { CreateProduct } from "@/types/product-types";
import { ProductService } from "@/services/api/productService";
import { useCategories } from "@/hooks/useCategory";
import { isStoredImageUrl } from "@/utils/productImageUpload";
import ProductImagesField from "@/components/admin/ProductImagesField";
import { MEDIA_FOLDERS } from "@/lib/media-folders";
import RichTextEditor from "@/components/admin/RichTextEditor";
import {
  getPlainTextLength,
  isEmptyArticleHtml,
} from "@/lib/html-content";
import ProductVariantsEditor, {
  buildVariantsPayload,
  type VariantFormRow,
} from "@/components/admin/ProductVariantsEditor";
import CurrencyInput from "@/components/admin/CurrencyInput";

export default function NewProductPage() {
  const router = useRouter();
  const { categories, getCategories } = useCategories();
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [imageNames, setImageNames] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [variantRows, setVariantRows] = useState<VariantFormRow[]>([]);
  const [formData, setFormData] = useState<CreateProduct>({
    name: "",
    sku: "",
    categoryId: "",
    price: 0,
    description: "",
    stock: 0,
    imageUrl: "",
    isActive: true,
  });

  useEffect(() => {
    void getCategories();
  }, [getCategories]);

  // Nếu user không chọn danh mục, set mặc định theo danh mục đầu tiên load được
  useEffect(() => {
    if (!formData.categoryId && categories.length > 0) {
      setFormData((prev) => ({ ...prev, categoryId: categories[0].id }));
    }
  }, [categories, formData.categoryId]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // Create new product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const description = formData.description.trim();
    if (isEmptyArticleHtml(description)) {
      alert("Vui lòng nhập mô tả sản phẩm.");
      return;
    }
    if (getPlainTextLength(description) < 10) {
      alert("Mô tả sản phẩm cần ít nhất 10 ký tự chữ.");
      return;
    }
    const imageUrl = imagePreview[0] ?? formData.imageUrl ?? "";
    if (imageUrl && !isStoredImageUrl(imageUrl)) {
      alert(
        "Vui lòng upload ảnh sản phẩm (lưu vào /images/), không dùng base64.",
      );
      return;
    }
    setIsSubmitting(true);

    const imageUrls = imagePreview.filter((u) => isStoredImageUrl(u));
    const variants = buildVariantsPayload(variantRows);
    if (variantRows.some((r) => r.name.trim() || r.sku.trim()) && variants.length === 0) {
      alert("Biến thể cần có tên và SKU hợp lệ.");
      setIsSubmitting(false);
      return;
    }
    await ProductService.createProduct({
      ...formData,
      imageUrl: imageUrls[0] ?? "",
      imageUrls,
      ...(variants.length > 0 ? { variants } : {}),
    });
    setIsSubmitting(false);
    router.push("/admin/products");
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/products">
              <button className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5" />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Thêm sản phẩm mới
              </h1>
              <p className="text-gray-600">
                Tạo sản phẩm yến sào và quy cách bán
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Thông tin cơ bản
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tên sản phẩm *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Nhập tên sản phẩm"
                />
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Sku *
                </label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Nhập tên sản phẩm"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Danh mục *
                </label>
                <select
                  id="category"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="" disabled>
                    -- Chọn danh mục --
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Giá bán (VNĐ) *
                </label>
                <CurrencyInput
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={(price) =>
                    setFormData((prev) => ({ ...prev, price }))
                  }
                  required
                  placeholder="1.500.000"
                />
              </div>
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Stock
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Nhập tồn kho"
                />
              </div>
            </div>
          </div>

          <ProductVariantsEditor
            rows={variantRows}
            onChange={setVariantRows}
            productSku={formData.sku}
          />

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả sản phẩm *
            </label>
            <RichTextEditor
              value={formData.description}
              onChange={(html) =>
                setFormData((prev) => ({ ...prev, description: html }))
              }
              minLength={10}
              placeholder="Mô tả chi tiết, thành phần, cách dùng..."
              mediaFolder={MEDIA_FOLDERS.CONTENT}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Hình ảnh sản phẩm
            </label>
            <ProductImagesField
              images={imagePreview}
              imageNames={imageNames}
              onChange={(urls, names) => {
                setImagePreview(urls);
                setImageNames(names);
                setFormData((f) => ({ ...f, imageUrl: urls[0] ?? "" }));
              }}
              inputId="product-new-image-upload"
            />
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">SEO</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug URL
                </label>
                <input
                  name="slug"
                  value={formData.slug ?? ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Tự tạo từ tên nếu để trống"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta title
                </label>
                <input
                  name="metaTitle"
                  value={formData.metaTitle ?? ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta description
                </label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription ?? ""}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Trạng thái
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={!!formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isActive"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Đang bán
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <Link href="/admin/products">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Hủy
              </button>
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors flex items-center disabled:opacity-50 cursor-pointer"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Đang lưu..." : "Lưu sản phẩm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
