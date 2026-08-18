import { NextResponse } from "next/server";
import type { AnalyticsEventName } from "@/lib/analytics";

const ALLOWED: AnalyticsEventName[] = [
  "page_view",
  "property_view",
  "whatsapp_click",
  "call_click",
  "enquiry_submit",
  "filter_used",
  "search",
  "map_open",
  "directions_click",
  "media_view",
];

export async function POST(request: Request) {
  const useSupabase =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!useSupabase) {
    // Demo mode — nothing to store.
    return NextResponse.json({ ok: true });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const event = body.event as AnalyticsEventName;
  if (!ALLOWED.includes(event)) {
    return NextResponse.json({ error: "unknown event" }, { status: 400 });
  }

  try {
    const { getSupabaseAdminClient } = await import("@/lib/supabase/server");
    const supabase = getSupabaseAdminClient();
    const ua = request.headers.get("user-agent") ?? null;
    const device = /Mobile|Android|iPhone|iPad/i.test(ua ?? "") ? "mobile" : "desktop";
    await supabase.from("analytics_events").insert({
      event_name: event,
      property_id: (body.propertyId as string) || null,
      property_code: (body.propertyCode as string) || null,
      page_path: (body.page_path as string) || null,
      referrer: (body.referrer as string) || null,
      utm_source: (body.utm_source as string) || null,
      utm_medium: (body.utm_medium as string) || null,
      utm_campaign: (body.utm_campaign as string) || null,
      device,
      user_agent: ua,
      meta: (body.meta as Record<string, unknown>) ?? null,
    });
  } catch {
    // Analytics failures are non-fatal.
  }
  return NextResponse.json({ ok: true });
}
