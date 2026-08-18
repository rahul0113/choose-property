"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Layers, Menu, MessageCircle, X } from "lucide-react";
import { genericWaLink } from "@/lib/whatsapp";

const NAV: Array<{ href: string; label: string; children?: Array<{ href: string; label: string }> }> = [
  { href: "/", label: "Home" },
  {
    href: "/properties",
    label: "Properties",
    children: [
      { href: "/properties", label: "All Properties" },
      { href: "/properties/residential", label: "Residential Plots" },
      { href: "/properties/commercial", label: "Commercial Plots" },
      { href: "/properties/other", label: "Other Land" },
    ],
  },
  { href: "/converter", label: "Converter" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function Logo({ onClick }: { onClick?: () => void } = {}) {
  return (
    <Link href="/" onClick={onClick} className="flex items-center gap-2 text-ink" aria-label="Choose Property — home">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
        <Layers className="h-5 w-5" aria-hidden />
      </span>
      <span className="text-lg font-bold tracking-tight">
        Choose <span className="text-brand">Property</span>
      </span>
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [propsOpen, setPropsOpen] = useState(false);
  const [mobilePropsOpen, setMobilePropsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [mobileOpen]);

  const mobileNav = (
    <div
      className={`fixed inset-0 z-[100] transition-opacity duration-300 md:hidden ${
        mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-ink/40 transition-opacity"
        onClick={() => setMobileOpen(false)}
      />
      <div
        className={`absolute inset-y-0 right-0 flex w-[85%] max-w-sm flex-col bg-white shadow-sheet transition-transform duration-300 ease-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-paper-line px-4 py-3">
          <Logo onClick={() => setMobileOpen(false)} />
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink-soft hover:bg-paper-soft"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" aria-hidden />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Mobile">
          {NAV.map((item) =>
            item.children ? (
              <div key={item.href} className="mb-1">
                <button
                  type="button"
                  onClick={() => setMobilePropsOpen(!mobilePropsOpen)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-base font-medium text-ink hover:bg-paper-soft"
                >
                  {item.label}
                  <ChevronDown className={`h-5 w-5 transition-transform ${mobilePropsOpen ? "rotate-180" : ""}`} />
                </button>
                <div
                  className={`grid transition-all duration-200 ${
                    mobilePropsOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className={`block rounded-lg px-6 py-2 text-sm ${
                          isActive(child.href) ? "text-brand font-medium" : "text-ink-soft"
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-3 text-base font-medium text-ink hover:bg-paper-soft"
              >
                {item.label}
              </Link>
            )
          )}

          <div className="mt-4 border-t border-paper-line px-3 pt-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-faint">Company</h3>
            <div className="space-y-1">
              {[
                { href: "/faq", label: "Frequently Asked Questions" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms" },
                { href: "/disclaimer", label: "Disclaimer" },
                { href: "/user-agreement", label: "User Agreement" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-3 text-base font-medium text-ink hover:bg-paper-soft"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
        <div className="border-t border-paper-line p-4">
          <a
            href={genericWaLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 font-semibold text-white"
          >
            <MessageCircle className="h-5 w-5" aria-hidden />
            WhatsApp Us
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-paper-line bg-white/95 backdrop-blur">
      {mounted && createPortal(mobileNav, document.body)}
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV.map((item) =>
            item.children ? (
              <div key={item.href} className="relative">
                <button
                  type="button"
                  onClick={() => setPropsOpen((v) => !v)}
                  onBlur={() => setTimeout(() => setPropsOpen(false), 120)}
                  className={`flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-brand-soft text-brand-dark"
                      : "text-ink-soft hover:bg-paper-soft hover:text-ink"
                  }`}
                  aria-expanded={propsOpen}
                  aria-haspopup="true"
                >
                  {item.label}
                  <ChevronDown className="h-4 w-4" aria-hidden />
                </button>
                {propsOpen && (
                  <div className="absolute left-0 top-full z-50 mt-1 w-52 rounded-xl border border-paper-line bg-white p-1.5 shadow-card">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`block rounded-lg px-3 py-2 text-sm ${
                          isActive(child.href)
                            ? "bg-brand-soft font-medium text-brand-dark"
                            : "text-ink-soft hover:bg-paper-soft hover:text-ink"
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-brand-soft text-brand-dark"
                    : "text-ink-soft hover:bg-paper-soft hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={genericWaLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 md:flex"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            WhatsApp
          </a>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink-soft hover:bg-paper-soft md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" aria-hidden />
          </button>
        </div>
      </div>

    </header>
  );
}
