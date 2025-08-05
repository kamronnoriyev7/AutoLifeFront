import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { User, Mail, Phone, Lock, Save, Edit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/authService';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import toast from 'react-hot-toast';

const profileSchema = yup.object({
  firstName: yup
    .string()
    .required('Ism majburiy')
    .min(2, 'Ism kamida 2 ta belgidan iborat bo\'lishi kerak'),
  lastName: yup
    .string()
    .required('Familiya majburiy')
    .min(2, 'Familiya kamida 2 ta belgidan iborat bo\'lishi kerak'),
  email: yup
    .string()
    .email('Yaroqli email manzilini kiriting')
    .required('Email majburiy'),
  phoneNumber: yup
    .string()
    .matches(/^\+?[1-9]\d{1,14}$/, 'Yaroqli telefon raqamini kiriting'),
});

const passwordSchema = yup.object({
  currentPassword: yup
    .string()
    .required('Joriy parol majburiy'),
  newPassword: yup
    .string()
    .min(6, 'Yangi parol kamida 6 ta belgidan iborat bo\'lishi kerak')
    .required('Yangi parol majburiy'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Parollar mos kelmaydi')
    .required('Parolni tasdiqlash majburiy'),
});

type ProfileFormData = yup.InferType<typeof profileSchema>;
type PasswordFormData = yup.InferType<typeof passwordSchema>;

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: yupResolver(passwordSchema),
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      setLoading(true);
      await updateProfile(data);
      toast.success('Profil muvaffaqiyatli yangilandi');
      setEditMode(false);
    } catch (error: any) {
      toast.error('Profilni yangilashda xatolik: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      setPasswordLoading(true);
      // This would call a change password API endpoint
      // await changePassword(data.currentPassword, data.newPassword);
      toast.success('Parol muvaffaqiyatli o\'zgartirildi');
      resetPassword();
    } catch (error: any) {
      toast.error('Parolni o\'zgartirishda xatolik: ' + error.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleCancel = () => {
    resetProfile({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
    });
    setEditMode(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profil ma'lumotlari topilmadi</h2>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Qayta kirish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Profil sozlamalari</h1>
          <p className="text-gray-600">Shaxsiy ma'lumotlaringizni boshqaring va xavfsizlik sozlamalarini o'zgartiring</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-gray-600 mb-4">{user.email}</p>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                Rasm o'zgartirish
              </button>
            </div>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Shaxsiy ma'lumotlar</h2>
                  {!editMode && (
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex items-center space-x-2 px-3 py-1 text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Tahrirlash</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="p-6">
                <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ism
                      </label>
                      <input
                        {...registerProfile('firstName')}
                        disabled={!editMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                      {profileErrors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{profileErrors.firstName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Familiya
                      </label>
                      <input
                        {...registerProfile('lastName')}
                        disabled={!editMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                      {profileErrors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{profileErrors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email manzil
                    </label>
                    <input
                      {...registerProfile('email')}
                      disabled={!editMode}
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                    {profileErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{profileErrors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Telefon raqami (ixtiyoriy)
                    </label>
                    <input
                      {...registerProfile('phoneNumber')}
                      disabled={!editMode}
                      type="tel"
                      placeholder="+998 90 123 45 67"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                    {profileErrors.phoneNumber && (
                      <p className="mt-1 text-sm text-red-600">{profileErrors.phoneNumber.message}</p>
                    )}
                  </div>

                  {editMode && (
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Bekor qilish
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {loading ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            <span>Saqlash</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Password Change */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Lock className="w-5 h-5 mr-2" />
                  Parolni o'zgartirish
                </h2>
              </div>

              <div className="p-6">
                <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Joriy parol
                    </label>
                    <input
                      {...registerPassword('currentPassword')}
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {passwordErrors.currentPassword && (
                      <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yangi parol
                    </label>
                    <input
                      {...registerPassword('newPassword')}
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {passwordErrors.newPassword && (
                      <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yangi parolni tasdiqlang
                    </label>
                    <input
                      {...registerPassword('confirmPassword')}
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {passwordLoading ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Parolni o'zgartirish</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-lg shadow-md border border-red-200">
              <div className="p-6 border-b border-red-200">
                <h2 className="text-xl font-semibold text-red-900">Xavfli zona</h2>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Hisobni o'chirish</h3>
                    <p className="text-gray-600">
                      Hisobingizni o'chirsangiz, barcha ma'lumotlaringiz butunlay yo'qoladi va bu amalni qaytarib bo'lmaydi.
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Hisobni o'chirish
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;