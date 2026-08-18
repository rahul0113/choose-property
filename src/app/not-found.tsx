import Link from "next/link";
import { ArrowRight, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <SearchX className="mx-auto h-12 w-12 text-ink-faint" aria-hidden />
      <h1 className="mt-4 text-3xl font-bold">Page not found</h1>
      <p className="mt-2 text-sm text-ink-soft">
        The page you are looking for doesn&apos;t exist or may have been moved.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/properties"
          className="inline-flex h-12 items-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-white hover:opacity-90"
        >
          Explore Properties <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        <Link
          href="/"
          className="inline-flex h-12 items-center rounded-full border border-paper-line px-6 text-sm font-semibold text-ink-soft hover:bg-paper-soft"
        >
          Go home
        </Link>
      </div>
      <div className="mt-10 text-left">
        <h2 className="text-sm font-semibold text-ink-faint">Popular searches</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {["/properties/residential", "/properties/commercial", "/converter", "/faq", "/contact"].map((href) => (
            <Link key={href} href={href} className="rounded-full bg-paper-soft px-4 py-2 text-sm font-medium text-brand hover:bg-brand-soft">
              {href === "/properties/residential" ? "Residential plots" : href === "/properties/commercial" ? "Commercial plots" : href === "/converter" ? "Land converter" : href === "/faq" ? "FAQ" : "Contact"}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
