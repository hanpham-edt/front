"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {
  ShoppingCart,
  Menu,
  X,
  User,
  ChevronDown,
  Package,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { usePublicSettings } from "@/hooks/usePublicSettings";
import ProfileFormModal from "@/components/account/ProfileFormModal";
import ChangePasswordModal from "@/components/account/ChangePasswordModal";
import Modal from "@/components/ui/Modal";
import LoginForm from "@/components/auth/LoginForm";
import Register from "@/components/auth/Register";
import ProductSearchBar from "@/components/products/ProductSearchBar";
import { useCategories } from "@/hooks/useCategory";
import { useArticleTopics } from "@/hooks/useArticleTopics";

/** Slug danh mục cha "Sản phẩm" trong admin — các danh mục con hiển thị trên menu */
const PRODUCTS_PARENT_SLUG = "san-pham";

function SearchBarFallback() {
  return (
    <div className="h-10 w-full max-w-xl animate-pulse rounded-lg bg-gray-100" />
  );
}

export default function Header() {
  const t = useTranslations("nav");
  const tAuth = useTranslations("auth");
  const tCommon = useTranslations("common");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false);
  const [isNewsMenuOpen, setIsNewsMenuOpen] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const [isMobileNewsOpen, setIsMobileNewsOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const { totalItems: cartCount } = useCart();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { siteInfo } = usePublicSettings();
  const { categories: productCategories, getCategories } = useCategories();
  const { topics: articleTopics, getTopics: getArticleTopics } =
    useArticleTopics();
  const router = useRouter();
  const accountMenuRef = useRef<HTMLDivElement | null>(null);
  const productsMenuRef = useRef<HTMLDivElement | null>(null);
  const newsMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    void getCategories({
      parentSlug: PRODUCTS_PARENT_SLUG,
      isActive: true,
      limit: 50,
    });
    void getArticleTopics(false);
  }, [getCategories, getArticleTopics]);

  const brandInitial = siteInfo.siteName.charAt(0).toUpperCase() || "Y";

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
    return user?.email ?? tCommon("account");
  }, [user, tCommon]);

  useEffect(() => {
    if (!isAccountMenuOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      const el = accountMenuRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) {
        setIsAccountMenuOpen(false);
      }
    };
    window.addEventListener("pointerdown", onPointerDown, true);
    return () => window.removeEventListener("pointerdown", onPointerDown, true);
  }, [isAccountMenuOpen]);

  useEffect(() => {
    if (!isProductsMenuOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      const el = productsMenuRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) {
        setIsProductsMenuOpen(false);
      }
    };
    window.addEventListener("pointerdown", onPointerDown, true);
    return () => window.removeEventListener("pointerdown", onPointerDown, true);
  }, [isProductsMenuOpen]);

  useEffect(() => {
    if (!isNewsMenuOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      const el = newsMenuRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) {
        setIsNewsMenuOpen(false);
      }
    };
    window.addEventListener("pointerdown", onPointerDown, true);
    return () => window.removeEventListener("pointerdown", onPointerDown, true);
  }, [isNewsMenuOpen]);

  const accountActions = (
    <>
      {isAuthenticated ? (
        <div className="relative" ref={accountMenuRef}>
          <button
            type="button"
            onClick={() => setIsAccountMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-md px-2 py-1 text-gray-700 transition-colors hover:text-orange-500"
            aria-haspopup="menu"
            aria-expanded={isAccountMenuOpen}
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-orange-700">
              <User className="h-5 w-5" />
            </span>
            <span className="hidden max-w-[140px] truncate text-sm font-semibold text-gray-900 lg:block">
              {displayName}
            </span>
            <ChevronDown className="hidden h-4 w-4 text-gray-500 sm:block" />
          </button>

          {isAccountMenuOpen ? (
            <div
              role="menu"
              className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg"
            >
              <Link
                href="/account/orders"
                role="menuitem"
                onClick={() => setIsAccountMenuOpen(false)}
                className="flex w-full items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50"
              >
                <Package className="h-4 w-4 shrink-0 text-orange-600" />
                {t("myOrders")}
              </Link>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsProfileOpen(true);
                  setIsAccountMenuOpen(false);
                }}
                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-orange-50"
              >
                {t("updateProfile")}
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsChangePasswordOpen(true);
                  setIsAccountMenuOpen(false);
                }}
                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-orange-50"
              >
                {t("changePassword")}
              </button>
              <div className="h-px bg-gray-100" />
              <button
                type="button"
                role="menuitem"
                onClick={handleLogoutClick}
                disabled={isLoading}
                className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
              >
                {isLoading ? t("loggingOut") : t("logout")}
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={handleLoginClick}
            className="cursor-pointer rounded-md bg-orange-500 px-3 py-2 text-sm text-white hover:bg-orange-600"
          >
            {t("login")}
          </button>
          <button
            type="button"
            onClick={handleRegisterClick}
            className="cursor-pointer rounded-md border border-orange-500 px-3 py-2 text-sm text-orange-600 hover:bg-orange-50"
          >
            {t("register")}
          </button>
        </div>
      )}

      <Link
        href="/cart"
        className="relative p-2 text-gray-700 transition-colors hover:text-orange-500"
        aria-label={t("cart")}
      >
        <ShoppingCart className="h-6 w-6" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs text-white">
            {cartCount}
          </span>
        )}
      </Link>

      <button
        type="button"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="p-2 text-gray-700 transition-colors hover:text-orange-500 md:hidden"
        aria-label={isMenuOpen ? t("closeMenu") : t("openMenu")}
      >
        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
    </>
  );

  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg">
      {/* Hàng trên: logo + tìm kiếm + tài khoản/giỏ */}
      <div className="border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 py-3 md:flex-row md:items-center md:gap-6 md:py-4">
            <Link href="/" className="flex shrink-0 items-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500">
                <span className="text-lg font-bold text-white">{brandInitial}</span>
              </div>
              <div className="ml-3 min-w-0">
                <span className="block truncate text-lg font-bold text-gray-900 md:text-xl">
                  {siteInfo.siteName}
                </span>
                <span className="hidden text-xs text-gray-500 sm:block line-clamp-1">
                  {siteInfo.siteDescription}
                </span>
              </div>
            </Link>

            <div className="w-full flex-1 md:max-w-xl lg:max-w-2xl">
              <Suspense fallback={<SearchBarFallback />}>
                <ProductSearchBar />
              </Suspense>
            </div>

            <div className="flex items-center justify-end gap-1 sm:gap-2 md:shrink-0">
              <LanguageSwitcher className="mr-1 hidden sm:flex" />
              {accountActions}
            </div>
          </div>
        </div>
      </div>

      {/* Hàng dưới: menu */}
      <div className="hidden border-b border-gray-100 bg-white md:block">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-center gap-1 py-0">
            <Link
              href="/"
              className="px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:text-orange-500"
            >
              {t("home")}
            </Link>

            <div
              ref={productsMenuRef}
              className="relative"
              onMouseLeave={() => setIsProductsMenuOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsProductsMenuOpen((v) => !v)}
                className="flex items-center gap-1 whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:text-orange-500"
                aria-haspopup="menu"
                aria-expanded={isProductsMenuOpen}
              >
                {t("products")}
                <ChevronDown className="h-4 w-4" />
              </button>
              {isProductsMenuOpen ? (
                <div
                  role="menu"
                  className="absolute left-0 z-50 mt-0 min-w-[200px] overflow-hidden rounded-lg border border-gray-100 bg-white py-1 shadow-lg"
                >
                  <Link
                    href="/products"
                    role="menuitem"
                    onClick={() => setIsProductsMenuOpen(false)}
                    className="block whitespace-nowrap px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  >
                    {t("allProducts")}
                  </Link>
                  {productCategories.length > 0 ? (
                    <div className="h-px bg-gray-100" />
                  ) : null}
                  {productCategories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/products?category=${category.id}`}
                      role="menuitem"
                      onClick={() => setIsProductsMenuOpen(false)}
                      className="block whitespace-nowrap px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>

        

            <Link
              href="/about"
              className="px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:text-orange-500"
            >
              {t("about")}
            </Link>
            <Link
              href="/contact"
              className="px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:text-orange-500"
            >
              {t("contact")}
            </Link>
                <div
              ref={newsMenuRef}
              className="relative"
              onMouseLeave={() => setIsNewsMenuOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsNewsMenuOpen((v) => !v)}
                className="flex items-center gap-1 whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:text-orange-500"
                aria-haspopup="menu"
                aria-expanded={isNewsMenuOpen}
              >
                {t("knowledge")}
                <ChevronDown className="h-4 w-4" />
              </button>
              {isNewsMenuOpen ? (
                <div
                  role="menu"
                  className="absolute left-0 z-50 mt-0 min-w-[220px] overflow-hidden rounded-lg border border-gray-100 bg-white py-1 shadow-lg"
                >
                  <Link
                    href="/news"
                    role="menuitem"
                    onClick={() => setIsNewsMenuOpen(false)}
                    className="block whitespace-nowrap px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  >
                    {t("allKnowledge")}
                  </Link>
                  {articleTopics.length > 0 ? (
                    <div className="h-px bg-gray-100" />
                  ) : null}
                  {articleTopics.map((topic) => (
                    <Link
                      key={topic.id}
                      href={`/news?topic=${topic.slug}`}
                      role="menuitem"
                      onClick={() => setIsNewsMenuOpen(false)}
                      className="block whitespace-nowrap px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                    >
                      {topic.name}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </nav>
        </div>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="border-t border-gray-100 bg-white md:hidden">
          <div className="space-y-1 px-2 py-3 sm:px-3">
            {!isAuthenticated && (
              <div className="mb-3 flex gap-2 px-3 sm:hidden">
                <button
                  type="button"
                  onClick={handleLoginClick}
                  className="flex-1 rounded-md bg-orange-500 py-2 text-sm text-white"
                >
                  {t("login")}
                </button>
                <button
                  type="button"
                  onClick={handleRegisterClick}
                  className="flex-1 rounded-md border border-orange-500 py-2 text-sm text-orange-600"
                >
                  {t("register")}
                </button>
              </div>
            )}
            <LanguageSwitcher className="mb-3 px-3 sm:hidden" />
            {isAuthenticated && (
              <Link
                href="/account/orders"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-500"
                onClick={() => setIsMenuOpen(false)}
              >
                <Package className="h-5 w-5 text-orange-600" />
                {t("myOrders")}
              </Link>
            )}
            <Link
              href="/"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-500"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("home")}
            </Link>

            <div>
              <button
                type="button"
                onClick={() => setIsMobileProductsOpen((v) => !v)}
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-500"
                aria-expanded={isMobileProductsOpen}
              >
                {t("products")}
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${isMobileProductsOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isMobileProductsOpen ? (
                <div className="ml-3 space-y-1 border-l border-gray-200 pl-3">
                  <Link
                    href="/products"
                    className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:text-orange-500"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsMobileProductsOpen(false);
                    }}
                  >
                    {t("allProducts")}
                  </Link>
                  {productCategories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/products?category=${category.id}`}
                      className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:text-orange-500"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsMobileProductsOpen(false);
                      }}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>

            <div>
              <button
                type="button"
                onClick={() => setIsMobileNewsOpen((v) => !v)}
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-500"
                aria-expanded={isMobileNewsOpen}
              >
                {t("news")}
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${isMobileNewsOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isMobileNewsOpen ? (
                <div className="ml-3 space-y-1 border-l border-gray-200 pl-3">
                  <Link
                    href="/news"
                    className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:text-orange-500"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsMobileNewsOpen(false);
                    }}
                  >
                    {t("allNews")}
                  </Link>
                  {articleTopics.map((topic) => (
                    <Link
                      key={topic.id}
                      href={`/news?topic=${topic.slug}`}
                      className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:text-orange-500"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsMobileNewsOpen(false);
                      }}
                    >
                      {topic.name}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>

            <Link
              href="/about"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-500"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("about")}
            </Link>
            <Link
              href="/contact"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-500"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("contact")}
            </Link>
          </div>
        </div>
      )}

      <ProfileFormModal open={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      <ChangePasswordModal
        open={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />

      <Modal open={isLoginOpen} title={tAuth("loginTitle")} onClose={() => setIsLoginOpen(false)}>
        <LoginForm
          mode="modal"
          onSuccess={() => setIsLoginOpen(false)}
          onGoRegister={() => {
            setIsLoginOpen(false);
            setIsRegisterOpen(true);
          }}
          onGoForgotPassword={() => {
            setIsLoginOpen(false);
            router.push("/auth/forgot-password");
          }}
        />
      </Modal>

      <Modal
        open={isRegisterOpen}
        title={tAuth("registerTitle")}
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
