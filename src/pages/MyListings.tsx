import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusCircle, Bike, MapPin, Calendar, DollarSign, AlertCircle } from "lucide-react";
import { Button } from "../Components/ui/button";
import { getStoredToken } from "../utils/auth";
import API from "../api";

interface MyListing {
  id: string | number;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;
  location?: string;
  condition?: string;
  imageUrls?: string[];
  createdAt?: string;
  status?: string;
}

const FALLBACK = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400";

function statusColor(status?: string) {
  switch (status?.toLowerCase()) {
    case "active":    return "bg-green-100 text-green-700";
    case "sold":      return "bg-gray-100 text-gray-600";
    case "pending":   return "bg-yellow-100 text-yellow-700";
    default:          return "bg-blue-100 text-blue-700";
  }
}

export default function MyListings() {
  const navigate = useNavigate();
  const [listings, setListings] = useState<MyListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getStoredToken()) {
      navigate("/login?returnTo=/my-listings", { replace: true });
      return;
    }

    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await API.get("/api/listings");
        const raw: any[] = Array.isArray(data?.items) ? data.items
          : Array.isArray(data?.data) ? data.data
          : Array.isArray(data) ? data : [];

        if (!cancelled) {
          setListings(raw.map((r: any) => ({
            id:        r.id,
            title:     r.title ?? (`${r.year ?? ""} ${r.make ?? ""} ${r.model ?? ""}`.trim() || "Unnamed listing"),
            make:      r.make ?? "",
            model:     r.model ?? "",
            year:      r.year ?? 0,
            price:     r.price ?? 0,
            mileage:   r.mileage ?? r.miles ?? undefined,
            location:  r.location ?? undefined,
            condition: r.condition ?? undefined,
            imageUrls: Array.isArray(r.imageUrls) ? r.imageUrls
              : Array.isArray(r.photos) ? r.photos
              : r.imageUrl ? [r.imageUrl] : [],
            createdAt: r.createdAt ?? r.created_date ?? undefined,
            status:    r.status ?? "active",
          })));
        }
      } catch (err: any) {
        if (!cancelled) setError(err?.response?.data?.message ?? err?.message ?? "Failed to load listings.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {isLoading ? "Loading…" : `${listings.length} listing${listings.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <Link to="/Sell">
            <Button className="bg-red-600 text-white hover:bg-red-700 flex items-center gap-2 rounded-xl">
              <PlusCircle className="h-4 w-4" />
              New Listing
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading skeletons */}
        {isLoading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-white shadow-sm overflow-hidden animate-pulse">
                <div className="h-44 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-5 bg-gray-200 rounded w-1/3 mt-3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && listings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <Bike className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No listings yet</h2>
            <p className="text-gray-500 text-sm mb-6 max-w-xs">
              Post your first motorcycle and start connecting with buyers.
            </p>
            <Link to="/Sell">
              <Button className="bg-red-600 text-white hover:bg-red-700 rounded-xl">
                Create Your First Listing
              </Button>
            </Link>
          </div>
        )}

        {/* Listings grid */}
        {!isLoading && listings.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <div key={listing.id} className="rounded-2xl bg-white shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                {/* Photo */}
                <div className="relative h-44 bg-gray-100">
                  <img
                    src={listing.imageUrls?.[0] ?? FALLBACK}
                    alt={listing.title}
                    className="h-full w-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
                  />
                  {listing.status && (
                    <span className={`absolute top-2 right-2 rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${statusColor(listing.status)}`}>
                      {listing.status}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm leading-snug truncate">{listing.title}</h3>

                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                    {listing.year > 0 && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />{listing.year}
                      </span>
                    )}
                    {listing.mileage != null && (
                      <span className="flex items-center gap-1">
                        <Bike className="h-3 w-3" />{listing.mileage.toLocaleString()} mi
                      </span>
                    )}
                    {listing.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />{listing.location}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="flex items-center gap-0.5 text-base font-bold text-gray-900">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      {listing.price > 0 ? listing.price.toLocaleString() : "—"}
                    </span>
                    <Link
                      to={`/Motorcycle?id=${listing.id}&type=listing`}
                      className="text-xs font-medium text-red-600 hover:text-red-700 hover:underline"
                    >
                      View listing →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
