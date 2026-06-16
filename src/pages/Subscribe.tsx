import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Zap, Shield, Star, ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "../Components/ui/button";
import { getStoredUser } from "../utils/auth";
import API from "../api";

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: 9,
    period: "month",
    description: "Perfect for individual sellers",
    features: [
      "Up to 5 active listings",
      "10 photos per listing",
      "Standard listing visibility",
      "Email support",
    ],
    highlight: false,
    icon: Shield,
  },
  {
    id: "pro",
    name: "Pro",
    price: 19,
    period: "month",
    description: "For serious sellers & small dealers",
    features: [
      "Unlimited active listings",
      "10 photos per listing",
      "Featured listing badges",
      "AI Price Negotiation Assistant",
      "Priority email support",
      "Analytics dashboard",
    ],
    highlight: true,
    icon: Zap,
  },
  {
    id: "dealer",
    name: "Dealer",
    price: 49,
    period: "month",
    description: "For dealerships & high-volume sellers",
    features: [
      "Unlimited active listings",
      "Unlimited photos per listing",
      "Top placement in search",
      "AI Price Negotiation Assistant",
      "Dedicated account manager",
      "API access",
      "White-label options",
    ],
    highlight: false,
    icon: Star,
  },
] as const;

type PlanId = (typeof PLANS)[number]["id"];

export default function Subscribe() {
  const authUser = getStoredUser();
  const [selected, setSelected] = useState<PlanId>("pro");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedPlan = PLANS.find((p) => p.id === selected)!;

  const handleSubscribe = async () => {
    setError("");
    setLoading(true);
    try {
      await API.post("/api/subscription", {
        plan: selected,
        email: authUser?.email,
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-zinc-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Back */}
        <Link
          to="/my-listings"
          className="inline-flex items-center gap-1.5 mb-8 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to My Garage
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold text-gray-300 mb-4">
            Choose a plan
          </span>
          <h1 className="text-4xl font-black text-white tracking-tight mb-3">
            Keep your listings live
          </h1>
          <p className="text-gray-400 max-w-md mx-auto">
            Your free trial has ended. Pick a plan to reactivate your listings and keep connecting with buyers.
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-10">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            const isSelected = selected === plan.id;
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelected(plan.id)}
                className={`relative rounded-2xl p-6 text-left transition-all border-2 ${
                  isSelected
                    ? "border-red-500 bg-white/10 shadow-lg shadow-red-500/20"
                    : "border-white/10 bg-white/5 hover:border-white/30"
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-red-600 px-3 py-0.5 text-[11px] font-bold text-white">
                    Most popular
                  </span>
                )}
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl mb-4 ${isSelected ? "bg-red-600" : "bg-white/10"}`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-white">{plan.name}</h2>
                <p className="text-xs text-gray-400 mb-4">{plan.description}</p>
                <div className="mb-5">
                  <span className="text-3xl font-black text-white">${plan.price}</span>
                  <span className="text-sm text-gray-400">/{plan.period}</span>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-green-400" />
                      {f}
                    </li>
                  ))}
                </ul>
                {isSelected && (
                  <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center">
                    <CheckCircle2 className="h-3 w-3 text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mx-auto max-w-md">
          {submitted ? (
            <div className="rounded-2xl border border-green-500/30 bg-green-500/10 px-6 py-8 text-center">
              <CheckCircle2 className="h-10 w-10 text-green-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">You're all set!</h3>
              <p className="text-sm text-gray-400 mb-5">
                Your <strong className="text-white">{selectedPlan.name}</strong> plan is being activated. Your listings will be live shortly.
              </p>
              <Link to="/my-listings">
                <Button className="rounded-xl bg-red-600 text-white hover:bg-red-700">
                  Back to My Garage
                </Button>
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-6">
              <p className="text-sm text-gray-400 mb-1">Selected plan</p>
              <div className="flex items-center justify-between mb-5">
                <span className="text-white font-bold text-lg">{selectedPlan.name}</span>
                <span className="text-white font-bold">${selectedPlan.price}<span className="text-gray-400 text-sm font-normal">/{selectedPlan.period}</span></span>
              </div>
              {authUser?.email && (
                <p className="text-xs text-gray-500 mb-4">
                  Subscribing as <span className="text-gray-300">{authUser.email}</span>
                </p>
              )}
              {error && (
                <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
                  {error}
                </p>
              )}
              <Button
                onClick={handleSubscribe}
                disabled={loading}
                className="w-full rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 h-11"
              >
                {loading
                  ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Processing…</span>
                  : `Subscribe to ${selectedPlan.name} — $${selectedPlan.price}/mo`}
              </Button>
              <p className="mt-3 text-center text-xs text-gray-500">
                Cancel anytime. Payment powered by Stripe (coming soon).
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
