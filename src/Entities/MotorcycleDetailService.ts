import { Motorcycle } from "./Motorcycle";
import API from "../api"; // your Axios instance

export async function getMotorcycleById(id: string): Promise<Motorcycle> {
  try {
    const response = await API.get(`/api/motorcycles/${id}`);
    const m: any = response.data; // ✅ Use the object directly

    // Map API response to Motorcycle type
    const bike: Motorcycle = {
      id: m.id,
      title: m.heading,
      make: m.build?.make || "Unknown",
      model: m.build?.model || "Unknown",
      year: m.build?.year || new Date().getFullYear(),
      price: m.price || 0,
      mileage: m.miles ?? 0,
      condition: "good", // default
      category: "standard", // default
      engine_size: m.build?.engine_size,
      fuel_type: "gasoline",
      color: m.color,
      description: [m.build?.trim, m.color].filter(Boolean).join(" - "),
      location: m.dealer ? `${m.dealer.city}, ${m.dealer.state}` : undefined,
      contact_phone: undefined,
      contact_email: "info@example.com",
      image_urls: m.media?.photoLinks || [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      ],
      featured: false,
      seller_name: m.dealer?.name || "Unknown Dealer",
      created_date: new Date().toISOString(),
      image: m.media?.photoLinks?.[0] || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    };

    return bike;

  } catch (error: any) {
    console.error("Error fetching motorcycle by ID:", error);
    throw error;
  }
}



