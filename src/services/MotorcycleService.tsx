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

/**
 * Utility: Map API response to our Motorcycle entity
 */
function mapToMotorcycle(m: any): Motorcycle {
  return {
    id: m.id,
    title: m.heading ?? "Unknown Motorcycle",
    make: m.build?.make ?? "Unknown",
    model: m.build?.model ?? "Unknown",
    year: m.build?.year ?? new Date().getFullYear(),
    price: m.price ?? 0,
    mileage: m.miles ?? 0,
    condition: m.condition ?? "good",
    category: m.category ?? "standard",
    engine_size: m.build?.engine ?? m.build?.engine_size,
    fuel_type: m.fuel_type ?? "gasoline",
    color: m.color ?? "N/A",
    description: [m.build?.trim, m.color].filter(Boolean).join(" - ") || "No description",
    location: m.dealer ? `${m.dealer.city}, ${m.dealer.state}` : undefined,
    contact_phone: m.dealer?.phone ?? undefined,
    contact_email: m.dealer?.email ?? "info@example.com",
    image_urls:
      m.media?.photoLinks?.length > 0
        ? m.media.photoLinks
        : ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"],
    featured: Boolean(m.featured),
    seller_name: m.dealer?.name ?? "Unknown Dealer",
    created_date: m.created_date ?? new Date().toISOString(),
    image:
      m.media?.photoLinks?.[0] ??
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
  };
}

/**
 * Fetch multiple motorcycles
 */
 export async function getMotorcycles(
  params: GetMotorcyclesParams = {}
): Promise<Motorcycle[]> {
  try {
    const { data }: { data: any } = await API.get("/api/motorcycles", { params });

    const motorcyclesArray: any[] = Array.isArray(data)
      ? data
      : (data?.motorcycles ?? data?.results ?? []);

    return motorcyclesArray.map(mapToMotorcycle);
  } catch (error) {
    console.error("❌ Error fetching motorcycles:", error);
    return [];
  }
}


/**
 * Fetch a single motorcycle by ID
 */
export async function getMotorcycleById(id: string): Promise<Motorcycle> {
  try {
    const { data } = await API.get(`/api/motorcycles/${id}`);
    return mapToMotorcycle(data);
  } catch (error) {
    console.error("❌ Error fetching motorcycle by ID:", error);
    throw error;
  }
}
