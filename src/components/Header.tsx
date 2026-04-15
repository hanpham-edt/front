"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, X, User, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import ProfileFormModal from "@/components/account/ProfileFormModal";
import ChangePasswordModal from "@/components/account/ChangePasswordModal";
import Modal from "@/components/ui/Modal";
import LoginForm from "@/app/auth/login/LoginForm";
import Register from "@/app/auth/register/Register";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const { totalItems: cartCount } = useCart();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  const navigation = [
    { name: "Trang Chủ", href: "/" },
    { name: "Yến sào", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Liên Hệ", href: "/contact" },
    { name: "Tin Tức", href: "/news" },
  ];

  const handleLogoutClick = async () => {
    await logout();
    setIsAccountMenuOpen(false);
  };
  const handleLoginClick = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  const handleRegisterClick = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const displayName = useMemo(() => {
    const full = `${user?.lastName ?? ""} ${user?.firstName ?? ""}`.trim();
    if (full) return full;
    return user?.email ?? "Tài khoản";
  }, [user]);

  useEffect(() => {
    if (!isAccountMenuOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      const el = accountMenuRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) {
        setIsAccountMenuOpen(false);
      }
    };
    window.addEventListener("mousedown", onPointerDown);
    return () => window.removeEventListener("mousedown", onPointerDown);
  }, [isAccountMenuOpen]);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">
                Yến Sào A Phú Hãn
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative" ref={accountMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsAccountMenuOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-md px-2 py-1 text-gray-700 hover:text-orange-500 transition-colors"
                  aria-haspopup="menu"
                  aria-expanded={isAccountMenuOpen}
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-orange-700">
                    <User className="h-5 w-5" />
                  </span>
                  <span className="hidden sm:block max-w-[180px] truncate text-sm font-semibold text-gray-900">
                    {displayName}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>

                {isAccountMenuOpen ? (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-100 bg-white shadow-lg overflow-hidden"
                  >
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setIsProfileOpen(true);
                        setIsAccountMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-orange-50"
                    >
                      Cập nhật hồ sơ
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setIsChangePasswordOpen(true);
                        setIsAccountMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-orange-50"
                    >
                      Đổi mật khẩu
                    </button>
                    <div className="h-px bg-gray-100" />
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogoutClick}
                      disabled={isLoading}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
                    >
                      {isLoading ? "Đang đăng xuất..." : "Đăng xuất"}
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}

            <Link
              href="/cart"
              className="relative p-2 text-gray-700 hover:text-orange-500 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Login - Logout */}
            {isAuthenticated ? (
              <>
                {/* menu ở trên đã có logout */}
              </>
            ) : (
              <>
                <button
                  onClick={handleLoginClick}
                  className="cursor-pointer bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
                >
                  Login
                </button>
                <button
                  onClick={handleRegisterClick}
                  className="cursor-pointer bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
                >
                  Register
                </button>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-orange-500 transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-orange-500 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {/* <div className="px-3 py-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Tìm kiếm sản phẩm..."
                  />
                </div>
              </div> */}
            </div>
          </div>
        )}
      </div>

      {/* Modals: mở overlay, không rời trang */}
      <ProfileFormModal open={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      <ChangePasswordModal
        open={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />

      <Modal open={isLoginOpen} title="Đăng nhập" onClose={() => setIsLoginOpen(false)}>
        <LoginForm
          mode="modal"
          onSuccess={() => setIsLoginOpen(false)}
          onGoRegister={() => {
            setIsLoginOpen(false);
            setIsRegisterOpen(true);
          }}
        />
      </Modal>

      <Modal
        open={isRegisterOpen}
        title="Đăng ký"
        onClose={() => setIsRegisterOpen(false)}
      >
        <Register
          mode="modal"
          onSuccess={() => setIsRegisterOpen(false)}
          onGoLogin={() => {
            setIsRegisterOpen(false);
            setIsLoginOpen(true);
          }}
        />
      </Modal>
    </header>
  );
}
