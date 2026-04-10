"use client";
import React from "react";
import { benefits } from "@/lib/data";
import { Heart } from "lucide-react";
export default function Benefits() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Lợi Ích Từ Yến Sào
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Yến sào không chỉ là thực phẩm bổ dưỡng mà còn mang lại nhiều lợi
            ích tuyệt vời cho sức khỏe và sắc đẹp.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {benefit}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
