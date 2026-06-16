import { FormEvent, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Camera, CheckCircle2, ChevronLeft, ChevronRight, Loader2, X, AlertTriangle, Clock } from "lucide-react";
import { Button } from "../Components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Components/ui/select";
import { getStoredToken, getStoredUser, canCreateListing, maxPhotosForUser } from "../utils/auth";
import type { AuthUser } from "../utils/auth";
import { registerIndividual } from "../services/registerService";
import { login } from "../services/authService";
import API from "../api";

const STEPS = ["Details", "Price", "Description", "Contact", "Photos"];

const makeOptions = [
  "Aprilia", "Benelli", "Beta", "BMW", "Can-Am", "CFMoto", "Ducati",
  "Harley-Davidson", "Honda", "Husqvarna", "Indian", "Kawasaki", "KTM",
  "Moto Guzzi", "Royal Enfield", "Suzuki", "Triumph", "Yamaha", "Zero",
] as const;

const modelsByMake: Record<string, string[]> = {
  "Aprilia":         ["RS 660", "Tuono 660", "RSV4", "Tuono V4", "Dorsoduro 900", "Shiver 900"],
  "Benelli":         ["TRK 502", "Leoncino 500", "752S", "302R", "TNT 600"],
  "Beta":            ["RR 125", "RR 250", "RR 300", "RR 350", "RR 430", "RR 480", "Xtrainer 300"],
  "BMW":             ["R 1250 GS", "R 1250 RT", "S 1000 RR", "S 1000 XR", "F 900 R", "F 900 XR", "F 850 GS", "G 310 R", "G 310 GS", "R nineT", "M 1000 RR", "K 1600 GT"],
  "Can-Am":          ["Ryker 600", "Ryker 900", "Spyder F3", "Spyder F3-S", "Spyder RT"],
  "CFMoto":          ["300NK", "400NK", "650NK", "650MT", "700CL-X", "800MT"],
  "Ducati":          ["Panigale V4", "Panigale V2", "Monster", "Multistrada V4", "Diavel V4", "Scrambler Icon", "SuperSport 950", "Hypermotard 950", "DesertX", "Streetfighter V4"],
  "Harley-Davidson": ["Street Glide", "Road King", "Road Glide", "Sportster S", "Iron 883", "Fat Boy", "Softail Standard", "Street Bob", "Low Rider S", "Pan America 1250", "Nightster", "Ultra Limited"],
  "Honda":           ["CBR600RR", "CBR1000RR-R", "CB500F", "CB650R", "CB1000R", "Africa Twin", "Gold Wing", "Rebel 500", "Rebel 1100", "NC750X", "CRF300L", "Shadow Phantom"],
  "Husqvarna":       ["Vitpilen 401", "Svartpilen 401", "Norden 901", "FC 250", "FC 350", "FC 450", "TC 250"],
  "Indian":          ["Scout", "Scout Bobber", "Chief", "Chief Bobber", "Challenger", "Pursuit", "Roadmaster", "Springfield", "FTR 1200"],
  "Kawasaki":        ["Ninja 400", "Ninja 650", "Ninja ZX-6R", "Ninja ZX-10R", "Z400", "Z650", "Z900", "Versys 650", "Versys 1000", "KLR 650", "Vulcan 900", "Z125 Pro"],
  "KTM":             ["Duke 390", "Duke 790", "Duke 890", "Duke 1290 R", "RC 390", "Adventure 390", "Adventure 790", "Adventure 890", "Adventure 1290 S", "1290 Super Duke R"],
  "Moto Guzzi":      ["V7 Stone", "V7 Special", "V9 Bobber", "V9 Roamer", "V85 TT", "California 1400"],
  "Royal Enfield":   ["Bullet 350", "Classic 350", "Meteor 350", "Himalayan", "Interceptor 650", "Continental GT 650", "Hunter 350"],
  "Suzuki":          ["GSX-R600", "GSX-R750", "GSX-R1000", "GSX-S750", "GSX-S1000", "SV650", "V-Strom 650", "V-Strom 1050", "Hayabusa", "Boulevard M109R", "DR-Z400S"],
  "Triumph":         ["Street Triple R", "Street Triple RS", "Speed Triple 1200", "Tiger 900", "Tiger 1200", "Bonneville T100", "Bonneville T120", "Scrambler 900", "Scrambler 1200", "Rocket 3 R", "Trident 660"],
  "Yamaha":          ["YZF-R1", "YZF-R3", "YZF-R7", "MT-03", "MT-07", "MT-09", "MT-10", "Tenere 700", "Tracer 9", "VMAX", "V-Star 950", "Bolt"],
  "Zero":            ["SR/F", "SR/S", "FXE", "DSR/X", "S", "DS", "FX"],
};

