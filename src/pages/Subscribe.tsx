import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2, User, Building2, ChevronLeft, Loader2,
  Shield, CreditCard, Lock, ArrowRight, Zap, Star
} from "lucide-react";
import { Button } from "../Components/ui/button";
import { getStoredUser } from "../utils/auth";
import API from "../api";

const PLANS = [
  {
    id: "user",
    name: "User",
    price: 9.99,
    description: "For individual sellers who want to list their bikes",
    features: [
      "Up to 5 active listings",
      "Up to 10 photos per listing",
      "Standard listing visibility",
      "Email support",
    ],
    highlight: false,
    icon: User,
    badge: null,
  },
  {
    id: "dealer",
    name: "Dealer",
    price: 49.99,
    description: "For dealerships & high-volume sellers",
    features: [
      "Unlimited active listings",
      "Unlimited photos per listing",
      "Top placement in search results",
      "Dedicated account manager",
      "White-label options",
      "Bulk CSV upload (coming soon)",
    ],
    highlight: true,
    icon: Building2,
    badge: "Best for dealers",
  },
] as const;

type PlanId = (typeof PLANS)[number]["id"];
type Step = "plans" | "checkout" | "success";
type Plan = (typeof PLANS)[number];

function FeatureItem({ text }: { text: string }) {
  const comingSoon = text.includes("(coming soon)");
  return (
    <li className={`flex items-start gap-2.5 text-sm ${comingSoon ? "text-gray-500" : "text-gray-300"}`}>
      <CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${comingSoon ? "text-gray-600" : "text-green-400"}`} />
      {comingSoon ? (
        <span>
          {text.replace(" (coming soon)", "")}{" "}
          <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-gray-400">
            coming soon
          </span>
        </span>
      ) : text}
    </li>
  );
}

// ── Step 1: Plan selection ──────────────────────────────────────────────────
function PlansView({
  selected,
  setSelected,
  onContinue,
}: {
  selected: PlanId;
  setSelected: (id: PlanId) => void;
  onContinue: () => void;
}) {
  const selectedPlan = PLANS.find((p) => p.id === selected)!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-zinc-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <Link
          to="/my-listings"
          className="inline-flex items-center gap-1.5 mb-10 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to My Garage
        </Link>

        {/* Hero */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-gray-300 mb-5">
            <Zap className="h-3.5 w-3.5 text-yellow-400" />
            Simple, transparent pricing
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight mb-4">
            Choose your plan
          </h1>
          <p className="text-gray-400 max-w-md mx-auto">
            Pick the plan that fits how you sell. Cancel any time — no contracts, no hidden fees.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto mb-10">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            const isSelected = selected === plan.id;
            const isDealer = plan.id === "dealer";
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelected(plan.id)}
                className={`relative rounded-2xl p-8 text-left transition-all duration-200 border-2 w-full ${
                  isSelected
                    ? isDealer
                      ? "border-red-500 bg-gradient-to-b from-red-950/50 to-zinc-900/80 shadow-2xl shadow-red-500/20"
                      : "border-blue-500 bg-gradient-to-b from-blue-950/50 to-zinc-900/80 shadow-2xl shadow-blue-500/20"
                    : "border-white/10 bg-white/5 hover:border-white/25"
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-red-600 px-4 py-1 text-[11px] font-bold text-white shadow-lg whitespace-nowrap">
                    {plan.badge}
                  </span>
                )}

                <div className="flex items-center justify-between mb-6">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-colors ${
                    isSelected ? (isDealer ? "bg-red-600" : "bg-blue-600") : "bg-white/10"
                  }`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? isDealer ? "border-red-500 bg-red-500" : "border-blue-500 bg-blue-500"
                      : "border-white/25"
                  }`}>
                    {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                  </div>
                </div>

                <h2 className="text-2xl font-black text-white mb-1">{plan.name}</h2>
                <p className="text-xs text-gray-400 mb-6">{plan.description}</p>

                <div className="mb-7 pb-7 border-b border-white/10">
                  <div className="flex items-end gap-0.5">
                    <span className="text-5xl font-black text-white">${plan.price.toFixed(0)}</span>
                    <span className="text-lg text-gray-400 mb-1">
                      .{plan.price.toFixed(2).split(".")[1]}
                    </span>
                    <span className="text-sm text-gray-400 mb-1.5 ml-1">/ month</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Billed monthly. Cancel anytime.</p>
                </div>

                <ul className="space-y-3">
                  {plan.features.map((f) => <FeatureItem key={f} text={f} />)}
                </ul>
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <div className="max-w-sm mx-auto text-center">
          <Button
            onClick={onContinue}
            className="w-full h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white text-base font-bold shadow-xl shadow-red-600/20"
          >
            Continue with {selectedPlan.name} — ${selectedPlan.price.toFixed(2)}/mo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <div className="flex items-center justify-center gap-5 mt-5 text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><Lock className="h-3 w-3" />Secure payment</span>
            <span className="flex items-center gap-1.5"><Shield className="h-3 w-3" />Cancel anytime</span>
            <span className="flex items-center gap-1.5"><Star className="h-3 w-3" />No hidden fees</span>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Step 2: Checkout ────────────────────────────────────────────────────────
function CheckoutView({
  plan,
  authUser,
  nameOnCard,
  setNameOnCard,
  onBack,
  onConfirm,
  loading,
  error,
}: {
  plan: Plan;
  authUser: ReturnType<typeof getStoredUser>;
  nameOnCard: string;
  setNameOnCard: (v: string) => void;
  onBack: () => void;
  onConfirm: () => void;
  loading: boolean;
  error: string;
}) {
  const Icon = plan.icon;
  const isDealer = plan.id === "dealer";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-zinc-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 mb-10 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to plans
        </button>

        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-10 max-w-xs">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
              <CheckCircle2 className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-xs text-gray-400">Plan</span>
          </div>
          <div className="flex-1 h-px bg-white/20" />
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-red-600 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">2</span>
            </div>
            <span className="text-xs text-white font-medium">Checkout</span>
          </div>
          <div className="flex-1 h-px bg-white/10" />
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-[10px] font-bold text-gray-500">3</span>
            </div>
            <span className="text-xs text-gray-500">Done</span>
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-8 items-start">

          {/* ── Left: form (3 cols) ── */}
          <div className="md:col-span-3 space-y-6">
            <div>
              <h1 className="text-3xl font-black text-white mb-1">Complete your subscription</h1>
              <p className="text-sm text-gray-400">You're one step away from unlocking your plan.</p>
            </div>

            {/* Account */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
              <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Account</h3>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Email address</label>
                <input
                  type="email"
                  value={authUser?.email ?? ""}
                  readOnly
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-gray-400 cursor-not-allowed outline-none"
                />
              </div>
            </div>

            {/* Payment */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
              {/* Header row */}
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                  Payment details
                </h3>
                <div className="flex items-center gap-2">
                  {/* Stripe wordmark — coloured SVG inline */}
                  <svg viewBox="0 0 60 25" className="h-5 w-auto" aria-label="Stripe">
                    <path
                      d="M5.5 10.2c0-.7.6-1 1.5-1 1.4 0 3.1.4 4.5 1.1V6.4c-1.5-.6-3-.9-4.5-.9C3.6 5.5 1 7 1 10.4c0 5.3 7.3 4.5 7.3 6.8 0 .8-.7 1.1-1.7 1.1-1.5 0-3.4-.6-4.9-1.5v3.9c1.7.7 3.3 1 4.9 1 3.7 0 6.2-1.5 6.2-4.9-.1-5.7-7.3-4.7-7.3-6.6zm14 -4.6l-3.9.8V9h-2v3h2v5.8c0 2.5 1.2 3.7 3.8 3.7.9 0 2-.2 2.8-.5V18c-.5.2-1 .3-1.6.3-.9 0-1.1-.5-1.1-1.2V12h2.7V9h-2.7V5.6zm8.3 4.2c-.9 0-1.7.3-2.3.9l-.2-.7H22v13.4l3-.6V19c.6.4 1.4.6 2.3.6 2.4 0 4.6-1.9 4.6-5.1 0-3-2.1-4.7-4.1-4.7zm-.7 7.2c-.6 0-1.1-.2-1.4-.5v-4c.4-.4.9-.6 1.5-.6 1.1 0 1.9 1 1.9 2.5s-.8 2.6-2 2.6zm9.7-7.2c-3 0-4.8 2-4.8 5 0 3.3 2 5 5 5 1.4 0 2.7-.3 3.8-1v-2.7c-1 .6-2.1.9-3.2.9-1.3 0-2.4-.6-2.5-2h6.3v-1.2c0-3-1.6-5-4.6-5zm-1.6 4c.1-1.4.9-2 1.7-2 .7 0 1.5.5 1.5 2h-3.2zm12-4c-.8 0-1.7.4-2.1 1.2l-.2-1h-2.5v9.6h3v-6.7c.5-.6 1.3-.8 2.2-.8h.8V9.8c-.4-.1-.8-.2-1.2-.2zm5.5-3.4c-1 0-1.7.7-1.7 1.6 0 .9.7 1.6 1.7 1.6s1.7-.7 1.7-1.6c0-.9-.7-1.6-1.7-1.6zm-1.5 12.6h3V9.8h-3v9.6z"
                      fill="#635BFF"
                    />
                  </svg>
                  <div className="flex items-center gap-1 rounded-lg bg-green-500/15 border border-green-500/25 px-2 py-0.5">
                    <Lock className="h-3 w-3 text-green-400" />
                    <span className="text-[11px] font-semibold text-green-400">SSL</span>
                  </div>
                </div>
              </div>

              {/* Coming-soon banner */}
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 px-3.5 py-2.5 flex items-center gap-2.5">
                <CreditCard className="h-4 w-4 text-amber-400 shrink-0" />
                <p className="text-xs text-amber-300">
                  Live payments are coming soon. No charges will be made — your plan activates immediately.
                </p>
              </div>

              {/* Card number */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Card number</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="1234  5678  9012  3456"
                    maxLength={19}
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors pr-20"
                  />
                  {/* Card brand icons placeholder */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    <div className="h-5 w-8 rounded bg-[#1434CB] flex items-center justify-center">
                      <span className="text-[7px] font-black text-white leading-none">VISA</span>
                    </div>
                    <div className="h-5 w-8 rounded bg-white/10 flex items-center justify-center">
                      <span className="text-[6px] font-black text-orange-400 leading-none">MC</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expiry + CVC */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Expiry date</label>
                  <input
                    type="text"
                    placeholder="MM / YY"
                    maxLength={7}
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">
                    CVC
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="123"
                      maxLength={4}
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors pr-10"
                    />
                    <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                  </div>
                </div>
              </div>

              {/* Name on card */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Name on card</label>
                <input
                  type="text"
                  placeholder="As it appears on your card"
                  value={nameOnCard}
                  onChange={(e) => setNameOnCard(e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>

              <p className="text-xs text-gray-600 flex items-center gap-1.5">
                <Lock className="h-3 w-3 shrink-0" />
                Your card details are encrypted end-to-end and never stored on our servers.
              </p>
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <Button
              onClick={onConfirm}
              disabled={loading}
              className="w-full h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-base disabled:opacity-60 shadow-xl shadow-red-600/20"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Lock className="h-4 w-4" />
                  Confirm Subscription — ${plan.price.toFixed(2)}/mo
                </span>
              )}
            </Button>

            <p className="text-center text-xs text-gray-600">
              By subscribing you agree to our Terms of Service. Cancel any time.
            </p>
          </div>

          {/* ── Right: order summary (2 cols) ── */}
          <div className="md:col-span-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sticky top-24">
              <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-5">
                Order summary
              </h3>

              {/* Plan header */}
              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-white/10">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isDealer ? "bg-red-600" : "bg-blue-600"}`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-white">{plan.name} Plan</p>
                  <p className="text-xs text-gray-400">{plan.description}</p>
                </div>
              </div>

              {/* Features (top 4) */}
              <ul className="space-y-2.5 mb-5 pb-5 border-b border-white/10">
                {plan.features.slice(0, 4).map((f) => <FeatureItem key={f} text={f} />)}
                {plan.features.length > 4 && (
                  <li className="text-xs text-gray-500 pl-6">
                    +{plan.features.length - 4} more features included
                  </li>
                )}
              </ul>

              {/* Price breakdown */}
              <div className="space-y-2 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{plan.name} plan</span>
                  <span className="text-white">${plan.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tax</span>
                  <span className="text-gray-500 text-xs self-center">Calculated at checkout</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-3 border-t border-white/10">
                  <span className="text-white">Total today</span>
                  <span className="text-white">${plan.price.toFixed(2)}/mo</span>
                </div>
              </div>

              {/* Guarantee */}
              <div className="rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-3 flex items-start gap-2.5">
                <Shield className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                <p className="text-xs text-green-300 leading-relaxed">
                  Cancel anytime — no questions asked. Your listings stay visible until the billing period ends.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Step 3: Success ─────────────────────────────────────────────────────────
function SuccessView({ plan }: { plan: Plan }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-zinc-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">

        {/* Animated checkmark */}
        <div className="relative inline-flex items-center justify-center mb-8">
          <div className="absolute h-28 w-28 rounded-full bg-green-500/20 animate-ping" style={{ animationDuration: "2s" }} />
          <div className="relative h-24 w-24 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-green-400" />
          </div>
        </div>

        <h1 className="text-4xl font-black text-white mb-2">You're subscribed!</h1>
        <p className="text-gray-400 mb-8">
          Welcome to the{" "}
          <strong className="text-white">{plan.name} plan</strong>.{" "}
          Your account has been activated.
        </p>

        {/* What's unlocked */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left mb-8">
          <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-4">
            What's now unlocked
          </h3>
          <ul className="space-y-3">
            {plan.features.slice(0, 3).map((f) => <FeatureItem key={f} text={f} />)}
          </ul>
        </div>

        {/* CTAs */}
        <div className="space-y-3">
          <Link to="/my-listings" className="block">
            <Button className="w-full h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-base">
              Go to My Garage
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/Browse" className="block">
            <Button variant="ghost" className="w-full h-11 rounded-xl text-gray-400 hover:text-white hover:bg-white/10">
              Browse Motorcycles
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}

// ── Root component ──────────────────────────────────────────────────────────
export default function Subscribe() {
  const authUser = getStoredUser();
  const [selected, setSelected] = useState<PlanId>("user");
  const [step, setStep] = useState<Step>("plans");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nameOnCard, setNameOnCard] = useState(
    authUser?.full_name ??
    `${authUser?.firstName ?? ""} ${authUser?.lastName ?? ""}`.trim()
  );

  const selectedPlan = PLANS.find((p) => p.id === selected)!;

  const handleSubscribe = async () => {
    setError("");
    setLoading(true);
    try {
      await API.post("/api/subscription", {
        plan: selected,
        email: authUser?.email,
        nameOnCard,
        // paymentMethodId: "<from Stripe.js once integrated>",
      });
      setStep("success");
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

  if (step === "success") return <SuccessView plan={selectedPlan} />;

  if (step === "checkout") {
    return (
      <CheckoutView
        plan={selectedPlan}
        authUser={authUser}
        nameOnCard={nameOnCard}
        setNameOnCard={setNameOnCard}
        onBack={() => { setError(""); setStep("plans"); }}
        onConfirm={handleSubscribe}
        loading={loading}
        error={error}
      />
    );
  }

  return (
    <PlansView
      selected={selected}
      setSelected={setSelected}
      onContinue={() => setStep("checkout")}
    />
  );
}
