import { Award, Shield, Heart, Star, MapPin, Phone, Mail } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Yến Sào A Phú Hãn
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Chúng tôi cam kết mang đến những sản phẩm yến sào chất lượng cao
              nhất, được thu hoạch từ những đảo yến tự nhiên với quy trình chế
              biến nghiêm ngặt.
            </p>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Câu Chuyện Của Chúng Tôi
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Yến Sào A Phú Hãn được thành lập với sứ mệnh mang đến những
                  sản phẩm yến sào chất lượng cao nhất cho người tiêu dùng Việt
                  Nam. Chúng tôi hiểu rằng yến sào không chỉ là thực phẩm bổ
                  dưỡng mà còn là món quà quý giá từ thiên nhiên.
                </p>
                <p>
                  Với hơn 10 năm kinh nghiệm trong lĩnh vực yến sào, chúng tôi
                  đã xây dựng được mạng lưới thu hoạch và chế biến yến sào rộng
                  khắp các đảo yến tự nhiên tại Việt Nam, đảm bảo chất lượng và
                  nguồn gốc rõ ràng.
                </p>
                <p>
                  Chúng tôi cam kết tuân thủ các tiêu chuẩn chất lượng nghiêm
                  ngặt, từ khâu thu hoạch đến chế biến và đóng gói, để mang đến
                  những sản phẩm tốt nhất cho sức khỏe của bạn.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg p-8">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-4xl">Y</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Yến Sào A Phú Hãn
                </h3>
                <p className="text-gray-600">Chất lượng - Uy tín - Tận tâm</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Giá Trị Cốt Lõi
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Những giá trị mà chúng tôi theo đuổi và cam kết thực hiện mỗi
              ngày.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Chất Lượng Cao
              </h3>
              <p className="text-gray-600">
                Cam kết mang đến sản phẩm chất lượng cao nhất, được chọn lọc kỹ
                lưỡng từ nguồn nguyên liệu tự nhiên.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                An Toàn Tuyệt Đối
              </h3>
              <p className="text-gray-600">
                Quy trình sản xuất nghiêm ngặt, không chất bảo quản, đảm bảo an
                toàn cho sức khỏe người tiêu dùng.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Tận Tâm Phục Vụ
              </h3>
              <p className="text-gray-600">
                Đội ngũ nhân viên chuyên nghiệp, tận tâm phục vụ và hỗ trợ khách
                hàng 24/7.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Uy Tín Lâu Dài
              </h3>
              <p className="text-gray-600">
                Xây dựng niềm tin với khách hàng thông qua chất lượng sản phẩm
                và dịch vụ tốt nhất.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">10+</div>
              <div className="text-gray-600">Năm kinh nghiệm</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">
                50,000+
              </div>
              <div className="text-gray-600">Khách hàng tin tưởng</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">
                100%
              </div>
              <div className="text-gray-600">Sản phẩm tự nhiên</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">
                24/7
              </div>
              <div className="text-gray-600">Hỗ trợ khách hàng</div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Quy Trình Sản Xuất
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Từ thu hoạch đến đóng gói, mỗi bước đều được thực hiện cẩn thận để
              đảm bảo chất lượng tốt nhất.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Thu Hoạch
              </h3>
              <p className="text-gray-600">
                Thu hoạch yến sào từ những đảo yến tự nhiên, đảm bảo nguồn gốc
                rõ ràng và chất lượng cao.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Chế Biến
              </h3>
              <p className="text-gray-600">
                Quy trình chế biến nghiêm ngặt, loại bỏ tạp chất, giữ nguyên
                dinh dưỡng tự nhiên.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Đóng Gói
              </h3>
              <p className="text-gray-600">
                Đóng gói cẩn thận, bảo quản tốt để giữ nguyên chất lượng và
                hương vị tự nhiên.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Liên Hệ Với Chúng Tôi
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hãy liên hệ với chúng tôi để được tư vấn và hỗ trợ tốt nhất.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Điện Thoại
              </h3>
              <p className="text-gray-600">+84 123 456 789</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Email
              </h3>
              <p className="text-gray-600">info@yensaopremium.com</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Địa Chỉ
              </h3>
              <p className="text-gray-600">
                123 Đường ABC, Quận 1, TP.HCM, Việt Nam
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
