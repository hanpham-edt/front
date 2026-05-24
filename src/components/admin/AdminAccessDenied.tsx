"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function AdminAccessDenied({
  title = "Không có quyền truy cập",
  message = "Tài khoản của bạn không được phép xem trang này.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-lg bg-white p-8 text-center shadow">
      <ShieldAlert className="mb-4 h-12 w-12 text-orange-500" />
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      <p className="mt-2 max-w-md text-gray-600">{message}</p>
      <Link
        href="/admin"
        className="mt-6 rounded-md bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
      >
        Về Dashboard
      </Link>
    </div>
  );
}
