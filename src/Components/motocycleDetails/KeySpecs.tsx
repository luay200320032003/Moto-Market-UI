import React from 'react';
import { Gauge, Tag, Palette, Calendar, MapPin, GitCommit } from 'lucide-react';

const specs = [
  { key: 'mileage', icon: Gauge, label: 'Mileage', format: (val: number) => `${val.toLocaleString()} mi` },
  { key: 'category', icon: Tag, label: 'Category' },
  { key: 'color', icon: Palette, label: 'Color' },
  { key: 'year', icon: Calendar, label: 'Year' },
  { key: 'engine_size', icon: GitCommit, label: 'Engine', format: (val: number) => `${val} cc` },
  { key: 'location', icon: MapPin, label: 'Location' },
];

type Motorcycle = {
  mileage?: number;
  category?: string;
  color?: string;
  year?: number;
  engine_size?: number;
  location?: string;
};

export default function KeySpecs({ motorcycle }: { motorcycle: Motorcycle }) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <div className="grid grid-cols-2 gap-x-4 gap-y-5">
        {specs.map((spec) => {
          const value = motorcycle[spec.key as keyof Motorcycle];
          if (!value) return null;
          
          return (
            <div key={spec.key} className="flex items-start">
              <div className="flex-shrink-0 w-8 text-gray-400">
                <spec.icon className="w-5 h-5" />
              </div>
              <div>
                <dt className="text-sm text-gray-500">{spec.label}</dt>
                <dd className="text-base font-medium text-gray-900 capitalize">
                  {spec.format && typeof value === 'number' ? spec.format(value) : value}
                </dd>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}