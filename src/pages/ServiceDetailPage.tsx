import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Star, MapPin, Clock, Phone, Calendar, 
  Car, Fuel, ParkingCircle, ArrowLeft, 
  Share2, Heart 
} from 'lucide-react';
import { Service, ServiceCategory } from '../types';
import { getServiceById } from '../services/serviceService';
import { createBooking } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import toast from 'react-hot-toast';

const ServiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    if (id) {
      loadService(id);
    }
  }, [id]);

  const loadService = async (serviceId: string) => {
    try {
      setLoading(true);
      const serviceData = await getServiceById(serviceId);
      setService(serviceData);
    } catch (error) {
      toast.error('Xizmat ma\'lumotlarini yuklashda xatolik yuz berdi');
      navigate('/services');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: ServiceCategory) => {
    switch (category) {
      case ServiceCategory.TECHNICAL:
        return <Car className="w-6 h-6" />;
      case ServiceCategory.PARKING:
        return <ParkingCircle className="w-6 h-6" />;
      case ServiceCategory.GAS_STATION:
        return <Fuel className="w-6 h-6" />;
      default:
        return <Car className="w-6 h-6" />;
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

  const handleBooking = async () => {
    if (!user || !token) {
      toast.error('Xizmatni band qilish uchun tizimga kiring');
      navigate('/login');
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error('Sana va vaqtni tanlang');
      return;
    }

    try {
      setBookingLoading(true);
      const bookingDate = new Date(`${selectedDate} ${selectedTime}`).toISOString();
      
      await createBooking({
        serviceId: service!.id,
        bookingDate,
        notes: notes || undefined,
      });

      toast.success('Xizmat muvaffaqiyatli band qilindi!');
      navigate('/bookings');
    } catch (error) {
      toast.error('Xizmatni band qilishda xatolik yuz berdi');
    } finally {
      setBookingLoading(false);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour !== 18) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return slots;
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Xizmat topilmadi</h2>
          <button
            onClick={() => navigate('/services')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Orqaga qaytish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Orqaga</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Service Image */}
            <div className="relative mb-6">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-80 object-cover rounded-xl"
              />
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {getCategoryIcon(service.category)}
                  <span className="ml-2">{getCategoryName(service.category)}</span>
                </span>
              </div>
              <div className="absolute top-4 right-4 flex space-x-2">
                <button className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                  <Heart className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Service Info */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{service.name}</h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-medium text-gray-900">{service.rating}</span>
                  <span className="text-gray-500">({service.provider.rating} ta sharh)</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span>{service.duration} daqiqa</span>
                </div>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {service.description}
              </p>

              {/* Price */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Narx:</span>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-blue-600">
                      {service.price.toLocaleString()}
                    </span>
                    <span className="text-gray-500 ml-2">so'm</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Provider Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Xizmat provayderi</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{service.provider.name}</h3>
                  <div className="flex items-center space-x-1 text-yellow-500 mt-1">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-gray-900 font-medium">{service.provider.rating}</span>
                    <span className="text-gray-500">reytingi</span>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <span className="text-gray-700">{service.provider.address}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{service.provider.phoneNumber}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{service.provider.workingHours}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Xizmatni band qilish</h2>

              {service.isAvailable ? (
                <div className="space-y-4">
                  {/* Date Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sanani tanlang
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={getMinDate()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Time Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vaqtni tanlang
                    </label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Vaqtni tanlang</option>
                      {generateTimeSlots().map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Qo'shimcha eslatma (ixtiyoriy)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Qo'shimcha ma'lumot yozing..."
                    />
                  </div>

                  {/* Total Price */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Jami:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {service.price.toLocaleString()} so'm
                      </span>
                    </div>
                  </div>

                  {/* Book Button */}
                  <button
                    onClick={handleBooking}
                    disabled={bookingLoading || !selectedDate || !selectedTime}
                    className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                  >
                    {bookingLoading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <Calendar className="w-5 h-5" />
                        <span>Band qilish</span>
                      </>
                    )}
                  </button>

                  {!user && (
                    <p className="text-sm text-gray-500 text-center">
                      Xizmatni band qilish uchun{' '}
                      <button
                        onClick={() => navigate('/login')}
                        className="text-blue-600 hover:text-blue-700 underline"
                      >
                        tizimga kiring
                      </button>
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-red-600 font-medium mb-4">Xizmat hozirda mavjud emas</p>
                  <button
                    onClick={() => navigate('/services')}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Boshqa xizmatlarni ko'rish
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;