"use client";

import { useFormState } from "react-dom";
import { saveStep3 } from "@/app/actions/wizard";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

const actionWrapper = async (prevState: any, formData: FormData) => {
  return await saveStep3(prevState, formData);
};

export function Step3Dimensions({
  initialData,
  propertyId,
}: {
  initialData: any;
  propertyId: string;
}) {
  const [state, formAction] = useFormState(actionWrapper, null);

  return (
    <div className="p-6">
      <h2 className="mb-6 text-xl font-semibold text-ink">Plot Dimensions & Road</h2>

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="propertyId" value={propertyId} />

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="road_frontage_ft" className="mb-1 block text-sm font-medium text-ink">
              Road Frontage (Feet)
            </label>
            <input
              id="road_frontage_ft"
              name="road_frontage_ft"
              type="number"
              step="0.1"
              defaultValue={initialData?.road_frontage_ft || ""}
              placeholder="e.g. 30"
              className="w-full rounded-lg border border-paper-line bg-paper-soft px-4 py-2 text-ink outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </div>

          <div>
            <label htmlFor="road_width_ft" className="mb-1 block text-sm font-medium text-ink">
              Road Width (Feet)
            </label>
            <input
              id="road_width_ft"
              name="road_width_ft"
              type="number"
              step="0.1"
              defaultValue={initialData?.road_width_ft || ""}
              placeholder="e.g. 20"
              className="w-full rounded-lg border border-paper-line bg-paper-soft px-4 py-2 text-ink outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </div>

          <div className="md:col-span-2">
            <h3 className="mb-3 mt-4 text-sm font-semibold text-ink">Boundaries (Feet)</h3>
          </div>

          <div>
            <label htmlFor="north_ft" className="mb-1 block text-sm font-medium text-ink">
              North
            </label>
            <input
              id="north_ft"
              name="north_ft"
              type="number"
              step="0.1"
              defaultValue={initialData?.north_ft || ""}
              className="w-full rounded-lg border border-paper-line bg-paper-soft px-4 py-2 text-ink outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </div>

          <div>
            <label htmlFor="south_ft" className="mb-1 block text-sm font-medium text-ink">
              South
            </label>
            <input
              id="south_ft"
              name="south_ft"
              type="number"
              step="0.1"
              defaultValue={initialData?.south_ft || ""}
              className="w-full rounded-lg border border-paper-line bg-paper-soft px-4 py-2 text-ink outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </div>

          <div>
            <label htmlFor="east_ft" className="mb-1 block text-sm font-medium text-ink">
              East
            </label>
            <input
              id="east_ft"
              name="east_ft"
              type="number"
              step="0.1"
              defaultValue={initialData?.east_ft || ""}
              className="w-full rounded-lg border border-paper-line bg-paper-soft px-4 py-2 text-ink outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </div>

          <div>
            <label htmlFor="west_ft" className="mb-1 block text-sm font-medium text-ink">
              West
            </label>
            <input
              id="west_ft"
              name="west_ft"
              type="number"
              step="0.1"
              defaultValue={initialData?.west_ft || ""}
              className="w-full rounded-lg border border-paper-line bg-paper-soft px-4 py-2 text-ink outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </div>
        </div>

        {state?.error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {state.error}
          </div>
        )}

        <div className="flex justify-between pt-4 border-t border-paper-line">
          <Link
            href={`/admin/properties/${propertyId}/edit?step=2`}
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
