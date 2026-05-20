"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import type { CreateHero } from "@/types/hero-types";
import {
  isStoredImageUrl,
  uploadProductImageFile,
} from "@/utils/productImageUpload";

type HeroFormProps = {
  initial: CreateHero;
  submitLabel: string;
  onSubmit: (data: CreateHero) => Promise<void>;
};

export default function HeroForm({
  initial,
  submitLabel,
  onSubmit,
}: HeroFormProps) {
  const [form, setForm] = useState<CreateHero>(initial);
  const [imagePreview, setImagePreview] = useState(initial.imageUrl || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      alert("Chọn file ảnh JPG/PNG/WEBP/GIF, tối đa 5MB.");
      return;
    }
    setIsUploading(true);
    try {
      const url = await uploadProductImageFile(file);
      setImagePreview(url);
      setForm((prev) => ({ ...prev, imageUrl: url }));
    } catch {
      alert("Upload ảnh thất bại.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.title.trim() || !form.subtitle.trim()) {
      setError("Tiêu đề và phụ đề không được để trống.");
      return;
    }
    if (!form.imageUrl || !isStoredImageUrl(form.imageUrl)) {
      setError("Vui lòng upload ảnh banner.");
      return;
    }
    if (!form.ctaLink.trim()) {
      setError("Link CTA không được để trống.");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...form,
        title: form.title.trim(),
        subtitle: form.subtitle.trim(),
        description: form.description?.trim() || undefined,
        ctaLink: form.ctaLink.trim(),
      });
    } catch {
      setError("Lưu thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Tiêu đề *
        </label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Phụ đề *
        </label>
        <input
          name="subtitle"
          value={form.subtitle}
          onChange={handleChange}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Mô tả
        </label>
        <textarea
          name="description"
          value={form.description ?? ""}
          onChange={handleChange}
          rows={3}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Link nút CTA *
        </label>
        <input
          name="ctaLink"
          value={form.ctaLink}
          onChange={handleChange}
          placeholder="/products hoặc /products/abc"
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Ảnh banner *
        </label>
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="hero-image-upload"
            onChange={(e) => void handleImageUpload(e)}
            disabled={isUploading}
          />
          <label
            htmlFor="hero-image-upload"
            className="inline-flex cursor-pointer flex-col items-center"
          >
            <Upload className="mb-2 h-8 w-8 text-gray-400" />
            <span className="text-sm text-gray-600">
              {isUploading ? "Đang upload..." : "Chọn ảnh (tối đa 5MB)"}
            </span>
          </label>
        </div>
        {imagePreview && (
          <div className="relative mt-4 inline-block">
            <div className="relative h-40 w-64 overflow-hidden rounded-lg border">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setImagePreview("");
                setForm((p) => ({ ...p, imageUrl: "" }));
              }}
              className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Ảnh lưu tại /images/... trên server
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || isUploading}
        className="rounded-md bg-orange-500 px-6 py-2 font-medium text-white hover:bg-orange-600 disabled:opacity-50"
      >
        {isSubmitting ? "Đang lưu..." : submitLabel}
      </button>
    </form>
  );
}
