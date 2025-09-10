import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { MapPin, Gauge, Calendar, Heart } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

interface Motorcycle {
  id: string | number;
  image_urls?: string[];
  title: string;
  condition: string;
  price?: number;
  featured?: boolean;
  year: number | string;
  make: string;
  model: string;
  mileage?: number;
  location: string;
}

interface MotorcycleCardProps {
  motorcycle: Motorcycle;
  index: number;
}

export default function MotorcycleCard({ motorcycle, index }: MotorcycleCardProps) {
  if (!motorcycle) return null;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: (index % 4) * 0.1 }}
      className="group relative"
    >
      <Link to={createPageUrl(`Motorcycle?id=${motorcycle.id}`)}>
        <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 border border-gray-100">
          <div className="relative h-56 overflow-hidden">
            <img
              src={motorcycle.image_urls?.[0] || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"}
              alt={motorcycle.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3">
              <Badge className={`capitalize ${motorcycle.condition === 'new' ? 'bg-green-600 text-white' : 'bg-white/90 backdrop-blur-sm text-gray-800'}`}>
                {motorcycle.condition}
              </Badge>
            </div>
            <div className="absolute top-3 right-3">
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                ${motorcycle.price?.toLocaleString()}
              </span>
            </div>
            {motorcycle.featured && (
              <div className="absolute bottom-3 left-3">
                <Badge className="bg-yellow-400 text-yellow-900 border-yellow-500 font-semibold">
                  Featured
                </Badge>
              </div>
            )}
          </div>
          
          <div className="p-5">
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-1">
              {motorcycle.year} {motorcycle.make} {motorcycle.model}
            </h3>
            
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <Gauge className="w-4 h-4 mr-2 text-gray-400" />
                <span>{motorcycle.mileage?.toLocaleString()} mi</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                <span>{motorcycle.year}</span>
              </div>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
              <span>{motorcycle.location}</span>
            </div>
          </div>
        </div>
      </Link>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-12 right-4 bg-white/80 backdrop-blur-sm hover:bg-white hover:text-red-500 rounded-full w-9 h-9 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => { e.preventDefault(); /* Add to favorites logic */ }}
      >
        <Heart className="w-4 h-4" />
      </Button>
    </motion.div>
  );
}