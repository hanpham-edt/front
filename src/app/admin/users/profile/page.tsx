"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { UserService } from "@/services/api/UserService";
import { useAppDispatch } from "@/store";
import { setUser } from "@/store/slices/authSlice";
import { useAuth } from "@/hooks/useAuth";

export default function AdminProfilePage() {
  const { user: authUser } = useAuth();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const me = await UserService.getCurrentProfile();
        if (cancelled) return;
        setEmail(me.email);
        setFirstName(me.firstName ?? "");
        setLastName(me.lastName ?? "");
      } catch {
        if (!cancelled && authUser) {
          setEmail(authUser.email);
          setFirstName(authUser.firstName ?? "");
          setLastName(authUser.lastName ?? "");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setIsSubmitting(true);
    try {
      const updated = await UserService.updateCurrentProfile({
        email,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
      });
      dispatch(
        setUser({
          id: updated.id,
          email: updated.email,
          firstName: updated.firstName ?? undefined,
          lastName: updated.lastName ?? undefined,
        }),
      );
      setMessage("Đã cập nhật hồ sơ.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Không thể cập nhật hồ sơ.",
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
          <h1 className="text-2xl font-bold text-gray-900">Hồ sơ tài khoản</h1>
          <p className="text-gray-600">Cập nhật email và họ tên</p>
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
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
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
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
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
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
          </div>
        </form>
      </div>
    </div>
  );
}
