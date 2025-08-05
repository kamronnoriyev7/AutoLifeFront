import React, { useState, useEffect } from 'react';
import { Search, MapPin, Car, Fuel, ParkingCircle, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Service, ServiceCategory } from '../types';
import { getServices, getNearbyServices } from '../services/serviceService';
import { useGeolocation } from '../hooks/useGeolocation';
import ServiceCard from '../components/Common/ServiceCard';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import toast from 'react-hot-toast';

const HomePage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | ''>('');
  const { location, error: locationError, getCurrentLocation } = useGeolocation();

  useEffect(() => {
    loadServices();
  }, [location]);

  const loadServices = async () => {
    try {
      setLoading(true);
      let fetchedServices: Service[];
      
      if (location) {
        // Get nearby services if location is available
        fetchedServices = await getNearbyServices(location, 10);
      } else {
        // Get all services if location is not available
        fetchedServices = await getServices();
      }
      
      setServices(fetchedServices.slice(0, 8)); // Show only first 8 services on home page
    } catch (error) {
      toast.error('Xizmatlarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadServices();
      return;
    }

    try {
      setLoading(true);
      const filters = {
        search: searchTerm,
        category: selectedCategory || undefined,
        location: location || undefined,
      };
      const searchResults = await getServices(filters);
      setServices(searchResults.slice(0, 8));
    } catch (error) {
      toast.error('Qidirishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    {
      id: ServiceCategory.TECHNICAL,
      name: 'Texnik xizmat',
      icon: Car,
      description: 'Moy almashtirish, ta\'mirlash',
      color: 'bg-blue-500',
    },
    {
      id: ServiceCategory.PARKING,
      name: 'Parkovka',
      icon: ParkingCircle,
      description: 'Xavfsiz parkovka joylari',
      color: 'bg-green-500',
    },
    {
      id: ServiceCategory.GAS_STATION,
      name: 'Yoqilg\'i quyish',
      icon: Fuel,
      description: 'Eng yaqin zapravkalar',
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              AutoLife da avtomobilingiz uchun
              <span className="block text-yellow-400">barcha xizmatlar</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Texnik xizmat, parkovka va yoqilg'i quyish xizmatlarini bir joyda topib, band qiling
            </p>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto bg-white rounded-2xl p-4 shadow-2xl">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Xizmat nomini kiriting..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex-1">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as ServiceCategory | '')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Barcha xizmatlar</option>
                    <option value={ServiceCategory.TECHNICAL}>Texnik xizmat</option>
                    <option value={ServiceCategory.PARKING}>Parkovka</option>
                    <option value={ServiceCategory.GAS_STATION}>Yoqilg'i quyish</option>
                  </select>
                </div>
                <button
                  onClick={handleSearch}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Search className="w-5 h-5" />
                  <span>Qidirish</span>
                </button>
              </div>
              {location && (
                <div className="flex items-center justify-center mt-3 text-green-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">Sizning joylashuvingiz aniqlandi</span>
                </div>
              )}
              {locationError && (
                <div className="mt-3">
                  <button
                    onClick={getCurrentLocation}
                    className="text-sm text-blue-600 hover:text-blue-700 underline"
                  >
                    Joylashuvni aniqlash
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Xizmat turlari</h2>
            <p className="text-gray-600">Avtomobilingiz uchun kerakli xizmatni tanlang</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Link
                  key={category.id}
                  to={`/services?category=${category.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center group-hover:-translate-y-2">
                    <div className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <div className="flex items-center justify-center text-blue-600 group-hover:text-blue-700">
                      <span className="mr-2">Batafsil</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {location ? 'Sizga yaqin xizmatlar' : 'Mashhur xizmatlar'}
              </h2>
              <p className="text-gray-600">
                {location ? 'Joylashuvingizga asoslangan tavsiyalar' : 'Eng ko\'p ishlatiladigan xizmatlar'}
              </p>
            </div>
            <Link
              to="/services"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <span>Barchasini ko'rish</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}

          {!loading && services.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Hozircha xizmatlar mavjud emas</p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">1000+</div>
              <div className="text-gray-300">Xizmat provayderlar</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">50,000+</div>
              <div className="text-gray-300">Mamnun mijozlar</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">24/7</div>
              <div className="text-gray-300">Qo'llab-quvvatlash</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-400 mb-2">100+</div>
              <div className="text-gray-300">Shaharlar</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;