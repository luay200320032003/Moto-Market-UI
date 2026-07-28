import { Link } from "react-router-dom";
import { DollarSign, Camera, PenLine, MessageSquare, ShieldCheck, Users, ArrowRight, Lightbulb, LucideIcon } from "lucide-react";

type Tip = {
  icon: LucideIcon;
  title: string;
  body: string;
  cta?: { label: string; to: string };
};

const TIPS: Tip[] = [
  {
    icon: DollarSign,
    title: "Price it right from the start",
    body: "Listings priced too high sit unsold for weeks and get stale. Check what similar bikes are actually selling for — our Get Trade-In Value tool gives you an instant estimate based on real marketplace listings, so you can price competitively from day one.",
    cta: { label: "Get a trade-in estimate", to: "/trade-in" },
  },
  {
    icon: Camera,
    title: "Take great photos",
    body: "Photos are the first thing buyers judge. Shoot in natural daylight, include multiple angles (both sides, front, back, dash/odometer, any wear or damage), and clean the bike first. Listings with 5+ clear photos get far more serious inquiries.",
  },
  {
    icon: PenLine,
    title: "Write an honest, detailed description",
    body: "Mention condition, mileage, recent maintenance, upgrades, and anything a buyer would want to know before driving out to see it. Vague descriptions raise red flags. If you're not sure where to start, our AI description generator on the listing form can draft one from your bike's details.",
  },
  {
    icon: MessageSquare,
    title: "Respond quickly",
    body: "Buyers move on fast — the first seller to reply is often the one who closes the sale. Check your messages regularly and answer questions clearly and promptly.",
  },
  {
    icon: ShieldCheck,
    title: "Verify your VIN",
    body: "A clean, verified VIN builds instant trust and reassures buyers your bike's history checks out. Listings with VIN verification stand out from ones that don't offer it.",
  },
  {
    icon: Users,
    title: "Meet safely",
    body: "Always meet in a public, well-lit location — a busy parking lot or dealership works well. Bring a friend if you can, and confirm payment (cash, verified bank transfer, or cashier's check) before handing over the keys and title.",
  },
];

export default function SellingTips() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 py-14 text-center text-white">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur-md">
            <Lightbulb className="h-3.5 w-3.5" />
            Seller's Guide
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">Selling Tips</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-red-100 sm:text-base">
            Simple things that help your listing sell faster and for a fair price.
          </p>
        </div>
      </div>

      {/* Tips */}
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-5">
          {TIPS.map(({ icon: Icon, title, body, cta }) => (
            <div key={title} className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50">
                <Icon className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h2 className="mb-1.5 text-lg font-semibold text-gray-900">{title}</h2>
                <p className="text-sm leading-relaxed text-gray-600">{body}</p>
                {cta && (
                  <Link
                    to={cta.to}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700 hover:underline"
                  >
                    {cta.label} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/Sell"
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-red-700"
          >
            List Your Bike Now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