const categoryOptions = ["sport", "cruiser", "touring", "adventure", "dirt", "standard", "scooter"] as const;
const conditionOptions = ["new", "excellent", "good", "fair", "poor"] as const;
const fuelOptions = ["gasoline", "electric", "hybrid"] as const;

type SellFormState = {
  make: string; model: string; year: string; category: string;
  condition: string; fuelType: string; engineSize: string;
  color: string; vin: string; price: string; mileage: string;
  location: string; title: string; description: string;
  sellerName: string; contactEmail: string; contactPhone: string;
};

const initialForm: SellFormState = {
  make: "", model: "", year: "", category: "", condition: "",
  fuelType: "", engineSize: "", color: "", vin: "",
  price: "", mileage: "", location: "",
  title: "", description: "",
  sellerName: "", contactEmail: "", contactPhone: "",
};

const fmtLabel = (v: string) => v.charAt(0).toUpperCase() + v.slice(1);
const isValidVin   = (v: string) => /^[A-HJ-NPR-Z0-9]{17}$/i.test(v);
const isValidPhone = (v: string) => /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,19}$/.test(v);
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// ── Reusable field wrapper ────────────────────────────────────────────────────
function Field({
  label, required, error, children, className,
}: {
  label: string; required?: boolean; error?: string; children: React.ReactNode; className?: string;
}) {
  return (
    <div className={className}>
      <div className={`group relative rounded-2xl border-2 bg-white shadow-sm transition-all focus-within:shadow-md ${error ? "border-red-400" : "border-gray-200 focus-within:border-red-500"}`}>
        <label className={`absolute left-4 top-3 text-[11px] font-bold tracking-wide transition-colors ${error ? "text-red-500" : "text-gray-400 group-focus-within:text-red-600"}`}>
          {label}{required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
        <div className="px-4 pb-3.5 pt-7">
          {children}
        </div>
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}

// Base input styling — no border/bg since Field wrapper handles it
const inputCls = "w-full border-0 bg-transparent p-0 text-[15px] font-medium text-gray-900 outline-none placeholder-transparent focus:ring-0";
const selectTriggerCls = "h-auto border-0 bg-transparent p-0 text-[15px] font-medium text-gray-900 shadow-none focus:ring-0 focus:ring-offset-0 [&>span]:truncate";

export default function Sell() {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => getStoredUser());

  const isLoggedIn = Boolean(getStoredToken());

  // Redirect unauthenticated users to login, returning here after sign-in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login?returnTo=/Sell", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  // null = unlimited (dealer plan); 0 = not logged in
  const photoLimit = isLoggedIn ? maxPhotosForUser(authUser) : 0;
  const maxPhotos  = photoLimit ?? 999; // unlimited stored as 999 internally
  const isUnlimited = isLoggedIn && photoLimit === null;
  // Trial expiry check (subscription gate — separate from photo cap)
  const trialExpired = isLoggedIn && authUser !== null && !canCreateListing(authUser);

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<SellFormState>(initialForm);
  const [vinError, setVinError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [publishError, setPublishError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalEmail, setModalEmail] = useState("");
  const [modalPassword, setModalPassword] = useState("");
  const [modalError, setModalError] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  const set = (field: keyof SellFormState, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleFilesSelected = (files: FileList | null) => {
    if (!files) return;
    const incoming = Array.from(files).slice(0, maxPhotos - photos.length);
    setPhotos((p) => [...p, ...incoming]);
    setPreviews((p) => [...p, ...incoming.map((f) => URL.createObjectURL(f))]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePhoto = (i: number) => {
    URL.revokeObjectURL(previews[i]);
    setPhotos((p) => p.filter((_, j) => j !== i));
    setPreviews((p) => p.filter((_, j) => j !== i));
  };

  const publishListing = async () => {
    setPublishError("");
    try {
      await API.post("/api/listings", {
        make:         form.make,
        model:        form.model,
        year:         Number(form.year),
        category:     form.category,
        condition:    form.condition,
        fuelType:     form.fuelType,
        engineSize:   form.engineSize ? Number(form.engineSize) : null,
        color:        form.color || null,
        vin:          form.vin || null,
        price:        Number(form.price),
        mileage:      form.mileage ? Number(form.mileage) : null,
        location:     form.location || null,
        title:        form.title,
        description:  form.description || null,
        sellerName:   form.sellerName,
        contactEmail: form.contactEmail,
        contactPhone: form.contactPhone || null,
      });
      setIsSubmitted(true);
      setShowModal(false);
    } catch (err: any) {
      if (err?.response?.status === 402 && err?.response?.data?.code === "TRIAL_EXPIRED") {
        setPublishError("Your free trial has ended. Subscribe to continue listing.");
        setAuthUser(getStoredUser()); // re-read so the expired wall renders
        return;
      }
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.title ||
        err?.message ||
        "Failed to publish listing. Please try again.";
      setPublishError(msg);
    }
  };

  const handlePublish = async () => {
    if (getStoredToken()) { await publishListing(); }
    else { setModalEmail(form.contactEmail); setModalError(""); setShowModal(true); }
  };

  const handleModalPublish = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setModalError(""); setModalLoading(true);
    const parts = form.sellerName.trim().split(" ");
    try {
      await registerIndividual({ firstName: parts[0] || "Seller", lastName: parts.slice(1).join(" ") || ".", email: modalEmail, password: modalPassword });
      await login({ userNameOrEmail: modalEmail, password: modalPassword });
      setAuthUser(getStoredUser()); // refresh trial data before publishing
      await publishListing();
    } catch (err: any) {
      setModalError(err?.response?.data?.message || err?.response?.data?.title || err?.message || "Registration failed.");
    } finally { setModalLoading(false); }
  };

  const canAdvance = () => {
    if (step === 0) return form.make && form.model && form.year && form.category && form.condition && form.fuelType && !vinError;
    if (step === 1) return form.price && form.mileage && !phoneError;
    if (step === 2) return form.title && form.description.trim();
    if (step === 3) return form.sellerName && form.contactEmail && !emailError && isValidEmail(form.contactEmail);
    return true;
  };

  // ── Step content ─────────────────────────────────────────────────────────────

  const renderDetails = () => (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Make" required>
        <Select value={form.make} onValueChange={(v) => { set("make", v); set("model", ""); }}>
          <SelectTrigger className={selectTriggerCls}><SelectValue /></SelectTrigger>
          <SelectContent>{makeOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
        </Select>
      </Field>
      <Field label="Model" required>
        <Select value={form.model} onValueChange={(v) => set("model", v)} disabled={!form.make}>
          <SelectTrigger className={selectTriggerCls}><SelectValue /></SelectTrigger>
          <SelectContent>
            {(modelsByMake[form.make] ?? []).map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Year" required>
        <input className={inputCls} type="number" min="1900" max="2100" value={form.year} onChange={(e) => set("year", e.target.value)} />
      </Field>
      <Field label="Category" required>
        <Select value={form.category} onValueChange={(v) => set("category", v)}>
          <SelectTrigger className={selectTriggerCls}><SelectValue /></SelectTrigger>
          <SelectContent>{categoryOptions.map((o) => <SelectItem key={o} value={o}>{fmtLabel(o)}</SelectItem>)}</SelectContent>
        </Select>
      </Field>
      <Field label="Condition" required>
        <Select value={form.condition} onValueChange={(v) => set("condition", v)}>
          <SelectTrigger className={selectTriggerCls}><SelectValue /></SelectTrigger>
          <SelectContent>{conditionOptions.map((o) => <SelectItem key={o} value={o}>{fmtLabel(o)}</SelectItem>)}</SelectContent>
        </Select>
      </Field>
      <Field label="Fuel type" required>
        <Select value={form.fuelType} onValueChange={(v) => set("fuelType", v)}>
          <SelectTrigger className={selectTriggerCls}><SelectValue /></SelectTrigger>
          <SelectContent>{fuelOptions.map((o) => <SelectItem key={o} value={o}>{fmtLabel(o)}</SelectItem>)}</SelectContent>
        </Select>
      </Field>
      <Field label="Engine size (cc)" required>
        <input className={inputCls} type="number" min="0" value={form.engineSize} onChange={(e) => set("engineSize", e.target.value)} />
      </Field>
      <Field label="Color" required>
        <input className={inputCls} value={form.color} onChange={(e) => set("color", e.target.value)} />
      </Field>
      <Field label="VIN number" required error={vinError} className="sm:col-span-2">
        <input
          className={`${inputCls} font-mono tracking-widest`}
          maxLength={17}
          value={form.vin}
          onChange={(e) => {
            const val = e.target.value.toUpperCase();
            set("vin", val);
            setVinError(val.length > 0 && !isValidVin(val) ? "Invalid VIN — must be 17 characters, no I, O, or Q" : "");
          }}
        />
      </Field>
    </div>
  );

  const renderPrice = () => (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Price ($)" required>
        <input className={inputCls} type="number" min="0" value={form.price} onChange={(e) => set("price", e.target.value)} />
      </Field>
      <Field label="Mileage (mi)" required>
        <input className={inputCls} type="number" min="0" value={form.mileage} onChange={(e) => set("mileage", e.target.value)} />
      </Field>
      <Field label="Location" className="sm:col-span-2">
        <input className={inputCls} value={form.location} onChange={(e) => set("location", e.target.value)} />
      </Field>
    </div>
  );

  const renderDescription = () => (
    <div className="space-y-4">
      <Field label="Listing title" required>
        <input className={inputCls} value={form.title} onChange={(e) => set("title", e.target.value)} />
      </Field>
      <Field label="Description" required>
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          maxLength={7000}
          rows={8}
          className="w-full resize-none border-0 bg-transparent p-0 text-sm text-gray-900 outline-none focus:ring-0"
        />
        <p className="mt-1 text-right text-xs text-gray-400">{form.description.length} / 7000</p>
      </Field>
    </div>
  );

  const renderContact = () => (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Seller name" required>
        <input className={inputCls} value={form.sellerName} onChange={(e) => set("sellerName", e.target.value)} />
      </Field>
      <Field label="Contact email" required error={emailError}>
        <input
          className={inputCls}
          type="email"
          value={form.contactEmail}
          onChange={(e) => {
            const val = e.target.value;
            set("contactEmail", val);
            setEmailError(val.length > 0 && !isValidEmail(val) ? "Enter a valid email address" : "");
          }}
        />
      </Field>
      <Field label="Contact phone" error={phoneError} className="sm:col-span-2">
        <input
          className={inputCls}
          value={form.contactPhone}
          onChange={(e) => {
            const val = e.target.value;
            set("contactPhone", val);
            setPhoneError(val.length > 0 && !isValidPhone(val) ? "Invalid phone — digits, spaces, +, -, ( ) only" : "");
          }}
        />
      </Field>
    </div>
  );

  const renderPhotos = () => (
    <div className="space-y-4">
      {!isLoggedIn && (
        <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          <Clock className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <strong>Sign in to add photos.</strong>{" "}
            Photo uploads are only available to registered users.
          </span>
        </div>
      )}
      {!isSubmitted && <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFilesSelected(e.target.files)} />}
      <div className="grid grid-cols-5 gap-3">
        {previews.map((src, i) => (
          <div key={i} className="relative aspect-square">
            <img src={src} alt={`Photo ${i + 1}`} className="h-full w-full rounded-xl object-cover border border-gray-200" />
            {i === 0 && <span className="absolute bottom-1 left-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">Main</span>}
            <button type="button" onClick={() => removePhoto(i)} className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-white hover:bg-red-600">
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        {!isSubmitted && isLoggedIn && photos.length < maxPhotos && (
          <button type="button" onClick={() => fileInputRef.current?.click()} className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-red-400 hover:text-red-500 transition-colors">
            <Camera className="h-5 w-5" />
            <span className="text-[10px] font-medium">Add</span>
          </button>
        )}
      </div>
      <p className="text-xs text-gray-400">
        {photos.length === 0
          ? `Upload up to ${isUnlimited ? "unlimited" : maxPhotos} photos. The first will be the main listing image.`
          : `${photos.length}${isUnlimited ? "" : ` of ${maxPhotos}`} photos added.`}
      </p>
      {isSubmitted && (
        <div className="flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Your listing has been published successfully!</span>
        </div>
      )}
      {publishError && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{publishError}</p>
      )}
    </div>
  );

  const stepContent = [renderDetails, renderPrice, renderDescription, renderContact, renderPhotos];

  // Trial-expired wall — shown instead of the whole form
  if (trialExpired) {
    return (
      <div className="min-h-[calc(100vh-6rem)] bg-gradient-to-br from-slate-950 via-gray-900 to-zinc-900 flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">Free Trial Ended</h2>
          <p className="mb-6 text-sm text-gray-500">
            Your 1-month free trial has expired. Subscribe to keep creating listings and unlock unlimited photos.
          </p>
          <Link to="/subscribe" className="block">
            <Button className="w-full rounded-xl bg-red-600 text-white hover:bg-red-700">
              View Subscription Plans
            </Button>
          </Link>
          <p className="mt-4 text-xs text-gray-400">
            Need help? Contact <a href="mailto:support@mototrade.com" className="text-red-600 hover:underline">support@mototrade.com</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-gradient-to-br from-slate-950 via-gray-900 to-zinc-900 py-10">
      <div className="mx-auto max-w-2xl px-4">

        {/* Progress stepper */}
        <div className="mb-8 flex items-start">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                {i > 0 && <div className={`h-px flex-1 transition-colors ${i <= step ? "bg-red-500" : "bg-gray-700"}`} />}
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors ${
                  i < step ? "border-red-500 bg-red-500 text-white"
                  : i === step ? "border-red-500 bg-white text-red-600"
                  : "border-gray-600 bg-transparent text-gray-500"
                }`}>
                  {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </div>
                {i < STEPS.length - 1 && <div className={`h-px flex-1 transition-colors ${i < step ? "bg-red-500" : "bg-gray-700"}`} />}
              </div>
              <span className={`mt-2 text-xs font-medium ${i === step ? "text-white" : "text-gray-500"}`}>{label}</span>
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white p-8 shadow-2xl">
          <h2 className="mb-1 text-xl font-bold text-gray-900">{STEPS[step]}</h2>
          <p className="mb-6 text-sm text-gray-400">
            {[
            "Enter your motorcycle's basic details.",
            "Set your asking price and mileage.",
            "Write a title and description. Description is required if you add photos.",
            "How should buyers reach you?",
            isLoggedIn
              ? `Add up to ${isUnlimited ? "unlimited" : maxPhotos} photos. First photo is the main image.`
              : "Sign in to add photos.",
          ][step]}
          </p>

          {stepContent[step]()}

          {/* Nav buttons */}
          {isSubmitted ? (
            <div className="mt-8 flex justify-center">
              <Button type="button" onClick={() => navigate("/my-listings")} className="rounded-xl bg-red-600 text-white hover:bg-red-700 flex items-center gap-2">
                View My Listings <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="mt-8 flex items-center justify-between">
              <Button variant="outline" type="button" onClick={() => setStep((s) => s - 1)} disabled={step === 0} className="flex items-center gap-1 rounded-xl border-gray-300">
                <ChevronLeft className="h-4 w-4" /> Back
              </Button>
              {step < STEPS.length - 1 ? (
                <Button type="button" onClick={() => setStep((s) => s + 1)} disabled={!canAdvance()} className="flex items-center gap-1 rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="button" onClick={handlePublish} className="rounded-xl bg-red-600 text-white hover:bg-red-700">
                  Publish Listing
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Publish-gate modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
            <button type="button" onClick={() => setShowModal(false)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
            <h2 className="mb-1 text-xl font-bold text-gray-900">Almost done!</h2>
            <p className="mb-6 text-sm text-gray-500">Create a free account to publish your listing.</p>
            <form onSubmit={handleModalPublish} className="space-y-4">
              <Field label="Email" required>
                <input className={inputCls} type="email" value={modalEmail} onChange={(e) => setModalEmail(e.target.value)} required autoFocus />
              </Field>
              <Field label="Password" required>
                <input className={inputCls} type="password" value={modalPassword} onChange={(e) => setModalPassword(e.target.value)} required />
              </Field>
              {modalError && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{modalError}</p>}
              <Button type="submit" disabled={modalLoading} className="w-full rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-60">
                {modalLoading ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Creating account…</span> : "Create Account & Publish"}
              </Button>
              <p className="text-center text-xs text-gray-400">Already have an account? <a href="/login" className="text-red-600 hover:underline">Sign in</a></p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
