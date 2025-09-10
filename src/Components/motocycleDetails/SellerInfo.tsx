import React from 'react';
import { Button } from '@/Components/ui/button';
import { Phone, Mail, MessageSquare, Heart } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";

interface Motorcycle {
  seller_name?: string;
  contact_phone?: string;
  contact_email?: string;
  // Add other properties as needed
}

interface SellerInfoProps {
  motorcycle: Motorcycle;
}

export default function SellerInfo({ motorcycle }: SellerInfoProps) {
  const sellerInitial = motorcycle.seller_name ? motorcycle.seller_name[0].toUpperCase() : 'S';

  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <Avatar className="h-12 w-12 mr-4">
          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${motorcycle.seller_name}`} />
          <AvatarFallback>{sellerInitial}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {motorcycle.seller_name || 'Private Seller'}
          </h3>
          <p className="text-sm text-gray-500">Member since 2024</p>
        </div>
      </div>
      <div className="space-y-3">
        {motorcycle.contact_phone && (
          <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
            <Phone className="w-5 h-5 mr-3" />
            Call Seller
          </Button>
        )}
        {motorcycle.contact_email && (
          <Button size="lg" variant="outline" className="w-full">
            <Mail className="w-5 h-5 mr-3" />
            Email Seller
          </Button>
        )}
        <Button size="lg" variant="secondary" className="w-full">
          <MessageSquare className="w-5 h-5 mr-3" />
          Message Seller
        </Button>
        <Button size="lg" variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
          <Heart className="w-5 h-5 mr-3" />
          Save Motorcycle
        </Button>
      </div>
    </div>
  );
}