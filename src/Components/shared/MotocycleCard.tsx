import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { MapPin, Gauge, Calendar, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const FALLBACK = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400";

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
  source?: string;
}

interface MotorcycleCardProps {
  motorcycle: Motorcycle;
  index: number;
}

export default function MotorcycleCard({ motorcycle, index }: MotorcycleCardProps) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [fading, setFading] = useState(false);

  if (!motorcycle) return null;

  const isListing = motorcycle.source === "listing";
  const detailUrl = createPageUrl(`Motorcycle?id=${motorcycle.id}${isListing ? "&type=listing" : ""}`);
  const photos = motorcycle.image_urls?.length ? motorcycle.image_urls : [FALLBACK];
  const hasMultiple = photos.length > 1;

  // Preload all photos so arrows feel instant
  useEffect(() => {
    photos.forEach((src) => { const img = new Image(); img.src = src; });
  }, []);

  const goTo = (newIndex: number) => {
    setFading(true);
    setTimeout(() => { setPhotoIndex(newIndex); setFading(false); }, 120);
  };

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    goTo((photoIndex - 1 + photos.length) % photos.length);
  };

  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    goTo((photoIndex + 1) % photos.length);
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: (index % 4) * 0.1 }}
      className="relative"
    >
      <div
        className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image area */}
        <div className="relative h-56 bg-gray-100">
          <Link to={detailUrl}>
            <img
              src={photos[photoIndex]}
              alt={motorcycle.title}
              className="w-full h-full object-cover"
              style={{
                transform: hovered ? 'scale(1.05)' : 'scale(1)',
                opacity: fading ? 0 : 1,
                transition: 'opacity 0.12s ease, transform 0.5s ease',
              }}
              onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
            />
          </Link>

          {/* Arrows */}
          {hasMultiple && hovered && (
            <>
              <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white hover:bg-black/80 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white hover:bg-black/80 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Dot indicators */}
          {hasMultiple && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1">
              {photos.map((_, i) => (
                <span
                  key={i}
                  className={`block h-1.5 rounded-full transition-all duration-200 ${i === photoIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"}`}
                />
              ))}
            </div>
          )}

          {/* Photo counter */}
          {hasMultiple && hovered && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 rounded-full bg-black/50 px-2 py-0.5 text-[11px] text-white">
              {photoIndex + 1} / {photos.length}
            </div>
          )}

          {/* Condition badge */}
          <div className="absolute top-3 left-3 z-10">
            <Badge className={`capitalize ${motorcycle.condition === 'new' ? 'bg-green-600 text-white' : 'bg-white/90 backdrop-blur-sm text-gray-800'}`}>
              {motorcycle.condition}
            </Badge>
          </div>

          {/* Price */}
          <div className="absolute top-3 right-3 z-10">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              ${motorcycle.price?.toLocaleString()}
            </span>
          </div>

          {motorcycle.featured && (
            <div className="absolute bottom-3 left-3 z-10">
              <Badge className="bg-yellow-400 text-yellow-900 border-yellow-500 font-semibold">
                Featured
              </Badge>
            </div>
          )}
        </div>

        {/* Card body */}
        <Link to={detailUrl}>
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
        </Link>
      </div>

      {/* Favourite button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-12 right-4 z-20 bg-white/80 backdrop-blur-sm hover:bg-white hover:text-red-500 rounded-full w-9 h-9 opacity-0 hover:opacity-100 transition-opacity"
        onClick={(e) => e.preventDefault()}
      >
        <Heart className="w-4 h-4" />
      </Button>
    </motion.div>
  );
}
