import Link from "next/link";
import { House, Mail, MessageCircle, Phone } from "lucide-react";
import { DISCLAIMER_MEASUREMENTS, SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { genericWaLink, PHONE_NUMBER } from "@/lib/whatsapp";

const QUICK_LINKS = [
  { href: "/properties", label: "All Properties" },
  { href: "/properties/residential", label: "Residential Plots" },
  { href: "/properties/commercial", label: "Commercial Plots" },
  { href: "/converter", label: "Land Converter" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
];

export function Footer() {
  return (
    <footer className="border-t border-paper-line bg-paper-soft">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
                <House className="h-5 w-5" aria-hidden />
              </span>
              <span className="text-lg font-bold">
                Choose <span className="text-brand">Property</span>
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-ink-soft">{SITE_TAGLINE} Bihar, India.</p>
            <p className="mt-3 text-sm text-ink-faint">{SITE_NAME} © {new Date().getFullYear()}</p>
          </div>

          <nav aria-label="Properties">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-faint">Properties</h2>
            <ul className="mt-3 space-y-2">
              {QUICK_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-ink-soft hover:text-brand">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-faint">Company</h2>
            <ul className="mt-3 space-y-2">
              {COMPANY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-ink-soft hover:text-brand">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-faint">Contact</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href={genericWaLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-ink-soft hover:text-brand">
                  <MessageCircle className="h-4 w-4 text-[#25D366]" aria-hidden /> WhatsApp Us
                </a>
              </li>
              <li>
                <a href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`} className="flex items-center gap-2 text-ink-soft hover:text-brand">
                  <Phone className="h-4 w-4 text-brand" aria-hidden /> {PHONE_NUMBER}
                </a>
              </li>
              <li>
                <a href="mailto:hello@chooseproperty.in" className="flex items-center gap-2 text-ink-soft hover:text-brand">
                  <Mail className="h-4 w-4 text-brand" aria-hidden /> hello@chooseproperty.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-10 border-t border-paper-line pt-6 text-xs leading-relaxed text-ink-faint">
          {DISCLAIMER_MEASUREMENTS}
        </p>
      </div>
    </footer>
  );
}
