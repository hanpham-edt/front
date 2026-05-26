"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ArticleHtmlContent from "@/components/articles/ArticleHtmlContent";
import { policyService } from "@/services/api/policyService";
import type { PolicyPage } from "@/types/policy-types";
import { getDefaultLegalPage } from "@/lib/default-legal-pages";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useCallback, useEffect, useState } from "react";

type Props = {
  slug: string;
};

export default function PolicyDetailView({ slug }: Props) {
  const [page, setPage] = useState<PolicyPage | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!slug) {
      setPage(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const fromApi = await policyService.getBySlug(slug);
      setPage(fromApi ?? getDefaultLegalPage(slug));
    } catch {
      setPage(getDefaultLegalPage(slug));
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-orange-600 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Về trang chủ
          </Link>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
          ) : !page ? (
            <div className="rounded-lg bg-white p-8 text-center shadow-sm">
              <p className="text-gray-600">Không tìm thấy trang chính sách.</p>
              <Link
                href="/contact"
                className="mt-4 inline-block text-orange-600 hover:underline"
              >
                Liên hệ hỗ trợ
              </Link>
            </div>
          ) : (
            <article className="rounded-xl bg-white p-6 shadow-sm sm:p-10">
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                {page.title}
              </h1>
              {page.updatedAt ? (
                <p className="mb-8 text-sm text-gray-500">
                  Cập nhật:{" "}
                  {new Date(page.updatedAt).toLocaleDateString("vi-VN", {
                    dateStyle: "long",
                  })}
                </p>
              ) : null}
              <ArticleHtmlContent html={page.content} />
            </article>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
