/** Chuẩn hóa params GET — axios có thể bỏ qua giá trị boolean `false`. */
export function serializeQueryParams<T extends object>(
  params?: T,
): Record<string, string | number> | undefined {
  if (!params) return undefined;

  const out: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    if (typeof value === "boolean") {
      out[key] = value ? "true" : "false";
    } else {
      out[key] = value as string | number;
    }
  }
  return out;
}
