import React, { useState, useEffect } from "react";
import { Motorcycle } from "../entities/Motorcycle";
import { useLocation } from "react-router-dom";
import { Search, Grid, List, SlidersHorizontal } from "lucide-react";
import { Button } from "../Components/ui/button";
import { Input } from "../Components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../Components/ui/select";
import SearchFilters from "../Components/browse/SearchFilter";
import MotorcycleGrid from "../Components/browse/MotocycleGrid";
import MotorcycleList from "../Components/browse/MotocycleList";
import { getMotorcycles } from "../services/MotorcycleService";

export default function Browse() {
  const location = useLocation();

  // States
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [filteredMotorcycles, setFilteredMotorcycles] = useState<Motorcycle[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const maxRecords = 70; // backend fetch limit
  const uiPageSize = 12; // show 10 items per page in UI
  const fetchPageSize = 50; // backend fetch per API call

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMake, setSelectedMake] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("any");
  const [selectedCondition, setSelectedCondition] = useState("any");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [yearRange, setYearRange] = useState<[number, number]>([1990, 2030]);
  const [sortBy, setSortBy] = useState("newest");

  // Fetch motorcycles from backend (up to maxRecords)
  useEffect(() => {
    const fetchMotorcycles = async () => {
      setIsLoading(true);

      try {
        setError(null);
        const params = Object.fromEntries(new URLSearchParams(location.search));
        let allBikes: Motorcycle[] = [];
        let page = 1;

        console.log("🚀 Fetching motorcycles with params:", params);

        while (allBikes.length < maxRecords) {
          const bikes: Motorcycle[] = await getMotorcycles({
            ...params,
            page,
            pageSize: fetchPageSize,
          });
          console.log(`📦 Page ${page} returned ${bikes?.length || 0} bikes`);
          
          if (!bikes || bikes.length === 0) break;

          allBikes = [...allBikes, ...bikes];
          if (allBikes.length >= maxRecords) break;
          page++;
        }

        console.log(`✅ Loaded ${allBikes.length} total motorcycles`);
        setMotorcycles(allBikes.slice(0, maxRecords));
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to load motorcycles";
        console.error("❌ Error:", errorMsg, err);
        setError(errorMsg);
        setMotorcycles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMotorcycles();
  }, [location.search]);

  // Apply filters
  useEffect(() => {
    let filtered = [...motorcycles];

    if (searchQuery) {
      filtered = filtered.filter(
        (bike) =>
          bike.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bike.make?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bike.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bike.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedMake !== "all")
      filtered = filtered.filter((bike) => bike.make === selectedMake);
    if (selectedCategory !== "any")
      filtered = filtered.filter((bike) => bike.category === selectedCategory);
    if (selectedCondition !== "any")
      filtered = filtered.filter(
        (bike) => bike.condition === selectedCondition
      );

    filtered = filtered.filter(
      (bike) =>
        bike.price >= priceRange[0] &&
        bike.price <= priceRange[1] &&
        bike.year >= yearRange[0] &&
        bike.year <= yearRange[1]
    );

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
      default:
        filtered.sort(
          (a, b) =>
            new Date(b.created_date!).getTime() -
            new Date(a.created_date!).getTime()
        );
    }

    setFilteredMotorcycles(filtered);
    setCurrentPage(1); // reset to first page on filter change
  }, [
    motorcycles,
    searchQuery,
    selectedMake,
    selectedCategory,
    selectedCondition,
    priceRange,
    yearRange,
    sortBy,
  ]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedMake("all");
    setSelectedCategory("any");
    setSelectedCondition("any");
    setPriceRange([0, 100000]);
    setYearRange([1990, 2024]);
    setSortBy("newest");
  };

  // Slice filtered motorcycles for current UI page
  const startIndex = (currentPage - 1) * uiPageSize;
  const endIndex = startIndex + uiPageSize;
  const pagedMotorcycles = filteredMotorcycles.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Browse Motorcycles
            </h1>
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
              <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters
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
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 font-medium">⚠️ Error loading motorcycles:</p>
              <p className="text-red-700">{error}</p>
              <p className="text-sm text-red-600 mt-2">Check browser console for more details.</p>
            </div>
          )}
          
          {viewMode === "grid" ? (
            <MotorcycleGrid
              motorcycles={pagedMotorcycles}
              isLoading={isLoading}
            />
          ) : (
            <MotorcycleList
              motorcycles={pagedMotorcycles}
              isLoading={isLoading}
            />
          )}

          {/* Pagination */}
          <div className="flex justify-center mt-6 space-x-2">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Prev
            </Button>

            {Array.from(
              { length: Math.ceil(filteredMotorcycles.length / uiPageSize) },
              (_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              )
            )}

            <Button
              disabled={
                currentPage ===
                Math.ceil(filteredMotorcycles.length / uiPageSize)
              }
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
