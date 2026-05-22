"use client";

import { useCallback, useEffect, useState } from "react";
import { settingsService } from "@/services/api/settingsService";
import type { PublicPaymentOptions, PublicSiteInfo } from "@/types/settings-types";
import {
  mapPublicSettingsToPaymentOptions,
  mapPublicSettingsToSiteInfo,
} from "@/utils/settingsMapper";

export function usePublicSettings() {
  const [siteInfo, setSiteInfo] = useState<PublicSiteInfo>(() =>
    mapPublicSettingsToSiteInfo({}),
  );
  const [paymentOptions, setPaymentOptions] = useState<PublicPaymentOptions>(
    () => mapPublicSettingsToPaymentOptions({}),
  );
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const { settings } = await settingsService.getPublic();
      setSiteInfo(mapPublicSettingsToSiteInfo(settings));
      setPaymentOptions(mapPublicSettingsToPaymentOptions(settings));
    } catch {
      setSiteInfo(mapPublicSettingsToSiteInfo({}));
      setPaymentOptions(mapPublicSettingsToPaymentOptions({}));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { siteInfo, paymentOptions, isLoading, reload: load };
}
