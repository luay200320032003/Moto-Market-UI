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
  const heading = m.heading ?? "Unknown Motorcycle";
  const headingParts = heading.split(" - ").map((part: string) => part.trim());
  const inferredMake = m.build?.make ?? headingParts[headingParts.length - 1] ?? "Unknown";
  const inferredModel = m.build?.model ?? (headingParts.length > 1 ? headingParts.slice(0, -1).join(" - ") : heading);

  const yearFromHeading = Number(heading?.split(" ")?.[0]);
  const inferredYear = Number.isInteger(yearFromHeading) && yearFromHeading > 1900 ? yearFromHeading : undefined;

  return {
    id: m.id,
    title: heading,
    make: inferredMake,
    model: inferredModel || "Unknown",
    year: m.build?.year ?? inferredYear ?? new Date().getFullYear(),
    price: m.price ?? m.msrp ?? 0,
    mileage: m.miles ?? m.mileage ?? 0,
    condition: m.condition ?? "good",
    category: m.category ?? "standard",
    engine_size: m.build?.engine ?? m.build?.engine_size,
    fuel_type: m.fuel_type ?? "gasoline",
    color: m.color ?? "N/A",
    description:
      m.description ||
      [m.build?.trim, m.color, m.source, m.sellerType].filter(Boolean).join(" - ") ||
      "No description",
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
    console.log("📡 Calling API with params:", { 
      baseURL: import.meta.env.VITE_API_BASE,
      endpoint: "/api/motorcycles",
      params 
    });

    const { data }: { data: any } = await API.get("/api/motorcycles", { params });

    console.log("✅ Full API Response:", data);
    console.log("📊 Response keys:", Object.keys(data || {}));
    
    // Try different response structures
    let motorcyclesArray: any[] = [];
    
    if (Array.isArray(data?.data)) {
      motorcyclesArray = data.data;
      console.log("✅ Found data in data.data");
    } else if (Array.isArray(data?.motorcycles)) {
      motorcyclesArray = data.motorcycles;
      console.log("✅ Found data in data.motorcycles");
    } else if (Array.isArray(data)) {
      motorcyclesArray = data;
      console.log("✅ Response is direct array");
    } else {
      console.warn("⚠️ Could not find array in response. Full response:", data);
      return [];
    }
    
    console.log(`📦 Found ${motorcyclesArray.length} items`);
    if (motorcyclesArray.length > 0) {
      console.log("🔍 First item structure:", motorcyclesArray[0]);
    }
    
    const mapped = motorcyclesArray.map(mapToMotorcycle);
    console.log(`✅ Mapped ${mapped.length} motorcycles`);
    return mapped;
  } catch (error: any) {
    console.error("❌ Error fetching motorcycles:", {
      message: error?.message,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      data: error?.response?.data,
      config: error?.config,
    });
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
