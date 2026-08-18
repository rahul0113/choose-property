import type { Metadata } from "next";
import { MeasurementConverter } from "@/components/converter/MeasurementConverter";

export const metadata: Metadata = {
  title: "Land Measurement Converter — Katha, Dismil, Decimal, Bigha",
  description:
    "Convert land measurements with the Bihar standard: sq.ft, sq.m, Decimal, Dismil, Katha, Bigha, Acre and Hectare. District-aware standards.",
};

export default function ConverterPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">Land Measurement Converter</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Katha, Dismil and Decimal mean different things in different districts. Convert using the standard for your area.
        </p>
      </header>
      <div className="mt-8">
        <MeasurementConverter />
      </div>
    </div>
  );
}
