import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Motorcycle } from "../entities/Motorcycle";
import { getMotorcycleById } from "../services/motorcycleDetailService";

export default function Motocycle() {
  const [motorcycle, setMotorcycle] = useState<Motorcycle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchParams] = useSearchParams();
  const motorcycleId = searchParams.get("id");

  useEffect(() => {
    if (!motorcycleId) {
      setError("Motorcycle ID is missing in the URL");
      setIsLoading(false);
      return;
    }

    const fetchMotorcycle = async () => {
      try {
        setIsLoading(true);
        const bike = await getMotorcycleById(motorcycleId);
        setMotorcycle(bike);
      } catch (err: any) {
        console.error("Error fetching motorcycle:", err);
        setError("Failed to fetch motorcycle details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMotorcycle();
  }, [motorcycleId]);

  if (isLoading)
    return <div className="text-center py-10 text-gray-600 text-lg">Loading motorcycle details...</div>;

  if (error)
    return <div className="text-red-500 text-center py-10 font-semibold">{error}</div>;

  if (!motorcycle)
    return <div className="text-center py-10 text-gray-600">Motorcycle not found.</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-8 border border-gray-100">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
        {motorcycle.title}
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Image Section */}
        <div className="flex-1 flex justify-center">
          {motorcycle.image_urls?.length ? (
            <img
              src={motorcycle.image_urls[0]}
              alt={motorcycle.title}
              className="rounded-xl w-full max-w-md object-cover shadow-md border border-gray-200"
            />
          ) : (
            <div className="bg-gray-100 h-64 w-full max-w-md flex items-center justify-center rounded-lg text-gray-500">
              No image available
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="flex-1 space-y-3 text-gray-800">
          <Detail label="Make" value={motorcycle.make} />
          <Detail label="Model" value={motorcycle.model} />
          <Detail label="Year" value={motorcycle.year?.toString()} />
          <Detail label="Price" value={`$${motorcycle.price?.toLocaleString()}`} />
          <Detail label="Mileage" value={motorcycle.mileage ? `${motorcycle.mileage.toLocaleString()} mi` : "N/A"} />
          <Detail label="Condition" value={motorcycle.condition} />
          <Detail label="Engine" value={motorcycle.engine_size?.toString() || "N/A"} />
          <Detail label="Fuel Type" value={motorcycle.fuel_type || "N/A"} />
          <Detail label="Color" value={motorcycle.color || "N/A"} />
          <Detail label="Location" value={motorcycle.location || "N/A"} />
          <Detail label="Dealer" value={motorcycle.seller_name} />
          {motorcycle.contact_phone && <Detail label="Phone" value={motorcycle.contact_phone} />}
          {motorcycle.contact_email && <Detail label="Email" value={motorcycle.contact_email} />}
          {motorcycle.description && (
            <Detail
              label="Description"
              value={motorcycle.description}
              isMultiline
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* Small reusable component for cleaner layout */
function Detail({
  label,
  value,
  isMultiline = false,
}: {
  label: string;
  value: string | number | undefined;
  isMultiline?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <span className="font-semibold text-gray-700">{label}</span>
      <span
        className={`text-gray-900 ${isMultiline ? "whitespace-pre-line" : ""}`}
      >
        {value || "N/A"}
      </span>
    </div>
  );
}
