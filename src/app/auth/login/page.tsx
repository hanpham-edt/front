"use client";
import { Suspense } from "react";
import LoginForm from "@/app/auth/login/LoginForm";

export default function page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center text-white">
          Đang tải…
        </div>
      }
    >
      <LoginForm mode="page" />
    </Suspense>
  );
}
