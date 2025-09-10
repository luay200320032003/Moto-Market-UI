import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { MapPin, Gauge, Calendar, Heart, Phone, Mail } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

type Motorcycle = {
  id: string | number;
  image_urls?: string[];
  title?: string;
  condition?: string;
  featured?: boolean;
  year?: number;
  make?: string;
  model?: string;
  price?: number;
  mileage?: number;
  location?: string;
  category?: string;
  description?: string;
  seller_name?: string;
  contact_phone?: string;
  contact_email?: string;
};

interface MotorcycleListProps {
  motorcycles: Motorcycle[];
  isLoading: boolean;
}

export default function MotorcycleList({ motorcycles, isLoading }: MotorcycleListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md animate-pulse">
            <div className="md:flex">
              <div className="md:w-1/3 h-48 bg-gray-300"></div>
              <div className="p-6 md:w-2/3 space-y-4">
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
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
    <div className="space-y-6">
      {motorcycles.map((bike) => (
        <div key={bike.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow group">
          <div className="md:flex">
            <div className="md:w-1/3 relative">
              <Link to={createPageUrl(`Motorcycle?id=${bike.id}`)}>
                <div className="h-48 md:h-full overflow-hidden">
                  <img
                    src={bike.image_urls?.[0] || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"}
                    alt={bike.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>
              <div className="absolute top-3 left-3">
                <Badge variant={bike.condition === 'new' ? 'default' : 'secondary'}>
                  {bike.condition}
                </Badge>
              </div>
              {bike.featured && (
                <div className="absolute top-3 right-3">
                  <Badge className="bg-yellow-500 text-yellow-900">
                    Featured
                  </Badge>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white"
                onClick={(e) => e.preventDefault()}
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="p-6 md:w-2/3 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <Link to={createPageUrl(`Motorcycle?id=${bike.id}`)}>
                    <h3 className="text-xl font-bold text-gray-900 hover:text-red-600 transition-colors">
                      {bike.year} {bike.make} {bike.model}
                    </h3>
                  </Link>
                  <span className="text-2xl font-bold text-red-600">
                    ${bike.price?.toLocaleString()}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Gauge className="w-4 h-4 mr-2" />
                    {bike.mileage?.toLocaleString()} miles
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {bike.year}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {bike.location}
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-red-600 mr-2"></span>
                    {bike.category}
                  </div>
                </div>
                
                {bike.description && (
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {bike.description}
                  </p>
                )}
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  Seller: {bike.seller_name || "Private Seller"}
                </div>
                <div className="flex gap-2">
                  {bike.contact_phone && (
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                  )}
                  {bike.contact_email && (
                    <Button variant="outline" size="sm">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                  )}
                  <Link to={createPageUrl(`Motorcycle?id=${bike.id}`)}>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}