"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { UserService } from "@/services/api/UserService";
import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch } from "@/store";
import { setUser } from "@/store/slices/authSlice";
import { Save } from "lucide-react";

export default function ProfileFormModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { user: authUser } = useAuth();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setMessage(null);
    setError(null);
    void (async () => {
      try {
        const me = await UserService.getCurrentProfile();
        if (cancelled) return;
        setEmail(me.email);
        setFirstName(me.firstName ?? "");
        setLastName(me.lastName ?? "");
      } catch {
        if (cancelled) return;
        setEmail(authUser?.email ?? "");
        setFirstName(authUser?.firstName ?? "");
        setLastName(authUser?.lastName ?? "");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, authUser]);

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
      setError(err instanceof Error ? err.message : "Không thể cập nhật hồ sơ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} title="Cập nhật hồ sơ" onClose={onClose}>
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
          <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            disabled={isSubmitting}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Tên</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Họ</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer"
            disabled={isSubmitting}
          >
            Đóng
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center rounded-md bg-orange-500 px-4 py-2 text-white hover:bg-orange-600 disabled:opacity-50 cursor-pointer"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

