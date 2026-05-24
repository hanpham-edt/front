"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { UserService } from "@/services/api/UserService";
import { useAdminPermissions } from "@/hooks/useAdminPermissions";
import type { UserRole } from "@/types/auth-types";

export default function NewAdminUserPage() {
  const router = useRouter();
  const { user: currentUser } = useAdminPermissions();
  const isFullAdmin = currentUser?.role === "ADMIN";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<UserRole>("USER");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await UserService.createAdminUser({
        email: email.trim(),
        password,
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        role,
      });
      router.push("/admin/users");
    } catch {
      setError("Không tạo được tài khoản. Kiểm tra email đã tồn tại chưa.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin/users" className="text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Thêm người dùng</h1>
          <p className="text-gray-600">
            Tạo tài khoản khách, nhân viên hoặc quản trị
          </p>
        </div>
      </div>

      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="space-y-4 rounded-lg bg-white p-6 shadow"
      >
        {error ? (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        <div>
          <label className="mb-1 block text-sm font-medium">Email *</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Mật khẩu *</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Họ</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Tên</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Vai trò</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="USER">Khách hàng</option>
            {isFullAdmin ? (
              <>
                <option value="STAFF">Nhân viên</option>
                <option value="ADMIN">Quản trị viên</option>
              </>
            ) : null}
          </select>
          {!isFullAdmin ? (
            <p className="mt-1 text-xs text-gray-500">
              Nhân viên chỉ được tạo tài khoản khách hàng.
            </p>
          ) : null}
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-md bg-orange-500 py-2 font-medium text-white hover:bg-orange-600 disabled:opacity-50"
        >
          {saving ? "Đang tạo..." : "Tạo tài khoản"}
        </button>
      </form>
    </div>
  );
}
