/** Đồng bộ với api/src/common/permissions/admin-permissions.ts */

export const ADMIN_PERMISSIONS = {
  DASHBOARD_VIEW: "dashboard:view",
  ORDERS_VIEW: "orders:view",
  ORDERS_MANAGE: "orders:manage",
  PRODUCTS_VIEW: "products:view",
  PRODUCTS_MANAGE: "products:manage",
  CATEGORIES_MANAGE: "categories:manage",
  COUPONS_MANAGE: "coupons:manage",
  NEWS_MANAGE: "news:manage",
  REVIEWS_MANAGE: "reviews:manage",
  CONTACTS_MANAGE: "contacts:manage",
  HERO_MANAGE: "hero:manage",
  ABANDONED_CARTS_MANAGE: "abandoned-carts:manage",
  USERS_MANAGE: "users:manage",
  SETTINGS_MANAGE: "settings:manage",
  AUDIT_VIEW: "audit:view",
  UPLOAD_USE: "upload:use",
  MEDIA_MANAGE: "media:manage",
} as const;

export type AdminPermission =
  (typeof ADMIN_PERMISSIONS)[keyof typeof ADMIN_PERMISSIONS];

export type AdminRole = "USER" | "STAFF" | "ADMIN";

export const ALL_ADMIN_PERMISSIONS: AdminPermission[] =
  Object.values(ADMIN_PERMISSIONS);

const STAFF_PERMISSIONS: AdminPermission[] = [
  ADMIN_PERMISSIONS.DASHBOARD_VIEW,
  ADMIN_PERMISSIONS.ORDERS_VIEW,
  ADMIN_PERMISSIONS.ORDERS_MANAGE,
  ADMIN_PERMISSIONS.PRODUCTS_VIEW,
  ADMIN_PERMISSIONS.PRODUCTS_MANAGE,
  ADMIN_PERMISSIONS.CATEGORIES_MANAGE,
  ADMIN_PERMISSIONS.COUPONS_MANAGE,
  ADMIN_PERMISSIONS.NEWS_MANAGE,
  ADMIN_PERMISSIONS.REVIEWS_MANAGE,
  ADMIN_PERMISSIONS.CONTACTS_MANAGE,
  ADMIN_PERMISSIONS.HERO_MANAGE,
  ADMIN_PERMISSIONS.ABANDONED_CARTS_MANAGE,
  ADMIN_PERMISSIONS.UPLOAD_USE,
  ADMIN_PERMISSIONS.MEDIA_MANAGE,
];

export const ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  USER: [],
  STAFF: STAFF_PERMISSIONS,
  ADMIN: ALL_ADMIN_PERMISSIONS,
};

export function isAdminPanelRole(role?: string | null): boolean {
  return role === "ADMIN" || role === "STAFF";
}

export function getPermissionsForRole(role?: string | null): AdminPermission[] {
  if (!role || !(role in ROLE_PERMISSIONS)) return [];
  return ROLE_PERMISSIONS[role as AdminRole];
}

export function hasPermission(
  role: string | undefined | null,
  permission: AdminPermission,
  explicitPermissions?: string[] | null,
): boolean {
  if (role === "ADMIN") return true;
  if (explicitPermissions?.length) {
    return explicitPermissions.includes(permission);
  }
  return getPermissionsForRole(role).includes(permission);
}

export function hasAnyPermission(
  role: string | undefined | null,
  permissions: AdminPermission[],
  explicitPermissions?: string[] | null,
): boolean {
  return permissions.some((p) =>
    hasPermission(role, p, explicitPermissions),
  );
}

