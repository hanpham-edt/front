"use client";

import { useState } from "react";
import Image from "next/image";
import { Images, Upload, X } from "lucide-react";
import MediaPickerModal from "@/components/admin/MediaPickerModal";
import { MEDIA_FOLDERS } from "@/lib/media-folders";
import {
  MAX_PRODUCT_IMAGES,
  remainingImageSlots,
} from "@/lib/product-images";
import {
  isStoredImageUrl,
  uploadProductImageFile,
} from "@/utils/productImageUpload";

type ProductImagesFieldProps = {
  images: string[];
  imageNames?: string[];
  onChange: (images: string[], names: string[]) => void;
  inputId?: string;
};

export default function ProductImagesField({
  images,
  imageNames = [],
  onChange,
  inputId = "product-image-upload",
}: ProductImagesFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const addImages = (urls: string[], names: string[]) => {
    const slotsLeft = remainingImageSlots(images.length);
    const nextUrls = [...images, ...urls.slice(0, slotsLeft)];
    const nextNames = [...imageNames, ...names.slice(0, slotsLeft)];
    onChange(nextUrls, nextNames);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(
      (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024,
    );

    const slotsLeft = remainingImageSlots(images.length);
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

    setIsUploading(true);
    try {
      const uploaded: { url: string; name: string }[] = [];
      for (const file of filesToUpload) {
        const url = await uploadProductImageFile(file, MEDIA_FOLDERS.PRODUCTS);
        uploaded.push({ url, name: file.name });
      }
      addImages(
        uploaded.map((u) => u.url),
        uploaded.map((u) => u.name),
      );
    } catch {
      alert("Upload ảnh thất bại. Vui lòng thử lại.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    onChange(
      images.filter((_, i) => i !== index),
      imageNames.filter((_, i) => i !== index),
    );
  };

  const handlePickerSelect = (url: string) => {
    if (!isStoredImageUrl(url)) return;
    if (images.includes(url)) {
      alert("Ảnh đã có trong danh sách.");
      return;
    }
    const slotsLeft = remainingImageSlots(images.length);
    if (slotsLeft <= 0) {
      alert(`Tối đa ${MAX_PRODUCT_IMAGES} hình ảnh.`);
      return;
    }
    const name = url.split("/").pop() ?? "library";
    addImages([url], [name]);
  };

  return (
    <div className="space-y-4">
      <div
        className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
          images.length >= MAX_PRODUCT_IMAGES
            ? "border-gray-200 bg-gray-50 opacity-60"
            : "border-gray-300 hover:border-orange-400"
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => void handleFileUpload(e)}
          disabled={isUploading || images.length >= MAX_PRODUCT_IMAGES}
          className="hidden"
          id={inputId}
        />
        <div className="flex flex-wrap items-center justify-center gap-3">
          <label
            htmlFor={inputId}
            className={
              images.length >= MAX_PRODUCT_IMAGES
                ? "inline-flex cursor-not-allowed items-center gap-2 text-sm text-gray-500"
                : "inline-flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-600 hover:border-orange-400"
            }
          >
            <Upload className="h-4 w-4" />
            {isUploading ? "Đang tải..." : "Tải ảnh mới"}
          </label>
          <button
            type="button"
            disabled={images.length >= MAX_PRODUCT_IMAGES}
            onClick={() => setPickerOpen(true)}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <Images className="h-4 w-4" />
            Thư viện
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Thư mục <strong>Sản phẩm</strong>. JPG/PNG/GIF, tối đa 5MB. Còn{" "}
          {remainingImageSlots(images.length)}/{MAX_PRODUCT_IMAGES} ảnh.
        </p>
      </div>

      {images.length > 0 && (
        <div>
          <h4 className="mb-3 text-sm font-medium text-gray-700">
            Hình ảnh đã chọn:
          </h4>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {images.map((preview, index) => (
              <div key={`${preview}-${index}`} className="group relative">
                <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={preview}
                    alt={imageNames[index] ?? `Ảnh ${index + 1}`}
                    width={200}
                    height={200}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition group-hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-2 left-2 rounded bg-orange-500 px-2 py-0.5 text-xs text-white">
                    Ảnh chính
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <MediaPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handlePickerSelect}
        folder={MEDIA_FOLDERS.PRODUCTS}
        title="Chọn ảnh sản phẩm"
      />
    </div>
  );
}
