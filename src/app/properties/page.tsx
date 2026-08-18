import type { Metadata } from "next";
import { PropertyListing } from "@/components/property/PropertyListing";
import {
  countActiveFilters,
  getDistricts,
  getPublishedProperties,
  parseListingFilters,
} from "@/lib/data/properties";

export const metadata: Metadata = {
  title: "All Properties — Land & Plots in Bihar",
  description:
    "Browse residential plots, commercial plots and agricultural land across Bihar with complete details: dimensions, road access, utilities, classification and documents.",
};

export const dynamic = "force-dynamic";

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const filters = parseListingFilters(searchParams);
  const [bundles, districts] = await Promise.all([getPublishedProperties(filters), getDistricts()]);

  return (
    <PropertyListing
      basePath="/properties"
      title="All Properties"
      subtitle="Every listing shows exact size, dimensions, road access, utilities and document status — so you can shortlist before you call."
      bundles={bundles}
      districts={districts}
      params={searchParams}
      activeCount={countActiveFilters(filters)}
    />
  );
}
