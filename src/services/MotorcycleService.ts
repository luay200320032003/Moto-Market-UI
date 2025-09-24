import { Motorcycle } from "../entities/Motorcycle";
import API from "../api"; // your configured Axios instance

export async function getMotorcycles(searchParams?: Record<string, string | number>) {
  try {
    // Build query string from params
    const queryString = searchParams
      ? "?" + new URLSearchParams(searchParams as any).toString()
      : "";

    const response = await API.get<{ motorcycles: Motorcycle[] }>(`/api/motorcycles${queryString}`);

    // Return only the motorcycles array
    const rawData = response.data.motorcycles || [];

    // 🔥 Normalize API data → Motorcycle interface
    const bikes: Motorcycle[] = rawData.map((m: any) => ({
      id: m.id,
      title: m.heading,
      make: m.build?.make || "Unknown",
      model: m.build?.model || "Unknown",
      year: m.build?.year || new Date().getFullYear(),
      price: m.price || 0,
      mileage: m.miles ?? 0,
      condition: "good", // default (API doesn’t provide this field)
      category: "standard", // default (you might want to map based on build/model later)
      engine_size: m.build?.engine_size, // API may not provide
      fuel_type: "gasoline", // default since API doesn’t specify
      color: m.color,
      description: [m.build?.trim, m.color].filter(Boolean).join(" - "),
      location: m.dealer ? `${m.dealer.city}, ${m.dealer.state}` : undefined,
      contact_phone: undefined, // not in API
      contact_email: "info@example.com", // fallback until API supports
      image_urls: m.media?.photoLinks || [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", // placeholder
      ],
      featured: false, // default
      seller_name: m.dealer?.name || "Unknown Dealer",
      created_date: new Date().toISOString(), // fallback for sorting
      image:
        m.media?.photoLinks?.[0] ||
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", // first image or fallback
    }));

    return bikes;

  } catch (error: any) {
    console.error("Error fetching motorcycles:", error);
    throw error;
  }
}
