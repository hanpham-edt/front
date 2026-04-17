"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useParams } from "next/navigation";
import { useUsers } from "@/hooks/useUsers";
import { UserService } from "@/services/api/UserService";
import { useForm } from "react-hook-form";

type FormValues = {
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
};

export default function AdminEditUserPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user, getUser } = useUsers();
  const params = useParams();
  const paramId = params.id;
  const userId =
    typeof paramId === "string"
      ? paramId
      : Array.isArray(paramId)
        ? paramId[0] ?? ""
        : "";

  const {
    register,
    reset,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      isActive: false,
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (!userId) return;
    setMessage(null);
    setError(null);
    void getUser(userId);
  }, [userId, getUser]);

  useEffect(() => {
    // Chỉ "đổ" dữ liệu từ server vào form khi form chưa bị người dùng chỉnh (tránh overwrite).
    if (!user || isDirty) return;
    reset({
      email: user.email ?? "",
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      isActive: !!user.isActive,
    });
  }, [user, isDirty, reset]);

  const onSubmit = async (values: FormValues) => {
    setMessage(null);
    setError(null);
    try {
      const updated = await UserService.updateUser(userId, {
        email: values.email,
        firstName: values.firstName || undefined,
        lastName: values.lastName || undefined,
        isActive: values.isActive,
      });
      setMessage("Đã cập nhật người dùng.");
      // Reset ngay bằng dữ liệu vừa lưu để UI không nhảy về giá trị cũ.
      reset({
        email: updated.email ?? values.email,
        firstName: updated.firstName ?? values.firstName,
        lastName: updated.lastName ?? values.lastName,
        isActive: !!updated.isActive,
      });
      // Đồng bộ lại dữ liệu từ server (không gây overwrite vì isDirty đang false sau reset).
      void getUser(updated.id);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Không thể cập nhật người dùng.",
      );
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin">
          <button
            type="button"
            className="text-gray-600 hover:text-gray-900"
            aria-label="Quay lại"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Cập Nhật Người Dùng
          </h1>
          <p className="text-gray-600">Cập nhật email, họ tên, trạng thái </p>
        </div>
      </div>

      <div className="max-w-lg rounded-lg bg-white p-6 shadow">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {message && (
            <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
              {message}
            </div>
          )}
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              {...register("email", { required: true })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label
              htmlFor="firstName"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Tên
            </label>
            <input
              id="firstName"
              type="text"
              {...register("firstName")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Họ
            </label>
            <input
              id="lastName"
              type="text"
              {...register("lastName")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-gray-900">
              <input
                type="checkbox"
                {...register("isActive")}
                className="h-4 w-4 accent-orange-500"
              />
              Hoạt động
            </label>
          </div>
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <Link href="/admin/users">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Hủy
              </button>
            </Link>

            <button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="inline-flex items-center rounded-md bg-orange-500 px-4 py-2 text-white hover:bg-orange-600 disabled:opacity-50 cursor-pointer"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
