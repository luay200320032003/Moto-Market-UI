import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { MapPin, Gauge, Calendar, Heart } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

type Motorcycle = {
  id: string | number;
  image_urls?: string[];
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {motorcycles.map((bike) => (
        <div key={bike.id} className="group relative">
          <Link to={createPageUrl(`Motorcycle?id=${bike.id}`)}>
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={bike.image_urls?.[0] || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"}
                  alt={bike.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant={bike.condition === 'new' ? 'default' : 'secondary'}>
                    {bike.condition}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    ${bike.price?.toLocaleString()}
                  </span>
                </div>
                {bike.featured && (
                  <div className="absolute bottom-3 left-3">
                    <Badge className="bg-yellow-500 text-yellow-900">
                      Featured
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-1">
                  {bike.year} {bike.make} {bike.model}
                </h3>
                
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <Gauge className="w-4 h-4 mr-1" />
                    {bike.mileage?.toLocaleString()} mi
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {bike.year}
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  {bike.location}
                </div>
                
                {bike.description && (
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {bike.description}
                  </p>
                )}
              </div>
            </div>
          </Link>
          
          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.preventDefault()}
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}