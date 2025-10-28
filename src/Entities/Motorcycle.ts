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
  
}

// Example function to fetch motorcycles (replace with real API call as needed)
export async function listMotorcycles(orderBy: string, limit: number): Promise<Motorcycle[]> {
  // Replace this with your actual data fetching logic
  // For now, return an empty array or mock data
  return [];
}