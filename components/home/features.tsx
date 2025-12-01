'use client';

import { Heart, Leaf, Clock, Shield } from 'lucide-react';

const features = [
  {
    icon: Heart,
    title: 'Beslenme Uzmanı Onaylı',
    description: 'Her öğün, profesyonel diyetisyenler tarafından özenle planlanır ve dengeli besin değerleri sağlar.',
    color: 'from-[#F28C8C] to-[#ff9999]'
  },
  {
    icon: Leaf,
    title: 'Taze ve Organik',
    description: 'Yerel çiftçilerden temin edilen organik malzemelerle her gün taze hazırlanır.',
    color: 'from-[#4A6B3C] to-[#5a7b4c]'
  },
  {
    icon: Clock,
    title: 'Zamanında Teslimat',
    description: 'Öğünleriniz her gün belirlediğiniz saatte kapınıza teslim edilir.',
    color: 'from-[#E6D5C3] to-[#d4c4b3]'
  },
  {
    icon: Shield,
    title: 'Hijyen Garantisi',
    description: 'ISO sertifikalı mutfaklarımızda en yüksek hijyen standartlarıyla üretim yapılır.',
    color: 'from-[#FFF8F0] to-[#ffe8d0]'
  }
];

export default function Features() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-[#FFF8F0] dark:from-dark-bg dark:to-[#1a1a1a] transition-colors duration-300">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 dark:text-white mb-4">
            Neden Pin25 Foods ?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Sağlıklı yaşam için ihtiyacınız olan her şey, bir paket içinde
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white dark:bg-dark-surface rounded-3xl p-8 shadow-lg dark:shadow-none dark:border dark:border-dark-border hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Icon Container */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Sağlıklı yaşam yolculuğunuza bugün başlayın
          </p>
          <a
            href="/paket-sec"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#4A6B3C] to-[#5a7b4c] text-white rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Paketleri İncele
          </a>
        </div>
      </div>
    </section>
  );
}
