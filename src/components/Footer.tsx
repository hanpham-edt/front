'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { usePublicSettings } from '@/hooks/usePublicSettings';

function telHref(phone: string) {
  return `tel:${phone.replace(/\s/g, '')}`;
}

export default function Footer() {
  const { siteInfo } = usePublicSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {siteInfo.siteName.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="ml-2 text-xl font-bold">{siteInfo.siteName}</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">{siteInfo.siteDescription}</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Liên Kết Nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Trang Chủ
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Sản Phẩm
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Về Chúng Tôi
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Liên Hệ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Liên Hệ</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-orange-500 mr-3" />
                <a
                  href={telHref(siteInfo.contactPhone)}
                  className="text-gray-300 hover:text-orange-400"
                >
                  {siteInfo.contactPhone}
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-orange-500 mr-3" />
                <a
                  href={`mailto:${siteInfo.contactEmail}`}
                  className="text-gray-300 hover:text-orange-400"
                >
                  {siteInfo.contactEmail}
                </a>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-orange-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-300 whitespace-pre-line">{siteInfo.address}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {year} {siteInfo.siteName}. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-orange-500 text-sm transition-colors">
                Chính Sách Bảo Mật
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-orange-500 text-sm transition-colors">
                Điều Khoản Sử Dụng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
