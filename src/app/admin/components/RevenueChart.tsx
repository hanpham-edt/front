"use client";

import type { DashboardDailyPoint } from "@/types/dashboard-types";

const CHART_HEIGHT_PX = 200;

function formatShortDate(iso: string) {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}

function formatMoney(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}tr`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`;
  return String(n);
}

export default function RevenueChart({
  data,
  isLoading,
}: {
  data: DashboardDailyPoint[];
  isLoading: boolean;
}) {
  const maxRevenue = Math.max(1, ...data.map((d) => d.revenue));
  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">
        Doanh thu 30 ngày gần nhất
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Cột cam: doanh thu · Số trên cột: số đơn
      </p>

      {isLoading ? (
        <div className="mt-6 h-48 animate-pulse rounded-lg bg-gray-100" />
      ) : data.length === 0 ? (
        <p className="mt-6 text-sm text-gray-500">Chưa có dữ liệu.</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <div
            className="flex min-w-[720px] items-end gap-0.5 border-b border-gray-200"
            style={{ height: CHART_HEIGHT_PX }}
          >
            {data.map((point) => {
              const barHeightPx =
                point.revenue > 0
                  ? Math.max(
                      8,
                      Math.round((point.revenue / maxRevenue) * CHART_HEIGHT_PX),
                    )
                  : 0;

              return (
                <div
                  key={point.date}
                  className="group flex h-full min-w-0 flex-1 flex-col items-center"
                  title={`${formatShortDate(point.date)}: ${point.revenue.toLocaleString("vi-VN")}đ · ${point.orders} đơn`}
                >
                  <div className="flex w-full flex-1 flex-col items-center justify-end px-0.5">
                    {point.orders > 0 ? (
                      <span className="mb-0.5 text-[10px] font-medium text-gray-600">
                        {point.orders}
                      </span>
                    ) : null}
                    {barHeightPx > 0 ? (
                      <div
                        className="w-full max-w-[20px] min-w-[6px] rounded-t bg-gradient-to-t from-orange-600 to-orange-400 transition hover:from-orange-700 hover:to-orange-500"
                        style={{ height: barHeightPx }}
                      />
                    ) : (
                      <div className="h-0.5 w-full max-w-[20px] rounded-full bg-gray-200" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex min-w-[720px] justify-between gap-0.5 px-0.5">
            {data.map((point) => (
              <span
                key={`label-${point.date}`}
                className="flex-1 text-center text-[10px] text-gray-500"
              >
                {formatShortDate(point.date)}
              </span>
            ))}
          </div>
          <div className="mt-3 flex justify-between text-xs text-gray-500">
            <span>Tối đa: {formatMoney(maxRevenue)}</span>
            <span>Tổng: {totalRevenue.toLocaleString("vi-VN")}đ</span>
          </div>
        </div>
      )}
    </div>
  );
}
