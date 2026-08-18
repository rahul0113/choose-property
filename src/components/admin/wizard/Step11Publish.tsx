"use client";

import { useState } from "react";
import { publishProperty } from "@/app/actions/wizard";
import { CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Step11Publish({
  propertyId,
  isPublished,
}: {
  propertyId: string;
  isPublished: boolean;
}) {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState("");

  const handlePublish = async () => {
    setIsPublishing(true);
    setError("");
    const res = await publishProperty(propertyId);
    if (res?.error) {
      setError(res.error);
      setIsPublishing(false);
    }
    // Note: if successful, action redirects to /admin/properties
  };

  return (
    <div className="p-6">
      <h2 className="mb-6 text-xl font-semibold text-ink">Publish Property</h2>

      <div className="rounded-xl border border-paper-line bg-paper-soft p-8 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-brand" />
        <h3 className="mb-2 text-xl font-bold text-ink">You're all set!</h3>
        <p className="text-ink-soft mb-8">
          All steps have been completed. You can either keep this property as a draft or publish it live now.
        </p>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/admin/properties"
            className="flex items-center gap-2 rounded-lg border border-paper-line bg-white px-6 py-3 font-medium text-ink transition-colors hover:bg-paper-soft"
          >
            Save as Draft & Exit
          </Link>
          
          <button
            onClick={handlePublish}
            disabled={isPublishing || isPublished}
            className="flex items-center justify-center gap-2 rounded-lg bg-brand px-6 py-3 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 min-w-[200px]"
          >
            {isPublishing ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isPublished ? (
              "Already Published"
            ) : (
              "Publish Live Now"
            )}
          </button>
        </div>
      </div>

      <div className="flex pt-8 border-t border-paper-line">
        <Link
          href={`/admin/properties/${propertyId}/edit?step=10`}
          className="flex items-center gap-2 rounded-lg border border-paper-line bg-white px-4 py-2.5 font-medium text-ink transition-colors hover:bg-paper-soft"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Preview
        </Link>
      </div>
    </div>
  );
}
