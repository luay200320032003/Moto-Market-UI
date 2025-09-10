import React from "react";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Slider } from "../ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { X } from "lucide-react";

type Motorcycle = {
  make?: string;
  category?: string;
  [key: string]: any;
};

type SearchFiltersProps = {
  motorcycles: Motorcycle[];
  selectedMake: string;
  setSelectedMake: (make: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedCondition: string;
  setSelectedCondition: (condition: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  yearRange: [number, number];
  setYearRange: (range: [number, number]) => void;
  onClearFilters: () => void;
};

export default function SearchFilters({
  motorcycles,
  selectedMake,
  setSelectedMake,
  selectedCategory,
  setSelectedCategory,
  selectedCondition,
  setSelectedCondition,
  priceRange,
  setPriceRange,
  yearRange,
  setYearRange,
  onClearFilters
}: SearchFiltersProps) {
  // Get unique values for dropdowns
  const makes = [...new Set(motorcycles.map(bike => bike.make).filter((make): make is string => typeof make === "string"))].sort();
  const categories = [...new Set(motorcycles.map(bike => bike.category).filter((category): category is string => typeof category === "string"))].sort();
  const conditions = ["new", "excellent", "good", "fair", "poor"];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        <Button variant="ghost" size="sm" onClick={onClearFilters}>
          <X className="w-4 h-4 mr-1" />
          Clear All
        </Button>
      </div>

      {/* Make Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Make</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedMake} onValueChange={setSelectedMake}>
            <SelectTrigger>
              <SelectValue placeholder="Any Make" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any Make</SelectItem>
              {makes.map(make => (
                <SelectItem key={make} value={make}>{make}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Category</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Any Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any Category</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Condition Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Condition</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedCondition} onValueChange={setSelectedCondition}>
            <SelectTrigger>
              <SelectValue placeholder="Any Condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any Condition</SelectItem>
              {conditions.map(condition => (
                <SelectItem key={condition} value={condition}>
                  {condition.charAt(0).toUpperCase() + condition.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Price Range Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={0}
            max={100000}
            step={1000}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>${priceRange[0].toLocaleString()}</span>
            <span>${priceRange[1].toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Year Range Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Year Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={yearRange}
            onValueChange={setYearRange}
            min={1990}
            max={2024}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{yearRange[0]}</span>
            <span>{yearRange[1]}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}