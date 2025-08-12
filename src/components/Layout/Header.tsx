import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
            <Car className="w-8 h-8" />
            <span className="text-xl font-bold">AutoLife</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Bosh sahifa
            </Link>
            <Link to="/services" className="text-gray-700 hover:text-blue-600 transition-colors">
              Xizmatlar
            </Link>
            <div className="relative group">
              <button className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-1">
                <span>Qo'shimcha</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link to="/events" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    Aksiya va tadbirlar
                  </Link>
                  <Link to="/blog" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    Blog va yangiliklar
                  </Link>
                  <Link to="/forum" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    Hamjamiyat forumi
                  </Link>
                  <Link to="/route-planner" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    Yo'nalish rejasi
                  </Link>
                  <Link to="/partnerships" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    Hamkorlik
                  </Link>
                  <Link to="/support" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    Yordam
                  </Link>
                </div>
              </div>
            </div>
            {user && (
              <Link to="/bookings" className="text-gray-700 hover:text-blue-600 transition-colors">
                Buyurtmalar
              </Link>
            )}
            {user && (
              <Link
                to="/reviews"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sharhlar
              </Link>
            )}
            
            <div className="pt-2 border-t border-gray-200">
              <Link
                to="/events"
                className="block text-gray-700 hover:text-blue-600 transition-colors mb-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Aksiya va tadbirlar
              </Link>
              <Link
                to="/blog"
                className="block text-gray-700 hover:text-blue-600 transition-colors mb-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog va yangiliklar
              </Link>
              <Link
                to="/forum"
                className="block text-gray-700 hover:text-blue-600 transition-colors mb-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Hamjamiyat forumi
              </Link>
              <Link
                to="/route-planner"
                className="block text-gray-700 hover:text-blue-600 transition-colors mb-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Yo'nalish rejasi
              </Link>
              <Link
                to="/partnerships"
                className="block text-gray-700 hover:text-blue-600 transition-colors mb-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Hamkorlik
              </Link>
              <Link
                to="/support"
                className="block text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Yordam
              </Link>
            </div>
            {user && (
              <Link to="/reviews" className="text-gray-700 hover:text-blue-600 transition-colors">
                Sharhlar
              </Link>
            )}
          </nav>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>{user.firstName}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Chiqish</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Kirish
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ro'yxatdan o'tish
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Bosh sahifa
              </Link>
              <Link
                to="/services"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Xizmatlar
              </Link>
              {user && (
                <Link
                  to="/bookings"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Buyurtmalar
                </Link>
              )}
              
              <div className="pt-4 border-t border-gray-200">
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors mb-4"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <span>{user.firstName}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Chiqish</span>
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-4">
                    <Link
                      to="/login"
                      className="text-gray-700 hover:text-blue-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Kirish
                    </Link>
                    <Link
                      to="/register"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Ro'yxatdan o'tish
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;