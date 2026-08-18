"use client";

import { useFormState } from "react-dom";
import { useState } from "react";
import { CheckCircle2, ChevronDown, MessageCircle, Send } from "lucide-react";
import { submitEnquiry, type EnquiryState } from "@/app/actions/enquiry";
import {
  BUDGET_RANGES,
  CONTACT_METHODS,
  PURCHASE_TIMELINES,
  PURPOSES,
  ROAD_WIDTH_OPTIONS,
} from "@/lib/constants";
import { enquiryWaLink } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";

const initialState: EnquiryState = { ok: false };

const inputCls =
  "h-12 w-full rounded-xl border border-paper-line bg-white px-4 text-sm outline-none ring-brand focus:ring-2";
const labelCls = "mb-1.5 block text-sm font-medium text-ink-soft";

export function EnquiryForm({ defaultProperty, compact = false }: { defaultProperty?: string; compact?: boolean }) {
  const [state, formAction] = useFormState(submitEnquiry, initialState);
  const [showOptional, setShowOptional] = useState(false);

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center" role="status">
        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" aria-hidden />
        <h3 className="mt-3 text-lg font-semibold text-ink">Thank you!</h3>
        <p className="mt-1 text-sm text-ink-soft">
          The Choose Property team will contact you shortly. For an instant reply, message us on WhatsApp.
        </p>
        <a
          href={enquiryWaLink(defaultProperty)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track({ event: "whatsapp_click", propertyCode: defaultProperty ?? null })}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 font-semibold text-white hover:opacity-90"
        >
          <MessageCircle className="h-5 w-5" aria-hidden /> WhatsApp Us
        </a>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {state.message && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {state.message}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={labelCls}>Your name *</span>
          <input name="name" required autoComplete="name" className={inputCls} placeholder="e.g. Ravi Kumar" />
        </label>
        <label className="block">
          <span className={labelCls}>Phone number *</span>
          <input name="phone" required type="tel" inputMode="tel" autoComplete="tel" className={inputCls} placeholder="10-digit mobile number" />
        </label>
      </div>

      <label className="block">
        <span className={labelCls}>Interested property *</span>
        <input
          name="property"
          required
          defaultValue={defaultProperty ?? ""}
          className={inputCls}
          placeholder="Property code or name (e.g. CP-BR-0001) — or “Not sure yet”"
        />
      </label>

      {/* Honeypot — hidden from humans (NFR-SEC-02) */}
      <input name="website" type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <button
        type="button"
        onClick={() => setShowOptional((v) => !v)}
        className="flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
        aria-expanded={showOptional}
      >
        More details (optional)
        <ChevronDown className={`h-4 w-4 transition-transform ${showOptional ? "rotate-180" : ""}`} aria-hidden />
      </button>

      {showOptional && (
        <div className="space-y-4 rounded-xl border border-paper-line bg-paper-soft p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelCls}>Preferred contact method</span>
              <select name="contact_method" className={inputCls} defaultValue="">
                <option value="">Select…</option>
                {CONTACT_METHODS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className={labelCls}>WhatsApp number (if different)</span>
              <input name="whatsapp" type="tel" inputMode="tel" className={inputCls} placeholder="10-digit mobile number" />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelCls}>Budget range</span>
              <select name="budget_range" className={inputCls} defaultValue="">
                <option value="">Select…</option>
                {BUDGET_RANGES.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className={labelCls}>Preferred location</span>
              <input name="preferred_location" className={inputCls} placeholder="e.g. Patna / Gaya" />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelCls}>Required plot size</span>
              <input name="plot_size" className={inputCls} placeholder="e.g. 1,500 sq.ft / 1 Katha" />
            </label>
            <label className="block">
              <span className={labelCls}>Purpose</span>
              <select name="purpose" className={inputCls} defaultValue="">
                <option value="">Select…</option>
                {PURPOSES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelCls}>Preferred road width</span>
              <select name="preferred_road_width" className={inputCls} defaultValue="">
                <option value="">Select…</option>
                {ROAD_WIDTH_OPTIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className={labelCls}>Purchase timeline</span>
              <select name="purchase_timeline" className={inputCls} defaultValue="">
                <option value="">Select…</option>
                {PURCHASE_TIMELINES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className={labelCls}>Message</span>
            <textarea name="message" rows={3} className={`${inputCls} h-auto py-3`} placeholder="Anything else we should know?" />
          </label>
        </div>
      )}

      <button
        type="submit"
        onClick={() => track({ event: "enquiry_submit", meta: { intent: "form_start" } })}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand px-6 text-base font-semibold text-white hover:opacity-90"
      >
        <Send className="h-4 w-4" aria-hidden />
        Submit Enquiry
      </button>

      <p className="text-center text-xs text-ink-faint">
        We only use your details to respond to this enquiry.
      </p>
    </form>
  );
}
