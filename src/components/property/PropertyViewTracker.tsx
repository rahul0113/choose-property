"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

export function PropertyViewTracker({ propertyId, propertyUuid }: { propertyId: string; propertyUuid?: string }) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    track({ event: "property_view", propertyId: propertyUuid ?? null, propertyCode: propertyId });
  }, [propertyId, propertyUuid]);
  return null;
}
