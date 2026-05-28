import { FormEvent, useRef, useMemo, useState } from "react";
import { BadgeDollarSign, Bike, Camera, CheckCircle2, FileText, Loader2, MapPin, X } from "lucide-react";
import { Button } from "../Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../Components/ui/card";
import { Input } from "../Components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Components/ui/select";
import { getStoredToken } from "../utils/auth";
import { registerIndividual } from "../services/registerService";
import { login } from "../services/authService";

const MAX_PHOTOS = 10;
const categoryOptions = ["sport", "cruiser", "touring", "adventure", "dirt", "standard", "scooter"] as const;
const conditionOptions = ["new", "excellent", "good", "fair", "poor"] as const;
const fuelOptions = ["gasoline", "electric", "hybrid"] as const;

type SellFormState = {
  title: string;
  make: string;
  model: string;
  year: string;
  category: string;
  condition: string;
  fuelType: string;
  price: string;
  mileage: string;
  engineSize: string;
  color: string;
  location: string;
  sellerName: string;
  contactEmail: string;
  contactPhone: string;
  description: string;
};

const initialForm: SellFormState = {
  title: "",
  make: "",
  model: "",
  year: "",
  category: "",
  condition: "",
  fuelType: "",
  price: "",
  mileage: "",
  engineSize: "",
  color: "",
  location: "",
  sellerName: "",
  contactEmail: "",
  contactPhone: "",
  description: "",
};

const formatLabel = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

