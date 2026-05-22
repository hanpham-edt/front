"use client";
import { useEffect, useState, useCallback } from "react";
import {
  Search,
  Eye,
  CheckCircle,
  Trash2,
  XCircle,
  Loader2,
} from "lucide-react";
import AdminPagination from "@/components/admin/AdminPagination";
import { useContacts } from "@/hooks/useContact";
import { Contact } from "@/types/contact-types";
import { contactService } from "@/services/api/contactService";

function formatContactDate(value: string | null | undefined): string {
  if (!value) return "—";
  return new Date(value).toLocaleString("vi-VN");
}

export default function AdminContactPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const { contacts, getContacts, meta, isLoading } = useContacts();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [markingReplied, setMarkingReplied] = useState(false);
  const [limit, setLimit] = useState(12);

  useEffect(() => {
    getContacts({
      page,
      limit,
      search: debouncedSearch,
      status: status === "all" ? undefined : status === "active",
    });
  }, [getContacts, page, limit, debouncedSearch, status]);

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

  const handleDelete = (contactId: string) => {
    setContactToDelete(contactId);
    setShowDeleteModal(true);
  };

  const reloadContacts = useCallback(() => {
    void getContacts({
      page,
      limit,
      search: debouncedSearch,
      status: status === "all" ? undefined : status === "active",
    });
  }, [getContacts, page, limit, debouncedSearch, status]);

  const confirmDelete = async () => {
    if (!contactToDelete) return;
    await contactService.deleteContact(contactToDelete);
    setShowDeleteModal(false);
    setContactToDelete(null);
    if (contacts.length === 1 && page > 1) {
      setPage(page - 1);
    } else {
      reloadContacts();
    }
  };

  const handleMarkReplied = async (contact: Contact) => {
    if (contact.status) return;
    setMarkingReplied(true);
    try {
      await contactService.updateContact(contact.id, { status: true });
      getContacts({
        page,
        limit,
        search: debouncedSearch,
        status: status === "all" ? undefined : status === "active",
      });
      if (selectedContact?.id === contact.id) {
        setSelectedContact({
          ...contact,
          status: true,
          repliedAt: new Date().toISOString(),
        });
      }
    } catch {
      alert("Không cập nhật được trạng thái liên hệ.");
    } finally {
      setMarkingReplied(false);
    }
  };

  const handleViewUser = (contacts: Contact) => {
    setSelectedContact(contacts);
    setShowContactModal(true);
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Quản Lý Liên Hệ
            </h1>
            <p className="text-gray-600">Quản lý tất cả liên hệ</p>
          </div>
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
                placeholder="Tìm kiếm email..."
              />
            </div>
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
              <option value="all">Tất cả</option>
              <option value="active">Đã trả lời</option>
              <option value="inactive">Chưa trả lời</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contact Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900">
            Liên hệ ({meta.total})
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
        ) : contacts.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            Không tìm thấy liên hệ phù hợp.
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên đầy đủ
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số điện thoại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chủ đề
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nội dung
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày gửi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày trả lời
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {contact.fullName}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {contact.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {contact.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {contact.topic}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {contact.content}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      contact.status ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {contact.status ? "Đã trả lời" : "Chưa trả lời"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatContactDate(contact.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatContactDate(contact.repliedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => handleViewUser(contact)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Xem chi tiết"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {!contact.status ? (
                        <button
                          type="button"
                          onClick={() => void handleMarkReplied(contact)}
                          disabled={markingReplied}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          title="Đánh dấu đã trả lời"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => handleDelete(contact.id)}
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

      {/* Contact Detail Modal */}
      {showContactModal && selectedContact && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Chi tiết liên hệ
              </h3>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">
                    {selectedContact.fullName}
                  </h4>
                  <p className="text-gray-500">{selectedContact.email}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Chủ đề
                </label>
                <p className="text-sm text-gray-900">{selectedContact.topic}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Số điện thoại
                </label>
                <p className="text-sm text-gray-900">
                  {selectedContact.phone || "—"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nội dung liên hệ
                </label>
                <p className="text-sm text-gray-900 whitespace-pre-wrap">
                  {selectedContact.content}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ngày gửi
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatContactDate(selectedContact.createdAt)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ngày trả lời
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatContactDate(selectedContact.repliedAt)}
                  </p>
                </div>
              </div>
              <div>
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    selectedContact.status
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {selectedContact.status ? "Đã trả lời" : "Chưa trả lời"}
                </span>
              </div>
              {!selectedContact.status ? (
                <button
                  type="button"
                  disabled={markingReplied}
                  onClick={() => void handleMarkReplied(selectedContact)}
                  className="w-full rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {markingReplied ? "Đang lưu..." : "Đánh dấu đã trả lời"}
                </button>
              ) : null}
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
                  Bạn có chắc chắn muốn xóa liên hệ này này này? Hành động này
                  không thể hoàn tác.
                </p>
              </div>
              <div className="flex items-center justify-center space-x-4 mt-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors cursor-pointer"
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
