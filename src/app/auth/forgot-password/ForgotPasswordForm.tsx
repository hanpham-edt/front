"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, User } from "lucide-react";
import { authService, getApiErrorMessage } from "@/services/api/authService";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await authService.forgotPassword({ email: email.trim() });
      setMessage(
        res?.message ??
          "Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.",
      );
    } catch (err) {
      setError(
        getApiErrorMessage(err, "Không thể gửi yêu cầu. Vui lòng thử lại."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Quên mật khẩu</h1>
            <p className="text-blue-100">Nhập email để nhận link đặt lại</p>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {message && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
                  {message}
                </div>
              )}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting || !!message}
                    autoComplete="email"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !!message}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors cursor-pointer"
              >
                {isSubmitting ? "Đang gửi..." : "Gửi link đặt lại"}
              </button>

              <p className="text-center text-sm">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center gap-1 text-orange-600 hover:text-orange-700 font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại đăng nhập
                </Link>
              </p>
            </form>
          </div>
      </div>
    </div>
  );
}
