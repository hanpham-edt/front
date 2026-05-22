"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import HeroForm from "@/components/admin/HeroForm";
import { heroService } from "@/services/api/heroService";
import type { CreateHero } from "@/types/hero-types";

export default function EditHeroPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [initial, setInitial] = useState<CreateHero | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (Number.isNaN(id)) {
      setLoadError("ID không hợp lệ");
      return;
    }
    void (async () => {
      try {
        const hero = await heroService.getById(id);
        setInitial({
          title: hero.title,
          subtitle: hero.subtitle,
          description: hero.description ?? "",
          imageUrl: hero.imageUrl,
          ctaLink: hero.ctaLink,
          isPublished: hero.isPublished,
        });
      } catch {
        setLoadError("Không tải được slide Hero.");
      }
    })();
  }, [id]);

  if (loadError) {
    return <p className="text-red-600">{loadError}</p>;
  }

  if (!initial) {
    return <p className="text-gray-500">Đang tải...</p>;
  }

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin/hero">
          <button type="button" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sửa slide Hero</h1>
          <p className="text-gray-600">ID #{id}</p>
        </div>
      </div>

      <div className="max-w-2xl rounded-lg bg-white p-6 shadow">
        <HeroForm
          initial={initial}
          submitLabel="Cập nhật"
          onSubmit={async (data) => {
            await heroService.update(id, data);
            router.push("/admin/hero");
          }}
        />
      </div>
    </div>
  );
}
