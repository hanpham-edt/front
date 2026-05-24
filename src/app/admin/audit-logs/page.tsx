"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import AdminPagination from "@/components/admin/AdminPagination";
import { auditService, type AuditLog } from "@/services/api/auditService";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [action, setAction] = useState("");
  const [entity, setEntity] = useState("");
  const [debouncedAction, setDebouncedAction] = useState("");
  const [debouncedEntity, setDebouncedEntity] = useState("");
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await auditService.getAll({
        page,
        limit,
        action: debouncedAction || undefined,
        entity: debouncedEntity || undefined,
      });
      setLogs(res.data);
      setMeta(res.meta);
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedAction, debouncedEntity]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Nhật ký thao tác</h1>
        <p className="text-gray-600">
          Theo dõi các thao tác quan trọng của admin trên hệ thống
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 rounded-lg bg-white p-6 shadow md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Hành động
          </label>
          <input
            value={action}
            onChange={(e) => {
              setAction(e.target.value);
              setPage(1);
              setTimeout(() => setDebouncedAction(e.target.value), 400);
            }}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="ORDER_REFUND, PRODUCT_DELETE..."
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Đối tượng
          </label>
          <input
            value={entity}
            onChange={(e) => {
              setEntity(e.target.value);
              setPage(1);
              setTimeout(() => setDebouncedEntity(e.target.value), 400);
            }}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="Order, Product..."
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
          </div>
        ) : logs.length === 0 ? (
          <p className="py-12 text-center text-gray-500">Không có bản ghi.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Thời gian
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Admin
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Hành động
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Chi tiết
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id} className="text-sm">
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                    {new Date(log.createdAt).toLocaleString("vi-VN")}
                  </td>
                  <td className="px-4 py-3 text-gray-900">
                    {log.userEmail ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900">
                      {log.action}
                    </span>
                    <span className="block text-xs text-gray-500">
                      {log.entity}
                      {log.entityId ? ` #${log.entityId.slice(0, 8)}` : ""}
                    </span>
                  </td>
                  <td className="max-w-md px-4 py-3 text-gray-600">
                    {log.detail ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
    </div>
  );
}
