"use client";
import React from "react";
import { Shield, Award, Users } from "lucide-react";
export default function ChooseUs() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tại Sao Chọn Chúng Tôi
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chúng tôi cam kết mang đến những sản phẩm yến sào chất lượng cao
            nhất với dịch vụ khách hàng tận tâm.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Chất Lượng Cao Cấp
            </h3>
            <p className="text-gray-600">
              Sản phẩm được chọn lọc kỹ lưỡng từ những tổ yến tự nhiên, đảm bảo
              dinh dưỡng và an toàn.
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
              Quy trình chế biến nghiêm ngặt, không chất bảo quản, đảm bảo sức
              khỏe cho người sử dụng.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Dịch Vụ Tận Tâm
            </h3>
            <p className="text-gray-600">
              Đội ngũ tư vấn chuyên nghiệp, hỗ trợ khách hàng 24/7 và giao hàng
              nhanh chóng.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
