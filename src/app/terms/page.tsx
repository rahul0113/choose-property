import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for the Choose Property website.",
};

const LAST_UPDATED = "1 August 2026";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold sm:text-3xl">Terms of Use</h1>
      <p className="mt-2 text-sm text-ink-faint">Last updated: {LAST_UPDATED}</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink-soft">
        <section>
          <h2 className="text-base font-bold text-ink">1. Informational purpose</h2>
          <p className="mt-2">
            This website is a managed property catalogue. Listings are provided by the client and are for information only. They do not constitute an offer, legal advice, or a guarantee of title, classification, ownership, encumbrances or legal status.
          </p>
        </section>
        <section>
          <h2 className="text-base font-bold text-ink">2. Measurements &amp; diagrams</h2>
          <p className="mt-2">
            Land measurements and plot diagrams are informational and may vary by local convention, district, historical usage or official records. They are not legal surveys. Buyers must verify measurements against applicable official land records or survey documentation.
          </p>
        </section>
        <section>
          <h2 className="text-base font-bold text-ink">3. Land classification</h2>
          <p className="mt-2">
            Classification information is shown as provided by the client and may be pending verification. We do not assert legal transferability based on a classification category. Buyers must independently verify title, classification, ownership, encumbrances and legal status before purchase.
          </p>
        </section>
        <section>
          <h2 className="text-base font-bold text-ink">4. Prices</h2>
          <p className="mt-2">
            Selling prices are never shown publicly. All properties are "Contact for Price". Any price shared after enquiry is indicative and subject to negotiation and verification.
          </p>
        </section>
        <section>
          <h2 className="text-base font-bold text-ink">5. No liability</h2>
          <p className="mt-2">
            To the maximum extent permitted by law, we are not liable for any loss arising from reliance on information on this website. Always conduct your own due diligence with official records and professional advice before purchase.
          </p>
        </section>
        <section>
          <h2 className="text-base font-bold text-ink">6. Changes</h2>
          <p className="mt-2">
            These terms may be updated from time to time. Continued use of the site after changes constitutes acceptance of the revised terms.
          </p>
        </section>
      </div>
    </div>
  );
}
