"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";

export const WIZARD_STEPS = [
  { id: 1, name: "Basic Info", key: "basic" },
  { id: 2, name: "Land Area", key: "area" },
  { id: 3, name: "Dimensions", key: "dimensions" },
  { id: 4, name: "Connectivity", key: "connectivity" },
  { id: 5, name: "Utilities", key: "utilities" },
  { id: 6, name: "Location", key: "location" },
  { id: 7, name: "Classification", key: "classification" },
  { id: 8, name: "Documents", key: "documents" },
  { id: 9, name: "Media", key: "media" },
  { id: 10, name: "Preview", key: "preview" },
  { id: 11, name: "Publish", key: "publish" },
];

export function WizardLayout({
  children,
  propertyId,
  currentStep,
}: {
  children: React.ReactNode;
  propertyId: string;
  currentStep: number;
}) {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink">
          {propertyId === "new" ? "Add Property" : `Edit Property`}
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          Complete the steps below to {propertyId === "new" ? "create" : "update"} this listing.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <nav className="sticky top-6 rounded-xl border border-paper-line bg-white p-4 shadow-sm">
            <ul className="space-y-1">
              {WIZARD_STEPS.map((step) => {
                const isActive = currentStep === step.id;
                const isPast = currentStep > step.id;

                return (
                  <li key={step.id}>
                    <Link
                      href={
                        propertyId === "new"
                          ? "#"
                          : `/admin/properties/${propertyId}/edit?step=${step.id}`
                      }
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-brand-soft text-brand-dark"
                          : isPast
                          ? "text-ink hover:bg-paper-soft"
                          : "text-ink-soft hover:bg-paper-soft"
                      }`}
                      // Disable clicking ahead if new
                      onClick={(e) => propertyId === "new" && e.preventDefault()}
                    >
                      {isPast ? (
                        <CheckCircle2 className="h-5 w-5 text-brand" />
                      ) : isActive ? (
                        <Circle className="h-5 w-5 fill-brand/20 text-brand" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                      {step.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="rounded-xl border border-paper-line bg-white shadow-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
