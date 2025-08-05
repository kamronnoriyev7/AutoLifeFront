import React from 'react';
import { Star, MapPin, Clock, Car } from 'lucide-react';
import { Service, ServiceCategory } from '../../types';
import { Link } from 'react-router-dom';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const getCategoryIcon = (category: ServiceCategory) => {
    switch (category) {
      case ServiceCategory.TECHNICAL:
        return <Car className="w-5 h-5" />;
      case ServiceCategory.PARKING:
        return <MapPin className="w-5 h-5" />;
      case ServiceCategory.GAS_STATION:
        return <Clock className="w-5 h-5" />;
      default:
        return <Car className="w-5 h-5" />;
    }
  };

  const getCategoryName = (category: ServiceCategory) => {
    switch (category) {
      case ServiceCategory.TECHNICAL:
        return 'Texnik xizmat';
      case ServiceCategory.PARKING:
        return 'Parkovka';
      case ServiceCategory.GAS_STATION:
        return 'Yoqilg\'i quyish';
      default:
        return 'Xizmat';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative">
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {getCategoryIcon(service.category)}
            <span className="ml-1">{getCategoryName(service.category)}</span>
          </span>
        </div>
        {!service.isAvailable && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Mavjud emas
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {service.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {service.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-900">{service.rating}</span>
            <span className="text-sm text-gray-500">({service.provider.rating} ta sharh)</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-blue-600">{service.price.toLocaleString()}</span>
            <span className="text-sm text-gray-500 ml-1">so'm</span>
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-500 mb-4">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="truncate">{service.provider.address}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            <span>{service.duration} daqiqa</span>
          </div>
          <Link
            to={`/services/${service.id}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              service.isAvailable
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {service.isAvailable ? 'Batafsil' : 'Mavjud emas'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;