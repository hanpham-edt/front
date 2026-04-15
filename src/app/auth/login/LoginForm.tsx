"use client";
import { useEffect, useMemo, useState } from "react";
import { Lock, Mail, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function LoginForm({
  mode = "page",
  onSuccess,
  onGoRegister,
}: {
  mode?: "page" | "modal";
  onSuccess?: () => void;
  onGoRegister?: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isAuthenticated, error, isLoading, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (mode === "page" && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, mode, router]);

  const wrapClassName = useMemo(() => {
    if (mode === "modal") return "w-full";
    return "min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center px-4";
  }, [mode]);

  const cardClassName = useMemo(() => {
    if (mode === "modal") return "bg-white rounded-lg";
    return "bg-white rounded-lg shadow-xl p-8";
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login({ email, password });
    if (success) {
      if (mode === "modal") {
        onSuccess?.();
      } else {
        router.push("/");
      }
    }
  };

  return (
    <div className={wrapClassName}>
      <div className={mode === "modal" ? "" : "w-full max-w-md"}>
        {mode === "page" ? (
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Chào mừng</h1>
            <p className="text-blue-100">Đăng nhập để tiếp tục</p>
          </div>
        ) : null}

        <div className={cardClassName}>
          <form onSubmit={handleSubmit} className={mode === "modal" ? "space-y-5" : "space-y-6"}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus={mode === "page"}
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Đang đăng nhập...
                </>
              ) : (
                "Đăng nhập"
              )}
            </button>

            {mode === "modal" ? (
              <p className="text-center text-sm text-gray-600">
                Chưa có tài khoản?{" "}
                <button
                  type="button"
                  onClick={onGoRegister}
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Đăng ký
                </button>
              </p>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  );
}
