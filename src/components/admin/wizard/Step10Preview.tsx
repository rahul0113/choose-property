"use client";

import { ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function Step10Preview({
  propertyId,
}: {
  propertyId: string;
}) {
  const router = useRouter();
  const [propertyUrl, setPropertyUrl] = useState("");

  useEffect(() => {
    // In a real implementation, we could render the <PropertyListing> component directly here,
    // but doing so requires the complete bundled data structure that `src/lib/data/properties.ts` provides.
    // An alternative is an iframe, or just fetching the slug and providing a preview link.
    // For now, we fetch the slug so the admin can open the actual page.
    const fetchSlug = async () => {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase.from("properties").select("slug").eq("id", propertyId).single();
      if (data?.slug) {
        setPropertyUrl(`/property/${data.slug}`);
      }
    };
    fetchSlug();
  }, [propertyId]);

  const handleContinue = () => {
    router.push(`/admin/properties/${propertyId}/edit?step=11`);
  };

  return (
    <div className="p-6">
      <h2 className="mb-6 text-xl font-semibold text-ink">Preview Listing</h2>

      <div className="rounded-xl border border-paper-line bg-paper-soft p-8 text-center">
        <p className="mb-4 text-ink">Your property is currently saved as a draft.</p>
        
        {propertyUrl ? (
          <a
            href={propertyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-lg border border-brand bg-brand-soft px-6 py-3 font-medium text-brand-dark hover:bg-brand hover:text-white transition-colors"
          >
            Open Live Preview (New Tab)
          </a>
        ) : (
          <p className="text-ink-soft">Loading preview URL...</p>
        )}
      </div>

      <div className="flex justify-between pt-8 border-t border-paper-line">
        <Link
          href={`/admin/properties/${propertyId}/edit?step=9`}
          className="flex items-center gap-2 rounded-lg border border-paper-line bg-white px-4 py-2.5 font-medium text-ink transition-colors hover:bg-paper-soft"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <button
          onClick={handleContinue}
          className="flex items-center gap-2 rounded-lg bg-brand px-6 py-2.5 font-medium text-white transition-opacity hover:opacity-90"
        >
          Continue to Publish
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
