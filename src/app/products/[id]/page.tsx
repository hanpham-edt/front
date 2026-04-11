"use client";
import { products } from "@/lib/data";
import { Star } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Generate static params for all products
// export async function generateStaticParams() {
//   return products.map((product) => ({
//     id: product.id,
//   }));
// }

export default function ProductDetailPage() {
  // const { id } = await params;
  // const product = products.find(p => p.id === id);
  // if (!product) notFound();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
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
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-4xl">Y</span>
                  </div>
                  <p className="text-gray-700 font-semibold text-lg">
                    {product.name}
                  </p>
                </div>
              </div>
              {/* Product Badges */}
              <div className="flex space-x-2">
                {product.featured && (
                  <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full">
                    Nổi bật
                  </span>
                )}
                {product.originalPrice && (
                  <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                    -
                    {Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100,
                    )}
                    %
                  </span>
                )}
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    product.category === "premium"
                      ? "bg-yellow-100 text-yellow-800"
                      : product.category === "standard"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                  }`}
                >
                  {product.category === "premium"
                    ? "Cao Cấp"
                    : product.category === "standard"
                      ? "Tiêu Chuẩn"
                      : "Kinh Tế"}
                </span>
              </div>
            </div>
            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <p className="text-gray-600 text-lg">{product.description}</p>
              </div>
              {/* Rating */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.rating} ({product.reviews} đánh giá)
                </span>
              </div>
              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-orange-600">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>
              {/* Product Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Trọng lượng:</span>
                  <p className="font-medium">{product.weight}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Xuất xứ:</span>
                  <p className="font-medium">{product.origin}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Tình trạng:</span>
                  <p
                    className={`font-medium ${
                      product.inStock ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {product.inStock ? "Còn hàng" : "Hết hàng"}
                  </p>
                </div>
              </div>
              {/* Benefits */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Lợi ích sản phẩm:
                </h3>
                <ul className="space-y-2">
                  {product.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          {/* Related Products */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Sản phẩm liên quan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products
                .filter(
                  (p) => p.id !== product.id && p.category === product.category,
                )
                .slice(0, 4)
                .map((relatedProduct) => (
                  <div
                    key={relatedProduct.id}
                    className="bg-white rounded-lg shadow-sm p-4"
                  >
                    <div className="w-full h-32 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg flex items-center justify-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">Y</span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                    <div className="text-orange-600 font-bold">
                      {formatPrice(relatedProduct.price)}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
