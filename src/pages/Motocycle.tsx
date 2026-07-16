import { useEffect, useState } from "react";
import { useSearchParams, useLocation, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ShieldCheck, Loader2, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { Motorcycle } from "../Entities/Motorcycle";
import { getMotorcycleById, getMotorcycles } from "../services/MotorcycleService";
import { getStoredToken, getStoredUser, isInGracePeriod, graceDaysLeft, isListingsBlocked, isTrialActive, trialDaysLeft } from "../utils/auth";
import API from "../api";

const FALLBACK = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400";

export default function Motocycle() {
  const authUser     = getStoredUser();
  const isSubscribed = !!authUser?.hasActiveSubscription;

  const inGrace   = !isSubscribed && isInGracePeriod(authUser);
  const daysLeft  = graceDaysLeft(authUser);
  const blocked   = !isSubscribed && isListingsBlocked(authUser);
  const onTrial   = !isSubscribed && isTrialActive(authUser);
  const trialLeft = trialDaysLeft(authUser);

  const [motorcycle, setMotorcycle] = useState<Motorcycle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [similar, setSimilar] = useState<Motorcycle[]>([]);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const [vinData, setVinData] = useState<any>(null);
  const [vinLoading, setVinLoading] = useState(false);
  const [vinError, setVinError] = useState("");
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [contactSent, setContactSent] = useState(false);
  const [contactSending, setContactSending] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const [searchParams] = useSearchParams();
  const location = useLocation();
  const motorcycleId = searchParams.get("id");
  const isListing = searchParams.get("type") === "listing";

  useEffect(() => {
    if (!motorcycleId) {
      setError("Motorcycle ID is missing in the URL");
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const bike = await getMotorcycleById(motorcycleId, isListing ? "listing" : "market");
        setMotorcycle(bike);

        // Fetch similar bikes
        const { motorcycles: bikes } = await getMotorcycles({ limit: 4 });
        setSimilar(bikes.filter((b) => b.id.toString() !== motorcycleId).slice(0, 4));
      } catch (err: any) {
        console.error("Error fetching motorcycle:", err);
        setError("Failed to fetch motorcycle details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [motorcycleId]);

 if (isLoading)
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-8 border border-gray-100 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-2/3 mx-auto mb-6"></div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Image skeleton */}
        <div className="flex-1 flex justify-center">
          <div className="bg-gray-200 rounded-xl w-full max-w-md h-72"></div>
        </div>

        {/* Details skeleton */}
        <div className="flex-1 space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-5 bg-gray-300 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );


  if (error)
    return <div className="text-red-500 text-center py-10 font-semibold">{error}</div>;

  if (!motorcycle)
    return <div className="text-center py-10 text-gray-600">Motorcycle not found.</div>;
  const photos = (motorcycle.image_urls ?? []).filter(
    (url: string) => typeof url === "string" && url.trim() !== "" && url.startsWith("http") && !url.includes("youtube.com")
  );
  if (photos.length === 0) photos.push(FALLBACK);

  const checkVin = async () => {
    if (!motorcycle.vin) return;
    setVinLoading(true);
    setVinError("");
    setVinData(null);
    try {
      const { data } = await API.get(`/api/vin/${motorcycle.vin}`);
      setVinData(data);
    } catch (err: any) {
      setVinError(err?.response?.data?.message || err?.message || "Failed to check VIN.");
    } finally {
      setVinLoading(false);
    }
  };

  const goTo = (i: number) => {
    setFading(true);
    setTimeout(() => { setPhotoIndex(i); setFading(false); }, 120);
  };
  const prev = () => goTo((photoIndex - 1 + photos.length) % photos.length);
  const next = () => goTo((photoIndex + 1) % photos.length);
  return (
    <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back button */}
      <button
        onClick={() => window.history.back()}
        className="inline-flex items-center gap-2 mb-6 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:from-red-600 hover:to-red-700 hover:shadow-lg active:scale-95 transition-all duration-200"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to listings
      </button>

      {/* Trial / grace period banner â€” only on user's own listings */}
      {isListing && (blocked || inGrace || onTrial) && (
        <div className={`mb-6 flex items-center justify-between gap-4 rounded-2xl px-5 py-3.5 text-sm font-medium ${
          blocked ? "bg-red-50 border border-red-200 text-red-700"
          : inGrace ? "bg-amber-50 border border-amber-200 text-amber-700"
          : "bg-blue-50 border border-blue-200 text-blue-700"
        }`}>
          <span>
            {blocked
              ? "Your listing is currently paused â€” subscribe to reactivate it."
              : inGrace
              ? `Grace period: ${daysLeft} day${daysLeft !== 1 ? "s" : ""} left before this listing is paused.`
              : `Free trial: ${trialLeft} day${trialLeft !== 1 ? "s" : ""} remaining on your account.`}
          </span>
          {(blocked || inGrace) && (
            <Link
              to="/my-listings"
              className="shrink-0 rounded-xl bg-white px-3 py-1.5 text-xs font-semibold shadow-sm hover:shadow transition-shadow border border-current"
            >
              {blocked ? "Subscribe" : "View My Garage"}
            </Link>
          )}
        </div>
      )}

      {/* Title & Price */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">{motorcycle.title}</h1>
        <div className="text-right">
          <p className="text-3xl font-extrabold text-green-600">${motorcycle.price.toLocaleString()}</p>
          {motorcycle.mileage && (
            <p className="text-gray-600">{motorcycle.mileage.toLocaleString()} miles</p>
          )}
        </div>
      </div>

      {/* Image and Info */}
       <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-3">
          {/* Main photo with arrows */}
          <div className="relative rounded-xl overflow-hidden shadow-md border border-gray-200 h-[400px] bg-gray-100 group">
            <img
              src={photos[photoIndex]}
              alt={motorcycle.title}
              className="w-full h-full object-cover"
              style={{ opacity: fading ? 0 : 1, transition: "opacity 0.12s ease" }}
              onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
            />

            {photos.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                <div className="absolute bottom-3 right-3 z-10 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
                  {photoIndex + 1} / {photos.length}
                </div>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {photos.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {photos.map((src: string, i: number) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`flex-shrink-0 h-16 w-24 rounded-lg overflow-hidden border-2 transition-colors ${i === photoIndex ? "border-red-500" : "border-transparent opacity-60 hover:opacity-100"}`}
                >
                  <img src={src} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Motorcycle Specs */}
        <div className="space-y-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Specifications</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-gray-700">
            <Detail label="Make" value={motorcycle.make} />
            <Detail label="Model" value={motorcycle.model} />
            <Detail label="Trim" value={motorcycle.description?.split("-")[0] || "N/A"} />
            <Detail label="Year" value={motorcycle.year.toString()} />
            <div className="col-span-2">
              <span className="block text-sm text-gray-500 mb-1">VIN</span>

              {motorcycle.vin ? (
                getStoredToken() ? (
                  /* Logged in â€” show full VIN + Check VIN button */
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono font-medium text-gray-800">{motorcycle.vin}</span>
                    <button
                      onClick={checkVin}
                      disabled={vinLoading}
                      className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60 transition-colors"
                    >
                      {vinLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                      {vinLoading ? "Checkingâ€¦" : "Check VIN"}
                    </button>
                  </div>
                ) : (
                  /* Not logged in â€” masked VIN with login prompt */
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-green-600 shrink-0" />
                      <span className="text-sm font-semibold text-green-700">VIN Verified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-green-600 shrink-0" />
                      <span className="font-mono font-medium text-gray-800 tracking-wider">
                        {motorcycle.vin.slice(0, 8)}{"*".repeat(motorcycle.vin.length - 8)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-green-600 shrink-0" />
                      <Link
                        to={`/login?returnTo=${encodeURIComponent(location.pathname + location.search)}`}
                        className="text-sm text-red-600 hover:underline font-medium"
                      >
                        Click to reveal full VIN (requires login)
                      </Link>
                    </div>
                  </div>
                )
              ) : (
                <span className="font-medium text-gray-500">N/A</span>
              )}

              {vinError && (
                <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {vinError}
                </div>
              )}

              {vinData && (
                <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800">
                      {vinData.isValid ? "VIN Verified" : "VIN Invalid"}
                    </span>
                    <span className="text-xs text-green-600">{vinData.errorText}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-700">
                    {vinData.make           && <VinDetail label="Make"          value={vinData.make} />}
                    {vinData.model          && <VinDetail label="Model"         value={vinData.model} />}
                    {vinData.modelYear      && <VinDetail label="Year"          value={vinData.modelYear} />}
                    {vinData.series         && <VinDetail label="Series"        value={vinData.series} />}
                    {vinData.vehicleType    && <VinDetail label="Type"          value={vinData.vehicleType} />}
                    {vinData.bodyClass      && <VinDetail label="Body"          value={vinData.bodyClass} />}
                    {vinData.fuelType       && <VinDetail label="Fuel"          value={vinData.fuelType} />}
                    {vinData.displacementCC && <VinDetail label="Displacement"  value={`${vinData.displacementCC} cc`} />}
                    {vinData.engineCylinders && <VinDetail label="Cylinders"   value={vinData.engineCylinders} />}
                    {vinData.engineBrakeHp  && <VinDetail label="Horsepower"   value={`${vinData.engineBrakeHp} hp`} />}
                    {vinData.plantCity      && <VinDetail label="Plant"         value={`${vinData.plantCity}, ${vinData.plantState}`} />}
                    {vinData.manufacturerName && <VinDetail label="Manufacturer" value={vinData.manufacturerName} />}
                  </div>
                  {vinData.additionalErrorText && (
                    <p className="text-xs text-amber-600 border-t border-green-200 pt-2">{vinData.additionalErrorText}</p>
                  )}
                </div>
              )}
            </div>
            <Detail label="Color" value={motorcycle.color || "N/A"} />
            <Detail label="Trim" value={motorcycle.trim || "N/A"} />
            <Detail label="Transmission" value={motorcycle.transmission || "N/A"} />
            <Detail label="Fuel Type" value={motorcycle.fuel_type || "Gasoline"} />
            <Detail label="Condition" value={motorcycle.condition} />
            <Detail label="MSRP" value={motorcycle.msrp ? `$${motorcycle.msrp.toLocaleString()}` : "N/A"} />
          </div>
        </div>

        {/* Engine Details */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Engine Details</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-gray-700">
            <Detail label="Engine"         value={motorcycle.engine_description || "N/A"} />
            <Detail label="Vehicle Type"   value={motorcycle.vehicle_type  || "N/A"} />
            <Detail label="Displacement"   value={motorcycle.displacement_cc ? `${motorcycle.displacement_cc} cc` : "N/A"} />
            <Detail label="Cylinders"      value={motorcycle.engine_cylinders || "N/A"} />
            <Detail label="Horsepower"     value={motorcycle.horsepower ? `${motorcycle.horsepower} hp` : "N/A"} />
            <Detail label="Engine Size"    value={motorcycle.engine_size ? `${motorcycle.engine_size} cc` : "N/A"} />
            <Detail label="Transmission"   value={motorcycle.transmission  || "N/A"} />
          </div>
        </div>
        </div>
      </div>

      {/* AI Price Negotiation Assistant */}
      {(() => {
        const daysListed = motorcycle.created_date
          ? Math.floor((Date.now() - new Date(motorcycle.created_date).getTime()) / (1000 * 60 * 60 * 24))
          : null;

        const handleAiSuggest = async () => {
          setAiLoading(true);
          setAiError("");
          setAiSuggestion("");
          try {
            const { data } = await API.post<{ suggestion?: string; message?: string }>("/api/ai/price-suggestion", {
              motorcycleId: Number(motorcycleId),
              heading: motorcycle.title,
              price: motorcycle.price,
              msrp: (motorcycle as any).msrp ?? null,
              mileage: motorcycle.mileage ?? null,
              year: motorcycle.year,
              make: motorcycle.make,
              model: motorcycle.model,
              condition: motorcycle.condition,
              color: motorcycle.color ?? null,
              daysListed,
            });
            setAiSuggestion(data.suggestion ?? data.message ?? JSON.stringify(data));
          } catch (err: any) {
            setAiError(err?.response?.data?.message || err?.message || "AI suggestion failed.");
          } finally {
            setAiLoading(false);
          }
        };

        return (
          <div className="mt-8 rounded-2xl overflow-hidden shadow-sm border border-purple-200">
            <div className="bg-gradient-to-r from-violet-600 to-purple-700 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3 text-white">
                <Sparkles className="h-5 w-5" />
                <span className="font-bold text-lg">AI Price Negotiation Assistant</span>
              </div>
              <span className="text-purple-200 text-xs">Powered by Claude</span>
            </div>

            <div className="bg-white px-6 py-5">
              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 text-center">
                  <p className="text-xs text-gray-500">Asking Price</p>
                  <p className="text-lg font-bold text-gray-900">${motorcycle.price.toLocaleString()}</p>
                </div>
                <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 text-center">
                  <p className="text-xs text-gray-500">Days Listed</p>
                  <p className="text-lg font-bold text-gray-900">{daysListed ?? "â€”"}</p>
                </div>
                <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 text-center">
                  <p className="text-xs text-gray-500">Mileage</p>
                  <p className="text-lg font-bold text-gray-900">{motorcycle.mileage ? `${motorcycle.mileage.toLocaleString()} mi` : "â€”"}</p>
                </div>
                <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 text-center">
                  <p className="text-xs text-gray-500">Condition</p>
                  <p className="text-lg font-bold text-gray-900 capitalize">{motorcycle.condition}</p>
                </div>
              </div>

              {!aiSuggestion && !aiLoading && !aiError && (
                <p className="text-sm text-gray-500 mb-4">
                  Claude analyses the price, mileage, days on market, and condition to suggest a fair offer you can make to the dealer.
                </p>
              )}

              {aiError && (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 mb-4">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {aiError}
                </div>
              )}

              {aiSuggestion && (
                <div className="rounded-xl border border-purple-200 bg-purple-50 px-4 py-4 text-sm text-gray-800 mb-4 whitespace-pre-wrap leading-relaxed">
                  {aiSuggestion}
                </div>
              )}

              {getStoredToken() ? (
                <button
                  onClick={handleAiSuggest}
                  disabled={aiLoading}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 px-5 py-2.5 text-sm font-semibold text-white hover:from-violet-700 hover:to-purple-800 disabled:opacity-60 transition-all"
                >
                  {aiLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Analysingâ€¦</> : <><Sparkles className="h-4 w-4" /> {aiSuggestion ? "Re-analyse" : "Get AI Offer Suggestion"}</>}
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    disabled
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-400 to-purple-500 px-5 py-2.5 text-sm font-semibold text-white opacity-50 cursor-not-allowed"
                  >
                    <Sparkles className="h-4 w-4" /> Get AI Offer Suggestion
                  </button>
                  <Link to={`/login?returnTo=${encodeURIComponent(location.pathname + location.search)}`} className="text-sm text-violet-600 hover:underline font-medium">
                    Sign in to use
                  </Link>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Dealer Info */}
      <div className="mt-10 grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Dealer Information</h2>
          <p className="font-bold text-gray-900">{motorcycle.seller_name}</p>
          <p className="text-gray-700">{motorcycle.location}</p>
          <p className="text-gray-700">{(motorcycle as any).dealer?.street}</p>
          <p className="text-gray-700">
            {(motorcycle as any).dealer?.city}, {(motorcycle as any).dealer?.state}{" "}
            {(motorcycle as any).dealer?.zip}
          </p>
          <div className="flex flex-col gap-1 mt-2">
            {motorcycle.dealer_website && (
              <a href={`https://${motorcycle.dealer_website}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm">
                Visit Dealer Website
              </a>
            )}
            {motorcycle.vdp_url && (
              <a href={motorcycle.vdp_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm">
                View Original Listing
              </a>
            )}
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Contact Dealer</h2>

          {contactSent ? (
            <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Your message has been sent! The dealer will contact you soon.</span>
            </div>
          ) : (
            <form
              className="space-y-3"
              onSubmit={async (e) => {
                e.preventDefault();
                setContactSending(true);
                try {
                  await API.post("/api/contact", {
                    motorcycleId: Number(motorcycleId),
                    source: motorcycle.source ?? "market",
                    senderName: contactForm.name,
                    senderEmail: contactForm.email,
                    senderPhone: contactForm.phone || null,
                    message: contactForm.message,
                  });
                  setContactSent(true);
                } catch (err: any) {
                  alert(err?.response?.data?.message || err?.message || "Failed to send message.");
                } finally {
                  setContactSending(false);
                }
              }}
            >
              <input
                type="text"
                placeholder="Full Name *"
                value={contactForm.name}
                onChange={(e) => setContactForm((f) => ({ ...f, name: e.target.value }))}
                required
                className="border p-2 rounded-md w-full text-sm"
              />
              <input
                type="email"
                placeholder="Email *"
                value={contactForm.email}
                onChange={(e) => setContactForm((f) => ({ ...f, email: e.target.value }))}
                required
                className="border p-2 rounded-md w-full text-sm"
              />
              <input
                type="tel"
                placeholder="Phone (optional)"
                value={contactForm.phone}
                onChange={(e) => setContactForm((f) => ({ ...f, phone: e.target.value }))}
                className="border p-2 rounded-md w-full text-sm"
              />
              <textarea
                rows={3}
                placeholder={`I'm interested in the ${motorcycle.title}`}
                value={contactForm.message}
                onChange={(e) => setContactForm((f) => ({ ...f, message: e.target.value }))}
                className="border p-2 rounded-md w-full text-sm"
              />
              <button
                type="submit"
                disabled={contactSending}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 w-full transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {contactSending ? <><Loader2 className="h-4 w-4 animate-spin" /> Sendingâ€¦</> : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Similar Bikes */}
      {similar.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Similar Motorcycles</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similar.map((bike) => (
              <Link
                key={bike.id}
                to={`/Motorcycle?id=${bike.id}`}
                className="block bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden border border-gray-100"
              >
                <img
                  src={bike.image || bike.image_urls[0]}
                  alt={bike.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800">{bike.title}</h3>
                  <p className="text-sm text-gray-600">{bike.make}</p>
                  <p className="text-green-600 font-bold mt-2">${bike.price.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

function VinDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="block text-xs text-gray-500">{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string | number | undefined }) {
  return (
    <div>
      <span className="block text-sm text-gray-500">{label}</span>
      <span className="font-medium text-gray-800">{value || "N/A"}</span>
    </div>
  );
}

