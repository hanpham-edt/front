"use client";
import React from "react";
import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-yellow-400 to-orange-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Bắt Đầu Hành Trình Sức Khỏe
        </h2>
        <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
          Khám phá bộ sưu tập yến sào cao cấp và trải nghiệm chất lượng dịch vụ
          tuyệt vời của chúng tôi.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <button className="bg-white text-orange-500 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors">
              Mua Sắm Ngay
            </button>
          </Link>
          <Link href="/contact">
            <button className="border-2 border-white text-white hover:bg-white hover:text-orange-500 px-8 py-3 rounded-lg font-semibold transition-colors">
              Liên Hệ Tư Vấn
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
