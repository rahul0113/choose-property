"use client";

import { useFormState } from "react-dom";
import { saveStep6 } from "@/app/actions/wizard";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

const actionWrapper = async (prevState: any, formData: FormData) => {
  return await saveStep6(prevState, formData);
};

export function Step6Location({
  initialData,
  propertyId,
}: {
  initialData: any;
  propertyId: string;
}) {
  const [state, formAction] = useFormState(actionWrapper, null);

  return (
    <div className="p-6">
      <h2 className="mb-6 text-xl font-semibold text-ink">Location</h2>

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="propertyId" value={propertyId} />

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="village" className="mb-1 block text-sm font-medium text-ink">
              Village / Locality
            </label>
            <input
              id="village"
              name="village"
              type="text"
              defaultValue={initialData?.village || ""}
              className="w-full rounded-lg border border-paper-line bg-paper-soft px-4 py-2 text-ink outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </div>

          <div>
            <label htmlFor="panchayat" className="mb-1 block text-sm font-medium text-ink">
              Panchayat
            </label>
            <input
              id="panchayat"
              name="panchayat"
              type="text"
              defaultValue={initialData?.panchayat || ""}
              className="w-full rounded-lg border border-paper-line bg-paper-soft px-4 py-2 text-ink outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </div>

          <div>
            <label htmlFor="block" className="mb-1 block text-sm font-medium text-ink">
              Block
            </label>
            <input
              id="block"
              name="block"
              type="text"
              defaultValue={initialData?.block || ""}
              className="w-full rounded-lg border border-paper-line bg-paper-soft px-4 py-2 text-ink outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </div>

          <div>
            <label htmlFor="district" className="mb-1 block text-sm font-medium text-ink">
              District
            </label>
            <input
              id="district"
              name="district"
              type="text"
              defaultValue={initialData?.district || ""}
              className="w-full rounded-lg border border-paper-line bg-paper-soft px-4 py-2 text-ink outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </div>

          <div>
            <label htmlFor="pincode" className="mb-1 block text-sm font-medium text-ink">
              PIN Code
            </label>
            <input
              id="pincode"
              name="pincode"
              type="text"
              defaultValue={initialData?.pincode || ""}
              className="w-full rounded-lg border border-paper-line bg-paper-soft px-4 py-2 text-ink outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </div>

          <div>
            <label htmlFor="state" className="mb-1 block text-sm font-medium text-ink">
              State
            </label>
            <input
              id="state"
              name="state"
              type="text"
              defaultValue={initialData?.state || "Bihar"}
              className="w-full rounded-lg border border-paper-line bg-paper-soft px-4 py-2 text-ink outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="full_address" className="mb-1 block text-sm font-medium text-ink">
              Full Address
            </label>
            <textarea
              id="full_address"
              name="full_address"
              rows={2}
              defaultValue={initialData?.full_address || ""}
              className="w-full rounded-lg border border-paper-line bg-paper-soft px-4 py-2 text-ink outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </div>

          <div>
            <label htmlFor="nearby_landmark" className="mb-1 block text-sm font-medium text-ink">
              Nearby Landmark
            </label>
            <input
              id="nearby_landmark"
              name="nearby_landmark"
              type="text"
              defaultValue={initialData?.nearby_landmark || ""}
              className="w-full rounded-lg border border-paper-line bg-paper-soft px-4 py-2 text-ink outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </div>

          <div>
            <label htmlFor="google_maps_url" className="mb-1 block text-sm font-medium text-ink">
              Google Maps URL
            </label>
            <input
              id="google_maps_url"
              name="google_maps_url"
              type="url"
              defaultValue={initialData?.google_maps_url || ""}
              placeholder="https://maps.google.com/..."
              className="w-full rounded-lg border border-paper-line bg-paper-soft px-4 py-2 text-ink outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </div>

          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="latitude" className="mb-1 block text-sm font-medium text-ink">
                Latitude
              </label>
              <input
                id="latitude"
                name="latitude"
                type="number"
                step="0.0000001"
                defaultValue={initialData?.latitude || ""}
                className="w-full rounded-lg border border-paper-line bg-paper-soft px-4 py-2 text-ink outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
              />
            </div>
            <div>
              <label htmlFor="longitude" className="mb-1 block text-sm font-medium text-ink">
                Longitude
              </label>
              <input
                id="longitude"
                name="longitude"
                type="number"
                step="0.0000001"
                defaultValue={initialData?.longitude || ""}
                className="w-full rounded-lg border border-paper-line bg-paper-soft px-4 py-2 text-ink outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="location_precision" className="mb-1 block text-sm font-medium text-ink">
              Location Precision <span className="text-red-500">*</span>
            </label>
            <select
              id="location_precision"
              name="location_precision"
              required
              defaultValue={initialData?.location_precision || "exact"}
              className="w-full rounded-lg border border-paper-line bg-paper-soft px-4 py-2 text-ink outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
            >
              <option value="exact">Exact (Show pinpoint on map)</option>
              <option value="approximate">Approximate (Show general area)</option>
              <option value="hidden">Hidden (Do not show map)</option>
            </select>
          </div>
        </div>

        {state?.error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {state.error}
          </div>
        )}

        <div className="flex justify-between pt-4 border-t border-paper-line">
          <Link
            href={`/admin/properties/${propertyId}/edit?step=5`}
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
