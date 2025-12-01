'use client';

import { UserPlus, Calendar, Truck, Utensils } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    number: '01',
    title: 'Kaydol',
    description: 'Hızlı ve kolay kayıt ile hesabınızı oluşturun, hedeflerinizi belirleyin.'
  },
  {
    icon: Calendar,
    number: '02',
    title: 'Paket Seç',
    description: 'Size uygun diyet programını ve paket süresini seçin.'
  },
  {
    icon: Truck,
    number: '03',
    title: 'Teslimat Al',
    description: 'Öğünleriniz her gün taze olarak kapınıza gelsin.'
  },
  {
    icon: Utensils,
    number: '04',
    title: 'Keyfini Çıkar',
    description: 'Lezzetli ve sağlıklı öğünlerinizin tadını çıkarın.'
  }
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4A6B3C]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F28C8C]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
            Nasıl Çalışır?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            4 basit adımda sağlıklı yaşama başlayın
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {/* Connecting Line (Desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-20 left-[60%] w-full h-0.5 bg-gradient-to-r from-[#4A6B3C] to-[#4A6B3C]/20"></div>
                )}

                {/* Card */}
                <div className="relative bg-gradient-to-br from-white to-[#FFF8F0] rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-[#E6D5C3]/30">
                  {/* Number Badge */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-[#4A6B3C] to-[#5a7b4c] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-[#4A6B3C] to-[#5a7b4c] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <a
            href="/paket-sec"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#F28C8C] to-[#ff9999] text-white rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Hemen Başla
          </a>
        </div>
      </div>
    </section>
  );
}
