import type { Metadata } from "next";
import { PropertyListing } from "@/components/property/PropertyListing";
import {
  countActiveFilters,
  getDistricts,
  getPublishedProperties,
  parseListingFilters,
} from "@/lib/data/properties";

export const metadata: Metadata = {
  title: "Residential Plots in Bihar",
  description:
    "Residential plots for sale in Patna, Gaya, Muzaffarpur, Darbhanga and more — with exact dimensions, road width, utilities and document status.",
};

export const dynamic = "force-dynamic";

export default async function ResidentialPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const filters = { ...parseListingFilters(searchParams), type: "residential" as const };
  const [bundles, districts] = await Promise.all([getPublishedProperties(filters), getDistricts()]);

  return (
    <PropertyListing
      basePath="/properties/residential"
      title="Residential Plots"
      subtitle="Plots for your home — every detail from dimensions to documentation, before you visit."
      bundles={bundles}
      districts={districts}
      params={searchParams}
      activeCount={countActiveFilters(filters)}
    />
  );
}
