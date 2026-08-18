import type { MetadataRoute } from "next";
import { getPublishedProperties } from "@/lib/data/properties";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const bundles = await getPublishedProperties();
  const propertyEntries: MetadataRoute.Sitemap = bundles.map((b) => ({
    url: `${siteUrl}/property/${b.property.slug}`,
    lastModified: b.property.updated_at ? new Date(b.property.updated_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const staticEntries: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/properties`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/properties/residential`, changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/properties/commercial`, changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/properties/other`, changeFrequency: "daily", priority: 0.7 },
    { url: `${siteUrl}/converter`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteUrl}/contact`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/faq`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteUrl}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];

  return [...staticEntries, ...propertyEntries];
}
