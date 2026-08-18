import type { Metadata } from "next";
import { PropertyListing } from "@/components/property/PropertyListing";
import {
  countActiveFilters,
  getDistricts,
  getPublishedProperties,
  parseListingFilters,
} from "@/lib/data/properties";

export const metadata: Metadata = {
  title: "Commercial Plots & Land in Bihar",
  description:
    "Commercial plots and land with road frontage and visibility across Bihar — showroom, warehouse or investment. Complete details on every listing.",
};

export const dynamic = "force-dynamic";

export default async function CommercialPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const filters = { ...parseListingFilters(searchParams), type: "commercial" as const };
  const [bundles, districts] = await Promise.all([getPublishedProperties(filters), getDistricts()]);

  return (
    <PropertyListing
      basePath="/properties/commercial"
      title="Commercial Plots"
      subtitle="High-visibility commercial land with road frontage and connectivity details."
      bundles={bundles}
      districts={districts}
      params={searchParams}
      activeCount={countActiveFilters(filters)}
    />
  );
}
