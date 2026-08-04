import { Mail, Phone, MapPin, Clock, HelpCircle, MessageCircle, ChevronDown, LucideIcon } from "lucide-react";

type ContactMethod = {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
  note: string;
  accent: string;
  ring: string;
};

const FAQS = [
  {
    q: "How do I list my motorcycle for sale?",
    a: "Click \"Sell Your Motorcycle\" in the top menu, fill in your bike's details, add photos, and publish. Your listing goes live right away.",
  },
  {
    q: "Is there a fee to list a bike?",
    a: "You get a free trial period when you sign up. After that, an active subscription (User or Dealer plan) keeps your listings live.",
  },
  {
    q: "How do I contact a seller or dealer?",
    a: "Open any listing and use the \"Contact Seller\"/\"Contact Dealer\" form on the detail page — your message goes straight to them by email.",
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Yes — go to Manage Subscription and cancel whenever you like. You'll keep access until the end of your current billing period.",
  },
];

const CONTACT_METHODS: ContactMethod[] = [
  {
    icon: Mail,
    label: "Email",
    value: "support@motosmarketplace.com",
    href: "mailto:support@motosmarketplace.com",
    note: "We typically reply within one business day.",
    accent: "from-indigo-600 to-blue-600",
    ring: "group-hover:ring-indigo-100",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "615-625-6055",
    href: "tel:+16156256055",
    note: "Mon–Fri, 9am–6pm CT",
    accent: "from-sky-600 to-cyan-600",
    ring: "group-hover:ring-sky-100",
  },
  {
    icon: MapPin,
    label: "Based in",
    value: "Nashville, TN",
    note: "Serving riders and dealers nationwide.",
    accent: "from-violet-500 to-purple-500",
    ring: "group-hover:ring-violet-100",
  },
  {
    icon: Clock,
    label: "Support hours",
    value: "Monday – Friday",
    note: "9:00 AM – 6:00 PM Central Time",
    accent: "from-teal-500 to-emerald-500",
    ring: "group-hover:ring-teal-100",
  },
];

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-b from-indigo-50 via-blue-50/40 to-gray-50 py-16 text-center">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(circle, #4f46e5 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 -translate-y-1/3 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="relative mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 shadow-lg shadow-indigo-600/20">
            <MessageCircle className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Contact Us</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-gray-600 sm:text-base">
            Questions, feedback, or need a hand with something? We're happy to help.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Contact methods */}
        <div className="grid gap-5 sm:grid-cols-2">
          {CONTACT_METHODS.map(({ icon: Icon, label, value, href, note, accent, ring }) => {
            const Wrapper = href ? "a" : "div";
            return (
              <Wrapper
                key={label}
                {...(href ? { href } : {})}
                className={`group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm ring-1 ring-transparent transition-all hover:-translate-y-0.5 hover:shadow-lg ${ring}`}
              >
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${accent} shadow-sm transition-transform group-hover:scale-105`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="mb-1 text-base font-semibold text-gray-900">{label}</h2>
                  <p className={`text-sm font-medium text-gray-800 ${href ? "group-hover:underline" : ""}`}>{value}</p>
                  <p className="mt-1 text-xs text-gray-500">{note}</p>
                </div>
              </Wrapper>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <div className="mb-5 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-indigo-700" />
            <h2 className="text-xl font-semibold text-gray-900">Frequently asked questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map(({ q, a }) => (
              <details
                key={q}
                className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm open:shadow-md open:ring-1 open:ring-indigo-100"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-gray-900">
                  {q}
                  <ChevronDown className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-open:rotate-180 group-open:text-indigo-700" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Still have questions CTA */}
        <div className="mt-10 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-blue-50 p-6 text-center">
          <p className="text-sm text-gray-700">
            Still have questions?{" "}
            <a href="mailto:support@motosmarketplace.com" className="font-semibold text-indigo-700 hover:underline">
              Email our team
            </a>{" "}
            and we'll get back to you.
          </p>
        </div>
      </div>
    </div>
  );
}
