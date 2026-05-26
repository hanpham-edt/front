"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import PolicyForm from "@/components/admin/PolicyForm";
import { policyService } from "@/services/api/policyService";
import type { PolicyPage } from "@/types/policy-types";

export default function EditPolicyPage() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params.slug ?? "");
  const [initial, setInitial] = useState<PolicyPage | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!slug) {
      setInitial(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      setInitial(await policyService.getBySlugAdmin(slug));
    } catch {
      setInitial(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!initial) {
    return (
      <p className="text-center text-gray-600">
        Không tìm thấy trang chính sách.{" "}
        <Link href="/admin/policies" className="text-orange-600">
          Quay lại
        </Link>
      </p>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/admin/policies"
          className="text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Sửa: {initial.title}</h1>
      </div>
      <div className="rounded-lg bg-white p-6 shadow">
        <PolicyForm
          mode="edit"
          initial={initial}
          submitLabel="Lưu chính sách"
          onSubmit={async (data) => {
            const updated = await policyService.update(slug, data);
            if (updated.slug !== slug) {
              router.replace(`/admin/policies/${updated.slug}/edit`);
            } else {
              router.push("/admin/policies");
            }
            router.refresh();
          }}
        />
      </div>
    </div>
  );
}
