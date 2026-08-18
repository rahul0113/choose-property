import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use | Choose Property",
  description: "Terms of use governing the Choose Property brokerage website.",
};

const LAST_UPDATED = "18 August 2026";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold sm:text-3xl">Terms of Use</h1>
      <p className="mt-2 text-sm text-ink-faint">Last updated: {LAST_UPDATED}</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-ink-soft">

        <section>
          <p>
            These <strong>Terms of Use (&ldquo;Terms&rdquo;)</strong> govern your access to and use of the
            <strong> Choose Property</strong> website at <strong>chooseproperty.in</strong>, operated by a property
            brokerage service based in Bihar, India (referred to as <strong>&ldquo;we / us / our&rdquo;</strong>).
            By using this Website, you agree to be bound by these Terms. If you do not agree, please stop using the Website.
          </p>
          <p className="mt-3">
            <strong>Scope of Service:</strong> Choose Property is a <strong>plot and land brokerage service</strong> only.
            We do not provide construction, building, development, architectural, or any allied services.
            All activity on this Website relates exclusively to the buying and selling of bare plots and land parcels in Bihar.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">1. Informational Purpose</h2>
          <p className="mt-2">
            This Website is a property information and enquiry platform. All listings are for reference only and do not
            constitute a legal offer, guarantee of title, or professional advice of any kind. Users should consult a
            qualified legal professional before entering into any property transaction.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">2. Nature of Listings</h2>
          <p className="mt-2">
            All listings on this Website relate to <strong>bare plots and land</strong> in Bihar, India only.
            No listings for built properties, apartments, commercial buildings, or construction projects are offered.
            Listing data is supplied by sellers and is not independently verified by us.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">3. Measurements &amp; Diagrams</h2>
          <p className="mt-2">
            Plot dimensions, area figures, and any diagrams shown on this Website are indicative and based on
            seller-provided information. They are <strong>not official land surveys</strong>. Buyers must verify all
            measurements independently through licensed surveyors and official Bihar land records before any purchase.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">4. Land Classification</h2>
          <p className="mt-2">
            Classification details (e.g. Raiyati, Gair Majarua Aam, Gair Majarua Malik) are provided by the seller
            and have not been verified by us. Buyers must independently confirm classification, title, and legal
            transferability through the appropriate district revenue offices and official land records before purchase.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">5. Prices</h2>
          <p className="mt-2">
            Any prices shown are indicative only, subject to change, and subject to negotiation between the buyer and
            seller directly. We are not a party to any sale agreement. We bear no liability for any pricing disputes.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">6. User Obligations</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Use this Website only for lawful purposes related to buying or selling plots and land in Bihar.</li>
            <li>Provide accurate information when submitting enquiries.</li>
            <li>Conduct independent legal, financial, and physical due diligence before any transaction.</li>
            <li>Not copy, scrape, or distribute content from this Website without written permission.</li>
            <li>Not use this Website to mislead, defame, or defraud any person.</li>
            <li>Comply with all applicable Indian laws.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">7. Intellectual Property</h2>
          <p className="mt-2">
            All content on this Website — text, photographs, diagrams, logos, and design — is owned by Choose Property
            or the respective sellers. Unauthorised reproduction or distribution is not permitted.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">8. Third-Party Links</h2>
          <p className="mt-2">
            Links to external services (e.g. Google Maps, WhatsApp) are provided for convenience only. We are not
            responsible for the content, terms, or privacy practices of any third-party site.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">9. No Warranty</h2>
          <p className="mt-2">
            The Website and all content are provided <strong>&ldquo;as is&rdquo;</strong> without any express or
            implied warranty, including warranties of accuracy, merchantability, or fitness for a particular purpose.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">10. Limitation of Liability</h2>
          <p className="mt-2">
            To the fullest extent permitted by law, Choose Property shall not be liable for any loss, damage, or claim
            arising from:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Reliance on any listing, information, or content on this Website.</li>
            <li>Any plot or land transaction entered into based on information from this Website.</li>
            <li>Any dispute between a buyer and a seller.</li>
            <li>Technical failures, interruptions, or data loss.</li>
          </ul>
          <p className="mt-2">
            You are solely responsible for verifying all information through official land records and qualified legal
            advice before any purchase.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">11. Modifications</h2>
          <p className="mt-2">
            We may update these Terms at any time. Continued use of the Website after changes are posted constitutes
            acceptance of the updated Terms.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">12. Governing Law &amp; Jurisdiction</h2>
          <p className="mt-2">
            These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction
            of the courts in Bihar, India.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">13. Contact Us</h2>
          <p className="mt-2">For questions about these Terms, please contact us:</p>
          <address className="mt-2 not-italic">
            <strong>Choose Property</strong><br />
            Bihar, India<br />
            <Link href="/contact" className="text-brand underline underline-offset-2">Contact Page</Link>
          </address>
        </section>

      </div>
    </div>
  );
}
