"use client";

import Link from "next/link";
import {
  PackagePlus,
  ShoppingCart,
  Users,
  Tags,
  MessageSquare,
  Settings,
  ImageIcon,
} from "lucide-react";

interface QuickActionsProps {
  pendingOrders?: number;
  pendingContacts?: number;
}

const actions = [
  {
    label: "Thêm sản phẩm",
    href: "/admin/products/new",
    icon: PackagePlus,
    color: "bg-orange-500 hover:bg-orange-600",
  },
  {
    label: "Đơn hàng",
    href: "/admin/orders",
    icon: ShoppingCart,
    color: "bg-blue-500 hover:bg-blue-600",
    badgeKey: "orders" as const,
  },
  {
    label: "Danh mục",
    href: "/admin/categories",
    icon: Tags,
    color: "bg-violet-500 hover:bg-violet-600",
  },
  {
    label: "Liên hệ",
    href: "/admin/contacts",
    icon: MessageSquare,
    color: "bg-teal-500 hover:bg-teal-600",
    badgeKey: "contacts" as const,
  },
  {
    label: "Người dùng",
    href: "/admin/users",
    icon: Users,
    color: "bg-emerald-500 hover:bg-emerald-600",
  },
  {
    label: "Hero banner",
    href: "/admin/hero",
    icon: ImageIcon,
    color: "bg-pink-500 hover:bg-pink-600",
  },
  {
    label: "Cài đặt",
    href: "/admin/settings",
    icon: Settings,
    color: "bg-gray-600 hover:bg-gray-700",
  },
];

export default function QuickActions({
  pendingOrders = 0,
  pendingContacts = 0,
}: QuickActionsProps) {
  const badges: Record<string, number> = {
    orders: pendingOrders,
    contacts: pendingContacts,
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-900">Thao tác nhanh</h3>
      </div>
      <div className="grid grid-cols-2 gap-3 p-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        {actions.map((action) => {
          const badge =
            action.badgeKey && badges[action.badgeKey] > 0
              ? badges[action.badgeKey]
              : null;
          return (
            <Link
              key={action.href}
              href={action.href}
              className={`relative flex flex-col items-center justify-center gap-2 rounded-xl px-3 py-4 text-center text-sm font-medium text-white transition ${action.color}`}
            >
              <action.icon className="h-6 w-6" />
              <span>{action.label}</span>
              {badge !== null ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-gray-900 shadow">
                  {badge > 99 ? "99+" : badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
