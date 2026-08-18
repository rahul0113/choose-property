import type { Metadata } from "next";
import { PropertyListing } from "@/components/property/PropertyListing";
import {
  countActiveFilters,
  getDistricts,
  getPublishedProperties,
  parseListingFilters,
} from "@/lib/data/properties";

export const metadata: Metadata = {
  title: "Other Land in Bihar — Agricultural & More",
  description:
    "Agricultural land and other land parcels across Bihar with complete details: area in local units, classification, verification status and documents.",
};

export const dynamic = "force-dynamic";

export default async function OtherLandPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const rawType = Array.isArray(searchParams.type) ? searchParams.type[0] : searchParams.type;
  const filters = {
    ...parseListingFilters(searchParams),
    type: (rawType === "agricultural" || rawType === "other" ? rawType : "other") as "agricultural" | "other",
  };
  const [bundles, districts] = await Promise.all([getPublishedProperties(filters), getDistricts()]);

  return (
    <PropertyListing
      basePath="/properties/other"
      title="Other Land"
      subtitle="Agricultural land and other parcels — shown with classification, verification status and honest disclaimers."
      bundles={bundles}
      districts={districts}
      params={searchParams}
      activeCount={countActiveFilters(filters)}
    />
  );
}
