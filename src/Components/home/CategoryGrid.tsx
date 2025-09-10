import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";

const categories = [
  {
    name: "Sport",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    count: "1,240",
    color: "from-red-600 to-red-700"
  },
  {
    name: "Cruiser",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400",
    count: "890",
    color: "from-blue-600 to-blue-700"
  },
  {
    name: "Touring",
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400",
    count: "650",
    color: "from-green-600 to-green-700"
  },
  {
    name: "Adventure",
    image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400",
    count: "420",
    color: "from-orange-600 to-orange-700"
  },
  {
    name: "Dirt",
    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=400",
    count: "380",
    color: "from-yellow-600 to-yellow-700"
  },
  {
    name: "Standard",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400",
    count: "290",
    color: "from-purple-600 to-purple-700"
  }
];

export default function CategoryGrid() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find the perfect motorcycle that matches your riding style and preferences
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={createPageUrl(`Browse?category=${category.name.toLowerCase()}`)}
              className="group"
            >
              <div className="relative overflow-hidden rounded-xl aspect-square">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60 group-hover:opacity-70 transition-opacity`}></div>
                <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                  <h3 className="font-bold text-lg mb-1">{category.name}</h3>
                  <p className="text-sm opacity-90">{category.count} bikes</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}