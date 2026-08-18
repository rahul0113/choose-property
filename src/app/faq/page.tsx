import type { Metadata } from "next";
import { Accordion } from "@/components/ui/Accordion";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about buying land and plots in Bihar: measurements, documents, classification, and how enquiries work.",
};

const ITEMS = [
  {
    q: "How is the price shown?",
    a: "We never publish selling prices publicly. Every property is marked 'Contact for Price' — message us on WhatsApp or send an enquiry and we will share the price and full details directly.",
  },
  {
    q: "What do Katha, Dismil and Decimal mean?",
    a: "These are local land measurement units used across Bihar. Their exact size varies by district and convention — for example our default standard uses 1 Katha = 1,361 sq.ft and 1 Decimal = 435.6 sq.ft. Every property shows the standard used, and our converter lets you pick your district's standard. Always verify against official records.",
  },
  {
    q: "Are the dimensions and diagrams official?",
    a: "No. Diagrams and measurements shown are informational, provided by the client/admin, and are not legal surveys unless based on verified survey data. Always verify measurements against official land records before purchase.",
  },
  {
    q: "What does the land classification mean?",
    a: "Classification (like Gair Majarua Aam or Private/Raiyati) is shown as provided by the client, with a verification status: pending, client-provided, document-backed, admin-verified or officially verified. We never claim a property is legally transferable based on the classification alone — you must independently verify title, ownership, encumbrances and legal status.",
  },
  {
    q: "Are the documents available publicly?",
    a: "No. Original documents (khatiyan, jamabandi, mutation, registry) are kept private. Each listing shows a checklist of which documents exist and their verification status. After you enquire, we can share documents privately with you.",
  },
  {
    q: "How do enquiries work?",
    a: "Fill the enquiry form or message us on WhatsApp with the property ID (e.g. CP-BR-0001). We will call or message you back with price, documents and site-visit arrangements. Your details are only used to respond to your enquiry.",
  },
  {
    q: "Can I get the exact location before visiting?",
    a: "Most listings show an approximate location on the map. For security, exact coordinates may be shared after you enquire — depending on the listing's location precision setting.",
  },
  {
    q: "Do you help with the buying process?",
    a: "Yes — we can guide you through documents, measurement verification and site visits. For legal advice and registry procedures, we recommend consulting a local advocate or the relevant revenue office.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold sm:text-3xl">Frequently Asked Questions</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Everything buyers usually ask before calling us. Have a different question? WhatsApp us anytime.
      </p>
      <div className="mt-8">
        <Accordion items={ITEMS} />
      </div>
    </div>
  );
}
