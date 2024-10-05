import React from 'react';
import { Phone, Mail } from 'lucide-react';

interface BusinessCardProps {
  name: string;
  description: string;
  phone: string;
  email: string;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ name, description, phone, email }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-xl font-bold mb-2">{name}</h3>
      <p className="text-gray-600 mb-2">{description}</p>
      <div className="flex items-center mb-1">
        <Phone size={18} className="mr-2 text-blue-500" />
        <a href={`tel:${phone}`} className="text-blue-500 hover:underline">
          {phone}
        </a>
      </div>
      <div className="flex items-center">
        <Mail size={18} className="mr-2 text-blue-500" />
        <a href={`mailto:${email}`} className="text-blue-500 hover:underline">
          {email}
        </a>
      </div>
    </div>
  );
};

export default BusinessCard;