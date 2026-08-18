import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Choose Property",
  description: "How Choose Property collects, uses, and protects your personal information.",
};

const LAST_UPDATED = "18 August 2026";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold sm:text-3xl">Privacy Policy</h1>
      <p className="mt-2 text-sm text-ink-faint">Last updated: {LAST_UPDATED}</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-ink-soft">

        <section>
          <h2 className="text-base font-bold text-ink">1. About Us</h2>
          <p className="mt-2">
            <strong>Choose Property</strong> is a property brokerage service based in Bihar, India. We assist buyers
            in finding and purchasing <strong>plots and land</strong>. We do not offer construction, building, or
            development services. This Privacy Policy explains how we collect, use, and protect your personal information
            when you use our Website at <strong>chooseproperty.in</strong>.
          </p>
          <p className="mt-2">
            We process your data in accordance with the <strong>Information Technology Act, 2000</strong> and other
            applicable Indian laws. This policy may be updated from time to time; please review it periodically.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">2. Information We Collect</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              <strong>From you directly:</strong> Your name, phone number, and any message you provide when submitting
              a property enquiry. We do not collect financial data, ID numbers, or payment information.
            </li>
            <li>
              <strong>Automatically:</strong> Basic usage data such as pages viewed, WhatsApp/call button clicks, and
              search queries — used only to improve the Website experience. No cross-site tracking.
            </li>
            <li>
              <strong>Technical data:</strong> IP address, browser type, and access times collected automatically by our servers.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">3. How We Use Your Information</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>To respond to your plot and land enquiries and connect you with our broker.</li>
            <li>To contact you via phone, WhatsApp, or SMS about properties you have expressed interest in.</li>
            <li>To improve our Website and understand which listings attract the most interest.</li>
            <li>To prevent fraud and misuse of the Website.</li>
            <li>To comply with legal obligations if required by law or court order.</li>
          </ul>
          <p className="mt-2">
            By submitting your contact details on this Website, you consent to being contacted by us via phone, WhatsApp,
            or SMS, including overriding any DND / NDNC registration.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">4. Data Sharing</h2>
          <p className="mt-2">
            We <strong>do not sell, rent, or share</strong> your personal information with any third party for marketing purposes.
          </p>
          <p className="mt-2">Your information may be shared only in these limited circumstances:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>With our broker to respond to your enquiry.</li>
            <li>With technology service providers (hosting, analytics) under strict confidentiality.</li>
            <li>When required by law, a court order, or government authority.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">5. Data Retention</h2>
          <p className="mt-2">
            We retain your information only as long as needed to handle your enquiry or fulfil legal obligations. You may
            request deletion of your data at any time by contacting us, and we will comply promptly.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">6. Cookies</h2>
          <p className="mt-2">
            We use minimal, privacy-respecting cookies to understand how visitors use our Website. We do not use
            advertising or cross-site tracking cookies. You may disable cookies in your browser settings, though
            some Website features may be affected.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">7. Security</h2>
          <p className="mt-2">
            We use HTTPS encryption and take reasonable technical measures to protect your data from unauthorised
            access. However, no internet-based system can be 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">8. Your Rights</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Request access to the personal data we hold about you.</li>
            <li>Request correction or deletion of your data.</li>
            <li>Withdraw consent to being contacted for follow-up purposes.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">9. Contact Us</h2>
          <p className="mt-2">For privacy questions or requests, please contact us:</p>
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
