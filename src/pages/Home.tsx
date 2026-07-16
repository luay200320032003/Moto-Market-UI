import React, { useState, useEffect } from "react";
import { Motorcycle, listMotorcycles } from "../Entities/Motorcycle";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Search, ChevronRight, Star, MapPin, Calendar, Gauge } from "lucide-react";
import { Button } from "../Components/ui/button";
import { Input } from "@/Components/ui/input";
import { motion } from 'framer-motion';

import HeroSection from "../Components/home/HeroSection";
import FeaturedMotorcycles from "../Components/home/FeatureMotocycles";
import RecentListings from "../Components/home/RecentListing";
import CategoryGrid from "../Components/home/CategoryGrid";
import StatsSection from "../Components/home/StateSection";
import WhyChooseUs from "../Components/home/WhyChooseUs";
import BrowseByBrand from "../Components/home/BrowseByBrand";
import { useNavigate } from "react-router-dom";
 

export default function Home() {
const navigate = useNavigate();

  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Motorcycle[]>([]);
  useEffect(() => {
    loadMotorcycles();
  }, []);

  const loadMotorcycles = async () => {
    try {
      const data = await listMotorcycles("-created_date", 50);
      setMotorcycles(data);
    } catch (error) {
      console.error("Error loading motorcycles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
        navigate(`/Browse?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate("/Browse");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const featuredMotorcycles = motorcycles
    .filter(bike => bike.featured)
    .map(bike => ({
      ...bike,
      location: bike.location ?? "",
    }))
    .slice(0, 6);

  return (
    <div className="min-h-screen">
      <HeroSection 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        onKeyPress={handleKeyPress}
      />

      <StatsSection motorcyclesCount={motorcycles.length} />

      <WhyChooseUs />

      <CategoryGrid />

      {featuredMotorcycles.length > 0 && (
        <FeaturedMotorcycles 
          motorcycles={featuredMotorcycles}
          isLoading={isLoading}
        />
      )}

      <BrowseByBrand />

      <RecentListings motorcycles={motorcycles} isLoading={isLoading} />

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Sell Your Motorcycle?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of sellers who trust MotoTrade to connect with serious buyers
          </p>
          <Link to={createPageUrl("Sell")}>
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-lg px-8 py-3 ring-2 ring-red-600 ring-offset-4 ring-offset-gray-900 transition-all hover:ring-red-500">
              List Your Bike
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
