"use client";

import { useEffect, useState } from "react";
import { persistor } from "@/store";

/** Chờ redux-persist rehydrate xong (tránh redirect login sớm khi restore token). */
export function usePersistRehydrated() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (persistor.getState().bootstrapped) {
      setOk(true);
      return;
    }
    const unsub = persistor.subscribe(() => {
      if (persistor.getState().bootstrapped) {
        setOk(true);
      }
    });
    return unsub;
  }, []);
  return ok;
}
