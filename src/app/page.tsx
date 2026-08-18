import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  FileCheck2,
  MapPin,
  MessageCircle,
  Phone,
  Ruler,
  Satellite,
  ShieldCheck,
  Waypoints,
} from "lucide-react";
import { HeroSearch } from "@/components/home/HeroSearch";
import { PropertyCard } from "@/components/property/PropertyCard";
import { SmartImage } from "@/components/ui/SmartImage";
import { getDistricts, getFeaturedProperties } from "@/lib/data/properties";
import { enquiryWaLink } from "@/lib/whatsapp";

const HERO_IMG = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=70";

const WHY_US = [
  { icon: Ruler, title: "Exact dimensions", text: "North / South / East / West lengths, frontage and road width — not vague claims." },
  { icon: Waypoints, title: "Road & connectivity", text: "Distance to main road, highway, market, school, hospital and more." },
  { icon: MapPin, title: "Real location", text: "Village, panchayat, block, district and PIN — with map + directions." },
  { icon: Satellite, title: "Ground + drone views", text: "Photos from every angle and drone views so you know the land before you visit." },
  { icon: Calculator, title: "Measurement support", text: "Area shown in sq.ft and local units — Katha, Dismil, Decimal, Bigha." },
  { icon: FileCheck2, title: "Documentation status", text: "A clear checklist of khatiyan, jamabandi and mutation status per property." },
  { icon: ShieldCheck, title: "Honest classification", text: "Land classification shown with verification status — no overclaiming." },
  { icon: MessageCircle, title: "Direct contact", text: "Talk straight to the client on WhatsApp or phone. No middlemen." },
];

const MEASURE_UNITS = ["Katha", "Dismil", "Decimal", "Bigha", "Sq.ft", "Sq.m", "Acre", "Hectare"];

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, districts] = await Promise.all([getFeaturedProperties(3), getDistricts()]);

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[480px] items-center bg-ink sm:min-h-[560px]">
        {/* Background image — clip its own overflow, not the section */}
        <div className="absolute inset-0 overflow-hidden">
          <SmartImage src={HERO_IMG} alt="Aerial view of land in Bihar" sizes="100vw" priority className="object-cover opacity-60" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/30 to-ink/70" aria-hidden />
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-48 pt-16 text-center text-white sm:px-6 sm:pb-40">
          <h1 className="mx-auto max-w-2xl text-3xl font-bold leading-tight text-balance sm:text-4xl">
            Find the right land. Understand every detail before you visit.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/85">
            Land &amp; plots in Bihar with exact dimensions, road access, utilities, documents and drone views — all before you call.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/properties"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Explore Properties <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center rounded-full border border-white/40 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Contact Us
            </Link>
          </div>
        </div>
        {/* Search card overlapping hero bottom */}
        <div className="absolute inset-x-0 bottom-0 translate-y-1/2 px-4 sm:px-6">
          <div className="mx-auto max-w-6xl rounded-2xl border border-paper-line bg-white p-4 shadow-card sm:p-5">
            <HeroSearch districts={districts} />
          </div>
        </div>
      </section>

      {/* Featured — extra top padding accounts for the overlapping search card */}
      <section className="mx-auto max-w-6xl px-4 pt-36 sm:px-6 sm:pt-40">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Featured Properties</h2>
            <p className="mt-1 text-sm text-ink-soft">Hand-picked plots with complete, verified details.</p>
          </div>
          <Link href="/properties" className="flex shrink-0 items-center gap-1 text-sm font-semibold text-brand hover:underline">
            View all <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((b) => (
            <PropertyCard key={b.property.id} bundle={b} />
          ))}
        </div>
      </section>

      {/* Why Choose Property */}
      <section className="mt-16 bg-paper-soft py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold">Why Choose Property?</h2>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            Buying land is a big decision. We answer every important question before you visit the site.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_US.map((w) => (
              <div key={w.title} className="rounded-xl border border-paper-line bg-white p-5 shadow-card">
                <w.icon className="h-6 w-6 text-brand" aria-hidden />
                <h3 className="mt-3 font-semibold">{w.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Measurement tools */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="rounded-2xl border border-paper-line bg-white p-6 shadow-card sm:p-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold">Land measurement tools</h2>
              <p className="mt-1 max-w-xl text-sm text-ink-soft">
                Katha, Dismil, Decimal, Bigha — standards vary by district in Bihar. Use our converter with the local standard.
              </p>
            </div>
            <Link
              href="/converter"
              className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-white hover:opacity-90"
            >
              <Calculator className="h-4 w-4" aria-hidden /> Open Converter
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {MEASURE_UNITS.map((u) => (
              <Link
                key={u}
                href="/converter"
                className="rounded-full bg-brand-soft px-4 py-2 text-sm font-medium text-brand-dark transition-colors hover:bg-brand hover:text-white"
              >
                {u}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA band */}
      <section className="bg-brand-dark py-14 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold">Looking for a specific plot?</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-white/85">
            Tell us the location, size and budget — we will share matching options with complete details.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href={enquiryWaLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-semibold text-white hover:opacity-90"
            >
              <MessageCircle className="h-5 w-5" aria-hidden /> WhatsApp Us
            </a>
            <a
              href="tel:+919999999999"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white/40 px-6 text-sm font-semibold text-white hover:bg-white/10"
            >
              <Phone className="h-5 w-5" aria-hidden /> Call Us
            </a>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center rounded-full bg-accent px-6 text-sm font-semibold text-white hover:opacity-90"
            >
              Enquire Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
