import { MetadataRoute } from 'next'
import { getSupabaseAdminClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://chooseproperty.in';

  // 1. Static routes
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/properties',
    '/converter',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // 2. Dynamic property routes
  const supabase = getSupabaseAdminClient();
  const { data: properties } = await supabase
    .from("properties")
    .select("slug, updated_at")
    .eq("status", "published");

  const propertyRoutes = (properties || []).map((property) => ({
    url: `${baseUrl}/properties/${property.slug}`,
    lastModified: new Date(property.updated_at),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...propertyRoutes];
}
