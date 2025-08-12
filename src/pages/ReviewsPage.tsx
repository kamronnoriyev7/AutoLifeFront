import React, { useState, useEffect } from 'react';
import { Star, MessageCircle, ThumbsUp, Filter, Plus } from 'lucide-react';
import { Review } from '../types';
import { getUserReviews } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import toast from 'react-hot-toast';

const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'recent' | 'high' | 'low'>('all');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadReviews();
    }
  }, [user]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const userReviews = await getUserReviews();
      setReviews(userReviews);
    } catch (error) {
      toast.error('Sharhlarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter(review => {
    switch (filter) {
      case 'recent':
        return new Date(review.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      case 'high':
        return review.rating >= 4;
      case 'low':
        return review.rating <= 2;
      default:
        return true;
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Mening Sharhlarim</h1>
          <p className="text-gray-600">Siz qoldirgan barcha sharhlar va baholashlar</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{reviews.length}</div>
            <div className="text-gray-600">Jami sharhlar</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-yellow-500 mb-2">{getAverageRating()}</div>
            <div className="text-gray-600">O'rtacha baho</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {reviews.filter(r => r.rating >= 4).length}
            </div>
            <div className="text-gray-600">Ijobiy sharhlar</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Barcha sharhlar</option>
                <option value="recent">So'nggi 30 kun</option>
                <option value="high">Yuqori baho (4-5)</option>
                <option value="low">Past baho (1-2)</option>
              </select>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Yangi sharh</span>
            </button>
          </div>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredReviews.length > 0 ? (
          <div className="space-y-6">
            {filteredReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Xizmat ID: {review.serviceId}
                    </h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Sharh ID: {review.id}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-sm text-blue-600 hover:text-blue-700">
                      Tahrirlash
                    </button>
                    <button className="text-sm text-red-600 hover:text-red-700">
                      O'chirish
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Sharhlar topilmadi</h3>
            <p className="text-gray-500 mb-6">
              Siz hali birorta sharh qoldirmagansiz yoki tanlangan filtrga mos sharh yo'q
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Birinchi sharhni qoldiring
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;