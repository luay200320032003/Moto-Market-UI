import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Motorcycle } from "../entities/Motorcycle";
import { getMotorcycleById, getMotorcycles } from "../services/MotorcycleService";

export default function Motocycle() {
  const [motorcycle, setMotorcycle] = useState<Motorcycle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [similar, setSimilar] = useState<Motorcycle[]>([]);

  const [searchParams] = useSearchParams();
  const motorcycleId = searchParams.get("id");

  useEffect(() => {
    if (!motorcycleId) {
      setError("Motorcycle ID is missing in the URL");
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const bike = await getMotorcycleById(motorcycleId);
        setMotorcycle(bike);

        // Fetch similar bikes
        const bikes = await getMotorcycles({ limit: 4 });
        setSimilar(bikes.filter((b) => b.id.toString() !== motorcycleId).slice(0, 4));
      } catch (err: any) {
        console.error("Error fetching motorcycle:", err);
        setError("Failed to fetch motorcycle details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [motorcycleId]);

 if (isLoading)
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-8 border border-gray-100 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-2/3 mx-auto mb-6"></div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Image skeleton */}
        <div className="flex-1 flex justify-center">
          <div className="bg-gray-200 rounded-xl w-full max-w-md h-72"></div>
        </div>

        {/* Details skeleton */}
        <div className="flex-1 space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-5 bg-gray-300 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );


  if (error)
    return <div className="text-red-500 text-center py-10 font-semibold">{error}</div>;

  if (!motorcycle)
    return <div className="text-center py-10 text-gray-600">Motorcycle not found.</div>;
  const mainImage = motorcycle.image_urls?.find(
    (url) => typeof url === "string" && url.trim() !== "" && url.startsWith("http") && !url.includes("youtube.com")
  );
  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 mt-8 rounded-2xl shadow-sm border border-gray-200">
      {/* Title & Price */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">{motorcycle.title}</h1>
        <div className="text-right">
          <p className="text-3xl font-extrabold text-green-600">${motorcycle.price.toLocaleString()}</p>
          {motorcycle.mileage && (
            <p className="text-gray-600">{motorcycle.mileage.toLocaleString()} miles</p>
          )}
        </div>
      </div>

      {/* Image and Info */}
       <div className="grid md:grid-cols-2 gap-8">
        <div>
          {mainImage ? (
            <img
              src={mainImage}
              alt={motorcycle.title}
              className="rounded-xl w-full h-[400px] object-cover shadow-md border border-gray-200"
            />
          ) : (
            <div className="bg-gray-100 h-[400px] flex items-center justify-center rounded-lg text-gray-500">
              No image available
            </div>
          )}
        </div>

        {/* Motorcycle Specs */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Specifications</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-gray-700">
            <Detail label="Make" value={motorcycle.make} />
            <Detail label="Model" value={motorcycle.model} />
            <Detail label="Trim" value={motorcycle.description?.split("-")[0] || "N/A"} />
            <Detail label="Year" value={motorcycle.year.toString()} />
            <Detail label="VIN" value={(motorcycle as any).vin || "N/A"} />
            <Detail label="Color" value={motorcycle.color || "N/A"} />
            <Detail label="Engine" value={(motorcycle as any).build?.engine || motorcycle.engine_size || "N/A"} />
            <Detail label="Transmission" value={(motorcycle as any).build?.transmission || "N/A"} />
            <Detail label="Drivetrain" value={(motorcycle as any).build?.drivetrain || "N/A"} />
            <Detail label="Fuel Type" value={motorcycle.fuel_type || "Gasoline"} />
            <Detail label="Condition" value={motorcycle.condition} />
            <Detail label="MSRP" value={(motorcycle as any).msrp ? `$${(motorcycle as any).msrp}` : "N/A"} />
          </div>
        </div>
      </div>

      {/* Dealer Info */}
      <div className="mt-10 grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Dealer Information</h2>
          <p className="font-bold text-gray-900">{motorcycle.seller_name}</p>
          <p className="text-gray-700">{motorcycle.location}</p>
          <p className="text-gray-700">{(motorcycle as any).dealer?.street}</p>
          <p className="text-gray-700">
            {(motorcycle as any).dealer?.city}, {(motorcycle as any).dealer?.state}{" "}
            {(motorcycle as any).dealer?.zip}
          </p>
          <a
            href={`https://${(motorcycle as any).dealer?.website}`}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            Visit Dealer Website
          </a>
        </div>

        {/* Contact Form */}
        <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Contact Dealer</h2>
          <form className="space-y-3">
            <input type="text" placeholder="Full Name *" className="border p-2 rounded-md w-full" />
            <input type="email" placeholder="Email *" className="border p-2 rounded-md w-full" />
            <input type="tel" placeholder="Phone (optional)" className="border p-2 rounded-md w-full" />
            <textarea
              rows={3}
              placeholder={`I'm interested in the ${motorcycle.title}`}
              className="border p-2 rounded-md w-full"
            ></textarea>
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 w-full transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Similar Bikes */}
      {similar.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Similar Motorcycles</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similar.map((bike) => (
              <Link
                key={bike.id}
                to={`/Motorcycle?id=${bike.id}`}
                className="block bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden border border-gray-100"
              >
                <img
                  src={bike.image || bike.image_urls[0]}
                  alt={bike.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800">{bike.title}</h3>
                  <p className="text-sm text-gray-600">{bike.make}</p>
                  <p className="text-green-600 font-bold mt-2">${bike.price.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string | number | undefined }) {
  return (
    <div>
      <span className="block text-sm text-gray-500">{label}</span>
      <span className="font-medium text-gray-800">{value || "N/A"}</span>
    </div>
  );
}
