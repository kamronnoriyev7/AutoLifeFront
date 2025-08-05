import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, MapPin, SlidersHorizontal } from 'lucide-react';
import { Service, ServiceCategory } from '../types';
import { getServices, getNearbyServices } from '../services/serviceService';
import { useGeolocation } from '../hooks/useGeolocation';
import ServiceCard from '../components/Common/ServiceCard';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import toast from 'react-hot-toast';

const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | ''>('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'distance'>('rating');
  const [searchParams] = useSearchParams();
  const { location, getCurrentLocation } = useGeolocation();

  useEffect(() => {
    const category = searchParams.get('category') as ServiceCategory;
    if (category) {
      setSelectedCategory(category);
    }
    loadServices();
  }, [location, searchParams]);

  const loadServices = async () => {
    try {
      setLoading(true);
      let fetchedServices: Service[];
      
      const filters = {
        search: searchTerm || undefined,
        category: selectedCategory || undefined,
        location: location || undefined,
      };

      if (location) {
        fetchedServices = await getNearbyServices(location, 25);
      } else {
        fetchedServices = await getServices(filters);
      }
      
      // Apply sorting
      const sortedServices = sortServices(fetchedServices, sortBy);
      setServices(sortedServices);
    } catch (error) {
      toast.error('Xizmatlarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const sortServices = (services: Service[], sortType: string): Service[] => {
    return [...services].sort((a, b) => {
      switch (sortType) {
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        case 'distance':
          // This would require distance calculation in real implementation
          return 0;
        default:
          return 0;
      }
    });
  };

  const handleSearch = () => {
    loadServices();
  };

  const handleFilterChange = () => {
    loadServices();
  };

  const categories = [
    { value: '', label: 'Barcha xizmatlar' },
    { value: ServiceCategory.TECHNICAL, label: 'Texnik xizmat' },
    { value: ServiceCategory.PARKING, label: 'Parkovka' },
    { value: ServiceCategory.GAS_STATION, label: 'Yoqilg\'i quyish' },
  ];

  const sortOptions = [
    { value: 'rating', label: 'Reytingga ko\'ra' },
    { value: 'price', label: 'Narxga ko\'ra' },
    { value: 'distance', label: 'Masofaga ko\'ra' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Xizmatlar</h1>
          <p className="text-gray-600">Avtomobilingiz uchun kerakli xizmatni toping va band qiling</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Xizmat nomini kiriting..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="lg:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value as ServiceCategory | '');
                  handleFilterChange();
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="lg:w-48">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as 'price' | 'rating' | 'distance');
                  handleFilterChange();
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>Qidirish</span>
            </button>
          </div>

          {/* Location Status */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {location ? (
                <div className="flex items-center space-x-2 text-green-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Joylashuv aniqlandi - yaqin xizmatlar ko'rsatilmoqda</span>
                </div>
              ) : (
                <button
                  onClick={getCurrentLocation}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Joylashuvni aniqlash</span>
                </button>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {services.length} ta xizmat topildi
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Xizmat topilmadi</h3>
            <p className="text-gray-500 mb-4">
              Qidiruv shartlaringizni o'zgartirib ko'ring yoki boshqa kategoriyani tanlang
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                handleFilterChange();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Barcha xizmatlarni ko'rsatish
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;