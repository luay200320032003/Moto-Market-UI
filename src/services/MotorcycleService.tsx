import API from "../api";
import { Motorcycle } from "../entities/Motorcycle";

interface GetMotorcyclesParams {
  limit?: number;
  page?: number;
  pageSize?: number;
  make?: string;
  model?: string;
  year?: number;
  category?: string;
  color?: string;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400";

function mapToMotorcycle(m: any): Motorcycle {
  // build, media, dealer all come as single-element arrays from the API
  const build  = Array.isArray(m.build)  ? m.build[0]  : m.build  ?? {};
  const media  = Array.isArray(m.media)  ? m.media[0]  : m.media  ?? {};
  const dealer = Array.isArray(m.dealer) ? m.dealer[0] : m.dealer ?? {};

  const heading = m.heading ?? "Unknown Motorcycle";
  const photos: string[] = Array.isArray(media.photos) ? media.photos : [];
  const mainImage = photos[0] ?? FALLBACK_IMAGE;

  const yearFromHeading = Number(heading.split(" ")[0]);
  const inferredYear =
    Number.isInteger(yearFromHeading) && yearFromHeading > 1900
      ? yearFromHeading
      : new Date().getFullYear();

  return {
    id: m.id,
    title: heading,
    make: build.make ?? "Unknown",
    model: build.model ?? "Unknown",
    year: build.year ?? inferredYear,
    price: m.price > 0 ? m.price : (m.msrp ?? 0),
    mileage: m.miles ?? 0,
    condition: m.inventoryType === "used" ? "good" : "new",
    category: "standard",
    engine_size: undefined,
    fuel_type: "gasoline",
    color: m.color ?? undefined,
    description:
      [build.trim, build.transmission, m.color, m.inventoryType]
        .filter(Boolean)
        .join(" - ") || "No description",
    location: dealer.city && dealer.state ? `${dealer.city}, ${dealer.state}` : undefined,
    contact_phone: undefined,
    contact_email: "info@example.com",
    image_urls: photos.length > 0 ? photos : [FALLBACK_IMAGE],
    featured: Boolean(m.isPremiumDealer),
    seller_name: dealer.name ?? m.source ?? "Unknown Dealer",
    created_date: m.firstSeenAtDate ?? new Date().toISOString(),
    image: mainImage,
    source: m.source ?? undefined,
    vin: m.vin ?? undefined,
    dealer_website: dealer.websit ?? dealer.website ?? undefined,
    vdp_url: m.vdpUrl ?? undefined,
  };
}

/**
 * Fetch multiple motorcycles
 */
export async function getMotorcycles(
  params: GetMotorcyclesParams = {}
): Promise<{ motorcycles: Motorcycle[]; hasNextPage: boolean }> {
  try {
    const { data }: { data: any } = await API.get("/api/marketplace", { params });

    const motorcyclesArray: any[] =
      Array.isArray(data?.items)       ? data.items       :
      Array.isArray(data?.data)        ? data.data        :
      Array.isArray(data?.motorcycles) ? data.motorcycles :
      Array.isArray(data)              ? data             : [];

    const hasNextPage: boolean = data?.hasNextPage ?? false;

    const mapped = motorcyclesArray.map((m, i) => ({ ...mapToMotorcycle(m), _key: m.externalId ?? `${m.source ?? "unknown"}-${m.id ?? i}` }));
    const seen = new Set<string>();
    const motorcycles = mapped.filter((m) => {
      if (seen.has(m._key)) return false;
      seen.add(m._key);
      return true;
    });

    return { motorcycles, hasNextPage };
  } catch (error: any) {
    console.error("Error fetching motorcycles:", error?.message);
    return { motorcycles: [], hasNextPage: false };
  }
}



/**
 * Fetch a single motorcycle by ID
 */
export async function getMotorcycleById(id: string, source: "market" | "listing" = "market"): Promise<Motorcycle> {
  try {
    const { data } = await API.get(`/api/marketplace/${source}/${id}`);
    return mapToMotorcycle(data);
  } catch (error) {
    console.error("❌ Error fetching motorcycle by ID:", error);
    throw error;
  }
}