export const ADMIN_NAV_ITEMS: Array<{
  name: string;
  href: string;
  permission: AdminPermission;
}> = [
  { name: "Dashboard", href: "/admin", permission: ADMIN_PERMISSIONS.DASHBOARD_VIEW },
  { name: "Users", href: "/admin/users", permission: ADMIN_PERMISSIONS.USERS_MANAGE },
  { name: "Categories", href: "/admin/categories", permission: ADMIN_PERMISSIONS.CATEGORIES_MANAGE },
  { name: "Products", href: "/admin/products", permission: ADMIN_PERMISSIONS.PRODUCTS_MANAGE },
  { name: "Coupons", href: "/admin/coupons", permission: ADMIN_PERMISSIONS.COUPONS_MANAGE },
  { name: "News", href: "/admin/news", permission: ADMIN_PERMISSIONS.NEWS_MANAGE },
  { name: "Reviews", href: "/admin/reviews", permission: ADMIN_PERMISSIONS.REVIEWS_MANAGE },
  { name: "Orders", href: "/admin/orders", permission: ADMIN_PERMISSIONS.ORDERS_VIEW },
  {
    name: "Giỏ bỏ quên",
    href: "/admin/abandoned-carts",
    permission: ADMIN_PERMISSIONS.ABANDONED_CARTS_MANAGE,
  },
  { name: "Contacts", href: "/admin/contacts", permission: ADMIN_PERMISSIONS.CONTACTS_MANAGE },
  { name: "Hero", href: "/admin/hero", permission: ADMIN_PERMISSIONS.HERO_MANAGE },
  {
    name: "Thư viện media",
    href: "/admin/media",
    permission: ADMIN_PERMISSIONS.MEDIA_MANAGE,
  },
  { name: "Audit logs", href: "/admin/audit-logs", permission: ADMIN_PERMISSIONS.AUDIT_VIEW },
  { name: "Settings", href: "/admin/settings", permission: ADMIN_PERMISSIONS.SETTINGS_MANAGE },
];

/** Route prefix → permission cần để truy cập */
export const ADMIN_ROUTE_PERMISSIONS: Array<{
  prefix: string;
  permission: AdminPermission;
}> = [
  { prefix: "/admin/users", permission: ADMIN_PERMISSIONS.USERS_MANAGE },
  { prefix: "/admin/categories", permission: ADMIN_PERMISSIONS.CATEGORIES_MANAGE },
  { prefix: "/admin/products", permission: ADMIN_PERMISSIONS.PRODUCTS_MANAGE },
  { prefix: "/admin/coupons", permission: ADMIN_PERMISSIONS.COUPONS_MANAGE },
  { prefix: "/admin/news", permission: ADMIN_PERMISSIONS.NEWS_MANAGE },
  { prefix: "/admin/reviews", permission: ADMIN_PERMISSIONS.REVIEWS_MANAGE },
  { prefix: "/admin/orders", permission: ADMIN_PERMISSIONS.ORDERS_VIEW },
  { prefix: "/admin/abandoned-carts", permission: ADMIN_PERMISSIONS.ABANDONED_CARTS_MANAGE },
  { prefix: "/admin/contacts", permission: ADMIN_PERMISSIONS.CONTACTS_MANAGE },
  { prefix: "/admin/hero", permission: ADMIN_PERMISSIONS.HERO_MANAGE },
  { prefix: "/admin/media", permission: ADMIN_PERMISSIONS.MEDIA_MANAGE },
  { prefix: "/admin/audit-logs", permission: ADMIN_PERMISSIONS.AUDIT_VIEW },
  { prefix: "/admin/settings", permission: ADMIN_PERMISSIONS.SETTINGS_MANAGE },
  { prefix: "/admin", permission: ADMIN_PERMISSIONS.DASHBOARD_VIEW },
];

export function permissionForAdminPath(pathname: string): AdminPermission | null {
  const sorted = [...ADMIN_ROUTE_PERMISSIONS].sort(
    (a, b) => b.prefix.length - a.prefix.length,
  );
  for (const item of sorted) {
    if (
      pathname === item.prefix ||
      pathname.startsWith(`${item.prefix}/`)
    ) {
      return item.permission;
    }
  }
  return null;
}

export const ROLE_LABELS: Record<AdminRole, string> = {
  USER: "Khách hàng",
  STAFF: "Nhân viên",
  ADMIN: "Quản trị viên",
};
