"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ArticleForm from "@/components/admin/ArticleForm";
import { articleService } from "@/services/api/articleService";
import type { CreateArticle } from "@/types/article-types";

const empty: CreateArticle = {
  title: "",
  content: "",
  excerpt: "",
  slug: "",
  imageUrl: "",
  isPublished: false,
};

export default function NewArticlePage() {
  const router = useRouter();

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/news" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Viết bài mới</h1>
      </div>
      <div className="rounded-lg bg-white p-6 shadow">
        <ArticleForm
          initial={empty}
          submitLabel="Tạo bài viết"
          onSubmit={async (data) => {
            await articleService.create(data);
            router.push("/admin/news");
            router.refresh();
          }}
        />
      </div>
    </div>
  );
}
