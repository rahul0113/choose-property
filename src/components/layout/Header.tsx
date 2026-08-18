"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, House, Menu, MessageCircle, X } from "lucide-react";
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

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-ink" aria-label="Choose Property — home">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
        <House className="h-5 w-5" aria-hidden />
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

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-paper-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        {/* Desktop nav */}
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
                  <div className="absolute left-0 top-full mt-1 w-52 rounded-xl border border-paper-line bg-white p-1.5 shadow-card">
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

      {/* Mobile slide-over */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          />
          <div className="absolute inset-y-0 right-0 flex w-[85%] max-w-sm flex-col bg-white shadow-sheet">
            <div className="flex items-center justify-between border-b border-paper-line px-4 py-3">
              <Logo />
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
                    <p className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-ink-faint">
                      {item.label}
                    </p>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className={`block rounded-lg px-3 py-3 text-base ${
                          isActive(child.href)
                            ? "bg-brand-soft font-medium text-brand-dark"
                            : "text-ink-soft hover:bg-paper-soft"
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block rounded-lg px-3 py-3 text-base ${
                      isActive(item.href)
                        ? "bg-brand-soft font-medium text-brand-dark"
                        : "text-ink-soft hover:bg-paper-soft"
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              )}
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
      )}
    </header>
  );
}
