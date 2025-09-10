
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { ChevronRight } from "lucide-react";
import { Button } from "../../Components/ui/button";
import MotorcycleCard from '../shared/MotocycleCard';
import { Skeleton } from '../../Components/ui/skeleton';

type Motorcycle = {
  id: string | number;
  title: string;
  condition: string;
  year: number;
  make: string;
  model: string;
  image: string;
  location: string; // Added location property
  // Add other properties as needed
};

interface FeaturedMotorcyclesProps {
  motorcycles: Motorcycle[];
  isLoading: boolean;
}

export default function FeaturedMotorcycles({ motorcycles, isLoading }: FeaturedMotorcyclesProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Motorcycles</h2>
            <p className="text-gray-600">Hand-picked premium motorcycles from trusted sellers</p>
          </div>
          <Link to={createPageUrl("Browse?featured=true")}>
            <Button variant="outline" className="group">
              View All Featured
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-64 w-full rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          ) : (
            motorcycles.map((bike, index) => (
              <MotorcycleCard key={bike.id} motorcycle={bike} index={index} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
