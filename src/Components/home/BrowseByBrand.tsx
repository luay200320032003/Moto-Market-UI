import React from 'react';
import { motion } from 'framer-motion';

const brands = [
  { name: 'Harley-Davidson', logo: 'https://cdn.worldvectorlogo.com/logos/harley-davidson-1.svg' },
  { name: 'Honda', logo: 'https://cdn.worldvectorlogo.com/logos/honda-9.svg' },
  { name: 'Yamaha', logo: 'https://cdn.worldvectorlogo.com/logos/yamaha-2-1.svg' },
  { name: 'Kawasaki', logo: 'https://cdn.worldvectorlogo.com/logos/kawasaki-1-1.svg' },
  { name: 'Suzuki', logo: 'https://cdn.worldvectorlogo.com/logos/suzuki-8.svg' },
  { name: 'BMW', logo: 'https://cdn.worldvectorlogo.com/logos/bmw-2.svg' },
  { name: 'Ducati', logo: 'https://cdn.worldvectorlogo.com/logos/ducati-6.svg' },
  { name: 'Indian', logo: 'https://cdn.worldvectorlogo.com/logos/indian-motorcycle-1-1.svg' }
];

export default function BrowseByBrand() {
  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-center text-white mb-10">
          Browse Top Brands
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-center p-4 bg-gray-800 rounded-lg grayscale hover:grayscale-0 hover:bg-white transition-all duration-300"
            >
              <img src={brand.logo} alt={brand.name} className="h-10 w-auto" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}