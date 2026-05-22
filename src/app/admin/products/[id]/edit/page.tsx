"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, X, Upload } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { CreateProduct } from "@/types/product-types";
import { ProductService } from "@/services/api/productService";
import { useCategories } from "@/hooks/useCategory";
import { uploadProductImageFile, isStoredImageUrl } from "@/utils/productImageUpload";
import RichTextEditor from "@/components/admin/RichTextEditor";
import {
  getPlainTextLength,
  isEmptyArticleHtml,
} from "@/lib/html-content";
import {
  MAX_PRODUCT_IMAGES,
  remainingImageSlots,
} from "@/lib/product-images";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { categories, getCategories } = useCategories();
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [imageNames, setImageNames] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
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

  const loadProduct = useCallback(async () => {
    if (!id) return;
    const res = await ProductService.getProductById(String(id));
    setFormData({
      name: res.name,
      sku: res.sku,
      categoryId: res.categoryId ?? "",
      price: res.price,
      description: res.description,
      stock: res.stock,
      imageUrl: res.imageUrl,
      isActive: res.isActive,
    });
    const urls =
      res.imageUrls?.length ? res.imageUrls : res.imageUrl ? [res.imageUrl] : [];
    setImagePreview(urls);
    setImageNames(urls.map((_, i) => `Ảnh ${i + 1}`));
  }, [id]);

  // Nếu có ảnh cũ, hiển thị preview, nếu không thì rỗng

  useEffect(() => {
    void getCategories();
    void loadProduct();
  }, [loadProduct, getCategories]);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(
      (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024,
    );

    const slotsLeft = remainingImageSlots(imagePreview.length);
    if (slotsLeft <= 0) {
      alert(`Tối đa ${MAX_PRODUCT_IMAGES} hình ảnh cho mỗi sản phẩm`);
      return;
    }

    const filesToUpload = validFiles.slice(0, slotsLeft);
    if (validFiles.length > slotsLeft) {
      alert(
        `Chỉ thêm được ${slotsLeft} ảnh nữa (tối đa ${MAX_PRODUCT_IMAGES} ảnh).`,
      );
    }

    setIsUploadingImage(true);
    try {
      const uploaded: { url: string; name: string }[] = [];
      for (const file of filesToUpload) {
        const url = await uploadProductImageFile(file);
        uploaded.push({ url, name: file.name });
      }
      setImagePreview((prev) => {
        const next = [...prev, ...uploaded.map((u) => u.url)];
        setFormData((f) => ({ ...f, imageUrl: next[0] ?? "" }));
        return next;
      });
      setImageNames((prev) => [...prev, ...uploaded.map((u) => u.name)]);
    } catch {
      alert("Upload ảnh thất bại. Vui lòng thử lại.");
    } finally {
      setIsUploadingImage(false);
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImagePreview((prev) => {
      const next = prev.filter((_, i) => i !== index);
      setFormData((p) => ({ ...p, imageUrl: next[0] ?? "" }));
      return next;
    });
    setImageNames((prev) => prev.filter((_, i) => i !== index));
  };

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
    const imageUrls = imagePreview.filter((u) => isStoredImageUrl(u));
    const imageUrl = imageUrls[0] ?? "";
    if (imagePreview.length > 0 && imageUrls.length === 0) {
      alert(
        "Ảnh hiện tại đang ở dạng base64. Vui lòng upload lại ảnh để lưu vào /images/.",
      );
      return;
    }
    setIsSubmitting(true);
    await ProductService.updateProduct(String(id), {
      ...formData,
      description,
      imageUrl,
      imageUrls,
    });
    setIsSubmitting(false);
    router.push("/admin/products");
  };

  // if (!product) return null;

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
                Chỉnh sửa sản phẩm
              </h1>
              <p className="text-gray-600">
                Cập nhật thông tin sản phẩm yến sào
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
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Nhập giá bán"
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
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hình ảnh sản phẩm
            </label>
            <div className="space-y-4">
              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  imagePreview.length >= MAX_PRODUCT_IMAGES
                    ? "border-gray-200 bg-gray-50 opacity-60"
                    : "border-gray-300 hover:border-orange-400"
                }`}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={
                    isUploadingImage ||
                    imagePreview.length >= MAX_PRODUCT_IMAGES
                  }
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className={
                    imagePreview.length >= MAX_PRODUCT_IMAGES
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  }
                >
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {isUploadingImage
                      ? "Đang tải ảnh lên..."
                      : imagePreview.length >= MAX_PRODUCT_IMAGES
                        ? `Đã đủ ${MAX_PRODUCT_IMAGES} ảnh`
                        : (
                          <>
                            Kéo thả hình ảnh vào đây hoặc{" "}
                            <span className="text-orange-500 font-medium">
                              chọn file
                            </span>
                          </>
                        )}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Hỗ trợ: JPG, PNG, GIF. Tối đa 5MB mỗi file. Còn{" "}
                    {remainingImageSlots(imagePreview.length)}/
                    {MAX_PRODUCT_IMAGES} ảnh.
                  </p>
                </label>
              </div>

              {/* Image Preview */}
              {imagePreview.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Hình ảnh đã chọn:
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {imagePreview.map((preview, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <Image
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            width={320}
                            height={320}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          {imageNames[index] || `Ảnh ${index + 1}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
