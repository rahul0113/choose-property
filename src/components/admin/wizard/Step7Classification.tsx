"use client";

import { useFormState } from "react-dom";
import { saveStep7 } from "@/app/actions/wizard";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

const actionWrapper = async (prevState: any, formData: FormData) => {
  return await saveStep7(prevState, formData);
};

export function Step7Classification({
  initialData,
  propertyId,
}: {
  initialData: any;
  propertyId: string;
}) {
  const [state, formAction] = useFormState(actionWrapper, null);

  return (
    <div className="p-6">
      <h2 className="mb-6 text-xl font-semibold text-ink">Land Classification</h2>

      <div className="mb-6 rounded-lg bg-yellow-50 p-4 border border-yellow-200">
        <p className="text-sm text-yellow-800">
          <strong>Important:</strong> Classification determines the legal transferability of the land. Choose carefully. The public site will display an explicit disclaimer that the buyer must independently verify this information.
        </p>
      </div>

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="propertyId" value={propertyId} />

        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="classification" className="mb-1 block text-sm font-medium text-ink">
              Classification <span className="text-red-500">*</span>
            </label>
            <select
              id="classification"
              name="classification"
              required
              defaultValue={initialData?.classification || "unknown"}
              className="w-full rounded-lg border border-paper-line bg-paper-soft px-4 py-2 text-ink outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
            >
              <option value="private_raiyati">Private / Raiyati (Freehold)</option>
              <option value="gair_majarua">Gair Majarua (General)</option>
              <option value="gair_majarua_aam">Gair Majarua Aam (Public)</option>
              <option value="gair_majarua_malik">Gair Majarua Malik (Government / Landlord)</option>
              <option value="other">Other</option>
              <option value="unknown">Unknown / Needs Verification</option>
            </select>
          </div>

          <div>
            <label htmlFor="verification_status" className="mb-1 block text-sm font-medium text-ink">
              Verification Status <span className="text-red-500">*</span>
            </label>
            <select
              id="verification_status"
              name="verification_status"
              required
              defaultValue={initialData?.verification_status || "pending"}
              className="w-full rounded-lg border border-paper-line bg-paper-soft px-4 py-2 text-ink outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
            >
              <option value="pending">Pending</option>
              <option value="client_provided">Client Provided</option>
              <option value="document_backed">Document Backed</option>
              <option value="admin_verified">Admin Verified</option>
              <option value="officially_verified">Officially Verified (Circle Office)</option>
            </select>
          </div>

          <div>
            <label htmlFor="verification_source" className="mb-1 block text-sm font-medium text-ink">
              Verification Source / Notes
            </label>
            <input
              id="verification_source"
              name="verification_source"
              type="text"
              defaultValue={initialData?.verification_source || ""}
              placeholder="e.g. Verified via Jamabandi Register 2"
              className="w-full rounded-lg border border-paper-line bg-paper-soft px-4 py-2 text-ink outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="admin_notes" className="mb-1 block text-sm font-medium text-ink">
              Admin Notes (Internal Only)
            </label>
            <textarea
              id="admin_notes"
              name="admin_notes"
              rows={3}
              defaultValue={initialData?.admin_notes || ""}
              className="w-full rounded-lg border border-paper-line bg-paper-soft px-4 py-2 text-ink outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
            />
            <p className="mt-1 text-xs text-ink-soft">
              These notes are never shown on the public website.
            </p>
          </div>
        </div>

        {state?.error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {state.error}
          </div>
        )}

        <div className="flex justify-between pt-4 border-t border-paper-line">
          <Link
            href={`/admin/properties/${propertyId}/edit?step=6`}
            className="flex items-center gap-2 rounded-lg border border-paper-line bg-white px-4 py-2.5 font-medium text-ink transition-colors hover:bg-paper-soft"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-brand px-6 py-2.5 font-medium text-white transition-opacity hover:opacity-90"
          >
            Save & Continue
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
