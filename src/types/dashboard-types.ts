export interface DashboardOverview {
  totalRevenue: number;
  revenueThisMonth: number;
  revenueGrowthPercent: number | null;
  totalOrders: number;
  ordersThisMonth: number;
  ordersGrowthPercent: number | null;
  totalProducts: number;
  activeProducts: number;
  totalUsers: number;
  pendingOrders: number;
  pendingContacts: number;
  lowStockCount: number;
}

export interface OrderStatusCount {
  status: string;
  count: number;
}

export interface DashboardRecentOrder {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  shippingAddress: string;
  customerName: string;
  createdAt: string;
}

export interface DashboardTopProduct {
  id: string;
  name: string;
  imageUrl: string | null;
  soldQuantity: number;
  revenue: number;
}

export interface DashboardLowStockProduct {
  id: string;
  name: string;
  stock: number;
  imageUrl: string | null;
}

export interface DashboardStats {
  overview: DashboardOverview;
  ordersByStatus: OrderStatusCount[];
  recentOrders: DashboardRecentOrder[];
  topProducts: DashboardTopProduct[];
  lowStockProducts: DashboardLowStockProduct[];
}
