"use client";

import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/ui/Modal";
import { UserService } from "@/services/api/UserService";
import { KeyRound } from "lucide-react";

export default function ChangePasswordModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setMessage(null);
    setError(null);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }, [open]);

  const passwordChecks = useMemo(() => {
    return {
      minLen: newPassword.length >= 8,
      hasLower: /[a-z]/.test(newPassword),
      hasUpper: /[A-Z]/.test(newPassword),
      hasNumber: /\d/.test(newPassword),
      hasSpecial: /[@$!%*?&]/.test(newPassword),
    };
  }, [newPassword]);

  const canSubmit =
    currentPassword.length > 0 &&
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    newPassword === confirmPassword;

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
      const res = await UserService.changePassword({ currentPassword, newPassword });
      setMessage(res.message ?? "Đã đổi mật khẩu.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể đổi mật khẩu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} title="Đổi mật khẩu" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Mật khẩu hiện tại
          </label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Mật khẩu mới</label>
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            disabled={isSubmitting}
          />
          <div className="mt-2 text-xs text-gray-600 space-y-1">
            <div className="flex gap-2">
              <span className={passwordChecks.minLen ? "text-green-700" : "text-gray-500"}>
                • Tối thiểu 8 ký tự
              </span>
              <span className={passwordChecks.hasUpper ? "text-green-700" : "text-gray-500"}>
                • Có chữ hoa
              </span>
            </div>
            <div className="flex gap-2">
              <span className={passwordChecks.hasLower ? "text-green-700" : "text-gray-500"}>
                • Có chữ thường
              </span>
              <span className={passwordChecks.hasNumber ? "text-green-700" : "text-gray-500"}>
                • Có số
              </span>
            </div>
            <div>
              <span className={passwordChecks.hasSpecial ? "text-green-700" : "text-gray-500"}>
                • Có ký tự đặc biệt (@$!%*?&)
              </span>
            </div>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Xác nhận mật khẩu mới
          </label>
          <input
            type="password"
            required
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Đóng
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !canSubmit}
            className="inline-flex items-center rounded-md bg-orange-500 px-4 py-2 text-white hover:bg-orange-600 disabled:opacity-50"
          >
            <KeyRound className="mr-2 h-4 w-4" />
            {isSubmitting ? "Đang xử lý..." : "Đổi mật khẩu"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

