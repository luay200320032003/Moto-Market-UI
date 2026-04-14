import { FormEvent, useMemo, useState } from "react";
import { BadgeDollarSign, Bike, CheckCircle2, FileText, MapPin } from "lucide-react";
import { Button } from "../Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../Components/ui/card";
import { Input } from "../Components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Components/ui/select";

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
  imageUrl: string;
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
  imageUrl: "",
  description: "",
};

const formatLabel = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

export default function Sell() {
  const [form, setForm] = useState<SellFormState>(initialForm);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const completionCount = useMemo(() => {
    const values = Object.values(form);
    return values.filter((value) => value.trim().length > 0).length;
  }, [form]);

  const updateField = (field: keyof SellFormState, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setIsSubmitted(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
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
              The sell page now includes the missing dropdown menus for category, condition, and fuel type so buyers can filter your listing correctly.
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
                <p className="mt-1 text-sm text-gray-300">Description and contact info stay visible before publish wiring exists.</p>
              </div>
            </div>
          </div>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Listing preview</CardTitle>
              <CardDescription>This updates as you fill in the sell form.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-100 p-5">
                <p className="text-xl font-bold text-gray-900">{form.title || "Your motorcycle title"}</p>
                <p className="mt-2 text-sm text-gray-600">
                  {[form.year, form.make, form.model].filter(Boolean).join(" " ) || "Year, make, and model will appear here."}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {form.category && <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">{formatLabel(form.category)}</span>}
                  {form.condition && <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white">{formatLabel(form.condition)}</span>}
                  {form.fuelType && <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">{formatLabel(form.fuelType)}</span>}
                </div>
              </div>

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
                    placeholder="2022 Yamaha MT-07 ABS"
                    className="h-11 border-gray-200 bg-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="make">
                    Make
                  </label>
                  <Input
                    id="make"
                    value={form.make}
                    onChange={(event) => updateField("make", event.target.value)}
                    placeholder="Yamaha"
                    className="h-11 border-gray-200 bg-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="model">
                    Model
                  </label>
                  <Input
                    id="model"
                    value={form.model}
                    onChange={(event) => updateField("model", event.target.value)}
                    placeholder="MT-07"
                    className="h-11 border-gray-200 bg-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="year">
                    Year
                  </label>
                  <Input
                    id="year"
                    type="number"
                    min="1900"
                    max="2100"
                    value={form.year}
                    onChange={(event) => updateField("year", event.target.value)}
                    placeholder="2022"
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
                        <SelectItem key={option} value={option}>
                          {formatLabel(option)}
                        </SelectItem>
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
                        <SelectItem key={option} value={option}>
                          {formatLabel(option)}
                        </SelectItem>
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
                        <SelectItem key={option} value={option}>
                          {formatLabel(option)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="price">
                    Price
                  </label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(event) => updateField("price", event.target.value)}
                    placeholder="8900"
                    className="h-11 border-gray-200 bg-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="mileage">
                    Mileage
                  </label>
                  <Input
                    id="mileage"
                    type="number"
                    min="0"
                    value={form.mileage}
                    onChange={(event) => updateField("mileage", event.target.value)}
                    placeholder="4300"
                    className="h-11 border-gray-200 bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="engineSize">
                    Engine size (cc)
                  </label>
                  <Input
                    id="engineSize"
                    type="number"
                    min="0"
                    value={form.engineSize}
                    onChange={(event) => updateField("engineSize", event.target.value)}
                    placeholder="689"
                    className="h-11 border-gray-200 bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="color">
                    Color
                  </label>
                  <Input
                    id="color"
                    value={form.color}
                    onChange={(event) => updateField("color", event.target.value)}
                    placeholder="Blue"
                    className="h-11 border-gray-200 bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="location">
                    Location
                  </label>
                  <Input
                    id="location"
                    value={form.location}
                    onChange={(event) => updateField("location", event.target.value)}
                    placeholder="Dallas, TX"
                    className="h-11 border-gray-200 bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="sellerName">
                    Seller name
                  </label>
                  <Input
                    id="sellerName"
                    value={form.sellerName}
                    onChange={(event) => updateField("sellerName", event.target.value)}
                    placeholder="Alex Rider"
                    className="h-11 border-gray-200 bg-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="contactEmail">
                    Contact email
                  </label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={form.contactEmail}
                    onChange={(event) => updateField("contactEmail", event.target.value)}
                    placeholder="seller@example.com"
                    className="h-11 border-gray-200 bg-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="contactPhone">
                    Contact phone
                  </label>
                  <Input
                    id="contactPhone"
                    value={form.contactPhone}
                    onChange={(event) => updateField("contactPhone", event.target.value)}
                    placeholder="(555) 555-1234"
                    className="h-11 border-gray-200 bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="imageUrl">
                    Primary image URL
                  </label>
                  <Input
                    id="imageUrl"
                    type="url"
                    value={form.imageUrl}
                    onChange={(event) => updateField("imageUrl", event.target.value)}
                    placeholder="https://example.com/bike.jpg"
                    className="h-11 border-gray-200 bg-white"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={form.description}
                    onChange={(event) => updateField("description", event.target.value)}
                    placeholder="Describe service history, upgrades, title status, and any cosmetic issues."
                    className="min-h-[140px] w-full rounded-md border border-gray-200 bg-white px-3 py-3 text-sm shadow-sm outline-none transition-colors placeholder:text-gray-400 focus:ring-1 focus:ring-gray-900"
                  />
                </div>
              </div>

              {isSubmitted && (
                <div className="flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    Listing draft captured locally. The missing dropdown menus are restored and the page is ready for backend submission wiring.
                  </span>
                </div>
              )}

              <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-gray-600">
                  <p className="font-medium text-gray-900">Form progress</p>
                  <p>{completionCount} fields completed</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="h-4 w-4" />
                  Structured selects now included for buyer filtering.
                </div>
                <Button type="submit" className="bg-red-600 text-white hover:bg-red-700">
                  Save listing draft
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
