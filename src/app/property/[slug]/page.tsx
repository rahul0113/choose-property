import type { Metadata } from "next";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Building2,
  FileCheck2,
  Info,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Ruler,
  ShieldCheck,
} from "lucide-react";
import { PropertyViewTracker } from "@/components/property/PropertyViewTracker";
import { Gallery } from "@/components/property/Gallery";
import { PlotDiagram } from "@/components/property/PlotDiagram";
import { MeasurementTable } from "@/components/property/MeasurementTable";
import { CallButton, WhatsAppButton } from "@/components/property/ContactButtons";
import { EnquiryForm } from "@/components/enquiry/EnquiryForm";
import { SmartImage } from "@/components/ui/SmartImage";
import { Badge, availabilityVariant } from "@/components/ui/Badge";
import { getPropertyBySlug, getPublicDocumentChecklist } from "@/lib/data/properties";
import {
  AVAILABILITY_LABELS,
  CLASSIFICATION_LABELS,
  DISCLAIMER_CLASSIFICATION,
  PLACE_TYPE_LABELS,
  PROPERTY_TYPE_LABELS,
  UTILITY_LABELS,
  VERIFICATION_LABELS,
} from "@/lib/constants";
import { formatAreaSqft, formatDate, formatDimension, formatDistance, formatNumber } from "@/lib/format";
import { enquiryWaLink } from "@/lib/whatsapp";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const bundle = await getPropertyBySlug(params.slug);
  if (!bundle) return { title: "Property not found" };
  const { property: p, measurements, location, media } = bundle;
  const cover = media.find((m) => m.is_primary) ?? media[0];
  const area = measurements ? formatAreaSqft(measurements.area_sqft) : "";
  const place = [location?.village, location?.district, "Bihar"].filter(Boolean).join(", ");
  return {
    title: p.title,
    description: `${p.title} — ${area}, ${place}. Road width ${measurements?.road_width_ft ? formatDimension(measurements.road_width_ft) : "n/a"}. ${PROPERTY_TYPE_LABELS[p.property_type]}. Contact for price.`,
    alternates: { canonical: `${siteUrl}/property/${p.slug}` },
    openGraph: {
      type: "website",
      title: p.title,
      description: `${area} ${PROPERTY_TYPE_LABELS[p.property_type]} — ${place}. Contact for Price.`,
      images: cover ? [{ url: cover.url }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: p.title,
      description: `${area} ${PROPERTY_TYPE_LABELS[p.property_type]} — ${place}. Contact for Price.`,
      images: cover ? [cover.url] : undefined,
    },
  };
}

export const dynamic = "force-dynamic";

const UTILITY_KEYS = [
  { key: "electricity", label: "Electricity" },
  { key: "water", label: "Water" },
  { key: "drainage", label: "Drainage / Sewerage" },
  { key: "internet", label: "Internet" },
  { key: "street_lighting", label: "Street Lighting" },
] as const;

const DOT: Record<string, string> = {
  available: "bg-emerald-500",
  nearby: "bg-amber-500",
  not_available: "bg-red-500",
  unknown: "bg-slate-300",
};

