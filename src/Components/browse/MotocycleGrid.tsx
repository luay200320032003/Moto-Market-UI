import { Gauge } from "lucide-react";
import MotorcycleCard from "../shared/MotocycleCard";

type Motorcycle = {
  id: string | number;
  image_urls?: string[];
  image?: string;
  title: string;
  condition: string;
  price?: number;
  featured?: boolean;
  year: number;
  make: string;
  model: string;
  mileage?: number;
  location?: string;
  description?: string;
};

type MotorcycleGridProps = {
  motorcycles: Motorcycle[];
  isLoading: boolean;
};

export default function MotorcycleGrid({ motorcycles, isLoading }: MotorcycleGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {Array(9).fill(0).map((_, i) => (
          <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md animate-pulse">
            <div className="h-48 bg-gray-300"></div>
            <div className="p-4 space-y-3">
              <div className="h-5 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-300 rounded w-full"></div>
                <div className="h-3 bg-gray-300 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (motorcycles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Gauge className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No motorcycles found</h3>
        <p className="text-gray-600">Try adjusting your search filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {motorcycles.map((bike, index) => (
        <MotorcycleCard key={`${bike.id}-${index}`} motorcycle={bike} index={index} />
      ))}
    </div>
  );
}
