import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Disclaimer | Choose Property",
  description: "Disclaimer for the Choose Property property brokerage website.",
};

const LAST_UPDATED = "18 August 2026";

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold sm:text-3xl">Disclaimer</h1>
      <p className="mt-2 text-sm text-ink-faint">Last updated: {LAST_UPDATED}</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-ink-soft">

        <section>
          <p>
            <strong>Choose Property</strong> is a property brokerage service operating in Bihar, India.
            We facilitate the buying and selling of <strong>plots and land</strong> only. We do not provide construction,
            building, development, or any allied services. The following disclaimer applies to all content, listings, and
            information available on this Website.
          </p>
          <p className="mt-3">
            All possible efforts are made to ensure that the information on this Website is accurate and up to date.
            However, we do not guarantee the accuracy, correctness, or reliability of any listing, information, or
            content. As a user, you are responsible for independently verifying all information before relying on it
            or entering into any transaction. Anything on this Website is for <strong>reference purposes only</strong>
            and should not be treated as legal, financial, or professional advice. You must consult a qualified
            legal practitioner before acting on any information from this Website.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">1. Brokerage Service Only</h2>
          <p className="mt-2">
            Choose Property acts only as an intermediary connecting buyers and sellers of plots and land in Bihar.
            We are <strong>not</strong> a property developer, builder, construction company, or real estate developer.
            We do not build, develop, construct, or renovate any property. Our entire service is limited to facilitating
            the sale and purchase of bare land and plots.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">2. No Guarantee on Listing Accuracy</h2>
          <p className="mt-2">
            All listing data — including plot dimensions, area, location, classification, price, and photographs — is
            provided by the seller or property owner. We are not responsible for verifying its accuracy or
            completeness. Users must independently verify all listing details through official government land
            records and survey documentation before proceeding with any purchase.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">3. No Financial Guarantee</h2>
          <p className="mt-2">
            We do not guarantee or verify the financial capability of any buyer or seller. We do not guarantee that any
            transaction will be completed. We are not responsible for any loss arising out of any transaction that does
            or does not occur between a buyer and a seller.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">4. No Liability for Technical Issues</h2>
          <p className="mt-2">
            We are not responsible for any loss or damage resulting from technical failures, interruptions, errors,
            delays, or unauthorized access to or alteration of data on this Website.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">5. Content Provided &ldquo;As Is&rdquo;</h2>
          <p className="mt-2">
            This Website and all its content are provided <strong>&ldquo;as is&rdquo;</strong> without warranty of any kind.
            We do not promise any specific outcome from the use of this Website. Any material accessed or downloaded
            is at your own risk.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">6. No Responsibility for Third-Party Actions</h2>
          <p className="mt-2">
            Choose Property is not involved in the transaction between buyers and sellers beyond the initial
            introduction. We are not responsible for the conduct, representations, or actions of any buyer, seller,
            or third party encountered through this Website.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">7. Important Notice to Buyers</h2>
          <p className="mt-2">Before purchasing any plot or land listed on this Website, you must independently verify:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Legal title and ownership through official Bihar land records (Jamabandi, Dakhil Kharij, etc.).</li>
            <li>Land classification and any encumbrances through the district revenue office.</li>
            <li>Physical boundaries and dimensions through a licensed surveyor.</li>
            <li>Compliance with applicable local land use, conversion, and zoning regulations.</li>
          </ul>
          <p className="mt-2">
            We strongly recommend consulting a qualified legal practitioner before signing any sale agreement.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">8. Contact Us</h2>
          <p className="mt-2">For any concerns or questions regarding this Disclaimer:</p>
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
