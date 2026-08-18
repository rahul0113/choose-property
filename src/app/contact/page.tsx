import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { EnquiryForm } from "@/components/enquiry/EnquiryForm";
import { genericWaLink, PHONE_NUMBER } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Looking for a specific plot in Bihar? WhatsApp, call or send an enquiry — the Choose Property team responds quickly.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="text-2xl font-bold sm:text-3xl">Contact Us</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Looking for a specific plot? Tell us the location, size and budget — we will share matching options.
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-paper-line bg-white p-5 shadow-card sm:p-7">
          <h2 className="text-lg font-bold">Send an enquiry</h2>
          <p className="mt-1 text-sm text-ink-soft">We usually respond within a few hours.</p>
          <div className="mt-5">
            <EnquiryForm />
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-paper-line bg-white p-5 shadow-card">
            <h2 className="font-bold">Talk to us directly</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href={genericWaLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl bg-[#25D366]/10 p-3 font-medium text-ink hover:bg-[#25D366]/20">
                  <MessageCircle className="h-5 w-5 shrink-0 text-[#25D366]" aria-hidden /> WhatsApp Us
                </a>
              </li>
              <li>
                <a href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`} className="flex items-center gap-3 rounded-xl bg-brand-soft p-3 font-medium text-ink hover:bg-brand/20">
                  <Phone className="h-5 w-5 shrink-0 text-brand" aria-hidden /> {PHONE_NUMBER}
                </a>
              </li>
              <li>
                <a href="mailto:hello@chooseproperty.in" className="flex items-center gap-3 rounded-xl bg-paper-soft p-3 font-medium text-ink hover:bg-paper-line">
                  <Mail className="h-5 w-5 shrink-0 text-brand" aria-hidden /> hello@chooseproperty.in
                </a>
              </li>
              <li className="flex items-center gap-3 rounded-xl bg-paper-soft p-3">
                <MapPin className="h-5 w-5 shrink-0 text-brand" aria-hidden /> Patna, Bihar, India
              </li>
            </ul>
          </div>
          <p className="rounded-xl bg-paper-soft px-4 py-3 text-xs leading-relaxed text-ink-faint">
            We only use your contact details to respond to your enquiry. We never share your information.
          </p>
        </aside>
      </div>
    </div>
  );
}
