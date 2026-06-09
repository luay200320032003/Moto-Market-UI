import { useState, useEffect } from "react";
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

  const PAGE_SIZE = 12;

  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMake, setSelectedMake] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("any");
  const [selectedCondition, setSelectedCondition] = useState("any");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [yearRange, setYearRange] = useState<[number, number]>([1990, 2030]);
  const [sortBy, setSortBy] = useState("newest");

  // Reset to page 1 when filters change
  useEffect(() => { setCurrentPage(1); }, [selectedMake, selectedCategory, selectedCondition, priceRange, yearRange, sortBy, searchQuery]);

  // Fetch one page from the API
  useEffect(() => {
    let cancelled = false;
    const fetchPage = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const urlParams = Object.fromEntries(new URLSearchParams(location.search));
        const { motorcycles: bikes, hasNextPage: more } = await getMotorcycles({
          ...urlParams,
          page: currentPage,
          pageSize: PAGE_SIZE,
        });
        if (cancelled) return;
        setMotorcycles(bikes);
        setHasNextPage(more);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load motorcycles");
        setMotorcycles([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchPage();
    return () => { cancelled = true; };
  }, [currentPage, location.search]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedMake("all");
    setSelectedCategory("any");
    setSelectedCondition("any");
    setPriceRange([0, 100000]);
    setYearRange([1990, 2024]);
    setSortBy("newest");
  };

  // Client-side filter + sort on current page
  const pagedMotorcycles = motorcycles
    .filter((bike) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (![bike.title, bike.make, bike.model, bike.description].some((f) => f?.toLowerCase().includes(q))) return false;
      }
      if (selectedMake !== "all" && bike.make !== selectedMake) return false;
      if (selectedCategory !== "any" && bike.category !== selectedCategory) return false;
      if (selectedCondition !== "any" && bike.condition !== selectedCondition) return false;
      if (bike.price < priceRange[0] || bike.price > priceRange[1]) return false;
      if (bike.year < yearRange[0] || bike.year > yearRange[1]) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":    return (a.price || 0) - (b.price || 0);
        case "price-high":   return (b.price || 0) - (a.price || 0);
        case "year-new":     return (b.year || 0) - (a.year || 0);
        case "year-old":     return (a.year || 0) - (b.year || 0);
        case "mileage-low":  return (a.mileage || 0) - (b.mileage || 0);
        default:             return new Date(b.created_date!).getTime() - new Date(a.created_date!).getTime();
      }
    });

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
              {pagedMotorcycles.length} motorcycles on this page
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
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
          {(currentPage > 1 || hasNextPage) && (
            <div className="flex items-center justify-between mt-8 w-full border-t border-gray-200 pt-6">
              <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
                ← Prev
              </Button>
              <span className="text-sm text-gray-600">
                Page <span className="font-semibold text-gray-900">{currentPage}</span>
              </span>
              <Button variant="outline" disabled={!hasNextPage} onClick={() => setCurrentPage((p) => p + 1)}>
                Next →
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
