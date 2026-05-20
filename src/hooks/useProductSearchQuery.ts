"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

/** Đồng bộ ô tìm kiếm sản phẩm với query `?search=` trên URL */
export function useProductSearchQuery() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") ?? "";

  const [inputValue, setInputValue] = useState(urlSearch);

  useEffect(() => {
    setInputValue(urlSearch);
  }, [urlSearch]);

  const setSearchInput = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  useEffect(() => {
    const trimmed = inputValue.trim();
    if (trimmed === urlSearch) return;

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (trimmed) {
        params.set("search", trimmed);
      } else {
        params.delete("search");
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }, 400);

    return () => clearTimeout(timer);
  }, [inputValue, urlSearch, pathname, router, searchParams]);

  return { inputValue, setSearchInput, debouncedSearch: urlSearch };
}
