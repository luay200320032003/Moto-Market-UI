import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { ChevronRight } from 'lucide-react';
import { Button } from '../../Components/ui/button';
import MotorcycleCard from '../../Components/shared/MotocycleCard';
import { Skeleton } from '../../Components/ui/skeleton';

interface RecentListingsProps {
  motorcycles: Array<any>; // Replace 'any' with your Motorcycle type if available
  isLoading: boolean;
}

export default function RecentListings({ motorcycles, isLoading }: RecentListingsProps) {
  const recentMotorcycles = motorcycles.slice(0, 8);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Latest Listings</h2>
            <p className="text-gray-600">Fresh motorcycles just added to our marketplace</p>
          </div>
          <Link to={createPageUrl("Browse")}>
            <Button variant="outline" className="group">
              View All
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array(8).fill(0).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-56 w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          ) : (
            recentMotorcycles.map((bike, index) => (
              <MotorcycleCard key={bike.id} motorcycle={bike} index={index} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}