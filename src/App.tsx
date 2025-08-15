import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/Admin/Layout/AdminLayout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OTPVerifyPage from './pages/OTPVerifyPage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import BookingsPage from './pages/BookingsPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import EventsPage from './pages/EventsPage';
import ReviewsPage from './pages/ReviewsPage';
import BlogPage from './pages/BlogPage';
import ForumPage from './pages/ForumPage';
import RoutePlannerPage from './pages/RoutePlannerPage';
import PartnershipsPage from './pages/PartnershipsPage';
import SupportPage from './pages/SupportPage';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminUsers from './pages/Admin/AdminUsers';

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <Router>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              {/* Add more admin routes here */}
            </Route>

            {/* Public Routes */}
            <Route path="/*" element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/verify-otp" element={<OTPVerifyPage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/services/:id" element={<ServiceDetailPage />} />
                    <Route path="/events" element={<EventsPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/forum" element={<ForumPage />} />
                    <Route path="/route-planner" element={<RoutePlannerPage />} />
                    <Route path="/partnerships" element={<PartnershipsPage />} />
                    <Route path="/support" element={<SupportPage />} />
                    
                    {/* Protected Routes */}
                    <Route 
                      path="/bookings" 
                      element={
                        <ProtectedRoute>
                          <BookingsPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/profile" 
                      element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/reviews" 
                      element={
                        <ProtectedRoute>
                          <ReviewsPage />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* 404 Page */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            } />
          </Routes>
          
          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                style: {
                  background: '#10B981',
                },
              },
              error: {
                style: {
                  background: '#EF4444',
                },
              },
            }}
          />
        </Router>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;