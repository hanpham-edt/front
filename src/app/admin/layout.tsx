"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Crown,
  Tags,
  ChevronDown,
  UserCircle,
  KeyRound,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { IRootState } from "@/store";

function selectRehydrated(state: IRootState): boolean {
  const root = state as IRootState & {
    _persist?: { rehydrated?: boolean };
  };
  return root._persist?.rehydrated === true;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigation = [
    { name: "Dashboard", href: "/admin", icon: BarChart3 },
    { name: "Categories", href: "/admin/categories", icon: Tags },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();
  const rehydrated = useSelector(selectRehydrated);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(e.target as Node)
      ) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName =
    user &&
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim();

  const accountLabel = displayName || user?.email || "Tài khoản";

  const handleLogout = async () => {
    await logout();
  };

  const isLoginPage = pathname === "/admin/login";

  // Không gọi router trong render — tránh vòng lặp / chặn cả trang login
  useEffect(() => {
    if (!rehydrated) return;
    if (isLoginPage) return;
    if (!user || user.role !== "ADMIN") {
      router.replace("/admin/login");
    }
  }, [rehydrated, isLoginPage, user, router]);

  // Trang đăng nhập: luôn render form, không bọc shell admin
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!rehydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 text-sm text-gray-600">
        Đang tải...
      </div>
    );
  }

  if (user && user.role === "ADMIN") {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Mobile sidebar */}
        <div
          className={`fixed inset-0 z-50 lg:hidden ${
            sidebarOpen ? "block" : "hidden"
          }`}
        >
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
            <div className="flex h-16 items-center justify-between px-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Crown className="h-5 w-5 text-white" />
                </div>
                <span className="ml-2 text-lg font-bold text-gray-900">
                  Welcome {user.firstName} {user.lastName}
                </span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 px-2 py-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? "bg-orange-100 text-orange-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-gray-200 p-4">
              <button
                className="flex items-center w-full px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="mr-3 h-5 w-5" />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
            <div className="flex h-16 items-center px-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Crown className="h-5 w-5 text-white" />
                </div>
                <span className="ml-2 text-lg font-bold text-gray-900">
                  Admin Dashboard
                </span>
              </div>
            </div>
            <nav className="flex-1 space-y-1 px-2 py-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? "bg-orange-100 text-orange-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-gray-200 p-4">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md cursor-pointer"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64">
          {/* Top bar */}
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="flex flex-1" />
              <div
                className="relative flex items-center"
                ref={accountMenuRef}
              >
                <button
                  type="button"
                  onClick={() => setAccountMenuOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-lg border border-transparent px-2 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-200"
                  aria-expanded={accountMenuOpen}
                  aria-haspopup="menu"
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="hidden max-w-[10rem] truncate sm:inline">
                    {accountLabel}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 flex-shrink-0 text-gray-500 transition-transform ${accountMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {accountMenuOpen && (
                  <div
                    className="absolute right-0 top-full z-50 mt-1 w-56 rounded-md border border-gray-200 bg-white py-1 shadow-lg"
                    role="menu"
                  >
                    <Link
                      href="/admin/users/profile"
                      role="menuitem"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setAccountMenuOpen(false)}
                    >
                      <UserCircle className="h-4 w-4 text-gray-500" />
                      Cập nhật hồ sơ
                    </Link>
                    <Link
                      href="/admin/users/change-password"
                      role="menuitem"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setAccountMenuOpen(false)}
                    >
                      <KeyRound className="h-4 w-4 text-gray-500" />
                      Đổi mật khẩu
                    </Link>
                    <div className="my-1 border-t border-gray-100" />
                    <button
                      type="button"
                      role="menuitem"
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        void handleLogout();
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Page content */}
          <main className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Chưa đăng nhập hoặc không phải ADMIN: đang redirect (useEffect ở trên)
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 text-sm text-gray-600">
      Đang chuyển đến trang đăng nhập...
    </div>
  );
}
