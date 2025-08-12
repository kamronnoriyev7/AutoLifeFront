import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Percent, Clock, Filter } from 'lucide-react';
import { Event, ServiceCategory } from '../types';
import { getEvents, getActiveEvents } from '../services/eventService';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import toast from 'react-hot-toast';

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active'>('active');
  const [categoryFilter, setCategoryFilter] = useState<ServiceCategory | ''>('');

  useEffect(() => {
    loadEvents();
  }, [filter]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const eventsData = filter === 'active' ? await getActiveEvents() : await getEvents();
      setEvents(eventsData);
    } catch (error) {
      toast.error('Tadbirlarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => 
    categoryFilter ? event.category === categoryFilter : true
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
        return 'Boshqa';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Aksiya va Tadbirlar</h1>
          <p className="text-gray-600">Eng so'nggi chegirmalar va maxsus takliflardan xabardor bo'ling</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-2" />
                Holat
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'active')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Faol tadbirlar</option>
                <option value="all">Barcha tadbirlar</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategoriya
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as ServiceCategory | '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Barcha kategoriyalar</option>
                <option value={ServiceCategory.TECHNICAL}>Texnik xizmat</option>
                <option value={ServiceCategory.PARKING}>Parkovka</option>
                <option value={ServiceCategory.GAS_STATION}>Yoqilg'i quyish</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  {event.discount && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                      <Percent className="w-4 h-4 mr-1" />
                      {event.discount}% chegirma
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {getCategoryName(event.category)}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>

                  <div className="space-y-2 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{formatDate(event.startDate)} - {formatDate(event.endDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-green-500" />
                      <span className={`text-sm font-medium ${event.isActive ? 'text-green-600' : 'text-red-600'}`}>
                        {event.isActive ? 'Faol' : 'Tugagan'}
                      </span>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Batafsil
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Tadbirlar topilmadi</h3>
            <p className="text-gray-500">Hozircha bu kategoriyada faol tadbirlar mavjud emas</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;