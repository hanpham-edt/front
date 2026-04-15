"use client";

import { useEffect, useMemo, useState } from "react";
import { Lock, Mail, User, UserRound, Eye, EyeOff, BadgeCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register({
  mode = "page",
  onSuccess,
  onGoLogin,
}: {
  mode?: "page" | "modal";
  onSuccess?: () => void;
  onGoLogin?: () => void;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading, error, register } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "page" && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, mode, router]);

  const passwordChecks = useMemo(() => {
    return {
      minLen: password.length >= 8,
      hasLower: /[a-z]/.test(password),
      hasUpper: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[@$!%*?&]/.test(password),
    };
  }, [password]);

  const passwordScore = useMemo(() => {
    const checks = Object.values(passwordChecks);
    return checks.reduce((acc, ok) => acc + (ok ? 1 : 0), 0);
  }, [passwordChecks]);

  const passwordStrengthLabel = useMemo(() => {
    if (!password) return "Chưa nhập mật khẩu";
    if (passwordScore <= 2) return "Yếu";
    if (passwordScore === 3 || passwordScore === 4) return "Trung bình";
    return "Mạnh";
  }, [password, passwordScore]);

  const passwordStrengthColor = useMemo(() => {
    if (!password) return "bg-gray-200";
    if (passwordScore <= 2) return "bg-red-500";
    if (passwordScore <= 4) return "bg-yellow-500";
    return "bg-green-500";
  }, [password, passwordScore]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setLocalError("Vui lòng nhập email.");
      return;
    }
    if (!password) {
      setLocalError("Vui lòng nhập mật khẩu.");
      return;
    }
    if (password !== confirmPassword) {
      setLocalError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (!acceptTerms) {
      setLocalError("Vui lòng đồng ý với điều khoản để tiếp tục.");
      return;
    }

    const ok = await register({
      email: trimmedEmail,
      password,
      firstName: firstName.trim() || undefined,
      lastName: lastName.trim() || undefined,
    });
    if (ok) {
      if (mode === "modal") onSuccess?.();
      else router.push("/");
    }
  };

  return (
    <div
      className={
        mode === "modal"
          ? "w-full"
          : "min-h-screen bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center px-4 py-10"
      }
    >
      <div className={mode === "modal" ? "" : "w-full max-w-md"}>
        {mode === "page" ? (
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-sm">
              <UserRound className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Tạo tài khoản</h1>
            <p className="text-orange-100">Đăng ký để mua hàng nhanh hơn</p>
          </div>
        ) : null}

        <div className={mode === "modal" ? "bg-white rounded-lg" : "bg-white rounded-lg shadow-xl p-8"}>
          <form onSubmit={handleSubmit} className="space-y-5">
            {(localError || error) && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {localError || error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ (tuỳ chọn)
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                    placeholder="Nguyễn"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isLoading}
                    autoComplete="family-name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên (tuỳ chọn)
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                    placeholder="An"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isLoading}
                    autoComplete="given-name"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                  placeholder="Tối thiểu 8 ký tự"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                  <span>Độ mạnh: <span className="font-semibold">{passwordStrengthLabel}</span></span>
                  <span>{password ? `${passwordScore}/5` : ""}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full ${passwordStrengthColor} transition-all`}
                    style={{ width: `${(passwordScore / 5) * 100}%` }}
                  />
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    { ok: passwordChecks.minLen, text: "Tối thiểu 8 ký tự" },
                    { ok: passwordChecks.hasUpper, text: "1 chữ hoa (A-Z)" },
                    { ok: passwordChecks.hasLower, text: "1 chữ thường (a-z)" },
                    { ok: passwordChecks.hasNumber, text: "1 chữ số (0-9)" },
                    { ok: passwordChecks.hasSpecial, text: "1 ký tự đặc biệt (@$!%*?&)" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-2 text-gray-700">
                      <span
                        className={`inline-flex h-4 w-4 items-center justify-center rounded-full ${
                          item.ok ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
                        }`}
                        aria-hidden
                      >
                        {item.ok ? <BadgeCheck className="h-4 w-4" /> : <span className="text-[10px]">•</span>}
                      </span>
                      <span className={item.ok ? "text-gray-700" : "text-gray-500"}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword ? (
                <p className="mt-2 text-xs text-red-600">Mật khẩu xác nhận không khớp.</p>
              ) : null}
            </div>

            <label className="flex items-start gap-3 text-sm text-gray-700 select-none">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                disabled={isLoading}
              />
              <span>
                Tôi đồng ý với <span className="font-medium">Điều khoản</span> và{" "}
                <span className="font-medium">Chính sách bảo mật</span>.
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Đang đăng ký...
                </>
              ) : (
                "Tạo tài khoản"
              )}
            </button>

            <p className="text-center text-sm text-gray-600">
              Đã có tài khoản?{" "}
              {mode === "modal" ? (
                <button
                  type="button"
                  onClick={onGoLogin}
                  className="font-semibold text-orange-600 hover:text-orange-700"
                >
                  Đăng nhập
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  className="font-semibold text-orange-600 hover:text-orange-700"
                >
                  Đăng nhập
                </Link>
              )}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}