export interface Motorcycle {
  id: string | number; // Unique identifier
  title: string; // Motorcycle title/name
  make: string; // Manufacturer (Harley-Davidson, Yamaha, etc.)
  model: string; // Model name
  year: number; // Year of manufacture
  price: number; // Asking price in USD
  mileage?: number; // Odometer reading in miles
  condition: 'new' | 'excellent' | 'good' | 'fair' | 'poor'; // Overall condition
  category: 'sport' | 'cruiser' | 'touring' | 'adventure' | 'dirt' | 'standard' | 'scooter'; // Motorcycle category
  engine_size?: number; // Engine displacement in CC
  fuel_type?: 'gasoline' | 'electric' | 'hybrid'; // Fuel type
  color?: string; // Primary color
  description?: string; // Detailed description
  location?: string; // City, State
  contact_phone?: string; // Seller contact phone
  contact_email: string; // Seller contact email
  image_urls: string[]; // Array of image URLs
  featured: boolean; // Whether to feature on homepage
  seller_name: string; // Name of the seller
  created_date: string; // Date created (ISO string)
  image: string;
  source?: string;
  vin?: string;
  dealer_website?: string;
  vdp_url?: string;
  msrp?: number;
  trim?: string;
  transmission?: string;
  vehicle_type?: string;
  displacement_cc?: string;
  engine_cylinders?: string;
  horsepower?: string;
  engine_description?: string;
  // Whether the backend can actually resolve a dealer/seller email to send
  // a contact message to. Absent (undefined) until the backend adds support —
  // treat as available in that case so nothing breaks before that ships.
  hasDealerEmail?: boolean;
  // The id of the user who owns this listing (source === "listing" only).
  // Used to hide the "Contact Dealer" form when the viewer is the owner.
  seller_user_id?: number;
  // The seller-written (or AI-generated) listing description, straight from
  // the backend — distinct from `description` above, which is a synthesized
  // summary string built client-side from build attributes, not real prose.
  listing_description?: string;
  // Dealer/seller coordinates from the dealer DTO, used to show a map on the detail page.
  latitude?: string;
  longitude?: string;
}

// The backend ignores `limit`/`pageSize` and always returns a fixed page of
// items, so reaching a larger total means paging through multiple requests.
export async function listMotorcycles(_orderBy: string, limit: number): Promise<Motorcycle[]> {
  const { getMotorcycles } = await import("../services/MotorcycleService");
  const collected: Motorcycle[] = [];
  let page = 1;
  const maxPages = 10;

  while (collected.length < limit && page <= maxPages) {
    const { motorcycles, hasNextPage } = await getMotorcycles({ page, limit });
    collected.push(...motorcycles);
    if (!hasNextPage) break;
    page++;
  }

  return collected.slice(0, limit);
}