import axios from "axios";

export function getApiErrorMessage(
  error: unknown,
  fallback = "Đã có lỗi. Vui lòng thử lại.",
): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string | string[] }
      | undefined;
    const m = data?.message;
    if (typeof m === "string") return m;
    if (Array.isArray(m)) return m.join(", ");

    const status = error.response?.status;
    if (status === 401) {
      return "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.";
    }
    if (status === 403) {
      return "Bạn không có quyền thực hiện thao tác này.";
    }
    if (status === 429) {
      return "Quá nhiều yêu cầu. Vui lòng đợi một lúc rồi thử lại.";
    }
    if (status === 400) {
      return "Dữ liệu không hợp lệ. Kiểm tra tiêu đề, nội dung (tối thiểu 10 ký tự).";
    }
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}
