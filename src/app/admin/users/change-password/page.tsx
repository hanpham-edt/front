"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, KeyRound } from "lucide-react";
import { UserService } from "@/services/api/UserService";

export default function AdminChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới và xác nhận không khớp.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await UserService.changePassword({
        currentPassword,
        newPassword,
      });
      setMessage(res.message ?? "Đã đổi mật khẩu.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Không thể đổi mật khẩu.",
      );
    } finally {
      setIsSubmitting(false);
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
          <h1 className="text-2xl font-bold text-gray-900">Đổi mật khẩu</h1>
          <p className="text-gray-600">Nhập mật khẩu hiện tại và mật khẩu mới</p>
        </div>
      </div>

      <div className="max-w-lg rounded-lg bg-white p-6 shadow">
        <form onSubmit={handleSubmit} className="space-y-5">
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
              htmlFor="currentPassword"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Mật khẩu hiện tại
            </label>
            <input
              id="currentPassword"
              type="password"
              required
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label
              htmlFor="newPassword"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Mật khẩu mới
            </label>
            <input
              id="newPassword"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
            </p>
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Xác nhận mật khẩu mới
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
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
            disabled={isSubmitting}
            className="inline-flex items-center rounded-md bg-orange-500 px-4 py-2 text-white hover:bg-orange-600 disabled:opacity-50"
          >
            <KeyRound className="mr-2 h-4 w-4" />
            {isSubmitting ? "Đang xử lý..." : "Đổi mật khẩu"}
          </button>
          </div>
        </form>
      </div>
    </div>
  );
}
