import React, { useState } from 'react';
import { Building, Mail, Phone, User, FileText, Send, CheckCircle } from 'lucide-react';
import { ServiceCategory } from '../types';
import { createPartnership } from '../services/partnershipService';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import toast from 'react-hot-toast';

const schema = yup.object({
  companyName: yup
    .string()
    .required('Kompaniya nomi majburiy')
    .min(2, 'Kompaniya nomi kamida 2 ta belgidan iborat bo\'lishi kerak'),
  contactPerson: yup
    .string()
    .required('Aloqa shaxsi majburiy')
    .min(2, 'Ism kamida 2 ta belgidan iborat bo\'lishi kerak'),
  email: yup
    .string()
    .email('Yaroqli email manzilini kiriting')
    .required('Email majburiy'),
  phone: yup
    .string()
    .required('Telefon raqami majburiy')
    .matches(/^\+?[1-9]\d{1,14}$/, 'Yaroqli telefon raqamini kiriting'),
  serviceType: yup
    .string()
    .required('Xizmat turini tanlang'),
  description: yup
    .string()
    .required('Tavsif majburiy')
    .min(50, 'Tavsif kamida 50 ta belgidan iborat bo\'lishi kerak'),
});

type FormData = yup.InferType<typeof schema>;

const PartnershipsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      await createPartnership(data);
      setSubmitted(true);
      reset();
      toast.success('Hamkorlik so\'rovi muvaffaqiyatli yuborildi!');
    } catch (error) {
      toast.error('Hamkorlik so\'rovini yuborishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    {
      title: 'Keng mijozlar bazasi',
      description: 'Minglab faol foydalanuvchilarga xizmat ko\'rsating',
      icon: '👥',
    },
    {
      title: 'Marketing yordami',
      description: 'Bizning platformamizda bepul reklama va ko\'rsatish',
      icon: '📢',
    },
    {
      title: 'Onlayn boshqaruv',
      description: 'Buyurtmalar va mijozlarni onlayn boshqaring',
      icon: '💻',
    },
    {
      title: 'To\'lov tizimi',
      description: 'Xavfsiz va tezkor to\'lov tizimi orqali pul olish',
      icon: '💳',
    },
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">So'rov yuborildi!</h2>
          <p className="text-gray-600 mb-6">
            Hamkorlik so'rovingiz muvaffaqiyatli yuborildi. Bizning jamoamiz tez orada siz bilan bog'lanadi.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Yangi so'rov yuborish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Bizning hamkorimiz bo'ling</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AutoLife platformasiga qo'shiling va avtomobil egalari uchun xizmat ko'rsatish orqali daromad oling
          </p>
        </div>

        {/* Benefits Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Hamkorlik afzalliklari</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Partnership Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Hamkorlik so'rovi</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building className="w-4 h-4 inline mr-2" />
                  Kompaniya nomi
                </label>
                <input
                  {...register('companyName')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Kompaniya nomini kiriting"
                />
                {errors.companyName && (
                  <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Aloqa shaxsi
                </label>
                <input
                  {...register('contactPerson')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ism va familiyangizni kiriting"
                />
                {errors.contactPerson && (
                  <p className="mt-1 text-sm text-red-600">{errors.contactPerson.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email manzil
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="email@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Telefon raqami
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+998 90 123 45 67"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xizmat turi
                </label>
                <select
                  {...register('serviceType')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Xizmat turini tanlang</option>
                  <option value={ServiceCategory.TECHNICAL}>Texnik xizmat</option>
                  <option value={ServiceCategory.PARKING}>Parkovka</option>
                  <option value={ServiceCategory.GAS_STATION}>Yoqilg'i quyish</option>
                  <option value="car_wash">Avtomobil yuvish</option>
                  <option value="insurance">Sug'urta</option>
                  <option value="car_sales">Avtomobil sotish</option>
                </select>
                {errors.serviceType && (
                  <p className="mt-1 text-sm text-red-600">{errors.serviceType.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Kompaniya haqida ma'lumot
                </label>
                <textarea
                  {...register('description')}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Kompaniyangiz va xizmatlaringiz haqida batafsil ma'lumot bering..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
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
                    <Send className="w-5 h-5" />
                    <span>So'rov yuborish</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Information Section */}
          <div className="space-y-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Hamkorlik jarayoni</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-medium text-blue-900">So'rov yuborish</h4>
                    <p className="text-blue-700 text-sm">Hamkorlik formasini to'ldiring va yuboring</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-medium text-blue-900">Ko'rib chiqish</h4>
                    <p className="text-blue-700 text-sm">Bizning jamoamiz so'rovingizni ko'rib chiqadi</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-medium text-blue-900">Bog'lanish</h4>
                    <p className="text-blue-700 text-sm">Siz bilan bog'lanib, batafsil ma'lumot beramiz</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <h4 className="font-medium text-blue-900">Hamkorlik boshlash</h4>
                    <p className="text-blue-700 text-sm">Platformaga qo'shilish va xizmat ko'rsatishni boshlash</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-900 mb-4">Bizning talablarimiz</h3>
              <ul className="space-y-2 text-green-800">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Rasmiy ro'yxatdan o'tgan biznes</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Sifatli xizmat ko'rsatish tajribasi</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Mijozlar bilan yaxshi munosabat</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Zamonaviy jihozlar va texnologiyalar</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Bog'lanish</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">+998 90 123 45 67</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">partnerships@autolife.uz</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnershipsPage;