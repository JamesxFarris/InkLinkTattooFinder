"use client";

import { useEffect } from "react";

export function ViewTracker({ listingId }: { listingId: number }) {
  useEffect(() => {
    fetch(`/api/listings/${listingId}/view`, { method: "POST" }).catch(() => {});
  }, [listingId]);

  return null;
}
