"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, X, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems: cartCount } = useCart();
  const { isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  const navigation = [
    { name: "Trang Chủ", href: "/" },
    { name: "Yến sào", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Liên Hệ", href: "/contact" },
    { name: "Tin Tức", href: "/news" },
  ];

  const handleLogoutClick = async () => {
    await logout();
  };
  const handleLoginClick = () => {
    router.push("/auth/login");
  };

  const handleRegisterClick = () => {
    router.push("/auth/register");
  };

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
            <button className="p-2 text-gray-700 hover:text-orange-500 transition-colors">
              {isAuthenticated ? <User className="h-6 w-6" /> : ""}
            </button>

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
                <button
                  onClick={handleLogoutClick}
                  disabled={isLoading}
                  className="cursor-pointer bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
                >
                  {isLoading ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleLoginClick}
                  className="cursor-pointer bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
                >
                  {" "}
                  Login{" "}
                </button>
                <button
                  onClick={handleRegisterClick}
                  className="cursor-pointer bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
                >
                  {" "}
                  Register{" "}
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
    </header>
  );
}