export default function Sell() {
  const [form, setForm] = useState<SellFormState>(initialForm);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Photo state
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Publish-gate modal state
  const [showModal, setShowModal] = useState(false);
  const [modalEmail, setModalEmail] = useState("");
  const [modalPassword, setModalPassword] = useState("");
  const [modalError, setModalError] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  const completionCount = useMemo(() => {
    const values = Object.values(form);
    return values.filter((value) => value.trim().length > 0).length;
  }, [form]);

  const updateField = (field: keyof SellFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setIsSubmitted(false);
  };

  const handleFilesSelected = (files: FileList | null) => {
    if (!files) return;
    const remaining = MAX_PHOTOS - photos.length;
    const incoming = Array.from(files).slice(0, remaining);
    const newPreviews = incoming.map((f) => URL.createObjectURL(f));
    setPhotos((prev) => [...prev, ...incoming]);
    setPreviews((prev) => [...prev, ...newPreviews]);
    // reset so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePhoto = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  function publishListing() {
    // TODO: wire to backend submission endpoint (pass `photos` array)
    setIsSubmitted(true);
    setShowModal(false);
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (getStoredToken()) {
      publishListing();
    } else {
      setModalEmail(form.contactEmail);
      setModalError("");
      setShowModal(true);
    }
  };

  const handleModalPublish = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setModalError("");
    setModalLoading(true);

    const parts = form.sellerName.trim().split(" ");
    const firstName = parts[0] || "Seller";
    const lastName = parts.slice(1).join(" ") || ".";

    try {
      await registerIndividual({ firstName, lastName, email: modalEmail, password: modalPassword });
      await login({ userNameOrEmail: modalEmail, password: modalPassword });
      publishListing();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.title ||
        err?.message ||
        "Registration failed. Please try again.";
      setModalError(msg);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-gray-50 py-10">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <section className="space-y-6">
          <div className="rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-red-700 p-8 text-white shadow-xl">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-medium">
              Seller dashboard
            </span>
            <h1 className="mt-5 text-4xl font-black tracking-tight">Sell your motorcycle with the right listing details.</h1>
            <p className="mt-4 max-w-xl text-gray-200">
              Fill in your bike's details, then publish. If you don't have an account yet, we'll create one for you in seconds.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <Bike className="mb-3 h-5 w-5" />
                <p className="text-sm font-semibold">Clear bike profile</p>
                <p className="mt-1 text-sm text-gray-300">Make, model, year, and category are captured up front.</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <BadgeDollarSign className="mb-3 h-5 w-5" />
                <p className="text-sm font-semibold">Ready to price</p>
                <p className="mt-1 text-sm text-gray-300">Include price, mileage, engine size, and location.</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <FileText className="mb-3 h-5 w-5" />
                <p className="text-sm font-semibold">Buyer-friendly details</p>
                <p className="mt-1 text-sm text-gray-300">Description and contact info stay visible to interested buyers.</p>
              </div>
            </div>
          </div>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Listing preview</CardTitle>
              <CardDescription>This updates as you fill in the sell form.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {previews.length > 0 ? (
                <div className="overflow-hidden rounded-2xl border border-gray-200">
                  <img
                    src={previews[0]}
                    alt="Primary photo"
                    className="h-48 w-full object-cover"
                  />
                  {previews.length > 1 && (
                    <div className="flex gap-1 p-1">
                      {previews.slice(1).map((src, i) => (
                        <img
                          key={i}
                          src={src}
                          alt={`Photo ${i + 2}`}
                          className="h-14 w-14 rounded-lg object-cover"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-100 p-5">
                  <p className="text-xl font-bold text-gray-900">{form.title || "Your motorcycle title"}</p>
                  <p className="mt-2 text-sm text-gray-600">
                    {[form.year, form.make, form.model].filter(Boolean).join(" ") || "Year, make, and model will appear here."}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {form.category && <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">{formatLabel(form.category)}</span>}
                    {form.condition && <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white">{formatLabel(form.condition)}</span>}
                    {form.fuelType && <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">{formatLabel(form.fuelType)}</span>}
                  </div>
                </div>
              )}

              <div className="grid gap-3 text-sm text-gray-600 sm:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 p-4">
                  <p className="font-medium text-gray-900">Price</p>
                  <p className="mt-1">{form.price ? `$${Number(form.price).toLocaleString()}` : "Not set"}</p>
                </div>
                <div className="rounded-2xl border border-gray-200 p-4">
                  <p className="font-medium text-gray-900">Mileage</p>
                  <p className="mt-1">{form.mileage ? `${Number(form.mileage).toLocaleString()} miles` : "Not set"}</p>
                </div>
                <div className="rounded-2xl border border-gray-200 p-4">
                  <p className="font-medium text-gray-900">Seller</p>
                  <p className="mt-1">{form.sellerName || "Not set"}</p>
                </div>
                <div className="rounded-2xl border border-gray-200 p-4">
                  <p className="font-medium text-gray-900">Location</p>
                  <p className="mt-1">{form.location || "Not set"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle>Create listing</CardTitle>
            <CardDescription>Complete the fields below. The dropdown menus are required for structured motorcycle details.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="title">
                    Listing title
                  </label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(event) => updateField("title", event.target.value)}
                    placeholder=""
                    className="h-11 border-gray-200 bg-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="make">Make</label>
                  <Input
                    id="make"
                    value={form.make}
                    onChange={(event) => updateField("make", event.target.value)}
                    placeholder=""
                    className="h-11 border-gray-200 bg-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="model">Model</label>
                  <Input
                    id="model"
                    value={form.model}
                    onChange={(event) => updateField("model", event.target.value)}
                    placeholder=""
                    className="h-11 border-gray-200 bg-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="year">Year</label>
                  <Input
                    id="year"
                    type="number"
                    min="1900"
                    max="2100"
                    value={form.year}
                    onChange={(event) => updateField("year", event.target.value)}
                    placeholder=""
                    className="h-11 border-gray-200 bg-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <Select value={form.category} onValueChange={(value) => updateField("category", value)}>
                    <SelectTrigger className="h-11 border-gray-200 bg-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((option) => (
                        <SelectItem key={option} value={option}>{formatLabel(option)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Condition</label>
                  <Select value={form.condition} onValueChange={(value) => updateField("condition", value)}>
                    <SelectTrigger className="h-11 border-gray-200 bg-white">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditionOptions.map((option) => (
                        <SelectItem key={option} value={option}>{formatLabel(option)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Fuel type</label>
                  <Select value={form.fuelType} onValueChange={(value) => updateField("fuelType", value)}>
                    <SelectTrigger className="h-11 border-gray-200 bg-white">
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      {fuelOptions.map((option) => (
                        <SelectItem key={option} value={option}>{formatLabel(option)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="price">Price</label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(event) => updateField("price", event.target.value)}
                    placeholder=""
                    className="h-11 border-gray-200 bg-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="mileage">Mileage</label>
                  <Input
                    id="mileage"
                    type="number"
                    min="0"
                    value={form.mileage}
                    onChange={(event) => updateField("mileage", event.target.value)}
                    placeholder=""
                    className="h-11 border-gray-200 bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="engineSize">Engine size (cc)</label>
                  <Input
                    id="engineSize"
                    type="number"
                    min="0"
                    value={form.engineSize}
                    onChange={(event) => updateField("engineSize", event.target.value)}
                    placeholder=""
                    className="h-11 border-gray-200 bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="color">Color</label>
                  <Input
                    id="color"
                    value={form.color}
                    onChange={(event) => updateField("color", event.target.value)}
                    placeholder=""
                    className="h-11 border-gray-200 bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="location">Location</label>
                  <Input
                    id="location"
                    value={form.location}
                    onChange={(event) => updateField("location", event.target.value)}
                    placeholder=""
                    className="h-11 border-gray-200 bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="sellerName">Seller name</label>
                  <Input
                    id="sellerName"
                    value={form.sellerName}
                    onChange={(event) => updateField("sellerName", event.target.value)}
                    placeholder=""
                    className="h-11 border-gray-200 bg-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="contactEmail">Contact email</label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={form.contactEmail}
                    onChange={(event) => updateField("contactEmail", event.target.value)}
                    placeholder=""
                    className="h-11 border-gray-200 bg-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="contactPhone">Contact phone</label>
                  <Input
                    id="contactPhone"
                    value={form.contactPhone}
                    onChange={(event) => updateField("contactPhone", event.target.value)}
                    placeholder=""
                    className="h-11 border-gray-200 bg-white"
                  />
                </div>

                {/* Photo upload — up to 10 photos */}
                <div className="space-y-3 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Photos
                    </label>
                    <span className="text-xs text-gray-400">{photos.length} / {MAX_PHOTOS}</span>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFilesSelected(e.target.files)}
                  />

                  <div className="grid grid-cols-5 gap-2">
                    {previews.map((src, index) => (
                      <div key={index} className="relative aspect-square">
                        <img
                          src={src}
                          alt={`Photo ${index + 1}`}
                          className="h-full w-full rounded-xl object-cover border border-gray-200"
                        />
                        {index === 0 && (
                          <span className="absolute bottom-1 left-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                            Main
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-white hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}

                    {photos.length < MAX_PHOTOS && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-red-400 hover:text-red-500 transition-colors"
                      >
                        <Camera className="h-5 w-5" />
                        <span className="text-[10px] font-medium">Add</span>
                      </button>
                    )}
                  </div>

                  {photos.length === 0 && (
                    <p className="text-xs text-gray-400">Upload up to 10 photos. The first photo will be used as the main listing image.</p>
                  )}
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    value={form.description}
                    onChange={(event) => updateField("description", event.target.value)}
                    placeholder=""
                    className="min-h-[140px] w-full rounded-md border border-gray-200 bg-white px-3 py-3 text-sm shadow-sm outline-none transition-colors placeholder:text-gray-400 focus:ring-1 focus:ring-gray-900"
                  />
                </div>
              </div>

              {isSubmitted && (
                <div className="flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>Your listing has been published successfully!</span>
                </div>
              )}

              <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-gray-600">
                  <p className="font-medium text-gray-900">Form progress</p>
                  <p>{completionCount} of {Object.keys(initialForm).length} fields completed</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="h-4 w-4" />
                  No account needed to get started.
                </div>
                <Button type="submit" className="bg-red-600 text-white hover:bg-red-700">
                  Publish Listing
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Publish-gate modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 rounded-md p-1 text-gray-400 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">Almost done!</h2>
              <p className="mt-1 text-sm text-gray-500">
                Create a free account to publish your listing. It only takes a moment.
              </p>
            </div>

            <form onSubmit={handleModalPublish} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="modal-email">Email</label>
                <Input
                  id="modal-email"
                  type="email"
                  value={modalEmail}
                  onChange={(e) => setModalEmail(e.target.value)}
                  placeholder=""
                  className="h-11 border-gray-200 bg-white"
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="modal-password">Password</label>
                <Input
                  id="modal-password"
                  type="password"
                  value={modalPassword}
                  onChange={(e) => setModalPassword(e.target.value)}
                  placeholder="Min 8 chars, upper, lower, digit, symbol"
                  className="h-11 border-gray-200 bg-white"
                  required
                />
              </div>

              {modalError && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {modalError}
                </p>
              )}

              <Button
                type="submit"
                disabled={modalLoading}
                className="w-full bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
              >
                {modalLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account…
                  </span>
                ) : (
                  "Create Account & Publish"
                )}
              </Button>

              <p className="text-center text-xs text-gray-400">
                Already have an account?{" "}
                <a href="/login" className="text-red-600 hover:underline">Sign in</a>
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
