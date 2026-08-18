"use client";

import { useFormState } from "react-dom";
import { saveStep2 } from "@/app/actions/wizard";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const actionWrapper = async (prevState: any, formData: FormData) => {
  return await saveStep2(prevState, formData);
};

export function Step2LandArea({
  initialData,
  propertyId,
  standards,
}: {
  initialData: any;
  propertyId: string;
  standards: any[];
}) {
  const [state, formAction] = useFormState(actionWrapper, null);
  const [sqft, setSqft] = useState<number>(initialData?.area_sqft || 0);
  const defaultStandard = standards.find((s) => s.is_default) || standards[0];
  const [standardId, setStandardId] = useState<string>(
    initialData?.measurement_standard_id || defaultStandard?.id || ""
  );

  const selectedStandard = standards.find((s) => s.id === standardId);

  return (
    <div className="p-6">
      <h2 className="mb-6 text-xl font-semibold text-ink">Land Area</h2>

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="propertyId" value={propertyId} />

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="area_sqft" className="mb-1 block text-sm font-medium text-ink">
              Base Area (in Square Feet) <span className="text-red-500">*</span>
            </label>
            <input
              id="area_sqft"
              name="area_sqft"
              type="number"
              step="0.01"
              required
              value={sqft || ""}
              onChange={(e) => setSqft(parseFloat(e.target.value))}
              placeholder="e.g. 1500"
              className="w-full rounded-lg border border-paper-line bg-paper-soft px-4 py-2 text-ink outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
            />
            <p className="mt-1 text-xs text-ink-soft">
              This is the authoritative measurement. All other units (Katha, Decimal) are derived from this.
            </p>
          </div>

          <div>
            <label htmlFor="measurement_standard_id" className="mb-1 block text-sm font-medium text-ink">
              Measurement Standard <span className="text-red-500">*</span>
            </label>
            <select
              id="measurement_standard_id"
              name="measurement_standard_id"
              required
              value={standardId}
              onChange={(e) => setStandardId(e.target.value)}
              className="w-full rounded-lg border border-paper-line bg-paper-soft px-4 py-2 text-ink outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
            >
              {standards.map((std) => (
                <option key={std.id} value={std.id}>
                  {std.name} (1 Katha = {std.katha_sqft} sq.ft)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Conversion Preview */}
        {sqft > 0 && selectedStandard && (
          <div className="rounded-xl border border-paper-line bg-brand-soft/30 p-4">
            <h3 className="mb-3 text-sm font-semibold text-ink">Calculated Area:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
              <div>
                <p className="text-ink-soft">Katha</p>
                <p className="font-semibold text-brand-dark">
                  {(sqft / selectedStandard.katha_sqft).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-ink-soft">Decimal</p>
                <p className="font-semibold text-brand-dark">
                  {(sqft / selectedStandard.decimal_sqft).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-ink-soft">Sq. Yards</p>
                <p className="font-semibold text-brand-dark">
                  {(sqft / 9).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-ink-soft">Acre</p>
                <p className="font-semibold text-brand-dark">
                  {(sqft / 43560).toFixed(3)}
                </p>
              </div>
            </div>
          </div>
        )}

        {state?.error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {state.error}
          </div>
        )}

        <div className="flex justify-between pt-4 border-t border-paper-line">
          <Link
            href={`/admin/properties/${propertyId}/edit?step=1`}
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
