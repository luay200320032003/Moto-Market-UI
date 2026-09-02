import { Link } from "react-router-dom";
import { ShieldCheck, Sparkles, Users, MapPin, ArrowRight } from "lucide-react";

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Verified & trustworthy",
    body: "VIN verification, dealer information, and honest listings — we make it easy to check a bike out before you commit.",
  },
  {
    icon: Sparkles,
    title: "AI-powered tools",
    body: "Instant trade-in estimates, AI-generated listing descriptions, and pricing guidance take the guesswork out of buying and selling.",
  },
  {
    icon: Users,
    title: "Built for everyone",
    body: "Whether you're an individual selling your first bike or a dealership managing hundreds of listings, Moto Markets works for you.",
  },
];

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 py-16 text-center text-white">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold sm:text-4xl">About Moto Markets</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-red-100 sm:text-base">
            A motorcycle marketplace built to make buying and selling bikes simpler, safer, and a little smarter.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-10">
          <h2 className="text-xl font-semibold text-gray-900">Our story</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-700">
            Moto Markets started with a simple frustration: buying and selling motorcycles online was scattered
            across too many places, with too little trust and too much guesswork. We built Moto Markets to bring
            it all into one place — real dealer inventory, individual listings, and the tools to actually make a
            confident decision, whether you're buying your first bike or selling your tenth.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-gray-700">
            Today, Moto Markets combines thousands of dealer listings with a growing community of individual
            sellers, backed by VIN verification, AI-assisted pricing and descriptions, and a straightforward
            listing process — so you can spend less time searching and more time riding.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-gray-900">What we offer</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-1">
            {VALUES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex gap-4 rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50">
                  <Icon className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">{body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-4">
            <MapPin className="h-5 w-5 shrink-0 text-red-600" />
            <p className="text-sm text-gray-700">
              Proudly based in <strong className="font-semibold text-gray-900">Nashville, TN</strong>, serving
              riders and dealers nationwide.
            </p>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 border-t border-gray-100 pt-8 text-center sm:flex-row sm:justify-center sm:gap-4">
            <Link
              to="/Browse"
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-red-700"
            >
              Browse Motorcycles
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/Sell"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              List Your Bike
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
