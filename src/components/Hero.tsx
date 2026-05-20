'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star, Shield, Truck, Clock } from 'lucide-react';
import { heroService } from '@/services/api/heroService';
import type { Hero } from '@/types/hero-types';

const FALLBACK_SLIDES: Hero[] = [
  {
    id: 0,
    title: 'Yến Sào Premium',
    subtitle: 'Sản phẩm cao cấp từ đảo yến tự nhiên',
    description: 'Chất lượng đảm bảo, nguồn gốc rõ ràng.',
    imageUrl: '/images/hero-1.jpg',
    ctaLink: '/products',
    createdAt: '',
    updatedAt: '',
  },
];

export default function Hero() {
  const [slides, setSlides] = useState<Hero[]>(FALLBACK_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    void (async () => {
      try {
        const data = await heroService.getAll();
        if (data.length > 0) {
          setSlides(data);
          setCurrentSlide(0);
        }
      } catch {
        // giữ fallback
      }
    })();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-[600px] overflow-hidden">
      <div className="relative h-full">
        {slides.map((s, index) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {s.imageUrl ? (
              <Image
                src={s.imageUrl}
                alt={s.title}
                fill
                className="object-cover"
                priority={index === 0}
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-100 via-orange-100 to-yellow-50" />
            )}
            <div className="absolute inset-0 bg-black/40" />

            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex h-full items-center">
                <div className="w-full lg:w-1/2">
                  <div className="space-y-6 text-white">
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-yellow-400" />
                      <span className="text-sm font-medium">Sản phẩm cao cấp</span>
                    </div>
                    <h1 className="text-4xl font-bold leading-tight md:text-6xl">
                      {s.title}
                    </h1>
                    <p className="text-xl text-yellow-100 md:text-2xl">{s.subtitle}</p>
                    {s.description ? (
                      <p className="max-w-md text-lg text-gray-200">{s.description}</p>
                    ) : null}
                    <div className="flex space-x-4">
                      <Link href={s.ctaLink}>
                        <button
                          type="button"
                          className="rounded-lg bg-orange-500 px-8 py-3 font-semibold text-white transition-colors hover:bg-orange-600"
                        >
                          Khám phá ngay
                        </button>
                      </Link>
                      <Link href="/products">
                        <button
                          type="button"
                          className="rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition-colors hover:bg-white hover:text-gray-900"
                        >
                          Xem tất cả
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 transition-all hover:bg-white"
          >
            <ChevronLeft className="h-6 w-6 text-gray-800" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 transition-all hover:bg-white"
          >
            <ChevronRight className="h-6 w-6 text-gray-800" />
          </button>
          <div className="absolute bottom-20 left-1/2 flex -translate-x-1/2 space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentSlide(index)}
                className={`h-3 w-3 rounded-full transition-all ${
                  index === currentSlide ? 'bg-orange-500' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-white/95">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-4 md:grid-cols-4">
          <div className="flex items-center justify-center space-x-2">
            <Shield className="h-5 w-5 text-orange-500" />
            <span className="text-sm font-medium">Chất lượng đảm bảo</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Truck className="h-5 w-5 text-orange-500" />
            <span className="text-sm font-medium">Giao hàng toàn quốc</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Clock className="h-5 w-5 text-orange-500" />
            <span className="text-sm font-medium">Giao hàng trong 24h</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Star className="h-5 w-5 text-orange-500" />
            <span className="text-sm font-medium">100% tự nhiên</span>
          </div>
        </div>
      </div>
    </section>
  );
}
