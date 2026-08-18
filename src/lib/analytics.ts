// Application-level event tracking (FR-ANA-05). Fire-and-forget POST to the
// server route which writes to analytics_events (no-op without Supabase env).

export type AnalyticsEventName =
  | "page_view"
  | "property_view"
  | "whatsapp_click"
  | "call_click"
  | "enquiry_submit"
  | "filter_used"
  | "search"
  | "map_open"
  | "directions_click"
  | "media_view";

export interface TrackPayload {
  event: AnalyticsEventName;
  propertyId?: string | null;
  propertyCode?: string | null;
  meta?: Record<string, unknown>;
}

export function track(payload: TrackPayload): void {
  try {
    if (typeof navigator === "undefined") return;
    const body = {
      ...payload,
      page_path: window.location.pathname + window.location.search,
      referrer: document.referrer || null,
      utm_source: new URLSearchParams(window.location.search).get("utm_source"),
      utm_medium: new URLSearchParams(window.location.search).get("utm_medium"),
      utm_campaign: new URLSearchParams(window.location.search).get("utm_campaign"),
    };
    void fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(() => {
      // Tracking must never break the UX.
    });
  } catch {
    // ignore
  }
}
