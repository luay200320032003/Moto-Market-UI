import React, { useState, useEffect } from "react";
import { Motorcycle } from "../entities/Motorcycle";
import { useLocation } from "react-router-dom";
import { Search, Grid, List, SlidersHorizontal } from "lucide-react";
import { Button } from "../Components/ui/button";
import { Input } from "../Components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Components/ui/select";
import SearchFilters from "../Components/browse/SearchFilter";
import MotorcycleGrid from "../Components/browse/MotocycleGrid";
import MotorcycleList from "../Components/browse/MotocycleList";
import { getMotorcycles } from "../services/motorcycleService";

export default function Browse() {
  const location = useLocation();

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

// Load motorcycles from API
useEffect(() => {
  const fetchMotorcycles = async () => {
    setIsLoading(true);
    try {
      const params = Object.fromEntries(new URLSearchParams(location.search));
      const bikes = await getMotorcycles(params); //  Motorcycle[]
      setMotorcycles(bikes);
    } catch (err) {
      console.error("Failed to load motorcycles", err);
      setMotorcycles([]);
    } finally {
      setIsLoading(false);
    }
  };

  fetchMotorcycles();
}, [location.search])

  // Apply filters whenever motorcycles or filter states change
  useEffect(() => {
    let filtered = [...motorcycles];

    if (searchQuery) {
      filtered = filtered.filter(bike =>
        bike.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bike.make?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bike.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bike.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedMake !== "all") {
      filtered = filtered.filter(bike => bike.make === selectedMake);
    }

    if (selectedCategory !== "any") {
      filtered = filtered.filter(bike => bike.category === selectedCategory);
    }

    if (selectedCondition !== "any") {
      filtered = filtered.filter(bike => bike.condition === selectedCondition);
    }

    filtered = filtered.filter(bike =>
      bike.price >= priceRange[0] && bike.price <= priceRange[1] &&
      bike.year >= yearRange[0] && bike.year <= yearRange[1]
    );

    // Sorting
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
  }, [motorcycles, searchQuery, selectedMake, selectedCategory, selectedCondition, priceRange, yearRange, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedMake("all");
    setSelectedCategory("any");
    setSelectedCondition("any");
    setPriceRange([0, 100000]);
    setYearRange([1990, 2024]);
    setSortBy("newest");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Browse Motorcycles</h1>
            <p className="text-gray-600">{filteredMotorcycles.length} motorcycles available</p>
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
              <Button variant={viewMode === "grid" ? "default" : "ghost"} size="icon" onClick={() => setViewMode("grid")} className="rounded-r-none">
                <Grid className="w-4 h-4" />
              </Button>
              <Button variant={viewMode === "list" ? "default" : "ghost"} size="icon" onClick={() => setViewMode("list")} className="rounded-l-none">
                <List className="w-4 h-4" />
              </Button>
            </div>

            {/* Mobile Filters Toggle */}
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="md:hidden">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
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
                <Button variant="ghost" onClick={() => setShowFilters(false)}>Close</Button>
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
  );
}
