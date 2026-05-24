"use client";

import { useMemo } from "react";
import { useSelector } from "react-redux";
import type { IRootState } from "@/store";
import {
  type AdminPermission,
  getPermissionsForRole,
  hasAnyPermission,
  hasPermission,
  isAdminPanelRole,
  permissionForAdminPath,
} from "@/lib/admin-permissions";

export function useAdminPermissions() {
  const user = useSelector((s: IRootState) => s.auth.user);

  const permissions = useMemo(() => {
    const fromApi = (user as { permissions?: string[] } | null)?.permissions;
    if (fromApi?.length) return fromApi as AdminPermission[];
    return getPermissionsForRole(user?.role);
  }, [user]);

  return {
    user,
    role: user?.role,
    permissions,
    isAdmin: isAdminPanelRole(user?.role),
    can: (permission: AdminPermission) =>
      hasPermission(user?.role, permission, permissions),
    canAny: (perms: AdminPermission[]) =>
      hasAnyPermission(user?.role, perms, permissions),
    canAccessPath: (pathname: string) => {
      const required = permissionForAdminPath(pathname);
      if (!required) return isAdminPanelRole(user?.role);
      return hasPermission(user?.role, required, permissions);
    },
  };
}
