"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import HeroForm from "@/components/admin/HeroForm";
import { heroService } from "@/services/api/heroService";
import type { CreateHero } from "@/types/hero-types";

const emptyHero: CreateHero = {
  title: "",
  subtitle: "",
  description: "",
  imageUrl: "",
  ctaLink: "/products",
  isPublished: false,
};

export default function NewHeroPage() {
  const router = useRouter();

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin/hero">
          <button type="button" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Thêm slide Hero</h1>
          <p className="text-gray-600">Tạo banner mới cho trang chủ</p>
        </div>
      </div>

      <div className="max-w-2xl rounded-lg bg-white p-6 shadow">
        <HeroForm
          initial={emptyHero}
          submitLabel="Tạo slide"
          onSubmit={async (data) => {
            await heroService.create(data);
            router.push("/admin/hero");
          }}
        />
      </div>
    </div>
  );
}
