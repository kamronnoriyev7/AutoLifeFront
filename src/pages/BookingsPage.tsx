import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Phone, Star, X, Eye } from 'lucide-react';
import { Booking, BookingStatus } from '../types';
import { getUserBookings, cancelBooking } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import toast from 'react-hot-toast';

const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const userBookings = await getUserBookings();
      setBookings(userBookings);
    } catch (error) {
      toast.error('Buyurtmalarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Buyurtmani bekor qilishni xohlaysizmi?')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      await cancelBooking(bookingId);
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: BookingStatus.CANCELLED }
          : booking
      ));
      toast.success('Buyurtma bekor qilindi');
    } catch (error) {
      toast.error('Buyurtmani bekor qilishda xatolik yuz berdi');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case BookingStatus.APPROVED:
        return 'bg-blue-100 text-blue-800';
      case BookingStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case BookingStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING:
        return 'Kutilmoqda';
      case BookingStatus.APPROVED:
        return 'Tasdiqlangan';
      case BookingStatus.COMPLETED:
        return 'Bajarilgan';
      case BookingStatus.CANCELLED:
        return 'Bekor qilingan';
      default:
        return 'Noma\'lum';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const canCancel = (booking: Booking) => {
    return booking.status === BookingStatus.PENDING || booking.status === BookingStatus.APPROVED;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Buyurtmalarim</h1>
          <p className="text-gray-600">Barcha buyurtmalaringizni bu yerda kuzatib boring</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Buyurtmalar mavjud emas</h2>
            <p className="text-gray-500 mb-6">
              Hali birorta xizmat band qilmagansiz. Xizmatlarni ko'rish va band qilish uchun pastdagi tugmani bosing.
            </p>
            <a
              href="/services"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Xizmatlarni ko'rish
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {booking.service.name}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {getStatusText(booking.status)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{booking.service.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(booking.bookingDate)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{booking.service.duration} daqiqa</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{booking.service.provider.address}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>{booking.service.provider.phoneNumber}</span>
                        </div>
                      </div>

                      {booking.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <strong>Eslatma:</strong> {booking.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="ml-6 text-right">
                      <div className="text-2xl font-bold text-blue-600 mb-2">
                        {booking.totalPrice.toLocaleString()} so'm
                      </div>
                      <div className="flex items-center space-x-1 text-yellow-500 mb-4">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm text-gray-600">{booking.service.rating}</span>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center space-x-1"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Batafsil</span>
                        </button>
                        
                        {canCancel(booking) && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={cancellingId === booking.id}
                            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors flex items-center space-x-1 disabled:opacity-50"
                          >
                            {cancellingId === booking.id ? (
                              <LoadingSpinner size="sm" />
                            ) : (
                              <>
                                <X className="w-4 h-4" />
                                <span>Bekor qilish</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      Yaratilgan: {formatDate(booking.createdAt)}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {booking.id}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Booking Detail Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Buyurtma tafsilotlari</h2>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Service Info */}
                  <div className="border-b pb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Xizmat ma'lumotlari</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Xizmat nomi:</span>
                        <p className="text-gray-900">{selectedBooking.service.name}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Kategoriya:</span>
                        <p className="text-gray-900">{selectedBooking.service.category}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Davomiyligi:</span>
                        <p className="text-gray-900">{selectedBooking.service.duration} daqiqa</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Narx:</span>
                        <p className="text-gray-900">{selectedBooking.service.price.toLocaleString()} so'm</p>
                      </div>
                    </div>
                  </div>

                  {/* Provider Info */}
                  <div className="border-b pb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Provayder ma'lumotlari</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Nomi:</span>
                        <p className="text-gray-900">{selectedBooking.service.provider.name}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Telefon:</span>
                        <p className="text-gray-900">{selectedBooking.service.provider.phoneNumber}</p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-sm font-medium text-gray-500">Manzil:</span>
                        <p className="text-gray-900">{selectedBooking.service.provider.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Booking Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Buyurtma ma'lumotlari</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Holati:</span>
                        <p className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBooking.status)}`}>
                          {getStatusText(selectedBooking.status)}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Buyurtma sanasi:</span>
                        <p className="text-gray-900">{formatDate(selectedBooking.bookingDate)}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Yaratilgan sana:</span>
                        <p className="text-gray-900">{formatDate(selectedBooking.createdAt)}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Jami narx:</span>
                        <p className="text-gray-900 font-semibold">{selectedBooking.totalPrice.toLocaleString()} so'm</p>
                      </div>
                    </div>

                    {selectedBooking.notes && (
                      <div className="mt-4">
                        <span className="text-sm font-medium text-gray-500">Eslatma:</span>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg mt-1">{selectedBooking.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Yopish
                  </button>
                  {canCancel(selectedBooking) && (
                    <button
                      onClick={() => {
                        handleCancelBooking(selectedBooking.id);
                        setSelectedBooking(null);
                      }}
                      className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Bekor qilish
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;