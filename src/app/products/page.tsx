// 'use client';

// import { useState } from 'react';
// import ProductCard from '@/components/ProductCard';
// import { products, categories } from '@/lib/data';
// import { Filter, Grid, List } from 'lucide-react';

// export default function ProductsPage() {
//   const [selectedCategory, setSelectedCategory] = useState<string>('all');
//   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
//   const [sortBy, setSortBy] = useState<string>('name');

//   const filteredProducts = products.filter(product => {
//     if (selectedCategory === 'all') return true;
//     return product.category === selectedCategory;
//   });

//   const sortedProducts = [...filteredProducts].sort((a, b) => {
//     switch (sortBy) {
//       case 'price-low':
//         return a.price - b.price;
//       case 'price-high':
//         return b.price - a.price;
//       case 'rating':
//         return b.rating - a.rating;
//       case 'name':
//       default:
//         return a.name.localeCompare(b.name);
//     }
//   });

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//             Sản Phẩm Yến Sào
//           </h1>
//           <p className="text-lg text-gray-600">
//             Khám phá bộ sưu tập yến sào cao cấp với chất lượng tốt nhất
//           </p>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Filters and Controls */}
//         <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
//             {/* Category Filter */}
//             <div className="flex items-center space-x-4">
//               <Filter className="h-5 w-5 text-gray-500" />
//               <span className="text-sm font-medium text-gray-700">Danh mục:</span>
//               <div className="flex space-x-2">
//                 <button
//                   onClick={() => setSelectedCategory('all')}
//                   className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
//                     selectedCategory === 'all'
//                       ? 'bg-orange-500 text-white'
//                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                   }`}
//                 >
//                   Tất cả
//                 </button>
//                 {categories.map((category) => (
//                   <button
//                     key={category.id}
//                     onClick={() => setSelectedCategory(category.id)}
//                     className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
//                       selectedCategory === category.id
//                         ? 'bg-orange-500 text-white'
//                         : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                     }`}
//                   >
//                     {category.name}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Sort and View Controls */}
//             <div className="flex items-center space-x-4">
//               <div className="flex items-center space-x-2">
//                 <span className="text-sm font-medium text-gray-700">Sắp xếp:</span>
//                 <select
//                   value={sortBy}
//                   onChange={(e) => setSortBy(e.target.value)}
//                   className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
//                 >
//                   <option value="name">Tên sản phẩm</option>
//                   <option value="price-low">Giá tăng dần</option>
//                   <option value="price-high">Giá giảm dần</option>
//                   <option value="rating">Đánh giá cao nhất</option>
//                 </select>
//               </div>

//               <div className="flex items-center space-x-2">
//                 <span className="text-sm font-medium text-gray-700">Xem:</span>
//                 <button
//                   onClick={() => setViewMode('grid')}
//                   className={`p-2 rounded-md transition-colors ${
//                     viewMode === 'grid'
//                       ? 'bg-orange-500 text-white'
//                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                   }`}
//                 >
//                   <Grid className="h-4 w-4" />
//                 </button>
//                 <button
//                   onClick={() => setViewMode('list')}
//                   className={`p-2 rounded-md transition-colors ${
//                     viewMode === 'list'
//                       ? 'bg-orange-500 text-white'
//                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                   }`}
//                 >
//                   <List className="h-4 w-4" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Results Count */}
//         <div className="mb-6">
//           <p className="text-gray-600">
//             Hiển thị {sortedProducts.length} sản phẩm
//             {selectedCategory !== 'all' && (
//               <span className="ml-2">
//                 trong danh mục &ldquo;{categories.find(c => c.id === selectedCategory)?.name}&rdquo;
//               </span>
//             )}
//           </p>
//         </div>

//         {/* Products Grid */}
//         {viewMode === 'grid' ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {sortedProducts.map((product) => (
//               <ProductCard key={product.id} product={product} />
//             ))}
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {sortedProducts.map((product) => (
//               <div key={product.id} className="bg-white rounded-lg shadow-sm p-6">
//                 <div className="flex items-center space-x-6">
//                   <div className="w-24 h-24 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg flex items-center justify-center">
//                     <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
//                       <span className="text-white font-bold text-lg">Y</span>
//                     </div>
//                   </div>

//                   <div className="flex-1">
//                     <h3 className="text-xl font-semibold text-gray-900 mb-2">
//                       {product.name}
//                     </h3>
//                     <p className="text-gray-600 mb-2 line-clamp-2">
//                       {product.description}
//                     </p>
//                     <div className="flex items-center space-x-4 text-sm text-gray-500">
//                       <span>Trọng lượng: {product.weight}</span>
//                       <span>Xuất xứ: {product.origin}</span>
//                       <span className={`${
//                         product.inStock ? 'text-green-600' : 'text-red-600'
//                       }`}>
//                         {product.inStock ? '✓ Còn hàng' : '✗ Hết hàng'}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="text-right">
//                     <div className="text-2xl font-bold text-orange-600 mb-2">
//                       {new Intl.NumberFormat('vi-VN', {
//                         style: 'currency',
//                         currency: 'VND',
//                       }).format(product.price)}
//                     </div>
//                     {product.originalPrice && (
//                       <div className="text-sm text-gray-500 line-through mb-2">
//                         {new Intl.NumberFormat('vi-VN', {
//                           style: 'currency',
//                           currency: 'VND',
//                         }).format(product.originalPrice)}
//                       </div>
//                     )}
//                     <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
//                       Thêm vào giỏ
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* No Results */}
//         {sortedProducts.length === 0 && (
//           <div className="text-center py-12">
//             <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
//               <span className="text-white font-bold text-xl">!</span>
//             </div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">
//               Không tìm thấy sản phẩm
//             </h3>
//             <p className="text-gray-600">
//               Không có sản phẩm nào phù hợp với bộ lọc hiện tại.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductList from "@/components/products/ProductList";
import React from "react";

// Next.js ISR caching strategy
export const revalidate = false;

interface pageProps {
  params: Promise<{ id: string }>;
}

export default async function page({ params }: pageProps) {
  const { id } = await params;

  console.log(id);
  return (
    <>
      <Header />
      <ProductList />
      <Footer />
    </>
  );
}
