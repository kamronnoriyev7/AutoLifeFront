import React, { useState } from 'react';
import { MapPin, Navigation, Fuel, Clock, DollarSign, Route, Car } from 'lucide-react';
import { Location, RouteInfo } from '../types';
import { calculateRoute } from '../services/routeService';
import { useGeolocation } from '../hooks/useGeolocation';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import toast from 'react-hot-toast';

const RoutePlannerPage: React.FC = () => {
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [vehicleType, setVehicleType] = useState<'car' | 'truck' | 'motorcycle'>('car');
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const { location, getCurrentLocation } = useGeolocation();

  const handleCalculateRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!origin || !destination) {
      toast.error('Boshlang\'ich va yakuniy manzillarni kiriting');
      return;
    }

    try {
      setLoading(true);
      // In a real app, you would geocode the addresses to get coordinates
      const originCoords: Location = { latitude: 41.2995, longitude: 69.2401 }; // Tashkent
      const destinationCoords: Location = { latitude: 41.3775, longitude: 69.3406 }; // Example destination
      
      const route = await calculateRoute({
        origin: originCoords,
        destination: destinationCoords,
        vehicleType,
      });
      
      setRouteInfo(route);
      toast.success('Yo\'nalish muvaffaqiyatli hisoblandi');
    } catch (error) {
      toast.error('Yo\'nalishni hisoblashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const useCurrentLocation = () => {
    if (location) {
      setOrigin('Joriy joylashuv');
    } else {
      getCurrentLocation();
      toast.info('Joylashuv aniqlanmoqda...');
    }
  };

  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${meters} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours} soat ${mins} daqiqa`;
    }
    return `${mins} daqiqa`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Yo'nalish Rejalashtiruvchi</h1>
          <p className="text-gray-600">Eng qulay yo'lni toping, vaqt va yoqilg'i sarfini hisoblang</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Route Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Yo'nalish parametrlari</h2>
              
              <form onSubmit={handleCalculateRoute} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Boshlang'ich nuqta
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      placeholder="Manzilni kiriting..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <button
                      type="button"
                      onClick={useCurrentLocation}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      title="Joriy joylashuvni ishlatish"
                    >
                      <Navigation className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Yakuniy nuqta
                  </label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Manzilni kiriting..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Car className="w-4 h-4 inline mr-2" />
                    Transport turi
                  </label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="car">Avtomobil</option>
                    <option value="truck">Yuk mashinasi</option>
                    <option value="motorcycle">Mototsikl</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Route className="w-5 h-5" />
                      <span>Yo'nalishni hisoblash</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {routeInfo ? (
              <div className="space-y-6">
                {/* Route Summary */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Yo'nalish ma'lumotlari</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="bg-blue-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-3">
                        <Navigation className="w-8 h-8 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{formatDistance(routeInfo.distance)}</div>
                      <div className="text-sm text-gray-500">Masofa</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="bg-green-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-3">
                        <Clock className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{formatDuration(routeInfo.duration)}</div>
                      <div className="text-sm text-gray-500">Vaqt</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="bg-yellow-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-3">
                        <Fuel className="w-8 h-8 text-yellow-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{routeInfo.fuelCost.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Yoqilg'i (so'm)</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="bg-red-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-3">
                        <DollarSign className="w-8 h-8 text-red-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{routeInfo.totalCost.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Jami xarajat (so'm)</div>
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Xarajatlar tafsiloti</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                      <div className="flex items-center space-x-2">
                        <Fuel className="w-4 h-4 text-yellow-500" />
                        <span className="text-gray-700">Yoqilg'i xarajati</span>
                      </div>
                      <span className="font-medium text-gray-900">{routeInfo.fuelCost.toLocaleString()} so'm</span>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                      <div className="flex items-center space-x-2">
                        <Route className="w-4 h-4 text-blue-500" />
                        <span className="text-gray-700">Yo'l haqi</span>
                      </div>
                      <span className="font-medium text-gray-900">{routeInfo.tollCost.toLocaleString()} so'm</span>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 pt-4 border-t border-gray-300">
                      <span className="text-lg font-semibold text-gray-900">Jami xarajat</span>
                      <span className="text-lg font-bold text-blue-600">{routeInfo.totalCost.toLocaleString()} so'm</span>
                    </div>
                  </div>
                </div>

                {/* Map Placeholder */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Yo'nalish xaritasi</h3>
                  <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Xarita bu yerda ko'rsatiladi</p>
                      <p className="text-sm text-gray-400 mt-2">Google Maps yoki boshqa xarita xizmati integratsiyasi</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Route className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Yo'nalishni hisoblang</h3>
                <p className="text-gray-500">
                  Boshlang'ich va yakuniy nuqtalarni kiritib, yo'nalishni hisoblash tugmasini bosing
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutePlannerPage;