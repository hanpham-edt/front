"use client";

import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { useProductSearchQuery } from "@/hooks/useProductSearchQuery";

interface ProductSearchBarProps {
  className?: string;
  inputClassName?: string;
}

export default function ProductSearchBar({
  className = "",
  inputClassName = "",
}: ProductSearchBarProps) {
  const t = useTranslations("products");
  const { inputValue, setSearchInput } = useProductSearchQuery();

  return (
    <div className={`relative w-full ${className}`}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="search"
        value={inputValue}
        onChange={(e) => setSearchInput(e.target.value)}
        className={`block w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-3 pl-10 text-sm leading-5 placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none ${inputClassName}`}
        placeholder={t("searchPlaceholder")}
        aria-label={t("searchPlaceholder")}
      />
    </div>
  );
}
