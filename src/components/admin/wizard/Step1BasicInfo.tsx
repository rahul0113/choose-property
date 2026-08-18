"use client";

import { useFormState } from "react-dom";
import { saveStep1 } from "@/app/actions/wizard";
import { ArrowRight } from "lucide-react";
import { PRESET_AMENITIES } from "@/lib/constants";

const actionWrapper = async (prevState: any, formData: FormData) => {
  return await saveStep1(prevState, formData);
};

export function Step1BasicInfo({
  initialData,
  propertyId,
}: {
  initialData: any;
  propertyId: string;
}) {
  const [state, formAction] = useFormState(actionWrapper, null);

  return (
    <div className="p-6">
      <h2 className="mb-6 text-xl font-semibold text-ink">Basic Information</h2>

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="propertyId" value={propertyId} />

        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="title" className="mb-1 block text-sm font-medium text-ink">
              Property Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={initialData?.title || ""}
              placeholder="e.g. 1500 sq.ft Residential Plot in Bihta"
              className="w-full rounded-lg border border-paper-line bg-paper-soft px-4 py-2 text-ink outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </div>

          <div>
            <label htmlFor="property_type" className="mb-1 block text-sm font-medium text-ink">
              Property Type <span className="text-red-500">*</span>
            </label>
            <select
              id="property_type"
              name="property_type"
              required
              defaultValue={initialData?.property_type || "residential"}
              className="w-full rounded-lg border border-paper-line bg-paper-soft px-4 py-2 text-ink outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
            >
              <option value="residential">Residential Plot</option>
              <option value="commercial">Commercial Plot</option>
              <option value="agricultural">Agricultural Land</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="availability" className="mb-1 block text-sm font-medium text-ink">
              Availability <span className="text-red-500">*</span>
            </label>
            <select
              id="availability"
              name="availability"
              required
              defaultValue={initialData?.availability || "available"}
              className="w-full rounded-lg border border-paper-line bg-paper-soft px-4 py-2 text-ink outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
            >
              <option value="available">Available</option>
              <option value="under_contract">Under Contract</option>
              <option value="sold">Sold</option>
            </select>
          </div>

          <div>
            <label htmlFor="price_display" className="mb-1 block text-sm font-medium text-ink">
              Public Price Display <span className="text-red-500">*</span>
            </label>
            <input
              id="price_display"
              name="price_display"
              type="text"
              required
              defaultValue={initialData?.price_display || "Contact for Price"}
              className="w-full rounded-lg border border-paper-line bg-paper-soft px-4 py-2 text-ink outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
            />
            <p className="mt-1 text-xs text-ink-soft">
              Exact price is never exposed publicly. This is what buyers will see.
            </p>
          </div>

          <div>
            <label htmlFor="facing" className="mb-1 block text-sm font-medium text-ink">
              Facing (Optional)
            </label>
            <input
              id="facing"
              name="facing"
              type="text"
              defaultValue={initialData?.facing || ""}
              placeholder="e.g. East, North-East, Corner"
              className="w-full rounded-lg border border-paper-line bg-paper-soft px-4 py-2 text-ink outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="mb-1 block text-sm font-medium text-ink">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={initialData?.description || ""}
              className="w-full rounded-lg border border-paper-line bg-paper-soft px-4 py-2 text-ink outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </div>

          {/* Open Sites */}
          <div>
            <label htmlFor="open_sites" className="mb-1 block text-sm font-medium text-ink">
              Open Sites Around Property
            </label>
            <select
              id="open_sites"
              name="open_sites"
              defaultValue={initialData?.open_sites ?? ""}
              className="w-full rounded-lg border border-paper-line bg-paper-soft px-4 py-2 text-ink outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
            >
              <option value="">Not specified</option>
              <option value="1">1 open site</option>
              <option value="2">2 open sites</option>
              <option value="3">3 open sites</option>
              <option value="4">4 open sites</option>
              <option value="5">5+ open sites</option>
            </select>
            <p className="mt-1 text-xs text-ink-soft">Number of open sites or sides around the property.</p>
          </div>


          {/* Amenities */}
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-ink">
              Amenities
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_AMENITIES.map((amenity) => {
                const isActive = Array.isArray(initialData?.amenities)
                  ? initialData.amenities.includes(amenity)
                  : false;
                return (
                  <label
                    key={amenity}
                    className="flex cursor-pointer items-center gap-2 rounded-full border border-paper-line bg-paper-soft px-3 py-1.5 text-sm transition-colors hover:bg-paper-line has-[:checked]:border-brand has-[:checked]:bg-brand-soft has-[:checked]:text-brand-dark"
                  >
                    <input
                      type="checkbox"
                      name="amenities"
                      value={amenity}
                      defaultChecked={isActive}
                      className="hidden"
                    />
                    {amenity}
                  </label>
                );
              })}
            </div>
            <p className="mt-1 text-xs text-ink-soft">Select nearby amenities to display on the property page.</p>
          </div>
        </div>

        {state?.error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {state.error}
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-paper-line">
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
