import { FormEvent, useState } from "react";
import { Loader2, AlertCircle, TrendingUp, Bike, CalendarDays, Gauge, Sparkles, ArrowRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Components/ui/select";
import { MAKE_OPTIONS, MODELS_BY_MAKE } from "../constants/motorcycleOptions";
import API from "../api";

const HERO_IMAGE = "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1600";

const CONDITION_OPTIONS = ["Excellent", "Good", "Fair", "Poor"] as const;

type TradeInFormState = {
  make: string;
  model: string;
  year: string;
  mileage: string;
  condition: string;
};

const initialForm: TradeInFormState = { make: "", model: "", year: "", mileage: "", condition: "" };

type TradeInEstimate = {
  lowEstimate: number;
  highEstimate: number;
  averageEstimate: number;
  comparableCount: number;
};

// ── Reusable field wrapper — icon-labelled, glassy focus ring ───────────────
function Field({
  label, icon, required, children, className,
}: {
  label: string; icon: React.ReactNode; required?: boolean; children: React.ReactNode; className?: string;
}) {
  return (
    <div className={className}>
      <div className="group relative rounded-2xl border border-white/10 bg-white/5 transition-all focus-within:border-red-500/60 focus-within:bg-white/10 focus-within:ring-4 focus-within:ring-red-500/10">
        <label className="flex items-center gap-1.5 px-3.5 pt-2.5 text-[11px] font-bold uppercase tracking-wide text-gray-500 group-focus-within:text-red-400">
          <span className="text-gray-500 group-focus-within:text-red-400">{icon}</span>
          {label}{required && <span className="text-red-500">*</span>}
        </label>
        <div className="px-3.5 pb-2.5 pt-1">{children}</div>
      </div>
    </div>
  );
}

const inputCls = "w-full border-0 bg-transparent p-0 text-[15px] font-semibold text-gray-100 outline-none placeholder-transparent focus:ring-0";
const selectTriggerCls = "h-auto border-0 bg-transparent p-0 text-[15px] font-semibold text-gray-100 shadow-none focus:ring-0 focus:ring-offset-0 [&>span]:truncate";
const iconCls = "h-3.5 w-3.5";

export default function TradeInValue() {
  const [form, setForm] = useState<TradeInFormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [estimate, setEstimate] = useState<TradeInEstimate | null>(null);

  const set = (field: keyof TradeInFormState, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const isValid = form.make && form.model && form.year && form.mileage && form.condition;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    setError("");
    setEstimate(null);
    try {
      const { data } = await API.post<TradeInEstimate>("/api/tradein/estimate", {
        year: Number(form.year),
        make: form.make,
        model: form.model,
        mileage: Number(form.mileage),
        condition: form.condition,
      });
      setEstimate(data);
    } catch (err: any) {
      setError(err?.response?.data?.description || err?.response?.data?.message || err?.message || "Failed to calculate a trade-in estimate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark min-h-screen bg-slate-800">
      {/* Hero */}
      <div className="relative min-h-[420px] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={HERO_IMAGE} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-slate-800" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[420px] max-w-2xl flex-col justify-end px-4 pb-16 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
            <TrendingUp className="h-3.5 w-3.5 text-red-400" />
            Instant Market Estimate
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">
            What's your bike <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">really worth?</span>
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-400">
            A few details, one instant estimate from real marketplace listings.
          </p>
        </div>
      </div>

      {/* Form card — overlaps the hero */}
      <div className="relative z-10 mx-auto -mt-10 max-w-2xl px-4 pb-10 sm:px-6 lg:px-8">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-3xl border border-white/10 bg-slate-700/60 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Make" icon={<Bike className={iconCls} />} required>
              <Select value={form.make} onValueChange={(v) => { set("make", v); set("model", ""); }}>
                <SelectTrigger className={selectTriggerCls}><SelectValue placeholder="Select make" /></SelectTrigger>
                <SelectContent>{MAKE_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Model" icon={<Bike className={iconCls} />} required>
              <Select value={form.model} onValueChange={(v) => set("model", v)} disabled={!form.make}>
                <SelectTrigger className={selectTriggerCls}><SelectValue placeholder="Select model" /></SelectTrigger>
                <SelectContent>
                  {(MODELS_BY_MAKE[form.make] ?? []).map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Year" icon={<CalendarDays className={iconCls} />} required>
              <input
                className={inputCls}
                type="number"
                min="1900"
                max="2100"
                placeholder="e.g. 2020"
                value={form.year}
                onChange={(e) => set("year", e.target.value)}
              />
            </Field>
            <Field label="Mileage (mi)" icon={<Gauge className={iconCls} />} required>
              <input
                className={inputCls}
                type="number"
                min="0"
                placeholder="e.g. 8,500"
                value={form.mileage}
                onChange={(e) => set("mileage", e.target.value)}
              />
            </Field>
            <Field label="Condition" icon={<Sparkles className={iconCls} />} required className="sm:col-span-2">
              <Select value={form.condition} onValueChange={(v) => set("condition", v)}>
                <SelectTrigger className={selectTriggerCls}><SelectValue placeholder="Select condition" /></SelectTrigger>
                <SelectContent>{CONDITION_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-400">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!isValid || loading}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/25 transition-all hover:shadow-xl hover:shadow-red-500/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Calculating…</>
            ) : (
              <>Get My Trade-In Value <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>
            )}
          </button>
        </form>

        {estimate && (
          <div className="animate-in fade-in slide-in-from-bottom-4 mt-4 overflow-hidden rounded-3xl border border-white/10 bg-slate-700/60 shadow-xl shadow-black/30 backdrop-blur-xl duration-500">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-100">Estimated Trade-In Value</p>
              <p className="mt-1 text-3xl font-extrabold text-white">
                ${estimate.lowEstimate.toLocaleString()} – ${estimate.highEstimate.toLocaleString()}
              </p>
            </div>
            <div className="space-y-2 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="w-14 shrink-0 text-xs font-medium text-gray-500">Low</span>
                <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                  <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500" style={{ width: "100%" }} />
                  <div
                    className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-slate-700 bg-teal-400 shadow"
                    style={{
                      left: `${Math.min(100, Math.max(0, ((estimate.averageEstimate - estimate.lowEstimate) / Math.max(1, estimate.highEstimate - estimate.lowEstimate)) * 100))}%`,
                    }}
                  />
                </div>
                <span className="w-14 shrink-0 text-right text-xs font-medium text-gray-500">High</span>
              </div>
              <p className="text-center text-xs text-gray-500">
                Based on <span className="font-semibold text-gray-300">{estimate.comparableCount}</span> comparable listing{estimate.comparableCount !== 1 ? "s" : ""} in our marketplace
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
