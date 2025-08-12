import React, { useState } from 'react';
import { MessageCircle, Phone, Mail, HelpCircle, Search, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import toast from 'react-hot-toast';

const contactSchema = yup.object({
  name: yup
    .string()
    .required('Ism majburiy')
    .min(2, 'Ism kamida 2 ta belgidan iborat bo\'lishi kerak'),
  email: yup
    .string()
    .email('Yaroqli email manzilini kiriting')
    .required('Email majburiy'),
  subject: yup
    .string()
    .required('Mavzu majburiy'),
  message: yup
    .string()
    .required('Xabar majburiy')
    .min(10, 'Xabar kamida 10 ta belgidan iborat bo\'lishi kerak'),
});

type ContactFormData = yup.InferType<typeof contactSchema>;

const SupportPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: yupResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Xabaringiz muvaffaqiyatli yuborildi!');
      reset();
    } catch (error) {
      toast.error('Xabarni yuborishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      question: 'AutoLife platformasi qanday ishlaydi?',
      answer: 'AutoLife - bu avtomobil egalari uchun barcha zaruriy xizmatlarni bir joyda taqdim etuvchi platforma. Siz bizning saytimiz orqali texnik xizmat, parkovka va yoqilg\'i quyish xizmatlarini topib, band qilishingiz mumkin.',
    },
    {
      question: 'Ro\'yxatdan o\'tish bepulmi?',
      answer: 'Ha, AutoLife platformasida ro\'yxatdan o\'tish mutlaqo bepul. Siz faqat foydalanayotgan xizmatlar uchun to\'lov qilasiz.',
    },
    {
      question: 'Buyurtmani qanday bekor qilish mumkin?',
      answer: 'Buyurtmani bekor qilish uchun "Buyurtmalarim" bo\'limiga o\'ting va tegishli buyurtma yonidagi "Bekor qilish" tugmasini bosing. Buyurtma tasdiqlanmagan yoki bajarilmagan holda bo\'lsa, uni bekor qilish mumkin.',
    },
    {
      question: 'To\'lov qanday amalga oshiriladi?',
      answer: 'Biz turli to\'lov usullarini qo\'llab-quvvatlaymiz: bank kartalari, mobil to\'lovlar va naqd pul. Barcha to\'lovlar xavfsiz va shifrlangan tarzda amalga oshiriladi.',
    },
    {
      question: 'Xizmat sifati kafolatlanganmi?',
      answer: 'Ha, bizning platformamizdagi barcha xizmat provayderlari tekshirilgan va sertifikatlangan. Agar xizmat sifati sizni qoniqtirmasa, biz bilan bog\'laning.',
    },
    {
      question: 'Mobil ilova mavjudmi?',
      answer: 'Hozircha biz web versiyani taklif qilamiz, lekin tez orada Android va iOS uchun mobil ilovalar chiqariladi.',
    },
    {
      question: 'Qanday qilib xizmat provayderi bo\'lish mumkin?',
      answer: 'Xizmat provayderi bo\'lish uchun "Hamkorlik" bo\'limiga o\'ting va ariza to\'ldiring. Bizning jamoamiz siz bilan bog\'lanadi.',
    },
    {
      question: '24/7 qo\'llab-quvvatlash mavjudmi?',
      answer: 'Ha, biz 24/7 qo\'llab-quvvatlash xizmatini taklif qilamiz. Telefon, email yoki chat orqali biz bilan bog\'lanishingiz mumkin.',
    },
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const contactMethods = [
    {
      icon: Phone,
      title: 'Telefon',
      description: '24/7 qo\'llab-quvvatlash',
      contact: '+998 90 123 45 67',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Mail,
      title: 'Email',
      description: 'Bizga yozing',
      contact: 'support@autolife.uz',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Onlayn suhbat',
      contact: 'Chat boshlash',
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Yordam markazi</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sizga qanday yordam bera olamiz? Savollaringizga javob toping yoki biz bilan bog'laning
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactMethods.map((method, index) => {
            const IconComponent = method.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                <div className={`${method.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <IconComponent className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-gray-600 mb-3">{method.description}</p>
                <p className="text-blue-600 font-medium">{method.contact}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* FAQ Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tez-tez so'raladigan savollar</h2>
            
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Savollarni qidiring..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* FAQ List */}
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredFaqs.length === 0 && (
              <div className="text-center py-8">
                <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Savol topilmadi</h3>
                <p className="text-gray-500">Qidiruv shartlaringizni o'zgartirib ko'ring</p>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Biz bilan bog'laning</h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ismingiz
                  </label>
                  <input
                    {...register('name')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ismingizni kiriting"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    Mavzu
                  </label>
                  <select
                    {...register('subject')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Mavzuni tanlang</option>
                    <option value="technical">Texnik muammo</option>
                    <option value="billing">To'lov masalalari</option>
                    <option value="service">Xizmat sifati</option>
                    <option value="partnership">Hamkorlik</option>
                    <option value="other">Boshqa</option>
                  </select>
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xabar
                  </label>
                  <textarea
                    {...register('message')}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Xabaringizni yozing..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
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
                      <span>Xabar yuborish</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Additional Help */}
            <div className="mt-8 bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Qo'shimcha yordam</h3>
              <div className="space-y-2 text-blue-800">
                <p>📞 Telefon: +998 90 123 45 67</p>
                <p>📧 Email: support@autolife.uz</p>
                <p>🕒 Ish vaqti: 24/7</p>
                <p>📍 Manzil: Toshkent, O'zbekiston</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;