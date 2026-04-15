"use client";
import React from "react";
import Link from "next/link";

export default function Breadcrumbs({ productName }: { productName: string }) {
  return (
    <>
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-orange-500">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-orange-500">
              Sản phẩm
            </Link>
            <span>/</span>
            <span className="text-gray-900">{productName}</span>
          </div>
        </div>
      </div>
    </>
  );
}
