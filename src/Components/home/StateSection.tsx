import React from "react";
import { Users, Shield, Award, Truck } from "lucide-react";

interface StatsSectionProps {
  motorcyclesCount: number;
}

export default function StatsSection({ motorcyclesCount }: StatsSectionProps) {
  const stats = [
    {
      icon: Users,
      value: `${motorcyclesCount}+`,
      label: "Active Listings",
      color: "text-blue-600"
    },
    {
      icon: Shield,
      value: "100%",
      label: "Verified Sellers",
      color: "text-green-600"
    },
    {
      icon: Award,
      value: "4.8★",
      label: "Customer Rating",
      color: "text-yellow-600"
    },
    {
      icon: Truck,
      value: "Free",
      label: "Nationwide Shipping",
      color: "text-red-600"
    }
  ];

  return (
    <section className="py-12 bg-gray-50 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md mb-3 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}