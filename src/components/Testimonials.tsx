"use client";
import React from "react";
import { Star } from "lucide-react";

export default function Testimonials() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Khách Hàng Nói Gì
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Những phản hồi chân thực từ khách hàng đã sử dụng sản phẩm của chúng
            tôi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 text-yellow-400 fill-current"
                />
              ))}
            </div>
            <p className="text-gray-600 mb-4">
              &ldquo;Sản phẩm yến sào chất lượng rất tốt, tôi đã sử dụng được 3
              tháng và cảm thấy sức khỏe cải thiện rõ rệt.&rdquo;
            </p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">N</span>
              </div>
              <div className="ml-3">
                <p className="font-semibold text-gray-900">Nguyễn Thị Anh</p>
                <p className="text-sm text-gray-600">Khách hàng thân thiết</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 text-yellow-400 fill-current"
                />
              ))}
            </div>
            <p className="text-gray-600 mb-4">
              &ldquo;Giao hàng nhanh, sản phẩm đóng gói cẩn thận. Yến sào huyết
              đỏ rất thơm ngon và bổ dưỡng.&rdquo;
            </p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">T</span>
              </div>
              <div className="ml-3">
                <p className="font-semibold text-gray-900">Trần Văn Bình</p>
                <p className="text-sm text-gray-600">Khách hàng mới</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 text-yellow-400 fill-current"
                />
              ))}
            </div>
            <p className="text-gray-600 mb-4">
              &ldquo;Tôi rất hài lòng với dịch vụ và chất lượng sản phẩm. Nhân
              viên tư vấn rất nhiệt tình và chuyên nghiệp.&rdquo;
            </p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">L</span>
              </div>
              <div className="ml-3">
                <p className="font-semibold text-gray-900">Lê Thị Cẩm</p>
                <p className="text-sm text-gray-600">Khách hàng thân thiết</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
