"use client";

import { useFormState } from "react-dom";
import { saveStep5 } from "@/app/actions/wizard";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

const actionWrapper = async (prevState: any, formData: FormData) => {
  return await saveStep5(prevState, formData);
};

const UTILITIES = [
  { key: "electricity", label: "Electricity" },
  { key: "water", label: "Water" },
  { key: "drainage", label: "Drainage / Sewerage" },
  { key: "internet", label: "Internet" },
  { key: "street_lighting", label: "Street Lighting" },
];

export function Step5Utilities({
  initialData,
  propertyId,
}: {
  initialData: any;
  propertyId: string;
}) {
  const [state, formAction] = useFormState(actionWrapper, null);

  return (
    <div className="p-6">
      <h2 className="mb-6 text-xl font-semibold text-ink">Utilities</h2>

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="propertyId" value={propertyId} />

        <div className="grid gap-6 md:grid-cols-2">
          {UTILITIES.map((utility) => (
            <div key={utility.key}>
              <label htmlFor={utility.key} className="mb-1 block text-sm font-medium text-ink">
                {utility.label} <span className="text-red-500">*</span>
              </label>
              <select
                id={utility.key}
                name={utility.key}
                required
                defaultValue={initialData?.[utility.key] || "unknown"}
                className="w-full rounded-lg border border-paper-line bg-paper-soft px-4 py-2 text-ink outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
              >
                <option value="available">Available</option>
                <option value="nearby">Nearby</option>
                <option value="not_available">Not Available</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
          ))}
        </div>

        {state?.error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {state.error}
          </div>
        )}

        <div className="flex justify-between pt-4 border-t border-paper-line">
          <Link
            href={`/admin/properties/${propertyId}/edit?step=4`}
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
