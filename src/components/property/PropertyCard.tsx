import Link from "next/link";
import { ArrowRight, MapPin, Ruler, Zap } from "lucide-react";
import type { PropertyBundle } from "@/types/database";
import { Badge, availabilityVariant } from "@/components/ui/Badge";
import { SmartImage } from "@/components/ui/SmartImage";
import { PROPERTY_TYPE_LABELS, AVAILABILITY_LABELS, UTILITY_LABELS } from "@/lib/constants";
import { formatAreaSqft, formatNumber } from "@/lib/format";
import { WhatsAppButton } from "@/components/property/ContactButtons";

export function PropertyCard({ bundle }: { bundle: PropertyBundle }) {
  const { property: p, measurements, location, utilities, media } = bundle;
  const cover =
    media.find((m) => m.is_primary) ?? media.find((m) => m.media_type === "drone_photo") ?? media[0];

  const locationText = location
    ? [location.village, location.district].filter(Boolean).join(", ")
    : null;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-paper-line bg-white shadow-card transition-shadow hover:shadow-md">
      <Link href={`/property/${p.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-paper-soft" aria-label={p.title}>
        {cover ? (
          <SmartImage
            src={cover.url}
            alt={cover.alt_text ?? p.title}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-faint">No photo yet</div>
        )}
        <span className="absolute left-3 top-3">
          <Badge variant={availabilityVariant(p.availability)}>{AVAILABILITY_LABELS[p.availability]}</Badge>
        </span>
        <span className="absolute right-3 top-3 rounded-md bg-ink/70 px-2 py-1 text-[11px] font-semibold text-white">
          {p.property_id}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/property/${p.slug}`} className="text-base font-semibold leading-snug hover:text-brand">
          {p.title}
        </Link>

        <p className="mt-1.5 flex items-center gap-1 text-sm text-ink-faint">
          <MapPin className="h-4 w-4 shrink-0" aria-hidden />
          {locationText ?? "Bihar, India"}
          {measurements?.road_width_ft ? (
            <>
              <span aria-hidden>·</span> {formatNumber(measurements.road_width_ft, 0)} ft road
            </>
          ) : null}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-soft">
          {measurements ? (
            <span className="flex items-center gap-1 font-medium text-ink">
              <Ruler className="h-4 w-4 text-brand" aria-hidden />
              {formatAreaSqft(measurements.area_sqft)}
            </span>
          ) : null}
          {p.facing ? <span>{p.facing} Facing</span> : null}
          {utilities?.electricity === "available" ? (
            <span className="flex items-center gap-1">
              <Zap className="h-4 w-4 text-amber-600" aria-hidden />
              {UTILITY_LABELS.available}
            </span>
          ) : null}
        </div>

        <p className="mt-2 text-xs font-medium uppercase tracking-wide text-accent">
          {PROPERTY_TYPE_LABELS[p.property_type]} · {p.price_display}
        </p>

        <div className="mt-4 flex items-center gap-2">
          <Link
            href={`/property/${p.slug}`}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            View Property
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <WhatsAppButton propertyId={p.property_id} propertyUuid={p.id} size="sm" className="flex-1" label="WhatsApp" />
        </div>
      </div>
    </article>
  );
}
