import React, { useState, useEffect } from "react";
import { Motorcycle, listMotorcycles } from "../Entities/Motorcycle";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Search, Filter, Grid, List, MapPin, Gauge, Calendar, SlidersHorizontal } from "lucide-react";
import { Button } from "../Components/ui/button";
import { Input } from "../Components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Components/ui/select";
import SearchFilters from "../Components/browse/SearchFilter";
import MotorcycleGrid from "../Components/browse/MotocycleGrid";
import MotorcycleList from "../Components/browse/MotocycleList";

// Updated mock data with complete properties
const mockMotorcycles = [
  {
    id: 1,
    title: "2023 Harley Davidson Street Glide Special",
    make: "Harley Davidson",
    model: "Street Glide Special",
    year: 2023,
    price: 28500,
    mileage: 1200,
    condition: "new" as const,
    category: "cruiser" as const,
    engine_size: 1868,
    fuel_type: "gasoline" as const,
    color: "Vivid Black",
    description: "This stunning 2023 Harley Davidson Street Glide Special is in pristine condition with only 1,200 miles. Features include premium audio system, GPS navigation, and custom chrome accessories. Garage kept, never dropped, all maintenance up to date.",
    location: "Los Angeles, CA",
    contact_phone: "(555) 123-4567",
    contact_email: "seller1@example.com",
    image_urls: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800",
      "https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=800"
    ],
    featured: true,
    seller_name: "Mike Johnson",
    created_date: "2024-01-01T10:30:00Z",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
  },
  {
    id: 2,
    title: "2022 Yamaha YZF-R1M Track Ready",
    make: "Yamaha",
    model: "YZF-R1M",
    year: 2022,
    price: 22500,
    mileage: 3500,
    condition: "excellent" as const,
    category: "sport" as const,
    engine_size: 998,
    fuel_type: "gasoline" as const,
    color: "Team Yamaha Blue",
    description: "Track-focused R1M with carbon fiber bodywork, Öhlins Electronic Racing Suspension, and Bridgestone racing slicks included. Clean title, no accidents, professionally maintained. Perfect for serious track enthusiasts.",
    location: "New York, NY",
    contact_phone: "(555) 234-5678",
    contact_email: "trackrider@example.com",
    image_urls: [
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800",
      "https://images.unsplash.com/photo-1594172825425-e5e34b95d03c?w=800"
    ],
    featured: true,
    seller_name: "Sarah Chen",
    created_date: "2024-01-02T14:15:00Z",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800"
  },
  {
    id: 3,
    title: "2020 Honda CBR1000RR Fireblade SP",
    make: "Honda",
    model: "CBR1000RR Fireblade SP",
    year: 2020,
    price: 16800,
    mileage: 8500,
    condition: "good" as const,
    category: "sport" as const,
    engine_size: 999,
    fuel_type: "gasoline" as const,
    color: "Grand Prix Red",
    description: "Well-maintained CBR1000RR with Öhlins suspension, Marchesini wheels, and Akrapovič exhaust. Recent service completed, new tires, chain and sprockets replaced. Some minor cosmetic wear consistent with age.",
    location: "Chicago, IL",
    contact_phone: "(555) 345-6789",
    contact_email: "honda_rider@example.com",
    image_urls: [
      "https://images.unsplash.com/photo-1594172825425-e5e34b95d03c?w=800"
    ],
    featured: false,
    seller_name: "David Rodriguez",
    created_date: "2023-12-15T09:45:00Z",
    image: "https://images.unsplash.com/photo-1594172825425-e5e34b95d03c?w=800"
  },
  {
    id: 4,
    title: "2018 Kawasaki Ninja 400 Beginner Friendly",
    make: "Kawasaki",
    model: "Ninja 400",
    year: 2018,
    price: 4200,
    mileage: 15200,
    condition: "fair" as const,
    category: "sport" as const,
    engine_size: 399,
    fuel_type: "gasoline" as const,
    color: "Kawasaki Green",
    description: "Perfect starter bike! Some cosmetic scratches from tip-over in driveway (no damage to engine or frame). Runs great, recent oil change, good tires. Great for new riders looking to learn.",
    location: "Houston, TX",
    contact_phone: "(555) 456-7890",
    contact_email: "first_bike@example.com",
    image_urls: [
      "https://images.unsplash.com/photo-1595166297390-3f4a4f8b9d3b?w=800"
    ],
    featured: false,
    seller_name: "Jennifer Smith",
    created_date: "2023-11-20T16:20:00Z",
    image: "https://images.unsplash.com/photo-1595166297390-3f4a4f8b9d3b?w=800"
  },
  {
    id: 5,
    title: "2021 BMW R 1250 GS Adventure Ready",
    make: "BMW",
    model: "R 1250 GS",
    year: 2021,
    price: 18500,
    mileage: 12500,
    condition: "excellent" as const,
    category: "adventure" as const,
    engine_size: 1254,
    fuel_type: "gasoline" as const,
    color: "Racing Blue Metallic",
    description: "Adventure-ready GS with BMW premium package, heated grips, GPS navigation, and aluminum panniers. Just completed 12,000-mile service. Includes crash bars, skid plate, and touring windscreen.",
    location: "Denver, CO",
    contact_phone: "(555) 567-8901",
    contact_email: "adventure_rider@example.com",
    image_urls: [
      "https://images.unsplash.com/photo-1629792036140-5e3e8f8d9b2e?w=800",
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800"
    ],
    featured: true,
    seller_name: "Robert Wilson",
    created_date: "2024-01-05T11:10:00Z",
    image: "https://images.unsplash.com/photo-1629792036140-5e3e8f8d9b2e?w=800"
  },
  {
    id: 6,
    title: "2015 Ducati Monster 821 Dark Edition",
    make: "Ducati",
    model: "Monster 821 Dark",
    year: 2015,
    price: 7800,
    mileage: 18500,
    condition: "good" as const,
    category: "standard" as const,
    engine_size: 821,
    fuel_type: "gasoline" as const,
    color: "Dark Stealth",
    description: "Iconic Ducati Monster with L-twin engine, trellis frame, and aggressive styling. Recent Desmo service completed, new clutch plates, and fresh Pirelli tires. Some normal wear but mechanically sound.",
    location: "Miami, FL",
    contact_phone: "(555) 678-9012",
    contact_email: "ducati_lover@example.com",
    image_urls: [
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800"
    ],
    featured: false,
    seller_name: "Alessandro Rossi",
    created_date: "2023-10-01T13:30:00Z",
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800"
  },
  {
    id: 7,
    title: "2023 Indian Scout Bobber Twenty",
    make: "Indian",
    model: "Scout Bobber Twenty",
    year: 2023,
    price: 12500,
    mileage: 850,
    condition: "new" as const,
    category: "cruiser" as const,
    engine_size: 1133,
    fuel_type: "gasoline" as const,
    color: "Thunder Black",
    description: "Brand new Indian Scout Bobber with blacked-out styling, low-slung profile, and classic bobber aesthetics. Still under warranty, only 850 break-in miles. Includes Indian extended warranty and roadside assistance.",
    location: "Phoenix, AZ",
    contact_phone: "(555) 789-0123",
    contact_email: "indian_scout@example.com",
    image_urls: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
    ],
    featured: true,
    seller_name: "Tom Anderson",
    created_date: "2024-01-08T08:45:00Z",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
  },
  {
    id: 8,
    title: "2019 KTM 790 Adventure R Off-Road Beast",
    make: "KTM",
    model: "790 Adventure R",
    year: 2019,
    price: 11200,
    mileage: 22000,
    condition: "good" as const,
    category: "adventure" as const,
    engine_size: 799,
    fuel_type: "gasoline" as const,
    color: "KTM Orange",
    description: "Serious off-road adventure bike with WP suspension, spoked wheels, and aggressive geometry. Well-used but well-maintained. Includes crash protection, luggage system, and GPS mount. Ready for your next adventure!",
    location: "Seattle, WA",
    contact_phone: "(555) 890-1234",
    contact_email: "ktm_adventure@example.com",
    image_urls: [
      "https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=800"
    ],
    featured: false,
    seller_name: "Chris Mountain",
    created_date: "2023-11-15T15:20:00Z",
    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=800"
  }
];
export default function Browse() {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [filteredMotorcycles, setFilteredMotorcycles] = useState<Motorcycle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMake, setSelectedMake] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("any");
  const [selectedCondition, setSelectedCondition] = useState("any");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [yearRange, setYearRange] = useState<[number, number]>([1990, 2024]);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    loadMotorcycles();
    parseUrlParams();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [motorcycles, searchQuery, selectedMake, selectedCategory, selectedCondition, priceRange, yearRange, sortBy]);

  const parseUrlParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const search = urlParams.get('search');
    const category = urlParams.get('category');
    const featured = urlParams.get('featured');
    
    if (search) setSearchQuery(search);
    if (category) setSelectedCategory(category);
  };

  const loadMotorcycles = async () => {
    try {
      const data = await listMotorcycles("-created_date", 100);
      setMotorcycles(data);
    } catch (error) {
      console.error("Error loading motorcycles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...motorcycles];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(bike => 
        bike.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bike.make?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bike.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bike.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Make filter
    if (selectedMake) {
      filtered = filtered.filter(bike => bike.make === selectedMake);
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(bike => bike.category === selectedCategory);
    }

    // Condition filter
    if (selectedCondition) {
      filtered = filtered.filter(bike => bike.condition === selectedCondition);
    }

    // Price range filter
    filtered = filtered.filter(bike => 
      bike.price >= priceRange[0] && bike.price <= priceRange[1]
    );

    // Year range filter
    filtered = filtered.filter(bike => 
      bike.year >= yearRange[0] && bike.year <= yearRange[1]
    );

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "year-new":
        filtered.sort((a, b) => (b.year || 0) - (a.year || 0));
        break;
      case "year-old":
        filtered.sort((a, b) => (a.year || 0) - (b.year || 0));
        break;
      case "mileage-low":
        filtered.sort((a, b) => (a.mileage || 0) - (b.mileage || 0));
        break;
      default: // newest
        filtered.sort((a, b) => new Date(b.created_date!).getTime() - new Date(a.created_date!).getTime());
    }

    setFilteredMotorcycles(filtered);
  };

//  // Load initial data and parse URL params
  useEffect(() => {
    // For now, use mock data instead of API call
    setMotorcycles(mockMotorcycles);
    parseUrlParams();
  }, [parseUrlParams]); // parseUrlParams is a dependency since it's a useCallback function.



  const clearFilters = () => {
    setSearchQuery("");
    setSelectedMake("");
    setSelectedCategory("");
    setSelectedCondition("");
    setPriceRange([0, 100000]);
    setYearRange([1990, 2024]);
    setSortBy("newest");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Browse Motorcycles</h1>
              <p className="text-gray-600">
                {filteredMotorcycles.length} motorcycles available
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search motorcycles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="year-new">Year: Newest First</SelectItem>
                  <SelectItem value="year-old">Year: Oldest First</SelectItem>
                  <SelectItem value="mileage-low">Lowest Mileage</SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="flex border border-gray-300 rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {/* Mobile Filters Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <SearchFilters
              motorcycles={motorcycles}
              selectedMake={selectedMake}
              setSelectedMake={setSelectedMake}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedCondition={selectedCondition}
              setSelectedCondition={setSelectedCondition}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              yearRange={yearRange}
              setYearRange={setYearRange}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="md:hidden fixed inset-0 z-50 bg-white overflow-y-auto">
              <div className="p-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <Button variant="ghost" onClick={() => setShowFilters(false)}>
                    Close
                  </Button>
                </div>
                <SearchFilters
                  motorcycles={motorcycles}
                  selectedMake={selectedMake}
                  setSelectedMake={setSelectedMake}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedCondition={selectedCondition}
                  setSelectedCondition={setSelectedCondition}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  yearRange={yearRange}
                  setYearRange={setYearRange}
                  onClearFilters={clearFilters}
                />
              </div>
            </div>
          )}

          {/* Results */}
          <div className="flex-1">
            {viewMode === "grid" ? (
              <MotorcycleGrid motorcycles={filteredMotorcycles} isLoading={isLoading} />
            ) : (
              <MotorcycleList motorcycles={filteredMotorcycles} isLoading={isLoading} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}