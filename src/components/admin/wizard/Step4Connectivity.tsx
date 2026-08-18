"use client";

import { useState } from "react";
import { saveStep4 } from "@/app/actions/wizard";
import { ArrowRight, ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const PLACE_TYPES = [
  "main_road",
  "highway",
  "market",
  "railway_station",
  "airport",
  "school",
  "college",
  "hospital",
  "bank",
  "petrol_pump",
  "bus_stand",
  "landmark",
  "custom",
];

export function Step4Connectivity({
  initialData,
  propertyId,
}: {
  initialData: any[];
  propertyId: string;
}) {
  const router = useRouter();
  const [places, setPlaces] = useState<any[]>(
    initialData?.length > 0
      ? initialData
      : [{ id: Date.now(), place_type: "main_road", name: "", distance_km: "", distance_text: "" }]
  );
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = () => {
    setPlaces([
      ...places,
      { id: Date.now(), place_type: "market", name: "", distance_km: "", distance_text: "" },
    ]);
  };

  const handleRemove = (index: number) => {
    setPlaces(places.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: string, value: string) => {
    const newPlaces = [...places];
    newPlaces[index][field] = value;
    setPlaces(newPlaces);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setError("");

    const res = await saveStep4(propertyId, places);
    if (res.error) {
      setError(res.error);
      setIsPending(false);
    } else {
      router.push(`/admin/properties/${propertyId}/edit?step=5`);
    }
  };

  return (
    <div className="p-6">
      <h2 className="mb-6 text-xl font-semibold text-ink">Nearby Places & Connectivity</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {places.map((place, index) => (
            <div
              key={place.id || index}
              className="flex flex-col gap-4 rounded-xl border border-paper-line bg-paper-soft p-4 sm:flex-row sm:items-end"
            >
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium text-ink-soft">Type</label>
                <select
                  value={place.place_type}
                  onChange={(e) => handleChange(index, "place_type", e.target.value)}
                  className="w-full rounded-lg border border-paper-line bg-white px-3 py-2 text-sm text-ink outline-none"
                >
                  {PLACE_TYPES.map((pt) => (
                    <option key={pt} value={pt}>
                      {pt.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium text-ink-soft">Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. AIIMS"
                  value={place.name || ""}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                  className="w-full rounded-lg border border-paper-line bg-white px-3 py-2 text-sm text-ink outline-none"
                />
              </div>
              <div className="w-full sm:w-24">
                <label className="mb-1 block text-xs font-medium text-ink-soft">Dist (km)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 1.5"
                  value={place.distance_km || ""}
                  onChange={(e) => handleChange(index, "distance_km", e.target.value)}
                  className="w-full rounded-lg border border-paper-line bg-white px-3 py-2 text-sm text-ink outline-none"
                />
              </div>
              <div className="w-full sm:w-32">
                <label className="mb-1 block text-xs font-medium text-ink-soft">Display text</label>
                <input
                  type="text"
                  placeholder="e.g. 5 min walk"
                  value={place.distance_text || ""}
                  onChange={(e) => handleChange(index, "distance_text", e.target.value)}
                  className="w-full rounded-lg border border-paper-line bg-white px-3 py-2 text-sm text-ink outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-lg border border-paper-line bg-white px-4 py-2 text-sm font-medium text-ink hover:bg-paper-soft"
        >
          <Plus className="h-4 w-4" />
          Add Place
        </button>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex justify-between pt-4 border-t border-paper-line">
          <Link
            href={`/admin/properties/${propertyId}/edit?step=3`}
            className="flex items-center gap-2 rounded-lg border border-paper-line bg-white px-4 py-2.5 font-medium text-ink transition-colors hover:bg-paper-soft"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 rounded-lg bg-brand px-6 py-2.5 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save & Continue"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
