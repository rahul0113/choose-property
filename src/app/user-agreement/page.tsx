import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "User Agreement | Choose Property",
  description: "User Agreement governing the use of the Choose Property website and brokerage services.",
};

const LAST_UPDATED = "18 August 2026";

export default function UserAgreementPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold sm:text-3xl">User Agreement</h1>
      <p className="mt-2 text-sm text-ink-faint">Last updated: {LAST_UPDATED}</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-ink-soft">

        <section>
          <p>
            This <strong>User Agreement (&ldquo;Agreement&rdquo;)</strong> is entered into between you
            (<strong>&ldquo;User / You / Customer&rdquo;</strong>) and <strong>Choose Property</strong>, a property
            brokerage service operating in Bihar, India (referred to herein as <strong>&ldquo;we / us / our&rdquo;</strong>
            or <strong>&ldquo;Choose Property&rdquo;</strong>). The website at <strong>chooseproperty.in</strong>
            (the <strong>&ldquo;Website&rdquo;</strong>) is owned and operated by Choose Property.
          </p>
          <p className="mt-3">
            Choose Property is a <strong>brokerage service</strong>, not a registered company, licensed developer, or RERA-registered agent.
            We act solely as a facilitator connecting buyers with sellers of plots and land in Bihar.
            We do <strong>not</strong> provide any construction, building, development, or allied services.
            Our service is limited strictly to <strong>buying and selling of plots and land parcels</strong>.
          </p>
          <p className="mt-3">
            By using this Website, you confirm that you have read, understood, and agree to be bound by this Agreement.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">1. Nature of Service</h2>
          <p className="mt-2">
            Choose Property provides an online platform for listing and discovering plots and land parcels for sale in Bihar, India.
            Our role is limited to:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Publishing property listings sourced from sellers, property owners, or their authorised representatives.</li>
            <li>Facilitating initial enquiries between prospective buyers and sellers through phone, WhatsApp, or this Website.</li>
            <li>Sharing information about plot dimensions, location, land classification, and availability as provided by the seller.</li>
          </ul>
          <p className="mt-3">
            We do <strong>not</strong> provide construction services, architectural advice, building approvals, legal title
            verification, or any service beyond plot and land brokerage. Any such requirements must be arranged independently by the buyer.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">2. Scope of Listings</h2>
          <p className="mt-2">
            All listings on this Website relate exclusively to <strong>bare land and plots</strong> &mdash; agricultural land, residential plots,
            and commercial plots. No built structures, buildings, flats, or construction projects are offered or facilitated through this Website.
          </p>
          <p className="mt-2">
            All listing information is provided by the seller or their representative. Choose Property does not independently verify
            the accuracy of any listing and makes no representation or warranty about the same.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">3. Information Accuracy</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Plot area and dimensions are indicative and based on seller-provided data. They are not official surveys.</li>
            <li>Land classification (e.g. Raiyati, Gair Majarua) is shown as provided by the seller and must be verified against official district records independently.</li>
            <li>Prices are indicative only and subject to negotiation between buyer and seller.</li>
            <li>Choose Property is not a party to any sale agreement and bears no liability for price-related disputes.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">4. Eligibility</h2>
          <p className="mt-2">
            This Website is for persons who are at least 18 years of age and legally capable of entering into contracts under Indian law.
            It is intended exclusively for users within India who are seeking to buy or sell plots and land in Bihar.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">5. User Obligations</h2>
          <p className="mt-2">By using this Website, you agree to:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Use the Website only for lawful purposes related to buying or selling plots and land.</li>
            <li>Provide accurate information when submitting any enquiry.</li>
            <li>Conduct your own independent due diligence (legal, financial, and physical) before entering into any transaction.</li>
            <li>Not copy, scrape, or reproduce any content from this Website without written permission.</li>
            <li>Not use this Website to harass, defame, mislead, or defraud any person.</li>
            <li>Comply with all applicable Indian laws, including local, state, and central regulations.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">6. Enquiries and Lead Information</h2>
          <p className="mt-2">
            When you submit an enquiry via this Website, your name and contact details will be shared with our broker to follow up
            on your request. By submitting an enquiry, you consent to being contacted by us via phone, WhatsApp, or SMS regarding
            your property interest, including overriding any DND / NDNC registration.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">7. Intellectual Property</h2>
          <p className="mt-2">
            All content on this Website &mdash; including text, photographs, diagrams, property descriptions, logos, and design &mdash;
            belongs to Choose Property or the respective sellers. Reproduction or use of any content without prior written permission is not permitted.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">8. No Warranty</h2>
          <p className="mt-2">
            This Website and all content therein are provided <strong>&ldquo;as is&rdquo;</strong> and <strong>&ldquo;as available&rdquo;</strong>
            without any warranty of any kind, express or implied, including any warranty of accuracy, merchantability, or fitness for a particular purpose.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">9. Limitation of Liability</h2>
          <p className="mt-2">
            To the fullest extent permitted by law, Choose Property shall not be liable for any loss, damage, or claim arising from:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Reliance on any listing or information on this Website.</li>
            <li>Any plot or land transaction entered into based on information from this Website.</li>
            <li>Any dispute between a buyer and a seller.</li>
            <li>Technical failures, data loss, or interruptions to the Website.</li>
          </ul>
          <p className="mt-2">
            You are solely responsible for verifying all information with official land records (Jamabandi, Dakhil Kharij, etc.)
            and seeking independent legal advice before any purchase.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">10. Modifications</h2>
          <p className="mt-2">
            We may update this Agreement at any time. Changes take effect upon posting to the Website. Continued use of the Website constitutes acceptance of the revised Agreement.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">11. Governing Law &amp; Jurisdiction</h2>
          <p className="mt-2">
            This Agreement is governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Bihar, India.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">12. Contact Us</h2>
          <p className="mt-2">For any queries about this Agreement, please contact us:</p>
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
