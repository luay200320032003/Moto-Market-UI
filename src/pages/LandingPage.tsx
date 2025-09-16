import { useState } from "react";
import HeroSection from "../Components/home/HeroSection";

export default function LandingPage() {
  const [search, setSearch] = useState("");

  const motorcycles = [
    { id: 1, make: "Honda", model: "CBR600RR", price: 8500, image: "https://picsum.photos/400/250?random=1", dealer: "Fast Bikes Dealer" },
    { id: 2, make: "Yamaha", model: "MT-07", price: 7200, image: "https://picsum.photos/400/250?random=2", dealer: "Moto World" },
    { id: 3, make: "Kawasaki", model: "Ninja ZX-6R", price: 9500, image: "https://picsum.photos/400/250?random=3", dealer: "Green Speed" },
  ];

  const filtered = motorcycles.filter(
    (m) =>
      m.make.toLowerCase().includes(search.toLowerCase()) ||
      m.model.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
       <HeroSection
       searchQuery={search}
       setSearchQuery={setSearch}
       onSearch={() => {}}
     />
 

      {/* Search Bar */}
      <section className="max-w-3xl mx-auto mt-10 px-4">
        <input
          type="text"
          placeholder="Search by make or model..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </section>

      {/* Motorcycle Listings */}
      <section className="max-w-6xl mx-auto mt-12 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((m) => (
          <div key={m.id} className="bg-white rounded-2xl shadow hover:shadow-lg transition p-4">
            <img src={m.image} alt={`${m.make} ${m.model}`} className="rounded-lg w-full h-48 object-cover" />
            <h2 className="mt-3 text-xl font-semibold">{m.make} {m.model}</h2>
            <p className="text-gray-600">${m.price.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Dealer: {m.dealer}</p>
            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700">
              View Details
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
