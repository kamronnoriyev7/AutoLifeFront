import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Car } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            <Car className="w-12 h-12 text-blue-600" />
            <span className="text-3xl font-bold text-gray-900">AutoLife</span>
          </div>
        </div>

        {/* 404 Error */}
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-9xl font-extrabold text-blue-600 opacity-50">404</h1>
            <div className="mt-4">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Sahifa topilmadi
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki ko'chirilgan bo'lishi mumkin.
              </p>
            </div>
          </div>

          {/* Illustration */}
          <div className="flex justify-center mb-8">
            <div className="w-64 h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Car className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-50" />
                <p className="text-blue-600 font-medium">Yo'l topilmadi</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              to="/"
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Home className="w-5 h-5 mr-2" />
              Bosh sahifaga qaytish
            </Link>

            <button
              onClick={() => window.history.back()}
              className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Orqaga qaytish
            </button>
          </div>

          {/* Popular Links */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Mashhur sahifalar
            </h3>
            <div className="space-y-2">
              <Link
                to="/services"
                className="block text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                Xizmatlar ro'yxati
              </Link>
              <Link
                to="/login"
                className="block text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                Tizimga kirish
              </Link>
              <Link
                to="/register"
                className="block text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                Ro'yxatdan o'tish
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Yordam kerakmi?{' '}
              <a
                href="mailto:support@autolife.uz"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                Biz bilan bog'laning
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;