import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { createPageUrl } from "../../utils";
import type { Motorcycle } from "../../Entities/Motorcycle";

const FALLBACK = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

interface SponsoredStripProps {
  motorcycles: Motorcycle[];
  isLoading?: boolean;
}

export default function SponsoredStrip({ motorcycles, isLoading }: SponsoredStripProps) {
  const picks = useMemo(() => shuffle(motorcycles).slice(0, 50), [motorcycles]);
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = () => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 4);
  };

  const scrollByPage = (direction: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: "smooth" });
  };

  const items = isLoading ? Array(10).fill(null) : picks;

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [items.length]);

  if (!isLoading && picks.length === 0) return null;

  return (
    <section className="bg-gray-50 py-6 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs font-semibold tracking-widest text-gray-400">SPONSORED</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="relative">
          <div
            ref={trackRef}
            onScroll={updateEdges}
            className="flex gap-4 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {items.map((bike: Motorcycle | null, i: number) => {
              if (!bike) {
                return (
                  <div
                    key={i}
                    className="shrink-0 w-[46%] sm:w-[31%] md:w-[23%] lg:w-[18.4%] animate-pulse"
                  >
                    <div className="aspect-[4/3] bg-gray-200 rounded-lg mb-2" />
                    <div className="h-4 w-3/4 bg-gray-200 rounded" />
                  </div>
                );
              }

              const isListing = bike.source === "listing";
              const detailUrl = createPageUrl(`Motorcycle?id=${bike.id}${isListing ? "&type=listing" : ""}`);
              const photo = bike.image_urls?.[0] || bike.image || FALLBACK;

              return (
                <Link
                  key={bike.id}
                  to={detailUrl}
                  className="shrink-0 w-[46%] sm:w-[31%] md:w-[23%] lg:w-[18.4%] group"
                >
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={photo}
                      alt={bike.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK;
                      }}
                    />
                    <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-sm font-bold px-2 py-1">
                      ${bike.price?.toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-800 truncate group-hover:text-red-600 transition-colors">
                    {bike.year} {bike.make} {bike.model}
                  </p>
                </Link>
              );
            })}

            {!isLoading && picks.length > 0 && (
              <Link
                to={createPageUrl("Browse")}
                className="shrink-0 w-[46%] sm:w-[31%] md:w-[23%] lg:w-[18.4%] group"
              >
                <div className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-white text-gray-500 group-hover:border-red-300 group-hover:text-red-600 transition-colors">
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  <span className="text-sm font-semibold">See More</span>
                </div>
              </Link>
            )}
          </div>

          {!atStart && (
            <button
              onClick={() => scrollByPage(-1)}
              aria-label="Scroll left"
              className="absolute -left-4 top-[38%] -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700 shadow-md border border-gray-200 hover:bg-gray-50 hover:text-red-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {!atEnd && (
            <button
              onClick={() => scrollByPage(1)}
              aria-label="Scroll right"
              className="absolute -right-4 top-[38%] -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700 shadow-md border border-gray-200 hover:bg-gray-50 hover:text-red-600 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
