import type { Metadata } from "next";
import { Ruler, Satellite, ShieldCheck, FileCheck2 } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Choose Property sells land and plots in Bihar with complete, honest details — exact dimensions, road access, utilities, classification and documents.",
};

const VALUES = [
  { icon: Ruler, title: "Details before the visit", text: "Every listing answers the questions buyers actually ask: exact size, dimensions, road width, utilities and what the land looks like from above." },
  { icon: Satellite, title: "See it before you travel", text: "Ground photos and drone views so you don't drive hours to see a plot that isn't right for you." },
  { icon: ShieldCheck, title: "No overclaiming", text: "Land classification and document status are shown with verification levels — we never assert transferability we can't prove." },
  { icon: FileCheck2, title: "Measurement clarity", text: "Areas are shown in sq.ft plus local units (Katha, Dismil, Decimal, Bigha) with the district standard used." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold sm:text-3xl">About Choose Property</h1>
      <p className="mt-4 leading-relaxed text-ink-soft">
        Buying land in Bihar is often a frustrating hunt — WhatsApp photos with no measurements, listings that hide the road width, and calls that never get answered with the facts you asked for.
      </p>
      <p className="mt-4 leading-relaxed text-ink-soft">
        <strong className="text-ink">Choose Property</strong> is a managed catalogue of land and plots across Bihar. Every property page is built to answer the important questions before you visit: where exactly is it, how big is it, what are its dimensions, how wide is the road, is electricity and water available, what is nearby, what does it look like from the ground and from the air, what is the land classification, and what documents exist.
      </p>
      <p className="mt-4 leading-relaxed text-ink-soft">
        We work directly with the client who owns the land — no marketplace, no middlemen, no fake listings. When you enquire, you hear back from the people who actually know the property.
      </p>

      <h2 className="mt-10 text-xl font-bold">What we stand for</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {VALUES.map((v) => (
          <div key={v.title} className="rounded-xl border border-paper-line bg-white p-5 shadow-card">
            <v.icon className="h-6 w-6 text-brand" aria-hidden />
            <h3 className="mt-3 font-semibold">{v.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{v.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
