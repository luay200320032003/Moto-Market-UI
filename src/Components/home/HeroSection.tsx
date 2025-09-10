import React from "react";
import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onSearch: () => void;
  onKeyPress?: React.KeyboardEventHandler<HTMLInputElement>;
}

export default function HeroSection({ searchQuery, setSearchQuery, onSearch, onKeyPress }: HeroSectionProps) {
  return (
    <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1200"
          alt="Motorcycles"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Find Your Perfect
          <span className="text-red-500 block">Motorcycle</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
          Discover thousands of motorcycles from trusted dealers and private sellers
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search by make, model, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={onKeyPress}
                className="bg-white text-gray-900 border-0 text-lg h-12 placeholder:text-gray-500"
              />
            </div>
            <Button 
              onClick={onSearch}
              size="lg" 
              className="bg-red-600 hover:bg-red-700 text-white px-8 h-12"
            >
              <Search className="w-5 h-5 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-3 gap-8 max-w-md mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">10K+</div>
            <div className="text-sm text-gray-300">Motorcycles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">500+</div>
            <div className="text-sm text-gray-300">Dealers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">50+</div>
            <div className="text-sm text-gray-300">Brands</div>
          </div>
        </div>
      </div>
    </section>
  );
}