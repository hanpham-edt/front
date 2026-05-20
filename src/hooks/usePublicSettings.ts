"use client";

import { useCallback, useEffect, useState } from "react";
import { settingsService } from "@/services/api/settingsService";
import type { PublicSiteInfo } from "@/types/settings-types";
import { mapPublicSettingsToSiteInfo } from "@/utils/settingsMapper";

export function usePublicSettings() {
  const [siteInfo, setSiteInfo] = useState<PublicSiteInfo>(() =>
    mapPublicSettingsToSiteInfo({}),
  );
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const { settings } = await settingsService.getPublic();
      setSiteInfo(mapPublicSettingsToSiteInfo(settings));
    } catch {
      setSiteInfo(mapPublicSettingsToSiteInfo({}));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { siteInfo, isLoading, reload: load };
}
