"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Eye,
  Edit,
  Trash2,
  User,
  XCircle,
  ShoppingCart,
  Loader2,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useUsers } from "@/hooks/useUsers";
import { Users } from "@/types/user-types";
import { UserService } from "@/services/api/UserService";
import AdminPagination from "@/components/admin/AdminPagination";
import UserOrderHistory from "@/components/admin/UserOrderHistory";
import { ROLE_LABELS } from "@/lib/admin-permissions";

const roleOptions = [
  { value: "all", label: "Tất cả" },
  { value: "USER", label: "Khách hàng" },
  { value: "STAFF", label: "Nhân viên" },
  { value: "ADMIN", label: "Quản trị viên" },
];

const statusOptions = [
  { value: "all", label: "Tất cả" },
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Không hoạt động" },
];

export default function AdminUsersPage() {
  const [selectedRole, setSelectedRole] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const { users, getUsers, meta, isLoading } = useUsers();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [selectedUser, setSelectedUser] = useState<Users | null>(null);
  const [limit, setLimit] = useState(12);

  const fetchParams = {
    page,
    limit,
    search: debouncedSearch,
    isActive: status === "all" ? undefined : status === "active",
    role:
      selectedRole === "all"
        ? undefined
        : (selectedRole as "USER" | "STAFF" | "ADMIN"),
  };

  useEffect(() => {
    void getUsers(fetchParams);
  }, [getUsers, page, limit, debouncedSearch, status, selectedRole]);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearch(value);
      setPage(1);
      setTimeout(() => {
        setDebouncedSearch(value);
      }, 500);
    },
    [setSearch, setPage],
  );

  const handleDelete = (userId: string) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      if (!userToDelete) return;
      await UserService.deleteUser(userToDelete);
      setShowDeleteModal(false);
      setUserToDelete(null);
      const nextPage =
        users.length === 1 && page > 1 ? page - 1 : page;
      if (nextPage !== page) {
        setPage(nextPage);
      } else {
        void getUsers({ ...fetchParams, page: nextPage });
      }
    } catch (error) {
      alert("Không thể xóa người dùng này.");
      console.error(error);
    }
  };

  const handleViewUser = (users: Users) => {
    setSelectedUser(users);
    setShowUserModal(true);
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Quản lý người dùng
            </h1>
            <p className="text-gray-600">
              Quản lý tất cả người dùng trong hệ thống
            </p>
          </div>
          <Link href="/admin/users/new">
            <button
              type="button"
              className="flex cursor-pointer items-center rounded-md bg-orange-500 px-4 py-2 font-medium text-white transition-colors hover:bg-orange-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              Thêm người dùng
            </button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Tìm kiếm người dùng..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vai trò
            </label>
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setPage(1);
              }}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as typeof status);
                setPage(1);
              }}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between gap-3">
          <h3 className="text-lg font-medium text-gray-900">
            Người dùng ({meta.total})
          </h3>
          {meta.totalPages > 0 ? (
            <p className="text-sm text-gray-600">
              Trang {meta.page} / {meta.totalPages}
            </p>
          ) : null}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            Không tìm thấy người dùng phù hợp.
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đơn hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng chi tiêu
                </th>
                */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tham gia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày cập nhật
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === "ADMIN"
                          ? "bg-purple-100 text-purple-800"
                          : user.role === "STAFF"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role && user.role in ROLE_LABELS
                        ? ROLE_LABELS[user.role as keyof typeof ROLE_LABELS]
                        : user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.isActive ? "Hoạt động" : "Không hoạt động"}
                    </span>
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                   
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleString("vi-VN")
                      : ""}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.updatedAt
                      ? new Date(user.updatedAt).toLocaleString("vi-VN")
                      : ""}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <Link
                        href={`/admin/orders?userId=${encodeURIComponent(user.id)}`}
                        title="Xem đơn hàng"
                      >
                        <button
                          type="button"
                          className="text-orange-600 hover:text-orange-900"
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </button>
                      </Link>
                      <Link href={`/admin/users/${user.id}/edit`}>
                        <button
                          type="button"
                          className="text-orange-600 hover:text-orange-900"
                          title="Sửa người dùng"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}

        <AdminPagination
          page={meta.page}
          totalPages={meta.totalPages}
          total={meta.total}
          limit={meta.limit}
          onPageChange={setPage}
          onLimitChange={(next) => {
            setLimit(next);
            setPage(1);
          }}
        />
      </div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Chi tiết người dùng
              </h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">
                    {selectedUser.firstName}
                  </h4>
                  <p className="text-gray-500">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Số điện thoại
                  </label>
                  <p className="text-sm text-gray-900">{selectedUser.phone}</p>
                </div> */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Vai trò
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedUser.role && selectedUser.role in ROLE_LABELS
                      ? ROLE_LABELS[
                          selectedUser.role as keyof typeof ROLE_LABELS
                        ]
                      : selectedUser.role}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Trạng thái
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedUser.isActive ? "Hoạt động" : "Không hoạt động"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ngày tham gia
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedUser.createdAt
                      ? new Date(selectedUser.createdAt).toLocaleString("vi-VN")
                      : ""}
                  </p>
                </div>
              </div>

              <UserOrderHistory
                userId={selectedUser.id}
                userEmail={selectedUser.email}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">
                Xác nhận xóa
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Bạn có chắc chắn muốn xóa người dùng này? Hành động này không
                  thể hoàn tác.
                </p>
              </div>
              <div className="flex items-center justify-center space-x-4 mt-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
