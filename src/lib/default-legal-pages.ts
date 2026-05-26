import type { PolicyPage } from "@/types/policy-types";

export const LEGAL_PAGE_SLUGS = {
  privacy: "privacy",
  terms: "terms",
} as const;

export type LegalPageSlug =
  (typeof LEGAL_PAGE_SLUGS)[keyof typeof LEGAL_PAGE_SLUGS];

const PRIVACY_HTML = `
<h2>1. Giới thiệu</h2>
<p>Chúng tôi tôn trọng quyền riêng tư của khách hàng và cam kết bảo vệ thông tin cá nhân theo quy định pháp luật Việt Nam hiện hành.</p>
<h2>2. Thông tin chúng tôi thu thập</h2>
<ul>
<li>Họ tên, số điện thoại, email, địa chỉ giao hàng khi đặt hàng hoặc liên hệ</li>
<li>Thông tin tài khoản khi bạn đăng ký (email, mật khẩu đã mã hóa)</li>
<li>Lịch sử đơn hàng, phương thức thanh toán và ghi chú giao hàng</li>
<li>Dữ liệu kỹ thuật: cookie, địa chỉ IP, trình duyệt (phục vụ vận hành website)</li>
</ul>
<h2>3. Mục đích sử dụng</h2>
<ul>
<li>Xử lý đơn hàng, giao hàng và hỗ trợ khách hàng</li>
<li>Gửi thông báo trạng thái đơn hàng (email/SMS nếu có)</li>
<li>Cải thiện dịch vụ, bảo mật hệ thống và phòng chống gian lận</li>
<li>Gửi tin khuyến mãi khi bạn đồng ý nhận marketing</li>
</ul>
<h2>4. Chia sẻ thông tin</h2>
<p>Chúng tôi không bán dữ liệu cá nhân. Thông tin chỉ được chia sẻ với đơn vị vận chuyển, cổng thanh toán hoặc cơ quan nhà nước khi pháp luật yêu cầu.</p>
<h2>5. Lưu trữ và bảo mật</h2>
<p>Dữ liệu được lưu trên hệ thống có biện pháp bảo mật (mã hóa mật khẩu, HTTPS, phân quyền truy cập). Thời gian lưu trữ phù hợp với mục đích xử lý và nghĩa vụ kế toán, thuế.</p>
<h2>6. Quyền của bạn</h2>
<ul>
<li>Yêu cầu truy cập, chỉnh sửa hoặc xóa thông tin cá nhân</li>
<li>Rút lại sự đồng ý nhận tin marketing</li>
<li>Khiếu nại nếu cho rằng dữ liệu bị xử lý trái quy định</li>
</ul>
<h2>7. Cookie</h2>
<p>Website sử dụ cookie để duy trì phiên đăng nhập, ghi nhớ giỏ hàng và phân tích truy cập. Bạn có thể tắt cookie trên trình duyệt nhưng một số tính năng có thể không hoạt động.</p>
<h2>8. Liên hệ</h2>
<p>Mọi thắc mắc về chính sách bảo mật, vui lòng liên hệ qua trang <a href="/contact">Liên hệ</a> hoặc email hỗ trợ trên website.</p>
`.trim();

const TERMS_HTML = `
<h2>1. Điều khoản chung</h2>
<p>Khi truy cập website và đặt hàng, bạn đồng ý tuân thủ các điều khoản dưới đây. Nếu không đồng ý, vui lòng không sử dụng dịch vụ.</p>
<h2>2. Tài khoản</h2>
<ul>
<li>Bạn chịu trách nhiệm bảo mật thông tin đăng nhập</li>
<li>Thông tin đăng ký phải chính xác, đầy đủ</li>
<li>Chúng tôi có quyền khóa tài khoản vi phạm hoặc gian lận</li>
</ul>
<h2>3. Đặt hàng và thanh toán</h2>
<ul>
<li>Giá, khuyến mãi hiển thị tại thời điểm đặt hàng</li>
<li>Đơn hàng có hiệu lực sau khi được xác nhận</li>
<li>Thanh toán qua các phương thức được hỗ trợ trên website (COD, chuyển khoản, ví/cổng thanh toán nếu bật)</li>
</ul>
<h2>4. Giao hàng</h2>
<p>Thời gian giao hàng là dự kiến, có thể thay đổi do địa phương hoặc sự kiện bất khả kháng. Phí ship và miễn phí vận chuyển theo chính sách hiện hành trên website.</p>
<h2>5. Đổi trả và hoàn tiền</h2>
<p>Chính sách đổi trả áp dụng theo quy định riêng trên website và pháp luật bảo vệ người tiêu dùng. Sản phẩm đã mở seal/ sử dụng có thể không được đổi trả vì lý do vệ sinh an toàn thực phẩm.</p>
<h2>6. Sở hữu trí tuệ</h2>
<p>Nội dung website (hình ảnh, mô tả, thương hiệu) thuộc quyền sở hữu của chúng tôi hoặc đối tác. Không sao chép, khai thác thương mại khi chưa được phép.</p>
<h2>7. Giới hạn trách nhiệm</h2>
<p>Chúng tôi không chịu trách nhiệm cho thiệt hại gián tiếp do sử dụng sai hướng dẫn bảo quản sản phẩm hoặc trường hợp bất khả kháng. Trách nhiệm tối đa trong phạm vi pháp luật cho phép.</p>
<h2>8. Thay đổi điều khoản</h2>
<p>Chúng tôi có thể cập nhật điều khoản; phiên bản mới có hiệu lực khi đăng trên website. Việc tiếp tục sử dụng dịch vụ đồng nghĩa chấp nhận thay đổi.</p>
<h2>9. Liên hệ</h2>
<p>Mọi tranh chấp ưu tiên giải quyết thông qua thương lượng. Liên hệ hỗ trợ tại trang <a href="/contact">Liên hệ</a>.</p>
`.trim();

const DEFAULTS: Record<LegalPageSlug, { title: string; content: string }> = {
  privacy: {
    title: "Chính sách bảo mật",
    content: PRIVACY_HTML,
  },
  terms: {
    title: "Điều khoản sử dụng",
    content: TERMS_HTML,
  },
};

export function getDefaultLegalPage(slug: string): PolicyPage | null {
  const entry = DEFAULTS[slug as LegalPageSlug];
  if (!entry) return null;
  return {
    slug,
    title: entry.title,
    content: entry.content,
    updatedAt: new Date().toISOString(),
  };
}

export function isLegalPageSlug(slug: string): slug is LegalPageSlug {
  return slug === LEGAL_PAGE_SLUGS.privacy || slug === LEGAL_PAGE_SLUGS.terms;
}
