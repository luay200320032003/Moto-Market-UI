import React from 'react';
import MotorcycleCard from '@/Components/shared/MotocycleCard';

interface Motorcycle {
  id: string | number;
  title: string;
  condition: string;
  year: number;
  make: string;
  model: string;
  price: number;
  location: string;
  // Add other properties as needed
}

interface SimilarListingsProps {
  motorcycles: Motorcycle[];
}

export default function SimilarListings({ motorcycles }: SimilarListingsProps) {
  if (!motorcycles || motorcycles.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Similar Motorcycles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {motorcycles.map((bike, index) => (
            <MotorcycleCard key={bike.id} motorcycle={bike} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}