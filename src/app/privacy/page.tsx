import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Choose Property handles your personal information.",
};

const LAST_UPDATED = "1 August 2026";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold sm:text-3xl">Privacy Policy</h1>
      <p className="mt-2 text-sm text-ink-faint">Last updated: {LAST_UPDATED}</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink-soft">
        <section>
          <h2 className="text-base font-bold text-ink">1. What we collect</h2>
          <p className="mt-2">
            When you submit an enquiry we collect your name, phone number and the details you choose to provide (such as budget, preferred location and message). We also collect basic, privacy-conscious usage data such as page views and clicks on WhatsApp/call buttons — no cookies wall, no cross-site tracking.
          </p>
        </section>
        <section>
          <h2 className="text-base font-bold text-ink">2. How we use it</h2>
          <p className="mt-2">
            Your enquiry details are used only to respond to you about properties and to manage our lead pipeline. Usage data helps us understand which properties and locations are of interest.
          </p>
        </section>
        <section>
          <h2 className="text-base font-bold text-ink">3. What we never do</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>We never sell or rent your personal information.</li>
            <li>We never publish your details publicly.</li>
            <li>We never expose original legal documents or hidden coordinates on the website.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-base font-bold text-ink">4. Data retention</h2>
          <p className="mt-2">
            Enquiry records are kept as long as needed to manage the enquiry and any resulting transaction. You may ask us to delete your data at any time by contacting us.
          </p>
        </section>
        <section>
          <h2 className="text-base font-bold text-ink">5. Contact</h2>
          <p className="mt-2">
            For privacy questions, contact us via WhatsApp, phone or email — details on our Contact page.
          </p>
        </section>
      </div>
    </div>
  );
}