function Section({
  id,
  title,
  icon: Icon,
  children,
}: {
  id?: string;
  title: string;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-paper-line py-6 sm:py-8 first:border-t-0">
      <h2 className="flex items-center gap-2 text-lg font-bold">
        <Icon className="h-5 w-5 text-brand" aria-hidden />
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default async function PropertyPage({ params }: { params: { slug: string } }) {
  const bundle = await getPropertyBySlug(params.slug);
  if (!bundle) notFound();

  const { property: p, measurements, location, nearby_places, utilities, classification, media, standard } = bundle;
  const cover = media.find((m) => m.is_primary) ?? media.find((m) => m.media_type === "drone_photo") ?? media[0];
  const place = [location?.village, location?.district, location?.state ?? "Bihar"].filter(Boolean).join(", ");
  const area = measurements?.area_sqft;
  const checklist = getPublicDocumentChecklist(bundle);
  const showMap = location?.latitude != null && location?.longitude != null && location.location_precision !== "hidden";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: p.title,
    url: `${siteUrl}/property/${p.slug}`,
    image: cover?.url,
    description: p.description ?? undefined,
    identifier: p.property_id,
    address: location
      ? {
          "@type": "PostalAddress",
          addressLocality: location.village ?? undefined,
          addressRegion: location.district ?? undefined,
          postalCode: location.pincode ?? undefined,
          addressCountry: "IN",
        }
      : undefined,
  };

  return (
    <article className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <PropertyViewTracker propertyId={p.property_id} propertyUuid={p.id} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <div className="relative -mx-4 overflow-hidden bg-paper-soft sm:mx-0 sm:mt-2 sm:rounded-2xl">
        <div className="relative aspect-[16/9] max-h-[520px] w-full sm:aspect-[16/7]">
          {cover ? (
            <SmartImage src={cover.url} alt={cover.alt_text ?? p.title} sizes="100vw" priority className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-ink-faint">No photo yet</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" aria-hidden />
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={availabilityVariant(p.availability)}>{AVAILABILITY_LABELS[p.availability]}</Badge>
              <Badge variant="brand">{PROPERTY_TYPE_LABELS[p.property_type]}</Badge>
              <Badge variant="outline" className="bg-ink/40 text-white">{p.property_id}</Badge>
            </div>
            <h1 className="mt-3 max-w-2xl text-2xl font-bold text-white text-balance sm:text-3xl">{p.title}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-white/85">
              <MapPin className="h-4 w-4" aria-hidden /> {place}
            </p>
          </div>
        </div>
      </div>

      {/* Sticky action bar (mobile) */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-paper-line bg-white/95 p-3 backdrop-blur shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:hidden">
        <div className="mx-auto flex max-w-md items-center gap-2">
          <WhatsAppButton propertyId={p.property_id} propertyUuid={p.id} size="md" className="flex-1" label="WhatsApp" />
          <CallButton propertyUuid={p.id} size="md" className="flex-1" />
          <a
            href="#enquire"
            className="flex flex-1 items-center justify-center rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            Enquire
          </a>
        </div>
      </div>

      {/* Key facts strip */}
      {measurements && (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="rounded-xl border border-paper-line bg-white p-3 shadow-card">
            <p className="text-xs text-ink-faint">Area</p>
            <p className="tabular mt-0.5 font-semibold">{formatAreaSqft(measurements.area_sqft)}</p>
          </div>
          <div className="rounded-xl border border-paper-line bg-white p-3 shadow-card">
            <p className="text-xs text-ink-faint">Dimensions</p>
            <p className="tabular mt-0.5 font-semibold">
              {measurements.east_ft && measurements.south_ft
                ? `${formatNumber(measurements.east_ft, 0)} × ${formatNumber(measurements.south_ft, 0)} ft`
                : "See diagram"}
            </p>
          </div>
          <div className="rounded-xl border border-paper-line bg-white p-3 shadow-card">
            <p className="text-xs text-ink-faint">Road width</p>
            <p className="tabular mt-0.5 font-semibold">{formatDimension(measurements.road_width_ft)}</p>
          </div>
          <div className="rounded-xl border border-paper-line bg-white p-3 shadow-card">
            <p className="text-xs text-ink-faint">Facing</p>
            <p className="mt-0.5 font-semibold">{p.facing ?? "—"}</p>
          </div>
          {p.open_sites != null && (
            <div className="rounded-xl border border-brand/30 bg-brand-soft p-3 shadow-card sm:col-span-4">
              <p className="text-xs text-brand-dark font-medium">Open Sites Around Property</p>
              <p className="mt-0.5 font-bold text-brand-dark">{p.open_sites} {p.open_sites === 1 ? "site" : "sites"}</p>
            </div>
          )}
        </div>
      )}

      {/* Description */}
      {p.description && <p className="mt-6 max-w-3xl leading-relaxed text-ink-soft">{p.description}</p>}

      {/* Amenities */}
      {p.amenities && p.amenities.length > 0 && (
        <div className="mt-6">
          <h2 className="flex items-center gap-2 text-base font-bold">
            <MapPin className="h-4 w-4 text-brand" aria-hidden /> Nearby Amenities
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {p.amenities.map((amenity) => (
              <span key={amenity} className="inline-flex items-center rounded-full border border-brand/20 bg-brand-soft px-3 py-1 text-sm font-medium text-brand-dark">
                {amenity}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-10">
        <div>
          {/* Photography */}
          <Section id="gallery" title="Photos & Drone Views" icon={MapPin}>
            <Gallery media={media} propertyId={p.property_id} propertyUuid={p.id} />
          </Section>

          {/* Plot dimensions */}
          {measurements && (
            <Section id="dimensions" title="Plot Dimensions" icon={Ruler}>
              <PlotDiagram measurements={measurements} />
              <dl className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {[
                  ["North", measurements.north_ft],
                  ["South", measurements.south_ft],
                  ["East", measurements.east_ft],
                  ["West", measurements.west_ft],
                  ["Road frontage", measurements.road_frontage_ft],
                  ["Road width", measurements.road_width_ft],
                ].map(([label, value]) => (
                  <div key={String(label)} className="rounded-lg border border-paper-line bg-paper-soft px-3 py-2.5">
                    <dt className="text-xs text-ink-faint">{label}</dt>
                    <dd className="tabular mt-0.5 font-semibold">{formatDimension(value as number | null)}</dd>
                  </div>
                ))}
              </dl>
            </Section>
          )}

          {/* Land measurement */}
          {measurements && standard && (
            <Section id="measurements" title="Land Measurement (Bihar)" icon={Building2}>
              <MeasurementTable areaSqft={measurements.area_sqft} standard={standard} />
            </Section>
          )}

          {/* Land classification */}
          {classification && (
            <Section id="classification" title="Land Classification" icon={ShieldCheck}>
              <div className="rounded-xl border border-paper-line bg-white p-4 shadow-card">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{CLASSIFICATION_LABELS[classification.classification]}</span>
                  <Badge variant={classification.verification_status === "pending" ? "amber" : "green"}>
                    {VERIFICATION_LABELS[classification.verification_status]}
                  </Badge>
                </div>
                {classification.verification_source && (
                  <p className="mt-3 text-sm text-ink-soft">
                    <span className="font-medium text-ink">Source:</span> {classification.verification_source}
                    {classification.verification_date ? ` (${formatDate(classification.verification_date)})` : ""}
                  </p>
                )}
                <p className="mt-4 flex items-start gap-1.5 text-xs leading-relaxed text-ink-faint">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                  {DISCLAIMER_CLASSIFICATION}
                </p>
              </div>
            </Section>
          )}

          {/* Documents */}
          <Section id="documents" title="Documentation" icon={FileCheck2}>
            <div className="overflow-hidden rounded-xl border border-paper-line">
              <ul className="divide-y divide-paper-line bg-white">
                {checklist.map((doc) => (
                  <li key={doc.name} className="flex items-center justify-between gap-3 px-4 py-3">
                    <span className="text-sm font-medium">{doc.name}</span>
                    <Badge variant={doc.status === "verified" ? "green" : doc.status === "pending" ? "amber" : "red"}>
                      {doc.status === "verified" ? "Verified" : doc.status === "pending" ? "Pending" : "Not verified"}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-3 text-xs text-ink-faint">
              Original documents stay private — we share them directly with interested buyers after enquiry.
            </p>
          </Section>

          {/* Road & connectivity */}
          {(measurements?.road_width_ft != null || nearby_places.length > 0) && (
            <Section id="connectivity" title="Road & Connectivity" icon={Navigation}>
              {nearby_places.length > 0 && (
                <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {nearby_places.map((np) => (
                    <div key={np.id} className="flex items-center justify-between rounded-lg border border-paper-line bg-white px-3 py-2.5 shadow-card">
                      <dt className="text-sm text-ink-soft">
                        {PLACE_TYPE_LABELS[np.place_type]}
                        {np.name ? <span className="text-ink-faint"> — {np.name}</span> : null}
                      </dt>
                      <dd className="tabular ml-3 shrink-0 text-sm font-semibold">
                        {np.distance_text ?? formatDistance(np.distance_km)}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
              <dl className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {[
                  ["Road type", p.facing ? "Pucca" : "—"],
                  ["Road width", formatDimension(measurements?.road_width_ft ?? null)],
                  ["Road frontage", formatDimension(measurements?.road_frontage_ft ?? null)],
                  ["Corner plot", p.facing === "Corner" ? "Yes" : "No"],
                ].map(([label, value]) => (
                  <div key={String(label)} className="rounded-lg border border-paper-line bg-paper-soft px-3 py-2.5">
                    <dt className="text-xs text-ink-faint">{label}</dt>
                    <dd className="mt-0.5 text-sm font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>
            </Section>
          )}

          {/* Utilities */}
          {utilities && (
            <Section id="utilities" title="Utilities" icon={MapPin}>
              <ul className="divide-y divide-paper-line overflow-hidden rounded-xl border border-paper-line bg-white">
                {UTILITY_KEYS.map((u) => (
                  <li key={u.key} className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm font-medium">{u.label}</span>
                    <span className="flex items-center gap-2 text-sm text-ink-soft">
                      <span className={`h-2.5 w-2.5 rounded-full ${DOT[utilities[u.key]]}`} aria-hidden />
                      {UTILITY_LABELS[utilities[u.key]]}
                    </span>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-paper-line bg-white p-5 shadow-card">
            <p className="text-sm text-ink-faint">Selling price</p>
            <p className="mt-0.5 text-xl font-bold text-accent">{p.price_display}</p>
            <div className="mt-4 space-y-2">
              <WhatsAppButton propertyId={p.property_id} propertyUuid={p.id} size="lg" className="w-full" />
              <CallButton propertyUuid={p.id} size="lg" className="w-full" />
            </div>
            <a
              href={enquiryWaLink(p.property_id)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center justify-center gap-2 rounded-full border border-paper-line px-5 py-3 text-sm font-semibold text-ink-soft hover:bg-paper-soft"
            >
              <MessageCircle className="h-5 w-5" aria-hidden /> Ask on WhatsApp
            </a>
          </div>

          {/* Location & map */}
          <div className="rounded-2xl border border-paper-line bg-white p-5 shadow-card">
            <h2 className="flex items-center gap-2 font-bold">
              <MapPin className="h-5 w-5 text-brand" aria-hidden /> Location
            </h2>
            {location && (
              <dl className="mt-3 space-y-1.5 text-sm">
                {[
                  ["Village", location.village],
                  ["Panchayat", location.panchayat],
                  ["Block", location.block],
                  ["District", location.district],
                  ["State", location.state],
                  ["PIN", location.pincode],
                ].map(([label, value]) =>
                  value ? (
                    <div key={label} className="flex justify-between gap-3">
                      <dt className="text-ink-faint">{label}</dt>
                      <dd className="text-right font-medium">{value}</dd>
                    </div>
                  ) : null
                )}
                {location.full_address && (
                  <div className="flex justify-between gap-3">
                    <dt className="shrink-0 text-ink-faint">Address</dt>
                    <dd className="text-right font-medium">{location.full_address}</dd>
                  </div>
                )}
                {location.nearby_landmark && (
                  <div className="flex justify-between gap-3">
                    <dt className="shrink-0 text-ink-faint">Landmark</dt>
                    <dd className="text-right font-medium">{location.nearby_landmark}</dd>
                  </div>
                )}
              </dl>
            )}

            {showMap ? (
              <>
                <iframe
                  title={`Map of ${p.title}`}
                  src={`https://maps.google.com/maps?q=${location!.latitude},${location!.longitude}&z=14&output=embed`}
                  className="mt-4 h-48 w-full rounded-xl border border-paper-line"
                  loading="lazy"
                />
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${location!.latitude},${location!.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex h-11 items-center justify-center gap-2 rounded-full border border-paper-line text-sm font-semibold text-brand hover:bg-brand-soft"
                >
                  <Navigation className="h-4 w-4" aria-hidden /> Get Directions
                </a>
              </>
            ) : (
              <p className="mt-4 rounded-xl bg-paper-soft px-4 py-3 text-sm text-ink-soft">
                {location?.location_precision === "hidden"
                  ? "Exact location is shared after enquiry — ask us on WhatsApp."
                  : "Map unavailable for this property."}
              </p>
            )}
          </div>
        </aside>
      </div>

      {/* Enquiry band */}
      <section id="enquire" className="mt-8 scroll-mt-24 rounded-2xl border border-paper-line bg-white p-5 shadow-card sm:p-8">
        <h2 className="text-xl font-bold">Enquire about this property</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Interested in {p.property_id}? Leave your details and the team will call you back.
        </p>
        <div className="mt-5 max-w-2xl">
          <EnquiryForm defaultProperty={p.property_id} compact />
        </div>
        <div className="mt-6 flex flex-wrap gap-3 border-t border-paper-line pt-6">
          <WhatsAppButton propertyId={p.property_id} propertyUuid={p.id} size="lg" label="WhatsApp Us" />
          <CallButton propertyUuid={p.id} size="lg" />
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 rounded-full border border-paper-line px-5 py-3 text-base font-semibold text-ink-soft hover:bg-paper-soft"
          >
            Browse more properties <ArrowRight className="h-5 w-5" aria-hidden />
          </Link>
        </div>
      </section>

      {/* Desktop-only floating actions */}
      <div className="mt-10 hidden items-center justify-center gap-3 md:flex">
        <Phone className="h-4 w-4 text-ink-faint" aria-hidden />
        <p className="text-sm text-ink-faint">Prefer to talk? Call us any time during working hours.</p>
      </div>
    </article>
  );
}
