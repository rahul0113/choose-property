import Link from "next/link";
import { SearchX } from "lucide-react";
import type { PropertyBundle } from "@/types/database";
import { FilterBar } from "@/components/filter/FilterBar";
import { PropertyCard } from "@/components/property/PropertyCard";

export function PropertyListing({
  basePath,
  title,
  subtitle,
  bundles,
  districts,
  params,
  activeCount,
}: {
  basePath: string;
  title: string;
  subtitle: string;
  bundles: PropertyBundle[];
  districts: string[];
  params: Record<string, string | string[] | undefined>;
  activeCount: number;
}) {
  return (
    <>
      <header className="mx-auto max-w-6xl px-4 pb-6 pt-8 sm:px-6">
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-soft">{subtitle}</p>
      </header>

      <FilterBar basePath={basePath} districts={districts} params={params} activeCount={activeCount} />

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {bundles.length === 0 ? (
          <div className="rounded-2xl border border-paper-line bg-white p-10 text-center shadow-card">
            <SearchX className="mx-auto h-10 w-10 text-ink-faint" aria-hidden />
            <h2 className="mt-3 text-lg font-semibold">No properties match your filters yet</h2>
            <p className="mt-1 text-sm text-ink-soft">Try widening your search or clearing the filters.</p>
            <Link
              href={basePath}
              className="mt-5 inline-flex h-11 items-center rounded-full bg-brand px-6 text-sm font-semibold text-white hover:opacity-90"
            >
              Reset filters
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-ink-faint" role="status">
              {bundles.length} propert{bundles.length === 1 ? "y" : "ies"} found
            </p>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {bundles.map((b) => (
                <PropertyCard key={b.property.id} bundle={b} />
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
