"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import PolicyForm from "@/components/admin/PolicyForm";
import { policyService } from "@/services/api/policyService";
import type { CreatePolicyPage } from "@/types/policy-types";

const empty = {
  title: "",
  slug: "",
  content: "<p></p>",
  isPublished: true,
  sortOrder: 0,
};

export default function NewPolicyPage() {
  const router = useRouter();

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/admin/policies"
          className="text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          Thêm trang chính sách
        </h1>
      </div>
      <div className="rounded-lg bg-white p-6 shadow">
        <PolicyForm
          mode="create"
          initial={empty}
          submitLabel="Tạo trang"
          onSubmit={async (data) => {
            const created = await policyService.create(data as CreatePolicyPage);
            router.push(`/admin/policies/${created.slug}/edit`);
            router.refresh();
          }}
        />
      </div>
    </div>
  );
}
